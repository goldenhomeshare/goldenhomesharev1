import { NextRequest, NextResponse } from "next/server";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { stripe } from "@/app/lib/stripe";
import prisma from "@/app/lib/db";

export async function GET(request: NextRequest) {
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
        error: "No Stripe account found for user",
        user: dbUser 
      }, { status: 404 });
    }

    // Fetch account details from Stripe
    const account = await stripe.accounts.retrieve(dbUser.connectedAccountId);

    // Calculate what our webhook logic would determine
    const calculatedIsLinked = account.charges_enabled && 
                              account.payouts_enabled && 
                              account.details_submitted &&
                              (account.capabilities?.transfers === "active" || 
                               account.capabilities?.transfers === "pending");

    return NextResponse.json({
      user: {
        id: dbUser.id,
        email: dbUser.email,
        stripeConnectedLinked: dbUser.stripeConnectedLinked,
      },
      stripe_account: {
        id: account.id,
        charges_enabled: account.charges_enabled,
        payouts_enabled: account.payouts_enabled,
        details_submitted: account.details_submitted,
        transfers_capability: account.capabilities?.transfers,
        card_payments_capability: account.capabilities?.card_payments,
      },
      calculated_linked_status: calculatedIsLinked,
      status_match: dbUser.stripeConnectedLinked === calculatedIsLinked,
    });

  } catch (error) {
    console.error("Error checking Stripe account status:", error);
    return NextResponse.json({ 
      error: "Failed to check account status",
      details: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 });
  }
}

// POST endpoint to manually sync account status
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

    // Calculate what the status should be
    const shouldBeLinked = account.charges_enabled && 
                          account.payouts_enabled && 
                          account.details_submitted &&
                          (account.capabilities?.transfers === "active" || 
                           account.capabilities?.transfers === "pending");

    // Update the database if needed
    if (dbUser.stripeConnectedLinked !== shouldBeLinked) {
      await prisma.user.update({
        where: {
          id: user.id,
        },
        data: {
          stripeConnectedLinked: shouldBeLinked,
        },
      });

      return NextResponse.json({
        message: "Account status updated",
        previous_status: dbUser.stripeConnectedLinked,
        new_status: shouldBeLinked,
        account_details: {
          charges_enabled: account.charges_enabled,
          payouts_enabled: account.payouts_enabled,
          details_submitted: account.details_submitted,
          transfers_capability: account.capabilities?.transfers,
        }
      });
    } else {
      return NextResponse.json({
        message: "Account status already correct",
        status: shouldBeLinked,
        account_details: {
          charges_enabled: account.charges_enabled,
          payouts_enabled: account.payouts_enabled,
          details_submitted: account.details_submitted,
          transfers_capability: account.capabilities?.transfers,
        }
      });
    }

  } catch (error) {
    console.error("Error syncing Stripe account status:", error);
    return NextResponse.json({ 
      error: "Failed to sync account status",
      details: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 });
  }
} 