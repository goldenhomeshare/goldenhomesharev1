import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card";
  import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
  import prisma from "../lib/db";
  import { Button } from "@/components/ui/button";
  import { CreateStripeAccoutnLink, GetStripeDashboardLink, ProcessApplicationPayment } from "../actions";
  import { Submitbutton } from "../components/SubmitButtons";
  import { unstable_noStore as noStore } from "next/cache";
  import { Badge } from "@/components/ui/badge";
  import { CheckCircle, Home, CreditCard, FileText, Clock } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { HousemateAgreementActions } from "@/components/HousemateAgreementActions";
import { getCurrentUser } from "@/lib/auth";
  
  async function getData(userId: string) {
    const data = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        stripeConnectedLinked: true,
        connectedAccountId: true,
      },
    });
  
    return data;
  }
  
  async function getApprovedApplication(applicationId: string, userId: string) {
    const application = await prisma.application.findUnique({
      where: {
        id: applicationId,
        housemateId: userId,
        status: "APPROVED",
      },
      include: {
        product: {
          include: {
            User: {
              include: {
                homeownerProfile: true,
              },
            },
          },
        },
        agreement: true,
      },
    });
  
    return application;
  }
  
  export default async function BillingRoute({
    searchParams,
  }: {
    searchParams: Promise<{ application?: string }>;
  }) {
    noStore();
    const { getUser } = getKindeServerSession();
    const user = await getUser();
  
    if (!user) {
      throw new Error("Unauthorized");
    }
  
    const data = await getData(user.id);
    const currentUser = await getCurrentUser();
    const userType = currentUser?.userType;
    const resolvedSearchParams = await searchParams;
    const applicationId = resolvedSearchParams.application;
    
    let approvedApplication = null;
    if (applicationId) {
      approvedApplication = await getApprovedApplication(applicationId, user.id);
      
      // Check if housemate needs to review and sign the agreement first
      if (approvedApplication && approvedApplication.agreement) {
        const agreement = approvedApplication.agreement;
        
        // If agreement exists but housemate hasn't signed, redirect to agreement review
        if (!agreement.housemateSigned) {
          redirect(`/housemate/agreement/${applicationId}`);
        }
      }
    }
  
    return (
      <section className="max-w-7xl mx-auto px-4 md:px-8 py-8">

  
                <Card className="shadow-lg border-0">
          <CardHeader className="bg-gradient-to-r from-primary/5 to-primary/10 border-b border-gray-100 rounded-t-lg">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <CreditCard className="w-10 h-10 text-primary" />
              </div>
              <CardTitle className="text-2xl text-gray-900 mb-2">
                Billing & Payments
              </CardTitle>
              <CardDescription className="text-gray-600">
                {userType === "HOMEOWNER" 
                  ? "Set up your Stripe Connect account to receive payments from housemates"
                  : approvedApplication 
                    ? "Complete your subscription payment to secure your housing arrangement"
                    : "Find all your details regarding your payments"
                }
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="p-8 bg-white rounded-b-lg">
            {/* Homeowner needs Stripe Connect, Housemate can proceed to payment */}
            {userType === "HOMEOWNER" && (!data?.stripeConnectedLinked || !data?.connectedAccountId) && (
              <div className="space-y-6">
                <div className="bg-primary/5 border border-primary/20 rounded-2xl p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">Setup Required for Agreement Creation</h3>
                  <p className="text-gray-700 mb-6 text-center">
                    You need to set up Stripe Connect to receive payments from housemates before you can create agreements for approved applications.
                  </p>
                  <ol className="list-decimal list-inside text-gray-700 space-y-2 mb-6">
                    <li>Link your account to Stripe Connect for receiving payments</li>
                    <li>Complete the account verification process</li>
                    <li>Return to create agreements for your approved applications</li>
                  </ol>
                </div>
                <div className="text-center">
                  <form action={CreateStripeAccoutnLink}>
                    <Button type="submit" size="lg" className="bg-primary hover:bg-primary/90 text-lg px-8 py-4">
                      Set up Stripe Connect Account
                    </Button>
                  </form>
                </div>
              </div>
            )}

            {/* Homeowner with Stripe Connect setup */}
            {userType === "HOMEOWNER" && data?.stripeConnectedLinked === true && data?.connectedAccountId && (
              <div className="space-y-6">
                <div className="bg-primary/5 border border-primary/20 rounded-2xl p-6 text-center">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Stripe Connect Setup Complete!</h3>
                  <p className="text-gray-600 mb-6">
                    Your account is now set up to receive payments. You can now create agreements for your approved applications.
                  </p>
                  <Link href="/homeowner/applications">
                    <Button className="bg-primary hover:bg-primary/90">
                      Back to Applications
                    </Button>
                  </Link>
                </div>
                <div className="space-y-4">
                  <div className="flex justify-center">
                    <form action={GetStripeDashboardLink}>
                      <Button variant="outline">
                        <CreditCard className="mr-2 h-4 w-4" />
                        View Stripe Dashboard
                      </Button>
                    </form>
                  </div>
                </div>
              </div>
            )}

            {/* Housemate flow - no Stripe Connect required */}
            {userType === "HOUSEMATE" && (
              <div className="space-y-6">
                {!approvedApplication ? (
                  <div className="bg-gray/5 border border-gray/20 rounded-2xl p-6 text-center">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No Active Applications</h3>
                    <p className="text-gray-600 mb-6">
                      You don't have any approved applications ready for payment at this time.
                    </p>
                    <Link href="/housemate/applications">
                      <Button className="bg-primary hover:bg-primary/90">
                        View Applications
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-8">
                    {approvedApplication.agreement && approvedApplication.agreement.housemateSigned && approvedApplication.agreement.homeownerSigned ? (
                      <div className="space-y-8">
                        {/* Application Details */}
                        <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6">
                          <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">Agreement Details</h3>
                          <div className="grid md:grid-cols-3 gap-6 mb-6">
                            <div className="text-center">
                              <label className="text-sm font-medium text-gray-500">Homeowner</label>
                              <p className="text-lg font-semibold text-gray-900">
                                {approvedApplication.product.User?.firstName} {approvedApplication.product.User?.lastName}
                              </p>
                            </div>
                            <div className="text-center">
                              <label className="text-sm font-medium text-gray-500">Property</label>
                              <p className="text-lg font-semibold text-gray-900">{approvedApplication.product.name}</p>
                            </div>
                            <div className="text-center">
                              <label className="text-sm font-medium text-gray-500">Monthly Rate</label>
                              <p className="text-lg font-semibold text-gray-900">${approvedApplication.product.price}</p>
                            </div>
                          </div>
                        </div>

                        {/* Payment Section */}
                        <div className="bg-primary/5 border border-primary/20 rounded-2xl p-6 text-center">
                          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                            <CreditCard className="w-8 h-8 text-primary" />
                          </div>
                          <h3 className="text-lg font-semibold text-gray-900 mb-2">Ready for Payment!</h3>
                          <p className="text-gray-600 mb-6">
                            Both parties have signed the agreement. Complete your first month's payment to secure your booking.
                          </p>
                          <form action={ProcessApplicationPayment}>
                            <input type="hidden" name="applicationId" value={approvedApplication.id} />
                            <Submitbutton title="Complete Payment" />
                          </form>
                        </div>

                        <div className="space-y-4 pt-6 border-t border-gray-100">
                          <div className="flex-1">
                            <HousemateAgreementActions 
                              agreement={approvedApplication.agreement} 
                              applicationId={approvedApplication.id}
                            />
                          </div>
                          {approvedApplication && (
                            <div className="flex flex-col sm:flex-row gap-4">
                              <Link href={`/product/${approvedApplication.product.id}`} className="flex-1">
                                <Button variant="outline" className="w-full">
                                  <Home className="h-4 w-4 mr-2" />
                                  View Property
                                </Button>
                              </Link>
                              <Link href={`/homeowner/messages?housemate=${user.id}&product=${approvedApplication.product.id}`} className="flex-1">
                                <Button variant="outline" className="w-full">
                                  Contact Homeowner
                                </Button>
                              </Link>
                            </div>
                          )}
                        </div>
                      </div>
                    ) : approvedApplication.agreement && approvedApplication.agreement.housemateSigned && !approvedApplication.agreement.homeownerSigned ? (
                      <div className="space-y-8">
                        {/* Application Details */}
                        <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6">
                          <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">Agreement Details</h3>
                          <div className="grid md:grid-cols-3 gap-6 mb-6">
                            <div className="text-center">
                              <label className="text-sm font-medium text-gray-500">Homeowner</label>
                              <p className="text-lg font-semibold text-gray-900">
                                {approvedApplication.product.User?.firstName} {approvedApplication.product.User?.lastName}
                              </p>
                            </div>
                            <div className="text-center">
                              <label className="text-sm font-medium text-gray-500">Property</label>
                              <p className="text-lg font-semibold text-gray-900">{approvedApplication.product.name}</p>
                            </div>
                            <div className="text-center">
                              <label className="text-sm font-medium text-gray-500">Monthly Rate</label>
                              <p className="text-lg font-semibold text-gray-900">${approvedApplication.product.price}</p>
                            </div>
                          </div>
                        </div>

                        <div className="bg-primary/5 border border-primary/20 rounded-2xl p-6 text-center">
                          <h3 className="text-lg font-semibold text-gray-900 mb-2">Agreement Signed by You</h3>
                          <p className="text-gray-600">
                            You signed the agreement on {new Date(approvedApplication.agreement.housemateSignedAt!).toLocaleDateString()}. 
                            Waiting for homeowner to sign.
                          </p>
                        </div>

                        <div className="space-y-4 pt-6 border-t border-gray-100">
                          <div className="flex-1">
                            <HousemateAgreementActions 
                              agreement={approvedApplication.agreement} 
                              applicationId={approvedApplication.id}
                            />
                          </div>
                          {approvedApplication && (
                            <div className="flex flex-col sm:flex-row gap-4">
                              <Link href={`/product/${approvedApplication.product.id}`} className="flex-1">
                                <Button variant="outline" className="w-full">
                                  <Home className="h-4 w-4 mr-2" />
                                  View Property
                                </Button>
                              </Link>
                              <Link href={`/homeowner/messages?housemate=${user.id}&product=${approvedApplication.product.id}`} className="flex-1">
                                <Button variant="outline" className="w-full">
                                  Contact Homeowner
                                </Button>
                              </Link>
                            </div>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-6">
                        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 text-center">
                          <h3 className="text-lg font-semibold text-amber-800 mb-2">Agreement Pending</h3>
                          <p className="text-amber-700">
                            Your agreement is ready for review and signature.
                          </p>
                          <div className="mt-4">
                            <Link href={`/housemate/agreement/${approvedApplication.id}`}>
                              <Button className="bg-primary hover:bg-primary/90">Review Agreement</Button>
                            </Link>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </section>
    );
  }