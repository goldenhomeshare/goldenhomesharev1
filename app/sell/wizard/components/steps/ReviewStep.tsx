"use client";

import { CheckCircle, MapPin, DollarSign, Camera, FileText, Home, Car, Wifi, Utensils, Tv, Snowflake, Sun, Bath, DoorOpen, WashingMachine, Armchair, Briefcase, Sparkles, Salad, Flower, ShoppingBag, HeartHandshake, Cat, Monitor, Wrench } from "lucide-react";
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

const supportLabels: Record<string, string> = {
  cleaning: "Cleaning",
  cooking: "Cooking",
  gardening: "Yard Work",
  errands: "Shopping & Errands",
  companionship: "Companionship",
  petCare: "Pet Care",
  techSupport: "Tech Support",
  homeMaintenance: "Home Maintenance",
  transportation: "Transportation"
};

const amenityLabels: Record<string, { label: string; icon: any }> = {
  parking: { label: "Parking", icon: Car },
  wifi: { label: "WiFi", icon: Wifi },
  kitchen: { label: "Kitchen Access", icon: Utensils },
  tv: { label: "TV", icon: Tv },
  ac: { label: "Air Conditioning", icon: Snowflake },
  heating: { label: "Heating", icon: Sun },
  privateBathroom: { label: "Private Bathroom", icon: Bath },
  privateEntrance: { label: "Private Entrance", icon: DoorOpen },
  laundry: { label: "Laundry Access", icon: WashingMachine },
  patio: { label: "Patio/Balcony", icon: Home },
  furnished: { label: "Furnished Room", icon: Armchair },
  workspace: { label: "Desk/Workspace", icon: Briefcase }
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
                    <span>
                      {formData.streetAddress && formData.city && formData.state && formData.zipCode
                        ? `${formData.streetAddress}${formData.aptSuite ? `, ${formData.aptSuite}` : ''}, ${formData.city}, ${formData.state} ${formData.zipCode}`
                        : 'Address not provided'
                      }
                    </span>
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
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {formData.selectedAmenities.map((amenity) => {
                  const amenityInfo = amenityLabels[amenity];
                  const IconComponent = amenityInfo?.icon || Home;
                  const label = amenityInfo?.label || amenity;
                  
                  return (
                    <div key={amenity} className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                      <IconComponent className="w-4 h-4 text-gray-600" />
                      <span className="text-sm text-gray-700">{label}</span>
                    </div>
                  );
                })}
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
                    <span className="text-gray-700">{supportLabels[support.id] || support.id}</span>
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
      </div>
    </div>
  );
} 