import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import prisma from "@/app/lib/db";
import { checkr } from "@/app/lib/checkr";

export async function POST(request: NextRequest) {
  try {
    console.log("[Poll Status] 🔄 Starting enhanced status polling...");

    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    console.log("[Poll Status] Checking for user:", user.email);

    // Find all pending/in-progress background checks for this user
    const pendingChecks = await prisma.background_checks.findMany({
      where: {
        OR: [
          { candidateUserId: user.id },
          { candidateEmail: user.email }
        ],
        status: { in: ["PENDING", "IN_PROGRESS"] },
        invitationId: { not: null }
      },
      orderBy: { createdAt: "desc" }
    });

    if (pendingChecks.length === 0) {
      // Check if user already has completed checks
      const completedCheck = await prisma.background_checks.findFirst({
        where: {
          OR: [
            { candidateUserId: user.id },
            { candidateEmail: user.email }
          ],
          status: { in: ["COMPLETED", "CLEAR"] }
        },
        orderBy: { completedAt: "desc" }
      });

      if (completedCheck) {
        // User already has completed check, update user verification if needed
        const currentUser = await prisma.user.findUnique({
          where: { id: user.id },
          select: { isVerified: true }
        });

        if (!currentUser?.isVerified) {
          await prisma.user.update({
            where: { id: user.id },
            data: { isVerified: true }
          });

          return NextResponse.json({
            success: true,
            message: "User verification status updated",
            isVerified: true,
            statusChanged: true
          });
        }

        return NextResponse.json({
          success: true,
          message: "User already verified",
          isVerified: true,
          statusChanged: false
        });
      }

      return NextResponse.json({
        success: true,
        message: "No pending background checks found",
        isVerified: false,
        statusChanged: false
      });
    }

    console.log(`[Poll Status] Found ${pendingChecks.length} pending check(s) to verify`);

    let statusChanged = false;
    let userNowVerified = false;

    // Check each pending background check
    for (const check of pendingChecks) {
      try {
        if (!check.invitationId) {
          console.log(`[Poll Status] Skipping check ${check.id} - no invitation ID`);
          continue;
        }

        console.log(`[Poll Status] Checking invitation: ${check.invitationId}`);

        const invitation = await checkr.getInvitation(check.invitationId);
        console.log(`[Poll Status] Checkr status: ${invitation.status}`);

        if (invitation.status === 'completed') {
          console.log(`[Poll Status] ✅ Invitation completed! Updating database...`);

          // Update background check
          const updateData: any = {
            status: "COMPLETED",
            checkrStatus: invitation.report?.result || "clear",
            reportId: invitation.report?.id || null,
            completedAt: new Date(),
            updatedAt: new Date()
          };

          await prisma.background_checks.update({
            where: { id: check.id },
            data: updateData
          });

          // Update user verification
          await prisma.user.update({
            where: { id: user.id },
            data: { isVerified: true }
          });

          statusChanged = true;
          userNowVerified = true;

          console.log(`[Poll Status] ✅ Background check completed and user verified!`);
          break; // Exit loop after first successful completion

        } else if (invitation.status === 'cancelled' || invitation.status === 'expired') {
          console.log(`[Poll Status] ⚠️ Invitation ${invitation.status}, updating status...`);

          await prisma.background_checks.update({
            where: { id: check.id },
            data: {
              status: invitation.status === 'cancelled' ? 'DECLINED' : 'EXPIRED',
              checkrStatus: invitation.status,
              updatedAt: new Date()
            }
          });

          statusChanged = true;
        }

      } catch (checkError) {
        console.error(`[Poll Status] ❌ Error checking invitation ${check.invitationId}:`, checkError);
        // Continue with next check
      }
    }

    return NextResponse.json({
      success: true,
      message: statusChanged 
        ? (userNowVerified ? "Background check completed!" : "Status updated")
        : "Status unchanged",
      isVerified: userNowVerified,
      statusChanged: statusChanged,
      checksProcessed: pendingChecks.length
    });

  } catch (error) {
    console.error("[Poll Status] ❌ Error:", error);
    
    return NextResponse.json(
      { 
        error: "Failed to poll background check status",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
} 