import { notFound } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import prisma from "@/app/lib/db";
import Image from "next/image";
import Link from "next/link";
import { User, MapPin, Briefcase, Clock, Users, PawPrint, CigaretteOff, Cigarette, Sparkles, Salad, Flower, ShoppingBag, HeartHandshake, Cat, Wrench, Shield, BookOpen, Film, Dumbbell, Music, Gamepad2, Palette, Church, GraduationCap, MessageCircle, ShieldCheck, Umbrella, Monitor, PartyPopper } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProfileNavigation } from "./components/ProfileNavigation";
import { calculateAgeRange, extractDateOfBirth } from "@/lib/age-utils";
import { MessageHousemateButton } from "@/app/components/chat/MessageHousemateButton";
import { ProfileHousemateCard } from "./components/ProfileHousemateCard";
import { SimpleMessageButton } from "./components/SimpleMessageButton";
import { StickyMessagingCard } from "./components/StickyMessagingCard";
import { ProfileAboutSection } from "./components/ProfileAboutSection";

// Helper function to convert names to title case
const toTitleCase = (str: string) => {
  return str.toLowerCase().split(' ').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ');
};

const supportIcons: Record<string, any> = {
  cleaning: { icon: Sparkles, label: "Cleaning" },
  cooking: { icon: Salad, label: "Cooking" },
  gardening: { icon: Flower, label: "Yard work" },
  errands: { icon: ShoppingBag, label: "Errands" },
  companionship: { icon: HeartHandshake, label: "Companionship" },
  petCare: { icon: Cat, label: "Pet Care" },
  techSupport: { icon: Monitor, label: "Tech Support" },
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

  // Calculate birth decade
  const getBirthDecade = (dateOfBirthString: string | null) => {
    if (!dateOfBirthString) return null;
    const dateObj = new Date(dateOfBirthString);
    if (isNaN(dateObj.getTime())) return null;
    const year = dateObj.getFullYear();
    const decade = Math.floor(year / 10) * 10;
    const decadeString = decade.toString().slice(-2);
    return `${decadeString}s`;
  };

  const birthDecade = getBirthDecade(dateOfBirth);

  // Determine display location for the card
  const displayLocation = lifestyleData.location?.city && lifestyleData.location?.state
    ? `${lifestyleData.location.city}, ${lifestyleData.location.state}`
    : "Location not specified";

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
        {/* Housemate Card at the top */}
        {profile && (
          <div className="mb-8">
            <ProfileHousemateCard
              id={profileUser.id}
              name={`${profileUser.firstName} ${profileUser.lastName || ''}`}
              location={displayLocation}
              occupation={profile.occupation || "Not specified"}
              gender={profile.gender || "Not specified"}
              ageRange={displayAgeRange}
              maxBudget={profile.maxBudget || 400}
              profileImage={profile.profilePicture || undefined}
              userId={profileUser.id}
              email={profileUser.email || ""}
              lifestyle={profile.lifestyle}
            />
          </div>
        )}

        {/* Main Content Layout - Left content and Right sticky messaging card */}
        {profile && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Content - Takes up 2 columns */}
            <div className="lg:col-span-2 space-y-8">
              {/* About Section - now aligned with other content */}
              {profile.bio && (
                <ProfileAboutSection 
                  bio={profile.bio}
                  firstName={profileUser.firstName}
                />
              )}

              {/* Safety Features Section */}
              <div className="space-y-6">
                {/* Background Check Verification Section */}
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-14 lg:h-14 bg-gradient-to-br from-amber-400 to-yellow-600 rounded-full flex items-center justify-center shadow-lg flex-shrink-0">
                    <ShieldCheck size={20} className="text-white sm:w-6 sm:h-6 lg:w-9 lg:h-9" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      Background Checked
                    </h3>
                    <p className="text-gray-600 mb-3">
                      Screened by Checkr with no reported criminal history. Minor traffic violations excluded.
                    </p>
                    <Link href="/about/safety/background-checks" target="_blank" rel="noopener noreferrer">
                      <Button variant="outline" size="sm" className="text-sm">
                        Learn more
                      </Button>
                    </Link>
                  </div>
                </div>

                {/* Golden Cover Section */}
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-14 lg:h-14 bg-green-700 rounded-full flex items-center justify-center shadow-lg flex-shrink-0">
                    <Umbrella size={20} className="text-white sm:w-6 sm:h-6 lg:w-9 lg:h-9" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      Golden Cover $10,000
                    </h3>
                    <p className="text-gray-600 mb-3">
                      Damage protection covers you if a helper damages your place or belongings during an Golden stay.
                    </p>
                    <Link href="/safety" target="_blank" rel="noopener noreferrer">
                      <Button variant="outline" size="sm" className="text-sm">
                        Learn more
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>

              {/* Can Help With Section */}
              {canHelpWithArray.length > 0 && (
                <div>
                  <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                    {toTitleCase(profileUser.firstName)} can help with
                  </h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {canHelpWithArray.map((supportId, index) => {
                      const support = supportIcons[supportId];
                      if (!support) return null;
                      
                      const Icon = support.icon;
                      return (
                        <div key={index} className="flex flex-col items-center text-center p-4">
                          <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-3">
                            <Icon size={24} className="text-gray-700" />
                          </div>
                          <span className="text-base font-medium text-gray-900">
                            {support.label}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Profile Information Section */}
              <div>
                <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                  About {toTitleCase(profileUser.firstName)}
                </h2>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {/* Work */}
                  {(lifestyleData.occupationDetails?.description || profile?.occupation) && (
                    <div className="flex items-center gap-3">
                      <Briefcase size={24} className="text-gray-900 flex-shrink-0" />
                      <span className="text-gray-900 text-base">
                        My work: {lifestyleData.occupationDetails?.isRetired ? "Retired" : 
                         lifestyleData.occupationDetails?.description || 
                         (profile?.occupation && (occupationLabels[profile.occupation] || profile.occupation))}
                      </span>
                    </div>
                  )}

                  {/* Schedule Preference */}
                  {profile?.schedule && (
                    <div className="flex items-center gap-3">
                      <Clock size={24} className="text-gray-900 flex-shrink-0" />
                      <span className="text-gray-900 text-base">
                        Schedule: {scheduleLabels[profile.schedule] || profile.schedule}
                      </span>
                    </div>
                  )}

                  {/* Social Style */}
                  {profile?.socialPreference && (
                    <div className="flex items-center gap-3">
                      <Users size={24} className="text-gray-900 flex-shrink-0" />
                      <span className="text-gray-900 text-base">
                        Social style: {socialLabels[profile.socialPreference] || profile.socialPreference}
                      </span>
                    </div>
                  )}

                  {/* Gender */}
                  {profile?.gender && (
                    <div className="flex items-center gap-3">
                      <User size={24} className="text-gray-900 flex-shrink-0" />
                      <span className="text-gray-900 text-base">
                        Gender: {genderLabels[profile.gender] || profile.gender}
                      </span>
                    </div>
                  )}

                  {/* Birth Decade */}
                  {birthDecade && (
                    <div className="flex items-center gap-3">
                      <PartyPopper size={24} className="text-gray-900 flex-shrink-0" />
                      <span className="text-gray-900 text-base">Born in the {birthDecade}</span>
                    </div>
                  )}

                  {/* Education */}
                  {lifestyleData.education?.level && (
                    <div className="flex items-center gap-3">
                      <GraduationCap size={24} className="text-gray-900 flex-shrink-0" />
                      <span className="text-gray-900 text-base">
                        Education: {lifestyleData.education.level}
                        {lifestyleData.education.degreeProgram && ` in ${lifestyleData.education.degreeProgram}`}
                      </span>
                    </div>
                  )}

                  {/* Language */}
                  {lifestyleData.language && (
                    <div className="flex items-center gap-3">
                      <MessageCircle size={24} className="text-gray-900 flex-shrink-0" />
                      <span className="text-gray-900 text-base">Primary language: {lifestyleData.language}</span>
                    </div>
                  )}

                  {/* Pets */}
                  {lifestyleData.hasPets !== undefined && (
                    <div className="flex items-center gap-3">
                      <PawPrint size={24} className="text-gray-900 flex-shrink-0" />
                      <span className="text-gray-900 text-base">
                        {lifestyleData.hasPets ? 
                          (lifestyleData.petDescription || "Has pets") : 
                          "No pets"}
                      </span>
                    </div>
                  )}

                  {/* Number of People */}
                  {lifestyleData.numberOfPeople && (
                    <div className="flex items-center gap-3">
                      <Users size={24} className="text-gray-900 flex-shrink-0" />
                      <span className="text-gray-900 text-base">
                        Lives with: {lifestyleData.numberOfPeople === "1" ? "Just myself (1 person)" :
                         lifestyleData.numberOfPeople === "2" ? "2 people" :
                         lifestyleData.numberOfPeople === "3+" ? "3 or more people" :
                         lifestyleData.numberOfPeople}
                      </span>
                    </div>
                  )}

                  {/* Smoking */}
                  {lifestyleData.smokingStatus && (
                    <div className="flex items-center gap-3">
                      {lifestyleData.smokingStatus === "non-smoker" ? (
                        <CigaretteOff size={24} className="text-gray-900 flex-shrink-0" />
                      ) : (
                        <Cigarette size={24} className="text-gray-900 flex-shrink-0" />
                      )}
                      <span className="text-gray-900 text-base">
                        {lifestyleData.smokingStatus === "non-smoker" ? "Non-smoker" :
                         lifestyleData.smokingStatus === "smoker" ? "Smoker" :
                         lifestyleData.smokingStatus === "occasional" ? "Occasional smoker" :
                         lifestyleData.smokingStatus}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right Sticky Messaging Card - Takes up 1 column */}
            <StickyMessagingCard 
              housemateId={profileUser.id} 
              isOwnProfile={isOwnProfile} 
            />
          </div>
        )}
      </div>
    </div>
  );
} 