import { PlatformFeeBreakdown } from "@/app/components/PlatformFeeBreakdown";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { calculatePaymentSplit, PLATFORM_FEE_AMOUNT } from "@/app/lib/platform-fee";

export default function PlatformFeesPage() {
  // Example listing prices to demonstrate the fee calculation
  const examplePrices = [150, 250, 320, 500, 800, 1200, 2000];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Platform Fee Calculator</h1>
        <p className="text-gray-600 mb-6">
          Our platform charges a flat <strong>${PLATFORM_FEE_AMOUNT}/month</strong> fee from all listings. 
          The percentage automatically adjusts based on the listing price to maintain this flat fee structure.
        </p>
      </div>

      {/* Summary Card */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>How It Works</CardTitle>
          <CardDescription>
            Dynamic percentage calculation for consistent platform revenue
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-3">Platform Fee Structure</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• <strong>Flat Fee:</strong> ${PLATFORM_FEE_AMOUNT}/month from every listing</li>
                <li>• <strong>Dynamic Percentage:</strong> Calculated as (${PLATFORM_FEE_AMOUNT} ÷ listing price) × 100</li>
                <li>• <strong>Maximum Fee:</strong> 95% of listing price (for listings under ${PLATFORM_FEE_AMOUNT})</li>
                <li>• <strong>Payment Type:</strong> Destination charges with automatic transfers</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-3">Benefits</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• <strong>Predictable Revenue:</strong> Always ${PLATFORM_FEE_AMOUNT}/month per active listing</li>
                <li>• <strong>Fair for All:</strong> High-value listings pay lower percentage</li>
                <li>• <strong>Automatic:</strong> No manual fee adjustments needed</li>
                <li>• <strong>Transparent:</strong> Users see exact breakdown before payment</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Examples Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {examplePrices.map((price) => (
          <PlatformFeeBreakdown 
            key={price} 
            listingPrice={price}
          />
        ))}
      </div>

      {/* Summary Table */}
      <Card>
        <CardHeader>
          <CardTitle>Fee Summary Table</CardTitle>
          <CardDescription>
            Quick reference for different listing prices
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3">Listing Price</th>
                  <th className="text-left p-3">Platform Fee</th>
                  <th className="text-left p-3">Fee %</th>
                  <th className="text-left p-3">Homeowner Gets</th>
                  <th className="text-left p-3">Monthly Revenue</th>
                </tr>
              </thead>
              <tbody>
                {examplePrices.map((price) => {
                  const breakdown = calculatePaymentSplit(price);
                  return (
                    <tr key={price} className="border-b hover:bg-gray-50">
                      <td className="p-3 font-medium">${price.toFixed(2)}</td>
                      <td className="p-3 text-green-600">${breakdown.platformFee.toFixed(2)}</td>
                      <td className="p-3">{breakdown.feePercent.toFixed(1)}%</td>
                      <td className="p-3 text-purple-600">${breakdown.connectedAccountAmount.toFixed(2)}</td>
                      <td className="p-3 font-medium">${breakdown.platformFee.toFixed(2)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 