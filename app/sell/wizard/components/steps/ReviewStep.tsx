"use client";

import { CheckCircle, MapPin, DollarSign, Camera, FileText, Home } from "lucide-react";
import Image from "next/image";
import { WizardFormData } from "../ListingWizard";

interface ReviewStepProps {
  formData: WizardFormData;
  firstName: string;
  lastName: string;
  email: string;
}

const categoryLabels: Record<string, string> = {
  template: "Homeowner with Private Suite",
  uikit: "Homeowner with Private Room", 
  icon: "Homeowner with ADU"
};

export function ReviewStep({ formData, firstName, lastName, email }: ReviewStepProps) {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-8 h-8 text-primary" />
        </div>
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">
          Review your listing
        </h2>
        <p className="text-gray-600">
          Take a final look at your listing before we publish it
        </p>
      </div>

      <div className="max-w-4xl mx-auto space-y-6">
        {/* Listing Preview */}
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
          {/* Header */}
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {formData.title}
                </h3>
                <p className="text-gray-600 mb-3">
                  {formData.smallDescription}
                </p>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    <span>{formData.address}</span>
                  </div>
                  {formData.category && (
                    <div className="flex items-center gap-1">
                      <Home className="w-4 h-4" />
                      <span>{categoryLabels[formData.category] || formData.category}</span>
                    </div>
                  )}
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-primary">
                  ${formData.price}
                </div>
                <div className="text-sm text-gray-500">per month</div>
              </div>
            </div>
          </div>

          {/* Photos */}
          {formData.images.length > 0 && (
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center gap-2 mb-4">
                <Camera className="w-5 h-5 text-gray-600" />
                <h4 className="font-medium text-gray-900">Photos ({formData.images.length})</h4>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {formData.images.slice(0, 8).map((imageUrl, index) => (
                  <div key={index} className="relative w-full h-24 rounded-lg overflow-hidden border border-gray-200">
                    <Image
                      src={imageUrl}
                      alt={`Property image ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                ))}
                {formData.images.length > 8 && (
                  <div className="w-full h-24 rounded-lg border border-gray-200 bg-gray-50 flex items-center justify-center">
                    <span className="text-sm text-gray-500">+{formData.images.length - 8} more</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Amenities */}
          {formData.selectedAmenities.length > 0 && (
            <div className="p-6 border-b border-gray-100">
              <h4 className="font-medium text-gray-900 mb-3">Amenities</h4>
              <div className="flex flex-wrap gap-2">
                {formData.selectedAmenities.map((amenity) => (
                  <span key={amenity} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                    {amenity}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Support Requested */}
          {formData.supportRequested.length > 0 && (
            <div className="p-6 border-b border-gray-100">
              <h4 className="font-medium text-gray-900 mb-3">Support Requested</h4>
              <div className="space-y-2">
                {formData.supportRequested.map((support) => (
                  <div key={support.id} className="flex justify-between items-center text-sm">
                    <span className="text-gray-700 capitalize">{support.id}</span>
                    <span className="text-gray-500">{support.hoursPerWeek} hrs/week</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* House Rules */}
          {formData.houseRules.length > 0 && (
            <div className="p-6 border-b border-gray-100">
              <h4 className="font-medium text-gray-900 mb-3">House Rules</h4>
              <div className="space-y-2">
                {formData.houseRules.map((rule) => (
                  <div key={rule.id} className="flex justify-between items-center text-sm">
                    <span className="text-gray-700 capitalize">{rule.id.replace(/([A-Z])/g, ' $1')}</span>
                    <span className="text-gray-500">{rule.value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Description */}
          <div className="p-6">
            <div className="flex items-center gap-2 mb-3">
              <FileText className="w-5 h-5 text-gray-600" />
              <h4 className="font-medium text-gray-900">Description</h4>
            </div>
            <div className="text-gray-700 text-sm leading-relaxed whitespace-pre-line">
              {formData.description}
            </div>
          </div>
        </div>

        {/* Contact Info */}
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
          <h4 className="font-medium text-gray-900 mb-3">Listing Owner</h4>
          <div className="text-sm text-gray-700">
            <p><strong>Name:</strong> {firstName} {lastName}</p>
            <p><strong>Email:</strong> {email}</p>
          </div>
        </div>

        {/* Ready to Publish */}
        <div className="bg-green-50 border border-green-200 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-3">
            <CheckCircle className="w-6 h-6 text-green-600" />
            <h4 className="font-medium text-green-900">Ready to Publish!</h4>
          </div>
          <p className="text-sm text-green-800 mb-4">
            Your listing looks great! Click "Create Listing" to publish it and start connecting with potential housemates.
          </p>
          <div className="text-xs text-green-700">
            <p>• Your listing will be visible to verified users on our platform</p>
            <p>• You'll receive notifications when someone expresses interest</p>
            <p>• You can edit or update your listing anytime after publishing</p>
          </div>
        </div>
      </div>
    </div>
  );
} 