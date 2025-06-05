import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { backgroundCheckService } from "@/app/lib/background-check-service";
import { checkr } from "@/app/lib/checkr";

export async function GET() {
  try {
    console.log("[Checkr Status] Fetching background check status...");

    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    console.log(`[Checkr Status] Getting status for user: ${user.id} (${user.email})`);

    // Get user verification status and latest background check
    const { isVerified, latestBackgroundCheck } = await backgroundCheckService.getUserVerificationStatus(user.id);

    // Check user validation for new background checks
    const validation = await backgroundCheckService.validateUserForBackgroundCheck(user.id);

    // Get environment information
    const environment = checkr.getEnvironment();

    console.log(`[Checkr Status] User verified: ${isVerified}, latest check: ${latestBackgroundCheck?.status || 'none'}`);

    return NextResponse.json({
      success: true,
      isVerified,
      latestBackgroundCheck: latestBackgroundCheck ? {
        id: latestBackgroundCheck.id,
        candidateId: latestBackgroundCheck.candidateId,
        invitationId: latestBackgroundCheck.invitationId,
        status: latestBackgroundCheck.status,
        checkrStatus: latestBackgroundCheck.checkrStatus,
        invitationUrl: latestBackgroundCheck.invitationUrl,
        invitationStatus: latestBackgroundCheck.invitationStatus,
        packageName: latestBackgroundCheck.packageName,
        completedAt: latestBackgroundCheck.completedAt,
        createdAt: latestBackgroundCheck.createdAt,
      } : null,
      userValidation: {
        isValid: validation.isValid,
        missingFields: validation.missingFields,
      },
      environment: {
        checkr: environment,
        hasRequiredFields: {
          firstName: !!user.firstName,
          lastName: !!user.lastName,
          email: !!user.email,
        },
        apiConfiguration: {
          hasCheckrApiKey: !!process.env.CHECKR_API_KEY,
          checkrApiKeyLength: process.env.CHECKR_API_KEY?.length || 0,
          hasWebhookSecret: !!process.env.CHECKR_WEBHOOK_SECRET,
          hasDatabaseUrl: !!process.env.DATABASE_URL,
          nodeEnv: process.env.NODE_ENV,
        }
      },
      // Additional helpful information
      canInitiateNewCheck: validation.isValid && !isVerified && (!latestBackgroundCheck || !['PENDING', 'IN_PROGRESS'].includes(latestBackgroundCheck.status)),
    });
    
  } catch (error) {
    console.error("[Checkr Status] Error getting background check status:", error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
      details: process.env.NODE_ENV === 'development' 
        ? (error instanceof Error ? error.stack : undefined)
        : undefined
    }, { status: 500 });
  }
} 