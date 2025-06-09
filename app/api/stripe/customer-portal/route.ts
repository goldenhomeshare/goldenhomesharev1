import { NextResponse } from "next/server";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { stripe } from "@/app/lib/stripe";
import prisma from "@/app/lib/db";

export async function POST() {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Get the user's active subscription to find their customer ID
    const subscription = await prisma.subscription.findFirst({
      where: {
        housemateId: user.id,
        status: {
          in: ["ACTIVE", "TRIALING", "PAST_DUE"]
        }
      },
      orderBy: {
        createdAt: "desc"
      }
    });

    if (!subscription) {
      return NextResponse.json({ 
        error: "No active subscription found" 
      }, { status: 404 });
    }

    // Create a portal session using the customer ID from the subscription
    const portalSession = await stripe.billingPortal.sessions.create({
      customer: subscription.stripeCustomerId,
      return_url: process.env.NODE_ENV === "development"
        ? `http://localhost:3000/billing`
        : `https://${process.env.NEXT_PUBLIC_APP_URL || process.env.VERCEL_URL || 'goldenhomeshare.com'}/billing`,
    });

    return NextResponse.json({ 
      url: portalSession.url 
    });

  } catch (error) {
    console.error("Error creating customer portal session:", error);
    return NextResponse.json({ 
      error: "Failed to create customer portal session",
      details: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 });
  }
} 