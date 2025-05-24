import { getCurrentUser } from "@/lib/auth";
import prisma from "@/app/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    
    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const body = await request.json();
    const { productId, hostId, housemateId } = body;

    if (!productId || !hostId || !housemateId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Check if chat room already exists
    let chatRoom = await prisma.chatRoom.findFirst({
      where: {
        productId,
        homeownerId: hostId,
        housemateId,
      },
      include: {
        messages: {
          include: {
            sender: {
              select: {
                firstName: true,
                lastName: true,
                profileImage: true,
              },
            },
          },
          orderBy: {
            createdAt: "asc",
          },
        },
      },
    });

    // Create chat room if it doesn't exist
    if (!chatRoom) {
      chatRoom = await prisma.chatRoom.create({
        data: {
          productId,
          homeownerId: hostId,
          housemateId,
        },
        include: {
          messages: {
            include: {
              sender: {
                select: {
                  firstName: true,
                  lastName: true,
                  profileImage: true,
                },
              },
            },
            orderBy: {
              createdAt: "asc",
            },
          },
        },
      });
    }

    return NextResponse.json({
      chatRoom: {
        id: chatRoom.id,
        productId: chatRoom.productId,
        homeownerId: chatRoom.homeownerId,
        housemateId: chatRoom.housemateId,
      },
      messages: chatRoom.messages,
    });
  } catch (error) {
    console.error("Error managing chat room:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
} 