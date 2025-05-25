"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { GraduationCap, Briefcase, Armchair, Check } from "lucide-react";
import { WizardFormData } from "../HousemateSignupWizard";

interface EducationOccupationStepProps {
  formData: WizardFormData;
  updateFormData: (updates: Partial<WizardFormData>) => void;
}

export function EducationOccupationStep({ formData, updateFormData }: EducationOccupationStepProps) {
  const educationLevels = [
    "High School",
    "Some College",
    "Associate's Degree",
    "Bachelor's Degree",
    "Master's Degree",
    "Doctoral Degree",
    "Professional Degree",
    "Trade/Vocational School",
    "Other"
  ];

  const handleEducationChange = (field: string, value: string | boolean) => {
    updateFormData({
      education: {
        ...formData.education,
        [field]: value
      }
    });
  };

  const handleOccupationChange = (field: string, value: string | boolean) => {
    updateFormData({
      occupation: {
        ...formData.occupation,
        [field]: value
      }
    });
  };

  return (
    <div className="space-y-8">
      <div className="space-y-8">
        {/* Education Section */}
        <div className="border border-gray-200 rounded-lg p-6 space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
              <GraduationCap size={24} className="text-gray-600" />
            </div>
            <h3 className="text-xl font-semibold">Education</h3>
          </div>

          {/* Education Level */}
          <div>
            <Label htmlFor="educationLevel" className="text-base font-medium">
              Education Level
            </Label>
            <select
              id="educationLevel"
              value={formData.education.level}
              onChange={(e) => handleEducationChange("level", e.target.value)}
              className="mt-2 h-12 w-full px-3 py-2 border border-gray-300 rounded-md text-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="">Select your education level</option>
              {educationLevels.map((level) => (
                <option key={level} value={level}>
                  {level}
                </option>
              ))}
            </select>
          </div>

          {/* Still Attending */}
          {formData.education.level && (
            <div>
              <label className="cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={formData.education.stillAttending}
                  onChange={(e) => handleEducationChange("stillAttending", e.target.checked)}
                />
                <div className="flex items-center p-4 rounded-lg border peer-checked:border-primary peer-checked:bg-primary/5 hover:bg-slate-50 transition-colors">
                  <div className="flex-1">
                    <span className="font-medium">I am still attending/enrolled</span>
                  </div>
                  <div className={`w-5 h-5 rounded border transition-colors ${
                    formData.education.stillAttending 
                      ? 'border-primary bg-primary' 
                      : 'border-gray-300'
                  }`}>
                    {formData.education.stillAttending && (
                      <Check className="w-4 h-4 text-white" />
                    )}
                  </div>
                </div>
              </label>
            </div>
          )}

          {/* Degree Program */}
          {formData.education.level && (
            <div>
              <Label htmlFor="degreeProgram" className="text-base font-medium">
                Degree Program / Field of Study
              </Label>
              <Input
                id="degreeProgram"
                placeholder="e.g., Computer Science, Business Administration, Nursing"
                value={formData.education.degreeProgram}
                onChange={(e) => handleEducationChange("degreeProgram", e.target.value)}
                className="mt-2 h-12 text-lg"
              />
              <p className="text-sm text-gray-500 mt-1">
                What did you study or are currently studying?
              </p>
            </div>
          )}
        </div>

        {/* Occupation Section */}
        <div className="border border-gray-200 rounded-lg p-6 space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center">
              <Briefcase size={24} className="text-slate-600" />
            </div>
            <h3 className="text-xl font-semibold">Work & Career</h3>
          </div>

          {/* Retired Option */}
          <div>
            <label className="cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={formData.occupation.isRetired}
                onChange={(e) => handleOccupationChange("isRetired", e.target.checked)}
              />
              <div className="flex items-center p-4 rounded-lg border peer-checked:border-primary peer-checked:bg-primary/5 hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-3 flex-1">
                  <Armchair size={24} className="text-gray-600" />
                  <span className="font-medium">I am retired</span>
                </div>
                <div className={`w-5 h-5 rounded border transition-colors ${
                  formData.occupation.isRetired 
                    ? 'border-primary bg-primary' 
                    : 'border-gray-300'
                }`}>
                  {formData.occupation.isRetired && (
                    <Check className="w-4 h-4 text-white" />
                  )}
                </div>
              </div>
            </label>
          </div>

          {/* Occupation Description */}
          {!formData.occupation.isRetired && (
            <div>
              <Label htmlFor="occupationDescription" className="text-base font-medium">
                What do you do for work?
              </Label>
              <Textarea
                id="occupationDescription"
                placeholder="Describe your job, profession, or current work situation..."
                value={formData.occupation.description}
                onChange={(e) => handleOccupationChange("description", e.target.value)}
                rows={4}
                className="mt-2 text-lg"
              />
              <p className="text-sm text-gray-500 mt-1">
                This helps homeowners understand your background and schedule
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 