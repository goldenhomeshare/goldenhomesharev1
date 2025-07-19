'use client';

import Image from "next/image";
import Link from "next/link";
import { ShieldCheck, User } from "lucide-react";

interface AirbnbStyleCardProps {
  images: string[];
  id: string;
  price: number;
  smallDescription: string;
  name: string;
  showEditButton?: boolean;
  location?: string;
  amenities?: string[];
  linkPath?: string;
  availabilityText?: string;
  priceLabel?: string;
  isVerified?: boolean;
  demographics?: {
    gender?: string;
    ageRange?: string;
    occupation?: string;
    isCurrentlyAttending?: boolean;
    isRetired?: boolean;
  };
}

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
    <Link href={href} className="cursor-pointer">
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
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
        
        {/* Verification Badge - Design element for helper profiles */}
        {demographics && (
          <div 
            className="absolute top-[200px] right-[60px] w-16 h-16 bg-gradient-to-br from-amber-400 to-yellow-600 rounded-full flex items-center justify-center shadow-xl cursor-help z-20" 
            title="This person has been background checked"
          >
            <ShieldCheck size={36} className="text-white" />
          </div>
        )}
        
        {/* Card Content - Enhanced design for housemates */}
        {demographics ? (
          <div className="flex-1 pt-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <h3 className="font-semibold text-2xl text-gray-900 truncate">{name}</h3>
            </div>
            
            {/* Job Title with enhanced logic */}
            {(() => {
              // Enhanced occupation display logic matching HousemateHorizontalCard
              const getOccupationDisplay = () => {
                // Check if retired
                if (demographics.isRetired) {
                  return "Retired";
                }
                
                // Check if currently a student
                if (demographics.isCurrentlyAttending) {
                  return "Student";
                }
                
                // Fall back to basic occupation
                if (demographics.occupation) {
                  return demographics.occupation;
                }
                
                return null;
              };

              const occupationDisplay = getOccupationDisplay();
              
              return occupationDisplay ? (
                <p className="text-sm text-gray-600 mb-2">{occupationDisplay}</p>
              ) : null;
            })()}
            
            <div className="mt-auto">
              <p className="text-lg font-semibold text-gray-900">
                ${price}
                <span className="text-sm font-normal text-gray-600">/{priceLabel}</span>
              </p>
            </div>
          </div>
        ) : (
          // Standard listing card content
          <div className="flex-1 pt-3">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-semibold text-lg text-gray-900 line-clamp-1">{name}</h3>
            </div>
            
            <p className="text-sm text-gray-600 mb-1">{location}</p>
            <p className="text-sm text-gray-600 mb-2">{availabilityText}</p>
            
            {/* Amenities */}
            {displayAmenities.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-3">
                {displayAmenities.map((amenity, index) => (
                  <span 
                    key={index}
                    className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-md"
                  >
                    {amenity}
                  </span>
                ))}
                {remainingCount > 0 && (
                  <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-md">
                    +{remainingCount} more
                  </span>
                )}
              </div>
            )}
            
            <div className="flex justify-between items-center">
              <p className="text-sm text-gray-600 line-clamp-2">{smallDescription}</p>
              <p className="text-lg font-semibold text-gray-900 ml-2">
                ${price}
                <span className="text-sm font-normal">/{priceLabel}</span>
              </p>
            </div>
          </div>
        )}
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