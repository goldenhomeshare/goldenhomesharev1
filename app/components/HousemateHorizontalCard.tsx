"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { User, MapPin, Briefcase, GraduationCap, Star, DollarSign, Handshake, Bed, Umbrella } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HousemateHorizontalCardProps {
  id: string;
  name: string;
  location: string;
  occupation: string;
  gender: string;
  ageRange: string;
  maxBudget: number;
  profileImage?: string;
  bio?: string;
  isVerified?: boolean;
  userId: string;
  email: string;
  lifestyle?: any;
  experience?: string;
  onContact?: (housemateId: string, email: string) => void;
}

// Occupation labels
const occupationLabels: Record<string, string> = {
  student: "Student",
  professional: "Professional",
  remote: "Remote Worker",
  healthcare: "Healthcare",
  education: "Education",
  creative: "Creative",
  service: "Service Industry",
  retired: "Retired",
  unemployed: "Between Jobs",
  other: "Other"
};

export function HousemateHorizontalCard({
  id,
  name,
  location,
  occupation,
  gender,
  ageRange,
  maxBudget,
  profileImage,
  bio,
  isVerified = false,
  userId,
  email,
  lifestyle,
  experience,
  onContact
}: HousemateHorizontalCardProps) {

  const handleContact = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onContact) {
      onContact(userId, email);
    }
  };

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

  // Gender labels
  const genderLabels: Record<string, string> = {
    male: "Male",
    female: "Female",
    other: "Other",
  };

  return (
        <Link href={`/profile/${userId}`} className="block">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow cursor-pointer p-6">
        {/* Name at the top center of the card */}
        <div className="flex justify-center mb-3">
          <h3 className="text-3xl font-bold text-gray-900 text-center">{name}</h3>
        </div>
        
        {/* Occupation with icon */}
        {occupationDisplay && (
          <div className="flex justify-center mb-8">
            <div className="flex items-center gap-2 text-gray-600 max-w-md">
              {isCurrentlyAttending ? (
                <GraduationCap size={18} className="text-gray-500 flex-shrink-0" />
              ) : (
                <Briefcase size={18} className="text-gray-500 flex-shrink-0" />
              )}
              <span className="text-lg truncate">{occupationDisplay}</span>
            </div>
          </div>
        )}
        
        <div className="flex flex-col">
          <div className="flex items-start gap-8 mb-6">
            {/* Profile Picture Section - Large circular image */}
            <div className="flex-shrink-0">
              <div className="relative w-48 h-48 rounded-full overflow-hidden">
                {profileImage ? (
                  <Image
                    src={profileImage}
                    alt={`${name}'s profile`}
                    fill
                    className="object-cover"
                    sizes="192px"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full bg-gray-100">
                    <User size={64} className="text-gray-400" />
                  </div>
                )}
              </div>
            </div>

            {/* Right Content */}
            <div className="flex-1 flex flex-col justify-start min-w-0">
              {/* Main pricing text */}
              <div className="mb-4">
                <p className="text-xl text-gray-900 leading-relaxed mb-2">
                  Host {name.split(' ')[0]} and get up to:
                </p>
                <ul className="text-xl font-semibold text-gray-900 space-y-1">
                  <li className="flex items-center gap-2">
                    <DollarSign size={24} className="text-green-600" />
                    ${maxBudget || 400}/mo
                  </li>
                  <li className="flex items-center gap-2">
                    <Handshake size={24} className="text-green-600" />
                    10 hours of help/week
                  </li>
                  <li className="flex items-center gap-2">
                    <Bed size={24} className="text-green-600" />
                    Overnight presence
                  </li>
                </ul>
              </div>

              {/* Bio section */}
              <div className="mb-4">
                {bio ? (
                  <p className="text-lg text-gray-700 leading-relaxed line-clamp-2 overflow-hidden">
                    {bio}
                  </p>
                ) : (
                  <p className="text-lg text-gray-700 leading-relaxed">
                    {name.split(' ')[0]} hasn't added a bio yet.
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Bottom badges - now full width */}
          <div className="flex items-center justify-center gap-6">
            {/* Background Checked */}
            {isVerified && (
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <span className="text-lg font-medium text-gray-900 whitespace-nowrap">Background Checked</span>
              </div>
            )}

            {/* Host Cover */}
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                <Umbrella className="w-5 h-5 text-gray-600" />
              </div>
              <span className="text-lg font-medium text-gray-900 whitespace-nowrap">$10,000 Host Cover</span>
            </div>
          </div>

          {/* Contact Button */}
          <div className="flex justify-center mt-4">
            <button
              onClick={handleContact}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 font-medium"
            >
              Contact {name.split(' ')[0]}
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
} 