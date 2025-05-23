"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createHousemateProfile } from "../../actions";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export function HousemateProfileForm({ userId }: { userId: string }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    age: "",
    occupation: "",
    bio: "",
    minBudget: "",
    maxBudget: "",
    lifestyle: {
      smoking: false,
      pets: false,
      socialLevel: "moderate", // quiet, moderate, social
    }
  });
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const budgetRange = formData.minBudget && formData.maxBudget 
        ? {
            min: parseInt(formData.minBudget),
            max: parseInt(formData.maxBudget),
          }
        : null;

      const result = await createHousemateProfile(userId, {
        age: formData.age ? parseInt(formData.age) : undefined,
        occupation: formData.occupation || undefined,
        bio: formData.bio || undefined,
        lifestyle: formData.lifestyle,
        budgetRange,
      });

      if (result.success) {
        router.push("/housemate/dashboard");
      }
    } catch (error) {
      console.error("Error creating profile:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string | number | boolean) => {
    if (field.includes(".")) {
      const [parent, child] = field.split(".");
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent as keyof typeof prev] as object,
          [child]: value,
        }
      }));
    } else {
      setFormData(prev => ({ ...prev, [field]: value }));
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Housemate Profile</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="age">Age (Optional)</Label>
              <Input
                id="age"
                type="number"
                placeholder="Your age"
                value={formData.age}
                onChange={(e) => handleInputChange("age", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="occupation">Occupation (Optional)</Label>
              <Input
                id="occupation"
                placeholder="Your occupation"
                value={formData.occupation}
                onChange={(e) => handleInputChange("occupation", e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio">About You (Optional)</Label>
            <Textarea
              id="bio"
              placeholder="Tell homeowners about yourself, your lifestyle, and what you're looking for in a living situation..."
              value={formData.bio}
              onChange={(e) => handleInputChange("bio", e.target.value)}
              rows={4}
            />
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium">Budget Range (Optional)</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="minBudget">Minimum Budget ($)</Label>
                <Input
                  id="minBudget"
                  type="number"
                  placeholder="500"
                  value={formData.minBudget}
                  onChange={(e) => handleInputChange("minBudget", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="maxBudget">Maximum Budget ($)</Label>
                <Input
                  id="maxBudget"
                  type="number"
                  placeholder="1500"
                  value={formData.maxBudget}
                  onChange={(e) => handleInputChange("maxBudget", e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium">Lifestyle Preferences</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="smoking"
                  checked={formData.lifestyle.smoking}
                  onChange={(e) => handleInputChange("lifestyle.smoking", e.target.checked)}
                  className="rounded"
                />
                <Label htmlFor="smoking">I smoke</Label>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="pets"
                  checked={formData.lifestyle.pets}
                  onChange={(e) => handleInputChange("lifestyle.pets", e.target.checked)}
                  className="rounded"
                />
                <Label htmlFor="pets">I have pets</Label>
              </div>
              <div className="space-y-2">
                <Label htmlFor="socialLevel">Social Level</Label>
                <select
                  id="socialLevel"
                  value={formData.lifestyle.socialLevel}
                  onChange={(e) => handleInputChange("lifestyle.socialLevel", e.target.value)}
                  className="w-full p-2 border rounded-md"
                >
                  <option value="quiet">Quiet - I prefer minimal interaction</option>
                  <option value="moderate">Moderate - I enjoy occasional socializing</option>
                  <option value="social">Social - I love spending time with housemates</option>
                </select>
              </div>
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