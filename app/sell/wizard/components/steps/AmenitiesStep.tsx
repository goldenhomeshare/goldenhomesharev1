"use client";

import { Label } from "@/components/ui/label";
import { Car, Wifi, Utensils, Tv, Snowflake, Sun, Bath, DoorOpen, WashingMachine, Home, Armchair, Briefcase } from "lucide-react";
import { WizardFormData } from "../ListingWizard";

interface AmenitiesStepProps {
  formData: WizardFormData;
  updateFormData: (data: Partial<WizardFormData>) => void;
}

const amenities = [
  { id: "parking", label: "Parking", icon: Car },
  { id: "wifi", label: "WiFi", icon: Wifi },
  { id: "kitchen", label: "Kitchen Access", icon: Utensils },
  { id: "tv", label: "TV", icon: Tv },
  { id: "ac", label: "Air Conditioning", icon: Snowflake },
  { id: "heating", label: "Heating", icon: Sun },
  { id: "privateBathroom", label: "Private Bathroom", icon: Bath },
  { id: "privateEntrance", label: "Private Entrance", icon: DoorOpen },
  { id: "laundry", label: "Laundry Access", icon: WashingMachine },
  { id: "patio", label: "Patio/Balcony", icon: Home },
  { id: "furnished", label: "Furnished Room", icon: Armchair },
  { id: "workspace", label: "Desk/Workspace", icon: Briefcase },
];

export function AmenitiesStep({ formData, updateFormData }: AmenitiesStepProps) {
  const toggleAmenity = (amenityId: string) => {
    const updatedAmenities = formData.selectedAmenities.includes(amenityId)
      ? formData.selectedAmenities.filter(id => id !== amenityId)
      : [...formData.selectedAmenities, amenityId];
    
    updateFormData({ selectedAmenities: updatedAmenities });
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">
          What amenities does your space include?
        </h2>
        <p className="text-gray-600">
          Select all that apply to help potential housemates understand what's included
        </p>
      </div>

      <div>
        <Label className="text-sm font-medium text-gray-700 mb-4 block">
          Available Amenities (select all that apply)
        </Label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {amenities.map((amenity) => {
            const Icon = amenity.icon;
            const isSelected = formData.selectedAmenities.includes(amenity.id);
            
            return (
              <label key={amenity.id} className="cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={isSelected}
                  onChange={() => toggleAmenity(amenity.id)}
                />
                <div className="flex flex-col items-center p-4 rounded-xl border-2 peer-checked:border-primary peer-checked:bg-primary/5 hover:bg-gray-50 h-full transition-all">
                  <div className="w-12 h-12 rounded-full bg-gray-100 mb-3 flex items-center justify-center">
                    <Icon size={24} className="text-gray-600" />
                  </div>
                  <span className="font-medium text-center text-sm">{amenity.label}</span>
                </div>
              </label>
            );
          })}
        </div>
      </div>

      {/* Tips Section */}
      <div className="bg-primary/5 border border-primary/20 rounded-xl p-6">
        <h3 className="font-medium text-primary mb-3">💡 Amenity Tips</h3>
        <ul className="space-y-2 text-sm text-gray-700">
          <li className="flex items-start gap-2">
            <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></span>
            <span>Include all amenities that are available to your housemate</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></span>
            <span>Popular amenities like parking and WiFi can make your listing more attractive</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></span>
            <span>Be honest about what's included to set proper expectations</span>
          </li>
        </ul>
      </div>

      {formData.selectedAmenities.length > 0 && (
        <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-xl">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
              <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
              </svg>
            </div>
            <span className="text-sm font-medium text-green-800">
              Great! You've selected {formData.selectedAmenities.length} amenities.
            </span>
          </div>
        </div>
      )}
    </div>
  );
} 