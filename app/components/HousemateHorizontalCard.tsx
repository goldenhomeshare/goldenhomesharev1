"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { User, MapPin, CheckCircle, Briefcase, Star } from "lucide-react";
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

  // Gender labels
  const genderLabels: Record<string, string> = {
    male: "Male",
    female: "Female",
    other: "Other",
  };

  return (
    <Link href={`/profile/${userId}`} className="block">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow cursor-pointer">
        <div className="flex items-center p-4">
          {/* Profile Picture */}
          <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-gray-100 flex-shrink-0">
            {profileImage ? (
              <Image
                src={profileImage}
                alt={`${name}'s profile`}
                fill
                className="object-cover"
                sizes="64px"
              />
            ) : (
              <div className="flex items-center justify-center h-full bg-gray-100">
                <User size={24} className="text-gray-400" />
              </div>
            )}
            
            {/* Verification Badge */}
            {isVerified && (
              <div className="absolute -top-1 -right-1 bg-blue-500 rounded-full p-1">
                <CheckCircle size={10} className="text-white" />
              </div>
            )}
          </div>

          {/* Main Content */}
          <div className="flex-1 ml-4">
            <div className="flex items-start justify-between">
              {/* Left Content */}
              <div className="flex-1">
                {/* Name and Title */}
                <div className="mb-2">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    {name}
                    {isVerified && (
                      <CheckCircle size={16} className="text-blue-500" />
                    )}
                  </h3>
                  
                  {/* First row: Location, Age, Occupation - Always visible */}
                  <div className="flex items-center gap-3 text-sm text-gray-600 mt-1">
                    <span className="flex items-center gap-1">
                      <MapPin size={12} />
                      {location}
                    </span>
                    {/* Age Range */}
                    {ageRange && (
                      <span>{ageRange}</span>
                    )}
                    {/* Student/Occupation Status */}
                    {(isCurrentlyAttending || isRetired || occupation) && (
                      <span className="hidden sm:flex items-center gap-1">
                        {isRetired ? (
                          <>
                            <Briefcase size={10} />
                            Retired
                          </>
                        ) : isCurrentlyAttending ? (
                          <>
                            <Briefcase size={10} />
                            Student
                          </>
                        ) : occupation ? (
                          <>
                            <Briefcase size={10} />
                            {occupationLabels[occupation] || occupation}
                          </>
                        ) : null}
                      </span>
                    )}
                  </div>
                  
                  {/* Second row: Gender, Language, Occupation (mobile) - Additional info */}
                  <div className="flex items-center gap-3 text-sm text-gray-600 mt-1">
                    {/* Gender */}
                    {gender && (
                      <span>{genderLabels[gender] || gender}</span>
                    )}
                    {/* Language */}
                    {lifestyleData.language && (
                      <span>{lifestyleData.language}</span>
                    )}
                    {/* Show occupation on mobile when hidden above */}
                    {(isCurrentlyAttending || isRetired || occupation) && (
                      <span className="sm:hidden flex items-center gap-1">
                        {isRetired ? (
                          <>
                            <Briefcase size={10} />
                            Retired
                          </>
                        ) : isCurrentlyAttending ? (
                          <>
                            <Briefcase size={10} />
                            Student
                          </>
                        ) : occupation ? (
                          <>
                            <Briefcase size={10} />
                            {occupationLabels[occupation] || occupation}
                          </>
                        ) : null}
                      </span>
                    )}
                  </div>
                </div>

                {/* Bio/Description */}
                {bio && (
                  <p className="text-sm text-gray-700 line-clamp-2 leading-relaxed mb-3">
                    {bio}
                  </p>
                )}

                {/* Contact Button and Heart - Mobile Below Bio, Desktop Right Side */}
                <div className="flex items-center justify-between sm:hidden">
                  <div className="flex items-center gap-2">
                    {/* Budget */}
                    <div className="text-sm">
                      <span className="text-xs text-gray-500">Budget up to </span>
                      <span className="font-bold text-gray-900">${maxBudget || 500}</span>
                      <span className="text-xs text-gray-500">/mo</span>
                    </div>
                  </div>
                  
                  <Button
                    onClick={handleContact}
                    className="bg-green-800 hover:bg-green-900 text-white px-6 py-2 rounded-2xl font-medium transition-colors text-sm"
                    size="sm"
                  >
                    Contact
                  </Button>
                </div>
              </div>

              {/* Right Content - Price and Contact - Desktop Only */}
              <div className="hidden sm:block text-right ml-6 flex-shrink-0">
                {/* Price */}
                <div className="mb-4">
                  <div className="text-xs text-gray-500 mb-1">Budget up to</div>
                  <div className="text-2xl font-bold text-gray-900">
                    ${maxBudget || 500}
                  </div>
                  <div className="text-xs text-gray-500">per month</div>
                </div>

                {/* Contact Button */}
                <Button
                  onClick={handleContact}
                  className="bg-green-800 hover:bg-green-900 text-white px-8 py-3 rounded-2xl font-medium transition-colors"
                  size="default"
                >
                  Contact
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
} 