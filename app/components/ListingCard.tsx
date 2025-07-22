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
  const { cityState } = getCityStateFromAddress(address);
  const totalHours = getTotalHoursPerWeek(supportRequested);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

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
    <Link href={`/product/${id}`} className="cursor-pointer block">
      <div 
        className={`
          relative flex flex-col transition-all hover:scale-[1.02] duration-200 group
          ${isSelected ? 'transform scale-[1.02]' : ''}
        `}
        onMouseEnter={onHover}
        onMouseLeave={onHoverEnd}
      >
        {/* Main Image - matching AirbnbStyleCard dimensions and style */}
        <div className="relative h-[260px] w-[260px] md:h-[300px] md:w-[300px] rounded-3xl overflow-hidden">
          {images.length > 0 ? (
            <>
              <Image
                src={images[currentImageIndex]}
                alt={name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
              
              {/* Heart Icon - matching AirbnbStyleCard position and style */}
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
        
        {/* Content below image - matching AirbnbStyleCard format */}
        <div className="mt-3">
          <h3 className="font-medium text-base text-gray-900 line-clamp-1">
            {cityState ? `Private room in ${cityState}` : name}
          </h3>
          {/* Show listing title as subtitle when we have a city */}
          {cityState && (
            <p className="text-sm text-gray-600 mt-1 line-clamp-1">
              {name}
            </p>
          )}
          {totalHours > 0 && (
            <p className="text-sm text-gray-600 mt-1">
              <span className="line-through text-gray-400">${price + (15 * totalHours * 4)}</span>{" "}
              <span className="font-medium">${price}/mo</span> with {totalHours}hrs support/week
            </p>
          )}
        </div>
      </div>
    </Link>
  );
} 