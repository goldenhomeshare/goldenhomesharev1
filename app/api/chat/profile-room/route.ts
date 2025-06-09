import { getCurrentUser } from "@/lib/auth";
import prisma from "@/app/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { checkMessagingPermissions } from "@/app/lib/messaging-permissions";

// Special product ID for profile-based chats (not tied to a specific property)
const PROFILE_CHAT_PRODUCT_ID = "profile-chat-placeholder";

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    
    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    // Check messaging permissions
    const permissionCheck = await checkMessagingPermissions(user.id);
    if (!permissionCheck.canMessage) {
      return NextResponse.json({ 
        error: "Messaging not allowed", 
        reason: permissionCheck.reason,
        needsApproval: permissionCheck.needsApproval 
      }, { status: 403 });
    }

    const body = await request.json();
    const { homeownerId, housemateId } = body;

    if (!homeownerId || !housemateId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Verify the current user is either the homeowner or housemate
    if (user.id !== homeownerId && user.id !== housemateId) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    // Use upsert to ensure the placeholder product exists (more efficient)
    await prisma.product.upsert({
      where: { id: PROFILE_CHAT_PRODUCT_ID },
      update: {},
      create: {
        id: PROFILE_CHAT_PRODUCT_ID,
        name: "Profile Chat",
        price: 0,
        smallDescription: "Profile-based messaging system",
        description: { type: "profile-chat" },
        images: [],
        productFile: "",
        category: "icon",
      },
    });

    // Check if ANY chat room already exists between these users (unified approach)
    let chatRoom = await prisma.chatRoom.findFirst({
      where: {
        homeownerId,
        housemateId,
      },
      select: {
        id: true,
        homeownerId: true,
        housemateId: true,
        productId: true,
        messages: {
          select: {
            id: true,
            content: true,
            senderId: true,
            createdAt: true,
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
          take: 50, // Limit initial messages for better performance
        },
      },
    });

    // Create chat room if it doesn't exist, using profile context
    if (!chatRoom) {
      chatRoom = await prisma.chatRoom.create({
        data: {
          homeownerId,
          housemateId,
          productId: PROFILE_CHAT_PRODUCT_ID,
        },
        select: {
          id: true,
          homeownerId: true,
          housemateId: true,
          productId: true,
          messages: {
            select: {
              id: true,
              content: true,
              senderId: true,
              createdAt: true,
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
        homeownerId: chatRoom.homeownerId,
        housemateId: chatRoom.housemateId,
        productId: chatRoom.productId,
      },
      messages: chatRoom.messages,
    });
  } catch (error) {
    console.error("Error managing profile chat room:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
} 