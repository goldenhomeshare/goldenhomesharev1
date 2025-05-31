import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation";
import { unstable_noStore as noStore } from "next/cache";
import prisma from "../lib/db";
import { ListingWizard } from "./wizard/components/ListingWizard";
import Link from "next/link";

async function getData(userId: string) {
  try {
    const data = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        stripeConnectedLinked: true,
        firstName: true,
        lastName: true,
        email: true,
      },
    });

    // Removed Stripe connection requirement for creating listings
    // if (data?.stripeConnectedLinked === false) {
    //   return redirect("/billing");
    // }

    return data;
  } catch (error) {
    console.error("Database error in listing wizard:", error);
    throw new Error("Database connection failed");
  }
}

export default async function SellRoute() {
  noStore();
  
  try {
    const { getUser } = getKindeServerSession();
    const user = await getUser();

    if (!user) {
      return redirect("/api/auth/login?post_login_redirect_url=/sell");
    }

    const userData = await getData(user.id);

    return (
      <ListingWizard 
        userId={user.id}
        firstName={userData?.firstName || ""}
        lastName={userData?.lastName || ""}
        email={userData?.email || ""}
      />
    );
  } catch (error) {
    console.error("Error in listing wizard page:", error);
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
          <h1 className="text-xl font-semibold text-red-600 mb-4">Error Loading Listing Form</h1>
          <p className="text-gray-600 mb-4">
            There was an error loading the listing form. This could be due to:
          </p>
          <ul className="list-disc list-inside text-sm text-gray-600 space-y-1 mb-4">
            <li>Authentication issues - please try logging in again</li>
            <li>Database connection problems</li>
          </ul>
          <div className="space-y-2">
            <Link 
              href="/api/auth/login?post_login_redirect_url=/sell"
              className="block w-full text-center bg-primary text-white px-4 py-2 rounded hover:bg-primary/90"
            >
              Login / Try Again
            </Link>
            <Link 
              href="/"
              className="block w-full text-center bg-gray-100 text-gray-700 px-4 py-2 rounded hover:bg-gray-200"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }
}