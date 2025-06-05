import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import prisma from "@/app/lib/db";
import { checkr } from "@/app/lib/checkr";

export async function POST(request: NextRequest) {
  try {
    console.log("[Verify Status] Checking user verification status...");

    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    console.log("[Verify Status] Checking for user:", user.email);

    // First check if user has any completed background checks
    let completedBackgroundCheck = await prisma.background_checks.findFirst({
      where: {
        candidateEmail: user.email,
        status: { in: ["COMPLETED", "CLEAR"] }
      },
      orderBy: {
        completedAt: "desc"
      }
    });

    console.log("[Verify Status] Local completed check found:", !!completedBackgroundCheck);

    if (completedBackgroundCheck) {
      // User already has a completed check
      if (!user.isVerified) {
        await prisma.user.update({
          where: { id: user.id },
          data: { isVerified: true }
        });
        
        console.log("[Verify Status] User verification status updated to true");
        
        return NextResponse.json({
          success: true,
          message: "User verification status updated",
          isVerified: true,
          backgroundCheckId: completedBackgroundCheck.id
        });
      } else {
        return NextResponse.json({
          success: true,
          message: "User already verified",
          isVerified: true,
          backgroundCheckId: completedBackgroundCheck.id
        });
      }
    }

    // If no completed check found locally, check for pending ones and sync with Checkr
    const pendingCheck = await prisma.background_checks.findFirst({
      where: {
        candidateEmail: user.email,
        status: "PENDING"
      },
      orderBy: {
        createdAt: "desc"
      }
    });

    if (pendingCheck && pendingCheck.invitationId) {
      console.log("[Verify Status] Found pending check, syncing with Checkr...");
      
      try {
        // Check status with Checkr API
        const invitation = await checkr.getInvitation(pendingCheck.invitationId);
        console.log(`[Verify Status] Checkr invitation status: ${invitation.status}`);

        if (invitation.status === 'completed') {
          console.log("[Verify Status] Invitation completed, updating database...");
          
          // Update the background check as completed
          const updatedCheck = await prisma.background_checks.update({
            where: { id: pendingCheck.id },
            data: {
              status: "COMPLETED",
              checkrStatus: invitation.report?.result || "clear",
              reportId: invitation.report?.id || null,
              completedAt: new Date(),
              updatedAt: new Date()
            }
          });

          // Update user verification status
          await prisma.user.update({
            where: { id: user.id },
            data: { isVerified: true }
          });

          console.log("[Verify Status] Background check synced and user verified!");

          return NextResponse.json({
            success: true,
            message: "Background check completed and verified",
            isVerified: true,
            backgroundCheckId: updatedCheck.id,
            synced: true
          });
    } else {
          console.log(`[Verify Status] Invitation still ${invitation.status}`);
          return NextResponse.json({
            success: true,
            message: `Background check is ${invitation.status}`,
            isVerified: false,
            status: invitation.status
          });
        }
      } catch (checkrError) {
        console.error("[Verify Status] Error checking with Checkr:", checkrError);
        // Continue with local database result
      }
    }

      return NextResponse.json({
        success: true,
        message: "No completed background check found",
        isVerified: false
      });

  } catch (error) {
    console.error("[Verify Status] Error:", error);
    
    // If the table doesn't exist, return appropriate response
    if (error instanceof Error && error.message.includes("does not exist")) {
      console.log("[Verify Status] Background checks table does not exist yet - this is normal for first setup");
      return NextResponse.json({
        success: true,
        message: "Background check system not yet initialized",
        isVerified: false
      });
    }
    
    return NextResponse.json(
      { 
        error: "Failed to check verification status",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
} 