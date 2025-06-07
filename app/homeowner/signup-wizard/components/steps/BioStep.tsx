"use client";

import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { User } from "lucide-react";
import { WizardFormData } from "../HomeownerSignupWizard";

interface BioStepProps {
  formData: WizardFormData;
  updateFormData: (updates: Partial<WizardFormData>) => void;
}

export function BioStep({ formData, updateFormData }: BioStepProps) {
  const handleBioChange = (bio: string) => {
    updateFormData({ bio });
  };

  const bioPrompts = [
    "Tell potential housemates about yourself and what makes you a great homeowner",
    "Describe your home, neighborhood, and what you're looking for in a housemate",
    "Share your interests, lifestyle, and what living with you would be like",
    "Mention any house rules, expectations, or what you can offer as a homeowner"
  ];

  const characterCount = formData.bio.length;
  const minCharacters = 100;
  const maxCharacters = 1000;

  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Tell Your Story</h3>
        <p className="text-gray-600">
          Help potential housemates get to know you and understand what makes your home special
        </p>
      </div>

      {/* Bio Section */}
      <div className="space-y-4">
        <Label className="text-lg font-medium text-gray-900 flex items-center gap-2">
          <User className="w-5 h-5" />
          About You & Your Home *
        </Label>
        
        <div className="space-y-3">
          <Textarea
            placeholder="Start writing about yourself, your home, and what you're looking for in a housemate..."
            value={formData.bio}
            onChange={(e) => handleBioChange(e.target.value)}
            rows={8}
            className="border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200 text-base leading-relaxed"
            maxLength={maxCharacters}
          />
          
          <div className="flex items-center justify-between text-sm">
            <span className={`${
              characterCount < minCharacters 
                ? "text-orange-600" 
                : characterCount >= minCharacters 
                ? "text-green-600" 
                : "text-gray-500"
            }`}>
              {characterCount < minCharacters 
                ? `${minCharacters - characterCount} more characters needed` 
                : "Great! Your bio looks good"}
            </span>
            <span className="text-gray-500">
              {characterCount}/{maxCharacters}
            </span>
          </div>
        </div>

        {/* Writing Prompts */}
        <div className="bg-primary/5 border border-primary/20 rounded-xl p-6">
          <h4 className="font-medium text-primary mb-3">
            Tips for a Great Bio:
          </h4>
          <ul className="text-sm text-gray-700 space-y-2">
            {bioPrompts.map((prompt, index) => (
              <li key={index}>• {prompt}</li>
            ))}
          </ul>
        </div>
      </div>


    </div>
  );
} 