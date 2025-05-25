"use client";

import { useEffect, useRef, useState } from "react";
import { Label } from "@/components/ui/label";
import { MapPin } from "lucide-react";
import { WizardFormData } from "../HousemateSignupWizard";
import { useLoadScript } from "@react-google-maps/api";

interface LocationStepProps {
  formData: WizardFormData;
  updateFormData: (updates: Partial<WizardFormData>) => void;
}

const libraries: ("places")[] = ["places"];

export function LocationStep({ formData, updateFormData }: LocationStepProps) {
  const [autocomplete, setAutocomplete] = useState<google.maps.places.Autocomplete | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
    libraries,
  });

  useEffect(() => {
    if (!isLoaded || loadError || !inputRef.current) return;

    const options = {
      componentRestrictions: { country: "us" },
      fields: ["address_components", "formatted_address", "geometry"],
      types: ["(cities)"],
    };

    const autocompleteInstance = new google.maps.places.Autocomplete(inputRef.current, options);
    setAutocomplete(autocompleteInstance);

    const handlePlaceChanged = () => {
      const place = autocompleteInstance.getPlace();
      
      if (!place || !place.address_components) {
        return;
      }

      let city = "";
      let state = "";

      // Extract city and state from address components
      place.address_components.forEach((component) => {
        const types = component.types;
        
        if (types.includes("locality")) {
          city = component.long_name;
        } else if (types.includes("administrative_area_level_1")) {
          state = component.long_name;
        }
      });

      // Update form data with extracted location
      updateFormData({
        location: {
          city: city,
          state: state,
        }
      });
    };

    autocompleteInstance.addListener("place_changed", handlePlaceChanged);

    return () => {
      if (autocompleteInstance) {
        google.maps.event.clearInstanceListeners(autocompleteInstance);
      }
    };
  }, [isLoaded, loadError, updateFormData]);

  if (loadError) {
    return (
      <div className="space-y-8">
        <div className="max-w-md mx-auto space-y-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <MapPin className="w-8 h-8 text-red-600" />
            </div>
            <p className="text-red-600">
              Error loading Google Maps. Please try again later.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="space-y-8">
        <div className="max-w-md mx-auto space-y-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <MapPin className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-600">
              Loading location services...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="max-w-md mx-auto space-y-6">
        {/* Location Header */}
        <div className="text-center">
          <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <MapPin className="w-8 h-8 text-blue-600" />
          </div>
          <p className="text-gray-600">
            Search for the city where you're looking to find housing
          </p>
        </div>

        {/* Google Places Autocomplete Input */}
        <div>
          <Label htmlFor="location" className="text-base font-medium mb-3 block">
            City and State *
          </Label>
          <input
            ref={inputRef}
            id="location"
            type="text"
            placeholder="e.g., San Francisco, CA"
            className="h-12 w-full px-4 py-2 border-2 border-gray-300 rounded-md text-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
          />
          <p className="text-sm text-gray-500 mt-2">
            Start typing to search for cities in the United States
          </p>
        </div>
      </div>
    </div>
  );
} 