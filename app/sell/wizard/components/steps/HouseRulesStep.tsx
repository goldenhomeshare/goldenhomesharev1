"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Cat, Clock, FileText } from "lucide-react";
import { WizardFormData } from "../ListingWizard";

interface HouseRulesStepProps {
  formData: WizardFormData;
  updateFormData: (data: Partial<WizardFormData>) => void;
}

const houseRulesOptions = [
  { 
    id: "petPolicy", 
    label: "Pet Policy", 
    icon: Cat, 
    options: [
      { value: "no", label: "No pets allowed" },
      { value: "discussionRequired", label: "Pet approval required" },
      { value: "yes", label: "Pets are welcome" }
    ]
  },
  { 
    id: "quietHours", 
    label: "Quiet Hours", 
    icon: Clock, 
    hasCustomInput: true, 
    defaultValue: "10 PM - 7 AM" 
  },
];

export function HouseRulesStep({ formData, updateFormData }: HouseRulesStepProps) {
  const toggleHouseRule = (ruleId: string, value?: string) => {
    const existingRuleIndex = formData.houseRules.findIndex(rule => rule.id === ruleId);
    
    if (existingRuleIndex >= 0) {
      if (value) {
        // Update existing rule
        const updatedRules = formData.houseRules.map(rule => 
          rule.id === ruleId ? { ...rule, value } : rule
        );
        updateFormData({ houseRules: updatedRules });
      } else {
        // Remove rule
        const updatedRules = formData.houseRules.filter(rule => rule.id !== ruleId);
        updateFormData({ houseRules: updatedRules });
      }
    } else {
      // Add new rule
      const rule = houseRulesOptions.find(opt => opt.id === ruleId);
      const newRule: {id: string, value?: string} = { id: ruleId };
      if (value) {
        newRule.value = value;
      } else if (rule?.hasCustomInput && rule?.defaultValue) {
        newRule.value = rule.defaultValue;
      }
      const updatedRules = [...formData.houseRules, newRule];
      updateFormData({ houseRules: updatedRules });
    }
  };

  const updateHouseRuleValue = (ruleId: string, value: string) => {
    const updatedRules = formData.houseRules.map(rule =>
      rule.id === ruleId ? { ...rule, value } : rule
    );
    updateFormData({ houseRules: updatedRules });
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">
          Set specific house rules for this listing
        </h2>
        <p className="text-gray-600">
          Additional rules from your homeowner profile will also apply to this listing
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {houseRulesOptions.map((ruleOpt) => {
          const Icon = ruleOpt.icon;
          const selectedRule = formData.houseRules.find(r => r.id === ruleOpt.id);
          const isSelected = !!selectedRule;

          return (
            <div key={ruleOpt.id} className="border border-gray-200 rounded-xl p-6 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
                  <Icon size={24} className="text-gray-600" />
                </div>
                <Label className="text-base font-medium">{ruleOpt.label}</Label>
              </div>
              
              {ruleOpt.options ? (
                <div className="space-y-2">
                  {ruleOpt.options.map((option) => {
                    const isOptionSelected = selectedRule?.value === option.value;
                    
                    return (
                      <div key={option.value}>
                        <label className="cursor-pointer">
                          <input
                            type="radio"
                            name={`house-rule-${ruleOpt.id}`}
                            className="sr-only peer"
                            checked={isOptionSelected}
                            onChange={() => toggleHouseRule(ruleOpt.id, option.value)}
                          />
                          <div className="flex items-center p-3 rounded-lg border peer-checked:border-primary peer-checked:bg-primary/5 hover:bg-gray-50 transition-colors">
                            <div className="flex-1">
                              <span className="font-medium text-sm">{option.label}</span>
                            </div>
                            <div className={`w-4 h-4 rounded-full border-2 transition-colors ${
                              isOptionSelected 
                                ? 'border-primary bg-primary' 
                                : 'border-gray-300'
                            }`}>
                              {isOptionSelected && (
                                <div className="w-full h-full rounded-full bg-white scale-50"></div>
                              )}
                            </div>
                          </div>
                        </label>
                      </div>
                    );
                  })}
                </div>
              ) : ruleOpt.hasCustomInput && (
                <div className="space-y-2">
                  <label className="cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={isSelected}
                      onChange={() => isSelected ? toggleHouseRule(ruleOpt.id) : toggleHouseRule(ruleOpt.id, ruleOpt.defaultValue)}
                    />
                    <div className={`p-3 rounded-lg border transition-colors ${
                      isSelected 
                        ? 'border-primary bg-primary/5' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}>
                      <span className="font-medium text-sm">Enable quiet hours</span>
                    </div>
                  </label>
                  
                  {isSelected && (
                    <div className="mt-3">
                      <Label className="text-xs font-medium text-gray-600 mb-1 block">
                        Quiet hours time range
                      </Label>
                      <Input
                        type="text"
                        placeholder="10 PM - 7 AM"
                        value={selectedRule?.value || ""}
                        onChange={(e) => updateHouseRuleValue(ruleOpt.id, e.target.value)}
                        className="w-full h-10 text-sm border-gray-200 rounded-lg focus:border-primary focus:ring-0"
                      />
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Additional House Rules */}
      <div className="border border-gray-200 rounded-xl p-6 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
            <FileText size={24} className="text-gray-600" />
          </div>
          <Label className="text-base font-medium">Additional House Rules</Label>
        </div>
        
        <div className="space-y-2">
          <Label className="text-sm font-medium text-gray-700">
            Other rules or expectations (optional)
          </Label>
          <Textarea
            placeholder="Enter any additional house rules, expectations, or guidelines for your home..."
            value={formData.houseRules.find(rule => rule.id === 'additionalRules')?.value || ""}
            onChange={(e) => {
              if (e.target.value.trim()) {
                toggleHouseRule('additionalRules', e.target.value);
              } else {
                // Remove the rule if text is empty
                const updatedRules = formData.houseRules.filter(rule => rule.id !== 'additionalRules');
                updateFormData({ houseRules: updatedRules });
              }
            }}
            rows={4}
            className="resize-none border-gray-200 rounded-lg focus:border-primary focus:ring-0"
            maxLength={500}
          />
          <div className="flex justify-between items-center">
            <p className="text-xs text-gray-500">
              Mention things like noise preferences, shared space usage, or other important guidelines
            </p>
            <span className="text-xs text-gray-400">
              {(formData.houseRules.find(rule => rule.id === 'additionalRules')?.value || "").length}/500
            </span>
          </div>
        </div>
      </div>

      {/* Tips Section */}
      <div className="bg-primary/5 border border-primary/20 rounded-xl p-6">
        <h3 className="font-medium text-primary mb-3">📋 House Rules Tips</h3>
        <ul className="space-y-2 text-sm text-gray-700">
          <li className="flex items-start gap-2">
            <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></span>
            <span>These rules are specific to this listing and complement your general homeowner preferences</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></span>
            <span>Other house rules (like smoking and guest policies) will be pulled from your homeowner profile</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></span>
            <span>Clear pet and quiet hour policies help potential housemates understand your expectations</span>
          </li>
        </ul>
      </div>
    </div>
  );
} 