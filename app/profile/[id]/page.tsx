import { notFound } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import prisma from "@/app/lib/db";
import Image from "next/image";
import { User, MapPin, CheckCircle, Heart, Briefcase, Clock, Users, PawPrint, CigaretteOff, Cigarette, Instagram, Facebook, Linkedin, DollarSign, Sparkles, Salad, Flower, ShoppingBag, HeartHandshake, Cat, Wrench, Shield, BookOpen, Film, Dumbbell, Music, Gamepad2, Palette, Church, GraduationCap, Armchair } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProfileNavigation } from "./components/ProfileNavigation";
import { calculateAgeRange, extractDateOfBirth } from "@/lib/age-utils";

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

const hobbyIcons: Record<string, any> = {
  gardening: { icon: Flower, label: "Gardening" },
  cooking: { icon: Salad, label: "Cooking/Baking" },
  reading: { icon: BookOpen, label: "Reading" },
  movies: { icon: Film, label: "Movies/TV" },
  volunteering: { icon: HeartHandshake, label: "Volunteering" },
  fitness: { icon: Dumbbell, label: "Fitness" },
  church: { icon: Church, label: "Church/Religious" },
  crafting: { icon: Palette, label: "Crafting/Art" },
  music: { icon: Music, label: "Music" },
  tech: { icon: Wrench, label: "Tech/Computers" },
  pets: { icon: PawPrint, label: "Pets/Animals" },
  games: { icon: Gamepad2, label: "Board Games" }
};

interface ProfilePageProps {
  params: Promise<{
    id: string;
  }>;
}

async function getUserProfile(userId: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        housemateProfile: true,
        homeownerProfile: true,
      },
    });

    return user;
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return null;
  }
}

export default async function ProfilePage({ params }: ProfilePageProps) {
  const { id } = await params;
  const currentUser = await getCurrentUser();
  
  const profileUser = await getUserProfile(id);
  
  if (!profileUser) {
    notFound();
  }

  const isOwnProfile = currentUser?.id === profileUser.id;
  const userType = (profileUser as any).userType;
  const profile = profileUser.housemateProfile;

  // Parse lifestyle data
  let lifestyleData: any = {};
  if (profile?.lifestyle) {
    try {
      lifestyleData = typeof profile.lifestyle === 'string' 
        ? JSON.parse(profile.lifestyle) 
        : profile.lifestyle;
    } catch {
      lifestyleData = {};
    }
  }

  // Parse hobbies
  let hobbiesArray: string[] = [];
  if (profile?.hobbies) {
    try {
      hobbiesArray = Array.isArray(profile.hobbies) 
        ? profile.hobbies 
        : JSON.parse(profile.hobbies as string);
    } catch {
      hobbiesArray = [];
    }
  }

  // Parse social media
  let socialMediaData: any = {};
  if (profile?.socialMedia) {
    try {
      socialMediaData = typeof profile.socialMedia === 'string' 
        ? JSON.parse(profile.socialMedia) 
        : profile.socialMedia;
    } catch {
      socialMediaData = {};
    }
  }

  // Parse preferred age ranges
  let preferredAgeRanges: string[] = [];
  if (profile?.preferredAgeRanges) {
    try {
      preferredAgeRanges = Array.isArray(profile.preferredAgeRanges) 
        ? profile.preferredAgeRanges 
        : JSON.parse(profile.preferredAgeRanges as string);
    } catch {
      preferredAgeRanges = [];
    }
  }

  // Parse canHelpWith
  let canHelpWithArray: string[] = [];
  if ((profile as any)?.canHelpWith) {
    try {
      canHelpWithArray = Array.isArray((profile as any).canHelpWith) 
        ? (profile as any).canHelpWith 
        : JSON.parse((profile as any).canHelpWith as string);
    } catch {
      canHelpWithArray = [];
    }
  }

  // Calculate age range based on date of birth
  const dateOfBirth = extractDateOfBirth(profile?.lifestyle);
  const displayAgeRange = dateOfBirth ? calculateAgeRange(dateOfBirth) : (profile?.ageRange || 'Age not specified');

  const occupationLabels: Record<string, string> = {
    student: "Student",
    professional: "Professional",
    retired: "Retired",
    other: "Other"
  };

  const genderLabels: Record<string, string> = {
    male: "Male",
    female: "Female",
    other: "Other"
  };

  const scheduleLabels: Record<string, string> = {
    "early-riser": "Early Riser",
    "night-owl": "Night Owl",
    "flexible": "Flexible"
  };

  const socialLabels: Record<string, string> = {
    social: "Social",
    independent: "Independent",
    balanced: "Balanced"
  };

  const hobbiesLabels: Record<string, string> = {
    gardening: "Gardening",
    cooking: "Cooking/Baking",
    reading: "Reading",
    movies: "Movies/TV",
    volunteering: "Volunteering",
    fitness: "Fitness",
    church: "Church/Religious",
    crafting: "Crafting/Art",
    music: "Music",
    tech: "Tech/Computers",
    pets: "Pets/Animals",
    games: "Board Games"
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden sticky top-8">
              {/* Profile Image */}
              <div className="relative aspect-square w-full bg-gray-50">
                {profile?.profilePicture ? (
                  <Image
                    src={profile.profilePicture}
                    alt={`${profileUser.firstName}'s profile`}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <User size={64} className="text-gray-300" />
                  </div>
                )}
                
                {/* Heart Button */}
                <button className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center hover:bg-white transition-colors shadow-sm">
                  <Heart size={20} className="text-gray-600" />
                </button>
              </div>

              {/* Profile Info */}
              <div className="p-6">
                <div className="text-center mb-6">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <h1 className="text-2xl font-bold text-gray-900">
                      {profileUser.firstName} {profileUser.lastName?.charAt(0)}.
                    </h1>
                    <CheckCircle size={20} className="text-blue-500" />
                  </div>
                  <p className="text-gray-600 flex items-center justify-center gap-1">
                    <MapPin size={16} />
                    {lifestyleData.location?.city && lifestyleData.location?.state ? (
                      `${lifestyleData.location.city}, ${lifestyleData.location.state}`
                    ) : (
                      'Location not specified'
                    )}
                  </p>
                </div>

                {/* Basic Information */}
                {(profile?.occupation || profile?.gender || profile?.ageRange || profile?.maxBudget || socialMediaData.instagram || socialMediaData.facebook || socialMediaData.linkedin) && (
                  <div className="mb-6">
                    <h4 className="font-medium mb-3">Basic Information</h4>
                    <div className="space-y-3">
                      {profile?.occupation && (
                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                            {lifestyleData.occupationDetails?.isRetired ? (
                              <Armchair size={16} className="text-primary" />
                            ) : lifestyleData.education?.stillAttending ? (
                              <GraduationCap size={16} className="text-primary" />
                            ) : (
                              <Briefcase size={16} className="text-primary" />
                            )}
                          </div>
                          <span className="text-sm font-medium text-gray-700">
                            {lifestyleData.occupationDetails?.isRetired ? "Retired" : lifestyleData.education?.stillAttending ? "Student" : (occupationLabels[profile.occupation] || profile.occupation)}
                          </span>
                        </div>
                      )}

                      {profile?.gender && (
                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                            <User size={16} className="text-primary" />
                          </div>
                          <span className="text-sm font-medium text-gray-700">{genderLabels[profile.gender] || profile.gender}</span>
                        </div>
                      )}
                      
                      {profile?.ageRange && (
                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                            <Users size={16} className="text-primary" />
                          </div>
                          <span className="text-sm font-medium text-gray-700">Age: {displayAgeRange}</span>
                        </div>
                      )}
                      
                      {profile?.maxBudget && (
                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                            <DollarSign size={16} className="text-primary" />
                          </div>
                          <span className="text-sm font-medium text-gray-700">Budget: Up to ${profile.maxBudget}/month</span>
                        </div>
                      )}

                      {/* Social Media Links */}
                      {socialMediaData.instagram && (
                        <a 
                          href={socialMediaData.instagram} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-primary/5 transition-colors group"
                        >
                          <div className="w-8 h-8 rounded-full bg-pink-100 flex items-center justify-center group-hover:bg-pink-200 transition-colors">
                            <Instagram size={16} className="text-pink-600" />
                          </div>
                          <span className="text-sm font-medium text-gray-700 group-hover:text-pink-600 transition-colors">Instagram</span>
                        </a>
                      )}
                      {socialMediaData.facebook && (
                        <a 
                          href={socialMediaData.facebook} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-primary/5 transition-colors group"
                        >
                          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                            <Facebook size={16} className="text-blue-600" />
                          </div>
                          <span className="text-sm font-medium text-gray-700 group-hover:text-blue-600 transition-colors">Facebook</span>
                        </a>
                      )}
                      {socialMediaData.linkedin && (
                        <a 
                          href={socialMediaData.linkedin} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-primary/5 transition-colors group"
                        >
                          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                            <Linkedin size={16} className="text-blue-700" />
                          </div>
                          <span className="text-sm font-medium text-gray-700 group-hover:text-blue-700 transition-colors">LinkedIn</span>
                        </a>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100">
              {/* About Section */}
              <div id="about-section" className="p-6">
                <h2 className="text-xl font-semibold text-primary mb-4">
                  About {profileUser.firstName}
                </h2>
                
                {profile?.bio ? (
                  <p className="text-gray-700 leading-relaxed mb-6">
                    {profile.bio}
                  </p>
                ) : (
                  <p className="text-gray-500 italic mb-6">
                    No bio provided yet.
                  </p>
                )}

                {/* Education & Work */}
                {(lifestyleData.education || lifestyleData.occupationDetails || profile?.occupation) && (
                  <div className="mb-6">
                    <h3 className="font-semibold text-primary mb-3">Education & Work</h3>
                    <div className="space-y-4">
                      {lifestyleData.education && (
                        <div className="p-4 bg-gray-50 rounded-lg">
                          <h4 className="font-medium text-gray-900 mb-2">Education</h4>
                          <div className="text-gray-700 space-y-1">
                            {lifestyleData.education.level && (
                              <p><span className="font-medium">Level:</span> {lifestyleData.education.level}</p>
                            )}
                            {lifestyleData.education.degreeProgram && (
                              <p><span className="font-medium">Program:</span> {lifestyleData.education.degreeProgram}</p>
                            )}
                            {lifestyleData.education.stillAttending && (
                              <p className="text-sm text-primary font-medium">Currently attending</p>
                            )}
                          </div>
                        </div>
                      )}
                      
                      {(lifestyleData.occupationDetails || profile?.occupation) && (
                        <div className="p-4 bg-gray-50 rounded-lg">
                          <h4 className="font-medium text-gray-900 mb-2">Work</h4>
                          <div className="text-gray-700">
                            {lifestyleData.occupationDetails?.isRetired ? (
                              <p className="font-medium">Retired</p>
                            ) : lifestyleData.occupationDetails?.description ? (
                              <p className="font-medium">{lifestyleData.occupationDetails.description}</p>
                            ) : profile?.occupation ? (
                              <p className="font-medium">{occupationLabels[profile.occupation] || profile.occupation}</p>
                            ) : (
                              <p className="text-gray-500 italic">No work information provided</p>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Personal Preferences */}
                {(profile?.schedule || profile?.socialPreference) && (
                  <div id="preferences-section" className="mb-6">
                    <h3 className="font-semibold text-primary mb-3">Personal Preferences</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {profile?.schedule && (
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                            <Clock size={20} className="text-primary" />
                          </div>
                          <div>
                            <div className="font-medium text-sm">Schedule</div>
                            <div className="text-sm text-gray-600">
                              {scheduleLabels[profile.schedule] || profile.schedule}
                            </div>
                          </div>
                        </div>
                      )}
                      {profile?.socialPreference && (
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                            <Users size={20} className="text-primary" />
                          </div>
                          <div>
                            <div className="font-medium text-sm">Social Style</div>
                            <div className="text-sm text-gray-600">
                              {socialLabels[profile.socialPreference] || profile.socialPreference}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Hobbies & Interests */}
                {hobbiesArray.length > 0 && (
                  <div className="mb-6">
                    <h3 className="font-semibold text-primary mb-3">Hobbies & Interests</h3>
                    <div className="flex flex-wrap gap-2">
                      {hobbiesArray.map((hobby, index) => {
                        const hobbyData = hobbyIcons[hobby];
                        const Icon = hobbyData?.icon;
                        
                        return (
                          <div
                            key={index}
                            className="flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium border border-primary/20 hover:bg-primary/20 transition-colors"
                          >
                            {Icon && <Icon size={16} className="text-primary" />}
                            <span>{hobbyData?.label || hobbiesLabels[hobby] || hobby}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Housing Preferences */}
                <div id="housing-section" className="mb-6">
                  <h3 className="font-semibold text-primary mb-3">Housing Preferences</h3>
                  <div className="space-y-4">
                    {/* Budget */}
                    <div className="bg-primary/5 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <DollarSign size={16} className="text-primary" />
                          <span className="text-gray-700">Monthly budget</span>
                        </div>
                        <span className="font-semibold">
                          {profile?.maxBudget ? `$${profile.maxBudget}` : 'Not specified'} /month
                        </span>
                      </div>
                    </div>

                    {/* Preferred Age Ranges */}
                    {preferredAgeRanges.length > 0 && (
                      <div>
                        <div className="text-sm font-medium text-gray-700 mb-2">Preferred age ranges for housemates:</div>
                        <div className="flex flex-wrap gap-2">
                          {preferredAgeRanges.map((ageRange, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-sm"
                            >
                              {ageRange === "no-preference" ? "No Preference" : ageRange}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Preferred Gender */}
                    {profile?.preferredGender && (
                      <div>
                        <div className="text-sm font-medium text-gray-700 mb-1">Preferred gender for housemates:</div>
                        <span className="text-sm text-gray-600">
                          {profile.preferredGender === "no-preference" ? "No Preference" : genderLabels[profile.preferredGender] || profile.preferredGender}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Lifestyle Information */}
                {(lifestyleData.hasPets !== undefined || lifestyleData.numberOfPeople || lifestyleData.smokingStatus) && (
                  <div className="mb-6">
                    <h3 className="font-semibold text-gray-900 mb-3">Lifestyle</h3>
                    <div className="space-y-3">
                      {lifestyleData.hasPets !== undefined && (
                        <div className="flex items-start gap-3">
                          <PawPrint size={20} className="text-gray-400 mt-0.5" />
                          <div>
                            <div className="font-medium text-sm">
                              {lifestyleData.hasPets ? "Has pets" : "No pets"}
                            </div>
                            {lifestyleData.hasPets && lifestyleData.petDescription && (
                              <div className="text-sm text-gray-600 mt-1">
                                {lifestyleData.petDescription}
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                      
                      {lifestyleData.numberOfPeople && (
                        <div className="flex items-center gap-3">
                          <Users size={20} className="text-gray-400" />
                          <div>
                            <div className="font-medium text-sm">Number of people</div>
                            <div className="text-sm text-gray-600">
                              {lifestyleData.numberOfPeople === "1" ? "Just myself (1 person)" :
                               lifestyleData.numberOfPeople === "2" ? "2 people" :
                               lifestyleData.numberOfPeople === "3+" ? "3 or more people" :
                               lifestyleData.numberOfPeople}
                            </div>
                          </div>
                        </div>
                      )}

                      {lifestyleData.smokingStatus && (
                        <div className="flex items-center gap-3">
                          {lifestyleData.smokingStatus === "non-smoker" ? (
                            <CigaretteOff size={20} className="text-gray-400" />
                          ) : (
                            <Cigarette size={20} className="text-gray-400" />
                          )}
                          <div>
                            <div className="font-medium text-sm">Smoking</div>
                            <div className="text-sm text-gray-600">
                              {lifestyleData.smokingStatus === "non-smoker" ? "Non-smoker" :
                               lifestyleData.smokingStatus === "smoker" ? "Smoker" :
                               lifestyleData.smokingStatus === "occasional" ? "Occasional smoker" :
                               lifestyleData.smokingStatus}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Can Help With */}
                {canHelpWithArray.length > 0 && (
                  <div className="mb-6">
                    <h3 className="font-semibold text-primary mb-3">Can Help With</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {canHelpWithArray.map((supportId, index) => {
                        const support = supportIcons[supportId];
                        if (!support) return null;
                        
                        const Icon = support.icon;
                        return (
                          <div key={index} className="flex items-center gap-3 p-3 bg-primary/5 rounded-lg border border-primary/10">
                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                              <Icon size={16} className="text-primary" />
                            </div>
                            <span className="text-sm font-medium text-primary">
                              {support.label}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 