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

        {/* Writing Prompts */}
        <div className="bg-primary/5 border border-primary/20 rounded-xl p-6">
          <h3 className="font-medium text-primary mb-4">✍️ Writing Prompts to Get You Started</h3>
          <div className="space-y-4">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">About the Space</h4>
              <ul className="space-y-1 text-sm text-gray-700 ml-4">
                <li>• Describe the room size, lighting, and any special features</li>
                <li>• What shared spaces are available (kitchen, living room, etc.)?</li>
                <li>• Is there storage space, parking, or outdoor areas?</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-medium text-gray-900 mb-2">About the Neighborhood</h4>
              <ul className="space-y-1 text-sm text-gray-700 ml-4">
                <li>• How close is public transportation, grocery stores, or restaurants?</li>
                <li>• What's the neighborhood character like?</li>
                <li>• Are there parks, gyms, or other amenities nearby?</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-medium text-gray-900 mb-2">About You & Your Lifestyle</h4>
              <ul className="space-y-1 text-sm text-gray-700 ml-4">
                <li>• What's your daily routine like?</li>
                <li>• Do you work from home or travel frequently?</li>
                <li>• What are your hobbies and interests?</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-medium text-gray-900 mb-2">What You're Looking For</h4>
              <ul className="space-y-1 text-sm text-gray-700 ml-4">
                <li>• What kind of person would be a good fit?</li>
                <li>• Are you looking for someone social or more independent?</li>
                <li>• Any specific preferences or requirements?</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Additional Tips */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
          <h3 className="font-medium text-blue-900 mb-3">💡 Description Tips</h3>
          <ul className="space-y-2 text-sm text-blue-800">
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 flex-shrink-0"></span>
              <span>Be honest and authentic - this helps attract the right matches</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 flex-shrink-0"></span>
              <span>Use a warm, welcoming tone to make potential housemates feel comfortable</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 flex-shrink-0"></span>
              <span>Include practical details like move-in date, lease terms, and utilities</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 flex-shrink-0"></span>
              <span>Mention any mutual benefits or support arrangements</span>
            </li>
          </ul>
        </div>

        {formData.description.trim() && (
          <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-xl">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                </svg>
              </div>
              <span className="text-sm font-medium text-green-800">
                Great! Your listing has a detailed description.
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 