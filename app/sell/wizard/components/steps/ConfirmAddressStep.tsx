"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AddressMap } from "@/app/components/AddressMap";
import { WizardFormData } from "../ListingWizard";

interface ConfirmAddressStepProps {
  formData: WizardFormData;
  updateFormData: (data: Partial<WizardFormData>) => void;
}

export function ConfirmAddressStep({ formData, updateFormData }: ConfirmAddressStepProps) {
  // Build full address from components for display/map
  const buildFullAddress = () => {
    const parts = [];
    if (formData.streetAddress) parts.push(formData.streetAddress);
    if (formData.aptSuite) parts.push(formData.aptSuite);
    if (formData.city) parts.push(formData.city);
    if (formData.state && formData.zipCode) {
      parts.push(`${formData.state} ${formData.zipCode}`);
    } else if (formData.state) {
      parts.push(formData.state);
    }
    return parts.join(', ');
  };

  const fullAddress = buildFullAddress();

  // Validation function
  const isAddressValid = () => {
    return !!(
      formData.streetAddress?.trim() &&
      formData.city?.trim() &&
      formData.state?.trim() &&
      formData.zipCode?.trim()
    );
  };

  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-semibold text-gray-900 mb-4">
          Where's your place located?
        </h2>
        <p className="text-gray-600 text-lg mb-2">
          Enter your complete address details below.
        </p>
        <p className="text-gray-500 text-sm">
          You control who sees your exact address - only share it with housemates you choose to connect with.
        </p>
      </div>

      <div className="max-w-xl mx-auto space-y-4">
        {/* Street Address */}
        <div>
          <Label htmlFor="streetAddress" className="text-sm font-medium text-gray-600 mb-2 block">
            Street address <span className="text-red-500">*</span>
          </Label>
          <Input
            id="streetAddress"
            value={formData.streetAddress}
            onChange={(e) => updateFormData({ streetAddress: e.target.value })}
            className={`h-12 text-gray-900 ${
              formData.streetAddress ? 'border-gray-400 bg-gray-50' : 'border-gray-300'
            }`}
            placeholder="123 Main Street"
            required
          />
        </div>

        {/* Apt, Suite, Unit */}
        <div>
          <Label htmlFor="aptSuite" className="text-sm font-medium text-gray-600 mb-2 block">
            Apt, suite, unit (optional)
          </Label>
          <Input
            id="aptSuite"
            value={formData.aptSuite}
            onChange={(e) => updateFormData({ aptSuite: e.target.value })}
            className="h-12 border-gray-300 text-gray-900"
            placeholder="Apt 2B"
          />
        </div>

        {/* City/Town */}
        <div>
          <Label htmlFor="city" className="text-sm font-medium text-gray-600 mb-2 block">
            City / town <span className="text-red-500">*</span>
          </Label>
          <Input
            id="city"
            value={formData.city}
            onChange={(e) => updateFormData({ city: e.target.value })}
            className={`h-12 text-gray-900 ${
              formData.city ? 'border-gray-400 bg-gray-50' : 'border-gray-300'
            }`}
            placeholder="Anytown"
            required
          />
        </div>

        {/* State/Territory */}
        <div>
          <Label htmlFor="state" className="text-sm font-medium text-gray-600 mb-2 block">
            State / territory <span className="text-red-500">*</span>
          </Label>
          <Input
            id="state"
            value={formData.state}
            onChange={(e) => updateFormData({ state: e.target.value })}
            className={`h-12 text-gray-900 ${
              formData.state ? 'border-gray-400 bg-gray-50' : 'border-gray-300'
            }`}
            placeholder="State"
            required
          />
        </div>

        {/* ZIP Code */}
        <div>
          <Label htmlFor="zipCode" className="text-sm font-medium text-gray-600 mb-2 block">
            ZIP code <span className="text-red-500">*</span>
          </Label>
          <Input
            id="zipCode"
            value={formData.zipCode}
            onChange={(e) => updateFormData({ zipCode: e.target.value })}
            className={`h-12 text-gray-900 ${
              formData.zipCode ? 'border-gray-400 bg-gray-50' : 'border-gray-300'
            }`}
            placeholder="12345"
            pattern="[0-9]{5}(-[0-9]{4})?"
            required
          />
        </div>
      </div>

      {/* Map - always show when address is valid */}
      {isAddressValid() && (
        <div className="max-w-4xl mx-auto">
          <AddressMap 
            address={`${fullAddress}, United States`} 
            className="h-96 border-gray-200 shadow-sm rounded-lg" 
          />
        </div>
      )}
    </div>
  );
} 