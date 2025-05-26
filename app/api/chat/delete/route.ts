import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/lib/db";
import { getCurrentUser } from "@/lib/auth";

export async function DELETE(request: NextRequest) {
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

    // Verify the user is part of this chat room
    const chatRoom = await prisma.chatRoom.findUnique({
      where: { id: chatRoomId },
      select: { 
        homeownerId: true, 
        housemateId: true 
      }
    });

    if (!chatRoom || (chatRoom.homeownerId !== user.id && chatRoom.housemateId !== user.id)) {
      return NextResponse.json({ error: "Chat room not found or unauthorized" }, { status: 404 });
    }

    // Use a transaction to ensure all deletions happen atomically
    await prisma.$transaction(async (tx) => {
      // With cascade deletes in place, deleting the chat room will automatically delete messages
      await tx.chatRoom.delete({
        where: { id: chatRoomId }
      });
    });

    return NextResponse.json({ message: "Chat room deleted successfully" });
  } catch (error) {
    console.error("Error deleting chat room:", error);
    return NextResponse.json(
      { error: "Failed to delete chat room" },
      { status: 500 }
    );
  }
} 