"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DollarSign } from "lucide-react";
import { WizardFormData } from "../ListingWizard";

interface PricingStepProps {
  formData: WizardFormData;
  updateFormData: (data: Partial<WizardFormData>) => void;
}

export function PricingStep({ formData, updateFormData }: PricingStepProps) {
  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value) || 0;
    updateFormData({ price: value });
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <DollarSign className="w-8 h-8 text-primary" />
        </div>
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">
          What's your monthly rent?
        </h2>
        <p className="text-gray-600">
          Set a fair price that reflects the value of your space and location
        </p>
      </div>

      <div className="max-w-md mx-auto space-y-6">
        <div>
          <Label htmlFor="price" className="text-sm font-medium text-gray-700 mb-2 block">
            Monthly Rent *
          </Label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <DollarSign className="h-5 w-5 text-gray-400" />
            </div>
            <Input
              id="price"
              type="number"
              placeholder="750"
              value={formData.price > 0 ? formData.price : ""}
              onChange={handlePriceChange}
              className="h-12 pl-11 border-gray-200 rounded-xl focus:border-primary focus:ring-0 text-gray-900 text-lg font-medium"
              min={1}
              max={10000}
            />
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Enter the monthly rent amount in US dollars
          </p>
        </div>

        {/* Pricing Guidelines */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
          <h3 className="font-medium text-amber-900 mb-2">💰 Pricing Guidelines</h3>
          <ul className="space-y-1 text-sm text-amber-800">
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 bg-amber-600 rounded-full mt-2 flex-shrink-0"></span>
              <span>Research similar listings in your area for competitive pricing</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 bg-amber-600 rounded-full mt-2 flex-shrink-0"></span>
              <span>Consider included utilities, amenities, and location value</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 bg-amber-600 rounded-full mt-2 flex-shrink-0"></span>
              <span>Remember that intergenerational housing often provides mutual benefits</span>
            </li>
          </ul>
        </div>

        {/* Sample Pricing Ranges */}
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
          <h3 className="font-medium text-gray-900 mb-3">📊 Typical Rent Ranges</h3>
          <div className="grid grid-cols-1 gap-2 text-sm">
            <div className="flex justify-between items-center py-1">
              <span className="text-gray-600">Private Room (shared spaces)</span>
              <span className="font-medium text-gray-900">$400 - $800</span>
            </div>
            <div className="flex justify-between items-center py-1">
              <span className="text-gray-600">Private Suite (bathroom + entrance)</span>
              <span className="font-medium text-gray-900">$600 - $1,200</span>
            </div>
            <div className="flex justify-between items-center py-1">
              <span className="text-gray-600">ADU/In-law unit</span>
              <span className="font-medium text-gray-900">$800 - $1,500</span>
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            *Ranges vary significantly by location and amenities
          </p>
        </div>

        {formData.price > 0 && (
          <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-xl">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                </svg>
              </div>
              <span className="text-sm font-medium text-green-800">
                Perfect! Your monthly rent is set to ${formData.price}.
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 