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
    const { homeownerId, housemateId, contextProductId } = body;

    if (!homeownerId || !housemateId) {
      return NextResponse.json({ error: "Missing required user IDs" }, { status: 400 });
    }

    // First, check if ANY chat room exists between these two users
    let existingChatRoom = await prisma.chatRoom.findFirst({
      where: {
        homeownerId,
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
        product: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    // If we found an existing chat room, return it
    if (existingChatRoom) {
      // Update the chat room to reference the current context if provided
      if (contextProductId && existingChatRoom.productId !== contextProductId) {
        await prisma.chatRoom.update({
          where: { id: existingChatRoom.id },
          data: { productId: contextProductId },
        });
      }

      return NextResponse.json({
        chatRoom: {
          id: existingChatRoom.id,
          productId: existingChatRoom.productId,
          homeownerId: existingChatRoom.homeownerId,
          housemateId: existingChatRoom.housemateId,
        },
        messages: existingChatRoom.messages,
        wasExisting: true,
      });
    }

    // No existing chat room found, create a new one
    const productId = contextProductId || "general"; // Use context or default to general
    
    const newChatRoom = await prisma.chatRoom.create({
      data: {
        productId,
        homeownerId,
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
        product: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return NextResponse.json({
      chatRoom: {
        id: newChatRoom.id,
        productId: newChatRoom.productId,
        homeownerId: newChatRoom.homeownerId,
        housemateId: newChatRoom.housemateId,
      },
      messages: newChatRoom.messages,
      wasExisting: false,
    });
  } catch (error) {
    console.error("Error creating or finding unified chat room:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
} 