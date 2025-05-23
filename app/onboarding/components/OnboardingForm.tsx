"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { completeOnboarding } from "../actions";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

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
        // Redirect to appropriate profile creation page
        if (role === "HOMEOWNER") {
          router.push("/onboarding/homeowner-profile");
        } else {
          router.push("/onboarding/housemate-profile");
        }
      }
    } catch (error) {
      console.error("Onboarding error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
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
          }`}
          onClick={() => setSelectedRole("HOMEOWNER")}
        >
          <CardHeader>
            <CardTitle className="text-center">I'm a Homeowner</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-center mb-4">I want to share my home with trusted housemates</p>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• List your property</li>
              <li>• Screen potential housemates</li>
              <li>• Earn rental income</li>
              <li>• Build community</li>
            </ul>
          </CardContent>
        </Card>
        
        <Card 
          className={`cursor-pointer transition-all hover:shadow-md ${
            selectedRole === "HOUSEMATE" ? 'ring-2 ring-primary' : ''
          }`}
          onClick={() => setSelectedRole("HOUSEMATE")}
        >
          <CardHeader>
            <CardTitle className="text-center">I'm Looking for Housing</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-center mb-4">I want to find a welcoming home to share</p>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Browse verified listings</li>
              <li>• Connect with homeowners</li>
              <li>• Find affordable housing</li>
              <li>• Join a community</li>
            </ul>
          </CardContent>
        </Card>
      </div>
      
      {selectedRole && (
        <div className="text-center">
          <Button 
            size="lg" 
            onClick={() => handleRoleSelection(selectedRole)}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Setting up...
              </>
            ) : (
              `Continue as ${selectedRole === "HOMEOWNER" ? 'Homeowner' : 'Housemate'}`
            )}
          </Button>
        </div>
      )}
    </div>
  );
} 