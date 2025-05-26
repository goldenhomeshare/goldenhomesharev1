import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import prisma from "@/app/lib/db";

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userType = (user as any).userType;
    
    if (!userType || userType === "ADMIN") {
      return NextResponse.json({ count: 0 });
    }

    // Get unread message count based on user type
    let unreadCount = 0;

    if (userType === "HOMEOWNER") {
      // Count unread messages in chat rooms where user is the homeowner
      unreadCount = await prisma.message.count({
        where: {
          chatRoom: {
            homeownerId: user.id,
            hiddenByHomeowner: false,
          },
          senderId: {
            not: user.id, // Don't count own messages
          },
          isRead: false,
        },
      });
    } else if (userType === "HOUSEMATE") {
      // Count unread messages in chat rooms where user is the housemate
      unreadCount = await prisma.message.count({
        where: {
          chatRoom: {
            housemateId: user.id,
            hiddenByHousemate: false,
          },
          senderId: {
            not: user.id, // Don't count own messages
          },
          isRead: false,
        },
      });
    }

    return NextResponse.json({ count: unreadCount });
  } catch (error) {
    console.error("Error fetching unread count:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 