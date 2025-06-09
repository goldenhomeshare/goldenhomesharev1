import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { checkMessagingPermissions, getUserMessagingStatus } from "@/app/lib/messaging-permissions";
import prisma from "@/app/lib/db";

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    
    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    // Get raw user data from database using raw SQL
    const rawUserResult = await prisma.$queryRaw`
      SELECT "id", "email", "firstName", "lastName", "canMessage", "isVerified", "onboardingCompleted", "userType"
      FROM "User" 
      WHERE "id" = ${user.id}
    ` as Array<{
      id: string;
      email: string;
      firstName: string;
      lastName: string;
      canMessage: boolean;
      isVerified: boolean;
      onboardingCompleted: boolean;
      userType: string;
    }>;

    const rawUserData = rawUserResult[0];

    // Get permission check result
    const permissionCheck = await checkMessagingPermissions(user.id);
    
    // Get user status
    const userStatus = await getUserMessagingStatus(user.id);

    return NextResponse.json({
      debug: {
        currentUser: user,
        rawUserData,
        permissionCheck,
        userStatus,
        timestamp: new Date().toISOString(),
      }
    });
  } catch (error) {
    console.error("Error in debug messaging status:", error);
    return NextResponse.json({ 
      error: "Internal server error", 
      details: error instanceof Error ? error.message : "Unknown error" 
    }, { status: 500 });
  }
} 