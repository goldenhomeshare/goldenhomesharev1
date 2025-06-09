import prisma from "@/app/lib/db";

export interface MessagingPermissionCheck {
  canMessage: boolean;
  reason?: string;
  needsApproval?: boolean;
}

export async function checkMessagingPermissions(userId: string): Promise<MessagingPermissionCheck> {
  try {
    console.log("[MessagingPermissions] Checking permissions for user:", userId);
    
    // Use raw SQL query to bypass TypeScript issues temporarily
    const userResult = await prisma.$queryRaw`
      SELECT "canMessage", "isVerified", "onboardingCompleted" 
      FROM "User" 
      WHERE "id" = ${userId}
    ` as Array<{
      canMessage: boolean;
      isVerified: boolean;
      onboardingCompleted: boolean;
    }>;

    const user = userResult[0];
    console.log("[MessagingPermissions] User data:", user);

    if (!user) {
      console.log("[MessagingPermissions] User not found");
      return {
        canMessage: false,
        reason: "User not found",
      };
    }

    if (!user.onboardingCompleted) {
      console.log("[MessagingPermissions] Onboarding not completed");
      return {
        canMessage: false,
        reason: "Please complete your profile setup before messaging",
      };
    }

    if (!user.canMessage) {
      console.log("[MessagingPermissions] canMessage is false");
      return {
        canMessage: false,
        reason: "Your account needs approval before you can send messages. This is based on your background check status.",
        needsApproval: true,
      };
    }

    console.log("[MessagingPermissions] All checks passed, allowing messaging");
    return {
      canMessage: true,
    };
  } catch (error) {
    console.error("Error checking messaging permissions:", error);
    return {
      canMessage: false,
      reason: "Unable to verify messaging permissions",
    };
  }
}

export async function getUserMessagingStatus(userId: string) {
  // Use raw SQL query to bypass TypeScript issues temporarily
  const userResult = await prisma.$queryRaw`
    SELECT "canMessage", "isVerified", "onboardingCompleted" 
    FROM "User" 
    WHERE "id" = ${userId}
  ` as Array<{
    canMessage: boolean;
    isVerified: boolean;
    onboardingCompleted: boolean;
  }>;

  return userResult[0] || null;
} 