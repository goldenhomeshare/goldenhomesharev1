import { stripe } from "../app/lib/stripe";

async function checkConnectedCustomers() {
  const connectedAccountId = "acct_1RXNcMPWpw67qku5"; // From your previous output
  
  console.log(`🔍 Checking customers on connected account: ${connectedAccountId}\n`);

  try {
    // Get customers on the connected account
    const customers = await stripe.customers.list(
      { limit: 10 },
      { stripeAccount: connectedAccountId }
    );

    console.log("👥 Customers on Connected Account:");
    console.log("=".repeat(50));
    
    if (customers.data.length === 0) {
      console.log("❌ No customers found on this connected account.");
      console.log("\n💡 To create a customer on the connected account:");
      console.log(`curl https://api.stripe.com/v1/customers \\`);
      console.log(`  -u "sk_test_YOUR_SECRET_KEY:" \\`);
      console.log(`  -H "Stripe-Account: ${connectedAccountId}" \\`);
      console.log(`  -d email="test@example.com" \\`);
      console.log(`  -d name="Test Customer"`);
    } else {
      customers.data.forEach((customer, index) => {
        console.log(`${index + 1}. Customer ID: ${customer.id}`);
        console.log(`   Email: ${customer.email || 'N/A'}`);
        console.log(`   Name: ${customer.name || 'N/A'}`);
        console.log(`   Created: ${new Date(customer.created * 1000).toLocaleDateString()}`);
        console.log("");
      });
      
      console.log("🔧 Example subscription command with connected account customer:");
      console.log("=".repeat(70));
      const firstCustomer = customers.data[0];
      console.log(`curl https://api.stripe.com/v1/subscriptions \\`);
      console.log(`  -u "sk_test_YOUR_SECRET_KEY:" \\`);
      console.log(`  -H "Stripe-Account: ${connectedAccountId}" \\`);
      console.log(`  -d customer=${firstCustomer.id} \\`);
      console.log(`  -d "items[0][price]"=price_1RX82EPYDUhzDPs8yMlaZ69k \\`);
      console.log(`  -d "expand[0]"="latest_invoice.confirmation_secret"`);
    }

    // Also check prices on connected account
    console.log("\n💰 Prices on Connected Account:");
    console.log("=".repeat(50));
    
    const prices = await stripe.prices.list(
      { limit: 5 },
      { stripeAccount: connectedAccountId }
    );
    
    if (prices.data.length === 0) {
      console.log("❌ No prices found on this connected account.");
      console.log("   For direct charges, prices must exist on the connected account.");
      console.log("   Consider using destination charges instead.");
    } else {
      prices.data.forEach((price, index) => {
        console.log(`${index + 1}. Price ID: ${price.id}`);
        console.log(`   Amount: ${price.unit_amount ? price.unit_amount / 100 : 'N/A'} ${price.currency?.toUpperCase()}`);
        console.log(`   Recurring: ${price.recurring ? `${price.recurring.interval}ly` : 'One-time'}`);
        console.log("");
      });
    }

  } catch (error) {
    console.error("❌ Error checking connected account:", error);
  }
}

checkConnectedCustomers(); 