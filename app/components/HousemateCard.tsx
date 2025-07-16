"use client";

import Image from "next/image";
import Link from "next/link";
import { User, ShieldCheck } from "lucide-react";

interface HousemateCardProps {
  id: string;
  name: string;
  profileImage?: string;
  bio?: string;
  maxBudget?: number;
  ageRange?: string;
  gender?: string;
  occupation?: string;
  location?: string;
}

export function HousemateCard({
  id,
  name,
  profileImage,
  bio,
  maxBudget,
  ageRange,
  gender,
  occupation,
  location
}: HousemateCardProps) {
  const firstName = name.split(' ')[0];

  return (
    <Link href={`/profile/${id}`} className="group cursor-pointer">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-all duration-300 p-6">
        {/* Header with Profile Image and Basic Info */}
        <div className="flex items-start gap-4 mb-4">
          <div className="relative">
            <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-100">
              {profileImage ? (
                <Image
                  src={profileImage}
                  alt={`${name}'s profile`}
                  width={64}
                  height={64}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <User size={24} className="text-gray-400" />
                </div>
              )}
            </div>
            {/* Verification Badge */}
            <div 
              className="absolute -bottom-1 -right-1 w-6 h-6 bg-gradient-to-br from-amber-400 to-yellow-600 rounded-full flex items-center justify-center shadow-lg cursor-help" 
              title="This person has been background checked"
            >
              <ShieldCheck size={14} className="text-white" />
            </div>
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-lg text-gray-900 mb-1">{firstName}</h3>
            <div className="space-y-1">
              {gender && (
                <p className="text-sm text-gray-600">{gender}</p>
              )}
              {ageRange && (
                <p className="text-sm text-gray-600">{ageRange}</p>
              )}
              {occupation && (
                <p className="text-sm text-gray-600 truncate">{occupation}</p>
              )}
              {location && (
                <p className="text-sm text-gray-600 truncate">{location}</p>
              )}
            </div>
          </div>
        </div>

        {/* Budget Display */}
        {maxBudget && (
          <div className="mb-4">
            <p className="text-lg font-semibold text-gray-900">
              ${maxBudget}/month
              <span className="text-sm font-normal text-gray-600 ml-1">housing budget</span>
            </p>
          </div>
        )}

        {/* Bio Preview */}
        {bio && (
          <div className="mb-4">
            <p className="text-sm text-gray-600 line-clamp-3 leading-relaxed">
              {bio}
            </p>
          </div>
        )}

        {/* Call to Action */}
        <div className="pt-4 border-t border-gray-100">
          <p className="text-sm text-gray-600 text-center">
            View full profile →
          </p>
        </div>
      </div>
    </Link>
  );
} 