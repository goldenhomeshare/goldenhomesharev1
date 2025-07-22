import { notFound } from "next/navigation";
import prisma from "../lib/db";
import { AirbnbStyleCard, LoadingAirbnbCard } from "./AirbnbStyleCard";
import Link from "next/link";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { ChevronRight } from "lucide-react";
import { calculateAgeRange, extractDateOfBirth } from "@/lib/age-utils";

// Constants - Profile chat product IDs to exclude from listings
const PROFILE_CHAT_PRODUCT_IDS = ["cm2h3ofy000007e71twi83xsy", "profile-chat-placeholder"];

// Retry configuration
const MAX_RETRIES = 3;
const BASE_DELAY = 1000; // 1 second

// Helper function to convert string to title case
function toTitleCase(str: string): string {
  return str.toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase());
}

// Simple in-memory cache
const cache = new Map<string, { data: any; timestamp: number }>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

// Cache for user IDs already shown in previous rows (per page load)
const shownUserIds = new Set<string>();

// Function to clear shown user IDs for a new page load
function clearShownUsers() {
  shownUserIds.clear();
}

// Cache utility functions
function getCacheKey(category: string, limit: number): string {
  return `${category}-${limit}`;
}

function getCachedData(key: string) {
  const cached = cache.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data;
  }
  return null;
}

function setCachedData(key: string, data: any) {
  cache.set(key, { data, timestamp: Date.now() });
  
  // Clean up old cache entries
  if (cache.size > 50) {
    const now = Date.now();
    for (const [k, v] of cache.entries()) {
      if (now - v.timestamp > CACHE_TTL) {
        cache.delete(k);
      }
    }
  }
}

// Utility function for retrying database operations
async function retryDatabaseOperation<T>(
  operation: () => Promise<T>,
  retries = MAX_RETRIES
): Promise<T> {
  try {
    return await operation();
  } catch (error: any) {
    if (retries > 0 && error?.code === 'P2024') { // Connection pool timeout
      const delay = BASE_DELAY * (MAX_RETRIES - retries + 1);
      console.warn(`Database connection timeout, retrying in ${delay}ms...`);
      await new Promise(resolve => setTimeout(resolve, delay));
      return retryDatabaseOperation(operation, retries - 1);
    }
    throw error;
  }
}

interface iAppProps {
  category: "newest" | "templates" | "uikits" | "icons" | "rooms" | "housemates" | "cooking-helpers" | "tech-helpers" | "pet-helpers" | "errands-helpers";
  limit?: number;
}

interface ProductData {
  id: string;
  name: string;
  price: number;
  smallDescription: string;
  images: string[];
  amenities?: any;
  address?: string | null;
  supportRequested?: any;
  demographics?: {
    age?: string;
    gender?: string;
    occupation?: string;
    isCurrentlyAttending?: boolean;
    isRetired?: boolean;
  };
}

interface GetDataResult {
  data: ProductData[];
  title: string;
  link: string;
  isHousemates?: boolean;
}

async function getData({ category, limit = 4 }: iAppProps): Promise<GetDataResult> {
  const cacheKey = getCacheKey(category, limit);
  const cached = getCachedData(cacheKey);
  if (cached) {
    return cached;
  }

  // Clear shown users for errands-helpers (first category on home page)
  if (category === "errands-helpers") {
    clearShownUsers();
  }

  switch (category) {
    case "rooms": {
      // Combine all room types (templates, uikits, icons) into one category
      const data = await retryDatabaseOperation(() =>
        prisma.product.findMany({
          where: {
            category: {
              in: ["template", "uikit", "icon"]
            },
            // Exclude profile chat placeholders
            id: {
              notIn: PROFILE_CHAT_PRODUCT_IDS,
            },
          },
          select: {
            price: true,
            name: true,
            smallDescription: true,
            id: true,
            images: true,
            amenities: true,
            address: true,
            supportRequested: true,
          },
          take: limit,
        })
      );

      setCachedData(cacheKey, {
        data: data,
        title: "Rooms in Columbia",
        link: "/products/template",
      });
      return {
        data: data,
        title: "Rooms in Columbia",
        link: "/products/template",
      };
    }
    case "icons": {
      const data = await retryDatabaseOperation(() =>
        prisma.product.findMany({
          where: {
            category: "icon",
            // Exclude profile chat placeholders
            id: {
              notIn: PROFILE_CHAT_PRODUCT_IDS,
            },
          },
          select: {
            price: true,
            name: true,
            smallDescription: true,
            id: true,
            images: true,
            amenities: true,
            address: true,
            supportRequested: true,
          },
          take: limit,
        })
      );

      setCachedData(cacheKey, {
        data: data,
        title: "ADUs",
        link: "/products/template",
      });
      return {
        data: data,
        title: "ADUs",
        link: "/products/template",
      };
    }
    case "newest": {
      const data = await retryDatabaseOperation(() =>
        prisma.product.findMany({
          where: {
            // Exclude profile chat placeholders
            id: {
              notIn: PROFILE_CHAT_PRODUCT_IDS,
            },
          },
          select: {
            price: true,
            name: true,
            smallDescription: true,
            id: true,
            images: true,
            amenities: true,
            address: true,
            supportRequested: true,
          },
          orderBy: {
            createdAt: "desc",
          },
          take: limit,
        })
      );

      setCachedData(cacheKey, {
        data: data,
        title: "Newest Listings",
        link: "/products/template",
      });
      return {
        data: data,
        title: "Newest Listings",
        link: "/products/template",
      };
    }
    case "templates": {
      const data = await retryDatabaseOperation(() =>
        prisma.product.findMany({
          where: {
            category: "template",
            // Exclude profile chat placeholders
            id: {
              notIn: PROFILE_CHAT_PRODUCT_IDS,
            },
          },
          select: {
            id: true,
            name: true,
            price: true,
            smallDescription: true,
            images: true,
            amenities: true,
            address: true,
            supportRequested: true,
          },
          take: limit,
        })
      );

      setCachedData(cacheKey, {
        title: "Private Suites",
        data: data,
        link: "/products/template",
      });
      return {
        title: "Private Suites",
        data: data,
        link: "/products/template",
      };
    }
    case "uikits": {
      const data = await retryDatabaseOperation(() =>
        prisma.product.findMany({
          where: {
            category: "uikit",
            // Exclude profile chat placeholders
            id: {
              notIn: PROFILE_CHAT_PRODUCT_IDS,
            },
          },
          select: {
            id: true,
            name: true,
            price: true,
            smallDescription: true,
            images: true,
            amenities: true,
            address: true,
            supportRequested: true,
          },
          take: limit,
        })
      );

      setCachedData(cacheKey, {
        title: "Private Rooms",
        data: data,
        link: "/products/template",
      });
      return {
        title: "Private Rooms",
        data: data,
        link: "/products/template",
      };
    }
    case "housemates": {
      // Fetch real housemate profiles from the database
      const housemateProfiles = await retryDatabaseOperation(() =>
        prisma.housemateProfile.findMany({
          where: {
            // Exclude users already shown in previous rows
            userId: {
              notIn: Array.from(shownUserIds)
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
          },
          take: limit,
        })
      );

      // Transform the data to work with AirbnbStyleCard (similar to other categories)
      const transformedProfiles = housemateProfiles.map(profile => {
        // Calculate age range based on date of birth
        const dateOfBirth = extractDateOfBirth(profile.lifestyle);
        const displayAgeRange = dateOfBirth ? calculateAgeRange(dateOfBirth) : (profile.ageRange || undefined);

        // Parse lifestyle data to get education information
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

        // Check if currently attending school
        const isCurrentlyAttending = lifestyleData.education?.stillAttending || false;

        // Check if retired
        const isRetired = lifestyleData.occupationDetails?.isRetired || false;

        // Create detailed occupation display similar to HousemateHorizontalCard
        const getDetailedOccupation = () => {
          // If retired, that takes precedence
          if (isRetired) {
            return "Retired";
          }
          
          // If currently attending, show student info with program if available
          if (isCurrentlyAttending) {
            const program = lifestyleData.education?.degreeProgram;
            if (program) {
              return `Studying ${program}`;
            }
            return "Student";
          }
          
          // Fall back to occupation description or basic occupation
          return lifestyleData.occupationDetails?.description || profile.occupation || undefined;
        };

        return {
          id: profile.user.id, // Use userId as the id for profile links
          name: toTitleCase(profile.user.firstName),
          price: profile.maxBudget || 0,
          smallDescription: profile.bio || 'No bio available',
          images: profile.profilePicture ? [profile.profilePicture] : [],
          // Create amenities array from preferences and lifestyle attributes (not demographics)
          amenities: [
            ...(profile.schedule ? [profile.schedule] : []),
            ...(profile.socialPreference ? [profile.socialPreference] : []),
          ].filter(Boolean).filter(amenity => amenity !== "early-riser" && amenity !== "independent" && amenity !== "social"), // Remove early-riser, independent, and social tags
          // Demographics information
          demographics: {
            ageRange: displayAgeRange,
            gender: profile.gender || undefined,
            occupation: getDetailedOccupation(),
            isCurrentlyAttending: isCurrentlyAttending,
            isRetired: isRetired,
          },
        };
      });

      // Add these user IDs to the shown set to prevent duplicates in later rows
      transformedProfiles.forEach(profile => {
        shownUserIds.add(profile.id);
      });

      setCachedData(cacheKey, {
        data: transformedProfiles,
        title: "Available Helpers in Columbia, MO",
        link: "/products/icon",
        isHousemates: true,
      });
      return {
        data: transformedProfiles,
        title: "Available Helpers in Columbia, MO",
        link: "/products/icon",
        isHousemates: true,
      };
    }
    case "cooking-helpers": {
      // Fetch housemate profiles who can help with cooking
      const housemateProfiles = await retryDatabaseOperation(() =>
        prisma.housemateProfile.findMany({
          where: {
            canHelpWith: {
              path: [],
              array_contains: "cooking"
            },
            // Exclude users already shown in previous rows
            userId: {
              notIn: Array.from(shownUserIds)
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
          },
          take: limit,
        })
      );

      // Transform the data to work with AirbnbStyleCard (similar to other categories)
      const transformedProfiles = housemateProfiles.map(profile => {
        // Calculate age range based on date of birth
        const dateOfBirth = extractDateOfBirth(profile.lifestyle);
        const displayAgeRange = dateOfBirth ? calculateAgeRange(dateOfBirth) : (profile.ageRange || undefined);

        // Parse lifestyle data to get education information
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

        // Check if currently attending school
        const isCurrentlyAttending = lifestyleData.education?.stillAttending || false;

        // Check if retired
        const isRetired = lifestyleData.occupationDetails?.isRetired || false;

        // Create detailed occupation display similar to HousemateHorizontalCard
        const getDetailedOccupation = () => {
          // If retired, that takes precedence
          if (isRetired) {
            return "Retired";
          }
          
          // If currently attending, show student info with program if available
          if (isCurrentlyAttending) {
            const program = lifestyleData.education?.degreeProgram;
            if (program) {
              return `Studying ${program}`;
            }
            return "Student";
          }
          
          // Fall back to occupation description or basic occupation
          return lifestyleData.occupationDetails?.description || profile.occupation || undefined;
        };

        return {
          id: profile.user.id, // Use userId as the id for profile links
          name: toTitleCase(profile.user.firstName),
          price: profile.maxBudget || 0,
          smallDescription: profile.bio || 'No bio available',
          images: profile.profilePicture ? [profile.profilePicture] : [],
          // Create amenities array from preferences and lifestyle attributes (not demographics)
          amenities: [
            ...(profile.schedule ? [profile.schedule] : []),
            ...(profile.socialPreference ? [profile.socialPreference] : []),
          ].filter(Boolean).filter(amenity => amenity !== "early-riser" && amenity !== "independent" && amenity !== "social"), // Remove early-riser, independent, and social tags
          // Demographics information
          demographics: {
            ageRange: displayAgeRange,
            gender: profile.gender || undefined,
            occupation: getDetailedOccupation(),
            isCurrentlyAttending: isCurrentlyAttending,
            isRetired: isRetired,
          },
        };
      });

      // Add these user IDs to the shown set to prevent duplicates in later rows
      transformedProfiles.forEach(profile => {
        shownUserIds.add(profile.id);
      });

      setCachedData(cacheKey, {
        data: transformedProfiles,
        title: "Cooking Helpers in Columbia, MO",
        link: "/products/icon",
        isHousemates: true,
      });
      return {
        data: transformedProfiles,
        title: "Cooking Helpers in Columbia, MO",
        link: "/products/icon",
        isHousemates: true,
      };
    }
    case "pet-helpers": {
      // Fetch housemate profiles who can help with pet care
      const housemateProfiles = await retryDatabaseOperation(() =>
        prisma.housemateProfile.findMany({
          where: {
            canHelpWith: {
              path: [],
              array_contains: "petCare"
            },
            // Exclude users already shown in previous rows
            userId: {
              notIn: Array.from(shownUserIds)
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
          },
          take: limit,
        })
      );

      // Transform the data to work with AirbnbStyleCard (similar to other categories)
      const transformedProfiles = housemateProfiles.map(profile => {
        // Calculate age range based on date of birth
        const dateOfBirth = extractDateOfBirth(profile.lifestyle);
        const displayAgeRange = dateOfBirth ? calculateAgeRange(dateOfBirth) : (profile.ageRange || undefined);

        // Parse lifestyle data to get education information
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

        // Check if currently attending school
        const isCurrentlyAttending = lifestyleData.education?.stillAttending || false;

        // Check if retired
        const isRetired = lifestyleData.occupationDetails?.isRetired || false;

        // Create detailed occupation display similar to HousemateHorizontalCard
        const getDetailedOccupation = () => {
          // If retired, that takes precedence
          if (isRetired) {
            return "Retired";
          }
          
          // If currently attending, show student info with program if available
          if (isCurrentlyAttending) {
            const program = lifestyleData.education?.degreeProgram;
            if (program) {
              return `Studying ${program}`;
            }
            return "Student";
          }
          
          // Fall back to occupation description or basic occupation
          return lifestyleData.occupationDetails?.description || profile.occupation || undefined;
        };

        return {
          id: profile.user.id, // Use userId as the id for profile links
          name: toTitleCase(profile.user.firstName),
          price: profile.maxBudget || 0,
          smallDescription: profile.bio || 'No bio available',
          images: profile.profilePicture ? [profile.profilePicture] : [],
          // Create amenities array from preferences and lifestyle attributes (not demographics)
          amenities: [
            ...(profile.schedule ? [profile.schedule] : []),
            ...(profile.socialPreference ? [profile.socialPreference] : []),
          ].filter(Boolean).filter(amenity => amenity !== "early-riser" && amenity !== "independent" && amenity !== "social"), // Remove early-riser, independent, and social tags
          // Demographics information
          demographics: {
            ageRange: displayAgeRange,
            gender: profile.gender || undefined,
            occupation: getDetailedOccupation(),
            isCurrentlyAttending: isCurrentlyAttending,
            isRetired: isRetired,
          },
        };
      });

      // Add these user IDs to the shown set to prevent duplicates in later rows
      transformedProfiles.forEach(profile => {
        shownUserIds.add(profile.id);
      });

      setCachedData(cacheKey, {
        data: transformedProfiles,
        title: "Pet-Friendly Helpers in Columbia, MO",
        link: "/products/icon",
        isHousemates: true,
      });
      return {
        data: transformedProfiles,
        title: "Pet-Friendly Helpers in Columbia, MO",
        link: "/products/icon",
        isHousemates: true,
      };
    }
    case "errands-helpers": {
      // Fetch housemate profiles who can help with errands or transportation
      const housemateProfiles = await retryDatabaseOperation(() =>
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
            ],
            // Exclude users already shown in previous rows
            userId: {
              notIn: Array.from(shownUserIds)
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
          },
          take: limit,
        })
      );

      // Transform the data to work with AirbnbStyleCard (similar to other categories)
      const transformedProfiles = housemateProfiles.map(profile => {
        // Calculate age range based on date of birth
        const dateOfBirth = extractDateOfBirth(profile.lifestyle);
        const displayAgeRange = dateOfBirth ? calculateAgeRange(dateOfBirth) : (profile.ageRange || undefined);

        // Parse lifestyle data to get education information
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

        // Check if currently attending school
        const isCurrentlyAttending = lifestyleData.education?.stillAttending || false;

        // Check if retired
        const isRetired = lifestyleData.occupationDetails?.isRetired || false;

        // Create detailed occupation display similar to HousemateHorizontalCard
        const getDetailedOccupation = () => {
          // If retired, that takes precedence
          if (isRetired) {
            return "Retired";
          }
          
          // If currently attending, show student info with program if available
          if (isCurrentlyAttending) {
            const program = lifestyleData.education?.degreeProgram;
            if (program) {
              return `Studying ${program}`;
            }
            return "Student";
          }
          
          // Fall back to occupation description or basic occupation
          return lifestyleData.occupationDetails?.description || profile.occupation || undefined;
        };

        return {
          id: profile.user.id, // Use userId as the id for profile links
          name: toTitleCase(profile.user.firstName),
          price: profile.maxBudget || 0,
          smallDescription: profile.bio || 'No bio available',
          images: profile.profilePicture ? [profile.profilePicture] : [],
          // Create amenities array from preferences and lifestyle attributes (not demographics)
          amenities: [
            ...(profile.schedule ? [profile.schedule] : []),
            ...(profile.socialPreference ? [profile.socialPreference] : []),
          ].filter(Boolean).filter(amenity => amenity !== "early-riser" && amenity !== "independent" && amenity !== "social"), // Remove early-riser, independent, and social tags
          // Demographics information
          demographics: {
            ageRange: displayAgeRange,
            gender: profile.gender || undefined,
            occupation: getDetailedOccupation(),
            isCurrentlyAttending: isCurrentlyAttending,
            isRetired: isRetired,
          },
        };
      });

      // Add these user IDs to the shown set to prevent duplicates in later rows
      transformedProfiles.forEach(profile => {
        shownUserIds.add(profile.id);
      });

      setCachedData(cacheKey, {
        data: transformedProfiles,
        title: "Errands & Driving Helpers in Columbia, MO",
        link: "/products/icon",
        isHousemates: true,
      });
      return {
        data: transformedProfiles,
        title: "Errands & Driving Helpers in Columbia, MO",
        link: "/products/icon",
        isHousemates: true,
      };
    }
    default: {
      return notFound();
    }
  }
}

export function AirbnbStyleRow({ category, limit }: iAppProps) {
  return (
    <section className="mt-2">
      <Suspense fallback={<LoadingState limit={limit} />}>
        <LoadRows category={category} limit={limit} />
      </Suspense>
    </section>
  );
}

async function LoadRows({ category, limit }: iAppProps) {
  try {
    const data = await getData({ category, limit });
    
    return (
      <>
        <div className="mb-4">
          <Link
            href={data.link}
            className="inline-flex items-center gap-3 hover:gap-4 transition-all duration-200 group cursor-pointer"
          >
            <h2 className="text-2xl font-bold text-gray-900 group-hover:text-gray-700 transition-colors duration-200">
              {data.title}
            </h2>
            <ChevronRight 
              size={32} 
              className="text-gray-600 group-hover:text-gray-800 group-hover:translate-x-1 transition-all duration-200" 
            />
          </Link>
        </div>

        {/* Mobile: Horizontal scroll, Desktop: Flex wrap */}
        <div className="flex gap-3.5 overflow-x-auto scrollbar-hide pb-4 sm:flex sm:flex-wrap sm:gap-3.5 sm:overflow-x-visible sm:pb-0">
          {data.data.map((product) => (
            <div key={product.id} className={`flex-shrink-0 w-[260px] md:w-[300px] ${data.isHousemates ? "h-[420px]" : ""}`}>
              <AirbnbStyleCard
                images={product.images}
                id={product.id}
                name={product.name}
                price={product.price}
                smallDescription={product.smallDescription}
                amenities={
                  Array.isArray(product.amenities) 
                    ? (product.amenities as string[])
                    : []
                }
                supportRequested={product.supportRequested}
                linkPath={data.isHousemates ? `/profile/${product.id}` : undefined}
                location={data.isHousemates ? "Seeking housing" : product.address}
                availabilityText={data.isHousemates ? "Looking for housing" : undefined}
                priceLabel={data.isHousemates ? "budget" : undefined}
                demographics={data.isHousemates ? (product as any).demographics : undefined}
              />
            </div>
          ))}
        </div>
      </>
    );
  } catch (error) {
    console.error(`Error loading data for category ${category}:`, error);
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">Unable to load data at this time. Please try again later.</p>
        <button 
          onClick={() => window.location.reload()} 
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Retry
        </button>
      </div>
    );
  }
}

function LoadingState({ limit = 4 }: { limit?: number }) {
  return (
    <div>
      <div className="mb-6">
        <div className="inline-flex items-center gap-2">
          <Skeleton className="h-8 w-56" />
          <Skeleton className="h-5 w-5 rounded" />
        </div>
      </div>
      <div className="flex gap-3.5 overflow-x-auto scrollbar-hide pb-4 sm:flex sm:flex-wrap sm:gap-3.5 sm:overflow-x-visible sm:pb-0">
        {[...Array(limit)].map((_, index) => (
          <div key={index} className="flex-shrink-0 w-[260px] md:w-[300px]">
            <LoadingAirbnbCard />
          </div>
        ))}
      </div>
    </div>
  );
} 