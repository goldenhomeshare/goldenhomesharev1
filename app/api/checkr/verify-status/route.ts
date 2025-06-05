import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { backgroundCheckService } from "@/app/lib/background-check-service";

export async function GET() {
  try {
    console.log("[Checkr Verify Status] Checking user verification status...");

    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ 
        isVerified: false, 
        error: "Not authenticated" 
      }, { status: 401 });
    }

    const { isVerified, latestBackgroundCheck } = await backgroundCheckService.getUserVerificationStatus(user.id);

    console.log(`[Checkr Verify Status] User ${user.id} verified: ${isVerified}`);

    return NextResponse.json({
      isVerified,
      userId: user.id,
      backgroundCheck: latestBackgroundCheck ? {
        status: latestBackgroundCheck.status,
        completedAt: latestBackgroundCheck.completedAt,
        createdAt: latestBackgroundCheck.createdAt,
      } : null,
    });

  } catch (error) {
    console.error("[Checkr Verify Status] Error checking verification status:", error);
    return NextResponse.json({
      isVerified: false,
      error: "Failed to check verification status",
    }, { status: 500 });
  }
} 