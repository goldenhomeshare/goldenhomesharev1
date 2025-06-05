import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import BackgroundCheckForm from "@/app/components/BackgroundCheckForm";
import RefreshStatusButton from "@/app/components/RefreshStatusButton";
import AutoStatusChecker from "@/app/components/AutoStatusChecker";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, CheckCircle, Clock, AlertCircle, ArrowLeft, RefreshCw } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import prisma from "@/app/lib/db";
import { checkr } from "@/app/lib/checkr";

async function checkAndUpdateUserVerificationStatus(userId: string, userEmail: string) {
  try {
    // First try to find by candidateUserId, then by candidateEmail
    let completedBackgroundCheck = await prisma.background_checks.findFirst({
      where: {
        candidateUserId: userId,
        status: { in: ["COMPLETED", "CLEAR"] }
      },
      orderBy: {
        completedAt: "desc"
      }
    });

    // If not found by user ID, try by email
    if (!completedBackgroundCheck) {
      completedBackgroundCheck = await prisma.background_checks.findFirst({
        where: {
          candidateEmail: userEmail,
          status: { in: ["COMPLETED", "CLEAR"] }
        },
        orderBy: {
          completedAt: "desc"
        }
      });

      // If found by email but candidateUserId is null, fix it
      if (completedBackgroundCheck && !completedBackgroundCheck.candidateUserId) {
        console.log(`Fixing candidateUserId for background check ${completedBackgroundCheck.id}`);
        await prisma.background_checks.update({
          where: { id: completedBackgroundCheck.id },
          data: { candidateUserId: userId }
        });
      }
    }

    if (completedBackgroundCheck) {
      // Update user verification status if not already verified
      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: { isVerified: true },
        select: { isVerified: true }
      });
      
      return updatedUser.isVerified;
    }
    
    return false;
  } catch (error) {
    console.error("Error checking background check status:", error);
    
    // If the table doesn't exist, just return false (user not verified)
    if (error instanceof Error && error.message.includes("does not exist")) {
      console.log("Background checks table does not exist yet - this is normal for first setup");
      return false;
    }
    
    return false;
  }
}

async function getExistingBackgroundCheck(userId: string, userEmail: string) {
  try {
    // First try to find by candidateUserId
    let existingCheck = await prisma.background_checks.findFirst({
      where: {
        candidateUserId: userId,
        status: { in: ["PENDING", "IN_PROGRESS", "COMPLETED", "CLEAR"] }
      },
      orderBy: {
        createdAt: "desc"
      }
    });

    // If not found by user ID, try by email
    if (!existingCheck) {
      existingCheck = await prisma.background_checks.findFirst({
        where: {
          candidateEmail: userEmail,
          status: { in: ["PENDING", "IN_PROGRESS", "COMPLETED", "CLEAR"] }
        },
        orderBy: {
          createdAt: "desc"
        }
      });

      // If found by email but candidateUserId is null, fix it
      if (existingCheck && !existingCheck.candidateUserId) {
        console.log(`Fixing candidateUserId for background check ${existingCheck.id}`);
        await prisma.background_checks.update({
          where: { id: existingCheck.id },
          data: { candidateUserId: userId }
        });
      }
    }

    return existingCheck;
  } catch (error) {
    console.error("Error finding existing background check:", error);
    return null;
  }
}

// Enhanced function to force sync with Checkr on page load for pending checks
async function forceCheckrSync(userId: string, userEmail: string) {
  try {
    // Check if CHECKR_API_KEY is available
    if (!process.env.CHECKR_API_KEY) {
      console.log("[Page Load] Checkr API key not configured, skipping sync");
      return false;
    }

    // Find pending background check
    const pendingCheck = await prisma.background_checks.findFirst({
      where: {
        OR: [
          { candidateUserId: userId },
          { candidateEmail: userEmail }
        ],
        status: "PENDING",
        invitationId: { not: null }
      },
      orderBy: { createdAt: "desc" }
    });

    if (pendingCheck?.invitationId) {
      console.log(`[Page Load] Found pending check ${pendingCheck.id}, syncing with Checkr...`);
      
      try {
        const invitation = await checkr.getInvitation(pendingCheck.invitationId);
        
        if (invitation.status === 'completed') {
          console.log(`[Page Load] Invitation completed! Updating status...`);
          
          // Update the background check
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

          // Update user verification
          await prisma.user.update({
            where: { id: userId },
            data: { isVerified: true }
          });

          console.log(`[Page Load] ✅ Background check synced and user verified!`);
          return true; // Indicates status was updated
        }
      } catch (checkrError) {
        console.error(`[Page Load] Error syncing with Checkr:`, checkrError);
        // Don't throw - continue with page render
      }
    }

    return false;
  } catch (error) {
    console.error("[Page Load] Error in forceCheckrSync:", error);
    // Don't throw - continue with page render
    return false;
  }
}

export default async function BackgroundCheckPage() {
  const user = await getCurrentUser();
  
  if (!user) {
    redirect("/api/auth/login");
  }

  // Get user and background check data in parallel for better performance
  let [userWithStatus, existingBackgroundCheck] = await Promise.all([
    prisma.user.findUnique({
      where: { id: user.id },
      select: {
        isVerified: true,
        userType: true,
      }
    }),
    getExistingBackgroundCheck(user.id, user.email)
  ]);

  // If user is not verified but has a completed background check, update their status
  if (!userWithStatus?.isVerified && existingBackgroundCheck) {
    if (existingBackgroundCheck.status === "COMPLETED" || existingBackgroundCheck.status === "CLEAR") {
      console.log("[Page Load] Found completed background check, updating user verification...");
      await prisma.user.update({
        where: { id: user.id },
        data: { isVerified: true }
      });
      
      // Refresh user status
      userWithStatus = await prisma.user.findUnique({
        where: { id: user.id },
        select: { isVerified: true, userType: true }
      });
    }
  }

  const isHomeowner = userWithStatus?.userType === "HOMEOWNER";
  const dashboardPath = isHomeowner ? "/homeowner/dashboard" : "/housemate/dashboard";

  const getStatusInfo = () => {
    if (userWithStatus?.isVerified) {
      return {
        icon: CheckCircle,
        title: "Background Check Complete",
        description: "Your background check has been successfully verified. You can now enjoy increased trust on the platform.",
        badge: { text: "Verified", variant: "default" as const },
        color: "text-green-600",
        bgColor: "bg-green-50",
        borderColor: "border-green-200"
      };
    }
    
    if (existingBackgroundCheck) {
      if (existingBackgroundCheck.status === "PENDING" || existingBackgroundCheck.status === "IN_PROGRESS") {
        return {
          icon: Clock,
          title: "Background Check In Progress",
          description: "Your background check is being processed. We're automatically checking for updates...",
          badge: { text: "In Progress", variant: "outline" as const },
          color: "text-yellow-600",
          bgColor: "bg-yellow-50",
          borderColor: "border-yellow-200"
        };
      }
    }
    
    // Default - not verified and no background check
    return {
      icon: Shield,
      title: "Complete Your Background Check",
      description: "Increase trust and credibility by completing your background verification through Checkr.",
      badge: { text: "Not Started", variant: "outline" as const },
      color: "text-green-600",
      bgColor: "bg-green-50",
      borderColor: "border-green-200"
    };
  };

  const statusInfo = getStatusInfo();
  const IconComponent = statusInfo.icon;

  // Show the form if user doesn't have a background check in progress
  // Allow anyone to initiate a new background check, even if already verified
  const showForm = !existingBackgroundCheck || 
                   existingBackgroundCheck.status === "FAILED" || 
                   existingBackgroundCheck.status === "COMPLETED" || 
                   existingBackgroundCheck.status === "CLEAR";

  // Debug logging
  console.log("[Background Check Page] Debug info:", {
    userId: user.id,
    userEmail: user.email,
    isVerified: userWithStatus?.isVerified,
    hasExistingCheck: !!existingBackgroundCheck,
    existingCheckStatus: existingBackgroundCheck?.status,
    showForm,
    autoStatusCheckerProps: {
      hasExistingCheck: !!existingBackgroundCheck && existingBackgroundCheck.status === "PENDING",
      isVerified: !!userWithStatus?.isVerified
    }
  });

  return (
    <>
      {/* Auto Status Checker - runs in background to poll for updates */}
      <AutoStatusChecker 
        hasExistingCheck={!!existingBackgroundCheck && existingBackgroundCheck.status === "PENDING"}
        isVerified={!!userWithStatus?.isVerified}
      />
      
      <div className="max-w-4xl mx-auto px-4 md:px-8 py-8">
        {/* Back button */}
        <Link 
          href={dashboardPath}
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Link>

        {/* Status Card */}
        <Card className={`mb-8 ${statusInfo.borderColor} ${statusInfo.bgColor}`}>
          <CardHeader>
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-full bg-white`}>
                <IconComponent className={`w-8 h-8 ${statusInfo.color}`} />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <CardTitle className="text-xl">{statusInfo.title}</CardTitle>
                  <Badge variant={statusInfo.badge.variant}>
                    {statusInfo.badge.text}
                  </Badge>
                </div>
                <p className="text-gray-600">
                  {statusInfo.description}
                </p>
                {existingBackgroundCheck && existingBackgroundCheck.status === "PENDING" && (
                  <p className="text-sm text-gray-500 mt-2">
                    Started: {new Date(existingBackgroundCheck.createdAt).toLocaleDateString()}
                  </p>
                )}
              </div>
              <RefreshStatusButton />
            </div>
          </CardHeader>
        </Card>

        {/* Form Section */}
        {showForm && (
          <Card>
            <CardHeader>
              <CardTitle>
                {userWithStatus?.isVerified 
                  ? "Initiate New Background Check" 
                  : "Start Your Background Check"
                }
              </CardTitle>
              <p className="text-gray-600">
                {userWithStatus?.isVerified 
                  ? "You can initiate a new background check at any time. This will create a fresh verification through Checkr."
                  : "We partner with Checkr to provide secure and reliable background verification. Your information is encrypted and handled with the highest security standards."
                }
              </p>
              {userWithStatus?.isVerified && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mt-3">
                  <p className="text-sm text-blue-800">
                    <strong>Note:</strong> You are already verified, but you can start a new background check if needed. 
                    Use the button below to start a new check rather than the "Check Status" button above.
                  </p>
                </div>
              )}
            </CardHeader>
            <CardContent>
              <BackgroundCheckForm />
            </CardContent>
          </Card>
        )}

        {/* Additional Information */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="text-lg">About Our Background Check Process</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">What We Check:</h4>
              <ul className="space-y-1 text-sm text-gray-600">
                <li>• Global Watchlist Search</li>
                <li>• National Criminal Search (Standard)</li>
                <li>• Sex Offender Search</li>
                <li>• SSN Trace</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Processing Time:</h4>
              <p className="text-sm text-gray-600">
                Most background checks are completed within 24-48 hours. Complex cases may take up to 5 business days.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Privacy & Security:</h4>
              <p className="text-sm text-gray-600">
                All personal information is encrypted and securely processed by Checkr, our trusted background check partner. 
                We never store sensitive information like SSN on our servers.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
} 