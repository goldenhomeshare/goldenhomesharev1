'use client';

import { Heart, Bath, Car, Wifi, Utensils, Tv, Snowflake, Sun, Home, DoorOpen, WashingMachine, Armchair, Briefcase } from "lucide-react";
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
};

export function AirbnbStyleCard({
  images,
  id,
  price,
  smallDescription,
  name,
  showEditButton = false,
  location = "Columbia, MO",
  amenities = []
}: AirbnbStyleCardProps) {
  // Use the first image as the main image
  const mainImage = images[0] || "/placeholder-house.svg";
  
  // Get the first 3 amenities for display
  const displayAmenities = amenities.slice(0, 3);
  const remainingCount = amenities.length - displayAmenities.length;
  
  return (
    <Link href={`/product/${id}`} className="group cursor-pointer">
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
          
          {/* Heart Icon - Favorite Button */}
          <button 
            className="absolute top-3 right-3 p-2 rounded-full bg-white/80 hover:bg-white transition-colors"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              // Add favorite functionality here
            }}
          >
            <Heart size={16} className="text-gray-600 hover:text-red-500 transition-colors" />
          </button>
        </div>
        
        {/* Card Content - Fixed height to ensure consistency */}
        <div className="mt-3 flex-1 flex flex-col min-h-[120px]">
          {/* Location */}
          <div className="flex items-center justify-between mb-1">
            <h3 className="font-medium text-gray-900 truncate pr-2">{location}</h3>
          </div>
          
          {/* Property Type/Name */}
          <p className="text-gray-600 text-sm truncate mb-1">{name}</p>
          
          {/* Amenities - Fixed height container */}
          <div className="flex-1 min-h-[40px] flex items-start mb-2">
            {amenities.length > 0 ? (
              <div className="w-full">
                <div className="flex flex-wrap items-center gap-1">
                  {displayAmenities.map((amenityId) => {
                    const amenity = amenityIcons[amenityId];
                    if (!amenity) return null;
                    
                    const Icon = amenity.icon;
                    return (
                      <div 
                        key={amenityId} 
                        className="flex items-center gap-1 bg-gray-100 rounded-full px-2 py-1 text-xs"
                        title={amenity.label}
                      >
                        <Icon size={12} className="text-gray-600" />
                        <span className="text-gray-700 font-medium">{amenity.label}</span>
                      </div>
                    );
                  })}
                  {remainingCount > 0 && (
                    <div className="flex items-center bg-gray-100 rounded-full px-2 py-1 text-xs">
                      <span className="text-gray-700 font-medium">+{remainingCount} more</span>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <p className="text-xs text-gray-600 line-clamp-2">
                {smallDescription}
              </p>
            )}
          </div>
          
          {/* Available text */}
          <p className="text-gray-600 text-sm mb-1 flex-shrink-0">Available now</p>
          
          {/* Price */}
          <div className="flex items-baseline gap-1 flex-shrink-0">
            <span className="font-semibold text-gray-900">${price}</span>
            <span className="text-gray-600 text-sm">month</span>
          </div>
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