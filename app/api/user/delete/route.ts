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
    const userIdToDelete = searchParams.get("userId");
    
    if (!userIdToDelete) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }

    // Use a transaction to ensure all deletions happen atomically
    await prisma.$transaction(async (tx) => {
      // With cascade deletes in place, we can simplify this process
      // Delete user profiles first
      await tx.homeownerProfile.deleteMany({
        where: { userId: userIdToDelete }
      });

      await tx.housemateProfile.deleteMany({
        where: { userId: userIdToDelete }
      });

      // Delete products (will cascade to applications and chat rooms)
      await tx.product.deleteMany({
        where: { userId: userIdToDelete }
      });

      // Delete remaining chat rooms (will cascade to messages)
      await tx.chatRoom.deleteMany({
        where: {
          OR: [
            { homeownerId: userIdToDelete },
            { housemateId: userIdToDelete }
          ]
        }
      });

      // Delete remaining applications
      await tx.application.deleteMany({
        where: {
          housemateId: userIdToDelete
        }
      });

      // Finally, delete the user (will cascade to any remaining messages)
      await tx.user.delete({
        where: { id: userIdToDelete }
      });
    });

    return NextResponse.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    return NextResponse.json(
      { error: "Failed to delete user" },
      { status: 500 }
    );
  }
} 