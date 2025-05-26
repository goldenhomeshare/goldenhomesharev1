import { getCurrentUser } from "@/lib/auth";
import prisma from "@/app/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { chatRoomId, userType, hidden } = await request.json();

    if (!chatRoomId || !userType || typeof hidden !== 'boolean') {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Verify the user has access to this chat room
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
      return NextResponse.json({ error: "Chat room not found" }, { status: 404 });
    }

    // Update the appropriate hidden field based on user type
    const updateData: any = {};
    
    if (userType === 'HOMEOWNER' && chatRoom.homeownerId === user.id) {
      updateData.hiddenByHomeowner = hidden;
      updateData.homeownerHiddenAt = hidden ? new Date() : null;
    } else if (userType === 'HOUSEMATE' && chatRoom.housemateId === user.id) {
      updateData.hiddenByHousemate = hidden;
      updateData.housemateHiddenAt = hidden ? new Date() : null;
    } else {
      return NextResponse.json({ error: "Unauthorized to modify this conversation" }, { status: 403 });
    }

    await prisma.chatRoom.update({
      where: { id: chatRoomId },
      data: updateData
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error toggling conversation visibility:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
} 