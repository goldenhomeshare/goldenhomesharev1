import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { HomeownerProfileForm } from "./components/HomeownerProfileForm";

export default async function HomeownerProfilePage() {
  const user = await getCurrentUser();
  
  if (!user) {
    redirect("/api/auth/login");
  }
  
  const userType = (user as any).userType;
  const homeownerProfile = (user as any).homeownerProfile;
  
  if (userType !== "HOMEOWNER") {
    redirect("/onboarding");
  }
  
  if (homeownerProfile) {
    redirect("/homeowner/dashboard");
  }
  
  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold">Complete Your Homeowner Profile</h1>
        <p className="text-muted-foreground mt-2">
          Help potential housemates get to know you and your home
        </p>
      </div>
      <HomeownerProfileForm userId={user.id} />
    </div>
  );
} 