import { getCurrentUser } from "@/lib/auth";
import prisma from "@/app/lib/db";
import { NextRequest, NextResponse } from "next/server";

// Special product ID for profile-based chats (not tied to a specific property)
const PROFILE_CHAT_PRODUCT_ID = "profile-chat-placeholder";

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    
    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const body = await request.json();
    const { recipientId, content, senderId } = body;

    if (!recipientId || !content?.trim() || !senderId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Verify the sender is the current user
    if (user.id !== senderId) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    // Validate message length
    if (content.trim().length > 500) {
      return NextResponse.json({ error: "Message too long" }, { status: 400 });
    }

    // Determine who is the homeowner and who is the housemate
    const currentUserType = (user as any).userType;
    let homeownerId: string;
    let housemateId: string;

    if (currentUserType === "HOMEOWNER") {
      homeownerId = senderId;
      housemateId = recipientId;
    } else {
      // For now, assume the recipient is a homeowner if the sender is not
      homeownerId = recipientId;
      housemateId = senderId;
    }

    // Ensure the placeholder product exists (upsert is more efficient)
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

    // Get or create chat room with a single transaction for better performance
    const result = await prisma.$transaction(async (tx) => {
      // Try to find existing chat room
      let chatRoom = await tx.chatRoom.findFirst({
        where: {
          homeownerId,
          housemateId,
          productId: PROFILE_CHAT_PRODUCT_ID,
        },
        select: { id: true },
      });

      // Create if doesn't exist
      if (!chatRoom) {
        chatRoom = await tx.chatRoom.create({
          data: {
            homeownerId,
            housemateId,
            productId: PROFILE_CHAT_PRODUCT_ID,
          },
          select: { id: true },
        });
      }

      // Create the message
      const message = await tx.message.create({
        data: {
          content: content.trim(),
          senderId,
          chatRoomId: chatRoom.id,
        },
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
      });

      // Update chat room's lastMessageAt
      await tx.chatRoom.update({
        where: { id: chatRoom.id },
        data: { lastMessageAt: new Date() },
      });

      return { chatRoom, message };
    });

    return NextResponse.json({ 
      message: result.message,
      chatRoomId: result.chatRoom.id,
      success: true 
    });
  } catch (error) {
    console.error("Error sending profile message:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
} 