import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { BackgroundCheckForm } from "@/app/test-checkr/components/BackgroundCheckForm";
import RefreshStatusButton from "@/app/components/RefreshStatusButton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, CheckCircle, Clock, AlertCircle, ArrowLeft, RefreshCw, Settings } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import prisma from "@/app/lib/db";
import { isBackgroundCheckPollingEnabled, isMessagingPollingEnabled } from "@/app/lib/polling-config";

async function checkAndUpdateUserVerificationStatus(userId: string, userEmail: string) {
  try {
    // Check if user has any completed background checks
    const backgroundCheckModel = prisma.backgroundCheck;
    
    if (!backgroundCheckModel) {
      console.error("Background check model not found");
      return false;
    }
    
    const completedBackgroundCheck = await backgroundCheckModel.findFirst({
      where: {
        candidateEmail: userEmail,
        status: { in: ["COMPLETED", "CLEAR"] }
      },
      orderBy: {
        completedAt: "desc"
      }
    });

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

export default async function BackgroundCheckPage() {
  const user = await getCurrentUser();
  
  if (!user) {
    redirect("/api/auth/login");
  }

  // Get user with background check status
  let userWithStatus = await prisma.user.findUnique({
    where: { id: user.id },
    select: {
      isVerified: true,
      userType: true,
    }
  });

  // If user is not verified, check if they have completed background checks
  if (!userWithStatus?.isVerified) {
    console.log("User not verified, checking for completed background checks...");
    const isNowVerified = await checkAndUpdateUserVerificationStatus(user.id, user.email);
    if (isNowVerified) {
      // Re-fetch user status after update
      userWithStatus = await prisma.user.findUnique({
        where: { id: user.id },
        select: {
          isVerified: true,
          userType: true,
        }
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
    
    // Default - not verified
    return {
      icon: Shield,
      title: "Complete Your Background Check",
      description: "Increase trust and credibility by completing your background verification through Checkr.",
      badge: { text: "Not Verified", variant: "outline" as const },
      color: "text-green-600",
      bgColor: "bg-green-50",
      borderColor: "border-green-200"
    };
  };

  const statusInfo = getStatusInfo();
  const IconComponent = statusInfo.icon;

  return (
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
            </div>
            {!userWithStatus?.isVerified && (
              <RefreshStatusButton />
            )}
          </div>
        </CardHeader>
      </Card>

      {/* Polling Configuration Status */}
      <Card className="mb-6 border-gray-200 bg-gray-50">
        <CardHeader>
          <div className="flex items-center gap-3">
            <Settings className="w-5 h-5 text-gray-600" />
            <div>
              <CardTitle className="text-lg text-gray-900">System Configuration</CardTitle>
              <p className="text-gray-600 text-sm">
                Current polling settings for different features.
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center justify-between p-3 border rounded-lg bg-white">
              <div>
                <p className="font-medium text-gray-900">Background Check Polling</p>
                <p className="text-sm text-gray-600">Automatic status updates</p>
              </div>
              <Badge variant={isBackgroundCheckPollingEnabled() ? "default" : "secondary"}>
                {isBackgroundCheckPollingEnabled() ? "Enabled" : "Disabled"}
              </Badge>
            </div>
            <div className="flex items-center justify-between p-3 border rounded-lg bg-white">
              <div>
                <p className="font-medium text-gray-900">Message Polling</p>
                <p className="text-sm text-gray-600">Unread message updates</p>
              </div>
              <Badge variant={isMessagingPollingEnabled() ? "default" : "secondary"}>
                {isMessagingPollingEnabled() ? "Enabled" : "Disabled"}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Status Check Section */}
      <Card className="mb-8 border-blue-200 bg-blue-50">
        <CardHeader>
          <CardTitle className="text-lg text-blue-900">Check Your Status Automatically</CardTitle>
          <p className="text-blue-700">
            View your current background check status automatically using your account email ({user.email}).
          </p>
        </CardHeader>
        <CardContent>
          <Link href="/my-background-check">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
              View My Status
            </Button>
          </Link>
        </CardContent>
      </Card>

      {/* Form Section */}
      {!userWithStatus?.isVerified && (
        <Card>
          <CardHeader>
            <CardTitle>Start Your Background Check</CardTitle>
            <p className="text-gray-600">
              We partner with Checkr to provide secure and reliable background verification. 
              Your information is encrypted and handled with the highest security standards.
            </p>
          </CardHeader>
          <CardContent>
            <BackgroundCheckForm 
              initialData={{
                firstName: user.firstName || '',
                middleName: '',
                lastName: user.lastName || '',
                email: user.email || '',
                phone: '',
                zipcode: '',
                workLocation: {
                  country: 'US',
                  state: '',
                  city: '',
                },
                package: 'basic_for_golden_homeshare',
              }}
            />
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
  );
} 