import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { BackgroundCheckForm } from "@/app/test-checkr/components/BackgroundCheckForm";
import RefreshStatusButton from "@/app/components/RefreshStatusButton";
import { Shield, CheckCircle, Clock, AlertCircle, ArrowLeft, RefreshCw, Users, Zap } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import prisma from "@/app/lib/db";

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

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
      {/* Back button - Mobile Optimized */}
      <Link 
        href={dashboardPath}
        className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 sm:mb-6 transition-colors text-sm sm:text-base"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Dashboard
      </Link>

      {/* Main Status Card - Only show for verified users - Mobile Optimized */}
      {userWithStatus?.isVerified && (
        <div className="shadow-lg border-0 rounded-xl sm:rounded-2xl overflow-hidden mb-6 sm:mb-8">
          {/* Header */}
          <div className="bg-gradient-to-r from-primary/5 to-primary/10 border-b border-gray-100 rounded-t-xl sm:rounded-t-2xl p-6 sm:p-8 text-center">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-6 h-6 sm:w-10 sm:h-10 text-primary" />
            </div>
            <h1 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-2">
              Background Check Complete
            </h1>
            <p className="text-sm sm:text-base text-gray-600 px-2">
              Your background verification is complete. You now have full access to messaging and all platform features.
            </p>
          </div>
          
          {/* Content */}
          <div className="p-6 sm:p-8 bg-white rounded-b-xl sm:rounded-b-2xl">
            <div className="bg-primary/5 border border-primary/20 rounded-xl sm:rounded-2xl p-4 sm:p-6 text-center">
              <Badge variant="default" className="mb-3 sm:mb-4">
                Verified
              </Badge>
              <p className="text-sm sm:text-base text-gray-700 mb-4 px-2">
                <span className="font-semibold">Congratulations!</span>
                <br />
                You can now connect directly with homeowners and access all platform features.
              </p>
              <Link
                href={dashboardPath}
                className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl font-semibold transition-all duration-200 text-sm sm:text-base w-full sm:w-auto justify-center"
              >
                Return to Dashboard
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Enhanced Background Check Form - Mobile Optimized */}
      {!userWithStatus?.isVerified && (
        <div className="shadow-xl border-0 rounded-xl sm:rounded-2xl overflow-hidden mb-6 sm:mb-8 bg-white">
          <div className="bg-gradient-to-br from-primary/8 via-primary/5 to-primary/3 border-b border-primary/10 p-6 sm:p-8 lg:p-10 text-center relative">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent"></div>
            <div className="relative z-10">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white shadow-lg rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 border border-primary/20">
                <Shield className="w-8 h-8 sm:w-12 sm:h-12 text-primary" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 sm:mb-3 px-2">
                Background Verification
              </h1>
              <p className="text-base sm:text-lg text-gray-700 max-w-2xl mx-auto leading-relaxed px-2">
                Complete your secure background check to unlock full platform access and build trust with homeowners
              </p>
              <div className="mt-4 sm:mt-6 inline-flex items-center gap-2 bg-primary/10 text-primary px-3 sm:px-4 py-2 rounded-full text-sm font-medium">
                <Zap className="w-4 h-4" />
                Often completed in just 15 minutes
              </div>
            </div>
          </div>
          <div className="p-6 sm:p-8 lg:p-10 bg-white">
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
          </div>
        </div>
      )}
    </div>
  );
} 