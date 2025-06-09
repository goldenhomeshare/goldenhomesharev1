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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          {/* Mobile-first breadcrumb */}
          <div className="flex items-center gap-2 mb-4 sm:mb-6">
            <Button 
              asChild 
              variant="ghost" 
              size="sm"
              className="text-primary hover:text-primary/80 hover:bg-primary/5 p-2"
            >
              <a href="/homeowner/applications" className="flex items-center gap-1">
                <ArrowLeft className="h-4 w-4" />
                <span className="hidden sm:inline">Back to Applications</span>
              </a>
            </Button>
          </div>

          {/* Desktop header layout */}
          <div className="hidden sm:flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-gradient-to-r from-primary/10 to-primary/15 rounded-2xl flex items-center justify-center">
              <FileText className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900">Finalize Agreement</h1>
              <p className="text-lg text-gray-600 mt-1">
                Complete the agreement for {application.housemate.firstName} {application.housemate.lastName}
              </p>
            </div>
          </div>

          {/* Mobile header layout */}
          <div className="sm:hidden text-center">
            <div className="w-12 h-12 bg-gradient-to-r from-primary/10 to-primary/15 rounded-xl flex items-center justify-center mx-auto mb-4">
              <FileText className="h-6 w-6 text-primary" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Finalize Agreement</h1>
            <p className="text-gray-600">
              Complete the agreement for {application.housemate.firstName} {application.housemate.lastName}
            </p>
          </div>
        </div>

        {/* Agreement Wizard or Completion View */}
        {agreement?.status === 'COMPLETED' ? (
          <Card className="shadow-lg border-0 w-full">
            <CardHeader className="bg-gradient-to-r from-primary/5 to-primary/10 border-b border-gray-100 rounded-t-lg p-4 sm:p-6 lg:p-8">
              <div className="text-center">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-6 h-6 sm:w-10 sm:h-10 text-primary" />
                </div>
                <CardTitle className="text-xl sm:text-2xl text-gray-900 mb-2">
                  Agreement Completed Successfully
                </CardTitle>
                <p className="text-sm sm:text-base text-gray-600 max-w-2xl mx-auto">
                  Both parties have signed the agreement and it's now fully executed
                </p>
              </div>
            </CardHeader>
            <CardContent className="p-4 sm:p-6 lg:p-8 bg-white rounded-b-lg">
              <div className="space-y-6 sm:space-y-8">
                {/* Application Details */}
                <div className="bg-gray-50 border border-gray-200 rounded-2xl p-4 sm:p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 sm:mb-6 text-center">Agreement Details</h3>
                  
                  {/* Desktop grid layout */}
                  <div className="hidden sm:grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                    <div className="text-center">
                      <label className="text-sm font-medium text-gray-500">Housemate</label>
                      <p className="text-lg font-semibold text-gray-900 mt-1">
                        {application.housemate.firstName} {application.housemate.lastName}
                      </p>
                    </div>
                    <div className="text-center">
                      <label className="text-sm font-medium text-gray-500">Property</label>
                      <p className="text-lg font-semibold text-gray-900 mt-1">{application.product.name}</p>
                    </div>
                    <div className="text-center">
                      <label className="text-sm font-medium text-gray-500">Monthly Rate</label>
                      <p className="text-lg font-semibold text-gray-900 mt-1">${application.product.price}</p>
                    </div>
                  </div>

                  {/* Mobile stacked layout */}
                  <div className="sm:hidden space-y-4 mb-6">
                    <div className="bg-white rounded-xl p-4 border border-gray-100">
                      <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Housemate</label>
                      <p className="text-lg font-semibold text-gray-900 mt-1">
                        {application.housemate.firstName} {application.housemate.lastName}
                      </p>
                    </div>
                    <div className="bg-white rounded-xl p-4 border border-gray-100">
                      <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Property</label>
                      <p className="text-lg font-semibold text-gray-900 mt-1">{application.product.name}</p>
                    </div>
                    <div className="bg-white rounded-xl p-4 border border-gray-100">
                      <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Monthly Rate</label>
                      <p className="text-lg font-semibold text-gray-900 mt-1">${application.product.price}</p>
                    </div>
                  </div>

                  {application.moveInDate && (
                    <>
                      {/* Desktop dates layout */}
                      <div className="hidden sm:grid grid-cols-1 lg:grid-cols-2 gap-6 pt-4 border-t border-gray-200">
                        <div className="text-center">
                          <label className="text-sm font-medium text-gray-500">Move-in Date</label>
                          <p className="text-lg font-semibold text-gray-900 mt-1">
                            {new Date(application.moveInDate).toLocaleDateString()}
                          </p>
                        </div>
                        {application.moveOutDate && (
                          <div className="text-center">
                            <label className="text-sm font-medium text-gray-500">Move-out Date</label>
                            <p className="text-lg font-semibold text-gray-900 mt-1">
                              {new Date(application.moveOutDate).toLocaleDateString()}
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Mobile dates layout */}
                      <div className="sm:hidden space-y-4 pt-4 border-t border-gray-200">
                        <div className="bg-white rounded-xl p-4 border border-gray-100">
                          <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Move-in Date</label>
                          <p className="text-lg font-semibold text-gray-900 mt-1">
                            {new Date(application.moveInDate).toLocaleDateString()}
                          </p>
                        </div>
                        {application.moveOutDate && (
                          <div className="bg-white rounded-xl p-4 border border-gray-100">
                            <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Move-out Date</label>
                            <p className="text-lg font-semibold text-gray-900 mt-1">
                              {new Date(application.moveOutDate).toLocaleDateString()}
                            </p>
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </div>

                <div className="bg-gradient-to-r from-primary/5 to-primary/10 border border-primary/20 rounded-2xl p-4 sm:p-6 text-center">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Both Parties Have Signed</h3>
                  <p className="text-sm sm:text-base text-gray-600 max-w-2xl mx-auto">
                    The agreement has been fully executed. Both you and the housemate have signed the agreement. 
                    The housemate will now proceed with payment to finalize the arrangement.
                  </p>
                </div>

                {/* Signature status - Desktop grid, Mobile stack */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <div className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow">
                    <div className="text-center">
                      <CheckCircle className="w-8 h-8 text-primary mx-auto mb-3" />
                      <h4 className="font-medium text-gray-900 mb-1">Your Signature</h4>
                      <p className="text-sm text-primary font-medium">Signed</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(agreement.homeownerSignedAt!).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow">
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

                {/* Actions - Mobile stack, Desktop row */}
                <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-100">
                  <div className="flex-1">
                    <HomeownerAgreementActions 
                      agreement={agreement}
                      applicationId={applicationId}
                    />
                  </div>
                  <Button 
                    asChild 
                    variant="outline" 
                    className="flex items-center justify-center gap-2 px-4 sm:px-6 py-3 rounded-xl border-2 hover:bg-gray-50 transition-colors min-h-[44px]"
                  >
                    <a href="/homeowner/applications">
                      <ArrowLeft className="h-4 w-4" />
                      <span className="hidden sm:inline">Back to Applications</span>
                      <span className="sm:hidden">Back</span>
                    </a>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : agreement?.homeownerSigned ? (
          <Card className="shadow-lg border-0 w-full">
            <CardHeader className="bg-gradient-to-r from-primary/5 to-primary/10 border-b border-gray-100 rounded-t-lg p-4 sm:p-6 lg:p-8">
              <div className="text-center">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-6 h-6 sm:w-10 sm:h-10 text-primary" />
                </div>
                <CardTitle className="text-xl sm:text-2xl text-gray-900 mb-2">
                  Agreement Signed by You
                </CardTitle>
                <p className="text-sm sm:text-base text-gray-600 max-w-2xl mx-auto">
                  Waiting for the housemate to review and sign the agreement
                </p>
              </div>
            </CardHeader>
            <CardContent className="p-4 sm:p-6 lg:p-8 bg-white rounded-b-lg">
              <div className="space-y-6 sm:space-y-8">
                {/* Application Details */}
                <div className="bg-gray-50 border border-gray-200 rounded-2xl p-4 sm:p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 sm:mb-6 text-center">Agreement Details</h3>
                  
                  {/* Desktop grid layout */}
                  <div className="hidden sm:grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                    <div className="text-center">
                      <label className="text-sm font-medium text-gray-500">Housemate</label>
                      <p className="text-lg font-semibold text-gray-900 mt-1">
                        {application.housemate.firstName} {application.housemate.lastName}
                      </p>
                    </div>
                    <div className="text-center">
                      <label className="text-sm font-medium text-gray-500">Property</label>
                      <p className="text-lg font-semibold text-gray-900 mt-1">{application.product.name}</p>
                    </div>
                    <div className="text-center">
                      <label className="text-sm font-medium text-gray-500">Monthly Rate</label>
                      <p className="text-lg font-semibold text-gray-900 mt-1">${application.product.price}</p>
                    </div>
                  </div>

                  {/* Mobile stacked layout */}
                  <div className="sm:hidden space-y-4 mb-6">
                    <div className="bg-white rounded-xl p-4 border border-gray-100">
                      <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Housemate</label>
                      <p className="text-lg font-semibold text-gray-900 mt-1">
                        {application.housemate.firstName} {application.housemate.lastName}
                      </p>
                    </div>
                    <div className="bg-white rounded-xl p-4 border border-gray-100">
                      <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Property</label>
                      <p className="text-lg font-semibold text-gray-900 mt-1">{application.product.name}</p>
                    </div>
                    <div className="bg-white rounded-xl p-4 border border-gray-100">
                      <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Monthly Rate</label>
                      <p className="text-lg font-semibold text-gray-900 mt-1">${application.product.price}</p>
                    </div>
                  </div>

                  {application.moveInDate && (
                    <>
                      {/* Desktop dates layout */}
                      <div className="hidden sm:grid grid-cols-1 lg:grid-cols-2 gap-6 pt-4 border-t border-gray-200">
                        <div className="text-center">
                          <label className="text-sm font-medium text-gray-500">Move-in Date</label>
                          <p className="text-lg font-semibold text-gray-900 mt-1">
                            {new Date(application.moveInDate).toLocaleDateString()}
                          </p>
                        </div>
                        {application.moveOutDate && (
                          <div className="text-center">
                            <label className="text-sm font-medium text-gray-500">Move-out Date</label>
                            <p className="text-lg font-semibold text-gray-900 mt-1">
                              {new Date(application.moveOutDate).toLocaleDateString()}
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Mobile dates layout */}
                      <div className="sm:hidden space-y-4 pt-4 border-t border-gray-200">
                        <div className="bg-white rounded-xl p-4 border border-gray-100">
                          <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Move-in Date</label>
                          <p className="text-lg font-semibold text-gray-900 mt-1">
                            {new Date(application.moveInDate).toLocaleDateString()}
                          </p>
                        </div>
                        {application.moveOutDate && (
                          <div className="bg-white rounded-xl p-4 border border-gray-100">
                            <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Move-out Date</label>
                            <p className="text-lg font-semibold text-gray-900 mt-1">
                              {new Date(application.moveOutDate).toLocaleDateString()}
                            </p>
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </div>

                <div className="bg-gradient-to-r from-amber/5 to-amber/10 border border-amber/20 rounded-2xl p-4 sm:p-6 text-center">
                  <div className="w-12 h-12 bg-amber/10 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Clock className="w-6 h-6 text-amber-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Waiting for Housemate</h3>
                  <p className="text-sm sm:text-base text-gray-600 max-w-2xl mx-auto">
                    You have successfully signed the agreement. The housemate has been notified and will receive a link to review and sign the agreement.
                    Once they sign, the agreement will be fully executed.
                  </p>
                </div>

                {/* Signature status - Desktop grid, Mobile stack */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <div className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow">
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

                {/* Actions - Mobile stack, Desktop row */}
                <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-100">
                  <div className="flex-1">
                    <HomeownerAgreementActions 
                      agreement={agreement}
                      applicationId={applicationId}
                    />
                  </div>
                  <Button 
                    asChild 
                    variant="outline" 
                    className="flex items-center justify-center gap-2 px-4 sm:px-6 py-3 rounded-xl border-2 hover:bg-gray-50 transition-colors min-h-[44px]"
                  >
                    <a href="/homeowner/applications">
                      <ArrowLeft className="h-4 w-4" />
                      <span className="hidden sm:inline">Back to Applications</span>
                      <span className="sm:hidden">Back</span>
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