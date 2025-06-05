import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import prisma from "@/app/lib/db";
import { checkr } from "@/app/lib/checkr";
import { BackgroundCheckStatus } from "@prisma/client";

export async function POST(request: NextRequest) {
  try {
    console.log("[Status Sync] 🔄 Starting REAL background check status synchronization...");

    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    console.log("[Status Sync] 🔍 User info:");
    console.log("[Status Sync]   - User ID:", user.id);
    console.log("[Status Sync]   - User Email:", user.email);

    // Step 1: Check for existing background checks in our database
    const existingChecks = await prisma.background_checks.findMany({
      where: {
        OR: [
          { candidateUserId: user.id },
          { candidateEmail: user.email },
          { candidateEmail: user.email.toLowerCase() },
          { candidateEmail: user.email.toUpperCase() }
        ]
      },
      orderBy: { createdAt: "desc" }
    });

    console.log("[Status Sync] 📊 Found", existingChecks.length, "existing checks in database");

    // Always query Checkr as the source of truth - removed database-first logic
    console.log("[Status Sync] 🔍 Querying Checkr for real background check data...");

    try {
      // Search for background checks in Checkr by email
      console.log(`[Status Sync] Searching Checkr for user email: ${user.email}`);
      
      // Use comprehensive search method that properly queries Checkr API
      const checkrData = await checkr.getAllBackgroundDataByEmail(user.email!);
      
      console.log(`[Status Sync] Checkr search results:`, {
        candidates: checkrData.candidates.length,
        reports: checkrData.reports.length,
        invitations: checkrData.invitations.length
      });

      if (checkrData.candidates.length === 0) {
        console.log(`[Status Sync] No candidates found in Checkr for ${user.email}`);
        
        // No Checkr data found, clear verification and database records
        await prisma.user.update({
          where: { id: user.id },
          data: { isVerified: false }
        });
        
        if (existingChecks.length > 0) {
          await prisma.background_checks.deleteMany({
            where: {
              OR: [
                { candidateUserId: user.id },
                { candidateEmail: user.email }
              ]
            }
          });
        }
        
        return NextResponse.json({ 
          message: "No background checks found in Checkr",
          status: "none",
          isVerified: false
        });
      }

      // Check for actual reports first (these have the real background check status)
      if (checkrData.reports.length > 0) {
        const sortedReports = checkrData.reports.sort((a, b) => 
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
        
        const latestReport = sortedReports[0];
        const reportStatus = latestReport.status; // Processing status (complete, pending, etc.)
        const reportResult = latestReport.result; // Actual background check result (clear, consider, suspended)
        console.log(`[Status Sync] Found report - Status: ${reportStatus}, Result: ${reportResult}`);

        // Map Checkr RESULT to our database status (result is the actual pass/fail)
        let mappedStatus: any = 'PENDING';
        let isVerified = false;
        
        if (reportResult === 'clear') {
          mappedStatus = 'CLEAR';
          isVerified = true;
        } else if (reportResult === 'consider') {
          mappedStatus = 'CONSIDER';
          isVerified = false;
        } else if (reportResult === 'suspended' || reportResult === 'failed') {
          mappedStatus = 'FAILED';
          isVerified = false;
        } else if (reportStatus === 'pending' || !reportResult) {
          mappedStatus = 'PENDING';
          isVerified = false;
        }

        // Update user verification based on actual Checkr result
        await prisma.user.update({
          where: { id: user.id },
          data: { isVerified }
        });

        console.log(`[Status Sync] Updated user verification to ${isVerified} based on Checkr result: ${reportResult}`);

        return NextResponse.json({
          success: true,
          message: `Background check result from Checkr: ${reportResult}`,
          isVerified,
          status: mappedStatus,
          checkrStatus: reportStatus,
          checkrResult: reportResult,
          source: "checkr-report",
          reportId: latestReport.id
        });
      }

      // No reports found, check invitations for status
      if (checkrData.invitations.length > 0) {
        const sortedInvitations = checkrData.invitations.sort((a, b) => 
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
        
        const latestInvitation = sortedInvitations[0];
        const invitationStatus = latestInvitation.status; // Use actual Checkr invitation status directly
        console.log(`[Status Sync] Found invitation with direct Checkr status: ${invitationStatus}`);

        // Set verification to false since we only have invitations, not completed reports
        await prisma.user.update({
          where: { id: user.id },
          data: { isVerified: false }
        });

        if (invitationStatus === 'pending') {
          return NextResponse.json({
            message: "Background check invitation pending in Checkr",
            status: "pending",
            checkrStatus: invitationStatus,
            isVerified: false,
            source: "checkr-invitation"
          });
        } else if (invitationStatus === 'started') {
          return NextResponse.json({
            message: "Background check started in Checkr",
            status: "in_progress", 
            checkrStatus: invitationStatus,
            isVerified: false,
            source: "checkr-invitation"
          });
        } else if (invitationStatus === 'completed') {
          return NextResponse.json({
            message: "Background check form completed, report processing in Checkr",
            status: "in_progress",
            checkrStatus: invitationStatus, 
            isVerified: false,
            source: "checkr-invitation"
          });
        } else {
          return NextResponse.json({
            message: `Background check invitation status: ${invitationStatus}`,
            status: "unknown",
            checkrStatus: invitationStatus,
            isVerified: false,
            source: "checkr-invitation"
          });
        }
      }

      // No reports or invitations found
      console.log(`[Status Sync] No reports or invitations found in Checkr`);
      
      await prisma.user.update({
        where: { id: user.id },
        data: { isVerified: false }
      });
      
      return NextResponse.json({ 
        message: "No background check data found in Checkr",
        status: "none",
        isVerified: false,
        source: "checkr"
      });

    } catch (checkrError) {
      console.error("[Status Sync] ❌ Error querying Checkr:", checkrError);
      
      return NextResponse.json({
        success: false,
        message: "Error querying Checkr API",
        error: checkrError instanceof Error ? checkrError.message : "Unknown error"
      }, { status: 500 });
    }

  } catch (error) {
    console.error("[Status Sync] ❌ Error:", error);
    
    return NextResponse.json(
      { 
        error: "Failed to sync background check status",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
} 