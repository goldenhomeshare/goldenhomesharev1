"use client";

import { AirbnbStyleCard } from "./AirbnbStyleCard";
import Link from "next/link";
import { ChevronRight, ChevronLeft } from "lucide-react";
import { calculateAgeRange, extractDateOfBirth } from "@/lib/age-utils";
import { useState, useRef, useEffect } from "react";

// Helper function to convert string to title case
function toTitleCase(str: string): string {
  return str.replace(/\w\S*/g, (txt) => 
    txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
  );
}

// Helper function to get job title from lifestyle data
function getJobTitle(lifestyleString: string): string {
  if (!lifestyleString) return "Student";
  
  try {
    const lifestyle = JSON.parse(lifestyleString);
    
    // Check for occupation first
    if (lifestyle.occupation && lifestyle.occupation.trim() !== '') {
      return toTitleCase(lifestyle.occupation);
    }
    
    // Check career stage
    if (lifestyle.careerStage) {
      const careerStage = lifestyle.careerStage.toLowerCase();
      
      if (careerStage.includes('student') || careerStage.includes('graduate student')) {
        return 'Student';
      }
      if (careerStage.includes('professional') || careerStage.includes('early career') || careerStage.includes('mid career') || careerStage.includes('senior')) {
        return lifestyle.occupation || 'Professional';
      }
      if (careerStage.includes('retired')) {
        return 'Retired';
      }
    }
    
    return lifestyle.occupation || "Student";
  } catch (e) {
    return "Student";
  }
}

// Helper function to get age range
function getAgeRange(demographics: any): string {
  if (!demographics) return "";
  
  try {
    const dob = extractDateOfBirth(demographics);
    if (dob) {
      return calculateAgeRange(dob);
    }
  } catch (e) {
    console.error("Error calculating age range:", e);
  }
  
  return "";
}

interface HelperRowProps {
  title: string;
  subtitle: string;
  helpers: any[];
  link: string;
  isFirst?: boolean;
  isLast?: boolean;
}

function HelperRow({ title, subtitle, helpers, link, isFirst = false, isLast = false }: HelperRowProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [hasOverflow, setHasOverflow] = useState(false);

  const updateScrollButtons = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      const overflow = scrollWidth > clientWidth + 10; // Small threshold to avoid edge cases
      
      setHasOverflow(overflow);
      
      if (!overflow) {
        setCanScrollLeft(false);
        setCanScrollRight(false);
      } else {
        // Only allow left scroll after meaningful scrolling (not on initial load)
        const cardWidth = 320 + 16; // Card width + gap
        setCanScrollLeft(scrollLeft >= cardWidth * 0.5); // After scrolling half a card
        
        // Allow right scroll if there's meaningful content to scroll to
        const remainingWidth = scrollWidth - clientWidth - scrollLeft;
        setCanScrollRight(remainingWidth > 50); // More lenient threshold
      }
    }
  };

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      // Card width (320px) + gap (16px) = 336px per card
      const cardWidth = 320 + 16;
      scrollContainerRef.current.scrollBy({ left: -cardWidth, behavior: 'smooth' });
      setTimeout(updateScrollButtons, 150);
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      // Card width (320px) + gap (16px) = 336px per card  
      const cardWidth = 320 + 16;
      scrollContainerRef.current.scrollBy({ left: cardWidth, behavior: 'smooth' });
      setTimeout(updateScrollButtons, 150);
    }
  };

  useEffect(() => {
    updateScrollButtons();
    
    const handleResize = () => {
      updateScrollButtons();
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [helpers]);

  return (
    <section className={`${isFirst ? 'pt-8' : 'pt-6'} ${isLast ? 'pb-8' : 'pb-4'} px-6`}>
      <div className="mb-6 relative">
        <Link
          href={link}
          className="block group cursor-pointer"
        >
          <div className="flex flex-wrap items-center gap-3">
            <h2 className="text-2xl min-[744px]:text-5xl font-bold text-gray-900">
              {title}
            </h2>
            <p className="text-2xl min-[744px]:text-5xl font-bold text-gray-900">
              {subtitle}
            </p>
            <ChevronRight 
              size={20} 
              className="text-gray-600 group-hover:text-gray-800 group-hover:translate-x-1 transition-all duration-200 min-[744px]:w-8 min-[744px]:h-8" 
            />
          </div>
        </Link>
        
        {/* Navigation Arrows - Only visible when overflow exists */}
        {hasOverflow && (
          <div className="absolute top-0 right-0 flex items-center gap-3">
            <button
              onClick={scrollLeft}
              disabled={!canScrollLeft}
              className={`flex items-center justify-center w-10 h-10 rounded-full transition-all duration-200 ${
                canScrollLeft 
                  ? 'bg-gray-300 hover:bg-gray-400 shadow-md hover:shadow-lg' 
                  : 'bg-transparent border border-gray-200 cursor-not-allowed'
              }`}
            >
              <ChevronLeft 
                size={16} 
                strokeWidth={2.5} 
                className={canScrollLeft ? 'text-gray-800' : 'text-gray-300'}
              />
            </button>
            <button
              onClick={scrollRight}
              disabled={!canScrollRight}
              className={`flex items-center justify-center w-10 h-10 rounded-full transition-all duration-200 ${
                canScrollRight 
                  ? 'bg-gray-300 hover:bg-gray-400 shadow-md hover:shadow-lg' 
                  : 'bg-transparent border border-gray-200 cursor-not-allowed'
              }`}
            >
              <ChevronRight 
                size={16} 
                strokeWidth={2.5} 
                className={canScrollRight ? 'text-gray-800' : 'text-gray-300'}
              />
            </button>
          </div>
        )}

      </div>

      {/* Mobile: Horizontal scroll (up to 743px) */}
      <div className="max-[743px]:block hidden overflow-x-auto scrollbar-hide -mx-6 px-6">
        <div className="flex gap-4 pb-4">
          {helpers.map((helper) => (
            <div key={helper.id} className="flex-shrink-0 w-[240px] h-[320px]">
              <AirbnbStyleCard
                images={helper.images}
                id={helper.id}
                name={helper.name}
                price={helper.price}
                smallDescription={helper.smallDescription}
                amenities={helper.amenities}
                linkPath={`/profile/${helper.id}`}
                location="Seeking housing"
                availabilityText="Looking for housing"
                priceLabel="budget"
                demographics={helper.demographics}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Desktop: Horizontal scroll with navigation (744px+) */}
      <div className="hidden min-[744px]:block relative -mx-6">
        <div 
          ref={scrollContainerRef}
          onScroll={updateScrollButtons}
          className="overflow-x-auto scrollbar-hide snap-x snap-mandatory"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          <div className="flex gap-4 pb-4 px-6">
            {helpers.map((helper: any) => (
              <div key={helper.id} className="flex-shrink-0 w-[320px] h-[420px] snap-start">
                <AirbnbStyleCard
                  images={helper.images}
                  id={helper.id}
                  name={helper.name}
                  price={helper.price}
                  smallDescription={helper.smallDescription}
                  amenities={helper.amenities}
                  linkPath={`/profile/${helper.id}`}
                  location="Seeking housing"
                  availabilityText="Looking for housing"
                  priceLabel="budget"
                  demographics={helper.demographics}
                />
              </div>
            ))}
          </div>
        </div>


      </div>
    </section>
  );
}

interface HelpersData {
  errandsHelpers: any[];
  cookingHelpers: any[];
  petHelpers: any[];
}

interface HelpersRowsContainerProps {
  helpersData: HelpersData;
}

export default function HelpersRowsContainer({ helpersData }: HelpersRowsContainerProps) {
  return (
    <>
      <HelperRow 
        title="Errands & Driving Helpers"
        subtitle="in Columbia, MO"
        helpers={helpersData.errandsHelpers}
        link="/products/icon"
        isFirst={true}
      />
      
      <HelperRow 
        title="Cooking Helpers"
        subtitle="in Columbia, MO"
        helpers={helpersData.cookingHelpers}
        link="/products/icon"
      />
      
      <HelperRow 
        title="Pet-Friendly Helpers"
        subtitle="in Columbia, MO"
        helpers={helpersData.petHelpers}
        link="/products/icon"
        isLast={true}
      />
    </>
  );
} 