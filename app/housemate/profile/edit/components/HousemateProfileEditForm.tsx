"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { updateHousemateProfile } from "@/app/actions/profile-actions";
import { useRouter } from "next/navigation";
import { Loader2, User, Users, UserCheck, UserMinus, Sunrise, Moon, Clock, Heart, Coffee, Book, Tv, HandHeart, Dumbbell, Church, Palette, Music, Laptop, PawPrint, Gamepad2, Flower, Baby, GraduationCap, Briefcase, Crown, Scale, PartyPopper, UserX, Dice6, ChefHat, CircleDot, UserCircle, CircleDashed, Camera, Armchair, CigaretteOff } from "lucide-react";
import { toast } from "sonner";
import { useUploadThing } from "@/app/lib/uploadthing";
import Image from "next/image";
import { useCallback } from "react";
import React from "react";
import { UpdateUserSettings } from "@/app/actions";

interface HousemateProfileEditFormProps {
  userId: string;
  initialData: any;
  firstName: string;
  lastName: string;
  email: string;
}

export function HousemateProfileEditForm({ userId, initialData, firstName, lastName, email }: HousemateProfileEditFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    firstName: firstName || "",
    lastName: lastName || "",
    occupation: initialData?.occupation || "",
    bio: initialData?.bio || "",
    profilePicture: initialData?.profilePicture || "",
    maxBudget: initialData?.budgetRange?.max || initialData?.maxBudget || "",
    gender: initialData?.gender || "",
    ageRange: initialData?.ageRange || "",
    schedule: initialData?.schedule || "",
    socialPreference: initialData?.socialPreference || "",
    hobbies: initialData?.hobbies || [],
    preferredAgeRanges: initialData?.preferredAgeRanges || [],
    preferredGender: initialData?.preferredGender || "",
    socialMedia: {
      instagram: initialData?.socialMedia?.instagram || "",
      facebook: initialData?.socialMedia?.facebook || "",
      linkedin: initialData?.socialMedia?.linkedin || "",
    },
    lifestyle: {
      hasPets: initialData?.lifestyle?.hasPets || false,
      petDescription: initialData?.lifestyle?.petDescription || "",
      numberOfPeople: initialData?.lifestyle?.numberOfPeople || "1",
      smokingStatus: initialData?.lifestyle?.smokingStatus || "",
    },
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

  const occupationOptions = [
    { id: "student", label: "Student", icon: GraduationCap },
    { id: "professional", label: "Professional", icon: Briefcase },
    { id: "retired", label: "Retired", icon: Armchair },
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
      // Update basic user info (firstName, lastName) if changed
      if (formData.firstName !== firstName || formData.lastName !== lastName) {
        const formDataForUser = new FormData();
        formDataForUser.append("firstName", formData.firstName);
        formDataForUser.append("lastName", formData.lastName);
        
        const userResult = await UpdateUserSettings(null, formDataForUser);
        if (userResult.status === "error") {
          throw new Error(userResult.message || "Failed to update basic information");
        }
      }

      // Update profile-specific info
      const submitData = {
        occupation: formData.occupation,
        bio: formData.bio,
        profilePicture: formData.profilePicture,
        maxBudget: formData.maxBudget ? parseInt(formData.maxBudget.toString()) : undefined,
        gender: formData.gender,
        ageRange: formData.ageRange,
        schedule: formData.schedule,
        socialPreference: formData.socialPreference,
        hobbies: formData.hobbies,
        preferredAgeRanges: formData.preferredAgeRanges,
        preferredGender: formData.preferredGender,
        socialMedia: formData.socialMedia,
        lifestyle: formData.lifestyle,
      };

      const result = await updateHousemateProfile(submitData);
      
      if (result.success) {
        toast.success("Profile updated successfully!");
        router.push("/housemate/dashboard");
      } else {
        toast.error(result.error || "Failed to update profile");
      }
    } catch (error) {
      toast.error("An error occurred while updating your profile");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string | number) => {
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

  const handlePreferredAgeRangeToggle = (ageRangeId: string) => {
    setFormData(prev => ({
      ...prev,
      preferredAgeRanges: prev.preferredAgeRanges.includes(ageRangeId)
        ? prev.preferredAgeRanges.filter((id: string) => id !== ageRangeId)
        : [...prev.preferredAgeRanges, ageRangeId]
    }));
  };

  const handleLifestyleChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      lifestyle: {
        ...prev.lifestyle,
        [field]: value
      }
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
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                placeholder="Your first name"
                value={formData.firstName}
                onChange={(e) => handleInputChange("firstName", e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                placeholder="Your last name"
                value={formData.lastName}
                onChange={(e) => handleInputChange("lastName", e.target.value)}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              disabled
              className="bg-muted text-muted-foreground"
            />
            <p className="text-sm text-muted-foreground mt-1">
              Email cannot be changed from here
            </p>
          </div>

          <div>
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              placeholder="Tell homeowners about yourself, your lifestyle, and what you're looking for in a home..."
              value={formData.bio}
              onChange={(e) => handleInputChange("bio", e.target.value)}
              rows={4}
            />
          </div>

          <div>
            <Label className="text-base font-medium mb-4 block">Social Media Links</Label>
            <p className="text-sm text-muted-foreground mb-4">
              Optional: Add your social media profiles to help homeowners get to know you better
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="instagram" className="text-sm">Instagram</Label>
                <Input
                  id="instagram"
                  placeholder="https://instagram.com/username"
                  value={formData.socialMedia.instagram}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    socialMedia: { ...prev.socialMedia, instagram: e.target.value }
                  }))}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="facebook" className="text-sm">Facebook</Label>
                <Input
                  id="facebook"
                  placeholder="https://facebook.com/username"
                  value={formData.socialMedia.facebook}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    socialMedia: { ...prev.socialMedia, facebook: e.target.value }
                  }))}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="linkedin" className="text-sm">LinkedIn</Label>
                <Input
                  id="linkedin"
                  placeholder="https://linkedin.com/in/username"
                  value={formData.socialMedia.linkedin}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    socialMedia: { ...prev.socialMedia, linkedin: e.target.value }
                  }))}
                  className="mt-1"
                />
              </div>
            </div>
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

          {/* Occupation Selection */}
          <div>
            <Label className="text-base font-medium mb-4 block">Occupation</Label>
            <div className="grid grid-cols-3 gap-4">
              {occupationOptions.map((option) => {
                const Icon = option.icon;
                const isSelected = formData.occupation === option.id;
                
                return (
                  <div key={option.id}>
                    <label className="cursor-pointer">
                      <input
                        type="radio"
                        name="occupation"
                        className="sr-only peer"
                        checked={isSelected}
                        onChange={() => handleSingleSelect("occupation", option.id)}
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

          {/* Preferred Age Ranges */}
          <div>
            <Label className="text-base font-medium mb-4 block">Preferred Age Ranges</Label>
            <p className="text-sm text-muted-foreground mb-4">Select the age ranges you'd prefer to live with (select all that apply)</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                ...ageRangeOptions,
                { id: "no-preference", label: "No Preference", icon: Users }
              ].map((option) => {
                const Icon = option.icon;
                const isSelected = formData.preferredAgeRanges.includes(option.id);
                
                return (
                  <div key={option.id}>
                    <label className="cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={isSelected}
                        onChange={() => handlePreferredAgeRangeToggle(option.id)}
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

          {/* Preferred Gender */}
          <div>
            <Label className="text-base font-medium mb-4 block">Preferred Gender</Label>
            <p className="text-sm text-muted-foreground mb-4">Select your preferred gender for living companions</p>
            <div className="grid grid-cols-3 gap-4">
              {[
                { id: "male", label: "Male", icon: UserCircle },
                { id: "female", label: "Female", icon: User },
                { id: "no-preference", label: "No Preference", icon: Users }
              ].map((option) => {
                const Icon = option.icon;
                const isSelected = formData.preferredGender === option.id;
                
                return (
                  <div key={option.id}>
                    <label className="cursor-pointer">
                      <input
                        type="radio"
                        name="preferredGender"
                        className="sr-only peer"
                        checked={isSelected}
                        onChange={() => handleSingleSelect("preferredGender", option.id)}
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
          <CardTitle>Budget</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="maxBudget" className="text-base font-medium mb-3 block">
              Maximum Budget (per month)
            </Label>
            <Input
              id="maxBudget"
              type="number"
              placeholder="$725"
              value={formData.maxBudget}
              onChange={(e) => handleInputChange("maxBudget", e.target.value)}
              className="mt-2 px-4 py-3 text-lg border-2 border-gray-200 rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200 bg-white"
            />
          </div>
        </CardContent>
      </Card>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Lifestyle Preferences</CardTitle>
        </CardHeader>
        <CardContent className="space-y-8">
          {/* Pet Information */}
          <div className="border border-gray-200 rounded-lg p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center">
                <PawPrint size={24} className="text-slate-600" />
              </div>
              <Label className="text-base font-medium">Pets</Label>
            </div>
            
            <div className="space-y-3">
              <label className="cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={formData.lifestyle.hasPets}
                  onChange={(e) => handleLifestyleChange("hasPets", e.target.checked)}
                />
                <div className="flex items-center p-3 rounded-lg border peer-checked:border-primary peer-checked:bg-primary/5 hover:bg-slate-50 transition-colors">
                  <div className="flex-1">
                    <span className="font-medium text-sm">I have pets that I plan to bring</span>
                  </div>
                  <div className={`w-4 h-4 rounded border transition-colors ${
                    formData.lifestyle.hasPets 
                      ? 'border-primary bg-primary' 
                      : 'border-gray-300'
                  }`}>
                    {formData.lifestyle.hasPets && (
                      <svg className="w-3 h-3 text-white ml-0.5 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                      </svg>
                    )}
                  </div>
                </div>
              </label>
              
              {formData.lifestyle.hasPets && (
                <div className="ml-3">
                  <Label className="text-sm text-muted-foreground mb-2 block">
                    Please describe your pets (type, size, behavior, etc.):
                  </Label>
                  <Textarea
                    placeholder="e.g., Small, friendly dog that is house-trained and quiet"
                    value={formData.lifestyle.petDescription}
                    onChange={(e) => handleLifestyleChange("petDescription", e.target.value)}
                    rows={3}
                    className="border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Number of People */}
          <div className="border border-gray-200 rounded-lg p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center">
                <Users size={24} className="text-slate-600" />
              </div>
              <Label className="text-base font-medium">Number of People</Label>
            </div>
            
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                Homesharing is typically for one individual, but some opportunities for multiple people may be available.
              </p>
              
              <div className="space-y-2">
                {[
                  { value: "1", label: "Just myself (1 person)" },
                  { value: "2", label: "2 people" },
                  { value: "3+", label: "3 or more people" }
                ].map((option) => {
                  const isSelected = formData.lifestyle.numberOfPeople === option.value;
                  
                  return (
                    <div key={option.value}>
                      <label className="cursor-pointer">
                        <input
                          type="radio"
                          name="numberOfPeople"
                          className="sr-only peer"
                          checked={isSelected}
                          onChange={() => handleLifestyleChange("numberOfPeople", option.value)}
                        />
                        <div className="flex items-center p-3 rounded-lg border peer-checked:border-primary peer-checked:bg-primary/5 hover:bg-slate-50 transition-colors">
                          <div className="flex-1">
                            <span className="font-medium text-sm">{option.label}</span>
                          </div>
                          <div className={`w-4 h-4 rounded-full border-2 transition-colors ${
                            isSelected 
                              ? 'border-primary bg-primary' 
                              : 'border-gray-300'
                          }`}>
                            {isSelected && (
                              <div className="w-full h-full rounded-full bg-white scale-50"></div>
                            )}
                          </div>
                        </div>
                      </label>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Smoking Status */}
          <div className="border border-gray-200 rounded-lg p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center">
                <CigaretteOff size={24} className="text-slate-600" />
              </div>
              <Label className="text-base font-medium">Smoking Status</Label>
            </div>
            
            <div className="space-y-2">
              {[
                { value: "no", label: "Non-smoker" },
                { value: "outside", label: "Smoker (outside only)" },
                { value: "yes", label: "Smoker (anywhere)" }
              ].map((option) => {
                const isSelected = formData.lifestyle.smokingStatus === option.value;
                
                return (
                  <div key={option.value}>
                    <label className="cursor-pointer">
                      <input
                        type="radio"
                        name="smokingStatus"
                        className="sr-only peer"
                        checked={isSelected}
                        onChange={() => handleLifestyleChange("smokingStatus", option.value)}
                      />
                      <div className="flex items-center p-3 rounded-lg border peer-checked:border-primary peer-checked:bg-primary/5 hover:bg-slate-50 transition-colors">
                        <div className="flex-1">
                          <span className="font-medium text-sm">{option.label}</span>
                        </div>
                        <div className={`w-4 h-4 rounded-full border-2 transition-colors ${
                          isSelected 
                            ? 'border-primary bg-primary' 
                            : 'border-gray-300'
                        }`}>
                          {isSelected && (
                            <div className="w-full h-full rounded-full bg-white scale-50"></div>
                          )}
                        </div>
                      </div>
                    </label>
                  </div>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-4 mt-8">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/housemate/dashboard")}
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