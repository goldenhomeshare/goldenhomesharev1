"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sparkles, Salad, Flower, ShoppingBag, HeartHandshake, Cat, Monitor, Car, Wrench } from "lucide-react";
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
  { id: "homeMaintenance", label: "Home Maintenance", icon: Wrench },
  { id: "transportation", label: "Transportation", icon: Car },
];

export function SupportStep({ formData, updateFormData }: SupportStepProps) {
  const toggleSupport = (supportId: string) => {
    const isSelected = formData.supportRequested.some(item => item.id === supportId);
    
    if (isSelected) {
      const updatedSupport = formData.supportRequested.filter(item => item.id !== supportId);
      updateFormData({ supportRequested: updatedSupport });
    } else {
      const updatedSupport = [...formData.supportRequested, { id: supportId, hoursPerWeek: 1 }];
      updateFormData({ supportRequested: updatedSupport });
    }
  };

  const getTotalHours = () => {
    return formData.supportRequested.reduce((total, item) => total + item.hoursPerWeek, 0);
  };

  const updateSupportHours = (supportId: string, hours: number) => {
    const currentItem = formData.supportRequested.find(item => item.id === supportId);
    const otherItemsTotal = formData.supportRequested
      .filter(item => item.id !== supportId)
      .reduce((total, item) => total + item.hoursPerWeek, 0);
    
    // Ensure the new total doesn't exceed 10
    const maxAllowedHours = Math.min(hours, 10 - otherItemsTotal);
    const finalHours = Math.max(1, maxAllowedHours);
    
    const updatedSupport = formData.supportRequested.map(item =>
      item.id === supportId ? { ...item, hoursPerWeek: finalHours } : item
    );
    updateFormData({ supportRequested: updatedSupport });
  };

  const getMaxHoursForService = (supportId: string) => {
    const otherItemsTotal = formData.supportRequested
      .filter(item => item.id !== supportId)
      .reduce((total, item) => total + item.hoursPerWeek, 0);
    return Math.max(1, 10 - otherItemsTotal);
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
                  <div className="mt-4 p-4 bg-gray-50 rounded-lg border">
                    <Label className="text-sm font-medium text-gray-700 mb-2 block text-center">
                      How many hours per week?
                    </Label>
                    <div className="flex items-center justify-center gap-3">
                      <button
                        type="button"
                        onClick={() => updateSupportHours(support.id, Math.max(1, (selectedItem?.hoursPerWeek || 1) - 1))}
                        className="w-8 h-8 rounded-full bg-white border border-gray-300 flex items-center justify-center hover:bg-gray-50 text-gray-600"
                        disabled={(selectedItem?.hoursPerWeek || 1) <= 1}
                      >
                        −
                      </button>
                      <div className="flex items-center gap-2">
                        <Input
                          type="number"
                          min={1}
                          max={getMaxHoursForService(support.id)}
                          value={selectedItem?.hoursPerWeek || 1}
                          onChange={(e) => updateSupportHours(support.id, parseInt(e.target.value) || 1)}
                          className="w-16 h-10 text-center text-base font-medium border-gray-300 rounded-lg focus:border-primary focus:ring-0"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => updateSupportHours(support.id, Math.min(getMaxHoursForService(support.id), (selectedItem?.hoursPerWeek || 1) + 1))}
                        className="w-8 h-8 rounded-full bg-white border border-gray-300 flex items-center justify-center hover:bg-gray-50 text-gray-600"
                        disabled={(selectedItem?.hoursPerWeek || 1) >= getMaxHoursForService(support.id)}
                      >
                        +
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Info Section */}
      <div className="bg-primary/5 border border-primary/20 rounded-xl p-6">
        <h3 className="font-medium text-primary mb-3">💡 About Support Services</h3>
        <ul className="space-y-2 text-sm text-gray-700">
          <li className="flex items-start gap-2">
            <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></span>
            <span>These preferences help potential housemates understand what kind of arrangement you're considering</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></span>
            <span>Nothing is set in stone - you can discuss and adjust expectations with matched housemates</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></span>
            <span>Consider how support services might complement reduced rent or other mutual benefits</span>
          </li>
        </ul>
      </div>

      {/* Summary Section */}
      {formData.supportRequested.length > 0 && (
        <div className="mt-8 p-6 bg-primary/5 border border-primary/20 rounded-xl">
          <h3 className="font-medium text-primary mb-4 text-center">Support Services Summary</h3>
          <div className="space-y-3">
            {formData.supportRequested.map((item) => {
              const supportOption = supportOptions.find(option => option.id === item.id);
              return (
                <div key={item.id} className="flex justify-between items-center bg-white px-4 py-2 rounded-lg">
                  <span className="text-sm font-medium text-gray-900">{supportOption?.label}</span>
                  <span className="text-sm text-gray-600">{item.hoursPerWeek} {item.hoursPerWeek === 1 ? 'hour' : 'hours'}/week</span>
                </div>
              );
            })}
            <div className="border-t pt-3 mt-3">
              <div className="flex justify-between items-center font-medium">
                <span className="text-gray-900">Total Hours per Week:</span>
                <span className={`${getTotalHours() === 10 ? 'text-primary' : 'text-gray-900'}`}>
                  {getTotalHours()}/10 hours
                </span>
              </div>
              {getTotalHours() === 10 && (
                <p className="text-xs text-primary mt-1 text-center">Maximum hours reached</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 