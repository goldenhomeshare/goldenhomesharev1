"use client";

import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  PawPrint, 
  Users, 
  CigaretteOff,
  UserPlus,
  Check
} from "lucide-react";
import { WizardFormData } from "../HousemateSignupWizard";

interface HousematePreferencesStepProps {
  formData: WizardFormData;
  updateFormData: (updates: Partial<WizardFormData>) => void;
}

export function HousematePreferencesStep({ formData, updateFormData }: HousematePreferencesStepProps) {
  const handleLifestyleChange = (field: string, value: string | boolean) => {
    updateFormData({
      lifestyle: {
        ...formData.lifestyle,
        [field]: value
      }
    });
  };

  const numberOfPeopleOptions = [
    { value: "1", label: "Just myself (1 person)", description: "I'm looking for a space for just me" },
    { value: "2", label: "2 people", description: "I need space for myself and one other person" },
    { value: "3+", label: "3 or more people", description: "I need space for a small group" }
  ];

  const smokingOptions = [
    { value: "no", label: "Non-smoker", description: "I don't smoke and prefer smoke-free environments" },
    { value: "outside", label: "Smoker (outside only)", description: "I smoke but only outdoors" },
    { value: "yes", label: "Smoker (anywhere)", description: "I may smoke indoors as well" }
  ];

  const guestPolicyOptions = [
    { id: "rarely", label: "Rarely Have Guests", description: "I rarely have guests visit and prefer quiet living" },
    { id: "occasional", label: "Occasional Guests", description: "I may have friends or family visit occasionally" },
    { id: "moderate", label: "Moderate Guest Activity", description: "I enjoy having guests over for social activities" },
    { id: "frequent", label: "Frequent Guests", description: "I often have friends over and enjoy an active social life" }
  ];

  return (
    <div className="space-y-10">
      <div className="text-center mb-8">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Housemate Preferences</h3>
      </div>

      {/* Pets Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
            <PawPrint size={24} className="text-gray-600" />
          </div>
          <div>
            <Label className="text-lg font-medium text-gray-900">Pets</Label>
            <p className="text-sm text-gray-600">Do you have any pets that will be joining you?</p>
          </div>
        </div>
        
        <div className="space-y-3">
          <button
            type="button"
            onClick={() => handleLifestyleChange("hasPets", !formData.lifestyle.hasPets)}
            className={`w-full flex items-center p-4 rounded-xl border-2 transition-all duration-200 text-left ${
              formData.lifestyle.hasPets
                ? "border-primary bg-primary/5 text-primary"
                : "border-gray-200 hover:border-gray-300 text-gray-600"
            }`}
          >
            <div className="flex-1">
              <span className="font-medium">I have pets that I plan to bring</span>
            </div>
            <div className={`w-5 h-5 rounded-full border-2 transition-colors ${
              formData.lifestyle.hasPets 
                ? 'border-primary bg-primary' 
                : 'border-gray-300'
            }`}>
              {formData.lifestyle.hasPets && (
                <div className="w-full h-full rounded-full bg-white scale-50"></div>
              )}
            </div>
          </button>
          
          {formData.lifestyle.hasPets && (
            <div className="ml-4 space-y-2">
              <Label className="text-sm font-medium text-gray-700">
                Please describe your pets (type, size, behavior, etc.):
              </Label>
              <Textarea
                placeholder="e.g., Small, friendly dog that is house-trained and quiet"
                value={formData.lifestyle.petDescription}
                onChange={(e) => handleLifestyleChange("petDescription", e.target.value)}
                rows={3}
                className={`border-2 border-gray-200 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200 ${
                  formData.lifestyle.hasPets && formData.lifestyle.petDescription.trim().length < 25
                    ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
                    : ''
                }`}
              />
              <div className="flex justify-between items-center">
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
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
            <Users size={24} className="text-gray-600" />
          </div>
          <div>
            <Label className="text-lg font-medium text-gray-900">Number of People</Label>
            <p className="text-sm text-gray-600">How many people need accommodation?</p>
          </div>
        </div>
        
        <p className="text-sm text-gray-500 mb-4">
          Homesharing is typically for one individual, but some opportunities for multiple people may be available.
        </p>
        
        <div className="space-y-3">
          {numberOfPeopleOptions.map((option) => {
            const isSelected = formData.lifestyle.numberOfPeople === option.value;
            
            return (
              <button
                key={option.value}
                type="button"
                onClick={() => handleLifestyleChange("numberOfPeople", option.value)}
                className={`w-full flex items-start p-4 rounded-xl border-2 transition-all duration-200 text-left ${
                  isSelected
                    ? "border-primary bg-primary/5 text-primary"
                    : "border-gray-200 hover:border-gray-300 text-gray-600"
                }`}
              >
                <div className="flex-1">
                  <span className="font-medium block">{option.label}</span>
                  <span className="text-sm opacity-75 mt-1 block">{option.description}</span>
                </div>
                <div className={`w-5 h-5 rounded-full border-2 mt-1 transition-colors ${
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
      <div className="space-y-4">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
            <UserPlus size={24} className="text-gray-600" />
          </div>
          <div>
            <Label className="text-lg font-medium text-gray-900">Guest Expectations *</Label>
            <p className="text-sm text-gray-600">How often do you expect to have guests visit?</p>
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
                className={`w-full flex items-start p-4 rounded-xl border-2 transition-all duration-200 text-left ${
                  isSelected
                    ? "border-primary bg-primary/5 text-primary"
                    : "border-gray-200 hover:border-gray-300 text-gray-600"
                }`}
              >
                <div className="flex-1">
                  <span className="font-medium block">{option.label}</span>
                  <span className="text-sm opacity-75 mt-1 block">{option.description}</span>
                </div>
                <div className={`w-5 h-5 rounded-full border-2 mt-1 transition-colors ${
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

      {/* Smoking Status */}
      <div className="space-y-4">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
            <CigaretteOff size={24} className="text-gray-600" />
          </div>
          <div>
            <Label className="text-lg font-medium text-gray-900">Smoking Status *</Label>
            <p className="text-sm text-gray-600">This helps homeowners understand your smoking preferences</p>
          </div>
        </div>
        
        <div className="space-y-3">
          {smokingOptions.map((option) => {
            const isSelected = formData.lifestyle.smokingStatus === option.value;
            
            return (
              <button
                key={option.value}
                type="button"
                onClick={() => handleLifestyleChange("smokingStatus", option.value)}
                className={`w-full flex items-start p-4 rounded-xl border-2 transition-all duration-200 text-left ${
                  isSelected
                    ? "border-primary bg-primary/5 text-primary"
                    : "border-gray-200 hover:border-gray-300 text-gray-600"
                }`}
              >
                <div className="flex-1">
                  <span className="font-medium block">{option.label}</span>
                  <span className="text-sm opacity-75 mt-1 block">{option.description}</span>
                </div>
                <div className={`w-5 h-5 rounded-full border-2 mt-1 transition-colors ${
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