import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Sparkles, ArrowRight } from "lucide-react";

import { SellForm } from "../components/form/Sellform";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import prisma from "../lib/db";
import { redirect } from "next/navigation";
import { unstable_noStore as noStore } from "next/cache";

async function getData(userId: string) {
  const data = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      stripeConnectedLinked: true,
    },
  });

  if (data?.stripeConnectedLinked === false) {
    return redirect("/billing");
  }

  return null;
}

export default async function SellRoute() {
  noStore();
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }
  const data = await getData(user.id);
  return (
    <section className="max-w-7xl mx-auto px-4 md:px-8 mb-14">
      {/* New Wizard Promotion Banner */}
      <div className="mb-8 p-8 bg-gradient-to-r from-primary/10 to-blue-50 border border-primary/20 rounded-2xl">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
          <div className="flex-1 text-center lg:text-left">
            <div className="flex items-center justify-center lg:justify-start gap-2 mb-4">
              <Sparkles className="w-6 h-6 text-primary" />
              <span className="inline-block px-3 py-1 bg-primary/20 text-primary text-sm font-medium rounded-full">
                New & Improved
              </span>
            </div>
            <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-3">
              Create Your Listing with Our Step-by-Step Wizard
            </h2>
            <p className="text-gray-600 text-lg mb-4">
              Our new guided wizard makes creating a listing easier than ever. Get step-by-step help with photos, descriptions, pricing, and more.
            </p>
            <ul className="text-sm text-gray-700 space-y-1 mb-6">
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                <span>Step-by-step guidance through the entire process</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                <span>Helpful tips and examples for each section</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                <span>Visual progress tracking and validation</span>
              </li>
            </ul>
          </div>
          <div className="flex-shrink-0">
            <Link href="/sell/wizard">
              <Button size="lg" className="text-lg px-8 py-4 h-auto">
                <Sparkles className="w-5 h-5 mr-2" />
                Try the New Wizard
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Legacy Form */}
      <div className="space-y-4">
        <div className="text-center">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Or use the classic form
          </h3>
          <p className="text-gray-600">
            Prefer the traditional approach? You can still use our original listing form below.
          </p>
        </div>
        <Card>
          <SellForm />
        </Card>
      </div>
    </section>
  );
}