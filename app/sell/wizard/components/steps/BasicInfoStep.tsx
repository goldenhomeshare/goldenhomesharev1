"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { WizardFormData } from "../ListingWizard";

interface BasicInfoStepProps {
  formData: WizardFormData;
  updateFormData: (data: Partial<WizardFormData>) => void;
}

export function BasicInfoStep({ formData, updateFormData }: BasicInfoStepProps) {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">
          Let's start with the basics
        </h2>
        <p className="text-gray-600">
          Give your listing a title and brief description to attract potential housemates
        </p>
      </div>

      <div className="space-y-6">
        <div>
          <Label htmlFor="title" className="text-sm font-medium text-gray-700 mb-2 block">
            Listing Title *
          </Label>
          <Input
            id="title"
            placeholder="e.g., Cozy room in quiet neighborhood, close to transit"
            value={formData.title}
            onChange={(e) => updateFormData({ title: e.target.value })}
            className="h-12 border-gray-200 rounded-xl focus:border-primary focus:ring-0 text-gray-900"
            maxLength={100}
          />
          <div className="flex justify-between items-center mt-2">
            <p className="text-xs text-gray-500">
              Write a catchy title that highlights the best features of your space
            </p>
            <span className="text-xs text-gray-400">
              {formData.title.length}/100
            </span>
          </div>
        </div>

        <div>
          <Label htmlFor="description" className="text-sm font-medium text-gray-700 mb-2 block">
            Short Description *
          </Label>
          <Textarea
            id="description"
            placeholder="Provide a brief overview of your space, location highlights, and what makes it special..."
            value={formData.smallDescription}
            onChange={(e) => updateFormData({ smallDescription: e.target.value })}
            rows={4}
            className="border-gray-200 rounded-xl focus:border-primary focus:ring-0 text-gray-900 resize-none"
            maxLength={300}
          />
          <div className="flex justify-between items-center mt-2">
            <p className="text-xs text-gray-500">
              Keep it concise - this will appear in search results
            </p>
            <span className="text-xs text-gray-400">
              {formData.smallDescription.length}/300
            </span>
          </div>
        </div>

        {/* Tips Section */}
        <div className="bg-primary/5 border border-primary/20 rounded-xl p-6">
          <h3 className="font-medium text-primary mb-3">💡 Tips for a Great Listing</h3>
          <ul className="space-y-2 text-sm text-gray-700">
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></span>
              <span>Highlight unique features like natural light, outdoor space, or proximity to transit</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></span>
              <span>Mention the neighborhood character and nearby amenities</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></span>
              <span>Be honest and specific to attract the right matches</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
} 