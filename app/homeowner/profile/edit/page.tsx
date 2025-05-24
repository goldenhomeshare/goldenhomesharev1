import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { HomeownerProfileEditForm } from "./components/HomeownerProfileEditForm";
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

export default async function EditHomeownerProfilePage() {
  const user = await getCurrentUser();
  
  if (!user) {
    redirect("/api/auth/login");
  }
  
  const userType = (user as any).userType;
  
  if (userType !== "HOMEOWNER") {
    redirect("/onboarding");
  }
  
  const homeownerProfile = (user as any).homeownerProfile;
  const userData = await getUserData(user.id);
  
  if (!userData) {
    redirect("/api/auth/login");
  }
  
  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Edit Your Profile</h1>
        <p className="text-muted-foreground mt-2">
          Update your information and preferences
        </p>
      </div>
      
      <HomeownerProfileEditForm 
        userId={user.id}
        initialData={homeownerProfile}
        firstName={userData.firstName || ""}
        lastName={userData.lastName || ""}
        email={userData.email || ""}
      />
    </div>
  );
} 