import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation";
import prisma from "../../../lib/db";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, FileText, Clock, Download } from "lucide-react";
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





        {/* Agreement Wizard or Completion View */}
        {agreement?.status === 'COMPLETED' ? (
          <Card className="shadow-lg border-0">
            <CardHeader className="bg-gradient-to-r from-primary/5 to-primary/10 border-b border-gray-100 rounded-t-lg">
              <div className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-10 h-10 text-primary" />
                </div>
                <CardTitle className="text-2xl text-gray-900 mb-2">
                  Agreement Completed Successfully
                </CardTitle>
                <p className="text-gray-600">
                  Both parties have signed the agreement and it's now fully executed
                </p>
              </div>
            </CardHeader>
            <CardContent className="p-8 bg-white rounded-b-lg">
              <div className="space-y-8">
                {/* Application Details */}
                <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">Agreement Details</h3>
                  <div className="grid md:grid-cols-3 gap-6 mb-6">
                    <div className="text-center">
                      <label className="text-sm font-medium text-gray-500">Housemate</label>
                      <p className="text-lg font-semibold text-gray-900">
                        {application.housemate.firstName} {application.housemate.lastName}
                      </p>
                    </div>
                    <div className="text-center">
                      <label className="text-sm font-medium text-gray-500">Property</label>
                      <p className="text-lg font-semibold text-gray-900">{application.product.name}</p>
                    </div>
                    <div className="text-center">
                      <label className="text-sm font-medium text-gray-500">Monthly Rate</label>
                      <p className="text-lg font-semibold text-gray-900">${application.product.price}</p>
                    </div>
                  </div>
                  {application.moveInDate && (
                    <div className="grid md:grid-cols-2 gap-6 pt-4 border-t border-gray-200">
                      <div className="text-center">
                        <label className="text-sm font-medium text-gray-500">Move-in Date</label>
                        <p className="text-lg font-semibold text-gray-900">
                          {new Date(application.moveInDate).toLocaleDateString()}
                        </p>
                      </div>
                      {application.moveOutDate && (
                        <div className="text-center">
                          <label className="text-sm font-medium text-gray-500">Move-out Date</label>
                          <p className="text-lg font-semibold text-gray-900">
                            {new Date(application.moveOutDate).toLocaleDateString()}
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div className="bg-primary/5 border border-primary/20 rounded-2xl p-6 text-center">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Both Parties Have Signed</h3>
                  <p className="text-gray-600">
                    The agreement has been fully executed. Both you and the housemate have signed the agreement. 
                    The housemate will now proceed with payment to finalize the arrangement.
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-white border border-gray-200 rounded-xl p-4">
                    <div className="text-center">
                      <CheckCircle className="w-8 h-8 text-primary mx-auto mb-3" />
                      <h4 className="font-medium text-gray-900 mb-1">Your Signature</h4>
                      <p className="text-sm text-primary font-medium">Signed</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(agreement.homeownerSignedAt!).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="bg-white border border-gray-200 rounded-xl p-4">
                    <div className="text-center">
                      <CheckCircle className="w-8 h-8 text-primary mx-auto mb-3" />
                      <h4 className="font-medium text-gray-900 mb-1">Housemate Signature</h4>
                      <p className="text-sm text-primary font-medium">Signed</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(agreement.housemateSignedAt!).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-100">
                  <div className="flex-1">
                    <HomeownerAgreementActions 
                      agreement={agreement}
                      applicationId={applicationId}
                    />
                  </div>
                  <Button asChild variant="outline" className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl border-2">
                    <a href="/homeowner/applications">
                      Back to Applications
                    </a>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : agreement?.homeownerSigned ? (
          <Card className="shadow-lg border-0">
            <CardHeader className="bg-gradient-to-r from-primary/5 to-primary/10 border-b border-gray-100 rounded-t-lg">
              <div className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-10 h-10 text-primary" />
                </div>
                <CardTitle className="text-2xl text-gray-900 mb-2">
                  Agreement Signed by You
                </CardTitle>
                <p className="text-gray-600">
                  Waiting for the housemate to review and sign the agreement
                </p>
              </div>
            </CardHeader>
            <CardContent className="p-8 bg-white rounded-b-lg">
              <div className="space-y-8">
                {/* Application Details */}
                <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">Agreement Details</h3>
                  <div className="grid md:grid-cols-3 gap-6 mb-6">
                    <div className="text-center">
                      <label className="text-sm font-medium text-gray-500">Housemate</label>
                      <p className="text-lg font-semibold text-gray-900">
                        {application.housemate.firstName} {application.housemate.lastName}
                      </p>
                    </div>
                    <div className="text-center">
                      <label className="text-sm font-medium text-gray-500">Property</label>
                      <p className="text-lg font-semibold text-gray-900">{application.product.name}</p>
                    </div>
                    <div className="text-center">
                      <label className="text-sm font-medium text-gray-500">Monthly Rate</label>
                      <p className="text-lg font-semibold text-gray-900">${application.product.price}</p>
                    </div>
                  </div>
                  {application.moveInDate && (
                    <div className="grid md:grid-cols-2 gap-6 pt-4 border-t border-gray-200">
                      <div className="text-center">
                        <label className="text-sm font-medium text-gray-500">Move-in Date</label>
                        <p className="text-lg font-semibold text-gray-900">
                          {new Date(application.moveInDate).toLocaleDateString()}
                        </p>
                      </div>
                      {application.moveOutDate && (
                        <div className="text-center">
                          <label className="text-sm font-medium text-gray-500">Move-out Date</label>
                          <p className="text-lg font-semibold text-gray-900">
                            {new Date(application.moveOutDate).toLocaleDateString()}
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div className="bg-primary/5 border border-primary/20 rounded-2xl p-6 text-center">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Waiting for Housemate</h3>
                  <p className="text-gray-600">
                    You have successfully signed the agreement. The housemate has been notified and will receive a link to review and sign the agreement.
                    Once they sign, the agreement will be fully executed.
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-white border border-gray-200 rounded-xl p-4">
                    <div className="text-center">
                      <CheckCircle className="w-8 h-8 text-primary mx-auto mb-3" />
                      <h4 className="font-medium text-gray-900 mb-1">Your Signature</h4>
                      <p className="text-sm text-primary font-medium">Signed</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(agreement.homeownerSignedAt!).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                    <div className="text-center">
                      <Clock className="w-8 h-8 text-gray-400 mx-auto mb-3" />
                      <h4 className="font-medium text-gray-900 mb-1">Housemate Signature</h4>
                      <p className="text-sm text-gray-500 font-medium">Pending</p>
                      <p className="text-xs text-gray-400 mt-1">
                        Notification sent
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-100">
                  <div className="flex-1">
                    <HomeownerAgreementActions 
                      agreement={agreement}
                      applicationId={applicationId}
                    />
                  </div>
                  <Button asChild variant="outline" className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl border-2">
                    <a href="/homeowner/applications">
                      Back to Applications
                    </a>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
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