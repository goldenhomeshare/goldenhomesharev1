import prisma from "../app/lib/db";
import { stripe } from "../app/lib/stripe";

async function getStripeIds() {
  console.log("🔍 Fetching Stripe IDs for testing...\n");

  try {
    // Get all users with connected accounts
    const users = await prisma.user.findMany({
      where: {
        connectedAccountId: {
          not: ""
        }
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        connectedAccountId: true,
        stripeConnectedLinked: true
      }
    });

    console.log("📋 Connected Accounts:");
    console.log("=".repeat(50));
    
    if (users.length === 0) {
      console.log("❌ No users with connected accounts found.");
      console.log("   You need to create a user and set up Stripe Connect first.");
      return;
    }

    users.forEach((user, index) => {
      console.log(`${index + 1}. User: ${user.firstName} ${user.lastName} (${user.email})`);
      console.log(`   Connected Account ID: ${user.connectedAccountId}`);
      console.log(`   Linked: ${user.stripeConnectedLinked ? '✅' : '❌'}`);
      console.log("");
    });

    // Get some example customers from Stripe
    console.log("👥 Sample Customers from Stripe:");
    console.log("=".repeat(50));
    
    const customers = await stripe.customers.list({ limit: 5 });
    
    if (customers.data.length === 0) {
      console.log("❌ No customers found in Stripe.");
      console.log("   You can create one with: stripe.customers.create()");
    } else {
      customers.data.forEach((customer, index) => {
        console.log(`${index + 1}. Customer ID: ${customer.id}`);
        console.log(`   Email: ${customer.email || 'N/A'}`);
        console.log(`   Name: ${customer.name || 'N/A'}`);
        console.log("");
      });
    }

    // Get some example prices from Stripe
    console.log("💰 Sample Prices from Stripe:");
    console.log("=".repeat(50));
    
    const prices = await stripe.prices.list({ limit: 5 });
    
    if (prices.data.length === 0) {
      console.log("❌ No prices found in Stripe.");
      console.log("   You can create one with: stripe.prices.create()");
    } else {
      prices.data.forEach((price, index) => {
        console.log(`${index + 1}. Price ID: ${price.id}`);
        console.log(`   Amount: ${price.unit_amount ? price.unit_amount / 100 : 'N/A'} ${price.currency?.toUpperCase()}`);
        console.log(`   Recurring: ${price.recurring ? `${price.recurring.interval}ly` : 'One-time'}`);
        console.log(`   Product: ${price.product}`);
        console.log("");
      });
    }

    console.log("🔧 Example curl command with real values:");
    console.log("=".repeat(50));
    
    if (users.length > 0 && customers.data.length > 0 && prices.data.length > 0) {
      const exampleUser = users[0];
      const exampleCustomer = customers.data[0];
      const examplePrice = prices.data[0];
      
      console.log(`curl https://api.stripe.com/v1/subscriptions \\`);
      console.log(`  -u "sk_test_YOUR_SECRET_KEY:" \\`);
      console.log(`  -H "Stripe-Account: ${exampleUser.connectedAccountId}" \\`);
      console.log(`  -d customer=${exampleCustomer.id} \\`);
      console.log(`  -d "items[0][price]"=${examplePrice.id} \\`);
      console.log(`  -d "expand[0]"="latest_invoice.confirmation_secret"`);
    } else {
      console.log("❌ Missing required data for example command.");
      console.log("   Make sure you have users, customers, and prices set up.");
    }

  } catch (error) {
    console.error("❌ Error fetching Stripe IDs:", error);
  } finally {
    await prisma.$disconnect();
  }
}

getStripeIds(); 