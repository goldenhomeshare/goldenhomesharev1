import { notFound } from "next/navigation";
import prisma from "../lib/db";
import { AirbnbStyleCard, LoadingAirbnbCard } from "./AirbnbStyleCard";
import Link from "next/link";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { ChevronRight } from "lucide-react";
import { calculateAgeRange, extractDateOfBirth } from "@/lib/age-utils";

// Special product ID for profile-based chats (should be excluded from listings)
const PROFILE_CHAT_PRODUCT_ID = "profile-chat-placeholder";

interface iAppProps {
  category: "newest" | "templates" | "uikits" | "icons" | "rooms" | "housemates";
}

interface ProductData {
  id: string;
  name: string;
  price: number;
  smallDescription: string;
  images: string[];
  amenities?: any;
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

async function getData({ category }: iAppProps): Promise<GetDataResult> {
  switch (category) {
    case "rooms": {
      // Combine all room types (templates, uikits, icons) into one category
      const data = await prisma.product.findMany({
        where: {
          category: {
            in: ["template", "uikit", "icon"]
          },
          // Exclude the profile chat placeholder
          id: {
            not: PROFILE_CHAT_PRODUCT_ID,
          },
        },
        select: {
          price: true,
          name: true,
          smallDescription: true,
          id: true,
          images: true,
          amenities: true,
        },
        take: 8, // Show more since we're combining categories
      });

      return {
        data: data,
        title: "Rooms Available",
        link: "/products/template",
      };
    }
    case "icons": {
      const data = await prisma.product.findMany({
        where: {
          category: "icon",
          // Exclude the profile chat placeholder
          id: {
            not: PROFILE_CHAT_PRODUCT_ID,
          },
        },
        select: {
          price: true,
          name: true,
          smallDescription: true,
          id: true,
          images: true,
          amenities: true,
        },
        take: 4,
      });

      return {
        data: data,
        title: "ADUs",
        link: "/products/template",
      };
    }
    case "newest": {
      const data = await prisma.product.findMany({
        where: {
          // Exclude the profile chat placeholder
          id: {
            not: PROFILE_CHAT_PRODUCT_ID,
          },
        },
        select: {
          price: true,
          name: true,
          smallDescription: true,
          id: true,
          images: true,
          amenities: true,
        },
        orderBy: {
          createdAt: "desc",
        },
        take: 4,
      });

      return {
        data: data,
        title: "Newest Listings",
        link: "/products/template",
      };
    }
    case "templates": {
      const data = await prisma.product.findMany({
        where: {
          category: "template",
          // Exclude the profile chat placeholder
          id: {
            not: PROFILE_CHAT_PRODUCT_ID,
          },
        },
        select: {
          id: true,
          name: true,
          price: true,
          smallDescription: true,
          images: true,
          amenities: true,
        },
        take: 4,
      });

      return {
        title: "Private Suites",
        data: data,
        link: "/products/template",
      };
    }
    case "uikits": {
      const data = await prisma.product.findMany({
        where: {
          category: "uikit",
          // Exclude the profile chat placeholder
          id: {
            not: PROFILE_CHAT_PRODUCT_ID,
          },
        },
        select: {
          id: true,
          name: true,
          price: true,
          smallDescription: true,
          images: true,
          amenities: true,
        },
        take: 4,
      });

      return {
        title: "Private Rooms",
        data: data,
        link: "/products/template",
      };
    }
    case "housemates": {
      // Fetch real housemate profiles from the database
      const housemateProfiles = await prisma.housemateProfile.findMany({
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
        take: 4,
      });

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

        return {
          id: profile.user.id, // Use userId as the id for profile links
          name: `${profile.user.firstName} ${profile.user.lastName?.charAt(0) || ''}.`,
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
            age: displayAgeRange,
            gender: profile.gender || undefined,
            occupation: profile.occupation || undefined,
            isCurrentlyAttending: isCurrentlyAttending,
            isRetired: isRetired,
          },
        };
      });

      return {
        data: transformedProfiles,
        title: "Available Housemates",
        link: "/products/icon",
        isHousemates: true,
      };
    }
    default: {
      return notFound();
    }
  }
}

export function AirbnbStyleRow({ category }: iAppProps) {
  return (
    <section className="mt-16">
      <Suspense fallback={<LoadingState />}>
        <LoadRows category={category} />
      </Suspense>
    </section>
  );
}

async function LoadRows({ category }: iAppProps) {
  const data = await getData({ category: category });
  
  return (
    <>
      <div className="mb-6">
        <Link
          href={data.link}
          className="inline-flex items-center gap-2 hover:gap-3 transition-all duration-200 group cursor-pointer"
        >
          <h2 className="text-2xl font-bold text-gray-900 group-hover:text-gray-700 transition-colors duration-200">
            {data.title}
          </h2>
          <ChevronRight 
            size={20} 
            className="text-gray-600 group-hover:text-gray-800 group-hover:translate-x-1 transition-all duration-200" 
          />
        </Link>
      </div>

      {/* Mobile: Horizontal scroll, Desktop: Grid */}
      <div className="flex gap-6 overflow-x-auto scrollbar-hide pb-4 sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 sm:overflow-x-visible sm:pb-0">
        {data.data.map((product) => (
          <div key={product.id} className={`flex-shrink-0 w-[280px] sm:w-auto ${data.isHousemates ? "h-[420px]" : "h-[450px]"}`}>
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
              linkPath={data.isHousemates ? `/profile/${product.id}` : undefined}
              location={data.isHousemates ? "Seeking housing" : undefined}
              availabilityText={data.isHousemates ? "Looking for housing" : undefined}
              priceLabel={data.isHousemates ? "budget" : undefined}
              demographics={data.isHousemates ? (product as any).demographics : undefined}
            />
          </div>
        ))}
      </div>
    </>
  );
}

function LoadingState() {
  return (
    <div>
      <div className="mb-6">
        <div className="inline-flex items-center gap-2">
          <Skeleton className="h-8 w-56" />
          <Skeleton className="h-5 w-5 rounded" />
        </div>
      </div>
      <div className="flex gap-6 overflow-x-auto scrollbar-hide pb-4 sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 sm:overflow-x-visible sm:pb-0">
        {[...Array(4)].map((_, index) => (
          <div key={index} className="flex-shrink-0 w-[280px] sm:w-auto h-[450px]">
            <LoadingAirbnbCard />
          </div>
        ))}
      </div>
    </div>
  );
} 