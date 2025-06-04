import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation";
import prisma from "../../../lib/db";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, FileText, Clock } from "lucide-react";
import { HomeownerAgreementWizard } from "@/components/HomeownerAgreementWizard";

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
        Product: true, // Get all listings
      },
    });

    // Transform the data to match what the FillableAgreementForm expects
    if (!homeownerData) return null;

    return {
      user: homeownerData,
      homeownerProfile: homeownerData.homeownerProfile,
      listings: homeownerData.Product || [],
    };
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

  // Get the agreement if it exists
  const agreement = application.agreement;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
              <FileText className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Finalize Agreement</h1>
              <p className="text-gray-600">
                Complete the agreement for {application.housemate.firstName} {application.housemate.lastName}
              </p>
            </div>
          </div>
        </div>

        {/* Application Summary */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              Application Approved
            </CardTitle>
            <CardDescription>
              Review the application details before proceeding with the agreement
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <label className="text-sm font-medium text-gray-500">Housemate</label>
                <p className="text-lg font-semibold">
                  {application.housemate.firstName} {application.housemate.lastName}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Property</label>
                <p className="text-lg font-semibold">{application.product.name}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Monthly Rate</label>
                <p className="text-lg font-semibold">${application.product.price}</p>
              </div>
            </div>
            {application.moveInDate && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Move-in Date</label>
                    <p className="text-lg font-semibold">
                      {new Date(application.moveInDate).toLocaleDateString()}
                    </p>
                  </div>
                  {application.moveOutDate && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">Move-out Date</label>
                      <p className="text-lg font-semibold">
                        {new Date(application.moveOutDate).toLocaleDateString()}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
            {application.message && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <label className="text-sm font-medium text-gray-500">Application Message</label>
                <p className="text-gray-700 mt-1">{application.message}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Agreement Status */}
        {agreement ? (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-blue-600" />
                Agreement Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm font-medium text-gray-500">Homeowner Signature</label>
                  <p className={`text-lg font-semibold ${agreement.homeownerSigned ? 'text-green-600' : 'text-yellow-600'}`}>
                    {agreement.homeownerSigned ? '✓ Signed' : '⏳ Pending'}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Housemate Signature</label>
                  <p className={`text-lg font-semibold ${agreement.housemateSigned ? 'text-green-600' : 'text-yellow-600'}`}>
                    {agreement.housemateSigned ? '✓ Signed' : '⏳ Pending'}
                  </p>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-200">
                <label className="text-sm font-medium text-gray-500">Agreement Status</label>
                <p className={`text-lg font-semibold ${agreement.status === 'COMPLETED' ? 'text-green-600' : 'text-blue-600'}`}>
                  {agreement.status.replace('_', ' ')}
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-yellow-600" />
                Ready to Create Agreement
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                No agreement has been created yet. Proceed below to create and sign the agreement.
              </p>
              <div className="space-y-2 text-sm text-green-600">
                <p>• Application ID: {application.id}</p>
                <p>• Housemate: {application.housemate.firstName} {application.housemate.lastName}</p>
                <p>• Property: {application.product.name}</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Agreement Wizard */}
        <HomeownerAgreementWizard 
          application={application}
          homeownerData={homeownerData}
          existingAgreement={agreement}
        />
      </div>
    </div>
  );
} 