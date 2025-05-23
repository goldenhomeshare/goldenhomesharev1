import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { HousemateProfileEditForm } from "./components/HousemateProfileEditForm";

export default async function EditHousemateProfilePage() {
  const user = await getCurrentUser();
  
  if (!user) {
    redirect("/api/auth/login");
  }
  
  const userType = (user as any).userType;
  
  if (userType !== "HOUSEMATE") {
    redirect("/onboarding");
  }
  
  const housemateProfile = (user as any).housemateProfile;
  
  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Edit Your Profile</h1>
        <p className="text-muted-foreground mt-2">
          Update your information and preferences to find the perfect home
        </p>
      </div>
      
      <HousemateProfileEditForm 
        userId={user.id}
        initialData={housemateProfile}
      />
    </div>
  );
} 