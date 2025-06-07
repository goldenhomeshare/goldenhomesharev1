import { getCurrentUser } from "@/lib/auth";
import prisma from "@/app/lib/db";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    const user = await getCurrentUser();
    
    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    // Toggle the user's verification status
    const currentUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: { isVerified: true }
    });

    if (!currentUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const newVerificationStatus = !currentUser.isVerified;

    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: { isVerified: newVerificationStatus },
      select: { isVerified: true, firstName: true, lastName: true, email: true }
    });

    return NextResponse.json({
      success: true,
      message: `User verification status ${newVerificationStatus ? 'enabled' : 'disabled'} for testing`,
      user: {
        email: updatedUser.email,
        name: `${updatedUser.firstName} ${updatedUser.lastName}`,
        isVerified: updatedUser.isVerified
      }
    });

  } catch (error) {
    console.error("Error toggling verification status:", error);
    return NextResponse.json({ 
      error: "Failed to toggle verification status" 
    }, { status: 500 });
  }
} 