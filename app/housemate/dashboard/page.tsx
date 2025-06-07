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
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
      {/* Welcome Section */}
      <div className="mb-12 flex items-center gap-4">
        <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-gray-200">
          {housemateProfile?.profilePicture ? (
            <Image
              src={housemateProfile.profilePicture}
              alt="Profile picture"
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gray-100 flex items-center justify-center">
              <User className="w-8 h-8 text-gray-400" />
            </div>
          )}
        </div>
        <div>
          <h1 className="text-3xl font-bold">Welcome, {user.firstName}!</h1>
          <p className="text-muted-foreground mt-2">
            Find your perfect home and connect with homeowners
          </p>
        </div>
      </div>

      {/* Background Check Banner - Only show for unverified users */}
      {!userWithStatus?.isVerified && (
        <div className="shadow-lg border-0 rounded-2xl overflow-hidden mb-12 bg-white">
          <div className="bg-gradient-to-br from-primary/8 via-primary/5 to-primary/3 border-b border-primary/10 p-8 text-center relative">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent"></div>
            <div className="relative z-10">
              <div className="w-16 h-16 flex items-center justify-center bg-white shadow-lg rounded-full mx-auto mb-6 border border-primary/20">
                <Shield className="w-8 h-8 text-primary" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">
                Complete Your Background Check
              </h2>
              <p className="text-gray-700 max-w-2xl mx-auto mb-6 leading-relaxed">
                Unlock full platform access and build trust with homeowners by completing your quick background verification
              </p>
              
              <div className="flex items-center justify-center gap-8 mb-6">
                <div className="flex items-center gap-3 text-sm">
                  <div className="flex items-center justify-center w-8 h-8 bg-primary text-white rounded-full font-bold">1</div>
                  <span className="text-gray-700">Complete Form</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <div className="flex items-center justify-center w-8 h-8 bg-gray-200 text-gray-600 rounded-full font-bold">2</div>
                  <span className="text-gray-600">Wait 24-48 Hours</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <div className="flex items-center justify-center w-8 h-8 bg-gray-200 text-gray-600 rounded-full font-bold">3</div>
                  <span className="text-gray-600">Start Messaging</span>
                </div>
              </div>
              
              <Link
                href="/background-check"
                className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                Get Started
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Available Listings */}
      <AirbnbStyleRow category="newest" limit={3} />
    </div>
  );
} 