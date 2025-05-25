import { notFound } from "next/navigation";
import prisma from "../lib/db";
import { AirbnbStyleCard, LoadingAirbnbCard } from "./AirbnbStyleCard";
import Link from "next/link";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { ChevronRight } from "lucide-react";

// Special product ID for profile-based chats (should be excluded from listings)
const PROFILE_CHAT_PRODUCT_ID = "profile-chat-placeholder";

interface iAppProps {
  category: "newest" | "templates" | "uikits" | "icons" | "rooms" | "housemates";
}

async function getData({ category }: iAppProps) {
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
      // For now, create placeholder data for housemates searching for rooms
      // This will be replaced with actual housemate profile data later
      const placeholderHousemates = [
        {
          id: "housemate-1",
          name: "Looking for housemates...",
          price: 0,
          smallDescription: "Connect with potential housemates",
          images: ["/placeholder-house.svg"],
          amenities: ["friendly", "clean", "quiet"]
        },
        {
          id: "housemate-2", 
          name: "Coming soon...",
          price: 0,
          smallDescription: "Housemate profiles will appear here",
          images: ["/placeholder-house.svg"],
          amenities: ["verified", "background-checked"]
        },
        {
          id: "housemate-3",
          name: "Find your match",
          price: 0,
          smallDescription: "Browse compatible housemate profiles",
          images: ["/placeholder-house.svg"],
          amenities: ["compatible", "reliable"]
        },
        {
          id: "housemate-4",
          name: "Safe connections",
          price: 0,
          smallDescription: "All profiles are verified and screened",
          images: ["/placeholder-house.svg"],
          amenities: ["verified", "safe", "trusted"]
        }
      ];

      return {
        data: placeholderHousemates,
        title: "Housemates Searching",
        link: "/products/icon", // This links to the existing housemate profiles page
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

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {data.data.map((product) => (
          <div key={product.id} className="h-[450px]">
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[...Array(4)].map((_, index) => (
          <div key={index} className="h-[450px]">
            <LoadingAirbnbCard />
          </div>
        ))}
      </div>
    </div>
  );
} 