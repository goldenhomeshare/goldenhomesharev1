"use server";

import prisma from "@/app/lib/db";
import { requireHomeowner, requireHousemate } from "@/lib/auth";
import { revalidatePath } from "next/cache";

// Homeowner profile update action
export async function updateHomeownerProfile(
  data: {
    bio?: string;
    profilePicture?: string;
    emergencyContactName?: string;
    emergencyContactPhone?: string;
    emergencyContactRelationship?: string;
    gender?: string;
    ageRange?: string;
    schedule?: string;
    socialPreference?: string;
    hobbies?: string[];
  }
) {
  try {
    const user = await requireHomeowner();
    
    const emergencyContact = data.emergencyContactName || data.emergencyContactPhone ? {
      name: data.emergencyContactName || "",
      phone: data.emergencyContactPhone || "",
      relationship: data.emergencyContactRelationship || "",
    } : undefined;

    // Create the update data object, only including defined fields
    const updateData: any = {};
    
    if (data.bio !== undefined) updateData.bio = data.bio;
    if (data.profilePicture !== undefined) updateData.profilePicture = data.profilePicture;
    if (emergencyContact !== undefined) updateData.emergencyContact = emergencyContact;
    if (data.gender !== undefined) updateData.gender = data.gender;
    if (data.ageRange !== undefined) updateData.ageRange = data.ageRange;
    if (data.schedule !== undefined) updateData.schedule = data.schedule;
    if (data.socialPreference !== undefined) updateData.socialPreference = data.socialPreference;
    if (data.hobbies !== undefined) updateData.hobbies = data.hobbies;

    await prisma.homeownerProfile.upsert({
      where: { userId: user.id },
      update: updateData,
      create: {
        userId: user.id,
        ...updateData,
      },
    });

    revalidatePath("/homeowner/dashboard");
    revalidatePath("/homeowner/profile/edit");
    
    return { success: true };
  } catch (error) {
    console.error("Error updating homeowner profile:", error);
    const errorMessage = error instanceof Error ? error.message : "Failed to update profile";
    return { success: false, error: `Profile update failed: ${errorMessage}` };
  }
}

// Housemate profile update action
export async function updateHousemateProfile(
  data: {
    age?: number;
    occupation?: string;
    bio?: string;
    profilePicture?: string;
    minBudget?: number;
    maxBudget?: number;
    gender?: string;
    ageRange?: string;
    schedule?: string;
    socialPreference?: string;
    hobbies?: string[];
    lifestyle?: {
      smokingFriendly?: boolean;
      petFriendly?: boolean;
      socialLevel?: string;
      cleanlinessLevel?: string;
      sleepSchedule?: string;
      workFromHome?: boolean;
    };
  }
) {
  try {
    const user = await requireHousemate();
    
    const budgetRange = (data.minBudget || data.maxBudget) ? {
      min: data.minBudget || 0,
      max: data.maxBudget || 0,
    } : undefined;

    // Create the update data object, only including defined fields
    const updateData: any = {};
    
    if (data.age !== undefined) updateData.age = data.age;
    if (data.occupation !== undefined) updateData.occupation = data.occupation;
    if (data.bio !== undefined) updateData.bio = data.bio;
    if (data.profilePicture !== undefined) updateData.profilePicture = data.profilePicture;
    if (data.lifestyle !== undefined) updateData.lifestyle = data.lifestyle;
    if (budgetRange !== undefined) updateData.budgetRange = budgetRange;
    if (data.gender !== undefined) updateData.gender = data.gender;
    if (data.ageRange !== undefined) updateData.ageRange = data.ageRange;
    if (data.schedule !== undefined) updateData.schedule = data.schedule;
    if (data.socialPreference !== undefined) updateData.socialPreference = data.socialPreference;
    if (data.hobbies !== undefined) updateData.hobbies = data.hobbies;

    await prisma.housemateProfile.upsert({
      where: { userId: user.id },
      update: updateData,
      create: {
        userId: user.id,
        ...updateData,
      },
    });

    revalidatePath("/housemate/dashboard");
    revalidatePath("/housemate/profile/edit");
    
    return { success: true };
  } catch (error) {
    console.error("Error updating housemate profile:", error);
    const errorMessage = error instanceof Error ? error.message : "Failed to update profile";
    return { success: false, error: `Profile update failed: ${errorMessage}` };
  }
} 