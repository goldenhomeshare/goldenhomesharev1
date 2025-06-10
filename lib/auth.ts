import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import prisma from "../app/lib/db";

export async function getCurrentUser() {
  const { getUser } = getKindeServerSession();
  const kindeUser = await getUser();
  
  if (!kindeUser) return null;
  
  try {
    const user = await prisma.user.findUnique({
      where: { id: kindeUser.id },
      include: {
        homeownerProfile: true,
        housemateProfile: true,
      },
    });
    
    if (user) {
      // Use uploaded profile picture if available, fallback to Google profile image
      const uploadedProfilePicture = user.homeownerProfile?.profilePicture || user.housemateProfile?.profilePicture;
      if (uploadedProfilePicture) {
        return {
          ...user,
          profileImage: uploadedProfilePicture,
        };
      }
    }
    
    return user;
  } catch (error) {
    console.error("Error fetching user:", error);
    // Fallback to basic user data if includes fail
    const user = await prisma.user.findUnique({
      where: { id: kindeUser.id },
    });
    return user;
  }
}

export async function requireAuth(requiredRole?: "HOMEOWNER" | "HOUSEMATE" | "ADMIN") {
  const user = await getCurrentUser();
  
  if (!user) {
    throw new Error("Authentication required");
  }
  
  const userType = (user as any).userType;
  
  if (requiredRole && userType !== requiredRole) {
    throw new Error("Insufficient permissions");
  }
  
  return user;
}

export async function requireHomeowner() {
  return requireAuth("HOMEOWNER");
}

export async function requireHousemate() {
  return requireAuth("HOUSEMATE");
}

export async function checkOnboardingStatus(userId: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        userType: true,
        onboardingCompleted: true,
        homeownerProfile: true,
        housemateProfile: true,
      },
    });
    
    if (!user) return { needsOnboarding: true, redirectTo: "/onboarding" };
    
    const userType = (user as any).userType;
    const onboardingCompleted = (user as any).onboardingCompleted;
    const homeownerProfile = (user as any).homeownerProfile;
    const housemateProfile = (user as any).housemateProfile;
    
    if (!userType || !onboardingCompleted) {
      return { needsOnboarding: true, redirectTo: "/onboarding" };
    }
    
    // Check if profile exists based on user type
    if (userType === "HOMEOWNER" && !homeownerProfile) {
      return { needsOnboarding: true, redirectTo: "/onboarding/homeowner-profile" };
    }
    
    if (userType === "HOUSEMATE" && !housemateProfile) {
      return { needsOnboarding: true, redirectTo: "/onboarding/housemate-profile" };
    }
    
    return { needsOnboarding: false, redirectTo: null };
  } catch (error) {
    console.error("Error checking onboarding status:", error);
    return { needsOnboarding: true, redirectTo: "/onboarding" };
  }
}

export function getDefaultDashboard(userType: "HOMEOWNER" | "HOUSEMATE" | "ADMIN" | null) {
  switch (userType) {
    case "HOMEOWNER":
      return "/homeowner/dashboard";
    case "HOUSEMATE":
      return "/housemate/dashboard";
    default:
      return "/onboarding";
  }
} 