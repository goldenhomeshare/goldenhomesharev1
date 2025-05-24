import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Bath, Car, Wifi, Utensils, Tv, Snowflake, Sun, Home, DoorOpen, WashingMachine, Armchair, Briefcase, ChevronLeft, ChevronRight } from "lucide-react";

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

export function ListingCard({
  id,
  name,
  price,
  smallDescription,
  images,
  address,
  amenities = [],
  isSelected = false,
  onClick
}: ListingCardProps) {
  const locationDisplay = address ? getCityState(address) : '';
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Get the first 3 amenities for display (reduced to fit better)
  const displayAmenities = amenities.slice(0, 3);
  const remainingCount = amenities.length - displayAmenities.length;

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
    <Link href={`/product/${id}`} className="block h-full">
      <div 
        className={`
          bg-white rounded-lg shadow-sm border overflow-hidden cursor-pointer transition-all hover:shadow-md h-full flex flex-col
          ${isSelected ? 'border-blue-500 shadow-md' : 'border-gray-200'}
        `}
        onMouseEnter={onClick} // Trigger selection on hover for map highlighting
      >
        {/* Image Carousel */}
        <div className="relative aspect-[4/3] w-full bg-gray-100 flex-shrink-0 group">
          {images.length > 0 ? (
            <>
              <Image
                src={images[currentImageIndex]}
                alt={`${name} - Image ${currentImageIndex + 1}`}
                fill
                className="object-cover transition-opacity duration-300"
                sizes="(max-width: 768px) 100vw, 320px"
              />
              
              {/* Navigation arrows - only show if more than 1 image */}
              {images.length > 1 && (
                <>
                  <button
                    onClick={handlePrevImage}
                    className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-black bg-opacity-70 hover:bg-opacity-90 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10"
                    aria-label="Previous image"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  
                  <button
                    onClick={handleNextImage}
                    className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-black bg-opacity-70 hover:bg-opacity-90 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10"
                    aria-label="Next image"
                  >
                    <ChevronRight size={16} />
                  </button>
                  
                  {/* Dots indicator */}
                  <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
                    {images.map((_, index) => (
                      <button
                        key={index}
                        onClick={(e) => handleDotClick(e, index)}
                        className={`w-2 h-2 rounded-full transition-all duration-200 ${
                          index === currentImageIndex 
                            ? 'bg-white scale-110' 
                            : 'bg-white bg-opacity-60 hover:bg-opacity-80'
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
                className="w-8 h-8"
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
        
        {/* Content - Fixed height section */}
        <div className="p-3 flex-1 flex flex-col min-h-[120px]">
          {/* Location */}
          {locationDisplay && (
            <h3 className="text-sm font-medium text-gray-900 mb-1 truncate flex-shrink-0">{locationDisplay}</h3>
          )}
          
          {/* Price */}
          <p className="text-lg font-semibold text-gray-900 mb-2 flex-shrink-0">${price}/mo</p>
          
          {/* Amenities - Fixed height container */}
          <div className="flex-1 min-h-[60px] flex items-start">
            {amenities.length > 0 ? (
              <div className="w-full">
                <div className="flex flex-wrap items-center gap-1">
                  {displayAmenities.map((amenityId, index) => {
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
              <p className="text-xs text-gray-600 leading-relaxed line-clamp-3">
                {smallDescription}
              </p>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
} 