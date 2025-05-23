"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createHomeownerProfile } from "../../actions";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export function HomeownerProfileForm({ userId }: { userId: string }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    bio: "",
    emergencyContactName: "",
    emergencyContactPhone: "",
  });
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const emergencyContact = formData.emergencyContactName && formData.emergencyContactPhone 
        ? {
            name: formData.emergencyContactName,
            phone: formData.emergencyContactPhone,
          }
        : null;

      const result = await createHomeownerProfile(userId, {
        bio: formData.bio || undefined,
        emergencyContact,
      });

      if (result.success) {
        router.push("/homeowner/dashboard");
      }
    } catch (error) {
      console.error("Error creating profile:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Homeowner Profile</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="bio">About You (Optional)</Label>
            <Textarea
              id="bio"
              placeholder="Tell potential housemates about yourself, your home, and what you're looking for in a housemate..."
              value={formData.bio}
              onChange={(e) => handleInputChange("bio", e.target.value)}
              rows={4}
            />
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium">Emergency Contact (Optional)</h3>
            <div className="space-y-2">
              <Label htmlFor="emergencyContactName">Name</Label>
              <Input
                id="emergencyContactName"
                placeholder="Contact person name"
                value={formData.emergencyContactName}
                onChange={(e) => handleInputChange("emergencyContactName", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="emergencyContactPhone">Phone Number</Label>
              <Input
                id="emergencyContactPhone"
                type="tel"
                placeholder="Phone number"
                value={formData.emergencyContactPhone}
                onChange={(e) => handleInputChange("emergencyContactPhone", e.target.value)}
              />
            </div>
          </div>

          <div className="flex gap-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => router.push("/onboarding")}
              disabled={isSubmitting}
            >
              Back
            </Button>
            <Button type="submit" disabled={isSubmitting} className="flex-1">
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating Profile...
                </>
              ) : (
                "Complete Setup"
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
} 