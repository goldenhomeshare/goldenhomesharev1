import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import prisma from "@/app/lib/db";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const chatRoom = await prisma.chatRoom.findFirst({
      where: {
        id: id,
        OR: [
          { homeownerId: user.id },
          { housemateId: user.id }
        ]
      },
      include: {
        homeowner: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            profileImage: true,
            homeownerProfile: {
              select: {
                profilePicture: true,
              },
            },
          },
        },
        housemate: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            profileImage: true,
            housemateProfile: {
              select: {
                profilePicture: true,
              },
            },
          },
        },
        product: {
          select: {
            id: true,
            name: true,
            images: true,
          },
        },
        messages: {
          orderBy: {
            createdAt: "desc",
          },
          take: 50, // Limit to last 50 messages for mobile performance
          include: {
            sender: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                profileImage: true,
                homeownerProfile: {
                  select: {
                    profilePicture: true,
                  },
                },
                housemateProfile: {
                  select: {
                    profilePicture: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!chatRoom) {
      return NextResponse.json({ error: "Chat room not found" }, { status: 404 });
    }

    // Reverse messages to show oldest first (since we took desc from DB)
    chatRoom.messages = chatRoom.messages.reverse();

    // Transform data to use uploaded profile pictures
    const transformedChatRoom = {
      ...chatRoom,
      homeowner: {
        ...chatRoom.homeowner,
        profileImage: chatRoom.homeowner.homeownerProfile?.profilePicture || chatRoom.homeowner.profileImage,
      },
      housemate: {
        ...chatRoom.housemate,
        profileImage: chatRoom.housemate.housemateProfile?.profilePicture || chatRoom.housemate.profileImage,
      },
      messages: chatRoom.messages.map(message => ({
        ...message,
        sender: {
          ...message.sender,
          profileImage: message.sender.homeownerProfile?.profilePicture || 
                       message.sender.housemateProfile?.profilePicture || 
                       message.sender.profileImage,
        },
      })),
    };

    return NextResponse.json(transformedChatRoom);
  } catch (error) {
    console.error("Error fetching chat room:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 