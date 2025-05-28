"use client";

import { Label } from "@/components/ui/label";
import { 
  Mars, 
  Venus,
  Users, 
  Sparkles,
  Salad,
  Flower,
  ShoppingBag,
  HeartHandshake,
  Cat,
  Wrench,
  Shield,
  Car,
  Eye,
  Monitor
} from "lucide-react";
import { WizardFormData } from "../HousemateSignupWizard";

interface MatchPreferencesStepProps {
  formData: WizardFormData;
  updateFormData: (updates: Partial<WizardFormData>) => void;
}

export function MatchPreferencesStep({ formData, updateFormData }: MatchPreferencesStepProps) {
  const supportOptions = [
    { id: "cleaning", label: "Cleaning", icon: Sparkles },
    { id: "cooking", label: "Cooking", icon: Salad },
    { id: "gardening", label: "Yard Work", icon: Flower },
    { id: "errands", label: "Shopping & Errands", icon: ShoppingBag },
    { id: "companionship", label: "Companionship", icon: HeartHandshake },
    { id: "petCare", label: "Pet Care", icon: Cat },
    { id: "techSupport", label: "Tech Support", icon: Monitor },
    { id: "homeMaintenance", label: "Home Maintenance", icon: Wrench },
    { id: "transportation", label: "Transportation", icon: Car },
  ];

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
              { id: "male", label: "Male", icon: Mars },
              { id: "female", label: "Female", icon: Venus },
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
      </div>
    </div>
  );
} 