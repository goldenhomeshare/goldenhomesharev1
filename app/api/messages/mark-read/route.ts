import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import prisma from "@/app/lib/db";

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { chatRoomId } = await request.json();

    if (!chatRoomId) {
      return NextResponse.json({ error: "Chat room ID is required" }, { status: 400 });
    }

    // Verify user has access to this chat room
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

    // Mark all unread messages in this chat room as read (except user's own messages)
    await prisma.message.updateMany({
      where: {
        chatRoomId: chatRoomId,
        senderId: {
          not: user.id, // Don't mark own messages as read
        },
        isRead: false,
      },
      data: {
        isRead: true,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error marking messages as read:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 