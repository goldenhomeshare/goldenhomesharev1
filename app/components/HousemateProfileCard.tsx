"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { User, MapPin, Heart, MessageCircle, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Briefcase, Clock, Users, Instagram, Facebook, Linkedin, PawPrint, Cigarette, CigaretteOff, DollarSign, Sparkles, Salad, Flower, ShoppingBag, HeartHandshake, Cat, Wrench, Shield } from "lucide-react";

interface HousemateProfile {
  profilePicture?: string | null;
  bio?: string | null;
  occupation?: string | null;
  gender?: string | null;
  ageRange?: string | null;
  schedule?: string | null;
  socialPreference?: string | null;
  hobbies?: string[] | any | null;
  preferredAgeRanges?: string[] | any | null;
  preferredGender?: string | null;
  maxBudget?: number | null;
  canHelpWith?: string[] | any | null;
  socialMedia?: {
    instagram?: string | null;
    facebook?: string | null;
    linkedin?: string | null;
  } | any | null;
  lifestyle?: {
    hasPets?: boolean;
    petDescription?: string;
    numberOfPeople?: string;
    smokingStatus?: string;
  } | any | null;
}

interface HousemateProfileCardProps {
  housemate: {
    firstName: string;
    lastName: string;
    profileImage?: string | null;
    housemateProfile?: HousemateProfile | null;
  };
}

const genderLabels: Record<string, string> = {
  male: "Male",
  female: "Female",
  other: "Other",
  "no-preference": "No Preference"
};

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

const scheduleLabels: Record<string, string> = {
  earlyRiser: "Early Riser",
  nightOwl: "Night Owl",
  flexible: "Flexible",
  regular: "Regular 9-5"
};

const socialLabels: Record<string, string> = {
  social: "Social",
  independent: "Independent",
  balanced: "Balanced"
};

const scheduleIcons: Record<string, any> = {
  earlyRiser: { icon: Clock, label: "Early Riser" },
  nightOwl: { icon: Clock, label: "Night Owl" },
  flexible: { icon: Clock, label: "Flexible" },
  regular: { icon: Clock, label: "Regular 9-5" }
};

const socialIcons: Record<string, any> = {
  social: { icon: Users, label: "Social" },
  independent: { icon: User, label: "Independent" },
  balanced: { icon: Users, label: "Balanced" }
};

const supportIcons: Record<string, any> = {
  cleaning: { icon: Sparkles, label: "Cleaning" },
  cooking: { icon: Salad, label: "Cooking" },
  gardening: { icon: Flower, label: "Gardening" },
  errands: { icon: ShoppingBag, label: "Errands" },
  companionship: { icon: HeartHandshake, label: "Companionship" },
  petCare: { icon: Cat, label: "Pet Care" },
  techSupport: { icon: Wrench, label: "Tech Support" },
  homeSecurity: { icon: Shield, label: "Home Security" },
};

export function HousemateProfileCard({ housemate }: HousemateProfileCardProps) {
  const profile = housemate.housemateProfile;

  return (
    <Card className="mt-8">
      <CardHeader>
        <CardTitle className="flex items-center gap-3">
          <div className="relative w-16 h-16 rounded-full overflow-hidden">
            {profile?.profilePicture ? (
              <Image
                src={profile.profilePicture}
                alt={`${housemate.firstName}'s profile`}
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                <User className="w-8 h-8 text-gray-400" />
              </div>
            )}
          </div>
          <div>
            <h3 className="text-xl font-semibold">Housemate Profile</h3>
            <p className="text-lg text-muted-foreground">{housemate.firstName} {housemate.lastName}</p>
          </div>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Bio */}
        {profile?.bio && (
          <div>
            <h4 className="font-medium mb-2">About</h4>
            <p className="text-sm text-muted-foreground leading-relaxed">{profile.bio}</p>
          </div>
        )}

        {/* Basic Information */}
        {(profile?.occupation || profile?.maxBudget) && (
          <div>
            <h4 className="font-medium mb-3">Basic Information</h4>
            <div className="space-y-3">
              {profile.occupation && (
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center">
                    <Briefcase size={16} className="text-slate-600" />
                  </div>
                  <span className="text-sm">{occupationLabels[profile.occupation] || profile.occupation}</span>
                </div>
              )}
              
              {profile.maxBudget && (
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center">
                    <DollarSign size={16} className="text-slate-600" />
                  </div>
                  <span className="text-sm">Budget: Up to ${profile.maxBudget}/month</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Personal Details */}
        {(profile?.gender || profile?.ageRange) && (
          <div>
            <h4 className="font-medium mb-3">Personal Details</h4>
            <div className="space-y-3">
              {profile.gender && (
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center">
                    <User size={16} className="text-slate-600" />
                  </div>
                  <span className="text-sm">{genderLabels[profile.gender] || profile.gender}</span>
                </div>
              )}
              
              {profile.ageRange && (
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center">
                    <Users size={16} className="text-slate-600" />
                  </div>
                  <span className="text-sm">Age: {profile.ageRange}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Lifestyle */}
        {(profile?.schedule || profile?.socialPreference) && (
          <div>
            <h4 className="font-medium mb-3">Lifestyle</h4>
            <div className="space-y-3">
              {profile.schedule && scheduleIcons[profile.schedule as keyof typeof scheduleIcons] && (
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center">
                    {(() => {
                      const Icon = scheduleIcons[profile.schedule as keyof typeof scheduleIcons].icon;
                      return <Icon size={16} className="text-slate-600" />;
                    })()}
                  </div>
                  <span className="text-sm">{scheduleIcons[profile.schedule as keyof typeof scheduleIcons].label}</span>
                </div>
              )}
              
              {profile.socialPreference && socialIcons[profile.socialPreference as keyof typeof socialIcons] && (
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center">
                    {(() => {
                      const Icon = socialIcons[profile.socialPreference as keyof typeof socialIcons].icon;
                      return <Icon size={16} className="text-slate-600" />;
                    })()}
                  </div>
                  <span className="text-sm">{socialIcons[profile.socialPreference as keyof typeof socialIcons].label}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Living Preferences */}
        {(profile?.preferredGender || profile?.preferredAgeRanges) && (
          <div>
            <h4 className="font-medium mb-3">Living Preferences</h4>
            <div className="space-y-3">
              {profile.preferredGender && (
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center">
                    <Heart size={16} className="text-slate-600" />
                  </div>
                  <span className="text-sm">Prefers {genderLabels[profile.preferredGender] || profile.preferredGender} housemates</span>
                </div>
              )}
              
              {profile.preferredAgeRanges && (() => {
                let ageRangesArray: string[] = [];
                if (typeof profile.preferredAgeRanges === 'string') {
                  try {
                    ageRangesArray = JSON.parse(profile.preferredAgeRanges);
                  } catch {
                    ageRangesArray = [];
                  }
                } else if (Array.isArray(profile.preferredAgeRanges)) {
                  ageRangesArray = profile.preferredAgeRanges;
                }
                
                if (ageRangesArray.length > 0) {
                  return (
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center">
                        <Users size={16} className="text-slate-600" />
                      </div>
                      <span className="text-sm">Age preference: {ageRangesArray.join(', ')}</span>
                    </div>
                  );
                }
                return null;
              })()}
            </div>
          </div>
        )}

        {/* Additional Lifestyle Info */}
        {profile?.lifestyle && (() => {
          let lifestyleObj: any = {};
          if (typeof profile.lifestyle === 'string') {
            try {
              lifestyleObj = JSON.parse(profile.lifestyle);
            } catch {
              lifestyleObj = {};
            }
          } else if (typeof profile.lifestyle === 'object') {
            lifestyleObj = profile.lifestyle;
          }
          
          const hasLifestyleInfo = lifestyleObj.hasPets || lifestyleObj.smokingStatus || 
                                  (lifestyleObj.numberOfPeople && lifestyleObj.numberOfPeople !== "1");
          
          if (hasLifestyleInfo) {
            return (
              <div>
                <h4 className="font-medium mb-3">Additional Information</h4>
                <div className="space-y-3">
                  {lifestyleObj.numberOfPeople && lifestyleObj.numberOfPeople !== "1" && (
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center">
                        <Users size={16} className="text-slate-600" />
                      </div>
                      <span className="text-sm">{lifestyleObj.numberOfPeople} people looking for housing</span>
                    </div>
                  )}
                  
                  {lifestyleObj.hasPets && (
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center">
                        <PawPrint size={16} className="text-slate-600" />
                      </div>
                      <div>
                        <span className="text-sm">Has pets</span>
                        {lifestyleObj.petDescription && (
                          <span className="block text-xs text-muted-foreground">{lifestyleObj.petDescription}</span>
                        )}
                      </div>
                    </div>
                  )}
                  
                  {lifestyleObj.smokingStatus && (
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center">
                        {lifestyleObj.smokingStatus === "yes" ? (
                          <Cigarette size={16} className="text-slate-600" />
                        ) : (
                          <CigaretteOff size={16} className="text-slate-600" />
                        )}
                      </div>
                      <span className="text-sm">
                        {lifestyleObj.smokingStatus === "yes" ? "Smoker" : "Non-smoker"}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            );
          }
          return null;
        })()}

        {/* Can Help With */}
        {profile?.canHelpWith && (() => {
          let canHelpWithArray: string[] = [];
          if (typeof profile.canHelpWith === 'string') {
            try {
              canHelpWithArray = JSON.parse(profile.canHelpWith);
            } catch {
              canHelpWithArray = [];
            }
          } else if (Array.isArray(profile.canHelpWith)) {
            canHelpWithArray = profile.canHelpWith;
          }
          
          if (canHelpWithArray.length > 0) {
            return (
              <div>
                <h4 className="font-medium mb-3">Can Help With</h4>
                <div className="grid grid-cols-2 gap-3">
                  {canHelpWithArray.map((supportId) => {
                    const support = supportIcons[supportId];
                    if (!support) return null;
                    
                    const Icon = support.icon;
                    return (
                      <div key={supportId} className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center">
                          <Icon size={12} className="text-slate-600" />
                        </div>
                        <span className="text-sm">{support.label}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          }
          return null;
        })()}

        {/* Social Media */}
        {profile?.socialMedia && (() => {
          let socialMediaObj: any = {};
          if (typeof profile.socialMedia === 'string') {
            try {
              socialMediaObj = JSON.parse(profile.socialMedia);
            } catch {
              socialMediaObj = {};
            }
          } else if (typeof profile.socialMedia === 'object') {
            socialMediaObj = profile.socialMedia;
          }
          
          const hasSocialMedia = socialMediaObj.instagram || socialMediaObj.facebook || socialMediaObj.linkedin;
          
          if (hasSocialMedia) {
            return (
              <div>
                <h4 className="font-medium mb-3">Connect</h4>
                <div className="flex gap-3">
                  {socialMediaObj.instagram && (
                    <a href={socialMediaObj.instagram} target="_blank" rel="noopener noreferrer"
                       className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center hover:bg-slate-200 transition-colors">
                      <Instagram size={16} className="text-slate-600" />
                    </a>
                  )}
                  {socialMediaObj.facebook && (
                    <a href={socialMediaObj.facebook} target="_blank" rel="noopener noreferrer"
                       className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center hover:bg-slate-200 transition-colors">
                      <Facebook size={16} className="text-slate-600" />
                    </a>
                  )}
                  {socialMediaObj.linkedin && (
                    <a href={socialMediaObj.linkedin} target="_blank" rel="noopener noreferrer"
                       className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center hover:bg-slate-200 transition-colors">
                      <Linkedin size={16} className="text-slate-600" />
                    </a>
                  )}
                </div>
              </div>
            );
          }
          return null;
        })()}
      </CardContent>
    </Card>
  );
} 