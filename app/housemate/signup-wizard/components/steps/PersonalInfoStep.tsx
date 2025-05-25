"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, UserCircle, CircleDashed } from "lucide-react";
import { WizardFormData } from "../HousemateSignupWizard";

interface PersonalInfoStepProps {
  formData: WizardFormData;
  updateFormData: (updates: Partial<WizardFormData>) => void;
}

export function PersonalInfoStep({ formData, updateFormData }: PersonalInfoStepProps) {
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

  const handleInputChange = (field: keyof WizardFormData, value: string) => {
    updateFormData({ [field]: value });
  };

  const handleGenderSelect = (gender: string) => {
    updateFormData({ gender });
  };

  return (
    <div className="space-y-8">
      <div className="space-y-6">
        {/* Name Fields */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="firstName" className="text-base font-medium">
              First Name *
            </Label>
            <Input
              id="firstName"
              placeholder="Your first name"
              value={formData.firstName}
              onChange={(e) => handleInputChange("firstName", e.target.value)}
              className="mt-2 h-12 text-lg border-gray-200 rounded-xl focus:border-primary focus:ring-0"
            />
          </div>

          <div>
            <Label htmlFor="lastName" className="text-base font-medium">
              Last Name *
            </Label>
            <Input
              id="lastName"
              placeholder="Your last name"
              value={formData.lastName}
              onChange={(e) => handleInputChange("lastName", e.target.value)}
              className="mt-2 h-12 text-lg border-gray-200 rounded-xl focus:border-primary focus:ring-0"
            />
          </div>
        </div>

        {/* Date of Birth */}
        <div>
          <Label htmlFor="dateOfBirth" className="text-base font-medium">
            Date of Birth *
          </Label>
          <Input
            id="dateOfBirth"
            type="date"
            value={formData.dateOfBirth}
            onChange={(e) => handleInputChange("dateOfBirth", e.target.value)}
            className="mt-2 h-12 text-lg border-gray-200 rounded-xl focus:border-primary focus:ring-0"
            max={new Date(new Date().setFullYear(new Date().getFullYear() - 18)).toISOString().split('T')[0]}
          />
          <p className="text-sm text-gray-500 mt-1">
            You must be at least 18 years old to use our service
          </p>
        </div>

        {/* Language */}
        <div>
          <Label htmlFor="language" className="text-base font-medium">
            Primary Language *
          </Label>
          <select
            id="language"
            value={formData.language}
            onChange={(e) => handleInputChange("language", e.target.value)}
            className="mt-2 h-12 w-full px-3 py-2 border border-gray-200 rounded-xl text-lg focus:outline-none focus:border-primary bg-white"
          >
            <option value="">Select your primary language</option>
            {languageOptions.map((lang) => (
              <option key={lang} value={lang}>
                {lang}
              </option>
            ))}
          </select>
        </div>

        {/* Gender Selection */}
        <div>
          <Label className="text-base font-medium mb-4 block">
            Gender *
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
                      onChange={() => handleGenderSelect(option.id)}
                    />
                    <div className={`flex flex-col items-center p-6 rounded-xl border-2 transition-all duration-200 h-full ${
                      isSelected 
                        ? 'border-primary bg-primary/5' 
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}>
                      <div className={`w-16 h-16 rounded-lg mb-4 flex items-center justify-center ${
                        isSelected ? 'bg-primary/10' : 'bg-gray-100'
                      }`}>
                        <Icon size={32} className={isSelected ? 'text-primary' : 'text-gray-600'} />
                      </div>
                      <span className="font-medium text-lg text-center">{option.label}</span>
                    </div>
                  </label>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
} 