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
          What's your monthly rate?
        </h2>
        <p className="text-gray-600">
          Set a fair price that reflects the value of your space and location
        </p>
      </div>

      <div className="max-w-md mx-auto space-y-6">
        <div>
          <Label htmlFor="price" className="text-sm font-medium text-gray-700 mb-2 block">
            Monthly Rate *
          </Label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <DollarSign className="h-5 w-5 text-gray-400" />
            </div>
            <Input
              id="price"
              type="number"
              placeholder="300"
              value={formData.price > 0 ? formData.price : ""}
              onChange={handlePriceChange}
              className="h-12 pl-11 border-gray-200 rounded-xl focus:border-primary focus:ring-0 text-gray-900 text-lg font-medium"
              min={1}
              max={10000}
            />
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Enter the monthly rate amount in US dollars
          </p>
        </div>

        {/* Location-based Recommendation */}
        <div className="bg-primary/5 border border-primary/20 rounded-xl p-6">
          <p className="text-sm text-gray-700">
            Based on your location, it is recommended to price your room at <strong>$250 - $525 per month</strong>.
          </p>
          <p className="text-xs text-gray-600 mt-2">
            This range considers local market rates and typical homesharing arrangements in your area.
          </p>
        </div>
      </div>
    </div>
  );
} 