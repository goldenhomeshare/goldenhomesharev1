"use client";

import { Label } from "@/components/ui/label";
import { 
  GraduationCap, 
  Briefcase, 
  User, 
  UserCheck, 
  Users, 
  Crown, 
  UserCircle, 
  CircleDashed,
  Sparkles,
  Salad,
  Flower,
  ShoppingBag,
  HeartHandshake,
  Cat,
  Wrench,
  Shield
} from "lucide-react";
import { WizardFormData } from "../HousemateSignupWizard";

interface MatchPreferencesStepProps {
  formData: WizardFormData;
  updateFormData: (updates: Partial<WizardFormData>) => void;
}

export function MatchPreferencesStep({ formData, updateFormData }: MatchPreferencesStepProps) {
  const ageRangeOptions = [
    { id: "18-24", label: "18–24", icon: GraduationCap },
    { id: "25-34", label: "25–34", icon: Briefcase },
    { id: "35-44", label: "35–44", icon: User },
    { id: "45-54", label: "45–54", icon: UserCheck },
    { id: "55-64", label: "55–64", icon: Users },
    { id: "65+", label: "65+", icon: Crown },
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

  const handlePreferredAgeRangeToggle = (ageRangeId: string) => {
    const currentRanges = formData.preferredAgeRanges || [];
    const updatedRanges = currentRanges.includes(ageRangeId)
      ? currentRanges.filter(id => id !== ageRangeId)
      : [...currentRanges, ageRangeId];
    
    updateFormData({ preferredAgeRanges: updatedRanges });
  };

  const handleCanHelpWithToggle = (supportId: string) => {
    const currentSupport = formData.canHelpWith || [];
    const updatedSupport = currentSupport.includes(supportId)
      ? currentSupport.filter(id => id !== supportId)
      : [...currentSupport, supportId];
    
    updateFormData({ canHelpWith: updatedSupport });
  };

  const handleGenderSelect = (gender: string) => {
    updateFormData({ preferredGender: gender });
  };

  return (
    <div className="space-y-8">
      <div className="space-y-8">
        {/* Preferred Age Ranges */}
        <div>
          <Label className="text-base font-medium mb-4 block">
            Preferred Age Ranges *
          </Label>
          <p className="text-sm text-muted-foreground mb-4">
            Select the age ranges you'd prefer to live with (select all that apply)
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
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

        {/* Preferred Gender */}
        <div>
          <Label className="text-base font-medium mb-4 block">
            Preferred Gender *
          </Label>
          <p className="text-sm text-muted-foreground mb-4">
            Select your preferred gender for living companions
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
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
                      onChange={() => handleGenderSelect(option.id)}
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

        {/* What Can You Help With */}
        <div>
          <Label className="text-base font-medium mb-4 block">
            What can you help with?
          </Label>
          <p className="text-sm text-muted-foreground mb-4">
            Select the services you're willing and able to help homeowners with
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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

        {/* Help Message */}
        {formData.canHelpWith.length > 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-blue-800 mb-2">
              Great! You can help with:
            </h3>
            <div className="flex flex-wrap gap-2">
              {formData.canHelpWith.map((supportId) => {
                const support = supportOptions.find(s => s.id === supportId);
                return support ? (
                  <span
                    key={supportId}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                  >
                    {support.label}
                  </span>
                ) : null;
              })}
            </div>
            <p className="text-blue-700 mt-3">
              This makes you a valuable housemate and can help reduce your monthly costs!
            </p>
          </div>
        )}
      </div>
    </div>
  );
} 