import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { checkMessagingPermissions, getUserMessagingStatus } from "@/app/lib/messaging-permissions";

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    
    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const permissionCheck = await checkMessagingPermissions(user.id);
    const userStatus = await getUserMessagingStatus(user.id);

    return NextResponse.json({
      canMessage: permissionCheck.canMessage,
      reason: permissionCheck.reason,
      needsApproval: permissionCheck.needsApproval,
      isVerified: userStatus?.isVerified || false,
      onboardingCompleted: userStatus?.onboardingCompleted || false,
    });
  } catch (error) {
    console.error("Error checking messaging permissions:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
} 