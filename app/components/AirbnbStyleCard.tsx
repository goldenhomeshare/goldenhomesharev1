'use client';

import { Heart, Bath, Car, Wifi, Utensils, Tv, Snowflake, Sun, Home, DoorOpen, WashingMachine, Armchair, Briefcase, User, GraduationCap, UserCheck, DollarSign, CheckCircle, MapPin, ShieldCheck } from "lucide-react";
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
  isVerified?: boolean;
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
  isVerified = false,
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
        <div className={`relative overflow-hidden flex-shrink-0 ${
          demographics 
            ? "h-[280px] w-[280px] mx-auto rounded-full" 
            : "h-[280px] w-full rounded-xl"
        }`}>
          <Image
            alt={name}
            src={mainImage}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
        {/* Verification Badge - Only show for verified users with demographics (housemates) */}
        {isVerified && demographics && (
          <div 
            className="absolute bottom-[15px] right-[-5px] w-10 h-10 bg-gradient-to-br from-amber-400 to-yellow-600 rounded-full flex items-center justify-center shadow-lg cursor-help z-10" 
            title="This person has been background checked"
          >
            <ShieldCheck size={28} className="text-white" />
          </div>
        )}
        
        {/* Card Content - Clean design for housemates */}
        <div className="mt-4 flex-1 flex flex-col items-center text-center">
          {demographics ? (
            <>
              {/* Name - First name only */}
              <h3 className="font-bold text-3xl text-gray-900 mb-4">{name.split(' ')[0]}</h3>
            </>
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