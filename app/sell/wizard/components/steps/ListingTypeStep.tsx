"use client";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { HousePlusIcon, DoorClosed, Warehouse } from "lucide-react";
import { WizardFormData } from "../ListingWizard";

interface ListingTypeStepProps {
  formData: WizardFormData;
  updateFormData: (data: Partial<WizardFormData>) => void;
}

const categoryOptions = [
  {
    id: "template",
    name: "template",
    title: "Homeowner with Private Suite",
    description: "A separate living space with private bathroom and entrance",
    icon: HousePlusIcon,
  },
  {
    id: "uikit",
    name: "uikit", 
    title: "Homeowner with Private Room",
    description: "A private bedroom with shared common areas",
    icon: DoorClosed,
  },
  {
    id: "icon",
    name: "icon",
    title: "Homeowner with ADU",
    description: "An accessory dwelling unit (granny flat, in-law suite)",
    icon: Warehouse,
  },
];

export function ListingTypeStep({ formData, updateFormData }: ListingTypeStepProps) {
  const handleCategorySelect = (categoryName: string) => {
    updateFormData({ category: categoryName });
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">
          What type of listing are you creating?
        </h2>
        <p className="text-gray-600">
          Select the option that best describes your housing situation
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {categoryOptions.map((option) => {
          const Icon = option.icon;
          const isSelected = formData.category === option.name;
          
          return (
            <button
              key={option.id}
              type="button"
              onClick={() => handleCategorySelect(option.name)}
              className={`p-6 rounded-xl border-2 transition-all duration-200 text-left hover:shadow-md ${
                isSelected
                  ? "border-primary bg-primary/5"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <div className="flex flex-col items-center text-center space-y-4">
                <div className={`w-16 h-16 rounded-lg flex items-center justify-center ${
                  isSelected ? "bg-primary/10" : "bg-gray-100"
                }`}>
                  <Icon className={`w-8 h-8 ${
                    isSelected ? "text-primary" : "text-gray-600"
                  }`} />
                </div>
                
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    {option.title}
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {option.description}
                  </p>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {formData.category && (
        <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-xl">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
              <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
              </svg>
            </div>
            <span className="text-sm font-medium text-green-800">
              Great choice! You can proceed to the next step.
            </span>
          </div>
        </div>
      )}
    </div>
  );
} 