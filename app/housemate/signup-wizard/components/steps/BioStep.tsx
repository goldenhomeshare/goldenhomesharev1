"use client";

import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  FileText, 
  User
} from "lucide-react";
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
      <div className="text-center mb-8">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Tell Your Story</h3>
        <p className="text-gray-600">
          Help homeowners get to know you and understand what makes you a great housemate
        </p>
      </div>

      <div className="space-y-6">
        {/* Bio Input */}
        <div>
          <Label htmlFor="bio" className="text-lg font-medium text-gray-900 flex items-center gap-2 mb-3">
            <User className="w-5 h-5" />
            About You *
          </Label>
          <Textarea
            id="bio"
            placeholder="Write a compelling bio that helps homeowners get to know you. Share your personality, interests, what you're looking for in a living situation, and what makes you a great housemate..."
            value={formData.bio}
            onChange={(e) => handleBioChange(e.target.value)}
            rows={8}
            className="border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200 text-base leading-relaxed"
          />
          <div className="mt-2">
            <p className="text-sm text-gray-500">
              {wordCount < minWords 
                ? `${minWords - wordCount} more words needed (minimum ${minWords} words)`
                : `${wordCount} words`
              }
            </p>
          </div>
        </div>

        {/* Tips */}
        <div className="bg-primary/5 border border-primary/20 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <FileText size={20} className="text-primary" />
            </div>
            <h3 className="text-lg font-semibold text-primary">
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




      </div>
    </div>
  );
} 