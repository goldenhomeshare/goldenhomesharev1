"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { updateHomeownerProfile } from "@/app/actions/profile-actions";
import { useRouter } from "next/navigation";
import { Loader2, User, Users, UserCheck, UserMinus, Sunrise, Moon, Clock, Heart, Coffee, Book, Tv, HandHeart, Dumbbell, Church, Palette, Music, Laptop, PawPrint, Gamepad2, Flower, Baby, GraduationCap, Briefcase, Crown, Scale, PartyPopper, UserX, Dice6, ChefHat, CircleDot, UserCircle, CircleDashed, Camera, Upload } from "lucide-react";
import { toast } from "sonner";
import { useUploadThing } from "@/app/lib/uploadthing";
import Image from "next/image";
import { useCallback } from "react";
import React from "react";

interface HomeownerProfileEditFormProps {
  userId: string;
  initialData: any;
}

export function HomeownerProfileEditForm({ userId, initialData }: HomeownerProfileEditFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    bio: initialData?.bio || "",
    profilePicture: initialData?.profilePicture || "",
    emergencyContactName: initialData?.emergencyContact?.name || "",
    emergencyContactPhone: initialData?.emergencyContact?.phone || "",
    emergencyContactRelationship: initialData?.emergencyContact?.relationship || "",
    gender: initialData?.gender || "",
    ageRange: initialData?.ageRange || "",
    schedule: initialData?.schedule || "",
    socialPreference: initialData?.socialPreference || "",
    hobbies: initialData?.hobbies || [],
  });
  
  const router = useRouter();

  const genderOptions = [
    { id: "male", label: "Male", icon: UserCircle },
    { id: "female", label: "Female", icon: User },
    { id: "other", label: "Other", icon: CircleDashed },
  ];

  const ageRangeOptions = [
    { id: "18-24", label: "18–24", icon: GraduationCap },
    { id: "25-34", label: "25–34", icon: Briefcase },
    { id: "35-44", label: "35–44", icon: User },
    { id: "45-54", label: "45–54", icon: UserCheck },
    { id: "55-64", label: "55–64", icon: Users },
    { id: "65+", label: "65+", icon: Crown },
  ];

  const scheduleOptions = [
    { id: "early-riser", label: "Early Riser", icon: Sunrise },
    { id: "night-owl", label: "Night Owl", icon: Moon },
    { id: "flexible", label: "Flexible", icon: Clock },
  ];

  const socialOptions = [
    { id: "social", label: "Social", icon: Users },
    { id: "independent", label: "Independent", icon: User },
    { id: "balanced", label: "Balanced", icon: CircleDot },
  ];

  const hobbiesOptions = [
    { id: "gardening", label: "Gardening", icon: Flower },
    { id: "cooking", label: "Cooking/Baking", icon: ChefHat },
    { id: "reading", label: "Reading", icon: Book },
    { id: "movies", label: "Movies/TV", icon: Tv },
    { id: "volunteering", label: "Volunteering", icon: HandHeart },
    { id: "fitness", label: "Fitness", icon: Dumbbell },
    { id: "church", label: "Church/Religious", icon: Church },
    { id: "crafting", label: "Crafting/Art", icon: Palette },
    { id: "music", label: "Music", icon: Music },
    { id: "tech", label: "Tech/Computers", icon: Laptop },
    { id: "pets", label: "Pets/Animals", icon: PawPrint },
    { id: "games", label: "Board Games", icon: Dice6 },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const result = await updateHomeownerProfile(formData);
      
      if (result.success) {
        toast.success("Profile updated successfully!");
        router.push("/homeowner/dashboard");
      } else {
        toast.error(result.error || "Failed to update profile");
      }
    } catch (error) {
      toast.error("An error occurred while updating your profile");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSingleSelect = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field] === value ? "" : value
    }));
  };

  const handleHobbyToggle = (hobbyId: string) => {
    setFormData(prev => ({
      ...prev,
      hobbies: prev.hobbies.includes(hobbyId)
        ? prev.hobbies.filter((id: string) => id !== hobbyId)
        : [...prev.hobbies, hobbyId]
    }));
  };

  const ProfilePictureUpload = useCallback(({ currentPicture, onUploadComplete, onRemove }: { currentPicture: string; onUploadComplete: (url: string) => void; onRemove: () => void }) => {
    const { startUpload, isUploading } = useUploadThing("profilePictureUpload", {
      onClientUploadComplete: (res) => {
        if (res && res[0]) {
          onUploadComplete(res[0].url);
        }
      },
      onUploadError: (error: Error) => {
        toast.error("Upload failed. Please try again.");
      },
    });

    const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file) {
        await startUpload([file]);
      }
      // Reset the input so the same file can be selected again
      event.target.value = '';
    };

    const fileInputRef = React.useRef<HTMLInputElement>(null);

    return (
      <div className="space-y-4">
        <div 
          className={`relative w-32 h-32 rounded-full overflow-hidden border-4 border-gray-200 cursor-pointer group hover:border-primary transition-colors ${isUploading ? 'opacity-50' : ''}`}
          onClick={() => fileInputRef.current?.click()}
        >
          {currentPicture ? (
            <>
              <Image
                src={currentPicture}
                alt="Profile picture"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Camera className="w-8 h-8 text-white" />
              </div>
            </>
          ) : (
            <div className="w-full h-full bg-gray-100 flex flex-col items-center justify-center group-hover:bg-gray-200 transition-colors">
              {isUploading ? (
                <Loader2 className="w-8 h-8 text-gray-400 animate-spin" />
              ) : (
                <>
                  <Camera className="w-8 h-8 text-gray-400 mb-1" />
                  <span className="text-xs text-gray-500">Add Photo</span>
                </>
              )}
            </div>
          )}
        </div>
        
        {currentPicture && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onRemove}
            disabled={isUploading}
          >
            Remove Picture
          </Button>
        )}
        
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleUpload}
          className="hidden"
          disabled={isUploading}
        />
      </div>
    );
  }, []);

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader>
          <CardTitle>Profile Picture</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Label>Profile Picture</Label>
            <div className="mt-4">
              <ProfilePictureUpload 
                currentPicture={formData.profilePicture}
                onUploadComplete={(url) => {
                  setFormData(prev => ({ ...prev, profilePicture: url }));
                  toast.success("Profile picture uploaded successfully!");
                }}
                onRemove={() => setFormData(prev => ({ ...prev, profilePicture: "" }))}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              placeholder="Tell potential housemates about yourself, your home, and what you're looking for..."
              value={formData.bio}
              onChange={(e) => handleInputChange("bio", e.target.value)}
              rows={4}
            />
          </div>
        </CardContent>
      </Card>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Demographics & Preferences</CardTitle>
        </CardHeader>
        <CardContent className="space-y-8">
          {/* Gender Selection */}
          <div>
            <Label className="text-base font-medium mb-4 block">Gender</Label>
            <div className="grid grid-cols-3 gap-4">
              {genderOptions.map((option) => {
                const Icon = option.icon;
                const isSelected = formData.gender === option.id;
                
                return (
                  <div key={option.id}>
                    <label className="cursor-pointer">
                      <input
                        type="radio"
                        name="gender"
                        className="sr-only peer"
                        checked={isSelected}
                        onChange={() => handleSingleSelect("gender", option.id)}
                      />
                      <div className="flex flex-col items-center p-4 rounded-lg border peer-checked:border-primary peer-checked:bg-primary/5 hover:bg-slate-50 h-full">
                        <div className="w-12 h-12 rounded-full bg-slate-100 mb-3 flex items-center justify-center">
                          <Icon size={24} className="text-slate-600" />
                        </div>
                        <span className="font-medium text-center">{option.label}</span>
                      </div>
                    </label>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Age Range Selection */}
          <div>
            <Label className="text-base font-medium mb-4 block">Age Range</Label>
            <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
              {ageRangeOptions.map((option) => {
                const Icon = option.icon;
                const isSelected = formData.ageRange === option.id;
                
                return (
                  <div key={option.id}>
                    <label className="cursor-pointer">
                      <input
                        type="radio"
                        name="ageRange"
                        className="sr-only peer"
                        checked={isSelected}
                        onChange={() => handleSingleSelect("ageRange", option.id)}
                      />
                      <div className="flex flex-col items-center p-4 rounded-lg border peer-checked:border-primary peer-checked:bg-primary/5 hover:bg-slate-50 h-full">
                        <div className="w-12 h-12 rounded-full bg-slate-100 mb-3 flex items-center justify-center">
                          <Icon size={24} className="text-slate-600" />
                        </div>
                        <span className="font-medium text-center">{option.label}</span>
                      </div>
                    </label>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Schedule Selection */}
          <div>
            <Label className="text-base font-medium mb-4 block">Schedule</Label>
            <div className="grid grid-cols-3 gap-4">
              {scheduleOptions.map((option) => {
                const Icon = option.icon;
                const isSelected = formData.schedule === option.id;
                
                return (
                  <div key={option.id}>
                    <label className="cursor-pointer">
                      <input
                        type="radio"
                        name="schedule"
                        className="sr-only peer"
                        checked={isSelected}
                        onChange={() => handleSingleSelect("schedule", option.id)}
                      />
                      <div className="flex flex-col items-center p-4 rounded-lg border peer-checked:border-primary peer-checked:bg-primary/5 hover:bg-slate-50 h-full">
                        <div className="w-12 h-12 rounded-full bg-slate-100 mb-3 flex items-center justify-center">
                          <Icon size={24} className="text-slate-600" />
                        </div>
                        <span className="font-medium text-center">{option.label}</span>
                      </div>
                    </label>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Social Preferences */}
          <div>
            <Label className="text-base font-medium mb-4 block">Social Preferences</Label>
            <div className="grid grid-cols-3 gap-4">
              {socialOptions.map((option) => {
                const Icon = option.icon;
                const isSelected = formData.socialPreference === option.id;
                
                return (
                  <div key={option.id}>
                    <label className="cursor-pointer">
                      <input
                        type="radio"
                        name="socialPreference"
                        className="sr-only peer"
                        checked={isSelected}
                        onChange={() => handleSingleSelect("socialPreference", option.id)}
                      />
                      <div className="flex flex-col items-center p-4 rounded-lg border peer-checked:border-primary peer-checked:bg-primary/5 hover:bg-slate-50 h-full">
                        <div className="w-12 h-12 rounded-full bg-slate-100 mb-3 flex items-center justify-center">
                          <Icon size={24} className="text-slate-600" />
                        </div>
                        <span className="font-medium text-center">{option.label}</span>
                      </div>
                    </label>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Hobbies/Interests */}
          <div>
            <Label className="text-base font-medium mb-4 block">Hobbies & Interests</Label>
            <p className="text-sm text-muted-foreground mb-4">Select all that apply</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {hobbiesOptions.map((option) => {
                const Icon = option.icon;
                const isSelected = formData.hobbies.includes(option.id);
                
                return (
                  <div key={option.id}>
                    <label className="cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={isSelected}
                        onChange={() => handleHobbyToggle(option.id)}
                      />
                      <div className="flex flex-col items-center p-4 rounded-lg border peer-checked:border-primary peer-checked:bg-primary/5 hover:bg-slate-50 h-full">
                        <div className="w-12 h-12 rounded-full bg-slate-100 mb-3 flex items-center justify-center">
                          <Icon size={24} className="text-slate-600" />
                        </div>
                        <span className="font-medium text-center text-sm">{option.label}</span>
                      </div>
                    </label>
                  </div>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Emergency Contact</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="emergencyContactName">Contact Name</Label>
            <Input
              id="emergencyContactName"
              placeholder="Full name"
              value={formData.emergencyContactName}
              onChange={(e) => handleInputChange("emergencyContactName", e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="emergencyContactPhone">Phone Number</Label>
            <Input
              id="emergencyContactPhone"
              type="tel"
              placeholder="Phone number"
              value={formData.emergencyContactPhone}
              onChange={(e) => handleInputChange("emergencyContactPhone", e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="emergencyContactRelationship">Relationship</Label>
            <Input
              id="emergencyContactRelationship"
              placeholder="e.g., Family member, friend, colleague"
              value={formData.emergencyContactRelationship}
              onChange={(e) => handleInputChange("emergencyContactRelationship", e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-4 mt-8">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/homeowner/dashboard")}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            "Save Changes"
          )}
        </Button>
      </div>
    </form>
  );
} 