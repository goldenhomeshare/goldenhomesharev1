"use client";

import { calculatePaymentSplit, PLATFORM_FEE_AMOUNT } from "@/app/lib/platform-fee";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, TrendingUp, Users } from "lucide-react";

interface PlatformFeeBreakdownProps {
  listingPrice: number;
  className?: string;
}

export function PlatformFeeBreakdown({ listingPrice, className }: PlatformFeeBreakdownProps) {
  const breakdown = calculatePaymentSplit(listingPrice);

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <DollarSign className="w-5 h-5" />
          Payment Breakdown
        </CardTitle>
        <CardDescription>
          Monthly payment split for ${listingPrice.toFixed(2)} listing
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Total Amount */}
          <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <DollarSign className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Payment</p>
              <p className="font-semibold text-lg">${breakdown.subscriptionAmount.toFixed(2)}</p>
            </div>
          </div>

          {/* Platform Fee */}
          <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Platform Fee</p>
              <p className="font-semibold text-lg text-green-600">${breakdown.platformFee.toFixed(2)}</p>
              <p className="text-xs text-gray-500">{breakdown.feePercent.toFixed(1)}%</p>
            </div>
          </div>

          {/* Homeowner Receives */}
          <div className="flex items-center space-x-3 p-3 bg-purple-50 rounded-lg">
            <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
              <Users className="w-4 h-4 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Homeowner Gets</p>
              <p className="font-semibold text-lg text-purple-600">${breakdown.connectedAccountAmount.toFixed(2)}</p>
            </div>
          </div>
        </div>

        {/* Visual Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-gray-600">
            <span>Payment Split</span>
            <span>Platform: ${PLATFORM_FEE_AMOUNT} flat fee</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div className="flex h-3 rounded-full overflow-hidden">
              <div 
                className="bg-green-500" 
                style={{ width: `${breakdown.feePercent}%` }}
                title={`Platform Fee: ${breakdown.feePercent.toFixed(1)}%`}
              />
              <div 
                className="bg-purple-500 flex-1"
                title={`Homeowner: ${(100 - breakdown.feePercent).toFixed(1)}%`}
              />
            </div>
          </div>
          <div className="flex justify-between text-xs text-gray-500">
            <span>Platform ({breakdown.feePercent.toFixed(1)}%)</span>
            <span>Homeowner ({(100 - breakdown.feePercent).toFixed(1)}%)</span>
          </div>
        </div>

        {listingPrice <= PLATFORM_FEE_AMOUNT && (
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
            <p className="text-sm text-amber-800">
              <strong>Note:</strong> This listing is priced at or below our platform fee. 
              The platform will take a maximum of 95% to ensure the homeowner receives something.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
} 