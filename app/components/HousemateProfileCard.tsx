"use client";

import Image from "next/image";
import Link from "next/link";
import { User, ShieldCheck } from "lucide-react";

interface HousemateProfileCardProps {
  id: string;
  name: string;
  profileImage?: string;
  bio?: string;
  maxBudget?: number;
  ageRange?: string;
  gender?: string;
  occupation?: string;
  location?: string;
  canHelpWith?: string[];
}

export function HousemateProfileCard({
  id,
  name,
  profileImage,
  bio,
  maxBudget,
  ageRange,
  gender,
  occupation,
  location,
  canHelpWith = []
}: HousemateProfileCardProps) {
  const firstName = name.split(' ')[0];

  return (
    <Link href={`/profile/${id}`} className="group cursor-pointer">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-all duration-300">
        {/* Profile Header */}
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-start gap-4">
            <div className="relative">
              <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-100">
                {profileImage ? (
                  <Image
                    src={profileImage}
                    alt={`${name}'s profile`}
                    width={80}
                    height={80}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <User size={32} className="text-gray-400" />
                  </div>
                )}
              </div>
              {/* Verification Badge */}
              <div 
                className="absolute -bottom-1 -right-1 w-7 h-7 bg-gradient-to-br from-amber-400 to-yellow-600 rounded-full flex items-center justify-center shadow-lg cursor-help" 
                title="This person has been background checked"
              >
                <ShieldCheck size={16} className="text-white" />
              </div>
            </div>
            
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-xl text-gray-900 mb-2">{firstName}</h3>
              <div className="grid grid-cols-2 gap-2 text-sm">
                {gender && (
                  <div>
                    <span className="text-gray-500">Gender:</span>
                    <span className="ml-1 text-gray-900">{gender}</span>
                  </div>
                )}
                {ageRange && (
                  <div>
                    <span className="text-gray-500">Age:</span>
                    <span className="ml-1 text-gray-900">{ageRange}</span>
                  </div>
                )}
                {occupation && (
                  <div>
                    <span className="text-gray-500">Work:</span>
                    <span className="ml-1 text-gray-900">{occupation}</span>
                  </div>
                )}
                {location && (
                  <div>
                    <span className="text-gray-500">Location:</span>
                    <span className="ml-1 text-gray-900">{location}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Budget Section */}
        {maxBudget && (
          <div className="px-6 py-4 bg-primary/5">
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">${maxBudget}/month</p>
              <p className="text-sm text-gray-600">Housing budget</p>
            </div>
          </div>
        )}

        {/* Bio Section */}
        {bio && (
          <div className="p-6">
            <h4 className="font-semibold text-gray-900 mb-2">About {firstName}</h4>
            <p className="text-sm text-gray-600 line-clamp-4 leading-relaxed">
              {bio}
            </p>
          </div>
        )}

        {/* Can Help With Section */}
        {canHelpWith.length > 0 && (
          <div className="px-6 pb-6">
            <h4 className="font-semibold text-gray-900 mb-3">Can help with</h4>
            <div className="flex flex-wrap gap-2">
              {canHelpWith.slice(0, 4).map((skill, index) => (
                <span 
                  key={index}
                  className="text-xs bg-primary/10 text-primary px-3 py-1 rounded-full border border-primary/20"
                >
                  {skill}
                </span>
              ))}
              {canHelpWith.length > 4 && (
                <span className="text-xs bg-gray-100 text-gray-700 px-3 py-1 rounded-full">
                  +{canHelpWith.length - 4} more
                </span>
              )}
            </div>
          </div>
        )}

        {/* Call to Action */}
        <div className="px-6 py-4 border-t border-gray-100 bg-gray-50">
          <p className="text-sm text-gray-600 text-center">
            View full profile & contact {firstName} →
          </p>
        </div>
      </div>
    </Link>
  );
} 