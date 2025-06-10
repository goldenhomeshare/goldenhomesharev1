import prisma from "../app/lib/db";
import { stripe } from "../app/lib/stripe";

async function fixStripeConnect() {
  console.log("🔧 Diagnosing and fixing Stripe Connect issue...\n");

  try {
    // Step 1: Check current Stripe configuration
    console.log("1️⃣ Checking Stripe Configuration:");
    console.log("=".repeat(50));
    
    const secretKey = process.env.STRIPE_SECRET_KEY;
    const webhookSecret = process.env.STRIPE_CONNECT_WEBHOOK_SECRET;
    
    console.log(`STRIPE_SECRET_KEY: ${secretKey ? secretKey.substring(0, 12) + '...' : 'NOT SET'}`);
    console.log(`Key Type: ${secretKey?.startsWith('sk_live_') ? '✅ LIVE' : secretKey?.startsWith('sk_test_') ? '❌ TEST' : '❓ UNKNOWN'}`);
    console.log(`Connect Webhook Secret: ${webhookSecret ? '✅ SET' : '❌ NOT SET'}`);
    console.log("");

    // Step 2: Test Stripe connection
    console.log("2️⃣ Testing Stripe Connection:");
    console.log("=".repeat(50));
    
    try {
      const account = await stripe.accounts.retrieve();
      console.log(`✅ Stripe connection successful`);
      console.log(`Account ID: ${account.id}`);
      console.log(`Mode: ${secretKey?.startsWith('sk_live_') ? 'LIVE' : 'TEST'}`);
      console.log("");
    } catch (error) {
      console.error("❌ Stripe connection failed:", error);
      console.log("🚨 ISSUE: Invalid or missing Stripe keys");
      console.log("📝 ACTION REQUIRED: Update your .env file with valid Stripe keys");
      return;
    }

    // Step 3: Check database for existing Connect accounts
    console.log("3️⃣ Checking Existing Connect Accounts:");
    console.log("=".repeat(50));
    
    const usersWithConnect = await prisma.user.findMany({
      where: {
        OR: [
          { connectedAccountId: { not: null } },
          { stripeConnectedLinked: true }
        ]
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        connectedAccountId: true,
        stripeConnectedLinked: true,
        userType: true
      }
    });

    if (usersWithConnect.length === 0) {
      console.log("✅ No existing Connect accounts found. Ready for fresh setup.");
      console.log("");
    } else {
      console.log(`📋 Found ${usersWithConnect.length} users with Connect data:`);
      usersWithConnect.forEach((user, index) => {
        console.log(`${index + 1}. ${user.firstName} ${user.lastName} (${user.email})`);
        console.log(`   Type: ${user.userType}, Account: ${user.connectedAccountId || 'None'}, Linked: ${user.stripeConnectedLinked}`);
      });
      console.log("");

      // Check if these accounts still exist in Stripe
      console.log("4️⃣ Verifying Connect Accounts in Stripe:");
      console.log("=".repeat(50));
      
      for (const user of usersWithConnect) {
        if (user.connectedAccountId) {
          try {
            const account = await stripe.accounts.retrieve(user.connectedAccountId);
            console.log(`✅ Account ${user.connectedAccountId} exists in Stripe (${user.email})`);
          } catch (error) {
            console.log(`❌ Account ${user.connectedAccountId} NOT found in Stripe (${user.email})`);
            console.log(`   This account was likely deleted with the sandbox.`);
          }
        }
      }
      console.log("");

      // Offer to reset
      console.log("5️⃣ Recommended Action:");
      console.log("=".repeat(50));
      console.log("🚨 ISSUE DETECTED: Some Connect accounts may no longer exist in Stripe.");
      console.log("💡 SOLUTION: Reset all Connect data to allow fresh setup with live keys.");
      console.log("");
      console.log("Run this command to reset all Connect accounts:");
      console.log("npm run stripe:reset");
      console.log("");
    }

    // Step 4: Check webhook configuration
    console.log("6️⃣ Webhook Configuration Check:");
    console.log("=".repeat(50));
    
    if (!webhookSecret) {
      console.log("❌ STRIPE_CONNECT_WEBHOOK_SECRET not set");
      console.log("📝 You need to create a webhook endpoint in your Stripe dashboard:");
      console.log(`   Endpoint URL: ${process.env.NEXT_PUBLIC_APP_URL || 'https://your-domain.com'}/api/stripe/connect`);
      console.log("   Events: account.updated, capability.updated, account.application.deauthorized");
    } else {
      console.log("✅ Webhook secret is configured");
    }
    console.log("");

    // Step 5: Final recommendations
    console.log("7️⃣ Next Steps to Fix:");
    console.log("=".repeat(50));
    console.log("1. Ensure your .env has live Stripe keys:");
    console.log("   STRIPE_SECRET_KEY=sk_live_...");
    console.log("   STRIPE_PUBLISHABLE_KEY=pk_live_...");
    console.log("");
    console.log("2. Reset Connect accounts if needed:");
    console.log("   npm run stripe:reset");
    console.log("");
    console.log("3. Set up webhooks in Stripe dashboard:");
    console.log(`   ${process.env.NEXT_PUBLIC_APP_URL || 'https://your-domain.com'}/api/stripe/connect`);
    console.log("");
    console.log("4. Restart your application:");
    console.log("   npm run dev (development) or restart production server");
    console.log("");
    console.log("5. Test the Connect button at /billing");

  } catch (error) {
    console.error("❌ Error during diagnosis:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the script
fixStripeConnect()
  .then(() => {
    console.log("\n🎉 Diagnosis completed! Follow the recommendations above.");
    process.exit(0);
  })
  .catch((error) => {
    console.error("💥 Script failed:", error);
    process.exit(1);
  }); 