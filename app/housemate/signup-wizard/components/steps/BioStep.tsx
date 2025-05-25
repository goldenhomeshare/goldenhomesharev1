"use client";

import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { FileText, Lightbulb } from "lucide-react";
import { WizardFormData } from "../HousemateSignupWizard";

interface BioStepProps {
  formData: WizardFormData;
  updateFormData: (updates: Partial<WizardFormData>) => void;
}

export function BioStep({ formData, updateFormData }: BioStepProps) {
  const handleBioChange = (value: string) => {
    updateFormData({ bio: value });
  };

  const bioPrompts = [
    "What makes you a great housemate?",
    "What are you looking for in a living situation?",
    "Tell us about your daily routine and lifestyle",
    "What are your interests and hobbies?",
    "How do you handle shared living spaces?",
    "What's important to you in a home environment?"
  ];

  const wordCount = formData.bio.trim().split(/\s+/).filter(word => word.length > 0).length;
  const minWords = 50;

  return (
    <div className="space-y-8">
      <div className="space-y-6">
        {/* Bio Input */}
        <div>
          <Label htmlFor="bio" className="text-base font-medium mb-3 block">
            About You *
          </Label>
          <Textarea
            id="bio"
            placeholder="Write a compelling bio that helps homeowners get to know you. Share your personality, interests, what you're looking for in a living situation, and what makes you a great housemate..."
            value={formData.bio}
            onChange={(e) => handleBioChange(e.target.value)}
            rows={8}
            className="text-lg leading-relaxed border-2 focus:border-primary"
          />
          <div className="flex justify-between items-center mt-2">
            <p className="text-sm text-gray-500">
              {wordCount < minWords 
                ? `${minWords - wordCount} more words needed (minimum ${minWords} words)`
                : `${wordCount} words`
              }
            </p>
            <div className={`text-sm font-medium ${
              wordCount >= minWords ? 'text-green-600' : 'text-gray-400'
            }`}>
              {wordCount >= minWords ? '✓ Good length' : 'Keep writing...'}
            </div>
          </div>
        </div>

        {/* Writing Prompts */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
              <Lightbulb size={20} className="text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-blue-800">
              Need inspiration? Consider these questions:
            </h3>
          </div>
          <ul className="space-y-2">
            {bioPrompts.map((prompt, index) => (
              <li key={index} className="flex items-start gap-2 text-blue-700">
                <span className="text-blue-400 mt-1">•</span>
                <span>{prompt}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Tips */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
              <FileText size={20} className="text-gray-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800">
              Tips for a great bio:
            </h3>
          </div>
          <ul className="space-y-2 text-gray-700">
            <li className="flex items-start gap-2">
              <span className="text-gray-400 mt-1">•</span>
              <span>Be authentic and genuine - let your personality shine through</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-gray-400 mt-1">•</span>
              <span>Mention your lifestyle, schedule, and living preferences</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-gray-400 mt-1">•</span>
              <span>Share what you can contribute to a household</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-gray-400 mt-1">•</span>
              <span>Keep it positive and welcoming</span>
            </li>
          </ul>
        </div>

        {/* Preview */}
        {formData.bio.trim().length > 0 && (
          <div className="border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">
              Preview of your bio:
            </h3>
            <div className="bg-white border border-gray-100 rounded-lg p-4">
              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                {formData.bio}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 