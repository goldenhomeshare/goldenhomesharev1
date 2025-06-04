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
  import { CheckCircle, Home, CreditCard } from "lucide-react";
  import Link from "next/link";
  import { redirect } from "next/navigation";
  
  async function getData(userId: string) {
    const data = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        stripeConnectedLinked: true,
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
        {approvedApplication && (
          <div className="mb-8">
            <Card className="border-green-200 bg-green-50">
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                  <div>
                    <CardTitle className="text-green-800">Application Approved!</CardTitle>
                    <CardDescription className="text-green-700">
                      Your application for {approvedApplication.product.name} has been approved.
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium text-green-800">Property Details:</h4>
                      <p className="text-sm text-green-700">
                        {approvedApplication.product.name}
                      </p>
                      <p className="text-sm text-green-700">
                        ${approvedApplication.product.price}/month
                      </p>
                      <p className="text-sm text-green-700">
                        {approvedApplication.product.address}
                      </p>
                    </div>
                    <div>
                      <h4 className="font-medium text-green-800">Homeowner:</h4>
                      <p className="text-sm text-green-700">
                        {approvedApplication.product.User?.firstName} {approvedApplication.product.User?.lastName}
                      </p>
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t border-green-200">
                    <p className="text-sm text-green-700 mb-4">
                      Complete your payment setup below to finalize your booking.
                    </p>
                    <div className="flex gap-2">
                      <Link href={`/product/${approvedApplication.product.id}`}>
                        <Button variant="outline" size="sm">
                          <Home className="h-4 w-4 mr-2" />
                          View Property
                        </Button>
                      </Link>
                      <Link href={`/homeowner/messages?housemate=${user.id}&product=${approvedApplication.product.id}`}>
                        <Button variant="outline" size="sm">
                          Contact Homeowner
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
  
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <CreditCard className="h-6 w-6" />
              <span>Billing & Payments</span>
            </CardTitle>
            <CardDescription>
              {approvedApplication 
                ? "Set up your payment method to complete your booking"
                : "Find all your details regarding your payments"
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            {data?.stripeConnectedLinked === false && (
              <div className="space-y-4">
                {approvedApplication && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="font-medium text-blue-800 mb-2">Next Steps:</h4>
                    <ol className="list-decimal list-inside text-sm text-blue-700 space-y-1">
                      <li>Link your account to Stripe for secure payments</li>
                      <li>Set up your payment method</li>
                      <li>Complete your first month's payment</li>
                      <li>Coordinate move-in details with your homeowner</li>
                    </ol>
                  </div>
                )}
                <form action={CreateStripeAccoutnLink}>
                  <Submitbutton title="Link your Account to Stripe" />
                </form>
              </div>
            )}
  
            {data?.stripeConnectedLinked === true && (
              <div className="space-y-4">
                {approvedApplication && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <h4 className="font-medium text-green-800">Payment Setup Complete!</h4>
                    </div>
                    <p className="text-sm text-green-700 mb-3">
                      Your payment method is set up. You can now proceed with your booking.
                    </p>
                    <form action={ProcessApplicationPayment}>
                      <input type="hidden" name="applicationId" value={approvedApplication.id} />
                      <Button className="bg-green-600 hover:bg-green-700">
                        Complete Booking Payment
                      </Button>
                    </form>
                  </div>
                )}
                
                <form action={GetStripeDashboardLink}>
                  <Submitbutton title="View Payment Dashboard" />
                </form>
              </div>
            )}
          </CardContent>
        </Card>
  
        {approvedApplication && (
          <div className="mt-8">
            <Card>
              <CardHeader>
                <CardTitle>Important Information</CardTitle>
              </CardHeader>
              <CardContent className="prose prose-sm max-w-none">
                <ul className="space-y-2">
                  <li>
                    <strong>Move-in Process:</strong> Coordinate with your homeowner to schedule a move-in date and time.
                  </li>
                  <li>
                    <strong>Payment Schedule:</strong> Your first month's contribution is due upon booking completion. Subsequent payments will be processed monthly.
                  </li>
                  <li>
                    <strong>House Rules:</strong> Please review any house rules and guidelines with your homeowner before moving in.
                  </li>
                  <li>
                    <strong>Communication:</strong> Use our messaging system to stay in touch with your homeowner.
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        )}
      </section>
    );
  }