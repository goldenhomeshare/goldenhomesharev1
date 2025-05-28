"use client";

import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { 
  User, 
  Instagram, 
  Facebook, 
  Linkedin,
  Users,
  Home,
  Heart
} from "lucide-react";
import { WizardFormData } from "../HomeownerSignupWizard";

interface BioStepProps {
  formData: WizardFormData;
  updateFormData: (updates: Partial<WizardFormData>) => void;
}

export function BioStep({ formData, updateFormData }: BioStepProps) {
  const handleBioChange = (bio: string) => {
    updateFormData({ bio });
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

      {/* Social Media Section */}
      <div className="space-y-6">
        <div>
          <Label className="text-lg font-medium text-gray-900 flex items-center gap-2 mb-2">
            <Users className="w-5 h-5" />
            Social Media (Optional)
          </Label>
          <p className="text-sm text-gray-600 mb-4">
            Adding social media links can help potential housemates get to know you better and build trust
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
    </div>
  );
} 