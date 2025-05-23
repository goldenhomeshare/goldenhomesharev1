"use server";

import prisma from "@/app/lib/db";
import { revalidatePath } from "next/cache";

export async function completeOnboarding(userId: string, userType: "HOMEOWNER" | "HOUSEMATE" | "ADMIN") {
  try {
    await (prisma.user.update as any)({
      where: { id: userId },
      data: {
        userType: userType,
        onboardingCompleted: true,
      },
    });

    revalidatePath("/onboarding");
    return { success: true };
  } catch (error) {
    console.error("Error completing onboarding:", error);
    return { success: false, error: "Failed to complete onboarding" };
  }
}

export async function createHomeownerProfile(
  userId: string,
  data: {
    bio?: string;
    emergencyContact?: any;
  }
) {
  try {
    await (prisma as any).homeownerProfile.create({
      data: {
        userId,
        bio: data.bio,
        emergencyContact: data.emergencyContact,
      },
    });

    revalidatePath("/onboarding");
    return { success: true };
  } catch (error) {
    console.error("Error creating homeowner profile:", error);
    return { success: false, error: "Failed to create profile" };
  }
}

export async function createHousemateProfile(
  userId: string,
  data: {
    age?: number;
    occupation?: string;
    bio?: string;
    lifestyle?: any;
    budgetRange?: any;
  }
) {
  try {
    await (prisma as any).housemateProfile.create({
      data: {
        userId,
        age: data.age,
        occupation: data.occupation,
        bio: data.bio,
        lifestyle: data.lifestyle,
        budgetRange: data.budgetRange,
      },
    });

    revalidatePath("/onboarding");
    return { success: true };
  } catch (error) {
    console.error("Error creating housemate profile:", error);
    return { success: false, error: "Failed to create profile" };
  }
} 