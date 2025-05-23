import { getCurrentUser } from "@/lib/auth";
import { OnboardingForm } from "./components/OnboardingForm";
import { redirect } from "next/navigation";

export default async function OnboardingPage() {
  const user = await getCurrentUser();
  
  if (!user) {
    redirect("/api/auth/login");
  }
  
  // Check if user has completed onboarding and has the appropriate profile
  const hasHomeownerProfile = (user as any).homeownerProfile;
  const hasHousemateProfile = (user as any).housemateProfile;
  const userType = (user as any).userType;

  if (userType && (hasHomeownerProfile || hasHousemateProfile)) {
    const dashboardUrl = userType === "HOMEOWNER" 
      ? "/homeowner/dashboard" 
      : "/housemate/dashboard";
    redirect(dashboardUrl);
  }
  
  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <OnboardingForm userId={user.id} />
    </div>
  );
} 