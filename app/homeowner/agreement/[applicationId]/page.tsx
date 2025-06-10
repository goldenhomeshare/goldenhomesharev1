import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation";
import prisma from "../../../lib/db";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, FileText, Clock, Download, ArrowLeft } from "lucide-react";
import { HomeownerAgreementWizard } from "@/components/HomeownerAgreementWizard";
import { HomeownerAgreementActions } from "@/components/HomeownerAgreementActions";

async function getApplicationWithDetails(applicationId: string, userId: string) {
  try {
    const application = await prisma.application.findUnique({
      where: {
        id: applicationId,
      },
      include: {
        housemate: {
          include: {
            housemateProfile: true,
          },
        },
        product: true,
        agreement: true,
      },
    });

    // Verify the application exists and belongs to the current user's property
    if (!application || application.product.userId !== userId) {
      return null;
    }

    return application;
  } catch (error) {
    console.error("Error fetching application:", error);
    return null;
  }
}

async function getHomeownerData(userId: string) {
  try {
    const homeownerData = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        homeownerProfile: true,
        Product: true, // Get all listings including supportRequested field
      },
    });

    // Transform the data to match what the FillableAgreementForm expects
    if (!homeownerData) return null;

    const result = {
      user: homeownerData,
      homeownerProfile: homeownerData.homeownerProfile,
      listings: homeownerData.Product || [],
    };

    // Debug logging
    console.log('Homeowner data fetched successfully:', {
      listingCount: result.listings.length,
      firstListingSupport: result.listings[0]?.supportRequested,
      allListingIds: result.listings.map(l => l.id)
    });

    return result;
  } catch (error) {
    console.error("Error fetching homeowner data:", error);
    return null;
  }
}

export default async function HomeownerAgreementPage({
  params,
}: {
  params: Promise<{ applicationId: string }>;
}) {
  const { applicationId } = await params;
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user) {
    redirect("/api/auth/login");
  }

  const application = await getApplicationWithDetails(applicationId, user.id);
  const homeownerData = await getHomeownerData(user.id);

  if (!application) {
    redirect("/homeowner/applications");
  }

  if (!homeownerData) {
    redirect("/homeowner/dashboard");
  }

  // Check if homeowner has Stripe Connect setup before allowing agreement creation
  console.log('Checking Stripe Connect status for homeowner:', {
    userId: user.id,
    stripeConnectedLinked: homeownerData.user.stripeConnectedLinked
  });
  
  if (!homeownerData.user.stripeConnectedLinked) {
    console.log('Homeowner does not have Stripe Connect setup, redirecting to billing');
    redirect("/billing");
  }

  // Get the agreement if it exists
  const agreement = application.agreement;

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 py-4">
        {/* Simplified Header */}
        <div className="mb-6">
          {/* Back button */}
          <Button 
            asChild 
            variant="ghost" 
            size="sm"
            className="text-primary hover:text-primary/80 mb-4"
          >
            <a href="/homeowner/applications" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Applications</span>
            </a>
          </Button>

          {/* Simplified header */}
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
              <FileText className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Finalize Agreement</h1>
            </div>
          </div>
          <p className="text-gray-600 ml-13">
            Complete the agreement for {application.housemate.firstName} {application.housemate.lastName}
          </p>
        </div>

        {/* Agreement Status and Content */}
        {agreement?.status === 'COMPLETED' ? (
          <div className="space-y-6">
            {/* Success Status */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
              <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <h2 className="text-lg font-semibold text-gray-900 mb-1">Agreement Completed</h2>
              <p className="text-gray-600 text-sm">Both parties have signed the agreement</p>
            </div>

            {/* Application Details */}
            <div className="space-y-3">
              <h3 className="font-medium text-gray-900">Agreement Details</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-sm text-gray-500">Housemate</p>
                  <p className="font-medium">{application.housemate.firstName} {application.housemate.lastName}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-sm text-gray-500">Property</p>
                  <p className="font-medium">{application.product.name}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-sm text-gray-500">Monthly Rate</p>
                  <p className="font-medium">${application.product.price}</p>
                </div>
                {application.moveInDate && (
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-sm text-gray-500">Move-in Date</p>
                    <p className="font-medium">{new Date(application.moveInDate).toLocaleDateString()}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Signature Status */}
            <div className="space-y-3">
              <h3 className="font-medium text-gray-900">Signatures</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-center">
                  <CheckCircle className="w-6 h-6 text-green-600 mx-auto mb-1" />
                  <p className="font-medium text-sm">Your Signature</p>
                  <p className="text-xs text-gray-500">{new Date(agreement.homeownerSignedAt!).toLocaleDateString()}</p>
                </div>
                <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-center">
                  <CheckCircle className="w-6 h-6 text-green-600 mx-auto mb-1" />
                  <p className="font-medium text-sm">Housemate Signature</p>
                  <p className="text-xs text-gray-500">{new Date(agreement.housemateSignedAt!).toLocaleDateString()}</p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200">
              <div className="flex-1">
                <HomeownerAgreementActions 
                  agreement={agreement}
                  applicationId={applicationId}
                />
              </div>
            </div>
          </div>
        ) : agreement?.homeownerSigned ? (
          <div className="space-y-6">
            {/* Waiting Status */}
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-center">
              <Clock className="w-8 h-8 text-amber-600 mx-auto mb-2" />
              <h2 className="text-lg font-semibold text-gray-900 mb-1">Waiting for Housemate</h2>
              <p className="text-gray-600 text-sm">You've signed the agreement. Waiting for housemate to sign.</p>
            </div>

            {/* Application Details */}
            <div className="space-y-3">
              <h3 className="font-medium text-gray-900">Agreement Details</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-sm text-gray-500">Housemate</p>
                  <p className="font-medium">{application.housemate.firstName} {application.housemate.lastName}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-sm text-gray-500">Property</p>
                  <p className="font-medium">{application.product.name}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-sm text-gray-500">Monthly Rate</p>
                  <p className="font-medium">${application.product.price}</p>
                </div>
                {application.moveInDate && (
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-sm text-gray-500">Move-in Date</p>
                    <p className="font-medium">{new Date(application.moveInDate).toLocaleDateString()}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Signature Status */}
            <div className="space-y-3">
              <h3 className="font-medium text-gray-900">Signatures</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-center">
                  <CheckCircle className="w-6 h-6 text-green-600 mx-auto mb-1" />
                  <p className="font-medium text-sm">Your Signature</p>
                  <p className="text-xs text-gray-500">{new Date(agreement.homeownerSignedAt!).toLocaleDateString()}</p>
                </div>
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 text-center">
                  <Clock className="w-6 h-6 text-gray-400 mx-auto mb-1" />
                  <p className="font-medium text-sm">Housemate Signature</p>
                  <p className="text-xs text-gray-500">Pending</p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200">
              <div className="flex-1">
                <HomeownerAgreementActions 
                  agreement={agreement}
                  applicationId={applicationId}
                />
              </div>
            </div>
          </div>
        ) : (
          <HomeownerAgreementWizard 
            application={application}
            homeownerData={homeownerData}
            existingAgreement={agreement}
          />
        )}
      </div>
    </div>
  );
} 