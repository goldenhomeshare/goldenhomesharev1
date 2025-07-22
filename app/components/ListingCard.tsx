import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Bath, Car, Wifi, Utensils, Tv, Snowflake, Sun, Home, DoorOpen, WashingMachine, Armchair, Briefcase, ChevronLeft, ChevronRight, Heart } from "lucide-react";

interface ListingCardProps {
  id: string;
  name: string;
  price: number;
  smallDescription: string;
  images: string[];
  address?: string;
  amenities?: string[];
  isSelected?: boolean;
  onClick?: () => void;
  onHover?: () => void;
  onHoverEnd?: () => void;
  supportRequested?: any;
}

// Amenity icons mapping
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

// Utility function to extract city and state from full address
function getCityState(fullAddress: string): string {
  if (!fullAddress) return '';
  
  // Split address by commas and trim whitespace
  const parts = fullAddress.split(',').map(part => part.trim()).filter(part => part.length > 0);
  
  // Common US address formats:
  // "123 Main St, Springfield, IL 62701" -> ["123 Main St", "Springfield", "IL 62701"]
  // "Springfield, IL 62701" -> ["Springfield", "IL 62701"]
  // "Springfield, IL, USA" -> ["Springfield", "IL", "USA"]
  
  if (parts.length >= 3) {
    // For format: "Street, City, State ZIP" or "City, State, Country"
    const city = parts[parts.length - 3]; // Third from last is usually city
    const stateOrStateZip = parts[parts.length - 2]; // Second from last is state/state+zip
    
    // Extract just the state part (remove ZIP code if present)
    const state = stateOrStateZip.split(' ')[0];
    
    return `${city}, ${state}`;
  } else if (parts.length === 2) {
    // For format: "City, State ZIP" 
    const city = parts[0];
    const stateZip = parts[1];
    const state = stateZip.split(' ')[0];
    
    return `${city}, ${state}`;
  }
  
  // Fallback: return the original address if we can't parse it
  return fullAddress;
}

// Utility function to extract just the city name from full address
function getCityFromAddress(fullAddress?: string | null): string {
  if (!fullAddress) return '';
  
  // Split address by commas and trim whitespace
  const parts = fullAddress.split(',').map(part => part.trim()).filter(part => part.length > 0);
  
  // Common US address formats:
  // "123 Main St, Springfield, IL 62701" -> ["123 Main St", "Springfield", "IL 62701"]
  // "Springfield, IL 62701" -> ["Springfield", "IL 62701"]
  
  if (parts.length >= 3) {
    // For format: "Street, City, State ZIP" - city is third from last
    return parts[parts.length - 3];
  } else if (parts.length === 2) {
    // For format: "City, State ZIP" - city is first part
    return parts[0];
  }
  
  // Fallback: return empty string if we can't parse
  return '';
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

export function ListingCard({
  id,
  name,
  price,
  smallDescription,
  images,
  address,
  amenities = [],
  isSelected = false,
  onClick,
  onHover,
  onHoverEnd,
  supportRequested
}: ListingCardProps) {
  const locationDisplay = address ? getCityState(address) : '';
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  // Calculate total hours from support requested data
  const totalHours = getTotalHoursPerWeek(supportRequested);

  const handlePrevImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex(prev => 
      prev === 0 ? images.length - 1 : prev - 1
    );
  };

  const handleNextImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex(prev => 
      prev === images.length - 1 ? 0 : prev + 1
    );
  };

  const handleDotClick = (e: React.MouseEvent, index: number) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex(index);
  };

  return (
    <Link href={`/product/${id}`} className="block">
      <div 
        className="cursor-pointer transition-all duration-200 group"
        onMouseEnter={onHover}
        onMouseLeave={onHoverEnd}
      >
        {/* Large Image */}
        <div className="relative aspect-square w-full bg-gray-100 rounded-xl overflow-hidden mb-3">
          {images.length > 0 ? (
            <>
              <Image
                src={images[currentImageIndex]}
                alt={`${name} - Image ${currentImageIndex + 1}`}
                fill
                className="object-cover transition-opacity duration-300"
                sizes="(max-width: 768px) 100vw, 320px"
              />
              
              {/* Heart Icon - positioned in top right */}
              <div className="absolute top-3 right-3 cursor-pointer z-10">
                <Heart size={28} className="fill-gray-600 stroke-white stroke-2 hover:scale-110 transition-transform" />
              </div>
              
              {/* Navigation arrows - show on hover of entire card */}
              {images.length > 1 && (
                <>
                  <button
                    onClick={handlePrevImage}
                    className="absolute left-2 top-1/2 -translate-y-1/2 w-7 h-7 bg-white/90 hover:bg-white rounded-full flex items-center justify-center text-gray-800 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10 shadow-md"
                    aria-label="Previous image"
                  >
                    <ChevronLeft size={14} />
                  </button>
                  
                  <button
                    onClick={handleNextImage}
                    className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 bg-white/90 hover:bg-white rounded-full flex items-center justify-center text-gray-800 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10 shadow-md"
                    aria-label="Next image"
                  >
                    <ChevronRight size={14} />
                  </button>
                  
                  {/* Dots indicator */}
                  <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1 z-10">
                    {images.map((_, index) => (
                      <button
                        key={index}
                        onClick={(e) => handleDotClick(e, index)}
                        className={`w-1.5 h-1.5 rounded-full transition-all duration-200 ${
                          index === currentImageIndex 
                            ? 'bg-white' 
                            : 'bg-white/60 hover:bg-white/80'
                        }`}
                        aria-label={`Go to image ${index + 1}`}
                      />
                    ))}
                  </div>
                </>
              )}
            </>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-400">
              <svg
                className="w-12 h-12"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"
                />
              </svg>
            </div>
          )}
        </div>
        
        {/* Content below image */}
        <div className="space-y-1">
          {/* Title (property name) */}
          <h3 className="font-medium text-gray-900 truncate">
            {getCityFromAddress(address) ? `Private room in ${getCityFromAddress(address)}` : name}
          </h3>
          
          {/* Original listing title below */}
          {getCityFromAddress(address) && (
            <p className="text-base text-gray-600 truncate">
              {name}
            </p>
          )}
          
          {/* Price only (removed location) */}
          <div className="flex items-center gap-2 pt-1">
            {totalHours > 0 ? (
              <div className="flex items-baseline gap-1">
                <span className="line-through text-gray-400 text-sm">${price + (15 * totalHours * 4)}</span>
                <span className="font-semibold text-gray-900 underline">${price}/mo</span>
                <span className="text-gray-600 text-sm">with {totalHours}hrs support/week</span>
              </div>
            ) : (
              <div className="flex items-baseline gap-1">
                <span className="font-semibold text-gray-900 underline">${price}</span>
                <span className="text-gray-600 text-sm"> per month</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
} 