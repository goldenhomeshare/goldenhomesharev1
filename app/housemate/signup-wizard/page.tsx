import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { HousemateSignupWizard } from "./components/HousemateSignupWizard";
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

export default async function HousemateSignupWizardPage() {
  const user = await getCurrentUser();
  
  if (!user) {
    redirect("/api/auth/login");
  }
  
  const userType = (user as any).userType;
  
  // If user is already a housemate with a profile, redirect to dashboard
  if (userType === "HOUSEMATE" && (user as any).housemateProfile) {
    redirect("/housemate/dashboard");
  }
  
  // If user is a homeowner, redirect to their dashboard
  if (userType === "HOMEOWNER") {
    redirect("/homeowner/dashboard");
  }
  
  const userData = await getUserData(user.id);
  
  if (!userData) {
    redirect("/api/auth/login");
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <HousemateSignupWizard 
          userId={user.id}
          firstName={userData.firstName || ""}
          lastName={userData.lastName || ""}
          email={userData.email || ""}
        />
      </div>
    </div>
  );
} 