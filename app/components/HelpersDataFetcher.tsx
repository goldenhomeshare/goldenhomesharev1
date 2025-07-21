import { notFound } from "next/navigation";
import prisma from "../lib/db";
import { calculateAgeRange, extractDateOfBirth } from "@/lib/age-utils";
import HelpersRowsContainer from "./HelpersRowsContainer";

// Helper function to convert string to title case
function toTitleCase(str: string): string {
  return str.replace(/\w\S*/g, (txt) => 
    txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
  );
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
    
    // Take first 5 errands helpers
    const finalErrands = transformedErrands.slice(0, 5);
    finalErrands.forEach(helper => shownUserIds.add(helper.id));

    // Take cooking helpers who haven't been shown
    const finalCooking = transformedCooking
      .filter(helper => !shownUserIds.has(helper.id))
      .slice(0, 5);
    finalCooking.forEach(helper => shownUserIds.add(helper.id));

    // Take pet helpers who haven't been shown
    const finalPets = transformedPets
      .filter(helper => !shownUserIds.has(helper.id))
      .slice(0, 5);

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

export async function HelpersDataFetcher() {
  const helpersData = await getAllHelpersData();
  return <HelpersRowsContainer helpersData={helpersData} />;
} 