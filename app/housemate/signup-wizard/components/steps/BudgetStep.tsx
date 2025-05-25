"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DollarSign, CheckCircle } from "lucide-react";
import { WizardFormData } from "../HousemateSignupWizard";

interface BudgetStepProps {
  formData: WizardFormData;
  updateFormData: (updates: Partial<WizardFormData>) => void;
}

export function BudgetStep({ formData, updateFormData }: BudgetStepProps) {
  const handleBudgetChange = (value: string) => {
    // Remove any non-numeric characters except for decimal points
    const numericValue = value.replace(/[^0-9]/g, '');
    updateFormData({ maxBudget: numericValue });
  };

  const formatBudget = (value: string) => {
    if (!value) return '';
    const numericValue = parseInt(value);
    return numericValue.toLocaleString();
  };

  const showMatchMessage = formData.maxBudget && parseInt(formData.maxBudget) > 0;

  return (
    <div className="space-y-8">
      <div className="max-w-md mx-auto space-y-6">
        {/* Budget Input */}
        <div>
          <Label htmlFor="maxBudget" className="text-base font-medium mb-3 block">
            Maximum Monthly Budget *
          </Label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <DollarSign className="h-6 w-6 text-gray-400" />
            </div>
            <Input
              id="maxBudget"
              type="text"
              placeholder="725"
              value={formatBudget(formData.maxBudget)}
              onChange={(e) => handleBudgetChange(e.target.value)}
              className="pl-12 h-16 text-2xl font-semibold text-center border-2 focus:border-primary"
            />
          </div>
          <p className="text-sm text-gray-500 mt-2 text-center">
            Enter your maximum monthly budget in USD
          </p>
        </div>

        {/* Budget Suggestions */}
        <div className="grid grid-cols-2 gap-3">
          {[300, 400, 500, 600].map((amount) => (
            <button
              key={amount}
              onClick={() => updateFormData({ maxBudget: amount.toString() })}
              className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                formData.maxBudget === amount.toString()
                  ? 'border-primary bg-primary/5 text-primary'
                  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
              }`}
            >
              <div className="text-lg font-semibold">${amount.toLocaleString()}</div>
              <div className="text-sm text-gray-500">per month</div>
            </button>
          ))}
        </div>

        {/* Match Message */}
        {showMatchMessage && (
          <div className="mt-8 p-6 bg-blue-50 border border-blue-200 rounded-xl">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="h-5 w-5 text-blue-600" />
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-blue-900 mb-2">
                  Budget confirmed
                </h3>
                <p className="text-blue-800 leading-relaxed">
                  Your budget of ${formatBudget(formData.maxBudget)} per month is within range for available homesharing opportunities in your area.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 