"use client";

import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  FileText, 
  Lightbulb, 
  User,
  Users,
  Instagram,
  Facebook,
  Linkedin
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

  const handleSocialMediaChange = (platform: keyof WizardFormData['socialMedia'], value: string) => {
    updateFormData({
      socialMedia: {
        ...formData.socialMedia,
        [platform]: value
      }
    });
  };

  const validateAndFormatSocialLink = (platform: string, value: string) => {
    if (!value.trim()) return value;
    
    const trimmedValue = value.trim();
    
    switch (platform) {
      case 'instagram':
        if (!trimmedValue.includes('instagram.com')) {
          return `https://instagram.com/${trimmedValue.replace('@', '')}`;
        }
        return trimmedValue.startsWith('http') ? trimmedValue : `https://${trimmedValue}`;
      
      case 'facebook':
        if (!trimmedValue.includes('facebook.com')) {
          return `https://facebook.com/${trimmedValue}`;
        }
        return trimmedValue.startsWith('http') ? trimmedValue : `https://${trimmedValue}`;
      
      case 'linkedin':
        if (!trimmedValue.includes('linkedin.com')) {
          return `https://linkedin.com/in/${trimmedValue}`;
        }
        return trimmedValue.startsWith('http') ? trimmedValue : `https://${trimmedValue}`;
      
      default:
        return trimmedValue;
    }
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

        {/* Social Media Section */}
        <div className="space-y-6">
          <div>
            <Label className="text-lg font-medium text-gray-900 flex items-center gap-2 mb-2">
              <Users className="w-5 h-5" />
              Social Media (Optional)
            </Label>
            <p className="text-sm text-gray-600 mb-4">
              Adding social media links can help homeowners get to know you better and build trust
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Instagram */}
            <div className="space-y-2">
              <Label htmlFor="instagram" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <Instagram className="w-4 h-4" />
                Instagram
              </Label>
              <Input
                id="instagram"
                placeholder="@username or full URL"
                value={formData.socialMedia.instagram}
                onChange={(e) => handleSocialMediaChange("instagram", e.target.value)}
                onBlur={(e) => {
                  const formatted = validateAndFormatSocialLink('instagram', e.target.value);
                  handleSocialMediaChange("instagram", formatted);
                }}
                className="h-12 border-gray-200 rounded-xl focus:border-primary focus:ring-0"
              />
              <p className="text-xs text-gray-500">Enter your Instagram username</p>
            </div>

            {/* Facebook */}
            <div className="space-y-2">
              <Label htmlFor="facebook" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <Facebook className="w-4 h-4" />
                Facebook
              </Label>
              <Input
                id="facebook"
                placeholder="Profile name or full URL"
                value={formData.socialMedia.facebook}
                onChange={(e) => handleSocialMediaChange("facebook", e.target.value)}
                onBlur={(e) => {
                  const formatted = validateAndFormatSocialLink('facebook', e.target.value);
                  handleSocialMediaChange("facebook", formatted);
                }}
                className="h-12 border-gray-200 rounded-xl focus:border-primary focus:ring-0"
              />
              <p className="text-xs text-gray-500">Enter your Facebook profile name</p>
            </div>

            {/* LinkedIn */}
            <div className="space-y-2">
              <Label htmlFor="linkedin" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <Linkedin className="w-4 h-4" />
                LinkedIn
              </Label>
              <Input
                id="linkedin"
                placeholder="Profile name or full URL"
                value={formData.socialMedia.linkedin}
                onChange={(e) => handleSocialMediaChange("linkedin", e.target.value)}
                onBlur={(e) => {
                  const formatted = validateAndFormatSocialLink('linkedin', e.target.value);
                  handleSocialMediaChange("linkedin", formatted);
                }}
                className="h-12 border-gray-200 rounded-xl focus:border-primary focus:ring-0"
              />
              <p className="text-xs text-gray-500">Enter your LinkedIn profile name</p>
            </div>
          </div>
        </div>

        {/* Preview */}
        {formData.bio.trim().length > 0 && (
          <div className="border border-gray-200 rounded-xl p-6">
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