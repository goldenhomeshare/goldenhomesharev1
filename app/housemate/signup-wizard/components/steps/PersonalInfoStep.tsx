"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, Mars, Venus, ChevronDown } from "lucide-react";
import { WizardFormData } from "../HousemateSignupWizard";
import { useState, useRef, useEffect } from "react";

interface PersonalInfoStepProps {
  formData: WizardFormData;
  updateFormData: (updates: Partial<WizardFormData>) => void;
}

export function PersonalInfoStep({ formData, updateFormData }: PersonalInfoStepProps) {
  const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const genderOptions = [
    { id: "male", label: "Male", icon: Mars },
    { id: "female", label: "Female", icon: Venus },
    { id: "other", label: "Other", icon: User },
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
    "Russian",
    "Other"
  ];

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsLanguageDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleInputChange = (field: keyof WizardFormData, value: string) => {
    updateFormData({ [field]: value });
  };

  const handleGenderSelect = (gender: string) => {
    updateFormData({ gender });
  };

  const handleLanguageSelect = (language: string) => {
    updateFormData({ language });
    setIsLanguageDropdownOpen(false);
  };

  const selectedLanguage = languageOptions.find(lang => lang === formData.language);

  return (
    <div className="space-y-8">
      <div className="space-y-6">


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

        {/* Language - Custom Dropdown */}
        <div>
          <Label className="text-base font-medium">
            Primary Language *
          </Label>
          <div className="relative mt-2" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setIsLanguageDropdownOpen(!isLanguageDropdownOpen)}
              className="w-full h-12 px-4 text-lg border-2 border-gray-200 rounded-xl bg-white focus:outline-none focus:border-primary flex items-center justify-between hover:border-gray-300 transition-colors"
          >
              <span className={selectedLanguage ? "text-gray-900" : "text-gray-500"}>
                {selectedLanguage || "Select your primary language"}
              </span>
              <ChevronDown className={`w-5 h-5 text-gray-500 transition-transform ${isLanguageDropdownOpen ? 'rotate-180' : ''}`} />
            </button>
            
            {isLanguageDropdownOpen && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white border-2 border-gray-200 rounded-xl shadow-lg z-20 max-h-60 overflow-y-auto">
                {languageOptions.map((language) => (
                  <button
                    key={language}
                    type="button"
                    onClick={() => handleLanguageSelect(language)}
                    className={`w-full px-4 py-3 text-left text-lg hover:bg-gray-50 transition-colors first:rounded-t-xl last:rounded-b-xl ${
                      formData.language === language 
                        ? 'bg-primary/5 text-primary font-medium' 
                        : 'text-gray-900'
                    }`}
                  >
                    {language}
                  </button>
            ))}
              </div>
            )}
          </div>
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