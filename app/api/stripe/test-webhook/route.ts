import { NextRequest, NextResponse } from "next/server";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { stripe } from "@/app/lib/stripe";
import prisma from "@/app/lib/db";

export async function POST(request: NextRequest) {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Get user from database
    const dbUser = await prisma.user.findUnique({
      where: {
        id: user.id,
      },
      select: {
        id: true,
        email: true,
        connectedAccountId: true,
        stripeConnectedLinked: true,
      },
    });

    if (!dbUser || !dbUser.connectedAccountId) {
      return NextResponse.json({ 
        error: "No Stripe account found for user" 
      }, { status: 404 });
    }

    // Fetch account details from Stripe
    const account = await stripe.accounts.retrieve(dbUser.connectedAccountId);

    // Calculate what the status should be (same logic as webhook)
    const shouldBeLinked = account.charges_enabled && 
                          account.payouts_enabled && 
                          account.details_submitted &&
                          (account.capabilities?.transfers === "active" || 
                           account.capabilities?.transfers === "pending");

    // Update the database
    const updatedUser = await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        stripeConnectedLinked: shouldBeLinked,
      },
    });

    console.log(`Manual sync: Updated user ${user.id} stripeConnectedLinked from ${dbUser.stripeConnectedLinked} to ${shouldBeLinked}`);

    return NextResponse.json({
      message: "Account status manually synced",
      previous_status: dbUser.stripeConnectedLinked,
      new_status: shouldBeLinked,
      account_details: {
        id: account.id,
        charges_enabled: account.charges_enabled,
        payouts_enabled: account.payouts_enabled,
        details_submitted: account.details_submitted,
        transfers_capability: account.capabilities?.transfers,
      }
    });

  } catch (error) {
    console.error("Error manually syncing Stripe account status:", error);
    return NextResponse.json({ 
      error: "Failed to sync account status",
      details: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 });
  }
} 