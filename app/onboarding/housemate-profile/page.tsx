import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { HousemateProfileForm } from "./components/HousemateProfileForm";

export default async function HousemateProfilePage() {
  const user = await getCurrentUser();
  
  if (!user) {
    redirect("/api/auth/login");
  }
  
  const userType = (user as any).userType;
  const housemateProfile = (user as any).housemateProfile;
  
  if (userType !== "HOUSEMATE") {
    redirect("/onboarding");
  }
  
  if (housemateProfile) {
    redirect("/housemate/dashboard");
  }
  
  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold">Complete Your Housemate Profile</h1>
        <p className="text-muted-foreground mt-2">
          Help homeowners get to know you and find your perfect match
        </p>
      </div>
      <HousemateProfileForm userId={user.id} />
    </div>
  );
} 