import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { User, Shield, Clock, CheckCircle2, ArrowRight } from "lucide-react";
import prisma from "@/app/lib/db";
import { AirbnbStyleRow } from "@/app/components/AirbnbStyleRow";

export default async function HousemateDashboardPage() {
  const user = await getCurrentUser();
  
  if (!user) {
    redirect("/api/auth/login");
  }
  
  const userType = (user as any).userType;
  
  if (userType !== "HOUSEMATE") {
    redirect("/onboarding");
  }

  // Get user with background check status
  const userWithStatus = await prisma.user.findUnique({
    where: { id: user.id },
    select: {
      isVerified: true,
    }
  });

  const housemateProfile = (user as any).housemateProfile;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
      {/* Welcome Section - Mobile Optimized */}
      <div className="mb-8 sm:mb-12">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
          <div className="relative w-12 h-12 sm:w-16 sm:h-16 rounded-full overflow-hidden border-2 border-gray-200 flex-shrink-0">
            {housemateProfile?.profilePicture ? (
              <Image
                src={housemateProfile.profilePicture}
                alt="Profile picture"
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                <User className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400" />
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 break-words">
              Welcome, {user.firstName}!
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground mt-1 sm:mt-2">
              Find your perfect home and connect with homeowners
            </p>
          </div>
        </div>
      </div>

      {/* Background Check Banner - Mobile Optimized */}
      {!userWithStatus?.isVerified && (
        <div className="shadow-lg border-0 rounded-xl sm:rounded-2xl overflow-hidden mb-8 sm:mb-12 bg-white mx-auto">
          <div className="bg-gradient-to-br from-primary/8 via-primary/5 to-primary/3 border-b border-primary/10 p-4 sm:p-6 lg:p-8 text-center relative">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent"></div>
            <div className="relative z-10">
              <div className="w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center bg-white shadow-lg rounded-full mx-auto mb-4 sm:mb-6 border border-primary/20">
                <Shield className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
              </div>
              <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mb-2 sm:mb-3 px-2">
                Complete Your Background Check
              </h2>
              <p className="text-sm sm:text-base text-gray-700 max-w-2xl mx-auto mb-6 sm:mb-8 leading-relaxed px-2">
                Unlock full platform access and build trust with homeowners by completing your quick background verification
              </p>
              
              {/* Mobile: Vertical Stack, Desktop: Horizontal */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 lg:gap-8 mb-6 sm:mb-8">
                <div className="flex items-center gap-3 text-sm w-full sm:w-auto">
                  <div className="flex items-center justify-center w-8 h-8 bg-primary text-white rounded-full font-bold text-sm flex-shrink-0">1</div>
                  <span className="text-gray-700 font-medium">Complete Form</span>
                </div>
                <div className="flex items-center gap-3 text-sm w-full sm:w-auto">
                  <div className="flex items-center justify-center w-8 h-8 bg-gray-200 text-gray-600 rounded-full font-bold text-sm flex-shrink-0">2</div>
                  <span className="text-gray-600 font-medium">Wait 24-48 Hours</span>
                </div>
                <div className="flex items-center gap-3 text-sm w-full sm:w-auto">
                  <div className="flex items-center justify-center w-8 h-8 bg-gray-200 text-gray-600 rounded-full font-bold text-sm flex-shrink-0">3</div>
                  <span className="text-gray-600 font-medium">Start Messaging</span>
                </div>
              </div>
              
              <Link
                href="/background-check"
                className="inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl w-full sm:w-auto text-sm sm:text-base"
              >
                Get Started
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Available Listings - Already Mobile Optimized */}
      <div className="w-full">
        <AirbnbStyleRow category="newest" limit={3} />
      </div>
    </div>
  );
} 