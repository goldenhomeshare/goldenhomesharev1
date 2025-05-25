import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/lib/db";
import { type CategoryTypes } from "@prisma/client";

// Special product ID for profile-based chats (should be excluded from listings)
const PROFILE_CHAT_PRODUCT_ID = "profile-chat-placeholder";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const category = searchParams.get('category');

    if (!category) {
      return NextResponse.json({ error: 'Category parameter is required' }, { status: 400 });
    }

    // Handle housemate profiles for 'icon' category
    if (category === 'icon') {
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
        }
      });

      // Transform the data to match the expected format
      const transformedProfiles = housemateProfiles.map(profile => ({
        id: profile.user.id,
        name: `${profile.user.firstName} ${profile.user.lastName}`,
        price: profile.maxBudget || 0,
        smallDescription: profile.bio || 'No bio available',
        images: profile.profilePicture ? [profile.profilePicture] : [],
        // Additional housemate-specific data
        occupation: profile.occupation,
        gender: profile.gender,
        ageRange: profile.ageRange,
        schedule: profile.schedule,
        socialPreference: profile.socialPreference,
        hobbies: profile.hobbies,
        preferredGender: profile.preferredGender,
        socialMedia: profile.socialMedia,
        lifestyle: profile.lifestyle,
        email: profile.user.email,
        userId: profile.user.id,
      }));

      return NextResponse.json(transformedProfiles);
    }

    let input: CategoryTypes | undefined;

    switch (category) {
      case "template": {
        input = "template";
        break;
      }
      case "uikit": {
        input = "uikit";
        break;
      }
      case "all": {
        input = undefined;
        break;
      }
      default: {
        return NextResponse.json({ error: 'Invalid category' }, { status: 400 });
      }
    }

    const data = await prisma.product.findMany({
      where: {
        ...(input ? { category: input } : {}),
        // Exclude the profile chat placeholder from all listings
        id: {
          not: PROFILE_CHAT_PRODUCT_ID,
        },
      },
      select: {
        price: true,
        name: true,
        smallDescription: true,
        category: true,
        images: true,
        id: true,
        address: true,
        amenities: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching data:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 