"use server";

import prisma from "@/app/lib/db";
import { requireHomeowner, requireHousemate } from "@/lib/auth";
import { revalidatePath } from "next/cache";

// Homeowner profile update action
export async function updateHomeownerProfile(
  data: {
    bio?: string;
    profilePicture?: string;
    gender?: string;
    ageRange?: string;
    schedule?: string;
    socialPreference?: string;
    hobbies?: string[];
    preferredAgeRanges?: string[];
    preferredGender?: string;
    socialMedia?: {
      instagram?: string;
      facebook?: string;
      linkedin?: string;
    };
    lifestyle?: {
      hasPets?: boolean;
      petDescription?: string;
      numberOfPeople?: string;
      smokingStatus?: string;
    };
  }
) {
  try {
    const user = await requireHomeowner();

    // Create the update data object, only including defined fields
    const updateData: any = {};
    
    if (data.bio !== undefined) updateData.bio = data.bio;
    if (data.profilePicture !== undefined) updateData.profilePicture = data.profilePicture;
    if (data.gender !== undefined) updateData.gender = data.gender;
    if (data.ageRange !== undefined) updateData.ageRange = data.ageRange;
    if (data.schedule !== undefined) updateData.schedule = data.schedule;
    if (data.socialPreference !== undefined) updateData.socialPreference = data.socialPreference;
    if (data.hobbies !== undefined) updateData.hobbies = data.hobbies;
    if (data.preferredAgeRanges !== undefined) updateData.preferredAgeRanges = data.preferredAgeRanges;
    if (data.preferredGender !== undefined) updateData.preferredGender = data.preferredGender;
    if (data.socialMedia !== undefined) updateData.socialMedia = data.socialMedia;
    if (data.lifestyle !== undefined) updateData.lifestyle = data.lifestyle;

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
    occupation?: string;
    bio?: string;
    profilePicture?: string;
    maxBudget?: number;
    gender?: string;
    ageRange?: string;
    schedule?: string;
    socialPreference?: string;
    hobbies?: string[];
    preferredAgeRanges?: string[];
    preferredGender?: string;
    canHelpWith?: string[];
    socialMedia?: {
      instagram?: string;
      facebook?: string;
      linkedin?: string;
    };
    lifestyle?: {
      hasPets?: boolean;
      petDescription?: string;
      numberOfPeople?: string;
      smokingStatus?: string;
    };
  }
) {
  try {
    const user = await requireHousemate();
    
    // Create the update data object, only including defined fields
    const updateData: any = {};
    
    if (data.occupation !== undefined) updateData.occupation = data.occupation;
    if (data.bio !== undefined) updateData.bio = data.bio;
    if (data.profilePicture !== undefined) updateData.profilePicture = data.profilePicture;
    if (data.socialMedia !== undefined) updateData.socialMedia = data.socialMedia;
    if (data.lifestyle !== undefined) updateData.lifestyle = data.lifestyle;
    if (data.maxBudget !== undefined) updateData.maxBudget = data.maxBudget;
    if (data.gender !== undefined) updateData.gender = data.gender;
    if (data.ageRange !== undefined) updateData.ageRange = data.ageRange;
    if (data.schedule !== undefined) updateData.schedule = data.schedule;
    if (data.socialPreference !== undefined) updateData.socialPreference = data.socialPreference;
    if (data.hobbies !== undefined) updateData.hobbies = data.hobbies;
    if (data.preferredAgeRanges !== undefined) updateData.preferredAgeRanges = data.preferredAgeRanges;
    if (data.preferredGender !== undefined) updateData.preferredGender = data.preferredGender;
    if (data.canHelpWith !== undefined) updateData.canHelpWith = data.canHelpWith;

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