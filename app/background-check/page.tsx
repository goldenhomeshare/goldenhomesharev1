import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { BackgroundCheckForm } from "@/app/test-checkr/components/BackgroundCheckForm";
import RefreshStatusButton from "@/app/components/RefreshStatusButton";
import { Shield, CheckCircle, Clock, AlertCircle, ArrowLeft, RefreshCw, Users, Zap, Mail, Phone, MessageCircle } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import prisma from "@/app/lib/db";

// Feature flag for Checkr API integration
const CHECKR_API_ENABLED = process.env.CHECKR_API_ENABLED === 'true';

async function checkAndUpdateUserVerificationStatus(userId: string, userEmail: string) {
  // Only check if Checkr API is enabled
  if (!CHECKR_API_ENABLED) {
    return false;
  }

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

  // If user is not verified and Checkr API is enabled, check if they have completed background checks
  if (!userWithStatus?.isVerified && CHECKR_API_ENABLED) {
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
          <div className="p-6 sm:p-8 bg-white text-center">
            <div className="space-y-4">
              <div className="flex justify-center">
                <Badge variant="default" className="bg-green-100 text-green-800 border-green-200 px-4 py-2">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Verified Member
                </Badge>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t">
                <div className="text-center">
                  <Shield className="w-6 h-6 text-primary mx-auto mb-2" />
                  <h3 className="font-semibold text-gray-900 text-sm">Secure</h3>
                  <p className="text-xs text-gray-600">Background verified</p>
                </div>
                <div className="text-center">
                  <Users className="w-6 h-6 text-primary mx-auto mb-2" />
                  <h3 className="font-semibold text-gray-900 text-sm">Trusted</h3>
                  <p className="text-xs text-gray-600">By the community</p>
                </div>
                <div className="text-center">
                  <MessageCircle className="w-6 h-6 text-primary mx-auto mb-2" />
                  <h3 className="font-semibold text-gray-900 text-sm">Connected</h3>
                  <p className="text-xs text-gray-600">Full messaging access</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Unverified users */}
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
            {CHECKR_API_ENABLED ? (
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
            ) : (
              /* Contact Information for Background Checks */
              <div className="space-y-6">
                <div className="text-center mb-8">
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    Contact Us for Background Verification
                  </h3>
                                     <p className="text-gray-600 max-w-2xl mx-auto">
                     We're currently processing background checks manually. Contact us and we'll send you a secure link to complete your verification.
                   </p>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  {/* Email Contact */}
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-xl p-6 text-center">
                    <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Mail className="w-6 h-6 text-white" />
                    </div>
                    <h4 className="font-semibold text-gray-900 mb-2">Email Us</h4>
                                         <p className="text-sm text-gray-600 mb-4">
                       Email us your details and we'll send you a secure verification link
                     </p>
                     <a 
                       href="mailto:support@goldenhomeshare.com?subject=Background Check Request&body=Hi, I'd like to start my background check process for Golden HomeShare. My details are:%0A%0AName: %0AEmail: %0APhone: %0A%0APlease send me a secure link to complete my background verification.%0A%0AThank you!"
                       className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                     >
                      <Mail className="w-4 h-4" />
                      support@goldenhomeshare.com
                    </a>
                  </div>

                  {/* Phone Contact */}
                  <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-xl p-6 text-center">
                    <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Phone className="w-6 h-6 text-white" />
                    </div>
                    <h4 className="font-semibold text-gray-900 mb-2">Call Us</h4>
                                         <p className="text-sm text-gray-600 mb-4">
                       Call us and we'll send you a secure verification link
                     </p>
                     <a 
                       href="tel:+1-816-433-2979"
                       className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
                     >
                       <Phone className="w-4 h-4" />
                       (816) 433-2979
                     </a>
                  </div>
                </div>

                
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
} 