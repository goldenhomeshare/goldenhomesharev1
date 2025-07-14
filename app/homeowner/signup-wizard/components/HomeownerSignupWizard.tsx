"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, ArrowRight, CheckCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

// Import step components
import { BasicDetailsStep } from "./steps/BasicDetailsStep";
import { DemographicsStep } from "./steps/DemographicsStep";
import { LifestyleStep } from "./steps/LifestyleStep";
import { LifestylePreferencesStep } from "./steps/LifestylePreferencesStep";
import { HousematePreferencesStep } from "./steps/HousematePreferencesStep";
import { BioStep } from "./steps/BioStep";
import { ProfilePictureStep } from "./steps/ProfilePictureStep";

// Import actions
import { createHomeownerProfile } from "@/app/actions/profile-actions";
import { UpdateUserSettings } from "@/app/actions";

// Import hooks
import { useSignupLead } from "../hooks/useSignupLead";

interface HomeownerSignupWizardProps {
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
}

export interface WizardFormData {
  // Personal Info
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  language: string;
  gender: string;
  profilePicture: string;
  
  // Demographics & Lifestyle
  schedule: string;
  socialPreference: string;
  hobbies: string[];
  
  // Lifestyle Preferences
  lifestyle: {
    hasPets: boolean;
    petDescription: string;
    numberOfPeople: string;
    smokingPolicy: string;
    guestPolicy: string;
  };
  
  // Housemate Preferences
  preferredCareerStage: string;
  preferredGender: string;
  
  // Bio
  bio: string;
  
  // Social Media (optional)
  socialMedia: {
    instagram: string;
    facebook: string;
    linkedin: string;
  };
}

const STEPS = [
  { id: 1, title: "Basic Details", description: "Your contact information" },
  { id: 2, title: "Demographics", description: "Basic information about you" },
  { id: 3, title: "Lifestyle", description: "Your schedule and social preferences" },
  { id: 4, title: "Preferences", description: "Your household preferences" },
  { id: 5, title: "Match Preferences", description: "Who you'd like to live with" },
  { id: 6, title: "About You", description: "Tell us about yourself" },
  { id: 7, title: "Profile Picture", description: "Add your photo" },
];

export function HomeownerSignupWizard({ userId, firstName, lastName, email }: HomeownerSignupWizardProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const router = useRouter();
  
  // Initialize signup lead tracking
  const { saveSignupLead, markCompleted } = useSignupLead({ userId });
  
  const [formData, setFormData] = useState<WizardFormData>({
    firstName: firstName || "",
    lastName: lastName || "",
    email: email || "",
    phone: "",
    dateOfBirth: "",
    language: "",
    gender: "",
    profilePicture: "",
    schedule: "",
    socialPreference: "",
    hobbies: [],
    lifestyle: {
      hasPets: false,
      petDescription: "",
      numberOfPeople: "1",
      smokingPolicy: "",
      guestPolicy: "",
    },
    preferredCareerStage: "",
    preferredGender: "",
    bio: "",
    socialMedia: {
      instagram: "",
      facebook: "",
      linkedin: "",
    },
  });

  const updateFormData = (updates: Partial<WizardFormData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  };

  const nextStep = () => {
    if (currentStep < STEPS.length) {
      // Save current step data before moving to next step (fire and forget)
      saveSignupLead(formData, currentStep).catch(error => {
        console.error('Error saving signup lead:', error);
        // Don't block user flow
      });
      
      setCurrentStep(currentStep + 1);
      // Scroll to top when moving to next step
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      // Scroll to top when moving to previous step
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    try {
      // Mark signup as completed for marketing tracking
      await markCompleted(formData);
      
      // Update basic user info if changed
      if (formData.firstName !== firstName || formData.lastName !== lastName) {
        const userFormData = new FormData();
        userFormData.append("firstName", formData.firstName);
        userFormData.append("lastName", formData.lastName);
        
        const userResult = await UpdateUserSettings({ status: undefined }, userFormData);
        if (userResult.status === "error") {
          throw new Error(userResult.message || "Failed to update basic information");
        }
      }

      // Calculate age from date of birth
      const birthDate = new Date(formData.dateOfBirth);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear() - 
        (today.getMonth() < birthDate.getMonth() || 
         (today.getMonth() === birthDate.getMonth() && today.getDate() < birthDate.getDate()) ? 1 : 0);

      // Determine age range based on calculated age
      let ageRange = "";
      if (age >= 18 && age <= 24) ageRange = "18-24";
      else if (age >= 25 && age <= 34) ageRange = "25-34";
      else if (age >= 35 && age <= 44) ageRange = "35-44";
      else if (age >= 45 && age <= 54) ageRange = "45-54";
      else if (age >= 55 && age <= 64) ageRange = "55-64";
      else if (age >= 65) ageRange = "65+";

      // Create homeowner profile
      const profileData = {
        bio: formData.bio,
        profilePicture: formData.profilePicture,
        gender: formData.gender,
        ageRange,
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
        },
      };

      const result = await createHomeownerProfile(profileData);
      
      if (result.success) {
        toast.success("Welcome! Your profile has been created successfully!");
        setIsRedirecting(true);
        setTimeout(() => {
          router.push("/homeowner/dashboard");
        }, 2000);
      } else {
        toast.error(result.error || "Failed to create profile");
      }
    } catch (error) {
      console.error("Error creating profile:", error);
      toast.error("An error occurred while creating your profile");
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <BasicDetailsStep
            formData={formData}
            updateFormData={updateFormData}
          />
        );
      case 2:
        return (
          <DemographicsStep
            formData={formData}
            updateFormData={updateFormData}
          />
        );
      case 3:
        return (
          <LifestyleStep
            formData={formData}
            updateFormData={updateFormData}
          />
        );
      case 4:
        return (
          <LifestylePreferencesStep
            formData={formData}
            updateFormData={updateFormData}
          />
        );
      case 5:
        return (
          <HousematePreferencesStep
            formData={formData}
            updateFormData={updateFormData}
          />
        );
      case 6:
        return (
          <BioStep
            formData={formData}
            updateFormData={updateFormData}
          />
        );
      case 7:
        return (
          <ProfilePictureStep
            formData={formData}
            updateFormData={updateFormData}
          />
        );
      default:
        return null;
    }
  };

  // Email validation
  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Phone validation
  const isValidPhone = (phone: string) => {
    const phoneNumbers = phone.replace(/\D/g, '');
    return phoneNumbers.length >= 10 && phoneNumbers.length <= 11;
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return formData.firstName && formData.lastName && formData.email && 
               isValidEmail(formData.email) && formData.phone && isValidPhone(formData.phone);
      case 2:
        return formData.dateOfBirth && formData.language && formData.gender;
      case 3:
        return formData.schedule && formData.socialPreference;
      case 4:
        // Check if pets require description with minimum 25 characters
        const petsValid = !formData.lifestyle.hasPets || 
          (formData.lifestyle.hasPets && formData.lifestyle.petDescription.trim().length >= 25);
        return formData.lifestyle.numberOfPeople && formData.lifestyle.smokingPolicy && 
               formData.lifestyle.guestPolicy && petsValid;
      case 5:
        return formData.preferredGender && formData.preferredCareerStage;
      case 6:
        return formData.bio.trim().length >= 100; // Minimum 100 characters for bio
      case 7:
        return formData.profilePicture; // Check if profile picture has been uploaded
      default:
        return false;
    }
  };

  const isStepValidByNumber = (stepNumber: number) => {
    switch (stepNumber) {
      case 1:
        return formData.firstName && formData.lastName && formData.email && 
               isValidEmail(formData.email) && formData.phone && isValidPhone(formData.phone);
      case 2:
        return formData.dateOfBirth && formData.language && formData.gender;
      case 3:
        return formData.schedule && formData.socialPreference;
      case 4:
        // Check if pets require description with minimum 25 characters
        const petsValid = !formData.lifestyle.hasPets || 
          (formData.lifestyle.hasPets && formData.lifestyle.petDescription.trim().length >= 25);
        return formData.lifestyle.numberOfPeople && formData.lifestyle.smokingPolicy && 
               formData.lifestyle.guestPolicy && petsValid;
      case 5:
        return formData.preferredGender && formData.preferredCareerStage;
      case 6:
        return formData.bio.trim().length >= 100; // Minimum 100 characters for bio
      case 7:
        return formData.profilePicture; // Check if profile picture has been uploaded
      default:
        return false;
    }
  };

  const getHighestCompletedStep = () => {
    for (let i = 1; i <= STEPS.length; i++) {
      if (!isStepValidByNumber(i)) {
        return i - 1;
      }
    }
    return STEPS.length;
  };

  const canNavigateToStep = (stepNumber: number) => {
    const highestCompleted = getHighestCompletedStep();
    // Allow navigation to current step, completed steps, or the next incomplete step
    return stepNumber <= Math.max(highestCompleted + 1, currentStep);
  };

  const navigateToStep = (stepNumber: number) => {
    if (canNavigateToStep(stepNumber)) {
      setCurrentStep(stepNumber);
      // Scroll to top when navigating to a step
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const progress = (currentStep / STEPS.length) * 100;

  // Show loading state when redirecting to dashboard
  if (isRedirecting) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md mx-auto px-4 text-center">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
            {/* Success Icon */}
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>
            
            {/* Success Message */}
            <h1 className="text-2xl font-bold text-gray-900 mb-3">
              Profile Created Successfully!
            </h1>
            <p className="text-gray-600 mb-6">
              Welcome to Golden! We're setting up your dashboard...
            </p>
            
            {/* Loading Animation */}
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-3 h-3 bg-primary rounded-full animate-bounce"></div>
              <div className="w-3 h-3 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
              <div className="w-3 h-3 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            </div>
            
            <p className="text-sm text-gray-500">
              Redirecting to your dashboard...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-3xl mx-auto px-4 py-12">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Complete Your Profile</h1>
          <p className="text-lg text-gray-600 mb-8">
            Help us create the perfect match by sharing a bit about yourself
          </p>
          
          {/* Progress Bar */}
          <div className="max-w-md mx-auto">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-gray-700">Progress</span>
              <span className="text-sm text-gray-500">
                Step {currentStep} of {STEPS.length}
              </span>
            </div>
            <Progress value={(currentStep / STEPS.length) * 100} className="h-3" />
          </div>
        </div>

        {/* Section Navigation */}
        <div className="mb-10">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <div className="flex flex-wrap gap-3 justify-center">
              {STEPS.map((step) => {
                const canNavigate = canNavigateToStep(step.id);
                const isCompleted = isStepValidByNumber(step.id);
                const isCurrent = currentStep === step.id;
                
                return (
                  <button
                    key={step.id}
                    type="button"
                    onClick={() => navigateToStep(step.id)}
                    disabled={!canNavigate}
                    className={`px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
                      isCurrent
                        ? 'bg-primary text-white shadow-md'
                        : isCompleted
                        ? 'text-primary bg-primary/10 hover:bg-primary/20 border border-primary/20'
                        : canNavigate
                        ? 'text-gray-600 hover:text-primary hover:bg-gray-50 border border-gray-200'
                        : 'text-gray-400 bg-gray-50 border border-gray-100 cursor-not-allowed opacity-60'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      {isCompleted && !isCurrent && (
                        <CheckCircle className="w-4 h-4" />
                      )}
                      <span>{step.title}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <Card className="mb-10 shadow-lg border-0">
          <CardHeader className="bg-gradient-to-r from-primary/5 to-primary/10 border-b border-gray-100 rounded-t-lg">
            <div className="text-center">
              <CardTitle className="text-2xl text-gray-900 mb-2">
                {STEPS[currentStep - 1].title}
              </CardTitle>
              <p className="text-gray-600">{STEPS[currentStep - 1].description}</p>
            </div>
          </CardHeader>
          <CardContent className="p-8 bg-white rounded-b-lg">
            {renderStep()}
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="w-full flex justify-center">
          {currentStep === STEPS.length ? (
            <Button
              onClick={handleSubmit}
              disabled={!isStepValid() || isSubmitting}
              className="max-w-md w-full py-8 px-12 text-xl bg-primary hover:bg-primary/90 text-white rounded-3xl shadow-lg font-semibold transition-colors duration-200"
            >
              {isSubmitting ? (
                <>
                  <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin mr-3" />
                  Creating Profile...
                </>
              ) : (
                "Complete Setup"
              )}
            </Button>
          ) : (
            <Button
              onClick={nextStep}
              disabled={!isStepValid()}
              className="max-w-md w-full py-8 px-12 text-xl bg-primary hover:bg-primary/90 text-white rounded-3xl shadow-lg font-semibold transition-colors duration-200"
            >
              Next
            </Button>
          )}
        </div>
      </div>
    </div>
  );
} 