"use client";

import { Label } from "@/components/ui/label";
import { 
  GraduationCap, 
  Briefcase, 
  Armchair,
  Users, 
  Mars, 
  Venus
} from "lucide-react";
import { WizardFormData } from "../HomeownerSignupWizard";

interface HousematePreferencesStepProps {
  formData: WizardFormData;
  updateFormData: (updates: Partial<WizardFormData>) => void;
}

export function HousematePreferencesStep({ formData, updateFormData }: HousematePreferencesStepProps) {
  const careerStageOptions = [
    { id: "student", label: "Student", icon: GraduationCap, description: "College or university student" },
    { id: "professional", label: "Professional", icon: Briefcase, description: "Working professional" },
    { id: "retired", label: "Retired", icon: Armchair, description: "Retired or semi-retired" },
    { id: "no-preference", label: "No Preference", icon: Users, description: "Open to any career stage" }
  ];

  const genderOptions = [
    { id: "male", label: "Male", icon: Mars },
    { id: "female", label: "Female", icon: Venus },
    { id: "no-preference", label: "No Preference", icon: Users }
  ];

  const handlePreferredCareerStageChange = (careerStage: string) => {
    updateFormData({ preferredCareerStage: careerStage });
  };

  const handlePreferredGenderChange = (gender: string) => {
    updateFormData({ preferredGender: gender });
  };

  return (
    <div className="space-y-10">
      <div className="text-center mb-8">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Housemate Preferences</h3>
        <p className="text-gray-600">Let us know what you're looking for in a housemate</p>
      </div>

      {/* Preferred Career Stage */}
      <div className="space-y-4">
        <Label className="text-lg font-medium text-gray-900">
          Preferred Career Stage *
        </Label>
        <p className="text-sm text-gray-600 mb-4">What career stage do you think your space is best suited for?</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {careerStageOptions.map((option) => {
            const Icon = option.icon;
            const isSelected = formData.preferredCareerStage === option.id;
            
            return (
              <button
                key={option.id}
                type="button"
                onClick={() => handlePreferredCareerStageChange(option.id)}
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
      <div className="space-y-4">
        <Label className="text-lg font-medium text-gray-900">
          Gender Preference *
        </Label>
        <p className="text-sm text-gray-600 mb-4">Do you have a preference for your housemate's gender?</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {genderOptions.map((option) => {
            const Icon = option.icon;
            const isSelected = formData.preferredGender === option.id;
            
            return (
              <button
                key={option.id}
                type="button"
                onClick={() => handlePreferredGenderChange(option.id)}
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

      {/* Information Note */}
      <div className="bg-primary/5 border border-primary/20 rounded-xl p-6">
        <h4 className="font-medium text-primary mb-3">About Preferences</h4>
        <ul className="text-sm text-gray-700 space-y-2">
          <li>• These preferences help us suggest compatible housemates</li>
          <li>• They are not strict requirements - you can always review applications that don't match exactly</li>
          <li>• Focus on what's most important to you for a harmonious living situation</li>
          <li>• You can always update these preferences later in your profile settings</li>
          <li>• For assistance needs, you'll specify those when creating your listing</li>
        </ul>
      </div>
    </div>
  );
} 