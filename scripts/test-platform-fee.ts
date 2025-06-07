import { calculatePlatformFeePercent, calculatePaymentSplit } from "../app/lib/platform-fee";

// Test various listing prices to ensure decimal precision
const testPrices = [150, 250, 320, 380, 475, 500, 650, 800, 1200, 2000];

console.log("🧮 Testing Platform Fee Calculations\n");
console.log("Price".padEnd(8) + "Fee %".padEnd(10) + "Platform".padEnd(12) + "Homeowner".padEnd(12) + "Valid?");
console.log("=".repeat(50));

testPrices.forEach(price => {
  const feePercent = calculatePlatformFeePercent(price);
  const breakdown = calculatePaymentSplit(price);
  
  // Check if percentage has at most 2 decimal places
  const decimalPlaces = (feePercent.toString().split('.')[1] || '').length;
  const isValid = decimalPlaces <= 2;
  
  console.log(
    `$${price}`.padEnd(8) + 
    `${feePercent}%`.padEnd(10) + 
    `$${breakdown.platformFee}`.padEnd(12) + 
    `$${breakdown.connectedAccountAmount}`.padEnd(12) + 
    (isValid ? "✅" : "❌")
  );
});

console.log("\n📊 Edge Cases:");

// Test edge case - exactly $200
const exactFee = calculatePlatformFeePercent(200);
console.log(`$200 listing: ${exactFee}% (should be 95%)`);

// Test edge case - very high price
const highPrice = calculatePlatformFeePercent(5000);
console.log(`$5000 listing: ${highPrice}% (should be 4%)`);

// Test edge case - low price  
const lowPrice = calculatePlatformFeePercent(100);
console.log(`$100 listing: ${lowPrice}% (should be 95%)`);

console.log("\n✅ All calculations complete!"); 