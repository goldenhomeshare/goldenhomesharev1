import { getCurrentUser } from "@/lib/auth";
import prisma from "@/app/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    
    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    // Find all chat rooms grouped by user pairs
    const allChatRooms = await prisma.chatRoom.findMany({
      include: {
        messages: {
          orderBy: {
            createdAt: "asc",
          },
        },
      },
      orderBy: {
        createdAt: "asc", // Older rooms first
      },
    });

    const consolidationResults = [];
    const processedPairs = new Set<string>();

    // Group chat rooms by user pair
    const userPairGroups = new Map<string, any[]>();
    
    for (const room of allChatRooms) {
      const pairKey = `${room.homeownerId}-${room.housemateId}`;
      if (!userPairGroups.has(pairKey)) {
        userPairGroups.set(pairKey, []);
      }
      userPairGroups.get(pairKey)!.push(room);
    }

    // Process each user pair that has multiple chat rooms
    for (const [pairKey, rooms] of userPairGroups) {
      if (rooms.length <= 1) continue; // Skip pairs with only one room
      
      if (processedPairs.has(pairKey)) continue;
      processedPairs.add(pairKey);

      // Keep the oldest room (first created) as the primary conversation
      const primaryRoom = rooms[0];
      const duplicateRooms = rooms.slice(1);

      let totalMessagesMoved = 0;
      const duplicateRoomIds: string[] = [];

      // Move all messages from duplicate rooms to the primary room
      for (const duplicateRoom of duplicateRooms) {
        if (duplicateRoom.messages.length > 0) {
          // Update all messages to point to the primary room
          await prisma.message.updateMany({
            where: {
              chatRoomId: duplicateRoom.id,
            },
            data: {
              chatRoomId: primaryRoom.id,
            },
          });
          
          totalMessagesMoved += duplicateRoom.messages.length;
        }
        
        duplicateRoomIds.push(duplicateRoom.id);
      }

      // Delete the duplicate chat rooms
      if (duplicateRoomIds.length > 0) {
        await prisma.chatRoom.deleteMany({
          where: {
            id: {
              in: duplicateRoomIds,
            },
          },
        });
      }

      // Update the primary room's lastMessageAt if there were messages moved
      if (totalMessagesMoved > 0) {
        const latestMessage = await prisma.message.findFirst({
          where: {
            chatRoomId: primaryRoom.id,
          },
          orderBy: {
            createdAt: "desc",
          },
        });

        if (latestMessage) {
          await prisma.chatRoom.update({
            where: {
              id: primaryRoom.id,
            },
            data: {
              lastMessageAt: latestMessage.createdAt,
            },
          });
        }
      }

      consolidationResults.push({
        userPair: pairKey,
        primaryRoomId: primaryRoom.id,
        duplicateRoomsRemoved: duplicateRoomIds.length,
        messagesConsolidated: totalMessagesMoved,
      });
    }

    return NextResponse.json({
      success: true,
      consolidatedPairs: consolidationResults.length,
      results: consolidationResults,
      message: `Successfully consolidated ${consolidationResults.length} user pair conversations`,
    });

  } catch (error) {
    console.error("Error consolidating chat rooms:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
} 