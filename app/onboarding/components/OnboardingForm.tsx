"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { completeOnboarding } from "../actions";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import Image from "next/image";

type UserType = "HOMEOWNER" | "HOUSEMATE" | "ADMIN";

export function OnboardingForm({ userId }: { userId: string }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleRoleSelection = async (role: UserType) => {
    setIsSubmitting(true);
    try {
      if (role === "HOUSEMATE") {
        // For housemates, redirect to the signup wizard
        router.push("/housemate/signup-wizard");
      } else if (role === "HOMEOWNER") {
        // For homeowners, redirect to the signup wizard
        router.push("/homeowner/signup-wizard");
      } else {
        // For other roles (like ADMIN), complete onboarding normally
        const result = await completeOnboarding(userId, role);
        if (result.success) {
          router.push("/dashboard");
        }
      }
    } catch (error) {
      console.error("Onboarding error:", error);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Loading Overlay */}
      {isSubmitting && (
        <div className="fixed inset-0 bg-white/90 z-50 flex items-center justify-center">
          <div className="text-center">
            <div className="w-12 h-12 border-3 border-green-800 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <h3 className="text-lg font-semibold text-gray-900">
              Setting up your profile...
            </h3>
          </div>
        </div>
      )}

      <div className={`grid grid-cols-1 lg:grid-cols-2 lg:min-h-screen ${isSubmitting ? 'pointer-events-none opacity-50' : ''}`}>
        {/* Homeowner Side */}
        <div className="bg-gradient-to-br from-green-50 to-green-100 flex flex-col items-center justify-center p-4 py-8 lg:p-12 relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute inset-0 bg-white/20 backdrop-blur-sm"></div>
          
          <div className="relative z-10 text-center space-y-4 lg:space-y-6 max-w-md">
            {/* Large homeowner image */}
            <div className="flex justify-center mb-4 lg:mb-8">
              <div className="relative w-48 h-48 lg:w-64 lg:h-64">
                <Image
                  src="/Homeowner-Onboarding.png"
                  alt="Homeowner illustration"
                  fill
                  className="object-contain drop-shadow-lg"
                  priority
                />
              </div>
            </div>
            
            <div className="space-y-2 lg:space-y-4">
              <h2 className="text-2xl lg:text-3xl font-bold text-gray-900">
                I have a home to share
              </h2>
              <p className="hidden lg:block text-gray-700 text-base lg:text-lg leading-relaxed">
                Connect with trusted housemates in your area and start earning from your extra space.
              </p>
            </div>
            
            <Button 
              onClick={() => handleRoleSelection("HOMEOWNER")}
              disabled={isSubmitting}
              size="lg"
              className="w-full bg-green-800 hover:bg-green-900 text-white py-4 lg:py-6 text-base lg:text-lg font-medium rounded-full shadow-lg hover:shadow-xl transition-all"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Setting up...
                </>
              ) : (
                "List my home"
              )}
            </Button>
          </div>
        </div>

        {/* Housemate Side */}
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 flex flex-col items-center justify-center p-4 py-8 lg:p-12 relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute inset-0 bg-white/20 backdrop-blur-sm"></div>
          
          <div className="relative z-10 text-center space-y-4 lg:space-y-6 max-w-md">
            {/* Large housemate image */}
            <div className="flex justify-center mb-4 lg:mb-8">
              <div className="relative w-48 h-48 lg:w-64 lg:h-64">
                <Image
                  src="/Housemate-Onboarding.png"
                  alt="Housemate illustration"
                  fill
                  className="object-contain drop-shadow-lg"
                  priority
                />
              </div>
            </div>
            
            <div className="space-y-2 lg:space-y-4">
              <h2 className="text-2xl lg:text-3xl font-bold text-gray-900">
                I'm looking for housing
              </h2>
              <p className="hidden lg:block text-gray-700 text-base lg:text-lg leading-relaxed">
                Find welcoming homes and caring homeowners in your preferred location.
              </p>
            </div>
            
            <Button 
              onClick={() => handleRoleSelection("HOUSEMATE")}
              disabled={isSubmitting}
              size="lg"
              className="w-full bg-green-800 hover:bg-green-900 text-white py-4 lg:py-6 text-base lg:text-lg font-medium rounded-full shadow-lg hover:shadow-xl transition-all"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Setting up...
                </>
              ) : (
                "Find housing"
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
} 