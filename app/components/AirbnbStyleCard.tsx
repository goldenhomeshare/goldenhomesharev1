'use client';

import Image from "next/image";
import Link from "next/link";
import { ShieldCheck, User, GraduationCap, Briefcase, Armchair, Heart } from "lucide-react";

// Utility function to extract city and state from full address
function getCityStateFromAddress(fullAddress?: string | null): { city: string; state: string; cityState: string } {
  if (!fullAddress) return { city: '', state: '', cityState: '' };
  
  // Split address by commas and trim whitespace
  const parts = fullAddress.split(',').map(part => part.trim()).filter(part => part.length > 0);
  
  let city = '';
  let state = '';
  
  // Common US address formats:
  // "123 Main St, Springfield, IL 62701" -> ["123 Main St", "Springfield", "IL 62701"]
  // "Springfield, IL 62701" -> ["Springfield", "IL 62701"]
  
  if (parts.length >= 3) {
    // For format: "Street, City, State ZIP" - city is third from last
    city = parts[parts.length - 3];
    const stateZip = parts[parts.length - 2];
    state = stateZip.split(' ')[0]; // Extract state from "IL 62701"
  } else if (parts.length === 2) {
    // For format: "City, State ZIP" - city is first part
    city = parts[0];
    const stateZip = parts[1];
    state = stateZip.split(' ')[0]; // Extract state from "IL 62701"
  }
  
  // Create full city, state string
  const cityState = city && state ? `${city}, ${state}` : city || '';
  
  return { city, state, cityState };
}

// Legacy function for backward compatibility
function getCityFromAddress(fullAddress?: string | null): string {
  return getCityStateFromAddress(fullAddress).city;
}

// Utility function to calculate total hours from supportRequested data
function getTotalHoursPerWeek(supportRequested?: any): number {
  if (!supportRequested) return 0;
  
  // Handle if it's already an array
  if (Array.isArray(supportRequested)) {
    let totalHours = 0;
    supportRequested.forEach((item: any) => {
      if (typeof item === 'object' && item.hoursPerWeek) {
        totalHours += item.hoursPerWeek;
      }
    });
    return totalHours;
  }
  
  return 0;
}

interface AirbnbStyleCardProps {
  images: string[];
  id: string;
  price: number;
  smallDescription: string;
  name: string;
  showEditButton?: boolean;
  location?: string | null;
  amenities?: string[];
  linkPath?: string;
  supportRequested?: any;
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
  supportRequested,
  demographics
}: AirbnbStyleCardProps) {
  // Use the first image as the main image
  const mainImage = images[0] || "/placeholder-house.svg";
  
  // Calculate total hours from support requested data
  const totalHours = getTotalHoursPerWeek(supportRequested);
  
  // Get the first 3 amenities for display
  const displayAmenities = amenities.slice(0, 3);
  const remainingCount = amenities.length - displayAmenities.length;
  
  // Determine the link path - use custom linkPath if provided, otherwise default to product link
  const href = linkPath || `/product/${id}`;
  
  return (
    <Link href={href} className="cursor-pointer block">
      <div className="relative flex flex-col">
        {/* Main Image */}
        <div className={`relative overflow-hidden ${
          demographics 
            ? "h-[200px] w-[200px] md:h-[280px] md:w-[280px] mx-auto rounded-full mt-6" 
            : "h-[260px] w-[260px] md:h-[300px] md:w-[300px] rounded-3xl"
        }`}>
          <Image
            alt={name}
            src={mainImage}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          
          {/* Heart Icon - Only for room listings (not profile cards) */}
          {!demographics && (
            <div className="absolute top-3 right-3 cursor-pointer z-10">
              <Heart size={28} className="fill-gray-600 stroke-white stroke-2 hover:scale-110 transition-transform" />
            </div>
          )}
        </div>
        
        {/* Verification Badge - Design element for helper profiles */}
        {demographics && (
          <div 
            className="absolute bottom-[30%] right-[15%] w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br from-amber-400 to-yellow-600 rounded-full flex items-center justify-center shadow-xl cursor-help z-20" 
            title="This person has been background checked"
          >
            <ShieldCheck size={28} className="text-white md:w-10 md:h-10" />
          </div>
        )}
        
        {/* Card Content - Enhanced design for housemates */}
        {demographics ? (
          <div className="flex-1 pt-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <h3 className="font-semibold text-xl md:text-3xl text-gray-900 truncate">{name}</h3>
            </div>
            
            {/* Job Title with enhanced logic matching HousemateHorizontalCard */}
            {(() => {
              // Enhanced occupation display logic matching HousemateHorizontalCard exactly
              const getOccupationDisplay = () => {
                // Check if retired
                if (demographics.isRetired) {
                  return { text: demographics.occupation || "Retired", icon: Armchair };
                }
                
                // Check if currently a student - use graduation cap for students
                if (demographics.isCurrentlyAttending) {
                  return { text: demographics.occupation || "Student", icon: GraduationCap };
                }
                
                // Fall back to briefcase for professionals
                if (demographics.occupation) {
                  return { text: demographics.occupation, icon: Briefcase };
                }
                
                return null;
              };

              const occupationDisplay = getOccupationDisplay();
              
              // Truncate text after 33 characters for consistent spacing
              const truncateText = (text: string, maxLength: number = 33) => {
                if (text.length <= maxLength) return text;
                return text.slice(0, maxLength) + '...';
              };
              
              return occupationDisplay ? (
                <div className="flex items-center justify-center gap-1 md:gap-2 mb-2 max-w-full">
                  <occupationDisplay.icon size={14} className="text-gray-600 flex-shrink-0 md:w-4 md:h-4" />
                  <p className="text-xs md:text-base text-gray-600 truncate" title={occupationDisplay.text}>
                    {truncateText(occupationDisplay.text)}
                  </p>
                </div>
              ) : null;
            })()}
          </div>
        ) : (
          // Standard listing card content - show "Private room in City" format with help hours
          <div className="mt-3">
            <h3 className="font-medium text-base text-gray-900 line-clamp-2">
              {getCityStateFromAddress(location).cityState ? `Private room in ${getCityStateFromAddress(location).cityState}` : name}
            </h3>
            {totalHours > 0 && (
              <p className="text-sm text-gray-600 mt-1">
                <span className="line-through text-gray-400">${price + (15 * totalHours * 4)}</span>{" "}
                <span className="font-medium">${price}/mo</span> with {totalHours}hrs support/week
              </p>
            )}
          </div>
        )}
      </div>
    </Link>
  );
}

export function LoadingAirbnbCard() {
  return (
    <div className="animate-pulse flex flex-col">
      <div className="h-[260px] w-[260px] md:h-[300px] md:w-[300px] bg-gray-200 rounded-3xl" />
    </div>
  );
} 