import { notFound } from "next/navigation";
import prisma from "../lib/db";
import { AirbnbStyleCard } from "./AirbnbStyleCard";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { calculateAgeRange, extractDateOfBirth } from "@/lib/age-utils";

// Helper function to convert string to title case
function toTitleCase(str: string): string {
  return str.toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase());
}

interface HelpersData {
  errandsHelpers: any[];
  cookingHelpers: any[];
  petHelpers: any[];
}

async function getAllHelpersData(): Promise<HelpersData> {
  try {
    // Fetch all helper profiles in parallel
    const [errandsProfiles, cookingProfiles, petProfiles] = await Promise.all([
      // Errands & Transportation helpers
      prisma.housemateProfile.findMany({
        where: {
          OR: [
            {
              canHelpWith: {
                path: [],
                array_contains: "errands"
              }
            },
            {
              canHelpWith: {
                path: [],
                array_contains: "transportation"
              }
            }
          ]
        },
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      }),
      
      // Cooking helpers
      prisma.housemateProfile.findMany({
        where: {
          canHelpWith: {
            path: [],
            array_contains: "cooking"
          }
        },
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      }),
      
      // Pet care helpers
      prisma.housemateProfile.findMany({
        where: {
          canHelpWith: {
            path: [],
            array_contains: "petCare"
          }
        },
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      })
    ]);

    // Transform the data
    const transformProfile = (profile: any) => {
      const dateOfBirth = extractDateOfBirth(profile.lifestyle);
      const displayAgeRange = dateOfBirth ? calculateAgeRange(dateOfBirth) : (profile.ageRange || undefined);

      let lifestyleData: any = {};
      if (profile.lifestyle) {
        try {
          lifestyleData = typeof profile.lifestyle === 'string' 
            ? JSON.parse(profile.lifestyle) 
            : profile.lifestyle;
        } catch {
          lifestyleData = {};
        }
      }

      const isCurrentlyAttending = lifestyleData.education?.stillAttending || false;
      const isRetired = lifestyleData.occupationDetails?.isRetired || false;

      const getDetailedOccupation = () => {
        if (isRetired) {
          return "Retired";
        }
        
        if (isCurrentlyAttending) {
          const program = lifestyleData.education?.degreeProgram;
          if (program) {
            return `Studying ${program}`;
          }
          return "Student";
        }
        
        return lifestyleData.occupationDetails?.description || profile.occupation || undefined;
      };

      return {
        id: profile.user.id,
        name: toTitleCase(profile.user.firstName),
        price: profile.maxBudget || 0,
        smallDescription: profile.bio || 'No bio available',
        images: profile.profilePicture ? [profile.profilePicture] : [],
        amenities: [
          ...(profile.schedule ? [profile.schedule] : []),
          ...(profile.socialPreference ? [profile.socialPreference] : []),
        ].filter(Boolean).filter(amenity => amenity !== "early-riser" && amenity !== "independent" && amenity !== "social"),
        demographics: {
          ageRange: displayAgeRange,
          gender: profile.gender || undefined,
          occupation: getDetailedOccupation(),
          isCurrentlyAttending: isCurrentlyAttending,
          isRetired: isRetired,
        },
      };
    };

    // Transform all profiles
    const transformedErrands = errandsProfiles.map(transformProfile);
    const transformedCooking = cookingProfiles.map(transformProfile);
    const transformedPets = petProfiles.map(transformProfile);

    // Remove duplicates - priority: errands > cooking > pets
    const shownUserIds = new Set<string>();
    
    // Take first 4 errands helpers
    const finalErrands = transformedErrands.slice(0, 4);
    finalErrands.forEach(helper => shownUserIds.add(helper.id));

    // Take cooking helpers who haven't been shown
    const finalCooking = transformedCooking
      .filter(helper => !shownUserIds.has(helper.id))
      .slice(0, 4);
    finalCooking.forEach(helper => shownUserIds.add(helper.id));

    // Take pet helpers who haven't been shown
    const finalPets = transformedPets
      .filter(helper => !shownUserIds.has(helper.id))
      .slice(0, 4);

    return {
      errandsHelpers: finalErrands,
      cookingHelpers: finalCooking,
      petHelpers: finalPets
    };

  } catch (error) {
    console.error('Error fetching helpers data:', error);
    return {
      errandsHelpers: [],
      cookingHelpers: [],
      petHelpers: []
    };
  }
}

interface HelperRowProps {
  title: string;
  subtitle: string;
  helpers: any[];
  link: string;
}

function HelperRow({ title, subtitle, helpers, link, isFirst = false, isLast = false }: HelperRowProps & { isFirst?: boolean; isLast?: boolean }) {
  return (
    <section className={`${isFirst ? 'pt-8' : 'pt-6'} ${isLast ? 'pb-8' : 'pb-4'} px-6`}>
      <div className="mb-6">
        <Link
          href={link}
          className="block group cursor-pointer"
        >
          <div className="flex flex-wrap items-center gap-3">
            <h2 className="text-2xl md:text-5xl font-bold text-gray-900">
              {title}
            </h2>
            <p className="text-2xl md:text-5xl font-bold text-gray-900">
              {subtitle}
            </p>
            <ChevronRight 
              size={20} 
              className="text-gray-600 group-hover:text-gray-800 group-hover:translate-x-1 transition-all duration-200 md:w-8 md:h-8" 
            />
          </div>
        </Link>
      </div>

            {/* Mobile: Horizontal scroll, Desktop: Grid */}
      <div className="overflow-x-auto scrollbar-hide sm:overflow-x-visible -mx-6 px-6 sm:mx-0 sm:px-0">
        <div className="flex gap-4 pb-4 sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 sm:gap-6 sm:pb-0">
          {helpers.map((helper) => (
            <div key={helper.id} className="flex-shrink-0 w-[240px] sm:w-auto h-[320px] md:h-[420px]">
             <AirbnbStyleCard
              images={helper.images}
              id={helper.id}
              name={helper.name}
              price={helper.price}
              smallDescription={helper.smallDescription}
              amenities={helper.amenities}
              linkPath={`/profile/${helper.id}`}
              location="Seeking housing"
              availabilityText="Looking for housing"
              priceLabel="budget"
              demographics={helper.demographics}
            />
          </div>
        ))}
        </div>
      </div>
    </section>
  );
}

export async function HelpersRowsContainer() {
  const helpersData = await getAllHelpersData();

  return (
    <>
      <HelperRow 
        title="Errands & Driving Helpers"
        subtitle="in Columbia, MO"
        helpers={helpersData.errandsHelpers}
        link="/products/icon"
        isFirst={true}
      />
      
      <HelperRow 
        title="Cooking Helpers"
        subtitle="in Columbia, MO"
        helpers={helpersData.cookingHelpers}
        link="/products/icon"
      />
      
      <HelperRow 
        title="Pet-Friendly Helpers"
        subtitle="in Columbia, MO"
        helpers={helpersData.petHelpers}
        link="/products/icon"
        isLast={true}
      />
    </>
  );
} 