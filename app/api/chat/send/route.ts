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
    const { chatRoomId, content, senderId } = body;

    if (!chatRoomId || !content || !senderId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Verify user can send messages to this chat room
    const chatRoom = await prisma.chatRoom.findFirst({
      where: {
        id: chatRoomId,
        OR: [
          { homeownerId: user.id },
          { housemateId: user.id },
        ],
      },
    });

    if (!chatRoom) {
      return NextResponse.json({ error: "Chat room not found or access denied" }, { status: 404 });
    }

    // Create the message
    const message = await prisma.message.create({
      data: {
        content,
        senderId,
        chatRoomId,
      },
      include: {
        sender: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    // Update chat room's lastMessageAt
    await prisma.chatRoom.update({
      where: { id: chatRoomId },
      data: { lastMessageAt: new Date() },
    });

    return NextResponse.json({ message });
  } catch (error) {
    console.error("Error sending message:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
} 