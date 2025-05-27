import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import prisma from "@/app/lib/db";

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const chatRoomId = searchParams.get("chatRoomId");

    if (!chatRoomId) {
      return NextResponse.json({ error: "Chat room ID is required" }, { status: 400 });
    }

    // Verify user has access to this chat room
    const chatRoom = await prisma.chatRoom.findFirst({
      where: {
        id: chatRoomId,
        OR: [
          { homeownerId: user.id },
          { housemateId: user.id }
        ]
      }
    });

    if (!chatRoom) {
      return NextResponse.json({ error: "Chat room not found or access denied" }, { status: 404 });
    }

    // Get messages for this chat room
    const messages = await prisma.message.findMany({
      where: {
        chatRoomId: chatRoomId,
      },
      include: {
        sender: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            profileImage: true,
          },
        },
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    return NextResponse.json(messages);
  } catch (error) {
    console.error("Error fetching messages:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
} 