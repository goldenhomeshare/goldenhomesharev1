"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { completeOnboarding } from "../actions";
import { useRouter } from "next/navigation";
import { Loader2, Home, User } from "lucide-react";

type UserType = "HOMEOWNER" | "HOUSEMATE" | "ADMIN";

export function OnboardingForm({ userId }: { userId: string }) {
  const [selectedRole, setSelectedRole] = useState<UserType | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleRoleSelection = async (role: UserType) => {
    setIsSubmitting(true);
    try {
      const result = await completeOnboarding(userId, role);
      if (result.success) {
        // Redirect to existing profile edit pages
        if (role === "HOMEOWNER") {
          router.push("/homeowner/profile/edit");
        } else {
          router.push("/housemate/profile/edit");
        }
      }
    } catch (error) {
      console.error("Onboarding error:", error);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative">
      {/* Loading Overlay */}
      {isSubmitting && (
        <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Setting up your profile...
            </h3>
            <p className="text-sm text-gray-600">
              {selectedRole === "HOMEOWNER" 
                ? "Preparing your homeowner dashboard" 
                : "Preparing your housemate profile"
              }
            </p>
          </div>
        </div>
      )}

      <div className={`space-y-6 ${isSubmitting ? 'pointer-events-none' : ''}`}>
        <div className="text-center">
          <h1 className="text-3xl font-bold">Welcome to Golden HomeShare</h1>
          <p className="text-muted-foreground mt-2">
            Let's set up your profile. Are you looking to share your home or find a place to stay?
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-6">
          <Card 
            className={`cursor-pointer transition-all hover:shadow-md ${
              selectedRole === "HOMEOWNER" ? 'ring-2 ring-primary' : ''
            } ${isSubmitting ? 'opacity-50' : ''}`}
            onClick={() => !isSubmitting && setSelectedRole("HOMEOWNER")}
          >
            <CardHeader className="flex flex-col items-center">
              <Home className="w-10 h-10 text-primary mb-2" />
              <CardTitle className="text-center">I'm a Homeowner</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col">
              <p className="text-center mb-4 flex-grow">I want to share my home with trusted housemates</p>
              {selectedRole === "HOMEOWNER" && (
                <Button 
                  size="lg" 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRoleSelection("HOMEOWNER");
                  }}
                  disabled={isSubmitting}
                  className="w-full mt-2"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Setting up...
                    </>
                  ) : (
                    "Continue as Homeowner"
                  )}
                </Button>
              )}
            </CardContent>
          </Card>
          
          <Card 
            className={`cursor-pointer transition-all hover:shadow-md ${
              selectedRole === "HOUSEMATE" ? 'ring-2 ring-primary' : ''
            } ${isSubmitting ? 'opacity-50' : ''}`}
            onClick={() => !isSubmitting && setSelectedRole("HOUSEMATE")}
          >
            <CardHeader className="flex flex-col items-center">
              <User className="w-10 h-10 text-primary mb-2" />
              <CardTitle className="text-center">I'm Looking for Housing</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col">
              <p className="text-center mb-4 flex-grow">I want to find a welcoming home to share</p>
              {selectedRole === "HOUSEMATE" && (
                <Button 
                  size="lg" 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRoleSelection("HOUSEMATE");
                  }}
                  disabled={isSubmitting}
                  className="w-full mt-2"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Setting up...
                    </>
                  ) : (
                    "Continue as Housemate"
                  )}
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 