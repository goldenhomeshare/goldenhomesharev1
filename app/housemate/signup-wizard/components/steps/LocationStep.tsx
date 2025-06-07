"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AddressMap } from "@/app/components/AddressMap";
import { MapPin } from "lucide-react";
import { WizardFormData } from "../HousemateSignupWizard";

interface LocationStepProps {
  formData: WizardFormData;
  updateFormData: (updates: Partial<WizardFormData>) => void;
}

export function LocationStep({ formData, updateFormData }: LocationStepProps) {
  const handleCityChange = (city: string) => {
    updateFormData({
      location: {
        ...formData.location,
        city: city,
      }
    });
  };

  const handleStateChange = (state: string) => {
    updateFormData({
      location: {
        ...formData.location,
        state: state,
      }
    });
  };

  // Check if both city and state are filled
  const isLocationValid = formData.location.city.trim() && formData.location.state.trim();
  
  // Build address for map
  const fullAddress = isLocationValid 
    ? `${formData.location.city.trim()}, ${formData.location.state.trim()}, United States`
    : "";

  return (
    <div className="space-y-8">
      <div className="max-w-md mx-auto space-y-6">
        {/* Location Header */}
        <div className="text-center">
          <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <MapPin className="w-8 h-8 text-green-600" />
          </div>
        </div>

        {/* City and State Input Fields */}
        <div className="space-y-4">
          <div>
            <Label htmlFor="city" className="text-base font-medium mb-3 block">
              City *
            </Label>
            <Input
              id="city"
              type="text"
              placeholder="e.g., San Francisco"
              value={formData.location.city}
              onChange={(e) => handleCityChange(e.target.value)}
              className="h-12 border-2 border-gray-300 rounded-md text-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
            />
          </div>

          <div>
            <Label htmlFor="state" className="text-base font-medium mb-3 block">
              State *
            </Label>
            <Input
              id="state"
              type="text"
              placeholder="e.g., California"
              value={formData.location.state}
              onChange={(e) => handleStateChange(e.target.value)}
              className="h-12 border-2 border-gray-300 rounded-md text-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
            />
          </div>
        </div>

        <p className="text-sm text-gray-500 text-center">
          {isLocationValid 
            ? "Great! Your location is shown on the map below."
            : "Please enter both city and state to continue"
          }
        </p>
      </div>

      {/* Inline Map Display */}
      {isLocationValid && (
        <div className="max-w-4xl mx-auto mt-8">
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
            <AddressMap 
              address={fullAddress}
              className="h-80 w-full rounded-lg"
            />
          </div>
        </div>
      )}
    </div>
  );
} 