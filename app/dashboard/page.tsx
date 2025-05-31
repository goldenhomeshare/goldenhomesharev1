import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const user = await getCurrentUser();
  
  if (!user) {
    redirect("/api/auth/login");
  }
  
  const userType = (user as any).userType;
  
  // Redirect to appropriate dashboard based on user type
  switch (userType) {
    case "HOMEOWNER":
      redirect("/homeowner/dashboard");
    case "HOUSEMATE":
      redirect("/housemate/dashboard");
    case "ADMIN":
      redirect("/admin/dashboard");
    default:
      redirect("/onboarding");
  }
} 