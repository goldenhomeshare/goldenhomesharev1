import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User, UserCircle, CircleDashed, GraduationCap, Briefcase, UserCheck, Users, Crown, Sunrise, Moon, Clock, CircleDot, Flower, ChefHat, Book, Tv, HandHeart, Dumbbell, Church, Palette, Music, Laptop, PawPrint, Dice6 } from "lucide-react";

interface HomeownerProfile {
  profilePicture?: string | null;
  bio?: string | null;
  gender?: string | null;
  ageRange?: string | null;
  schedule?: string | null;
  socialPreference?: string | null;
  hobbies?: string[] | null;
}

interface HomeownerProfileCardProps {
  homeowner: {
    firstName: string;
    lastName: string;
    profileImage: string;
    homeownerProfile?: HomeownerProfile | null;
  };
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

export function HomeownerProfileCard({ homeowner }: HomeownerProfileCardProps) {
  const profile = homeowner.homeownerProfile;

  return (
    <Card className="mt-8">
      <CardHeader>
        <CardTitle className="flex items-center gap-3">
          <div className="relative w-16 h-16 rounded-full overflow-hidden">
            {profile?.profilePicture ? (
              <Image
                src={profile.profilePicture}
                alt={`${homeowner.firstName}'s profile`}
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
            <h3 className="text-xl font-semibold">Your Host</h3>
            <p className="text-lg text-muted-foreground">{homeowner.firstName} {homeowner.lastName}</p>
          </div>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {profile?.bio && (
          <div>
            <h4 className="font-medium mb-2">About</h4>
            <p className="text-muted-foreground">{profile.bio}</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Demographics */}
          <div className="space-y-4">
            <h4 className="font-medium">Demographics</h4>
            
            {profile?.gender && genderIcons[profile.gender as keyof typeof genderIcons] && (
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center">
                  {(() => {
                    const Icon = genderIcons[profile.gender as keyof typeof genderIcons].icon;
                    return <Icon size={16} className="text-slate-600" />;
                  })()}
                </div>
                <span className="text-sm">{genderIcons[profile.gender as keyof typeof genderIcons].label}</span>
              </div>
            )}
            
            {profile?.ageRange && ageRangeIcons[profile.ageRange as keyof typeof ageRangeIcons] && (
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center">
                  {(() => {
                    const Icon = ageRangeIcons[profile.ageRange as keyof typeof ageRangeIcons].icon;
                    return <Icon size={16} className="text-slate-600" />;
                  })()}
                </div>
                <span className="text-sm">{ageRangeIcons[profile.ageRange as keyof typeof ageRangeIcons].label}</span>
              </div>
            )}
          </div>

          {/* Preferences */}
          <div className="space-y-4">
            <h4 className="font-medium">Preferences</h4>
            
            {profile?.schedule && scheduleIcons[profile.schedule as keyof typeof scheduleIcons] && (
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
            
            {profile?.socialPreference && socialIcons[profile.socialPreference as keyof typeof socialIcons] && (
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

        {/* Hobbies */}
        {profile?.hobbies && (
          <div>
            <h4 className="font-medium mb-3">Hobbies & Interests</h4>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {(() => {
                // Handle hobbies that might be stored as JSON string or array
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
                
                return hobbiesArray.map((hobbyId) => {
                  const hobby = hobbiesIcons[hobbyId as keyof typeof hobbiesIcons];
                  if (!hobby) return null;
                  
                  const Icon = hobby.icon;
                  return (
                    <div key={hobbyId} className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center">
                        <Icon size={14} className="text-slate-600" />
                      </div>
                      <span className="text-sm">{hobby.label}</span>
                    </div>
                  );
                });
              })()}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
} 