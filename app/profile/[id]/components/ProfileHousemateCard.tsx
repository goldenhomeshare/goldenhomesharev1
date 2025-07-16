"use client";

import Image from "next/image";
import Link from "next/link";
import { User, MapPin, Briefcase, Clock, GraduationCap, Star, ShieldCheck } from "lucide-react";

interface ProfileHousemateCardProps {
  id: string;
  name: string;
  location: string;
  occupation: string;
  gender: string;
  ageRange: string;
  maxBudget: number;
  profileImage?: string;
  userId: string;
  email: string;
  lifestyle?: any;
}

export function ProfileHousemateCard({
  id,
  name,
  location,
  occupation,
  gender,
  ageRange,
  maxBudget,
  profileImage,
  userId,
  email,
  lifestyle
}: ProfileHousemateCardProps) {

  // Helper function to convert names to title case
  const toTitleCase = (str: string) => {
    return str.toLowerCase().split(' ').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  const displayName = toTitleCase(name);
  const firstName = displayName.split(' ')[0];

  // Parse lifestyle data to check if currently attending school
  let lifestyleData: any = {};
  if (lifestyle) {
    try {
      lifestyleData = typeof lifestyle === 'string' 
        ? JSON.parse(lifestyle) 
        : lifestyle;
    } catch {
      lifestyleData = {};
    }
  }

  const isCurrentlyAttending = lifestyleData.education?.stillAttending || false;
  const isRetired = lifestyleData.occupationDetails?.isRetired || false;

  // Function to get detailed occupation display
  const getOccupationDisplay = () => {
    // Check if retired
    if (isRetired) {
      return "retired";
    }
    
    // Check if currently a student
    if (isCurrentlyAttending) {
      const program = lifestyleData.education?.degreeProgram;
      if (program) {
        return `Studying ${program}`;
      }
      return "a student";
    }
    
    // Check for detailed occupation description
    if (lifestyleData.occupationDetails?.description) {
      return lifestyleData.occupationDetails.description;
    }
    
    // Fall back to basic occupation
    if (occupation) {
      return occupation;
    }
    
    return null;
  };

  const occupationDisplay = getOccupationDisplay();

  return (
    <Link href={`/profile/${userId}`} className="block w-full">
      <div className="bg-white rounded-3xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow cursor-pointer w-full max-w-full min-h-[250px] lg:min-h-[320px]">
        
        {/* Unified Layout - Responsive horizontal design */}
        <div className="p-3 pb-2 sm:p-4 sm:pb-3 lg:p-6 lg:pb-4">
          <div className="flex flex-col">
            <div className="flex items-center sm:items-start gap-4 lg:gap-8 mb-3 sm:mb-4 lg:mb-6 relative">
              {/* Profile Picture Section - Responsive sizing */}
              <div className="w-32 sm:w-48 lg:w-64 flex-shrink-0 flex flex-col items-center mt-4 sm:mt-0">
                <div className="relative w-24 h-24 sm:w-32 sm:h-32 lg:w-48 lg:h-48 rounded-full overflow-hidden">
                  {profileImage ? (
                    <Image
                      src={profileImage}
                      alt={`${name}'s profile`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 96px, (max-width: 1024px) 128px, 192px"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full bg-gray-100">
                      <User size={32} className="text-gray-400 sm:w-12 sm:h-12 lg:w-16 lg:h-16" />
                    </div>
                  )}
                </div>
                {/* Name below profile image */}
                <div className="mt-2 lg:mt-4 text-center w-full">
                  <h3 className="text-lg sm:text-2xl lg:text-4xl font-bold text-gray-900">{firstName}</h3>
                </div>
              </div>
              {/* Verification Badge - Responsive positioning */}
              <div 
                className="absolute top-21 left-20 sm:top-24 sm:left-32 lg:top-34 lg:left-39 w-8 h-8 sm:w-10 sm:h-10 lg:w-14 lg:h-14 bg-gradient-to-br from-amber-400 to-yellow-600 rounded-full flex items-center justify-center shadow-lg cursor-help z-10" 
                title="This person has been background checked"
              >
                <ShieldCheck size={20} className="text-white sm:w-6 sm:h-6 lg:w-9 lg:h-9" />
              </div>

              {/* Right Content - Responsive sizing */}
              <div className="flex-1 flex flex-col justify-start min-w-0 mt-0 lg:mt-8">
                {/* Main pricing text */}
                <div className="mb-2 sm:mb-4">
                  <div className="space-y-2 lg:space-y-4">
                    <div className="text-left">
                      <div className="font-bold text-lg sm:text-xl lg:text-2xl text-gray-900">${maxBudget || 400}/month</div>
                      <div className="text-sm lg:text-base text-gray-600">Housing budget</div>
                    </div>
                    <div className="border-t border-gray-300"></div>
                    <div className="text-left">
                      <div className="font-bold text-lg sm:text-xl lg:text-2xl text-gray-900">10 hrs/week</div>
                      <div className="text-sm lg:text-base text-gray-600">Available to help</div>
                    </div>
                    <div className="border-t border-gray-300"></div>
                     <div className="text-left">
                      <div className="font-bold text-lg sm:text-xl lg:text-2xl text-gray-900">5-6 nights/week</div>
                      <div className="text-sm lg:text-base text-gray-600">Overnight presence</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
} 