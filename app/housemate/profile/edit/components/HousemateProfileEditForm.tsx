"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { updateHousemateProfile } from "@/app/actions/profile-actions";
import { useRouter } from "next/navigation";
import { Loader2, User, Users, UserCheck, UserMinus, Sunrise, Moon, Clock, Heart, Coffee, Book, Tv, HandHeart, Dumbbell, Church, Palette, Music, Laptop, PawPrint, Gamepad2, Flower, Baby, GraduationCap, Briefcase, Crown, Scale, PartyPopper, UserX, Dice6, ChefHat, CircleDot, UserCircle, CircleDashed } from "lucide-react";
import { toast } from "sonner";
import { UploadDropzone } from "@/app/lib/uploadthing";
import Image from "next/image";

interface HousemateProfileEditFormProps {
  userId: string;
  initialData: any;
}

export function HousemateProfileEditForm({ userId, initialData }: HousemateProfileEditFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    age: initialData?.age || "",
    occupation: initialData?.occupation || "",
    bio: initialData?.bio || "",
    profilePicture: initialData?.profilePicture || "",
    minBudget: initialData?.budgetRange?.min || "",
    maxBudget: initialData?.budgetRange?.max || "",
    gender: initialData?.gender || "",
    ageRange: initialData?.ageRange || "",
    schedule: initialData?.schedule || "",
    socialPreference: initialData?.socialPreference || "",
    hobbies: initialData?.hobbies || [],
    lifestyle: {
      smokingFriendly: initialData?.lifestyle?.smokingFriendly || false,
      petFriendly: initialData?.lifestyle?.petFriendly || false,
      socialLevel: initialData?.lifestyle?.socialLevel || "",
      cleanlinessLevel: initialData?.lifestyle?.cleanlinessLevel || "",
      sleepSchedule: initialData?.lifestyle?.sleepSchedule || "",
      workFromHome: initialData?.lifestyle?.workFromHome || false,
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
      const submitData = {
        age: formData.age ? parseInt(formData.age.toString()) : undefined,
        occupation: formData.occupation,
        bio: formData.bio,
        profilePicture: formData.profilePicture,
        minBudget: formData.minBudget ? parseInt(formData.minBudget.toString()) : undefined,
        maxBudget: formData.maxBudget ? parseInt(formData.maxBudget.toString()) : undefined,
        gender: formData.gender,
        ageRange: formData.ageRange,
        schedule: formData.schedule,
        socialPreference: formData.socialPreference,
        hobbies: formData.hobbies,
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

  const handleLifestyleChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      lifestyle: {
        ...prev.lifestyle,
        [field]: value
      }
    }));
  };

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
              {formData.profilePicture ? (
                <div className="space-y-4">
                  <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-gray-200">
                    <Image
                      src={formData.profilePicture}
                      alt="Profile picture"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setFormData(prev => ({ ...prev, profilePicture: "" }))}
                  >
                    Remove Picture
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="w-32 h-32 rounded-full bg-gray-100 flex items-center justify-center">
                    <User className="w-16 h-16 text-gray-400" />
                  </div>
                  <UploadDropzone
                    endpoint="profilePictureUpload"
                    onClientUploadComplete={(res) => {
                      if (res && res[0]) {
                        setFormData(prev => ({ ...prev, profilePicture: res[0].url }));
                        toast.success("Profile picture uploaded successfully!");
                      }
                    }}
                    onUploadError={(error: Error) => {
                      toast.error("Upload failed. Please try again.");
                    }}
                  />
                </div>
              )}
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
              <Label htmlFor="age">Age</Label>
              <Input
                id="age"
                type="number"
                placeholder="Your age"
                value={formData.age}
                onChange={(e) => handleInputChange("age", e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="occupation">Occupation</Label>
              <Input
                id="occupation"
                placeholder="Your job/profession"
                value={formData.occupation}
                onChange={(e) => handleInputChange("occupation", e.target.value)}
              />
            </div>
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
          <CardTitle>Budget Range</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="minBudget">Minimum Budget (per month)</Label>
              <Input
                id="minBudget"
                type="number"
                placeholder="$800"
                value={formData.minBudget}
                onChange={(e) => handleInputChange("minBudget", e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="maxBudget">Maximum Budget (per month)</Label>
              <Input
                id="maxBudget"
                type="number"
                placeholder="$1500"
                value={formData.maxBudget}
                onChange={(e) => handleInputChange("maxBudget", e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Lifestyle Preferences</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 gap-6">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="smokingFriendly"
                checked={formData.lifestyle.smokingFriendly}
                onChange={(e) => handleLifestyleChange("smokingFriendly", e.target.checked)}
                className="h-4 w-4"
              />
              <Label htmlFor="smokingFriendly">Smoking Friendly</Label>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="petFriendly"
                checked={formData.lifestyle.petFriendly}
                onChange={(e) => handleLifestyleChange("petFriendly", e.target.checked)}
                className="h-4 w-4"
              />
              <Label htmlFor="petFriendly">Pet Friendly</Label>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="workFromHome"
                checked={formData.lifestyle.workFromHome}
                onChange={(e) => handleLifestyleChange("workFromHome", e.target.checked)}
                className="h-4 w-4"
              />
              <Label htmlFor="workFromHome">Work From Home</Label>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="socialLevel">Social Level</Label>
              <select
                id="socialLevel"
                value={formData.lifestyle.socialLevel}
                onChange={(e) => handleLifestyleChange("socialLevel", e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                <option value="">Select level</option>
                <option value="quiet">Quiet & Private</option>
                <option value="moderate">Moderately Social</option>
                <option value="social">Very Social</option>
              </select>
            </div>

            <div>
              <Label htmlFor="cleanlinessLevel">Cleanliness Level</Label>
              <select
                id="cleanlinessLevel"
                value={formData.lifestyle.cleanlinessLevel}
                onChange={(e) => handleLifestyleChange("cleanlinessLevel", e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                <option value="">Select level</option>
                <option value="relaxed">Relaxed</option>
                <option value="moderate">Moderate</option>
                <option value="meticulous">Very Clean</option>
              </select>
            </div>

            <div>
              <Label htmlFor="sleepSchedule">Sleep Schedule</Label>
              <select
                id="sleepSchedule"
                value={formData.lifestyle.sleepSchedule}
                onChange={(e) => handleLifestyleChange("sleepSchedule", e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                <option value="">Select schedule</option>
                <option value="early">Early Bird</option>
                <option value="normal">Normal Hours</option>
                <option value="night">Night Owl</option>
              </select>
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