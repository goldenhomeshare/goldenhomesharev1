"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { User, MapPin, Briefcase, Clock, Users, Heart, MessageCircle, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HousemateCardProps {
  id: string;
  name: string;
  price: number;
  smallDescription: string;
  images: string[];
  occupation?: string;
  gender?: string;
  ageRange?: string;
  schedule?: string;
  socialPreference?: string;
  hobbies?: string[];
  preferredGender?: string;
  lifestyle?: any;
  email?: string;
  userId?: string;
  onContact?: (housemateId: string, email: string) => void;
}

// Simple Badge component
const Badge = ({ 
  children, 
  variant = "default", 
  className = "" 
}: { 
  children: React.ReactNode; 
  variant?: "default" | "secondary" | "outline"; 
  className?: string; 
}) => {
  const baseClasses = "inline-flex items-center px-2 py-1 rounded-full text-xs font-medium";
  const variantClasses = {
    default: "bg-blue-600 text-white",
    secondary: "bg-gray-100 text-gray-800",
    outline: "border border-gray-300 text-gray-700 bg-white"
  };
  
  return (
    <span className={`${baseClasses} ${variantClasses[variant]} ${className}`}>
      {children}
    </span>
  );
};

// Hobby display names mapping
const hobbyLabels: Record<string, string> = {
  gardening: "Gardening",
  cooking: "Cooking",
  reading: "Reading",
  movies: "Movies/TV",
  volunteering: "Volunteering",
  fitness: "Fitness",
  church: "Church",
  crafting: "Arts & Crafts",
  music: "Music",
  tech: "Technology",
  pets: "Pet Lover",
  games: "Board Games",
};

// Schedule display names
const scheduleLabels: Record<string, string> = {
  "early-riser": "Early Riser",
  "night-owl": "Night Owl",
  "flexible": "Flexible",
};

// Social preference labels
const socialLabels: Record<string, string> = {
  "social": "Social",
  "independent": "Independent", 
  "balanced": "Balanced",
};

// Gender labels
const genderLabels: Record<string, string> = {
  "male": "Male",
  "female": "Female",
  "other": "Other",
};

// Occupation labels
const occupationLabels: Record<string, string> = {
  "student": "Student",
  "professional": "Professional",
  "retired": "Retired",
};

export function HousemateCard({
  id,
  name,
  price,
  smallDescription,
  images,
  occupation,
  gender,
  ageRange,
  schedule,
  socialPreference,
  hobbies = [],
  preferredGender,
  lifestyle,
  email,
  userId,
  onContact
}: HousemateCardProps) {
  const [showFullBio, setShowFullBio] = useState(false);
  
  const displayHobbies = Array.isArray(hobbies) ? hobbies.slice(0, 3) : [];
  const remainingHobbiesCount = Array.isArray(hobbies) ? Math.max(0, hobbies.length - 3) : 0;

  const handleContact = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent Link navigation
    e.stopPropagation(); // Stop event bubbling
    if (onContact && userId && email) {
      onContact(userId, email);
    }
  };

  const handleReadMoreClick = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent Link navigation
    e.stopPropagation(); // Stop event bubbling
    setShowFullBio(!showFullBio);
  };

  // Truncate bio for preview
  const bioPreview = smallDescription && smallDescription.length > 120 
    ? smallDescription.substring(0, 120) + "..."
    : smallDescription;

  return (
    <Link href={`/profile/${userId}`} className="block">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow cursor-pointer">
        {/* Profile Picture Section */}
        <div className="relative aspect-[4/3] w-full bg-gray-100">
          {images.length > 0 ? (
            <Image
              src={images[0]}
              alt={`${name}'s profile`}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <User size={48} className="text-gray-400" />
            </div>
          )}
          {/* Budget Badge */}
          {price > 0 && (
            <div className="absolute top-2 left-2">
              <Badge className="bg-green-600 text-white">
                Up to ${price}/mo
              </Badge>
            </div>
          )}
        </div>

        {/* Content Section */}
        <div className="p-4 space-y-3">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-semibold text-lg text-gray-900">{name}</h3>
              <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                {ageRange && (
                  <span className="flex items-center gap-1">
                    <User size={14} />
                    {ageRange}
                  </span>
                )}
                {gender && (
                  <span>
                    {genderLabels[gender] || gender}
                  </span>
                )}
                {occupation && (
                  <span className="flex items-center gap-1">
                    <Briefcase size={14} />
                    {occupationLabels[occupation] || occupation}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Bio */}
          <div className="text-sm text-gray-700">
            <p>{showFullBio ? smallDescription : bioPreview}</p>
            {smallDescription && smallDescription.length > 120 && (
              <button
                onClick={handleReadMoreClick}
                className="text-blue-600 hover:text-blue-800 text-xs font-medium mt-1"
              >
                {showFullBio ? "Show less" : "Read more"}
              </button>
            )}
          </div>

          {/* Key Details */}
          <div className="flex flex-wrap gap-2">
            {schedule && (
              <Badge variant="secondary" className="text-xs">
                <Clock size={12} className="mr-1" />
                {scheduleLabels[schedule] || schedule}
              </Badge>
            )}
            {socialPreference && (
              <Badge variant="secondary" className="text-xs">
                <Users size={12} className="mr-1" />
                {socialLabels[socialPreference] || socialPreference}
              </Badge>
            )}
            {lifestyle?.numberOfPeople && lifestyle.numberOfPeople !== "1" && (
              <Badge variant="secondary" className="text-xs">
                {lifestyle.numberOfPeople} people
              </Badge>
            )}
          </div>

          {/* Hobbies */}
          {displayHobbies.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Interests</p>
              <div className="flex flex-wrap gap-1">
                {displayHobbies.map((hobby) => (
                  <Badge key={hobby} variant="outline" className="text-xs">
                    {hobbyLabels[hobby] || hobby}
                  </Badge>
                ))}
                {remainingHobbiesCount > 0 && (
                  <Badge variant="outline" className="text-xs">
                    +{remainingHobbiesCount} more
                  </Badge>
                )}
              </div>
            </div>
          )}

          {/* Contact Button */}
          {onContact && (
            <div className="pt-2">
              <Button 
                onClick={handleContact}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                size="sm"
              >
                <MessageCircle size={16} className="mr-2" />
                Contact {name.split(' ')[0]}
              </Button>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
} 