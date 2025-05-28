"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MapPin } from "lucide-react";
import { WizardFormData } from "../ListingWizard";

interface AddressStepProps {
  formData: WizardFormData;
  updateFormData: (data: Partial<WizardFormData>) => void;
}

export function AddressStep({ formData, updateFormData }: AddressStepProps) {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <MapPin className="w-8 h-8 text-primary" />
        </div>
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">
          Where is your property located?
        </h2>
        <p className="text-gray-600">
          Don't worry - we'll only show the general area to potential housemates for privacy
        </p>
      </div>

      <div className="max-w-md mx-auto space-y-4">
        <div>
          <Label htmlFor="address" className="text-sm font-medium text-gray-700 mb-2 block">
            Property Address *
          </Label>
          <Input
            id="address"
            placeholder="Enter your full address (e.g., 123 Main St, San Francisco, CA 94102)"
            value={formData.address}
            onChange={(e) => updateFormData({ address: e.target.value })}
            className="h-12 border-gray-200 rounded-xl focus:border-primary focus:ring-0 text-gray-900"
          />
          <p className="text-xs text-gray-500 mt-2">
            Your exact address will remain private and only be shared with confirmed matches
          </p>
        </div>

        {/* Privacy Information */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <h3 className="font-medium text-blue-900 mb-2">🔒 Privacy Protection</h3>
          <ul className="space-y-1 text-sm text-blue-800">
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 flex-shrink-0"></span>
              <span>Only the neighborhood will be visible in search results</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 flex-shrink-0"></span>
              <span>Your exact address is shared only with confirmed matches</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 flex-shrink-0"></span>
              <span>We use secure encryption to protect your location data</span>
            </li>
          </ul>
        </div>

        {formData.address.trim() && (
          <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-xl">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                </svg>
              </div>
              <span className="text-sm font-medium text-green-800">
                Great! Location added to your listing.
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 