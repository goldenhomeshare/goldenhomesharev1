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
    const productId = searchParams.get("productId");
    
    if (!productId) {
      return NextResponse.json({ error: "Product ID is required" }, { status: 400 });
    }

    // Verify the user owns this product
    const product = await prisma.product.findUnique({
      where: { id: productId },
      select: { userId: true }
    });

    if (!product || product.userId !== user.id) {
      return NextResponse.json({ error: "Product not found or unauthorized" }, { status: 404 });
    }

    // Use a transaction to ensure all deletions happen atomically
    await prisma.$transaction(async (tx) => {
      // With cascade deletes in place, we can simplify this process
      // Delete chat rooms for this product (will cascade to messages)
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
    });

    return NextResponse.json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Error deleting product:", error);
    return NextResponse.json(
      { error: "Failed to delete product" },
      { status: 500 }
    );
  }
} 