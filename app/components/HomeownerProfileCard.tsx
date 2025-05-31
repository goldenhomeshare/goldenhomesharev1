"use client";

import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { User, UserCircle, CircleDashed, GraduationCap, Briefcase, UserCheck, Users, Crown, Sunrise, Moon, Clock, CircleDot, Flower, ChefHat, Book, Tv, HandHeart, Dumbbell, Church, Palette, Music, Laptop, PawPrint, Dice6, Heart, Cigarette, CigaretteOff, Dog, Star, Shield, MessageCircle, MapPin, Armchair, Sparkles, Salad, ShoppingBag, Cat, Wrench } from "lucide-react";
import { Instagram, Facebook, Linkedin } from "lucide-react";
import { MessageHostButton } from "./chat/MessageHostButton";
import { useState } from "react";

interface HomeownerProfile {
  profilePicture?: string | null;
  bio?: string | null;
  gender?: string | null;
  ageRange?: string | null;
  schedule?: string | null;
  socialPreference?: string | null;
  hobbies?: string[] | null;
  preferredGender?: string | null;
  preferredCareerStage?: string | null;
  socialMedia?: {
    instagram?: string | null;
    facebook?: string | null;
    linkedin?: string | null;
  } | null;
  lifestyle?: {
    hasPets?: boolean;
    petDescription?: string;
    numberOfPeople?: string;
    smokingStatus?: string;
    occupation?: string;
    school?: string;
  } | null;
  averageRating?: number | null;
  propertyCount?: number;
}

interface HomeownerProfileCardProps {
  homeowner: {
    firstName: string;
    lastName?: string;
    profileImage?: string | null;
    homeownerProfile: HomeownerProfile | null;
  };
  canMessageHost?: boolean;
  messageProps?: {
    productId: string;
    hostId: string;
    productName: string;
  };
  supportRequested?: any[];
}

const genderIcons = {
  male: { icon: UserCircle, label: "Male" },
  female: { icon: User, label: "Female" },
  other: { icon: CircleDashed, label: "Other" },
};

const ageRangeIcons = {
  "18-24": { icon: GraduationCap, label: "18–24" },
  "25-34": { icon: Briefcase, label: "25–34" },
  "35-44": { icon: User, label: "35–44" },
  "45-54": { icon: UserCheck, label: "45–54" },
  "55-64": { icon: Users, label: "55–64" },
  "65+": { icon: Crown, label: "65+" },
};

const scheduleIcons = {
  "early-riser": { icon: Sunrise, label: "Early Riser" },
  "night-owl": { icon: Moon, label: "Night Owl" },
  "flexible": { icon: Clock, label: "Flexible" },
};

const socialIcons = {
  "social": { icon: Users, label: "Social" },
  "independent": { icon: User, label: "Independent" },
  "balanced": { icon: CircleDot, label: "Balanced" },
};

const hobbiesIcons = {
  gardening: { icon: Flower, label: "Gardening" },
  cooking: { icon: ChefHat, label: "Cooking/Baking" },
  reading: { icon: Book, label: "Reading" },
  movies: { icon: Tv, label: "Movies/TV" },
  volunteering: { icon: HandHeart, label: "Volunteering" },
  fitness: { icon: Dumbbell, label: "Fitness" },
  church: { icon: Church, label: "Church/Religious" },
  crafting: { icon: Palette, label: "Crafting/Art" },
  music: { icon: Music, label: "Music" },
  tech: { icon: Laptop, label: "Tech/Computers" },
  pets: { icon: PawPrint, label: "Pets/Animals" },
  games: { icon: Dice6, label: "Board Games" },
};

const supportIcons = {
  cleaning: { icon: Sparkles, label: "Cleaning" },
  cooking: { icon: Salad, label: "Cooking" },
  gardening: { icon: Flower, label: "Gardening" },
  errands: { icon: ShoppingBag, label: "Errands" },
  companionship: { icon: HandHeart, label: "Companionship" },
  petCare: { icon: Cat, label: "Pet Care" },
  techSupport: { icon: Wrench, label: "Tech Support" },
  homeSecurity: { icon: Shield, label: "Home Security" },
};

const smokingIcons = {
  "yes": { icon: Cigarette, label: "Smoking Allowed" },
  "no": { icon: CigaretteOff, label: "No Smoking" },
  "designated": { icon: Cigarette, label: "Designated Areas Only" },
};

const peopleCountIcons = {
  "1": { icon: User, label: "Living Alone" },
  "2": { icon: Users, label: "2 People" },
  "3": { icon: Users, label: "3 People" },
  "4+": { icon: Users, label: "4+ People" },
};

// Helper function to ensure URLs have proper protocol
const ensureHttps = (url: string): string => {
  if (!url) return "";
  if (url.startsWith("http://") || url.startsWith("https://")) {
    return url;
  }
  if (url.startsWith("www.")) {
    return `https://${url}`;
  }
  if (url.includes("instagram.com/") && !url.startsWith("http")) {
    return `https://${url}`;
  }
  if (url.includes("facebook.com/") && !url.startsWith("http")) {
    return `https://${url}`;
  }
  if (url.includes("linkedin.com/") && !url.startsWith("http")) {
    return `https://${url}`;
  }
  return `https://${url}`;
};

export function HomeownerProfileCard({ homeowner, canMessageHost, messageProps, supportRequested }: HomeownerProfileCardProps) {
  const profile = homeowner.homeownerProfile;
  const [showFullBio, setShowFullBio] = useState(false);
  
  return (
    <div className="space-y-6">
      <Card className="border-0 shadow-sm">
        <CardContent className="p-6">
          {/* Header Section */}
          <div className="flex items-start gap-4 mb-6">
            {/* Host Avatar with Verification Badge */}
            <div className="relative">
              <div className="relative w-16 h-16 rounded-full overflow-hidden ring-2 ring-gray-100">
                {profile?.profilePicture ? (
                  <Image
                    src={profile.profilePicture}
                    alt={`${homeowner.firstName}'s profile`}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                    <User size={24} className="text-gray-400" />
                  </div>
                )}
              </div>
              {/* Verification Badge */}
              <div 
                className="absolute -bottom-1 -right-1 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center ring-2 ring-white cursor-help" 
                title="This host has been background checked"
              >
                <Shield size={12} className="text-white" />
              </div>
            </div>

            {/* Host Info */}
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h2 className="text-2xl font-semibold text-gray-900">
                  {homeowner.firstName}
                </h2>
                <Badge variant="secondary" className="text-xs font-medium">
                  Homeowner
                </Badge>
              </div>
              
              {/* Basic Demographics */}
              {(profile?.gender || profile?.ageRange) && (
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  {profile?.gender && (
                    <span className="capitalize">{profile.gender}</span>
                  )}
                  {profile?.ageRange && (
                    <span>{profile.ageRange} years old</span>
                  )}
                </div>
              )}
            </div>

            {/* Message Button - Positioned to the right */}
            {canMessageHost && messageProps && (
              <div className="flex-shrink-0">
                <MessageHostButton 
                  productId={messageProps.productId}
                  hostId={messageProps.hostId}
                  hostName={homeowner.firstName}
                  productName={messageProps.productName}
                />
              </div>
            )}
          </div>

          {/* Bio Section */}
          {profile?.bio && (
            <div className="pt-4 mb-8">
              <div className="relative">
                <div 
                  className={`text-sm text-gray-700 leading-relaxed whitespace-pre-line ${
                    !showFullBio ? 'line-clamp-7' : ''
                  }`}
                  style={{
                    display: '-webkit-box',
                    WebkitLineClamp: !showFullBio ? 7 : 'unset',
                    WebkitBoxOrient: 'vertical',
                    overflow: !showFullBio ? 'hidden' : 'visible'
                  }}
                >
                  {profile.bio}
                </div>
                
                {/* Show More/Less Button */}
                {(profile.bio.split('\n').length > 7 || profile.bio.length > 400) && (
                  <button
                    onClick={() => setShowFullBio(!showFullBio)}
                    className="mt-3 text-sm font-medium text-gray-900 underline hover:no-underline focus:outline-none"
                  >
                    {showFullBio ? 'Show less' : 'Show more'}
                  </button>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* More About Host Section */}
      <Card className="border-0 shadow-sm">
        <CardContent className="p-6">
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
              More about {homeowner.firstName}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Demographics */}
              {(profile?.preferredGender || profile?.preferredCareerStage) && (
                <div className="space-y-3">
                  <h4 className="text-sm font-medium text-gray-700">Looking for housemates who are</h4>
                  
                  {profile?.preferredGender && (
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                        <User size={16} className="text-gray-600" />
                      </div>
                      <span className="text-sm text-gray-700 capitalize">{profile.preferredGender}</span>
                    </div>
                  )}
                  
                  {profile?.preferredCareerStage && (
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                        {profile.preferredCareerStage === 'student' && <GraduationCap size={16} className="text-gray-600" />}
                        {profile.preferredCareerStage === 'professional' && <Briefcase size={16} className="text-gray-600" />}
                        {profile.preferredCareerStage === 'retired' && <Armchair size={16} className="text-gray-600" />}
                        {profile.preferredCareerStage === 'no-preference' && <Users size={16} className="text-gray-600" />}
                      </div>
                      <span className="text-sm text-gray-700 capitalize">
                        {profile.preferredCareerStage.replace('-', ' ')}
                      </span>
                    </div>
                  )}
                </div>
              )}

              {(profile?.schedule || profile?.socialPreference) && (
                <div className="space-y-3">
                  <h4 className="text-sm font-medium text-gray-700">Prefers housemates who are</h4>
                  
                  {profile?.schedule && (
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                        <Clock size={16} className="text-gray-600" />
                      </div>
                      <span className="text-sm text-gray-700 capitalize">
                        {profile.schedule.replace('-', ' ')}
                      </span>
                    </div>
                  )}
                  
                  {profile?.socialPreference && (
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                        <Users size={16} className="text-gray-600" />
                      </div>
                      <span className="text-sm text-gray-700 capitalize">{profile.socialPreference}</span>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Hobbies with Icons */}
            {profile?.hobbies && (
              <div className="mt-6">
                <h4 className="text-sm font-medium text-gray-700 mb-3">Hobbies & Interests</h4>
                <div className="flex flex-wrap gap-2">
                  {(() => {
                    let hobbiesArray: string[] = [];
                    if (typeof profile.hobbies === 'string') {
                      try {
                        hobbiesArray = JSON.parse(profile.hobbies);
                      } catch {
                        hobbiesArray = [];
                      }
                    } else if (Array.isArray(profile.hobbies)) {
                      hobbiesArray = profile.hobbies;
                    }
                    
                    return hobbiesArray.map((hobby, index) => {
                      const hobbyData = hobbiesIcons[hobby as keyof typeof hobbiesIcons];
                      const Icon = hobbyData?.icon;
                      
                      return (
                        <div key={index} className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-full border border-gray-200">
                          {Icon && <Icon size={14} className="text-gray-600" />}
                          <span className="text-xs font-medium text-gray-700">
                            {hobbyData?.label || hobby.charAt(0).toUpperCase() + hobby.slice(1).replace(/([A-Z])/g, ' $1')}
                          </span>
                        </div>
                      );
                    });
                  })()}
                </div>
              </div>
            )}

            {/* Support Requested */}
            {supportRequested && supportRequested.length > 0 && (
              <div className="mt-6">
                <h4 className="text-sm font-medium text-gray-700 mb-3">Looking for help with</h4>
                <div className="grid grid-cols-2 gap-3">
                  {supportRequested.map((supportItem: any, index: number) => {
                    const supportId = typeof supportItem === 'string' ? supportItem : supportItem.id;
                    const hoursPerWeek = typeof supportItem === 'string' ? null : supportItem.hoursPerWeek;
                    const support = supportIcons[supportId as keyof typeof supportIcons];
                    if (!support) return null;
                    
                    const Icon = support.icon;
                    return (
                      <div key={index} className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                          <Icon size={16} className="text-gray-600" />
                        </div>
                        <div>
                          <span className="text-sm font-medium text-gray-700">{support.label}</span>
                          {hoursPerWeek && (
                            <span className="block text-xs text-gray-500">{hoursPerWeek} hours/week</span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Lifestyle Info */}
            {profile?.lifestyle && (
              <div className="space-y-3">
                <h4 className="text-sm font-medium text-gray-700">Living situation</h4>
                
                {profile.lifestyle.numberOfPeople && (
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                      <Users size={16} className="text-gray-600" />
                    </div>
                    <span className="text-sm text-gray-700">
                      {profile.lifestyle.numberOfPeople === "1" ? "Lives alone" : `Lives with ${profile.lifestyle.numberOfPeople} people`}
                    </span>
                  </div>
                )}
                
                {profile.lifestyle.hasPets && (
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center mt-0.5">
                      <PawPrint size={16} className="text-gray-600" />
                    </div>
                    <div>
                      <span className="text-sm text-gray-700">Has pets</span>
                      {profile.lifestyle.petDescription && (
                        <p className="text-xs text-gray-500 mt-1">{profile.lifestyle.petDescription}</p>
                      )}
                    </div>
                  </div>
                )}
                
                {profile.lifestyle.smokingStatus && (
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                      {profile.lifestyle.smokingStatus === 'no-smoking' ? (
                        <CigaretteOff size={16} className="text-gray-600" />
                      ) : (
                        <Cigarette size={16} className="text-gray-600" />
                      )}
                    </div>
                    <span className="text-sm text-gray-700 capitalize">
                      {profile.lifestyle.smokingStatus.replace('-', ' ')}
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* Social Media Links */}
            {profile?.socialMedia && Object.values(profile.socialMedia).some(Boolean) && (
              <div className="space-y-3">
                <h4 className="text-sm font-medium text-gray-700">Connect</h4>
                <div className="flex gap-3">
                  {profile.socialMedia.instagram && (
                    <a
                      href={`https://instagram.com/${profile.socialMedia.instagram}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-8 h-8 rounded-full bg-pink-100 flex items-center justify-center hover:bg-pink-200 transition-colors"
                    >
                      <Instagram size={16} className="text-pink-600" />
                    </a>
                  )}
                  {profile.socialMedia.facebook && (
                    <a
                      href={`https://facebook.com/${profile.socialMedia.facebook}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center hover:bg-blue-200 transition-colors"
                    >
                      <Facebook size={16} className="text-blue-600" />
                    </a>
                  )}
                  {profile.socialMedia.linkedin && (
                    <a
                      href={`https://linkedin.com/in/${profile.socialMedia.linkedin}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center hover:bg-blue-200 transition-colors"
                    >
                      <Linkedin size={16} className="text-blue-700" />
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 