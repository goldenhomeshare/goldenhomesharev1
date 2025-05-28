"use client";

import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  PawPrint, 
  Users, 
  CigaretteOff, 
  UserPlus,
  Home,
  Shield
} from "lucide-react";
import { WizardFormData } from "../HomeownerSignupWizard";

interface LifestylePreferencesStepProps {
  formData: WizardFormData;
  updateFormData: (updates: Partial<WizardFormData>) => void;
}

export function LifestylePreferencesStep({ formData, updateFormData }: LifestylePreferencesStepProps) {
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

  const handleLifestyleChange = (field: keyof WizardFormData['lifestyle'], value: any) => {
    updateFormData({
      lifestyle: {
        ...formData.lifestyle,
        [field]: value
      }
    });
  };

  return (
    <div className="space-y-10">
      <div className="text-center mb-8">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Home & Lifestyle Preferences</h3>
        <p className="text-gray-600">Help potential housemates understand your living environment</p>
      </div>

      {/* Pet Information */}
      <div className="border border-gray-200 rounded-xl p-6 space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
            <PawPrint className="w-6 h-6 text-primary" />
          </div>
          <div>
            <Label className="text-lg font-medium text-gray-900">Pets in the Home</Label>
            <p className="text-sm text-gray-600">Information about pets in your household</p>
          </div>
        </div>
        
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
                Please describe your pets (type, size, behavior, etc.):
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

      {/* Number of People in Household */}
      <div className="border border-gray-200 rounded-xl p-6 space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
            <Users className="w-6 h-6 text-primary" />
          </div>
          <div>
            <Label className="text-lg font-medium text-gray-900">Household Size *</Label>
            <p className="text-sm text-gray-600">How many people currently live in your home?</p>
          </div>
        </div>
        
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
      <div className="border border-gray-200 rounded-xl p-6 space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
            <CigaretteOff className="w-6 h-6 text-primary" />
          </div>
          <div>
            <Label className="text-lg font-medium text-gray-900">Smoking Policy *</Label>
            <p className="text-sm text-gray-600">What's your smoking policy for the home?</p>
          </div>
        </div>
        
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
      <div className="border border-gray-200 rounded-xl p-6 space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
            <UserPlus className="w-6 h-6 text-primary" />
          </div>
          <div>
            <Label className="text-lg font-medium text-gray-900">Guest Policy *</Label>
            <p className="text-sm text-gray-600">How do you feel about housemates having guests?</p>
          </div>
        </div>
        
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
  );
} 