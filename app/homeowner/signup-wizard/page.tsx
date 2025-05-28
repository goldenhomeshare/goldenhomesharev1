import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { HomeownerSignupWizard } from "./components/HomeownerSignupWizard";
import prisma from "@/app/lib/db";

async function getUserData(userId: string) {
  const userData = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      firstName: true,
      lastName: true,
      email: true,
    },
  });

  return userData;
}

export default async function HomeownerSignupWizardPage() {
  const user = await getCurrentUser();
  
  if (!user) {
    redirect("/api/auth/login");
  }
  
  const userType = (user as any).userType;
  
  // If user is already a homeowner with a profile, redirect to dashboard
  if (userType === "HOMEOWNER" && (user as any).homeownerProfile) {
    redirect("/homeowner/dashboard");
  }
  
  // If user is a housemate, redirect to their dashboard
  if (userType === "HOUSEMATE") {
    redirect("/housemate/dashboard");
  }
  
  const userData = await getUserData(user.id);
  
  if (!userData) {
    redirect("/api/auth/login");
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <HomeownerSignupWizard 
          userId={user.id}
          firstName={userData.firstName || ""}
          lastName={userData.lastName || ""}
          email={userData.email || ""}
        />
      </div>
    </div>
  );
} 