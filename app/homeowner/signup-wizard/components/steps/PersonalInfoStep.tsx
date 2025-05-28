"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, Mars, Venus, Calendar, Globe, ChevronDown } from "lucide-react";
import { WizardFormData } from "../HomeownerSignupWizard";
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

  const handleGenderChange = (gender: string) => {
    updateFormData({ gender });
  };

  const handleLanguageSelect = (language: string) => {
    updateFormData({ language });
    setIsLanguageDropdownOpen(false);
  };

  const selectedLanguage = languageOptions.find(lang => lang === formData.language);

  return (
    <div className="space-y-8">
      {/* Basic Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="firstName" className="text-sm font-medium text-gray-700">
            First Name *
          </Label>
          <Input
            id="firstName"
            placeholder="Your first name"
            value={formData.firstName}
            onChange={(e) => handleInputChange("firstName", e.target.value)}
            className="h-12 border-gray-200 rounded-xl focus:border-primary focus:ring-0 text-gray-900"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="lastName" className="text-sm font-medium text-gray-700">
            Last Name *
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

      {/* Date of Birth */}
      <div className="space-y-2">
        <Label htmlFor="dateOfBirth" className="text-sm font-medium text-gray-700 flex items-center gap-2">
          <Calendar className="w-4 h-4" />
          Date of Birth *
        </Label>
        <Input
          id="dateOfBirth"
          type="date"
          value={formData.dateOfBirth}
          onChange={(e) => handleInputChange("dateOfBirth", e.target.value)}
          className="h-12 border-gray-200 rounded-xl focus:border-primary focus:ring-0 text-gray-900"
          max={new Date(Date.now() - 18 * 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]} // 18 years ago
        />
        <p className="text-sm text-gray-500">You must be at least 18 years old to use this service</p>
      </div>

      {/* Language - Custom Dropdown */}
      <div className="space-y-2">
        <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
          <Globe className="w-4 h-4" />
          Primary Language *
        </Label>
        <div className="relative" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setIsLanguageDropdownOpen(!isLanguageDropdownOpen)}
            className="w-full h-12 px-4 border-2 border-gray-200 rounded-xl bg-white focus:outline-none focus:border-primary flex items-center justify-between hover:border-gray-300 transition-colors"
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
                  className={`w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors first:rounded-t-xl last:rounded-b-xl ${
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

      {/* Gender */}
      <div className="space-y-4">
        <Label className="text-sm font-medium text-gray-700">
          Gender *
        </Label>
        <div className="grid grid-cols-3 gap-4">
          {genderOptions.map((option) => {
            const Icon = option.icon;
            const isSelected = formData.gender === option.id;
            
            return (
              <button
                key={option.id}
                type="button"
                onClick={() => handleGenderChange(option.id)}
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
    </div>
  );
} 