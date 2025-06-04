import { getCurrentUser } from "@/lib/auth";
import { ModernAgreementWizard } from "@/components/ModernAgreementWizard";
import prisma from "@/app/lib/db";

async function getHomeownerDataWithListings(userId: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    const homeownerProfile = await prisma.homeownerProfile.findUnique({
      where: { userId: userId },
    });

    const listings = await prisma.product.findMany({
      where: { userId: userId },
    });

    return {
      user,
      homeownerProfile,
      listings,
    };
  } catch (error) {
    console.error("Error fetching homeowner data:", error);
    return null;
  }
}

export default async function TestAgreementsPage() {
  const currentUser = await getCurrentUser();
  
  let homeownerData = null;
  if (currentUser && (currentUser as any).userType === "HOMEOWNER") {
    homeownerData = await getHomeownerDataWithListings(currentUser.id);
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 py-12">
        {/* Modern Agreement Wizard */}
        <ModernAgreementWizard 
          homeownerData={homeownerData}
          currentUser={currentUser}
        />
      </div>
    </div>
  );
} 