import { getCurrentUser } from "@/lib/auth";
import prisma from "@/app/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { checkMessagingPermissions } from "@/app/lib/messaging-permissions";

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
    const { productId, hostId, housemateId } = body;

    if (!productId || !hostId || !housemateId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Check if ANY chat room already exists between these users (unified approach)
    let chatRoom = await prisma.chatRoom.findFirst({
      where: {
        homeownerId: hostId,
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
          orderBy: {
            createdAt: "asc",
          },
        },
      },
    });

    // Create chat room if it doesn't exist, or update existing one with current product context
    if (!chatRoom) {
      chatRoom = await prisma.chatRoom.create({
        data: {
          productId,
          homeownerId: hostId,
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
            orderBy: {
              createdAt: "asc",
            },
          },
        },
      });
    } else if (chatRoom.productId !== productId) {
      // Update existing chat room to reflect current product context
      chatRoom = await prisma.chatRoom.update({
        where: { id: chatRoom.id },
        data: { productId },
        include: {
          messages: {
            include: {
              sender: {
                select: {
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
            orderBy: {
              createdAt: "asc",
            },
          },
        },
      });
    }

    // Transform messages to use uploaded profile picture if available, fallback to Google profile image
    const transformedMessages = chatRoom.messages.map(message => ({
      ...message,
      sender: {
        ...message.sender,
        profileImage: message.sender.homeownerProfile?.profilePicture || 
                     message.sender.housemateProfile?.profilePicture || 
                     message.sender.profileImage,
      },
    }));

    return NextResponse.json({
      chatRoom: {
        id: chatRoom.id,
        productId: chatRoom.productId,
        homeownerId: chatRoom.homeownerId,
        housemateId: chatRoom.housemateId,
      },
      messages: transformedMessages,
    });
  } catch (error) {
    console.error("Error managing chat room:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
} 