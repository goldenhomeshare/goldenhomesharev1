/**
 * Platform Fee Configuration
 */

// Platform takes a flat $200 fee from all subscriptions/payments
export const PLATFORM_FEE_AMOUNT = 200;

/**
 * Calculate the application fee percentage to achieve a flat fee amount
 * @param subscriptionAmount - The total subscription amount in dollars
 * @param flatFeeAmount - The desired flat fee amount in dollars (default: $200)
 * @returns The percentage to use for application_fee_percent
 */
export function calculatePlatformFeePercent(
  subscriptionAmount: number, 
  flatFeeAmount: number = PLATFORM_FEE_AMOUNT
): number {
  if (subscriptionAmount <= flatFeeAmount) {
    // If subscription is less than or equal to platform fee, take maximum of 95%
    // This ensures some money still goes to the connected account
    return 95;
  }
  
  // Round to 2 decimal places to satisfy Stripe's requirements
  const percentage = (flatFeeAmount / subscriptionAmount) * 100;
  return Math.round(percentage * 100) / 100;
}

/**
 * Calculate how much the connected account will receive after platform fee
 * @param subscriptionAmount - The total subscription amount in dollars
 * @param flatFeeAmount - The platform fee amount in dollars (default: $200)
 * @returns Object with platform fee and connected account amounts
 */
export function calculatePaymentSplit(
  subscriptionAmount: number,
  flatFeeAmount: number = PLATFORM_FEE_AMOUNT
) {
  const feePercent = calculatePlatformFeePercent(subscriptionAmount, flatFeeAmount);
  
  // Calculate actual platform fee based on the rounded percentage
  const platformFee = subscriptionAmount <= flatFeeAmount 
    ? subscriptionAmount * 0.95  // Cap at 95% for low-priced listings
    : (feePercent / 100) * subscriptionAmount;
    
  const connectedAccountAmount = subscriptionAmount - platformFee;
  
  return {
    subscriptionAmount,
    platformFee: Math.round(platformFee * 100) / 100, // Round to 2 decimal places
    connectedAccountAmount: Math.round(connectedAccountAmount * 100) / 100, // Round to 2 decimal places
    feePercent
  };
} 