"use client";

import { Label } from "@/components/ui/label";
import { 
  Sunrise, 
  Moon, 
  Clock, 
  Users, 
  User, 
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
  Dice6
} from "lucide-react";
import { WizardFormData } from "../HomeownerSignupWizard";

interface LifestyleStepProps {
  formData: WizardFormData;
  updateFormData: (updates: Partial<WizardFormData>) => void;
}

export function LifestyleStep({ formData, updateFormData }: LifestyleStepProps) {
  const scheduleOptions = [
    { id: "early-riser", label: "Early Riser", icon: Sunrise, description: "I wake up early and go to bed early" },
    { id: "night-owl", label: "Night Owl", icon: Moon, description: "I stay up late and sleep in" },
    { id: "flexible", label: "Flexible", icon: Clock, description: "My schedule varies" },
  ];

  const socialOptions = [
    { id: "social", label: "Social", icon: Users, description: "I enjoy spending time with others" },
    { id: "independent", label: "Independent", icon: User, description: "I prefer my own space" },
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
      <div className="text-center mb-8">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Your Lifestyle</h3>
        <p className="text-gray-600">Tell us about your daily routine and interests</p>
      </div>

      <div className="space-y-8">
        {/* Schedule */}
        <div className="border border-gray-200 rounded-xl p-6 space-y-6">
          <div>
            <Label className="text-lg font-medium text-gray-900 mb-2 block">
              Daily Schedule *
            </Label>
            <p className="text-sm text-gray-600 mb-4">When are you typically most active?</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {scheduleOptions.map((option) => {
              const Icon = option.icon;
              const isSelected = formData.schedule === option.id;
              
              return (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => handleSingleSelect("schedule", option.id)}
                  className={`flex flex-col items-center p-6 rounded-xl border-2 transition-all duration-200 h-full ${
                    isSelected 
                      ? "border-primary bg-primary/5 text-primary" 
                      : "border-gray-200 hover:border-gray-300 text-gray-600"
                  }`}
                >
                  <div className={`w-16 h-16 rounded-full mb-4 flex items-center justify-center ${
                    isSelected ? 'bg-primary/10' : 'bg-gray-100'
                  }`}>
                    <Icon size={32} className={isSelected ? 'text-primary' : 'text-gray-600'} />
                  </div>
                  <span className="font-medium text-lg text-center mb-2">{option.label}</span>
                  <span className="text-sm opacity-75 text-center">{option.description}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Social Preferences */}
        <div className="border border-gray-200 rounded-xl p-6 space-y-6">
          <div>
            <Label className="text-lg font-medium text-gray-900 mb-2 block">
              Social Preferences *
            </Label>
            <p className="text-sm text-gray-600 mb-4">How do you prefer to interact with housemates?</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {socialOptions.map((option) => {
              const Icon = option.icon;
              const isSelected = formData.socialPreference === option.id;
              
              return (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => handleSingleSelect("socialPreference", option.id)}
                  className={`flex flex-col items-center p-6 rounded-xl border-2 transition-all duration-200 h-full ${
                    isSelected 
                      ? "border-primary bg-primary/5 text-primary" 
                      : "border-gray-200 hover:border-gray-300 text-gray-600"
                  }`}
                >
                  <div className={`w-16 h-16 rounded-full mb-4 flex items-center justify-center ${
                    isSelected ? 'bg-primary/10' : 'bg-gray-100'
                  }`}>
                    <Icon size={32} className={isSelected ? 'text-primary' : 'text-gray-600'} />
                  </div>
                  <span className="font-medium text-lg text-center mb-2">{option.label}</span>
                  <span className="text-sm opacity-75 text-center">{option.description}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Hobbies & Interests */}
        <div className="border border-gray-200 rounded-xl p-6 space-y-6">
          <div>
            <Label className="text-lg font-medium text-gray-900 mb-2 block">
              Hobbies & Interests
            </Label>
            <p className="text-sm text-gray-600 mb-4">Select all that apply (optional)</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {hobbiesOptions.map((option) => {
              const Icon = option.icon;
              const isSelected = formData.hobbies.includes(option.id);
              
              return (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => handleHobbyToggle(option.id)}
                  className={`flex flex-col items-center p-4 rounded-xl border-2 transition-all duration-200 h-full ${
                    isSelected 
                      ? "border-primary bg-primary/5 text-primary" 
                      : "border-gray-200 hover:border-gray-300 text-gray-600"
                  }`}
                >
                  <div className={`w-12 h-12 rounded-full mb-3 flex items-center justify-center ${
                    isSelected ? 'bg-primary/10' : 'bg-gray-100'
                  }`}>
                    <Icon size={24} className={isSelected ? 'text-primary' : 'text-gray-600'} />
                  </div>
                  <span className="font-medium text-center text-sm">{option.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
} 