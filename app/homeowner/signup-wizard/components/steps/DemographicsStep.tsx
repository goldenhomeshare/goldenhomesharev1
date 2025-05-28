"use client";

import { Label } from "@/components/ui/label";
import { 
  GraduationCap, 
  Briefcase, 
  User, 
  UserCheck, 
  Users, 
  Crown,
  Sunrise,
  Moon,
  Clock,
  CircleDot,
  Flower,
  ChefHat,
  Book,
  Tv,
  HandHeart,
  Dumbbell,
  Church,
  Palette,
  Music,
  Laptop,
  PawPrint,
  Dice6
} from "lucide-react";
import { WizardFormData } from "../HomeownerSignupWizard";

interface DemographicsStepProps {
  formData: WizardFormData;
  updateFormData: (updates: Partial<WizardFormData>) => void;
}

export function DemographicsStep({ formData, updateFormData }: DemographicsStepProps) {
  const ageRangeOptions = [
    { id: "18-24", label: "18–24", icon: GraduationCap },
    { id: "25-34", label: "25–34", icon: Briefcase },
    { id: "35-44", label: "35–44", icon: User },
    { id: "45-54", label: "45–54", icon: UserCheck },
    { id: "55-64", label: "55–64", icon: Users },
    { id: "65+", label: "65+", icon: Crown },
  ];

  const scheduleOptions = [
    { id: "early-riser", label: "Early Riser", icon: Sunrise, description: "I prefer morning activities" },
    { id: "night-owl", label: "Night Owl", icon: Moon, description: "I'm most active in the evenings" },
    { id: "flexible", label: "Flexible", icon: Clock, description: "I adapt to different schedules" },
  ];

  const socialOptions = [
    { id: "social", label: "Social", icon: Users, description: "I enjoy company and activities" },
    { id: "independent", label: "Independent", icon: User, description: "I value my personal space" },
    { id: "balanced", label: "Balanced", icon: CircleDot, description: "I like a mix of both" },
  ];

  const hobbiesOptions = [
    { id: "gardening", label: "Gardening", icon: Flower },
    { id: "cooking", label: "Cooking/Baking", icon: ChefHat },
    { id: "reading", label: "Reading", icon: Book },
    { id: "movies", label: "Movies/TV", icon: Tv },
    { id: "volunteering", label: "Volunteering", icon: HandHeart },
    { id: "fitness", label: "Fitness", icon: Dumbbell },
    { id: "church", label: "Church/Religious", icon: Church },
    { id: "crafting", label: "Crafting/Art", icon: Palette },
    { id: "music", label: "Music", icon: Music },
    { id: "tech", label: "Tech/Computers", icon: Laptop },
    { id: "pets", label: "Pets/Animals", icon: PawPrint },
    { id: "games", label: "Board Games", icon: Dice6 },
  ];

  const handleSingleSelect = (field: keyof WizardFormData, value: string) => {
    updateFormData({ [field]: value });
  };

  const handleHobbyToggle = (hobbyId: string) => {
    const currentHobbies = formData.hobbies || [];
    const updatedHobbies = currentHobbies.includes(hobbyId)
      ? currentHobbies.filter(id => id !== hobbyId)
      : [...currentHobbies, hobbyId];
    
    updateFormData({ hobbies: updatedHobbies });
  };

  return (
    <div className="space-y-10">
      {/* Schedule Selection */}
      <div className="space-y-4">
        <Label className="text-lg font-medium text-gray-900">
          Schedule Preference *
        </Label>
        <p className="text-sm text-gray-600 mb-4">What's your typical daily rhythm?</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {scheduleOptions.map((option) => {
            const Icon = option.icon;
            const isSelected = formData.schedule === option.id;
            
            return (
              <button
                key={option.id}
                type="button"
                onClick={() => handleSingleSelect("schedule", option.id)}
                className={`flex flex-col items-center p-6 rounded-xl border-2 transition-all duration-200 text-center ${
                  isSelected
                    ? "border-primary bg-primary/5 text-primary"
                    : "border-gray-200 hover:border-gray-300 text-gray-600"
                }`}
              >
                <div className={`w-12 h-12 rounded-full mb-3 flex items-center justify-center ${
                  isSelected ? "bg-primary/10" : "bg-gray-100"
                }`}>
                  <Icon className="w-6 h-6" />
                </div>
                <span className="font-medium mb-1">{option.label}</span>
                <span className="text-xs opacity-75">{option.description}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Social Preferences */}
      <div className="space-y-4">
        <Label className="text-lg font-medium text-gray-900">
          Social Preference *
        </Label>
        <p className="text-sm text-gray-600 mb-4">How do you prefer to interact in your living space?</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {socialOptions.map((option) => {
            const Icon = option.icon;
            const isSelected = formData.socialPreference === option.id;
            
            return (
              <button
                key={option.id}
                type="button"
                onClick={() => handleSingleSelect("socialPreference", option.id)}
                className={`flex flex-col items-center p-6 rounded-xl border-2 transition-all duration-200 text-center ${
                  isSelected
                    ? "border-primary bg-primary/5 text-primary"
                    : "border-gray-200 hover:border-gray-300 text-gray-600"
                }`}
              >
                <div className={`w-12 h-12 rounded-full mb-3 flex items-center justify-center ${
                  isSelected ? "bg-primary/10" : "bg-gray-100"
                }`}>
                  <Icon className="w-6 h-6" />
                </div>
                <span className="font-medium mb-1">{option.label}</span>
                <span className="text-xs opacity-75">{option.description}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Hobbies/Interests */}
      <div className="space-y-4">
        <Label className="text-lg font-medium text-gray-900">
          Hobbies & Interests
        </Label>
        <p className="text-sm text-gray-600 mb-4">Select all that apply (optional, but helps with matching)</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {hobbiesOptions.map((option) => {
            const Icon = option.icon;
            const isSelected = formData.hobbies?.includes(option.id) || false;
            
            return (
              <button
                key={option.id}
                type="button"
                onClick={() => handleHobbyToggle(option.id)}
                className={`flex flex-col items-center p-4 rounded-xl border-2 transition-all duration-200 ${
                  isSelected
                    ? "border-primary bg-primary/5 text-primary"
                    : "border-gray-200 hover:border-gray-300 text-gray-600"
                }`}
              >
                <div className={`w-10 h-10 rounded-full mb-2 flex items-center justify-center ${
                  isSelected ? "bg-primary/10" : "bg-gray-100"
                }`}>
                  <Icon className="w-5 h-5" />
                </div>
                <span className="font-medium text-sm text-center">{option.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
} 