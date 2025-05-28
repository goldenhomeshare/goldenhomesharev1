"use client";

import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { updateHomeownerProfile } from "@/app/actions/profile-actions";
import { useRouter } from "next/navigation";
import { 
  Loader2, 
  User, 
  Users, 
  UserCheck, 
  Sunrise, 
  Moon, 
  Clock, 
  Book, 
  Tv, 
  HandHeart, 
  Dumbbell, 
  Church, 
  Palette, 
  Music, 
  Laptop, 
  PawPrint, 
  Dice6, 
  ChefHat, 
  CircleDot, 
  UserCircle, 
  CircleDashed, 
  Camera, 
  Upload, 
  X,
  Flower,
  GraduationCap,
  Briefcase,
  Armchair,
  Crown,
  CigaretteOff,
  UserPlus,
  Mars,
  Venus,
  Instagram,
  Facebook,
  Linkedin,
  Sparkles,
  Salad,
  ShoppingBag,
  HeartHandshake,
  Cat,
  Wrench,
  Car,
  Monitor,
  Home
} from "lucide-react";
import { toast } from "sonner";
import { useUploadThing } from "@/app/lib/uploadthing";
import Image from "next/image";
import React from "react";
import { UpdateUserSettings } from "@/app/actions";

interface HomeownerProfileEditFormProps {
  userId: string;
  initialData: any;
  firstName: string;
  lastName: string;
  email: string;
}

export function HomeownerProfileEditForm({ userId, initialData, firstName, lastName, email }: HomeownerProfileEditFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    firstName: firstName || "",
    lastName: lastName || "",
    dateOfBirth: initialData?.lifestyle?.dateOfBirth || "",
    language: initialData?.lifestyle?.language || "",
    bio: initialData?.bio || "",
    profilePicture: initialData?.profilePicture || "",
    gender: initialData?.gender || "",
    ageRange: initialData?.ageRange || "",
    schedule: initialData?.schedule || "",
    socialPreference: initialData?.socialPreference || "",
    hobbies: initialData?.hobbies || [],
    preferredCareerStage: initialData?.preferredCareerStage || "",
    preferredGender: initialData?.preferredGender || "",
    helpExpected: initialData?.lifestyle?.helpExpected || [],
    socialMedia: {
      instagram: initialData?.socialMedia?.instagram || "",
      facebook: initialData?.socialMedia?.facebook || "",
      linkedin: initialData?.socialMedia?.linkedin || "",
    },
    lifestyle: {
      hasPets: initialData?.lifestyle?.hasPets || false,
      petDescription: initialData?.lifestyle?.petDescription || "",
      numberOfPeople: initialData?.lifestyle?.numberOfPeople || "1",
      smokingPolicy: initialData?.lifestyle?.smokingPolicy || "",
      guestPolicy: initialData?.lifestyle?.guestPolicy || "",
    },
  });
  
  const router = useRouter();

  const genderOptions = [
    { id: "male", label: "Male", icon: Mars },
    { id: "female", label: "Female", icon: Venus },
    { id: "other", label: "Other", icon: Users },
  ];

  const languageOptions = [
    "English",
    "Spanish", 
    "French",
    "German",
    "Italian",
    "Portuguese",
    "Chinese",
    "Japanese",
    "Korean",
    "Arabic",
    "Hindi",
    "Other"
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

  const careerStageOptions = [
    { id: "student", label: "Student", icon: GraduationCap, description: "College or university student" },
    { id: "professional", label: "Professional", icon: Briefcase, description: "Working professional" },
    { id: "retired", label: "Retired", icon: Armchair, description: "Retired or semi-retired" },
    { id: "no-preference", label: "No Preference", icon: Users, description: "Open to any career stage" }
  ];

  const helpExpectedOptions = [
    { id: "cleaning", label: "Cleaning", icon: Sparkles },
    { id: "cooking", label: "Cooking", icon: Salad },
    { id: "gardening", label: "Yard Work", icon: Flower },
    { id: "errands", label: "Shopping & Errands", icon: ShoppingBag },
    { id: "companionship", label: "Companionship", icon: HeartHandshake },
    { id: "petCare", label: "Pet Care", icon: Cat },
    { id: "techSupport", label: "Tech Support", icon: Monitor },
    { id: "homeMaintenance", label: "Home Maintenance", icon: Wrench },
    { id: "transportation", label: "Transportation", icon: Car },
    { id: "none", label: "No Assistance Expected", icon: Home }
  ];

  const numberOfPeopleOptions = [
    { value: "1", label: "1 person (just me)", description: "I live alone" },
    { value: "2", label: "2 people", description: "I live with one other person" },
    { value: "3", label: "3 people", description: "I live with 2 other people" },
    { value: "4+", label: "4+ people", description: "I live with 3 or more people" }
  ];

  const smokingPolicyOptions = [
    { id: "no-smoking", label: "No Smoking", description: "Smoking is not allowed anywhere on the property" },
    { id: "outdoor-only", label: "Outdoor Only", description: "Smoking is allowed outside only" },
    { id: "smoking-allowed", label: "Smoking Allowed", description: "Smoking is allowed both indoors and outdoors" }
  ];

  const guestPolicyOptions = [
    { id: "always-welcome", label: "Always Welcome", description: "Guests are welcome anytime with notice" },
    { id: "occasional", label: "Occasional Guests", description: "Guests are welcome occasionally with advance notice" },
    { id: "rare", label: "Rare Guests", description: "Prefer to keep guest visits to a minimum" },
    { id: "no-guests", label: "No Guests", description: "Prefer no overnight guests" }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate all required fields from signup wizard
    if (!isFormValid()) {
      toast.error("Please complete all required fields before saving your profile");
      return;
    }

    setIsSubmitting(true);

    try {
      // Update basic user info if changed
      if (formData.firstName !== firstName || formData.lastName !== lastName) {
        const userFormData = new FormData();
        userFormData.append("firstName", formData.firstName);
        userFormData.append("lastName", formData.lastName);
        
        const userResult = await UpdateUserSettings(null, userFormData);
        if (userResult.status === "error") {
          throw new Error(userResult.message || "Failed to update basic information");
        }
      }

      // Update profile-specific info
      const profileData = {
        bio: formData.bio,
        profilePicture: formData.profilePicture,
        gender: formData.gender,
        ageRange: formData.ageRange,
        schedule: formData.schedule,
        socialPreference: formData.socialPreference,
        hobbies: formData.hobbies,
        preferredCareerStage: formData.preferredCareerStage,
        preferredGender: formData.preferredGender,
        socialMedia: formData.socialMedia,
        lifestyle: {
          ...formData.lifestyle,
          language: formData.language,
          dateOfBirth: formData.dateOfBirth,
          helpExpected: formData.helpExpected,
        },
      };
      
      const result = await updateHomeownerProfile(profileData);
      
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

  const handleHelpExpectedToggle = (helpId: string) => {
    const currentHelp = formData.helpExpected || [];
    
    // If "none" is selected, clear all others
    if (helpId === "none") {
      setFormData(prev => ({
        ...prev,
        helpExpected: currentHelp.includes("none") ? [] : ["none"]
      }));
      return;
    }
    
    // If selecting something other than "none", remove "none" if it's selected
    const filteredHelp = currentHelp.filter((id: string) => id !== "none");
    const updatedHelp = filteredHelp.includes(helpId)
      ? filteredHelp.filter((id: string) => id !== helpId)
      : [...filteredHelp, helpId];
    
    setFormData(prev => ({
      ...prev,
      helpExpected: updatedHelp
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

  const handleSocialMediaChange = (platform: keyof typeof formData.socialMedia, value: string) => {
    setFormData(prev => ({
      ...prev,
      socialMedia: {
        ...prev.socialMedia,
        [platform]: value
      }
    }));
  };

  const validateAndFormatSocialLink = (platform: string, value: string) => {
    if (!value.trim()) return value;
    
    const trimmedValue = value.trim();
    
    switch (platform) {
      case 'instagram':
        if (!trimmedValue.includes('instagram.com')) {
          return `https://instagram.com/${trimmedValue.replace('@', '')}`;
        }
        return trimmedValue.startsWith('http') ? trimmedValue : `https://${trimmedValue}`;
      
      case 'facebook':
        if (!trimmedValue.includes('facebook.com')) {
          return `https://facebook.com/${trimmedValue}`;
        }
        return trimmedValue.startsWith('http') ? trimmedValue : `https://${trimmedValue}`;
      
      case 'linkedin':
        if (!trimmedValue.includes('linkedin.com')) {
          return `https://linkedin.com/in/${trimmedValue}`;
        }
        return trimmedValue.startsWith('http') ? trimmedValue : `https://${trimmedValue}`;
      
      default:
        return trimmedValue;
    }
  };

  // Upload functionality
  const { startUpload, isUploading } = useUploadThing("profilePictureUpload", {
    onClientUploadComplete: (res) => {
      if (res && res[0]) {
        setFormData(prev => ({ ...prev, profilePicture: res[0].url }));
        toast.success("Profile picture uploaded successfully!");
      }
    },
    onUploadError: (error: Error) => {
      toast.error("Upload failed. Please try again.");
    },
  });

  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const ProfilePictureUpload = useCallback(({ currentPicture, onRemove }: { currentPicture: string; onRemove: () => void }) => {
    const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;

      // Check file size (8MB limit)
      const maxSize = 8 * 1024 * 1024; // 8MB in bytes
      if (file.size > maxSize) {
        toast.error("File size must be less than 8MB");
        return;
      }

      try {
        await startUpload([file]);
      } catch (error) {
        toast.error("Upload failed. Please try again.");
      }
    };

    return (
      <div className="flex flex-col items-center space-y-4">
        <div className="relative">
          {currentPicture ? (
            <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg">
              <Image
                src={currentPicture}
                alt="Profile"
                fill
                className="object-cover"
              />
              <button
                type="button"
                onClick={onRemove}
                className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                disabled={isUploading}
              >
                <X size={14} />
              </button>
            </div>
          ) : (
            <div className="w-32 h-32 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer">
              <div className="text-center">
                <Camera className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <span className="text-sm text-gray-500">Add Photo</span>
              </div>
            </div>
          )}
          
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="absolute -bottom-2 -right-2 w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center hover:bg-primary/90 transition-colors shadow-lg"
          >
            {isUploading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Upload className="w-5 h-5" />
            )}
          </button>
        </div>
        
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleUpload}
          className="hidden"
          disabled={isUploading}
        />
        
        <p className="text-xs text-gray-500 text-center max-w-xs">
          Upload a clear photo of yourself. Max file size: 8MB
        </p>
      </div>
    );
  }, [isUploading, startUpload]);
  
  // Comprehensive validation function that matches signup wizard requirements
  const isFormValid = () => {
    // Step 1: Demographics validation - firstName, lastName, dateOfBirth, language, gender
    if (!formData.firstName.trim()) return false;
    if (!formData.lastName.trim()) return false;
    if (!formData.dateOfBirth) return false;
    if (!formData.language) return false;
    if (!formData.gender) return false;

    // Step 2: Profile Picture validation
    if (!formData.profilePicture) return false;

    // Step 3: Lifestyle validation - schedule, socialPreference
    if (!formData.schedule) return false;
    if (!formData.socialPreference) return false;

    // Step 4: Preferences validation - numberOfPeople, smokingPolicy, guestPolicy, pets
    if (!formData.lifestyle.numberOfPeople) return false;
    if (!formData.lifestyle.smokingPolicy) return false;
    if (!formData.lifestyle.guestPolicy) return false;
    
    // Pet validation - if has pets, must have description with at least 25 characters
    if (formData.lifestyle.hasPets && formData.lifestyle.petDescription.trim().length < 25) {
      return false;
    }

    // Step 5: Match Preferences validation - preferredGender, preferredCareerStage
    if (!formData.preferredGender) return false;
    if (!formData.preferredCareerStage) return false;

    // Step 6: Bio validation - must have content
    if (!formData.bio.trim()) return false;

    return true;
  };

  // Get missing fields for user feedback
  const getMissingFields = () => {
    const missing: string[] = [];

    if (!formData.firstName.trim()) missing.push("First Name");
    if (!formData.lastName.trim()) missing.push("Last Name");
    if (!formData.dateOfBirth) missing.push("Date of Birth");
    if (!formData.language) missing.push("Primary Language");
    if (!formData.gender) missing.push("Gender");
    if (!formData.profilePicture) missing.push("Profile Picture");
    if (!formData.schedule) missing.push("Schedule Preference");
    if (!formData.socialPreference) missing.push("Social Preference");
    if (!formData.lifestyle.numberOfPeople) missing.push("Household Size");
    if (!formData.lifestyle.smokingPolicy) missing.push("Smoking Policy");
    if (!formData.lifestyle.guestPolicy) missing.push("Guest Policy");
    if (formData.lifestyle.hasPets && formData.lifestyle.petDescription.trim().length < 25) {
      missing.push("Pet Description (minimum 25 characters)");
    }
    if (!formData.preferredGender) missing.push("Gender Preference");
    if (!formData.preferredCareerStage) missing.push("Preferred Career Stage");
    if (!formData.bio.trim()) missing.push("About You & Your Home");

    return missing;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Section Navigation */}
        <div className="sticky top-4 z-10 mb-8">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
            <div className="flex flex-wrap gap-2 justify-center">
              <button
                type="button"
                onClick={() => {
                  const element = document.getElementById('about-section');
                  if (element) {
                    const yOffset = -100;
                    const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
                    window.scrollTo({ top: y, behavior: 'smooth' });
                  }
                }}
                className="px-3 py-2 text-xs font-medium text-gray-600 hover:text-primary hover:bg-primary/5 rounded-lg transition-colors"
              >
                About You
              </button>
              <button
                type="button"
                onClick={() => {
                  const element = document.getElementById('lifestyle-section');
                  if (element) {
                    const yOffset = -100;
                    const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
                    window.scrollTo({ top: y, behavior: 'smooth' });
                  }
                }}
                className="px-3 py-2 text-xs font-medium text-gray-600 hover:text-primary hover:bg-primary/5 rounded-lg transition-colors"
              >
                Lifestyle
              </button>
              <button
                type="button"
                onClick={() => {
                  const element = document.getElementById('home-section');
                  if (element) {
                    const yOffset = -100;
                    const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
                    window.scrollTo({ top: y, behavior: 'smooth' });
                  }
                }}
                className="px-3 py-2 text-xs font-medium text-gray-600 hover:text-primary hover:bg-primary/5 rounded-lg transition-colors"
              >
                Home & Preferences
              </button>
              <button
                type="button"
                onClick={() => {
                  const element = document.getElementById('match-section');
                  if (element) {
                    const yOffset = -100;
                    const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
                    window.scrollTo({ top: y, behavior: 'smooth' });
                  }
                }}
                className="px-3 py-2 text-xs font-medium text-gray-600 hover:text-primary hover:bg-primary/5 rounded-lg transition-colors"
              >
                Match Preferences
              </button>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* About You Section */}
          <div id="about-section" className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-100 bg-primary/5">
              <h2 className="text-xl font-medium text-primary">About You</h2>
            </div>
            <div className="px-6 py-6 space-y-8">
              {/* Profile Picture */}
              <div className="text-center">
                <div className="mb-4">
                  <ProfilePictureUpload 
                    currentPicture={formData.profilePicture}
                    onRemove={() => setFormData(prev => ({ ...prev, profilePicture: "" }))}
                  />
                </div>
              </div>

              {/* Name */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName" className="text-sm font-medium text-gray-700 mb-2 block">
                    First Name
                  </Label>
                  <Input
                    id="firstName"
                    placeholder="Your first name"
                    value={formData.firstName}
                    onChange={(e) => handleInputChange("firstName", e.target.value)}
                    className="h-12 border-gray-200 rounded-xl focus:border-primary focus:ring-0 text-gray-900"
                  />
                </div>
                <div>
                  <Label htmlFor="lastName" className="text-sm font-medium text-gray-700 mb-2 block">
                    Last Name
                  </Label>
                  <Input
                    id="lastName"
                    placeholder="Your last name"
                    value={formData.lastName}
                    onChange={(e) => handleInputChange("lastName", e.target.value)}
                    className="h-12 border-gray-200 rounded-xl focus:border-primary focus:ring-0 text-gray-900"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <Label htmlFor="email" className="text-sm font-medium text-gray-700 mb-2 block">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  disabled
                  className="h-12 border-gray-200 rounded-xl bg-gray-50 text-gray-500"
                />
                <p className="text-xs text-gray-500 mt-2">
                  Email cannot be changed from here
                </p>
              </div>

              {/* Date of Birth */}
              <div>
                <Label htmlFor="dateOfBirth" className="text-sm font-medium text-gray-700 mb-2 block">
                  Date of Birth
                </Label>
                <Input
                  id="dateOfBirth"
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={(e) => handleInputChange("dateOfBirth", e.target.value)}
                  className="h-12 border-gray-200 rounded-xl focus:border-primary focus:ring-0 text-gray-900"
                />
              </div>

              {/* Language */}
              <div>
                <Label htmlFor="language" className="text-sm font-medium text-gray-700 mb-2 block">
                  Primary Language
                </Label>
                <select
                  id="language"
                  value={formData.language}
                  onChange={(e) => handleInputChange("language", e.target.value)}
                  className="h-12 w-full border border-gray-200 rounded-xl focus:border-primary focus:ring-0 text-gray-900 px-3"
                >
                  <option value="">Select language</option>
                  {languageOptions.map((lang) => (
                    <option key={lang} value={lang}>{lang}</option>
                  ))}
                </select>
              </div>

              {/* Gender */}
              <div>
                <Label className="text-sm font-medium text-gray-700 mb-4 block">
                  Gender
                </Label>
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
                          <div className="flex flex-col items-center p-4 rounded-xl border-2 peer-checked:border-primary peer-checked:bg-primary/5 hover:bg-gray-50 h-full transition-all">
                            <div className="w-12 h-12 rounded-full bg-gray-100 mb-3 flex items-center justify-center">
                              <Icon size={24} className="text-gray-600" />
                            </div>
                            <span className="font-medium text-center text-sm">{option.label}</span>
                          </div>
                        </label>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Bio */}
              <div>
                <Label htmlFor="bio" className="text-sm font-medium text-gray-700 mb-2 block">
                  About You & Your Home
                </Label>
                <Textarea
                  id="bio"
                  placeholder="Tell potential housemates about yourself, your home, and what you're looking for..."
                  value={formData.bio}
                  onChange={(e) => handleInputChange("bio", e.target.value)}
                  rows={6}
                  className="border-gray-200 rounded-xl focus:border-primary focus:ring-0 text-gray-900"
                />
              </div>

              {/* Social Media */}
              <div>
                <Label className="text-sm font-medium text-gray-700 mb-4 block">
                  Social Media (Optional)
                </Label>
                <p className="text-xs text-gray-500 mb-4">
                  Adding social media links can help potential housemates get to know you better
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Instagram */}
                  <div>
                    <Label htmlFor="instagram" className="text-xs font-medium text-gray-600 mb-2 flex items-center gap-2">
                      <Instagram className="w-4 h-4" />
                      Instagram
                    </Label>
                    <Input
                      id="instagram"
                      placeholder="@username or URL"
                      value={formData.socialMedia.instagram}
                      onChange={(e) => handleSocialMediaChange("instagram", e.target.value)}
                      onBlur={(e) => {
                        const formatted = validateAndFormatSocialLink('instagram', e.target.value);
                        handleSocialMediaChange("instagram", formatted);
                      }}
                      className="h-10 border-gray-200 rounded-lg focus:border-primary focus:ring-0"
                    />
                  </div>

                  {/* Facebook */}
                  <div>
                    <Label htmlFor="facebook" className="text-xs font-medium text-gray-600 mb-2 flex items-center gap-2">
                      <Facebook className="w-4 h-4" />
                      Facebook
                    </Label>
                    <Input
                      id="facebook"
                      placeholder="Profile name or URL"
                      value={formData.socialMedia.facebook}
                      onChange={(e) => handleSocialMediaChange("facebook", e.target.value)}
                      onBlur={(e) => {
                        const formatted = validateAndFormatSocialLink('facebook', e.target.value);
                        handleSocialMediaChange("facebook", formatted);
                      }}
                      className="h-10 border-gray-200 rounded-lg focus:border-primary focus:ring-0"
                    />
                  </div>

                  {/* LinkedIn */}
                  <div>
                    <Label htmlFor="linkedin" className="text-xs font-medium text-gray-600 mb-2 flex items-center gap-2">
                      <Linkedin className="w-4 h-4" />
                      LinkedIn
                    </Label>
                    <Input
                      id="linkedin"
                      placeholder="Profile name or URL"
                      value={formData.socialMedia.linkedin}
                      onChange={(e) => handleSocialMediaChange("linkedin", e.target.value)}
                      onBlur={(e) => {
                        const formatted = validateAndFormatSocialLink('linkedin', e.target.value);
                        handleSocialMediaChange("linkedin", formatted);
                      }}
                      className="h-10 border-gray-200 rounded-lg focus:border-primary focus:ring-0"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Lifestyle Section */}
          <div id="lifestyle-section" className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-100 bg-primary/5">
              <h2 className="text-xl font-medium text-primary">Lifestyle</h2>
            </div>
            <div className="px-6 py-6 space-y-8">
              {/* Schedule */}
              <div>
                <Label className="text-sm font-medium text-gray-700 mb-4 block">
                  Schedule Preference
                </Label>
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
                          <div className="flex flex-col items-center p-4 rounded-xl border-2 peer-checked:border-primary peer-checked:bg-primary/5 hover:bg-gray-50 h-full transition-all">
                            <div className="w-12 h-12 rounded-full bg-gray-100 mb-3 flex items-center justify-center">
                              <Icon size={24} className="text-gray-600" />
                            </div>
                            <span className="font-medium text-center text-sm">{option.label}</span>
                          </div>
                        </label>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Social Preference */}
              <div>
                <Label className="text-sm font-medium text-gray-700 mb-4 block">
                  Social Preference
                </Label>
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
                          <div className="flex flex-col items-center p-4 rounded-xl border-2 peer-checked:border-primary peer-checked:bg-primary/5 hover:bg-gray-50 h-full transition-all">
                            <div className="w-12 h-12 rounded-full bg-gray-100 mb-3 flex items-center justify-center">
                              <Icon size={24} className="text-gray-600" />
                            </div>
                            <span className="font-medium text-center text-sm">{option.label}</span>
                          </div>
                        </label>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Hobbies */}
              <div>
                <Label className="text-sm font-medium text-gray-700 mb-4 block">
                  Hobbies & Interests
                </Label>
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
                          <div className="flex flex-col items-center p-4 rounded-xl border-2 peer-checked:border-primary peer-checked:bg-primary/5 hover:bg-gray-50 h-full transition-all">
                            <div className="w-12 h-12 rounded-full bg-gray-100 mb-3 flex items-center justify-center">
                              <Icon size={20} className="text-gray-600" />
                            </div>
                            <span className="font-medium text-center text-xs">{option.label}</span>
                          </div>
                        </label>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Home & Preferences Section */}
          <div id="home-section" className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-100 bg-primary/5">
              <h2 className="text-xl font-medium text-primary">Home & Preferences</h2>
            </div>
            <div className="px-6 py-6 space-y-8">
              {/* Pets */}
              <div>
                <Label className="text-sm font-medium text-gray-700 mb-4 block">
                  Pets in the Home
                </Label>
                <div className="space-y-4">
                  <button
                    type="button"
                    onClick={() => handleLifestyleChange("hasPets", !formData.lifestyle.hasPets)}
                    className={`w-full flex items-center justify-between p-4 rounded-xl border-2 transition-all duration-200 ${
                      formData.lifestyle.hasPets 
                        ? "border-primary bg-primary/5 text-primary" 
                        : "border-gray-200 hover:border-gray-300 text-gray-600"
                    }`}
                  >
                    <span className="font-medium">I have pets in the home</span>
                    <div className={`w-6 h-6 rounded-full border-2 transition-colors ${
                      formData.lifestyle.hasPets 
                        ? 'border-primary bg-primary' 
                        : 'border-gray-300'
                    }`}>
                      {formData.lifestyle.hasPets && (
                        <svg className="w-4 h-4 text-white ml-0.5 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                        </svg>
                      )}
                    </div>
                  </button>
                  
                  {formData.lifestyle.hasPets && (
                    <div className="ml-3">
                      <Label className="text-sm font-medium text-gray-700 mb-2 block">
                        Please describe your pets:
                      </Label>
                      <Textarea
                        placeholder="e.g., Small, friendly dog that is house-trained and quiet, or two cats that are very independent"
                        value={formData.lifestyle.petDescription}
                        onChange={(e) => handleLifestyleChange("petDescription", e.target.value)}
                        rows={3}
                        className={`border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200 ${
                          formData.lifestyle.hasPets && formData.lifestyle.petDescription.trim().length < 25
                            ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
                            : ''
                        }`}
                      />
                      <div className="flex justify-between items-center mt-2">
                        <div className="text-sm">
                          {formData.lifestyle.hasPets && formData.lifestyle.petDescription.trim().length < 25 ? (
                            <span className="text-red-600">
                              Please provide at least 25 characters to help housemates understand your pets
                            </span>
                          ) : (
                            <span className="text-gray-500">
                              Help potential housemates understand your pets better
                            </span>
                          )}
                        </div>
                        <span className={`text-sm ${
                          formData.lifestyle.hasPets && formData.lifestyle.petDescription.trim().length < 25
                            ? 'text-red-600'
                            : 'text-gray-500'
                        }`}>
                          {formData.lifestyle.petDescription.trim().length}/25 min
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Household Size */}
              <div>
                <Label className="text-sm font-medium text-gray-700 mb-4 block">
                  Current Household Size
                </Label>
                <div className="space-y-3">
                  {numberOfPeopleOptions.map((option) => {
                    const isSelected = formData.lifestyle.numberOfPeople === option.value;
                    
                    return (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => handleLifestyleChange("numberOfPeople", option.value)}
                        className={`w-full flex items-center justify-between p-4 rounded-xl border-2 transition-all duration-200 text-left ${
                          isSelected
                            ? "border-primary bg-primary/5 text-primary"
                            : "border-gray-200 hover:border-gray-300 text-gray-600"
                        }`}
                      >
                        <div>
                          <span className="font-medium block">{option.label}</span>
                          <span className="text-sm opacity-75">{option.description}</span>
                        </div>
                        <div className={`w-5 h-5 rounded-full border-2 transition-colors ${
                          isSelected 
                            ? 'border-primary bg-primary' 
                            : 'border-gray-300'
                        }`}>
                          {isSelected && (
                            <div className="w-full h-full rounded-full bg-white scale-50"></div>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Smoking Policy */}
              <div>
                <Label className="text-sm font-medium text-gray-700 mb-4 block">
                  Smoking Policy
                </Label>
                <div className="space-y-3">
                  {smokingPolicyOptions.map((option) => {
                    const isSelected = formData.lifestyle.smokingPolicy === option.id;
                    
                    return (
                      <button
                        key={option.id}
                        type="button"
                        onClick={() => handleLifestyleChange("smokingPolicy", option.id)}
                        className={`w-full flex items-center justify-between p-4 rounded-xl border-2 transition-all duration-200 text-left ${
                          isSelected
                            ? "border-primary bg-primary/5 text-primary"
                            : "border-gray-200 hover:border-gray-300 text-gray-600"
                        }`}
                      >
                        <div>
                          <span className="font-medium block">{option.label}</span>
                          <span className="text-sm opacity-75">{option.description}</span>
                        </div>
                        <div className={`w-5 h-5 rounded-full border-2 transition-colors ${
                          isSelected 
                            ? 'border-primary bg-primary' 
                            : 'border-gray-300'
                        }`}>
                          {isSelected && (
                            <div className="w-full h-full rounded-full bg-white scale-50"></div>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Guest Policy */}
              <div>
                <Label className="text-sm font-medium text-gray-700 mb-4 block">
                  Guest Policy
                </Label>
                <div className="space-y-3">
                  {guestPolicyOptions.map((option) => {
                    const isSelected = formData.lifestyle.guestPolicy === option.id;
                    
                    return (
                      <button
                        key={option.id}
                        type="button"
                        onClick={() => handleLifestyleChange("guestPolicy", option.id)}
                        className={`w-full flex items-center justify-between p-4 rounded-xl border-2 transition-all duration-200 text-left ${
                          isSelected
                            ? "border-primary bg-primary/5 text-primary"
                            : "border-gray-200 hover:border-gray-300 text-gray-600"
                        }`}
                      >
                        <div>
                          <span className="font-medium block">{option.label}</span>
                          <span className="text-sm opacity-75">{option.description}</span>
                        </div>
                        <div className={`w-5 h-5 rounded-full border-2 transition-colors ${
                          isSelected 
                            ? 'border-primary bg-primary' 
                            : 'border-gray-300'
                        }`}>
                          {isSelected && (
                            <div className="w-full h-full rounded-full bg-white scale-50"></div>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Match Preferences Section */}
          <div id="match-section" className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-100 bg-primary/5">
              <h2 className="text-xl font-medium text-primary">Match Preferences</h2>
            </div>
            <div className="px-6 py-6 space-y-8">
              {/* Preferred Career Stage */}
              <div>
                <Label className="text-sm font-medium text-gray-700 mb-4 block">
                  Preferred Career Stage
                </Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {careerStageOptions.map((option) => {
                    const Icon = option.icon;
                    const isSelected = formData.preferredCareerStage === option.id;
                    
                    return (
                      <button
                        key={option.id}
                        type="button"
                        onClick={() => handleSingleSelect("preferredCareerStage", option.id)}
                        className={`flex items-start p-6 rounded-xl border-2 transition-all duration-200 text-left ${
                          isSelected
                            ? "border-primary bg-primary/5 text-primary"
                            : "border-gray-200 hover:border-gray-300 text-gray-600"
                        }`}
                      >
                        <div className={`w-12 h-12 rounded-full mr-4 mt-1 flex items-center justify-center flex-shrink-0 ${
                          isSelected ? "bg-primary/10" : "bg-gray-100"
                        }`}>
                          <Icon className="w-6 h-6" />
                        </div>
                        <div className="flex-1">
                          <span className="font-medium text-lg block">{option.label}</span>
                          <span className="text-sm opacity-75 mt-1 block">{option.description}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Preferred Gender */}
              <div>
                <Label className="text-sm font-medium text-gray-700 mb-4 block">
                  Gender Preference
                </Label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {genderOptions.map((option) => {
                    const Icon = option.icon;
                    const isSelected = formData.preferredGender === option.id;
                    
                    return (
                      <button
                        key={option.id}
                        type="button"
                        onClick={() => handleSingleSelect("preferredGender", option.id)}
                        className={`flex flex-col items-center p-6 rounded-xl border-2 transition-all duration-200 ${
                          isSelected
                            ? "border-primary bg-primary/5 text-primary"
                            : "border-gray-200 hover:border-gray-300 text-gray-600"
                        }`}
                      >
                        <div className={`w-12 h-12 rounded-full mb-3 flex items-center justify-center ${
                          isSelected ? "bg-primary/10" : "bg-gray-100"
                        }`}>
                          <Icon className="w-6 h-6" />
                        </div>
                        <span className="font-medium">{option.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Help Expected */}
              <div>
                <Label className="text-sm font-medium text-gray-700 mb-4 block">
                  Assistance You Might Appreciate
                </Label>
                <p className="text-sm text-gray-600 mb-4">
                  What kind of help would you appreciate from a housemate? (optional, select all that apply)
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {helpExpectedOptions.map((option) => {
                    const Icon = option.icon;
                    const isSelected = formData.helpExpected?.includes(option.id) || false;
                    
                    return (
                      <div key={option.id}>
                        <label className="cursor-pointer">
                          <input
                            type="checkbox"
                            className="sr-only peer"
                            checked={isSelected}
                            onChange={() => handleHelpExpectedToggle(option.id)}
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
            </div>
          </div>

          {/* Submit Button */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            {!isFormValid() && (
              <div className="mb-4 p-4 bg-amber-50 border border-amber-200 rounded-xl">
                <h4 className="font-medium text-amber-800 mb-2">Complete Required Fields</h4>
                <p className="text-sm text-amber-700 mb-3">
                  The following fields are required to save your profile:
                </p>
                <ul className="text-sm text-amber-700 space-y-1">
                  {getMissingFields().map((field, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-amber-600 rounded-full"></span>
                      {field}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <Button
              type="submit"
              disabled={isSubmitting || !isFormValid()}
              className={`w-full h-14 text-lg rounded-xl font-semibold transition-colors duration-200 ${
                isFormValid() 
                  ? "bg-primary hover:bg-primary/90 text-white" 
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Updating Profile...
                </>
              ) : (
                "Update Profile"
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
} 