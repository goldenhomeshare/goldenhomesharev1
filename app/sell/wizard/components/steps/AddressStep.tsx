"use client";

import { Label } from "@/components/ui/label";
import { MapPin } from "lucide-react";
import { AddressMap } from "@/app/components/AddressMap";
import { AddressAutocomplete } from "@/app/components/AddressAutocomplete";
import { WizardFormData } from "../ListingWizard";

interface AddressStepProps {
  formData: WizardFormData;
  updateFormData: (data: Partial<WizardFormData>) => void;
}

export function AddressStep({ formData, updateFormData }: AddressStepProps) {
  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-semibold text-gray-900 mb-4">
          Where's your place located?
        </h2>
        <p className="text-gray-600 text-lg mb-2">
          Start by entering your general address. You'll confirm the exact details in the next step.
        </p>
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <p className="text-gray-600 text-sm">
            💡 Tip: Just enter the main address for now - we'll help you complete all the details on the next page to ensure your listing appears correctly on the map.
          </p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto space-y-6">
        <div>
          <Label htmlFor="address" className="text-sm font-medium text-gray-700 mb-2 block">
            Enter your address
          </Label>
          <AddressAutocomplete
            value={formData.address}
            onChange={(value) => updateFormData({ address: value })}
            placeholder="Enter your full address (e.g., 1208 East Ash St, Columbia, MO 65201)"
            className="h-14 border-gray-300 rounded-lg focus:border-primary focus:ring-0 text-gray-900 text-lg"
          />
        </div>

        {/* Map Component - only show when address is entered */}
        {formData.address.trim() && (
          <div className="space-y-4">
            <AddressMap 
              address={formData.address} 
              className="h-96 border-gray-200 shadow-sm" 
            />
          </div>
        )}

        {/* Privacy Information - only show when address is entered */}
        {formData.address.trim() && (
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
            <h3 className="font-medium text-blue-900 mb-3 flex items-center gap-2">
              🔒 Privacy Protection
            </h3>
            <ul className="space-y-2 text-sm text-blue-800">
              <li className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 flex-shrink-0"></span>
                <span>Only the neighborhood will be visible in search results</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 flex-shrink-0"></span>
                <span>Your exact address is shared only with confirmed matches</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 flex-shrink-0"></span>
                <span>We use secure encryption to protect your location data</span>
              </li>
            </ul>
          </div>
        )}

        {/* Address validation feedback */}
        {formData.address.trim() && (
          <div className="p-4 bg-green-50 border border-green-200 rounded-xl">
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                </svg>
              </div>
              <span className="text-sm font-medium text-green-800">
                Great! Location added to your listing.
              </span>
            </div>
          </div>
        )}

        {/* Debug information */}
        {formData.address.trim() && (
          <div className="p-4 bg-gray-100 border rounded-xl">
            <p className="text-sm text-gray-600">
              <strong>Debug:</strong> Address length: {formData.address.length}, Value: "{formData.address}"
            </p>
          </div>
        )}

        {/* Help text when no address is entered */}
        {!formData.address.trim() && (
          <div className="text-center p-8">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <MapPin className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-500 mb-2">Start typing your address to see suggestions</p>
            <p className="text-sm text-gray-400">
              We'll help you find the exact location with address autocomplete
            </p>
          </div>
        )}
      </div>
    </div>
  );
} 