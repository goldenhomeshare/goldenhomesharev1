import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation";
import prisma from "../../../lib/db";
import { HousemateAgreementReview } from "@/components/HousemateAgreementReview";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, AlertTriangle, Clock } from "lucide-react";

async function getApplicationWithAgreement(applicationId: string, userId: string) {
  try {
    const application = await prisma.application.findUnique({
      where: {
        id: applicationId,
        housemateId: userId,
        status: "APPROVED",
      },
      include: {
        product: {
          include: {
            User: true,
          },
        },
        housemate: true,
        agreement: true,
      },
    });

    return application;
  } catch (error) {
    console.error("Error fetching application:", error);
    return null;
  }
}

export default async function HousemateAgreementPage({
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

  const application = await getApplicationWithAgreement(applicationId, user.id);

  if (!application) {
    redirect("/housemate/applications");
  }

  // If no agreement exists, redirect to applications with message
  if (!application.agreement) {
    redirect("/housemate/applications?message=no-agreement");
  }

  const agreement = application.agreement;

  // If housemate has already signed, redirect to billing
  if (agreement.housemateSigned) {
    redirect(`/billing?application=${applicationId}`);
  }

  // If homeowner hasn't signed yet, show waiting message
  if (!agreement.homeownerSigned) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-amber-600" />
                Agreement Pending
              </CardTitle>
              <CardDescription>
                Waiting for homeowner to complete the agreement
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <div className="flex justify-center mb-4">
                  <div className="p-3 bg-amber-100 rounded-full">
                    <Clock className="h-8 w-8 text-amber-600" />
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-amber-800 mb-2">
                  Agreement Created
                </h3>
                <p className="text-amber-700 mb-6">
                  The homeowner has created your agreement but hasn't signed it yet. 
                  You'll receive a notification once they complete their signature.
                </p>
                <p className="text-sm text-gray-600">
                  Property: <strong>{application.product.name}</strong><br />
                  Homeowner: <strong>{application.product.User?.firstName} {application.product.User?.lastName}</strong>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-blue-600/10 rounded-xl flex items-center justify-center">
              <CheckCircle className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Review Agreement</h1>
              <p className="text-gray-600">
                Review and sign your agreement for {application.product.name}
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
              Your application has been approved and an agreement is ready for your review
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <label className="text-sm font-medium text-gray-500">Property</label>
                <p className="text-lg font-semibold">{application.product.name}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Homeowner</label>
                <p className="text-lg font-semibold">
                  {application.product.User?.firstName} {application.product.User?.lastName}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Monthly Rate</label>
                <p className="text-lg font-semibold">${application.product.price}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Agreement Review Component */}
        <HousemateAgreementReview 
          application={application}
          agreement={agreement}
        />
      </div>
    </div>
  );
} 