"use client";

import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { FileText } from "lucide-react";
import { WizardFormData } from "../ListingWizard";

interface DescriptionStepProps {
  formData: WizardFormData;
  updateFormData: (data: Partial<WizardFormData>) => void;
}

export function DescriptionStep({ formData, updateFormData }: DescriptionStepProps) {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <FileText className="w-8 h-8 text-primary" />
        </div>
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">
          Tell your story
        </h2>
        <p className="text-gray-600">
          Share details about your home, neighborhood, and what makes it special
        </p>
      </div>

      <div className="max-w-2xl mx-auto space-y-6">
        <div>
          <Label htmlFor="description" className="text-sm font-medium text-gray-700 mb-2 block">
            Detailed Description *
          </Label>
          <Textarea
            id="description"
            placeholder="Describe your space in detail. Include information about the room, shared areas, neighborhood, transportation, nearby amenities, your living style, and what kind of housemate you're looking for..."
            value={formData.description}
            onChange={(e) => updateFormData({ description: e.target.value })}
            rows={12}
            className="border-gray-200 rounded-xl focus:border-primary focus:ring-0 text-gray-900 resize-none"
            maxLength={2000}
          />
          <div className="flex justify-between items-center mt-2">
            <p className="text-xs text-gray-500">
              This detailed description will help potential housemates understand if your space is right for them
            </p>
            <span className="text-xs text-gray-400">
              {formData.description.length}/2000
            </span>
          </div>
        </div>

        {/* Description Tips */}
        <div className="bg-primary/5 border border-primary/20 rounded-xl p-6">
          <h3 className="font-medium text-primary mb-3">💡 Description Tips</h3>
          <ul className="space-y-2 text-sm text-gray-700">
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></span>
              <span>Describe the room, shared spaces, and neighborhood amenities</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></span>
              <span>Share your lifestyle and what kind of housemate you're seeking</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></span>
              <span>Be honest and authentic to attract the right matches</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
} 