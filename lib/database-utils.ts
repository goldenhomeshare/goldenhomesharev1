import prisma from "@/app/lib/db";

/**
 * Safely delete a user and all related records
 * Note: With cascade deletes in place, this could be simplified, but we maintain explicit order for clarity
 */
export async function safeDeleteUser(userId: string) {
  return await prisma.$transaction(async (tx) => {
    // With cascade deletes, we could just delete the user directly,
    // but we'll maintain explicit deletion for better control and logging
    
    // Delete user profiles first (these have cascade deletes)
    await tx.homeownerProfile.deleteMany({
      where: { userId: userId }
    });

    await tx.housemateProfile.deleteMany({
      where: { userId: userId }
    });

    // Delete products owned by this user (this will cascade to applications and chat rooms)
    await tx.product.deleteMany({
      where: { userId: userId }
    });

    // Delete remaining chat rooms where user is involved (messages will cascade)
    await tx.chatRoom.deleteMany({
      where: {
        OR: [
          { homeownerId: userId },
          { housemateId: userId }
        ]
      }
    });

    // Delete remaining applications where user is the housemate
    await tx.application.deleteMany({
      where: {
        housemateId: userId
      }
    });

    // Finally, delete the user (this will cascade to any remaining messages)
    await tx.user.delete({
      where: { id: userId }
    });

    return { success: true, message: "User deleted successfully" };
  });
}

/**
 * Safely delete a product and all related records
 */
export async function safeDeleteProduct(productId: string, userId?: string) {
  return await prisma.$transaction(async (tx) => {
    // Verify ownership if userId is provided
    if (userId) {
      const product = await tx.product.findUnique({
        where: { id: productId },
        select: { userId: true }
      });

      if (!product || product.userId !== userId) {
        throw new Error("Product not found or unauthorized");
      }
    }

    // Delete all messages in chat rooms for this product
    await tx.message.deleteMany({
      where: {
        chatRoom: {
          productId: productId
        }
      }
    });

    // Delete all chat rooms for this product
    await tx.chatRoom.deleteMany({
      where: {
        productId: productId
      }
    });

    // Delete applications for this product
    await tx.application.deleteMany({
      where: {
        productId: productId
      }
    });

    // Finally, delete the product
    await tx.product.delete({
      where: { id: productId }
    });

    return { success: true, message: "Product deleted successfully" };
  });
}

/**
 * Safely delete a chat room and all its messages
 */
export async function safeDeleteChatRoom(chatRoomId: string, userId?: string) {
  return await prisma.$transaction(async (tx) => {
    // Verify user is part of the chat room if userId is provided
    if (userId) {
      const chatRoom = await tx.chatRoom.findUnique({
        where: { id: chatRoomId },
        select: { 
          homeownerId: true, 
          housemateId: true 
        }
      });

      if (!chatRoom || (chatRoom.homeownerId !== userId && chatRoom.housemateId !== userId)) {
        throw new Error("Chat room not found or unauthorized");
      }
    }

    // Delete all messages in this chat room
    await tx.message.deleteMany({
      where: {
        chatRoomId: chatRoomId
      }
    });

    // Delete the chat room
    await tx.chatRoom.delete({
      where: { id: chatRoomId }
    });

    return { success: true, message: "Chat room deleted successfully" };
  });
}

/**
 * Clean up orphaned chat rooms (chat rooms without valid references)
 */
export async function cleanupOrphanedChatRooms() {
  return await prisma.$transaction(async (tx) => {
    // Find chat rooms where the referenced users no longer exist
    const allChatRooms = await tx.chatRoom.findMany({
      include: {
        homeowner: true,
        housemate: true
      }
    });

    const orphanedChatRooms = allChatRooms.filter(room => 
      !room.homeowner || !room.housemate
    );

    if (orphanedChatRooms.length > 0) {
      const chatRoomIds = orphanedChatRooms.map(room => room.id);

      // Delete messages in orphaned chat rooms
      await tx.message.deleteMany({
        where: {
          chatRoomId: {
            in: chatRoomIds
          }
        }
      });

      // Delete orphaned chat rooms
      await tx.chatRoom.deleteMany({
        where: {
          id: {
            in: chatRoomIds
          }
        }
      });
    }

    return { 
      success: true, 
      message: `Cleaned up ${orphanedChatRooms.length} orphaned chat rooms` 
    };
  });
} 