import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Check, CreditCard } from "lucide-react";
import Link from "next/link";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";

export default async function ReturnUrlStripe({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { getUser } = getKindeServerSession();
  const user = await getUser();
  
  if (!user) {
    redirect("/api/auth/login");
  }

  const currentUser = await getCurrentUser();
  const userType = currentUser?.userType;
  const { id: accountId } = await params;

  return (
    <section className="w-full min-h-[80vh] flex items-center justify-center">
      <Card className="w-[400px]">
        <div className="p-6">
          <div className="w-full flex justify-center">
            <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center">
              <Check className="w-8 h-8 text-green-600" />
            </div>
          </div>
          <div className="mt-3 text-center sm:mt-5 w-full">
            <h3 className="text-xl leading-6 font-semibold text-gray-900">
              Payment Setup Complete!
            </h3>
            <p className="mt-3 text-sm text-gray-600 leading-relaxed">
              {userType === "HOMEOWNER" 
                ? "Your Stripe Connect account has been successfully set up. You can now receive payments from housemates and create agreements."
                : "Your Stripe account has been successfully linked. You can now make secure payments for your homesharing bookings."
              }
            </p>

            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center gap-3">
                <CreditCard className="w-5 h-5 text-blue-600" />
                <div className="text-left">
                  <p className="text-sm font-medium text-blue-900">
                    {userType === "HOMEOWNER" ? "Ready to Receive Payments" : "Ready for Payments"}
                  </p>
                  <p className="text-xs text-blue-700">
                    {userType === "HOMEOWNER" 
                      ? "You can now create agreements and receive monthly payments from housemates"
                      : "You can now complete bookings and set up automatic monthly payments"
                    }
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6 space-y-3">
              <Button className="w-full" asChild>
                <Link href="/billing">Continue to Billing</Link>
              </Button>
              <Button variant="outline" className="w-full" asChild>
                <Link href={userType === "HOMEOWNER" ? "/homeowner/dashboard" : "/housemate/dashboard"}>
                  Back to Dashboard
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </section>
  );
}