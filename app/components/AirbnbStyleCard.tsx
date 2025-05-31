'use client';

import { Heart, Bath, Car, Wifi, Utensils, Tv, Snowflake, Sun, Home, DoorOpen, WashingMachine, Armchair, Briefcase, User, GraduationCap, UserCheck, DollarSign, CheckCircle, MapPin } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface AirbnbStyleCardProps {
  images: string[];
  name: string;
  price: number;
  smallDescription: string;
  id: string;
  showEditButton?: boolean;
  location?: string;
  amenities?: string[];
  linkPath?: string;
  availabilityText?: string;
  priceLabel?: string;
  // Demographic information for housemates
  demographics?: {
    age?: string;
    gender?: string;
    occupation?: string;
    isCurrentlyAttending?: boolean;
    isRetired?: boolean;
  };
}

// Amenity icons mapping (same as ListingCard)
const amenityIcons: Record<string, any> = {
  parking: { icon: Car, label: "Parking" },
  wifi: { icon: Wifi, label: "WiFi" },
  kitchen: { icon: Utensils, label: "Kitchen Access" },
  tv: { icon: Tv, label: "TV" },
  ac: { icon: Snowflake, label: "Air Conditioning" },
  heating: { icon: Sun, label: "Heating" },
  privateBathroom: { icon: Bath, label: "Private Bathroom" },
  privateEntrance: { icon: DoorOpen, label: "Private Entrance" },
  laundry: { icon: WashingMachine, label: "Laundry Access" },
  patio: { icon: Home, label: "Patio/Balcony" },
  furnished: { icon: Armchair, label: "Furnished Room" },
  workspace: { icon: Briefcase, label: "Desk/Workspace" },
  // Housemate lifestyle preferences
  "early-riser": { icon: Sun, label: "Early Riser" },
  "night-owl": { icon: Snowflake, label: "Night Owl" },
  "flexible": { icon: Car, label: "Flexible Schedule" },
  "social": { icon: User, label: "Social" },
  "independent": { icon: Home, label: "Independent" },
  "balanced": { icon: User, label: "Balanced" },
  // Common hobbies
  "gardening": { icon: Home, label: "Gardening" },
  "cooking": { icon: Utensils, label: "Cooking" },
  "reading": { icon: Briefcase, label: "Reading" },
  "movies": { icon: Tv, label: "Movies/TV" },
  "volunteering": { icon: User, label: "Volunteering" },
  "fitness": { icon: User, label: "Fitness" },
  "church": { icon: Home, label: "Church" },
  "crafting": { icon: Armchair, label: "Arts & Crafts" },
  "music": { icon: User, label: "Music" },
  "tech": { icon: Briefcase, label: "Technology" },
  "pets": { icon: User, label: "Pet Lover" },
  "games": { icon: Armchair, label: "Board Games" },
};

// Gender and occupation labels for display
const genderLabels: Record<string, string> = {
  "male": "Male",
  "female": "Female",
  "other": "Other",
};

const occupationLabels: Record<string, string> = {
  "student": "Student",
  "professional": "Professional",
  "retired": "Retired",
};

export function AirbnbStyleCard({
  images,
  id,
  price,
  smallDescription,
  name,
  showEditButton = false,
  location = "Columbia, MO",
  amenities = [],
  linkPath,
  availabilityText = "Available now",
  priceLabel = "month",
  demographics
}: AirbnbStyleCardProps) {
  // Use the first image as the main image
  const mainImage = images[0] || "/placeholder-house.svg";
  
  // Get the first 3 amenities for display
  const displayAmenities = amenities.slice(0, 3);
  const remainingCount = amenities.length - displayAmenities.length;
  
  // Determine the link path - use custom linkPath if provided, otherwise default to product link
  const href = linkPath || `/product/${id}`;
  
  return (
    <Link href={href} className="group cursor-pointer">
      <div className="relative w-full h-full flex flex-col">
        {/* Main Image */}
        <div className="relative h-[280px] w-full overflow-hidden rounded-xl flex-shrink-0">
          <Image
            alt={name}
            src={mainImage}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
        
        {/* Card Content - Improved layout for housemates */}
        <div className="mt-3 flex-1 flex flex-col">
          {/* For housemates: Combine location and name in one line, otherwise keep separate */}
          {demographics ? (
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5">
                <h3 className="font-medium text-gray-900 truncate pr-2">{name}</h3>
                <CheckCircle size={14} className="text-blue-500 flex-shrink-0" />
              </div>
            </div>
          ) : (
            <>
              {/* Property Type/Name - Now prominent at top */}
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium text-gray-900 truncate pr-2">{name}</h3>
              </div>
              
              {/* Location with price on same line - Now below title */}
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2 flex-shrink-0">
                  <div className="flex items-baseline gap-1">
                    <span className="font-semibold text-gray-900">${price}</span>
                    <span className="text-gray-600 text-sm">per {priceLabel}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin size={12} className="text-gray-600" />
                    <p className="text-gray-600 text-sm truncate">{location}</p>
                  </div>
                </div>
              </div>
            </>
          )}
          
          {/* Demographics for housemates - Combined with amenities on same line */}
          {demographics && (
            <div className="mb-2">
              <div className="flex items-center gap-2 text-sm text-gray-700 flex-wrap">
                {demographics.age && (
                  <span className="flex items-center gap-1">
                    <User size={12} className="text-gray-600" />
                    <span>{demographics.age}</span>
                  </span>
                )}
                {demographics.gender && (
                  <span className="flex items-center gap-1">
                    <UserCheck size={12} className="text-gray-600" />
                    <span>{genderLabels[demographics.gender] || demographics.gender}</span>
                  </span>
                )}
                {demographics.occupation && (
                  <span className="flex items-center gap-1">
                    {demographics.isRetired ? (
                      <Armchair size={12} className="text-gray-600" />
                    ) : demographics.isCurrentlyAttending ? (
                      <GraduationCap size={12} className="text-gray-600" />
                    ) : (
                      <Briefcase size={12} className="text-gray-600" />
                    )}
                    <span>{demographics.isRetired ? "Retired" : demographics.isCurrentlyAttending ? "Student" : (occupationLabels[demographics.occupation] || demographics.occupation)}</span>
                  </span>
                )}
                {/* Add budget to the same line */}
                <span className="flex items-center gap-1">
                  <span>${price}</span>
                  <span className="text-xs">{priceLabel}</span>
                </span>
                {/* Add amenities to the same line */}
                {amenities.slice(0, 2).map((amenityId) => {
                  const amenity = amenityIcons[amenityId];
                  if (!amenity) return null;
                  
                  const Icon = amenity.icon;
                  return (
                    <div 
                      key={amenityId} 
                      className="flex items-center gap-1 bg-gray-100 rounded-full px-2 py-0.5 text-xs"
                      title={amenity.label}
                    >
                      <Icon size={10} className="text-gray-600" />
                      <span className="text-gray-700 font-medium">{amenity.label}</span>
                    </div>
                  );
                })}
                {amenities.length > 2 && (
                  <div className="flex items-center bg-gray-100 rounded-full px-2 py-0.5 text-xs">
                    <span className="text-gray-700 font-medium">+{amenities.length - 2} more</span>
                  </div>
                )}
              </div>
            </div>
          )}
          
          {/* Amenities - Only show for non-housemate cards since housemates have them combined above */}
          {/* Description removed for cleaner layout */}
        </div>
      </div>
    </Link>
  );
}

export function LoadingAirbnbCard() {
  return (
    <div className="animate-pulse h-full flex flex-col">
      <div className="h-[280px] w-full bg-gray-200 rounded-xl flex-shrink-0" />
      <div className="mt-3 flex-1 flex flex-col min-h-[120px]">
        <div className="flex justify-between mb-1">
          <div className="h-4 bg-gray-200 rounded w-3/4" />
        </div>
        <div className="h-3 bg-gray-200 rounded w-full mb-1" />
        <div className="flex-1 min-h-[40px] flex items-start mb-2">
          <div className="flex gap-1">
            <div className="h-6 bg-gray-200 rounded-full w-16" />
            <div className="h-6 bg-gray-200 rounded-full w-20" />
            <div className="h-6 bg-gray-200 rounded-full w-14" />
          </div>
        </div>
        <div className="h-3 bg-gray-200 rounded w-2/3 mb-1" />
        <div className="h-4 bg-gray-200 rounded w-20" />
      </div>
    </div>
  );
} 