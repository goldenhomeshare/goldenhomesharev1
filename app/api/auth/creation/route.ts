import prisma from "@/app/lib/db";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { NextResponse } from "next/server";
import { unstable_noStore as noStore } from "next/cache";

export async function GET() {
  noStore();
  
  try {
    const { getUser } = getKindeServerSession();
    const user = await getUser();

    if (!user || user === null || !user.id) {
      throw new Error("Something went wrong...");
    }

    let dbUser = await prisma.user.findUnique({
      where: {
        id: user.id,
      },
    });

    if (!dbUser) {
      // Create user without Stripe Connect account initially
      // Connect accounts will be created only when users become homeowners
      dbUser = await prisma.user.create({
        data: {
          id: user.id,
          firstName: user.given_name ?? "",
          lastName: user.family_name ?? "",
          email: user.email ?? "",
          connectedAccountId: null,
          profileImage:
            user.picture ?? `https://avatar.vercel.sh/${user.given_name}`,
          // connectedAccountId is optional now - will be set when user becomes homeowner
          stripeConnectedLinked: false,
        },
      });
    }

    // Check if user needs onboarding
    const baseUrl = process.env.NODE_ENV === "development"
      ? "http://localhost:3000"
      : `https://${process.env.NEXT_PUBLIC_APP_URL || process.env.VERCEL_URL || 'goldenhomeshare.com'}`;

    // For now, always redirect to onboarding for new multi-tenant setup
    // We'll check user type and profiles from the onboarding page itself
    return NextResponse.redirect(`${baseUrl}/onboarding`);
    
  } catch (error) {
    console.error("Error during user creation:", error);
    
    // Fallback to onboarding if there's an error
    const baseUrl = process.env.NODE_ENV === "development"
      ? "http://localhost:3000"
      : `https://${process.env.NEXT_PUBLIC_APP_URL || process.env.VERCEL_URL || 'goldenhomeshare.com'}`;
      
    return NextResponse.redirect(`${baseUrl}/onboarding`);
  }
}
