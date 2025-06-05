import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import prisma from "@/app/lib/db";
import { checkr } from "@/app/lib/checkr";

export async function POST(request: NextRequest) {
  try {
    console.log("[Sync API] 🔄 Starting background check sync...");

    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { email, forceSync = false } = body;

    // Determine which checks to sync
    const targetEmail = email || user.email;
    console.log(`[Sync API] 🎯 Targeting email: ${targetEmail}`);

    // Get background checks to sync
    const whereClause: any = { candidateEmail: targetEmail };
    
    if (!forceSync) {
      whereClause.status = { in: ['PENDING', 'IN_PROGRESS'] };
    }

    const backgroundChecks = await prisma.background_checks.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' }
    });

    if (backgroundChecks.length === 0) {
      return NextResponse.json({
        success: true,
        message: "No background checks found to sync",
        synced: 0,
        errors: 0
      });
    }

    console.log(`[Sync API] 📋 Found ${backgroundChecks.length} check(s) to sync`);

    let syncedCount = 0;
    let errorCount = 0;
    const results = [];

    for (const check of backgroundChecks) {
      try {
        if (!check.invitationId) {
          results.push({
            id: check.id,
            status: 'skipped',
            message: 'No invitation ID'
          });
          continue;
        }

        console.log(`[Sync API] 📡 Syncing invitation ${check.invitationId}...`);

        // Get invitation status from Checkr
        const invitation = await checkr.getInvitation(check.invitationId);
        console.log(`[Sync API] 📊 Checkr status: ${invitation.status}`);

        let shouldUpdate = false;
        let updateData: any = {};

        if (invitation.status === 'completed') {
          if (check.status !== 'COMPLETED') {
            shouldUpdate = true;
            updateData = {
              status: 'COMPLETED',
              checkrStatus: 'clear',
              completedAt: new Date(),
              updatedAt: new Date()
            };

            // Get report details if available
            if (invitation.report) {
              try {
                const report = await checkr.getReport(invitation.report.id);
                updateData.checkrStatus = report.result || 'clear';
                updateData.reportId = report.id;
                
                if (report.completed_at) {
                  updateData.completedAt = new Date(report.completed_at);
                }
              } catch (reportError) {
                console.warn(`[Sync API] ⚠️ Could not get report details: ${reportError}`);
              }
            }
          }
        } else if (invitation.status === 'cancelled' || invitation.status === 'expired') {
          if (check.status === 'PENDING') {
            shouldUpdate = true;
            updateData = {
              status: invitation.status === 'cancelled' ? 'DECLINED' : 'EXPIRED',
              checkrStatus: invitation.status,
              updatedAt: new Date()
            };
          }
        }

        if (shouldUpdate) {
          // Update background check
          const updatedCheck = await prisma.background_checks.update({
            where: { id: check.id },
            data: updateData
          });

          // Update user verification if completed
          if (updateData.status === 'COMPLETED' && check.candidateUserId) {
            await prisma.user.update({
              where: { id: check.candidateUserId },
              data: { isVerified: true }
            });
          }

          syncedCount++;
          results.push({
            id: check.id,
            status: 'synced',
            oldStatus: check.status,
            newStatus: updateData.status,
            checkrStatus: updateData.checkrStatus
          });

          console.log(`[Sync API] ✅ Synced: ${check.status} → ${updateData.status}`);
        } else {
          results.push({
            id: check.id,
            status: 'up-to-date',
            currentStatus: check.status
          });
        }

      } catch (error) {
        errorCount++;
        results.push({
          id: check.id,
          status: 'error',
          message: error instanceof Error ? error.message : 'Unknown error'
        });

        console.error(`[Sync API] ❌ Error syncing check ${check.id}:`, error);
      }
    }

    console.log(`[Sync API] ✅ Sync complete. Synced: ${syncedCount}, Errors: ${errorCount}`);

    return NextResponse.json({
      success: true,
      message: `Sync completed. ${syncedCount} updated, ${errorCount} errors.`,
      synced: syncedCount,
      errors: errorCount,
      results: results
    });

  } catch (error) {
    console.error("[Sync API] ❌ Error:", error);
    
    return NextResponse.json(
      { 
        error: "Failed to sync background check status",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
} 