"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DollarSign, Calculator, Info, ExternalLink } from "lucide-react";
import { WizardFormData } from "../ListingWizard";

interface PricingStepProps {
  formData: WizardFormData;
  updateFormData: (data: Partial<WizardFormData>) => void;
}

export function PricingStep({ formData, updateFormData }: PricingStepProps) {
  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value) || 0;
    updateFormData({ price: value });
  };

  // Calculate total support hours
  const getTotalSupportHours = () => {
    return formData.supportRequested.reduce((total, item) => total + item.hoursPerWeek, 0);
  };

  // Calculate suggested price based on support hours
  const calculateSuggestedPrice = () => {
    const baseRent = 500; // Base monthly rent
    const utilitiesIncrease = 60; // Additional utilities cost
    const goldenHomeShareFee = 200; // Platform fee
    const minimumRate = goldenHomeShareFee + utilitiesIncrease; // Ensure no loss
    const supportHours = getTotalSupportHours();
    const hourlyValue = 15; // Value per hour of support
    const weeklyDiscount = supportHours * hourlyValue;
    const monthlyDiscount = weeklyDiscount * 4; // 4 weeks per month
    
    const suggestedPrice = Math.max(minimumRate, baseRent + utilitiesIncrease - monthlyDiscount);
    return suggestedPrice; // Remove rounding to nearest $50
  };

  const applySuggestedPrice = () => {
    const suggestedPrice = calculateSuggestedPrice();
    updateFormData({ price: suggestedPrice });
  };

  const totalSupportHours = getTotalSupportHours();
  const suggestedPrice = calculateSuggestedPrice();
  const monthlyValue = totalSupportHours * 15 * 4;

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <DollarSign className="w-8 h-8 text-primary" />
        </div>
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">
          What's your monthly rate?
        </h2>
        <p className="text-gray-600">
          Set a fair price that reflects the value of your space and any support services
        </p>
      </div>

      <div className="max-w-md mx-auto space-y-6">
        {/* Support-based Price Suggestion */}
        <div className="bg-primary/5 border border-primary/20 rounded-xl p-6">
          <div className="flex items-center gap-2 mb-3">
            <Calculator className="w-5 h-5 text-primary" />
            <h3 className="font-medium text-primary">Suggested Monthly Rate</h3>
          </div>
          
          <div className="space-y-3 text-sm">
            <div className="flex justify-between items-center">
              <span className="text-gray-700">Base monthly rent (based on location):</span>
              <span className="font-medium">$500</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-700">Utilities increase:</span>
              <span className="font-medium">+$60</span>
            </div>
            {totalSupportHours > 0 && (
              <>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Support services discount:</span>
                  <span className="font-medium">-${Math.round(monthlyValue)}</span>
                </div>
                <div className="text-xs text-gray-500 -mt-1 text-right">
                  {totalSupportHours} hours/week × $15/hour × 4 weeks = ${Math.round(monthlyValue)}/month
                </div>
              </>
            )}
            <div className="border-t pt-2 flex justify-between items-center font-semibold">
              <span className="text-gray-900">Suggested monthly rate:</span>
              <span className="text-primary text-lg">${suggestedPrice}</span>
            </div>
          </div>
          
          {/* Minimum Rate Protection Notice */}
          {(() => {
            const baseRent = 500;
            const utilitiesIncrease = 60;
            const goldenHomeShareFee = 200;
            const minimumRate = goldenHomeShareFee + utilitiesIncrease;
            const supportHours = getTotalSupportHours();
            const weeklyDiscount = supportHours * 15;
            const monthlyDiscount = weeklyDiscount * 4;
            const calculatedRate = baseRent + utilitiesIncrease - monthlyDiscount;
            
            return calculatedRate < minimumRate;
          })() && (
            <div className="mt-4 p-3 bg-primary/10 border border-primary/20 rounded-lg">
              <h4 className="font-medium text-primary text-sm mb-2">Minimum Rate Protection Applied</h4>
              <div className="space-y-1 text-xs text-gray-700">
                <div className="flex justify-between">
                  <span>Golden HomeShare fee:</span>
                  <span>$200</span>
                </div>
                <div className="flex justify-between">
                  <span>Utilities coverage:</span>
                  <span>$60</span>
                </div>
                <div className="flex justify-between font-medium border-t pt-1">
                  <span>Minimum rate (rounded):</span>
                  <span>${suggestedPrice}</span>
                </div>
              </div>
              <p className="text-xs text-gray-600 mt-2">
                This covers all platform costs and ensures a sustainable listing.
              </p>
            </div>
          )}
          
          <button
            type="button"
            onClick={applySuggestedPrice}
            className="w-full mt-4 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors text-sm font-medium"
          >
            Use Suggested Rate
          </button>
          
          <div className="flex items-start gap-2 mt-3 p-3 bg-primary/10 rounded-lg">
            <Info className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
            <p className="text-xs text-primary">
              {totalSupportHours > 0 
                ? "This suggested rate accounts for support services valued at $15/hour. The Golden HomeShare platform fee will be deducted from your monthly income."
                : "This suggested rate is based on your location and includes utilities. The Golden HomeShare platform fee will be deducted from your monthly income."
              }
            </p>
          </div>
        </div>

        <div>
          <Label htmlFor="price" className="text-sm font-medium text-gray-700 mb-2 block">
            Monthly Rate *
          </Label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <DollarSign className="h-5 w-5 text-gray-400" />
            </div>
            <Input
              id="price"
              type="number"
              placeholder="300"
              value={formData.price > 0 ? formData.price : ""}
              onChange={handlePriceChange}
              className={`h-12 pl-11 border-gray-200 rounded-xl focus:border-primary focus:ring-0 text-gray-900 text-lg font-medium ${
                formData.price > 0 && formData.price < 200 ? 'border-primary/50 focus:border-primary' : ''
              }`}
              min={1}
              max={10000}
            />
          </div>
          {formData.price > 0 && (
            <div className="mt-2 p-4 bg-primary/5 border border-primary/20 rounded-lg">
              {formData.price < 200 && (
                <>
                  <p className="text-sm text-primary font-medium mb-3">
                    Minimum rate: $200
                  </p>
                  <p className="text-xs text-gray-600 mb-4">
                    This covers the $200 Golden HomeShare platform fee to ensure you earn income from your listing.
                  </p>
                </>
              )}
              
              {/* Income Breakdown */}
              <div className={formData.price < 200 ? "border-t border-primary/10 pt-3" : ""}>
                <h4 className="text-sm font-medium text-gray-900 mb-2">Your Income Breakdown</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700">Monthly rent you set:</span>
                    <span className="font-medium">${formData.price}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700">Golden HomeShare fee:</span>
                    <span className="font-medium">-$200</span>
                  </div>
                  <div className="flex justify-between items-center font-medium border-t pt-2">
                    <span className="text-gray-900">Your net monthly income:</span>
                    <span className={`${Math.max(0, formData.price - 200) < 0 ? 'text-red-700' : 'text-green-700'}`}>
                      ${Math.max(0, formData.price - 200)}
                    </span>
                  </div>
                </div>
                <p className="text-xs text-gray-600 mt-2">
                  <strong>What's included in the Golden HomeShare fee:</strong> Comprehensive background checks, 24/7 customer support, secure payment processing, monthly check-ins, and ongoing mediation services.
                </p>
                
                {/* Cost Calculator Section */}
                <div className="mt-4 pt-4 border-t border-primary/10">
                  <div className="text-center">
                    <a
                      href="/cost-savings"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary/90 transition-colors"
                    >
                      <Calculator className="w-4 h-4" />
                      See the Value
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          )}
          <p className="text-xs text-gray-500 mt-2">
            Enter the monthly rate amount in US dollars
          </p>
        </div>
      </div>
    </div>
  );
} 