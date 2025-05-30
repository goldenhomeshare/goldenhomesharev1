"use client";

import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { updateHousemateProfile } from "@/app/actions/profile-actions";
import { useRouter } from "next/navigation";
import { Loader2, User, Users, UserCheck, UserMinus, Sunrise, Moon, Clock, Heart, Coffee, Book, Tv, HandHeart, Dumbbell, Church, Palette, Music, Laptop, PawPrint, Gamepad2, Flower, Baby, GraduationCap, Briefcase, Crown, Scale, PartyPopper, UserX, Dice6, ChefHat, CircleDot, UserCircle, CircleDashed, Camera, Armchair, CigaretteOff, Upload, X, Sparkles, Salad, ShoppingBag, HeartHandshake, Cat, Wrench, Shield, MapPin, UserPlus } from "lucide-react";
import { toast } from "sonner";
import { useUploadThing } from "@/app/lib/uploadthing";
import Image from "next/image";
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
    dateOfBirth: initialData?.lifestyle?.dateOfBirth || "",
    language: initialData?.lifestyle?.language || "",
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
    canHelpWith: initialData?.canHelpWith || [],
    location: {
      city: initialData?.lifestyle?.location?.city || "",
      state: initialData?.lifestyle?.location?.state || "",
    },
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
      guestPolicy: initialData?.lifestyle?.guestPolicy || "",
    },
    education: {
      level: initialData?.lifestyle?.education?.level || "",
      stillAttending: initialData?.lifestyle?.education?.stillAttending || false,
      degreeProgram: initialData?.lifestyle?.education?.degreeProgram || "",
    },
    occupationDetails: {
      isRetired: initialData?.lifestyle?.occupationDetails?.isRetired || false,
      description: initialData?.lifestyle?.occupationDetails?.description || "",
    },
  });
  
  const router = useRouter();

  const genderOptions = [
    { id: "male", label: "Male", icon: UserCircle },
    { id: "female", label: "Female", icon: User },
    { id: "other", label: "Other", icon: CircleDashed },
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

  const educationLevels = [
    "High School",
    "Some College",
    "Associate's Degree",
    "Bachelor's Degree",
    "Master's Degree",
    "Doctoral Degree",
    "Professional Degree",
    "Trade/Vocational School",
    "Other"
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

  const supportOptions = [
    { id: "cleaning", label: "Cleaning", icon: Sparkles },
    { id: "cooking", label: "Cooking", icon: Salad },
    { id: "gardening", label: "Gardening", icon: Flower },
    { id: "errands", label: "Errands", icon: ShoppingBag },
    { id: "companionship", label: "Companionship", icon: HeartHandshake },
    { id: "petCare", label: "Pet Care", icon: Cat },
    { id: "techSupport", label: "Tech Support", icon: Wrench },
    { id: "homeSecurity", label: "Home Security", icon: Shield },
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
        lifestyle: {
          ...formData.lifestyle,
          dateOfBirth: formData.dateOfBirth,
          language: formData.language,
          education: formData.education,
          occupationDetails: formData.occupationDetails,
          location: formData.location,
        },
        canHelpWith: formData.canHelpWith,
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

  // Comprehensive validation function that matches signup wizard requirements
  const isFormValid = () => {
    // Step 1: Location validation - city, state
    if (!formData.location.city.trim()) return false;
    if (!formData.location.state.trim()) return false;

    // Step 2: Budget validation - maxBudget
    if (!formData.maxBudget) return false;

    // Step 3: Demographics validation - firstName, lastName, dateOfBirth, language, gender
    if (!formData.firstName.trim()) return false;
    if (!formData.lastName.trim()) return false;
    if (!formData.dateOfBirth) return false;
    if (!formData.language) return false;
    if (!formData.gender) return false;

    // Step 4: Profile Picture validation
    if (!formData.profilePicture) return false;

    // Step 5: Education & Occupation validation - at least one must be provided
    const hasEducation = formData.education.level;
    const hasOccupation = formData.occupationDetails.isRetired || formData.occupationDetails.description;
    if (!hasEducation && !hasOccupation) return false;

    // Step 6: Lifestyle validation - schedule, socialPreference
    if (!formData.schedule) return false;
    if (!formData.socialPreference) return false;

    // Step 7: Housemate Preferences validation - smokingStatus, guestPolicy, pets
    if (!formData.lifestyle.smokingStatus) return false;
    if (!formData.lifestyle.guestPolicy) return false;
    
    // Pet validation - if has pets, must have description with at least 25 characters
    if (formData.lifestyle.hasPets && formData.lifestyle.petDescription.trim().length < 25) {
      return false;
    }

    // Step 8: Match Preferences validation - preferredGender
    if (!formData.preferredGender) return false;

    // Step 9: Bio validation - must have content
    if (!formData.bio.trim()) return false;

    return true;
  };

  // Get missing fields for user feedback
  const getMissingFields = () => {
    const missing: string[] = [];

    if (!formData.location.city.trim()) missing.push("City");
    if (!formData.location.state.trim()) missing.push("State");
    if (!formData.maxBudget) missing.push("Maximum Budget");
    if (!formData.firstName.trim()) missing.push("First Name");
    if (!formData.lastName.trim()) missing.push("Last Name");
    if (!formData.dateOfBirth) missing.push("Date of Birth");
    if (!formData.language) missing.push("Primary Language");
    if (!formData.gender) missing.push("Gender");
    if (!formData.profilePicture) missing.push("Profile Picture");
    
    const hasEducation = formData.education.level;
    const hasOccupation = formData.occupationDetails.isRetired || formData.occupationDetails.description;
    if (!hasEducation && !hasOccupation) missing.push("Education Level or Occupation");
    
    if (!formData.schedule) missing.push("Schedule Preference");
    if (!formData.socialPreference) missing.push("Social Preference");
    if (!formData.lifestyle.smokingStatus) missing.push("Smoking Status");
    if (!formData.lifestyle.guestPolicy) missing.push("Guest Policy");
    if (formData.lifestyle.hasPets && formData.lifestyle.petDescription.trim().length < 25) {
      missing.push("Pet Description (minimum 25 characters)");
    }
    if (!formData.preferredGender) missing.push("Gender Preference");
    if (!formData.bio.trim()) missing.push("About You");

    return missing;
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

  const handleCanHelpWithToggle = (supportId: string) => {
    setFormData(prev => ({
      ...prev,
      canHelpWith: prev.canHelpWith.includes(supportId)
        ? prev.canHelpWith.filter((id: string) => id !== supportId)
        : [...prev.canHelpWith, supportId]
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

  const handleEducationChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      education: {
        ...prev.education,
        [field]: value
      }
    }));
  };

  const handleOccupationDetailsChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      occupationDetails: {
        ...prev.occupationDetails,
        [field]: value
      }
    }));
  };

  const handleLocationChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      location: {
        ...prev.location,
        [field]: value
      }
    }));
  };

  // Move the upload hook outside the callback
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

  // Move the ref outside the callback
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const ProfilePictureUpload = useCallback(({ currentPicture, onRemove }: { currentPicture: string; onRemove: () => void }) => {
    const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file) {
        await startUpload([file]);
      }
      // Reset the input so the same file can be selected again
      event.target.value = '';
    };

    return (
      <div className="space-y-4">
        <div 
          className={`relative w-32 h-32 rounded-full overflow-hidden border-4 border-gray-200 cursor-pointer group hover:border-gray-300 transition-colors mx-auto ${isUploading ? 'opacity-50' : ''}`}
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
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
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
          <div className="text-center">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onRemove}
              disabled={isUploading}
              className="rounded-xl border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-colors"
            >
              Remove Picture
            </Button>
          </div>
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
  }, [isUploading, startUpload]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Section Navigation */}
        <div className="sticky top-4 z-10 mb-8">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
            <div className="flex flex-wrap gap-3 justify-center">
              <button
                type="button"
                onClick={() => {
                  const element = document.getElementById('about-section');
                  if (element) {
                    const yOffset = -150; // Larger offset to ensure title visibility
                    const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
                    window.scrollTo({ top: y, behavior: 'smooth' });
                  }
                }}
                className="px-4 py-2.5 text-sm font-semibold text-gray-700 bg-gray-50 border border-gray-300 hover:bg-primary hover:text-white hover:border-primary rounded-lg transition-all duration-200 shadow-sm hover:shadow-md"
              >
                About You
              </button>
              <button
                type="button"
                onClick={() => {
                  const element = document.getElementById('location-section');
                  if (element) {
                    const yOffset = -150; // Larger offset to ensure title visibility
                    const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
                    window.scrollTo({ top: y, behavior: 'smooth' });
                  }
                }}
                className="px-4 py-2.5 text-sm font-semibold text-gray-700 bg-gray-50 border border-gray-300 hover:bg-primary hover:text-white hover:border-primary rounded-lg transition-all duration-200 shadow-sm hover:shadow-md"
              >
                Location
              </button>
              <button
                type="button"
                onClick={() => {
                  const element = document.getElementById('budget-section');
                  if (element) {
                    const yOffset = -150; // Larger offset to ensure title visibility
                    const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
                    window.scrollTo({ top: y, behavior: 'smooth' });
                  }
                }}
                className="px-4 py-2.5 text-sm font-semibold text-gray-700 bg-gray-50 border border-gray-300 hover:bg-primary hover:text-white hover:border-primary rounded-lg transition-all duration-200 shadow-sm hover:shadow-md"
              >
                Budget
              </button>
              <button
                type="button"
                onClick={() => {
                  const element = document.getElementById('education-section');
                  if (element) {
                    const yOffset = -150; // Larger offset to ensure title visibility
                    const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
                    window.scrollTo({ top: y, behavior: 'smooth' });
                  }
                }}
                className="px-4 py-2.5 text-sm font-semibold text-gray-700 bg-gray-50 border border-gray-300 hover:bg-primary hover:text-white hover:border-primary rounded-lg transition-all duration-200 shadow-sm hover:shadow-md"
              >
                Education & Work
              </button>
              <button
                type="button"
                onClick={() => {
                  const element = document.getElementById('lifestyle-section');
                  if (element) {
                    const yOffset = -150; // Larger offset to ensure title visibility
                    const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
                    window.scrollTo({ top: y, behavior: 'smooth' });
                  }
                }}
                className="px-4 py-2.5 text-sm font-semibold text-gray-700 bg-gray-50 border border-gray-300 hover:bg-primary hover:text-white hover:border-primary rounded-lg transition-all duration-200 shadow-sm hover:shadow-md"
              >
                Lifestyle
              </button>
              <button
                type="button"
                onClick={() => {
                  const element = document.getElementById('preferences-section');
                  if (element) {
                    const yOffset = -150; // Larger offset to ensure title visibility
                    const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
                    window.scrollTo({ top: y, behavior: 'smooth' });
                  }
                }}
                className="px-4 py-2.5 text-sm font-semibold text-gray-700 bg-gray-50 border border-gray-300 hover:bg-primary hover:text-white hover:border-primary rounded-lg transition-all duration-200 shadow-sm hover:shadow-md"
              >
                Match Preferences
              </button>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* About You */}
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
                  max={new Date(new Date().setFullYear(new Date().getFullYear() - 18)).toISOString().split('T')[0]}
                />
                <p className="text-xs text-gray-500 mt-2">
                  You must be at least 18 years old to use our service
                </p>
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
                  className="h-12 w-full px-4 py-2 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:border-primary bg-white"
                >
                  <option value="">Select your primary language</option>
                  {languageOptions.map((lang) => (
                    <option key={lang} value={lang}>
                      {lang}
                    </option>
                  ))}
                </select>
              </div>

              {/* Gender */}
              <div>
                <Label className="text-sm font-medium text-gray-700 mb-4 block">
                  Gender
                </Label>
                <div className="grid grid-cols-3 gap-3">
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
                          <div className={`flex flex-col items-center p-4 rounded-xl border-2 transition-all duration-200 ${
                            isSelected 
                              ? 'border-primary bg-primary/5' 
                              : 'border-gray-200 hover:border-gray-300'
                          }`}>
                            <div className={`w-16 h-16 rounded-lg mb-3 flex items-center justify-center ${
                              isSelected ? 'bg-primary/10' : 'bg-gray-100'
                            }`}>
                              <Icon size={24} className={isSelected ? 'text-primary' : 'text-gray-600'} />
                            </div>
                            <span className="font-medium text-center text-sm text-gray-900 leading-tight">{option.label}</span>
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
                  Bio
                </Label>
                <Textarea
                  id="bio"
                  placeholder="Tell homeowners about yourself, your lifestyle, and what you're looking for in a home..."
                  value={formData.bio}
                  onChange={(e) => handleInputChange("bio", e.target.value)}
                  rows={6}
                  className="border-gray-200 rounded-xl focus:border-primary focus:ring-0 text-gray-900 leading-relaxed"
                />
                <p className="text-xs text-gray-500 mt-2">
                  Share what makes you unique and what you're looking for in a living situation
                </p>
              </div>

              {/* Social Media Links */}
              <div>
                <Label className="text-sm font-medium text-gray-700 mb-2 block">
                  Social Media Links
                </Label>
                <p className="text-xs text-gray-500 mb-4">
                  Optional: Add your social media profiles to help homeowners get to know you better
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="instagram" className="text-xs font-medium text-gray-600 mb-1 block">
                      Instagram
                    </Label>
                    <Input
                      id="instagram"
                      placeholder="https://instagram.com/username or @username"
                      value={formData.socialMedia.instagram}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        socialMedia: { ...prev.socialMedia, instagram: e.target.value }
                      }))}
                      onBlur={(e) => {
                        const value = e.target.value.trim();
                        if (value && !value.startsWith('http')) {
                          let formattedValue = value;
                          if (value.startsWith('@')) {
                            formattedValue = `https://instagram.com/${value.substring(1)}`;
                          } else if (!value.includes('instagram.com')) {
                            formattedValue = `https://instagram.com/${value}`;
                          } else if (!value.startsWith('https://')) {
                            formattedValue = `https://${value}`;
                          }
                          setFormData(prev => ({
                            ...prev,
                            socialMedia: { ...prev.socialMedia, instagram: formattedValue }
                          }));
                        }
                      }}
                      className="h-11 border-gray-200 rounded-xl focus:border-gray-400 focus:ring-0 text-gray-900"
                    />
                  </div>

                  <div>
                    <Label htmlFor="facebook" className="text-xs font-medium text-gray-600 mb-1 block">
                      Facebook
                    </Label>
                    <Input
                      id="facebook"
                      placeholder="https://facebook.com/username"
                      value={formData.socialMedia.facebook}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        socialMedia: { ...prev.socialMedia, facebook: e.target.value }
                      }))}
                      onBlur={(e) => {
                        const value = e.target.value.trim();
                        if (value && !value.startsWith('http')) {
                          let formattedValue = value;
                          if (!value.includes('facebook.com')) {
                            formattedValue = `https://facebook.com/${value}`;
                          } else if (!value.startsWith('https://')) {
                            formattedValue = `https://${value}`;
                          }
                          setFormData(prev => ({
                            ...prev,
                            socialMedia: { ...prev.socialMedia, facebook: formattedValue }
                          }));
                        }
                      }}
                      className="h-11 border-gray-200 rounded-xl focus:border-gray-400 focus:ring-0 text-gray-900"
                    />
                  </div>

                  <div>
                    <Label htmlFor="linkedin" className="text-xs font-medium text-gray-600 mb-1 block">
                      LinkedIn
                    </Label>
                    <Input
                      id="linkedin"
                      placeholder="https://linkedin.com/in/username"
                      value={formData.socialMedia.linkedin}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        socialMedia: { ...prev.socialMedia, linkedin: e.target.value }
                      }))}
                      onBlur={(e) => {
                        const value = e.target.value.trim();
                        if (value && !value.startsWith('http')) {
                          let formattedValue = value;
                          if (!value.includes('linkedin.com')) {
                            formattedValue = `https://linkedin.com/in/${value}`;
                          } else if (!value.startsWith('https://')) {
                            formattedValue = `https://${value}`;
                          }
                          setFormData(prev => ({
                            ...prev,
                            socialMedia: { ...prev.socialMedia, linkedin: formattedValue }
                          }));
                        }
                      }}
                      className="h-11 border-gray-200 rounded-xl focus:border-gray-400 focus:ring-0 text-gray-900"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Location */}
          <div id="location-section" className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-100 bg-primary/5">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <MapPin size={20} className="text-primary" />
                </div>
                <h2 className="text-xl font-medium text-primary">Location</h2>
              </div>
            </div>
            <div className="px-6 py-6">
              <div className="space-y-4">
                <p className="text-sm text-gray-600 mb-4">
                  Where are you looking for housing? This helps homeowners in your area find you.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="city" className="text-sm font-medium text-gray-700 mb-2 block">
                      City *
                    </Label>
                    <Input
                      id="city"
                      placeholder="e.g., San Francisco"
                      value={formData.location.city}
                      onChange={(e) => handleLocationChange("city", e.target.value)}
                      className="h-12 border-gray-200 rounded-xl focus:border-primary focus:ring-0 text-gray-900"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="state" className="text-sm font-medium text-gray-700 mb-2 block">
                      State *
                    </Label>
                    <Input
                      id="state"
                      placeholder="e.g., California"
                      value={formData.location.state}
                      onChange={(e) => handleLocationChange("state", e.target.value)}
                      className="h-12 border-gray-200 rounded-xl focus:border-primary focus:ring-0 text-gray-900"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Budget */}
          <div id="budget-section" className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-100 bg-primary/5">
              <h2 className="text-xl font-medium text-primary">Budget</h2>
            </div>
            <div className="px-6 py-6">
              <div>
                <Label htmlFor="maxBudget" className="text-sm font-medium text-gray-700 mb-2 block">
                  Maximum Budget (per month)
                </Label>
                <Input
                  id="maxBudget"
                  type="number"
                  placeholder="725"
                  value={formData.maxBudget}
                  onChange={(e) => handleInputChange("maxBudget", e.target.value)}
                  className="h-12 border-gray-200 rounded-xl focus:border-primary focus:ring-0 text-gray-900"
                />
              </div>
            </div>
          </div>

          {/* Education & Work */}
          <div id="education-section" className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-100 bg-primary/5">
              <h2 className="text-xl font-medium text-primary">Education & Work</h2>
            </div>
            <div className="px-6 py-6 space-y-8">
              {/* Education Section */}
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <GraduationCap size={24} className="text-primary" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900">Education</h3>
                </div>

                {/* Education Level */}
                <div>
                  <Label htmlFor="educationLevel" className="text-sm font-medium text-gray-700 mb-2 block">
                    Education Level
                  </Label>
                  <select
                    id="educationLevel"
                    value={formData.education.level}
                    onChange={(e) => handleEducationChange("level", e.target.value)}
                    className="h-12 w-full px-4 py-2 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:border-primary bg-white"
                  >
                    <option value="">Select your education level</option>
                    {educationLevels.map((level) => (
                      <option key={level} value={level}>
                        {level}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Still Attending */}
                {formData.education.level && (
                  <div>
                    <label className="cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={formData.education.stillAttending}
                        onChange={(e) => handleEducationChange("stillAttending", e.target.checked)}
                      />
                      <div className={`flex items-center p-4 rounded-xl border transition-colors ${
                        formData.education.stillAttending
                          ? 'border-primary bg-primary/5'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}>
                        <div className="flex-1">
                          <span className="font-medium text-gray-900">I am still attending/enrolled</span>
                        </div>
                        <div className={`w-5 h-5 rounded border transition-colors ${
                          formData.education.stillAttending 
                            ? 'border-primary bg-primary' 
                            : 'border-gray-300'
                        }`}>
                          {formData.education.stillAttending && (
                            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                            </svg>
                          )}
                        </div>
                      </div>
                    </label>
                  </div>
                )}

                {/* Degree Program */}
                {formData.education.level && (
                  <div>
                    <Label htmlFor="degreeProgram" className="text-sm font-medium text-gray-700 mb-2 block">
                      Degree Program / Field of Study
                    </Label>
                    <Input
                      id="degreeProgram"
                      placeholder="e.g., Computer Science, Business Administration, Nursing"
                      value={formData.education.degreeProgram}
                      onChange={(e) => handleEducationChange("degreeProgram", e.target.value)}
                      className="h-12 border-gray-200 rounded-xl focus:border-primary focus:ring-0 text-gray-900"
                    />
                    <p className="text-xs text-gray-500 mt-2">
                      What did you study or are currently studying?
                    </p>
                  </div>
                )}
              </div>

              {/* Occupation Section */}
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Briefcase size={24} className="text-primary" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900">Occupation</h3>
                </div>

                {/* Retired Option */}
                <div>
                  <label className="cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={formData.occupationDetails.isRetired}
                      onChange={(e) => handleOccupationDetailsChange("isRetired", e.target.checked)}
                    />
                    <div className={`flex items-center p-4 rounded-xl border transition-colors ${
                      formData.occupationDetails.isRetired
                        ? 'border-primary bg-primary/5'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}>
                      <div className="flex items-center gap-3 flex-1">
                        <Armchair size={20} className="text-gray-600" />
                        <span className="font-medium text-gray-900">I am retired</span>
                      </div>
                      <div className={`w-5 h-5 rounded border transition-colors ${
                        formData.occupationDetails.isRetired 
                          ? 'border-primary bg-primary' 
                          : 'border-gray-300'
                      }`}>
                        {formData.occupationDetails.isRetired && (
                          <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                          </svg>
                        )}
                      </div>
                    </div>
                  </label>
                </div>

                {/* Occupation Description */}
                {!formData.occupationDetails.isRetired && (
                  <div>
                    <Label htmlFor="occupationDescription" className="text-sm font-medium text-gray-700 mb-2 block">
                      What do you do for work?
                    </Label>
                    <Textarea
                      id="occupationDescription"
                      placeholder="Describe your job, profession, or current work situation..."
                      value={formData.occupationDetails.description}
                      onChange={(e) => handleOccupationDetailsChange("description", e.target.value)}
                      rows={4}
                      className="border-gray-200 rounded-xl focus:border-primary focus:ring-0 text-gray-900"
                    />
                    <p className="text-xs text-gray-500 mt-2">
                      This helps homeowners understand your background and schedule
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Lifestyle Preferences */}
          <div id="lifestyle-section" className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-100 bg-primary/5">
              <h2 className="text-xl font-medium text-primary">Lifestyle Preferences</h2>
            </div>
            <div className="px-6 py-6 space-y-8">
              {/* Schedule */}
              <div>
                <Label className="text-sm font-medium text-gray-700 mb-4 block">
                  Schedule
                </Label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
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
                          <div className={`flex flex-col items-center p-4 rounded-xl border-2 transition-all duration-200 min-h-[120px] ${
                            isSelected 
                              ? 'border-primary bg-primary/5' 
                              : 'border-gray-200 hover:border-gray-300'
                          }`}>
                            <div className={`w-16 h-16 rounded-lg mb-3 flex items-center justify-center ${
                              isSelected ? 'bg-primary/10' : 'bg-gray-100'
                            }`}>
                              <Icon size={24} className={isSelected ? 'text-primary' : 'text-gray-600'} />
                            </div>
                            <span className="font-medium text-center text-sm text-gray-900 leading-tight">{option.label}</span>
                          </div>
                        </label>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Social Preferences */}
              <div>
                <Label className="text-sm font-medium text-gray-700 mb-4 block">
                  Social Preferences
                </Label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
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
                          <div className={`flex flex-col items-center p-4 rounded-xl border-2 transition-all duration-200 min-h-[120px] ${
                            isSelected 
                              ? 'border-primary bg-primary/5' 
                              : 'border-gray-200 hover:border-gray-300'
                          }`}>
                            <div className={`w-16 h-16 rounded-lg mb-3 flex items-center justify-center ${
                              isSelected ? 'bg-primary/10' : 'bg-gray-100'
                            }`}>
                              <Icon size={24} className={isSelected ? 'text-primary' : 'text-gray-600'} />
                            </div>
                            <span className="font-medium text-center text-sm text-gray-900 leading-tight">{option.label}</span>
                          </div>
                        </label>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Hobbies/Interests */}
              <div>
                <Label className="text-sm font-medium text-gray-700 mb-2 block">
                  Hobbies & Interests
                </Label>
                <p className="text-xs text-gray-500 mb-4">Select all that apply</p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
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
                          <div className={`flex flex-col items-center p-3 rounded-xl border transition-all duration-200 ${
                            isSelected 
                              ? 'border-primary bg-primary/5' 
                              : 'border-gray-200 hover:border-gray-300'
                          }`}>
                            <div className={`w-12 h-12 rounded-lg mb-2 flex items-center justify-center ${
                              isSelected ? 'bg-primary/10' : 'bg-gray-100'
                            }`}>
                              <Icon size={20} className={isSelected ? 'text-primary' : 'text-gray-600'} />
                            </div>
                            <span className="font-medium text-center text-xs text-gray-900 leading-tight px-1">{option.label}</span>
                          </div>
                        </label>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Pet Information */}
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <PawPrint size={24} className="text-primary" />
                  </div>
                  <Label className="text-sm font-medium text-gray-700">Pets</Label>
                </div>
                
                <div className="space-y-3">
                  <label className="cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={formData.lifestyle.hasPets}
                      onChange={(e) => handleLifestyleChange("hasPets", e.target.checked)}
                    />
                    <div className={`flex items-center p-3 rounded-xl border transition-colors ${
                      formData.lifestyle.hasPets
                        ? 'border-primary bg-primary/5'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}>
                      <div className="flex-1">
                        <span className="font-medium text-sm text-gray-900">I have pets that I plan to bring</span>
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
                      <Label className="text-xs font-medium text-gray-600 mb-2 block">
                        Please describe your pets (type, size, behavior, etc.):
                      </Label>
                      <Textarea
                        placeholder="e.g., Small, friendly dog that is house-trained and quiet"
                        value={formData.lifestyle.petDescription}
                        onChange={(e) => handleLifestyleChange("petDescription", e.target.value)}
                        rows={3}
                        className={`border-gray-200 rounded-xl focus:border-primary focus:ring-0 text-gray-900 ${
                          formData.lifestyle.hasPets && formData.lifestyle.petDescription.trim().length < 25
                            ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
                            : ''
                        }`}
                      />
                      <div className="flex justify-between items-center mt-2">
                        <div className="text-sm">
                          {formData.lifestyle.hasPets && formData.lifestyle.petDescription.trim().length < 25 ? (
                            <span className="text-red-600">
                              Please provide at least 25 characters to help homeowners understand your pets
                            </span>
                          ) : (
                            <span className="text-gray-500">
                              Help potential homeowners understand your pets better
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

              {/* Number of People */}
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Users size={24} className="text-primary" />
                  </div>
                  <Label className="text-sm font-medium text-gray-700">Number of People</Label>
                </div>
                
                <div className="space-y-2">
                  <p className="text-xs text-gray-500">
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
                            <div className="flex items-center p-3 rounded-xl border border-gray-200 peer-checked:border-gray-400 peer-checked:bg-gray-50 hover:border-gray-300 transition-colors">
                              <div className="flex-1">
                                <span className="font-medium text-sm text-gray-900">{option.label}</span>
                              </div>
                              <div className={`w-4 h-4 rounded-full border-2 transition-colors ${
                                isSelected 
                                  ? 'border-gray-400 bg-gray-400' 
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
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <CigaretteOff size={24} className="text-primary" />
                  </div>
                  <Label className="text-sm font-medium text-gray-700">Smoking Status</Label>
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
                          <div className="flex items-center p-3 rounded-xl border border-gray-200 peer-checked:border-gray-400 peer-checked:bg-gray-50 hover:border-gray-300 transition-colors">
                            <div className="flex-1">
                              <span className="font-medium text-sm text-gray-900">{option.label}</span>
                            </div>
                            <div className={`w-4 h-4 rounded-full border-2 transition-colors ${
                              isSelected 
                                ? 'border-gray-400 bg-gray-400' 
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

              {/* Guest Policy */}
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <UserPlus size={24} className="text-primary" />
                  </div>
                  <Label className="text-sm font-medium text-gray-700">Guest Policy</Label>
                </div>
                
                <div className="space-y-2">
                  <p className="text-xs text-gray-500">
                    How often do you plan to have guests visit?
                  </p>
                  
                  <div className="space-y-2">
                    {[
                      { value: "rarely", label: "Rarely Have Guests" },
                      { value: "occasional", label: "Occasional Guests" },
                      { value: "moderate", label: "Moderate Guest Activity" },
                      { value: "frequent", label: "Frequent Guests" }
                    ].map((option) => {
                      const isSelected = formData.lifestyle.guestPolicy === option.value;
                      
                      return (
                        <div key={option.value}>
                          <label className="cursor-pointer">
                            <input
                              type="radio"
                              name="guestPolicy"
                              className="sr-only peer"
                              checked={isSelected}
                              onChange={() => handleLifestyleChange("guestPolicy", option.value)}
                            />
                            <div className="flex items-center p-3 rounded-xl border border-gray-200 peer-checked:border-gray-400 peer-checked:bg-gray-50 hover:border-gray-300 transition-colors">
                              <div className="flex-1">
                                <span className="font-medium text-sm text-gray-900">{option.label}</span>
                              </div>
                              <div className={`w-4 h-4 rounded-full border-2 transition-colors ${
                                isSelected 
                                  ? 'border-gray-400 bg-gray-400' 
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
            </div>
          </div>

          {/* Match Preferences */}
          <div id="preferences-section" className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-100 bg-primary/5">
              <h2 className="text-xl font-medium text-primary">Match Preferences</h2>
            </div>
            <div className="px-6 py-6 space-y-8">
              {/* Preferred Age Ranges */}
              <div>
                <Label className="text-sm font-medium text-gray-700 mb-2 block">
                  Preferred Age Ranges
                </Label>
                <p className="text-xs text-gray-500 mb-4">Select the age ranges you'd prefer to live with (select all that apply)</p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
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
                          <div className={`flex flex-col items-center p-3 rounded-xl border transition-all duration-200 ${
                            isSelected 
                              ? 'border-primary bg-primary/5' 
                              : 'border-gray-200 hover:border-gray-300'
                          }`}>
                            <div className={`w-12 h-12 rounded-lg mb-2 flex items-center justify-center ${
                              isSelected ? 'bg-primary/10' : 'bg-gray-100'
                            }`}>
                              <Icon size={20} className={isSelected ? 'text-primary' : 'text-gray-600'} />
                            </div>
                            <span className="font-medium text-center text-xs text-gray-900 leading-tight px-1">{option.label}</span>
                          </div>
                        </label>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Preferred Gender */}
              <div>
                <Label className="text-sm font-medium text-gray-700 mb-2 block">
                  Preferred Gender
                </Label>
                <p className="text-xs text-gray-500 mb-4">Select your preferred gender for living companions</p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
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
                          <div className={`flex flex-col items-center p-3 rounded-xl border transition-all duration-200 ${
                            isSelected 
                              ? 'border-primary bg-primary/5' 
                              : 'border-gray-200 hover:border-gray-300'
                          }`}>
                            <div className={`w-12 h-12 rounded-lg mb-2 flex items-center justify-center ${
                              isSelected ? 'bg-primary/10' : 'bg-gray-100'
                            }`}>
                              <Icon size={20} className={isSelected ? 'text-primary' : 'text-gray-600'} />
                            </div>
                            <span className="font-medium text-center text-xs text-gray-900 leading-tight px-1">{option.label}</span>
                          </div>
                        </label>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Services I Can Help With */}
              <div>
                <Label className="text-sm font-medium text-gray-700 mb-2 block">
                  Services I Can Help With
                </Label>
                <p className="text-xs text-gray-500 mb-4">Select the services you're willing and able to help homeowners with</p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {supportOptions.map((option) => {
                    const Icon = option.icon;
                    const isSelected = formData.canHelpWith.includes(option.id);
                    
                    return (
                      <div key={option.id}>
                        <label className="cursor-pointer">
                          <input
                            type="checkbox"
                            className="sr-only peer"
                            checked={isSelected}
                            onChange={() => handleCanHelpWithToggle(option.id)}
                          />
                          <div className={`flex flex-col items-center p-3 rounded-xl border transition-all duration-200 ${
                            isSelected 
                              ? 'border-primary bg-primary/5' 
                              : 'border-gray-200 hover:border-gray-300'
                          }`}>
                            <div className={`w-12 h-12 rounded-lg mb-2 flex items-center justify-center ${
                              isSelected ? 'bg-primary/10' : 'bg-gray-100'
                            }`}>
                              <Icon size={20} className={isSelected ? 'text-primary' : 'text-gray-600'} />
                            </div>
                            <span className="font-medium text-center text-xs text-gray-900 leading-tight px-1">{option.label}</span>
                          </div>
                        </label>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            {!isFormValid() && (
              <div className="w-full mb-4 p-4 bg-amber-50 border border-amber-200 rounded-xl">
                <h4 className="font-medium text-amber-800 mb-2">Complete Required Fields</h4>
                <p className="text-sm text-amber-700 mb-3">
                  The following fields are required to save your profile:
                </p>
                <ul className="text-sm text-amber-700 space-y-1 max-h-32 overflow-y-auto">
                  {getMissingFields().map((field, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-amber-600 rounded-full flex-shrink-0"></span>
                      {field}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div className="flex gap-4 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/housemate/dashboard")}
              disabled={isSubmitting}
              className="flex-1 h-12 rounded-xl border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-colors"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isSubmitting || !isFormValid()}
              className={`flex-1 h-12 rounded-xl transition-colors ${
                isFormValid() 
                  ? "bg-primary hover:bg-primary/90 text-white" 
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
            >
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
      </div>
    </div>
  );
} 