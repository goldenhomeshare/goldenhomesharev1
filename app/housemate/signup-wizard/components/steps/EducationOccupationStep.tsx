"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { GraduationCap, Briefcase, Armchair, Check, ChevronDown } from "lucide-react";
import { WizardFormData } from "../HousemateSignupWizard";
import { useState, useRef, useEffect } from "react";

interface EducationOccupationStepProps {
  formData: WizardFormData;
  updateFormData: (updates: Partial<WizardFormData>) => void;
}

export function EducationOccupationStep({ formData, updateFormData }: EducationOccupationStepProps) {
  const [isEducationDropdownOpen, setIsEducationDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const educationLevels = [
    "High School",
    "Some College",
    "Bachelor Degree",
    "Graduate Degree",
    "Trade/Vocational",
    "Other"
  ];

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsEducationDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleEducationChange = (field: string, value: string | boolean) => {
    updateFormData({
      education: {
        ...formData.education,
        [field]: value
      }
    });
  };

  const handleEducationLevelSelect = (level: string) => {
    handleEducationChange("level", level);
    setIsEducationDropdownOpen(false);
  };

  const handleOccupationChange = (field: string, value: string | boolean) => {
    updateFormData({
      occupation: {
        ...formData.occupation,
        [field]: value
      }
    });
  };

  const selectedEducationLevel = educationLevels.find(level => level === formData.education.level);

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

          {/* Education Level - Custom Dropdown */}
          <div>
            <Label className="text-base font-medium">
              Education Level
            </Label>
            <div className="relative mt-2" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setIsEducationDropdownOpen(!isEducationDropdownOpen)}
                className="w-full h-12 px-4 text-lg border-2 border-gray-200 rounded-xl bg-white focus:outline-none focus:border-primary flex items-center justify-between hover:border-gray-300 transition-colors"
              >
                <span className={selectedEducationLevel ? "text-gray-900" : "text-gray-500"}>
                  {selectedEducationLevel || "Select your education level"}
                </span>
                <ChevronDown className={`w-5 h-5 text-gray-500 transition-transform ${isEducationDropdownOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {isEducationDropdownOpen && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border-2 border-gray-200 rounded-xl shadow-lg z-20 max-h-60 overflow-y-auto">
                  {educationLevels.map((level) => (
                    <button
                      key={level}
                      type="button"
                      onClick={() => handleEducationLevelSelect(level)}
                      className={`w-full px-4 py-3 text-left text-lg hover:bg-gray-50 transition-colors first:rounded-t-xl last:rounded-b-xl ${
                        formData.education.level === level 
                          ? 'bg-primary/5 text-primary font-medium' 
                          : 'text-gray-900'
                      }`}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              )}
            </div>
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
            </div>
          )}
        </div>

        {/* Occupation Section - Hidden if still attending school */}
        {!formData.education.stillAttending && (
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
        )}
      </div>
    </div>
  );
} 