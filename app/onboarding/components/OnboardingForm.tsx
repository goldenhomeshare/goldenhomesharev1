"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { completeOnboarding } from "../actions";
import { useRouter } from "next/navigation";
import { Loader2, Home, User } from "lucide-react";

type UserType = "HOMEOWNER" | "HOUSEMATE" | "ADMIN";

export function OnboardingForm({ userId }: { userId: string }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleRoleSelection = async (role: UserType) => {
    setIsSubmitting(true);
    try {
      if (role === "HOUSEMATE") {
        // For housemates, redirect to the signup wizard without completing onboarding yet
        router.push("/housemate/signup-wizard");
      } else {
        // For homeowners, complete onboarding and redirect to profile edit
        const result = await completeOnboarding(userId, role);
        if (result.success) {
          router.push("/homeowner/profile/edit");
        }
      }
    } catch (error) {
      console.error("Onboarding error:", error);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 sm:py-12">
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

      <div className={`grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 ${isSubmitting ? 'pointer-events-none opacity-50' : ''}`}>
        {/* I have a home to share */}
        <Card className="border-2 border-gray-200 rounded-3xl p-4 sm:p-6 hover:shadow-lg transition-shadow">
          <CardContent className="text-center space-y-3 sm:space-y-4">
            {/* Home icon */}
            <div className="flex justify-center py-4 sm:py-6">
              <Home className="w-12 h-12 sm:w-16 sm:h-16 text-gray-400 stroke-1" />
            </div>
            
            <div className="space-y-1 sm:space-y-2">
              <h2 className="text-lg sm:text-xl font-bold text-gray-900">I have a home to share</h2>
              <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">
                Connect with trusted housemates in your area and start earning from your extra space.
              </p>
            </div>
            
            <Button 
              onClick={() => handleRoleSelection("HOMEOWNER")}
              disabled={isSubmitting}
              className="w-full bg-green-800 hover:bg-green-900 text-white py-4 sm:py-5 text-sm sm:text-base font-medium rounded-full"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 sm:h-5 sm:w-5 animate-spin" />
                  Setting up...
                </>
              ) : (
                "List my home"
              )}
            </Button>
          </CardContent>
        </Card>

        {/* I'm looking for housing */}
        <Card className="border-2 border-gray-200 rounded-3xl p-4 sm:p-6 hover:shadow-lg transition-shadow">
          <CardContent className="text-center space-y-3 sm:space-y-4">
            {/* User icon */}
            <div className="flex justify-center py-4 sm:py-6">
              <User className="w-12 h-12 sm:w-16 sm:h-16 text-gray-400 stroke-1" />
            </div>
            
            <div className="space-y-1 sm:space-y-2">
              <h2 className="text-lg sm:text-xl font-bold text-gray-900">I'm looking for housing</h2>
              <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">
                Find welcoming homes and caring homeowners in your preferred location.
              </p>
            </div>
            
            <Button 
              onClick={() => handleRoleSelection("HOUSEMATE")}
              disabled={isSubmitting}
              className="w-full bg-green-800 hover:bg-green-900 text-white py-4 sm:py-5 text-sm sm:text-base font-medium rounded-full"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 sm:h-5 sm:w-5 animate-spin" />
                  Setting up...
                </>
              ) : (
                "Find housing"
              )}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 