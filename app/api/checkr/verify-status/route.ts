import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import prisma from "@/app/lib/db";

export async function POST(request: NextRequest) {
  try {
    console.log("[Verify Status] Checking user verification status...");

    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    console.log("[Verify Status] Checking for user:", user.email);

    // Check if user has any completed background checks
    const backgroundCheckModel = (prisma as any).background_checks;
    
    if (!backgroundCheckModel) {
      console.error("[Verify Status] Background check model not found");
      return NextResponse.json({
        success: false,
        message: "Background check model not available",
        isVerified: false
      });
    }
    
    const completedBackgroundCheck = await backgroundCheckModel.findFirst({
      where: {
        candidateEmail: user.email,
        status: { in: ["COMPLETED", "CLEAR"] }
      },
      orderBy: {
        completedAt: "desc"
      }
    });

    console.log("[Verify Status] Background check found:", !!completedBackgroundCheck);

    if (completedBackgroundCheck) {
      // Update user verification status if not already verified
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
    } else {
      return NextResponse.json({
        success: true,
        message: "No completed background check found",
        isVerified: false
      });
    }

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