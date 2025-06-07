import prisma from "@/app/lib/db";
import { stripe } from "@/app/lib/stripe";

import { headers } from "next/headers";

export async function POST(req: Request) {
  const body = await req.text();

  const headersList = await headers();
  const signature = headersList.get("Stripe-Signature") as string;

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_CONNECT_WEBHOOK_SECRET as string
    );
  } catch (error: unknown) {
    console.error("Stripe webhook signature verification failed:", error);
    return new Response("webhook error", { status: 400 });
  }

  console.log(`Processing Stripe Connect webhook: ${event.type}`);

  switch (event.type) {
    case "account.updated": {
      const account = event.data.object;
      console.log(`Account updated: ${account.id}`, {
        charges_enabled: account.charges_enabled,
        payouts_enabled: account.payouts_enabled,
        transfers: account.capabilities?.transfers,
        details_submitted: account.details_submitted,
      });

      try {
        const user = await prisma.user.findUnique({
          where: {
            connectedAccountId: account.id,
          },
        });

        if (!user) {
          console.error(`User not found for account: ${account.id}`);
          break;
        }

        // Determine if the account is fully linked and ready for payments
        const isLinked = account.charges_enabled && 
                        account.payouts_enabled && 
                        account.details_submitted &&
                        (account.capabilities?.transfers === "active" || 
                         account.capabilities?.transfers === "pending");

        const data = await prisma.user.update({
          where: {
            connectedAccountId: account.id,
          },
          data: {
            stripeConnectedLinked: isLinked,
          },
        });

        console.log(`Updated user ${user.id} (${user.email}) stripeConnectedLinked to: ${isLinked}`);
      } catch (error) {
        console.error("Error updating user in account.updated webhook:", error);
      }
      break;
    }

    case "capability.updated": {
      const capability = event.data.object;
      const accountId = typeof capability.account === 'string' ? capability.account : capability.account.id;
      
      console.log(`Capability updated: ${accountId} - ${capability.id}`, {
        status: capability.status,
      });

      try {
        // Fetch the full account to check all capabilities
        const account = await stripe.accounts.retrieve(accountId);
        
        const user = await prisma.user.findUnique({
          where: {
            connectedAccountId: accountId,
          },
        });

        if (!user) {
          console.error(`User not found for account: ${accountId}`);
          break;
        }

        // Determine if the account is fully linked and ready for payments
        const isLinked = account.charges_enabled && 
                        account.payouts_enabled && 
                        account.details_submitted &&
                        (account.capabilities?.transfers === "active" || 
                         account.capabilities?.transfers === "pending");

        const data = await prisma.user.update({
          where: {
            connectedAccountId: accountId,
          },
          data: {
            stripeConnectedLinked: isLinked,
          },
        });

        console.log(`Updated user ${user.id} (${user.email}) stripeConnectedLinked to: ${isLinked} (capability update)`);
      } catch (error) {
        console.error("Error updating user in capability.updated webhook:", error);
      }
      break;
    }

    case "account.application.deauthorized": {
      const account = event.data.object;
      console.log(`Account deauthorized: ${account.id}`);

      try {
        const user = await prisma.user.findUnique({
          where: {
            connectedAccountId: account.id,
          },
        });

        if (user) {
          const data = await prisma.user.update({
            where: {
              connectedAccountId: account.id,
            },
            data: {
              stripeConnectedLinked: false,
            },
          });

          console.log(`Deauthorized account for user ${user.id} (${user.email}), set stripeConnectedLinked to false`);
        } else {
          console.warn(`User not found for deauthorized account: ${account.id}`);
        }
      } catch (error) {
        console.error("Error handling account deauthorization:", error);
      }
      break;
    }

    default: {
      console.log(`Unhandled Stripe Connect event: ${event.type}`);
    }
  }

  return new Response(null, { status: 200 });
}
