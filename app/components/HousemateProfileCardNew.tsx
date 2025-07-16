"use client";

import Image from "next/image";
import Link from "next/link";
import { User, ShieldCheck } from "lucide-react";

interface HousemateProfileCardNewProps {
  id: string;
  name: string;
  profileImage?: string;
  bio?: string;
  maxBudget?: number;
  ageRange?: string;
  gender?: string;
  occupation?: string;
  location?: string;
  schedule?: string;
  socialPreference?: string;
  canHelpWith?: string[];
}

export function HousemateProfileCardNew({
  id,
  name,
  profileImage,
  bio,
  maxBudget,
  ageRange,
  gender,
  occupation,
  location,
  schedule,
  socialPreference,
  canHelpWith = []
}: HousemateProfileCardNewProps) {
  const firstName = name.split(' ')[0];

  return (
    <Link href={`/profile/${id}`} className="group cursor-pointer">
      <div className="bg-white rounded-3xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300">
        {/* Header Section */}
        <div className="relative p-6 bg-gradient-to-br from-primary/5 to-primary/10">
          <div className="flex items-start gap-4">
            <div className="relative">
              <div className="w-24 h-24 rounded-full overflow-hidden bg-white shadow-md">
                {profileImage ? (
                  <Image
                    src={profileImage}
                    alt={`${name}'s profile`}
                    width={96}
                    height={96}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <User size={40} className="text-gray-400" />
                  </div>
                )}
              </div>
              {/* Verification Badge */}
              <div 
                className="absolute -bottom-2 -right-2 w-8 h-8 bg-gradient-to-br from-amber-400 to-yellow-600 rounded-full flex items-center justify-center shadow-lg cursor-help" 
                title="This person has been background checked"
              >
                <ShieldCheck size={18} className="text-white" />
              </div>
            </div>
            
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-xl text-gray-900 mb-2">{firstName}</h3>
              <div className="space-y-1">
                {gender && ageRange && (
                  <p className="text-sm text-gray-600">{gender} • {ageRange}</p>
                )}
                {occupation && (
                  <p className="text-sm text-gray-600 font-medium">{occupation}</p>
                )}
                {location && (
                  <p className="text-sm text-gray-500">{location}</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Budget Section */}
        {maxBudget && (
          <div className="px-6 py-4 border-b border-gray-100">
            <div className="text-center">
              <p className="text-3xl font-bold text-primary">${maxBudget}</p>
              <p className="text-sm text-gray-600">monthly housing budget</p>
            </div>
          </div>
        )}

        {/* Bio Section */}
        {bio && (
          <div className="p-6 border-b border-gray-100">
            <h4 className="font-semibold text-gray-900 mb-3">About {firstName}</h4>
            <p className="text-sm text-gray-600 line-clamp-3 leading-relaxed">
              {bio}
            </p>
          </div>
        )}

        {/* Preferences Section */}
        {(schedule || socialPreference) && (
          <div className="px-6 py-4 border-b border-gray-100">
            <h4 className="font-semibold text-gray-900 mb-3">Preferences</h4>
            <div className="flex flex-wrap gap-2">
              {schedule && (
                <span className="text-xs bg-gray-100 text-gray-700 px-3 py-1 rounded-full">
                  {schedule}
                </span>
              )}
              {socialPreference && (
                <span className="text-xs bg-gray-100 text-gray-700 px-3 py-1 rounded-full">
                  {socialPreference}
                </span>
              )}
            </div>
          </div>
        )}

        {/* Can Help With Section */}
        {canHelpWith.length > 0 && (
          <div className="px-6 py-4 border-b border-gray-100">
            <h4 className="font-semibold text-gray-900 mb-3">Can help with</h4>
            <div className="flex flex-wrap gap-2">
              {canHelpWith.slice(0, 3).map((skill, index) => (
                <span 
                  key={index}
                  className="text-xs bg-primary/10 text-primary px-3 py-1 rounded-full border border-primary/20"
                >
                  {skill}
                </span>
              ))}
              {canHelpWith.length > 3 && (
                <span className="text-xs bg-gray-100 text-gray-700 px-3 py-1 rounded-full">
                  +{canHelpWith.length - 3} more
                </span>
              )}
            </div>
          </div>
        )}

        {/* Call to Action */}
        <div className="px-6 py-4 bg-gray-50">
          <p className="text-sm text-primary font-medium text-center">
            View full profile & contact {firstName} →
          </p>
        </div>
      </div>
    </Link>
  );
} 