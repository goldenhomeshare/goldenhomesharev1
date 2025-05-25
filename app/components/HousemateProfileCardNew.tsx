"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { User, MapPin, Heart, CheckCircle, Briefcase, Users, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HousemateProfileCardNewProps {
  id: string;
  name: string;
  location: string;
  occupation?: string;
  gender?: string;
  ageRange?: string;
  maxBudget?: number;
  profileImage?: string;
  bio?: string;
  isVerified?: boolean;
  userId?: string;
  email?: string;
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

// Gender labels
const genderLabels: Record<string, string> = {
  male: "Male",
  female: "Female",
  other: "Other",
};

export function HousemateProfileCardNew({
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
  onContact
}: HousemateProfileCardNewProps) {
  const [isLiked, setIsLiked] = useState(false);

  const handleContact = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onContact && userId && email) {
      onContact(userId, email);
    }
  };

  const handleLike = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsLiked(!isLiked);
  };

  return (
    <Link href={`/profile/${userId}`} className="block">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all duration-200 hover:-translate-y-0.5">
        {/* Profile Image */}
        <div className="relative aspect-square w-full bg-gray-50">
          {profileImage ? (
            <Image
              src={profileImage}
              alt={`${name}'s profile`}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <User size={48} className="text-gray-300" />
            </div>
          )}
          
          {/* Like Button */}
          <button
            onClick={handleLike}
            className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center hover:bg-white transition-colors shadow-sm"
          >
            <Heart 
              size={14} 
              className={`${isLiked ? 'fill-red-500 text-red-500' : 'text-gray-600'} transition-colors`}
            />
          </button>
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Header with name and verification */}
          <div className="mb-3">
            <div className="flex items-center gap-1.5 mb-1">
              <h3 className="font-semibold text-base text-gray-900 leading-tight">{name}</h3>
              {isVerified && (
                <CheckCircle size={14} className="text-blue-500 flex-shrink-0" />
              )}
            </div>
            
            {/* Location */}
            <div className="flex items-center gap-1 text-gray-500 mb-2">
              <MapPin size={12} className="flex-shrink-0" />
              <span className="text-sm">{location}</span>
            </div>

            {/* Profile Details */}
            <div className="space-y-1.5">
              {/* Age and Gender */}
              {(ageRange || gender) && (
                <div className="flex items-center gap-1 text-gray-600">
                  <Users size={12} className="flex-shrink-0" />
                  <span className="text-xs">
                    {[
                      ageRange,
                      gender ? genderLabels[gender] || gender : null
                    ].filter(Boolean).join(' • ')}
                  </span>
                </div>
              )}

              {/* Occupation */}
              {occupation && (
                <div className="flex items-center gap-1 text-gray-600">
                  <Briefcase size={12} className="flex-shrink-0" />
                  <span className="text-xs">{occupationLabels[occupation] || occupation}</span>
                </div>
              )}
            </div>
          </div>

          {/* Bio Preview */}
          {bio && (
            <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed mb-4">
              {bio}
            </p>
          )}

          {/* Budget and Contact */}
          <div className="flex items-center justify-between">
            <div>
              {maxBudget && maxBudget > 0 ? (
                <>
                  <div className="flex items-center gap-1 text-gray-500">
                    <DollarSign size={12} />
                    <span className="text-xs">Budget</span>
                  </div>
                  <div className="font-semibold text-base text-gray-900">
                    Up to ${maxBudget}
                  </div>
                  <div className="text-xs text-gray-500">per month</div>
                </>
              ) : (
                <div className="text-sm text-gray-500">
                  Budget negotiable
                </div>
              )}
            </div>
            
            <Button
              onClick={handleContact}
              className="bg-slate-800 hover:bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              size="sm"
            >
              Contact
            </Button>
          </div>
        </div>
      </div>
    </Link>
  );
} 