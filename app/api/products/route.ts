import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/lib/db";
import { type CategoryTypes } from "@prisma/client";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const category = searchParams.get('category');

    if (!category) {
      return NextResponse.json({ error: 'Category parameter is required' }, { status: 400 });
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
      case "icon": {
        input = "icon";
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
        category: input,
      },
      select: {
        id: true,
        images: true,
        smallDescription: true,
        name: true,
        price: true,
        address: true,
        amenities: true,
      },
    });

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 