"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sparkles, Salad, Flower, ShoppingBag, HeartHandshake, Cat, Monitor, Car } from "lucide-react";
import { WizardFormData } from "../ListingWizard";

interface SupportStepProps {
  formData: WizardFormData;
  updateFormData: (data: Partial<WizardFormData>) => void;
}

const supportOptions = [
  { id: "cleaning", label: "Cleaning", icon: Sparkles },
  { id: "cooking", label: "Cooking", icon: Salad },
  { id: "gardening", label: "Yard Work", icon: Flower },
  { id: "errands", label: "Shopping & Errands", icon: ShoppingBag },
  { id: "companionship", label: "Companionship", icon: HeartHandshake },
  { id: "petCare", label: "Pet Care", icon: Cat },
  { id: "techSupport", label: "Tech Support", icon: Monitor },
  { id: "transportation", label: "Transportation", icon: Car },
];

export function SupportStep({ formData, updateFormData }: SupportStepProps) {
  const toggleSupport = (supportId: string) => {
    const isSelected = formData.supportRequested.some(item => item.id === supportId);
    
    if (isSelected) {
      const updatedSupport = formData.supportRequested.filter(item => item.id !== supportId);
      updateFormData({ supportRequested: updatedSupport });
    } else {
      const updatedSupport = [...formData.supportRequested, { id: supportId, hoursPerWeek: 2 }];
      updateFormData({ supportRequested: updatedSupport });
    }
  };

  const updateSupportHours = (supportId: string, hours: number) => {
    const updatedSupport = formData.supportRequested.map(item =>
      item.id === supportId ? { ...item, hoursPerWeek: hours } : item
    );
    updateFormData({ supportRequested: updatedSupport });
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">
          What kind of support would you appreciate?
        </h2>
        <p className="text-gray-600">
          Select services your housemate could help with and estimate hours per week
        </p>
      </div>

      <div>
        <Label className="text-sm font-medium text-gray-700 mb-4 block">
          Support Services (optional)
        </Label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {supportOptions.map((support) => {
            const Icon = support.icon;
            const isSelected = formData.supportRequested.some(item => item.id === support.id);
            const selectedItem = formData.supportRequested.find(item => item.id === support.id);
            
            return (
              <div key={support.id} className="flex flex-col">
                <label className="cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={isSelected}
                    onChange={() => toggleSupport(support.id)}
                  />
                  <div className="flex items-center p-4 rounded-xl border-2 peer-checked:border-primary peer-checked:bg-primary/5 hover:bg-gray-50 transition-all">
                    <div className="w-12 h-12 rounded-full bg-gray-100 mr-4 flex items-center justify-center">
                      <Icon size={24} className="text-gray-600" />
                    </div>
                    <div className="flex-1">
                      <span className="font-medium text-gray-900">{support.label}</span>
                    </div>
                  </div>
                </label>
                
                {isSelected && (
                  <div className="mt-3 ml-4">
                    <Label className="text-xs font-medium text-gray-600 mb-1 block">
                      Estimated hours per week
                    </Label>
                    <Input
                      type="number"
                      min={1}
                      max={20}
                      value={selectedItem?.hoursPerWeek || 2}
                      onChange={(e) => updateSupportHours(support.id, parseInt(e.target.value) || 1)}
                      className="w-24 h-8 text-center text-sm border-gray-200 rounded-lg focus:border-primary focus:ring-0"
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Info Section */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
        <h3 className="font-medium text-blue-900 mb-3">ℹ️ About Support Services</h3>
        <ul className="space-y-2 text-sm text-blue-800">
          <li className="flex items-start gap-2">
            <span className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 flex-shrink-0"></span>
            <span>These are optional services that can create mutual benefit in your living arrangement</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 flex-shrink-0"></span>
            <span>Consider offering reduced rent in exchange for regular help</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 flex-shrink-0"></span>
            <span>Discuss expectations clearly with potential housemates</span>
          </li>
        </ul>
      </div>

      {formData.supportRequested.length > 0 && (
        <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-xl">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
              <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
              </svg>
            </div>
            <span className="text-sm font-medium text-green-800">
              You've selected {formData.supportRequested.length} support services.
            </span>
          </div>
        </div>
      )}
    </div>
  );
} 