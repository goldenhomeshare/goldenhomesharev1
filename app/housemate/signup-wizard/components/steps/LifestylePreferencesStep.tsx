"use client";

import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Sunrise, 
  Moon, 
  Clock, 
  Users, 
  User, 
  CircleDot, 
  PawPrint, 
  CigaretteOff,
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
  Dice6,
  Check
} from "lucide-react";
import { WizardFormData } from "../HousemateSignupWizard";

interface LifestylePreferencesStepProps {
  formData: WizardFormData;
  updateFormData: (updates: Partial<WizardFormData>) => void;
}

export function LifestylePreferencesStep({ formData, updateFormData }: LifestylePreferencesStepProps) {
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

  const handleLifestyleChange = (field: string, value: string | boolean) => {
    updateFormData({
      lifestyle: {
        ...formData.lifestyle,
        [field]: value
      }
    });
  };

  return (
    <div className="space-y-8">
      <div className="space-y-8">
        {/* Schedule */}
        <div>
          <Label className="text-base font-medium mb-4 block">
            Schedule *
          </Label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {scheduleOptions.map((option) => {
              const Icon = option.icon;
              const isSelected = formData.schedule === option.id;
              
              return (
                <div key={option.id}>
                  <label className="cursor-pointer">
                    <input
                      type="radio"
                      name="schedule"
                      className="sr-only peer"
                      checked={isSelected}
                      onChange={() => handleSingleSelect("schedule", option.id)}
                    />
                    <div className="flex flex-col items-center p-6 rounded-lg border-2 peer-checked:border-primary peer-checked:bg-primary/5 hover:bg-slate-50 transition-all duration-200 h-full">
                      <div className="w-16 h-16 rounded-full bg-slate-100 mb-4 flex items-center justify-center">
                        <Icon size={32} className="text-slate-600" />
                      </div>
                      <span className="font-medium text-lg text-center mb-2">{option.label}</span>
                      <span className="text-sm text-gray-500 text-center">{option.description}</span>
                    </div>
                  </label>
                </div>
              );
            })}
          </div>
        </div>

        {/* Social Preferences */}
        <div>
          <Label className="text-base font-medium mb-4 block">
            Social Preferences *
          </Label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {socialOptions.map((option) => {
              const Icon = option.icon;
              const isSelected = formData.socialPreference === option.id;
              
              return (
                <div key={option.id}>
                  <label className="cursor-pointer">
                    <input
                      type="radio"
                      name="socialPreference"
                      className="sr-only peer"
                      checked={isSelected}
                      onChange={() => handleSingleSelect("socialPreference", option.id)}
                    />
                    <div className="flex flex-col items-center p-6 rounded-lg border-2 peer-checked:border-primary peer-checked:bg-primary/5 hover:bg-slate-50 transition-all duration-200 h-full">
                      <div className="w-16 h-16 rounded-full bg-slate-100 mb-4 flex items-center justify-center">
                        <Icon size={32} className="text-slate-600" />
                      </div>
                      <span className="font-medium text-lg text-center mb-2">{option.label}</span>
                      <span className="text-sm text-gray-500 text-center">{option.description}</span>
                    </div>
                  </label>
                </div>
              );
            })}
          </div>
        </div>

        {/* Hobbies & Interests */}
        <div>
          <Label className="text-base font-medium mb-4 block">
            Hobbies & Interests
          </Label>
          <p className="text-sm text-muted-foreground mb-4">Select all that apply</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {hobbiesOptions.map((option) => {
              const Icon = option.icon;
              const isSelected = formData.hobbies.includes(option.id);
              
              return (
                <div key={option.id}>
                  <label className="cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={isSelected}
                      onChange={() => handleHobbyToggle(option.id)}
                    />
                    <div className="flex flex-col items-center p-4 rounded-lg border peer-checked:border-primary peer-checked:bg-primary/5 hover:bg-slate-50 h-full">
                      <div className="w-12 h-12 rounded-full bg-slate-100 mb-3 flex items-center justify-center">
                        <Icon size={24} className="text-slate-600" />
                      </div>
                      <span className="font-medium text-center text-sm">{option.label}</span>
                    </div>
                  </label>
                </div>
              );
            })}
          </div>
        </div>

        {/* Pets */}
        <div className="border border-gray-200 rounded-lg p-6 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
              <PawPrint size={24} className="text-gray-600" />
            </div>
            <Label className="text-base font-medium">Pets</Label>
          </div>
          
          <div className="space-y-3">
            <label className="cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={formData.lifestyle.hasPets}
                onChange={(e) => handleLifestyleChange("hasPets", e.target.checked)}
              />
              <div className="flex items-center p-3 rounded-lg border peer-checked:border-primary peer-checked:bg-primary/5 hover:bg-slate-50 transition-colors">
                <div className="flex-1">
                  <span className="font-medium text-sm">I have pets that I plan to bring</span>
                </div>
                <div className={`w-4 h-4 rounded border transition-colors ${
                  formData.lifestyle.hasPets 
                    ? 'border-primary bg-primary' 
                    : 'border-gray-300'
                }`}>
                  {formData.lifestyle.hasPets && (
                    <Check className="w-3 h-3 text-white" />
                  )}
                </div>
              </div>
            </label>
            
            {formData.lifestyle.hasPets && (
              <div className="ml-3">
                <Label className="text-sm text-muted-foreground mb-2 block">
                  Please describe your pets (type, size, behavior, etc.):
                </Label>
                <Textarea
                  placeholder="e.g., Small, friendly dog that is house-trained and quiet"
                  value={formData.lifestyle.petDescription}
                  onChange={(e) => handleLifestyleChange("petDescription", e.target.value)}
                  rows={3}
                  className="border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200"
                />
              </div>
            )}
          </div>
        </div>

        {/* Number of People */}
        <div className="border border-gray-200 rounded-lg p-6 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
              <Users size={24} className="text-gray-600" />
            </div>
            <Label className="text-base font-medium">Number of People</Label>
          </div>
          
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">
              Homesharing is typically for one individual, but some opportunities for multiple people may be available.
            </p>
            
            <div className="space-y-2">
              {[
                { value: "1", label: "Just myself (1 person)" },
                { value: "2", label: "2 people" },
                { value: "3+", label: "3 or more people" }
              ].map((option) => {
                const isSelected = formData.lifestyle.numberOfPeople === option.value;
                
                return (
                  <div key={option.value}>
                    <label className="cursor-pointer">
                      <input
                        type="radio"
                        name="numberOfPeople"
                        className="sr-only peer"
                        checked={isSelected}
                        onChange={() => handleLifestyleChange("numberOfPeople", option.value)}
                      />
                      <div className="flex items-center p-3 rounded-lg border peer-checked:border-primary peer-checked:bg-primary/5 hover:bg-slate-50 transition-colors">
                        <div className="flex-1">
                          <span className="font-medium text-sm">{option.label}</span>
                        </div>
                        <div className={`w-4 h-4 rounded-full border-2 transition-colors ${
                          isSelected 
                            ? 'border-primary bg-primary' 
                            : 'border-gray-300'
                        }`}>
                          {isSelected && (
                            <div className="w-full h-full rounded-full bg-white scale-50"></div>
                          )}
                        </div>
                      </div>
                    </label>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Smoking Status */}
        <div className="border border-gray-200 rounded-lg p-6 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
              <CigaretteOff size={24} className="text-gray-600" />
            </div>
            <Label className="text-base font-medium">Smoking Status *</Label>
          </div>
          
          <div className="space-y-2">
            {[
              { value: "no", label: "Non-smoker" },
              { value: "outside", label: "Smoker (outside only)" },
              { value: "yes", label: "Smoker (anywhere)" }
            ].map((option) => {
              const isSelected = formData.lifestyle.smokingStatus === option.value;
              
              return (
                <div key={option.value}>
                  <label className="cursor-pointer">
                    <input
                      type="radio"
                      name="smokingStatus"
                      className="sr-only peer"
                      checked={isSelected}
                      onChange={() => handleLifestyleChange("smokingStatus", option.value)}
                    />
                    <div className="flex items-center p-3 rounded-lg border peer-checked:border-primary peer-checked:bg-primary/5 hover:bg-slate-50 transition-colors">
                      <div className="flex-1">
                        <span className="font-medium text-sm">{option.label}</span>
                      </div>
                      <div className={`w-4 h-4 rounded-full border-2 transition-colors ${
                        isSelected 
                          ? 'border-primary bg-primary' 
                          : 'border-gray-300'
                      }`}>
                        {isSelected && (
                          <div className="w-full h-full rounded-full bg-white scale-50"></div>
                        )}
                      </div>
                    </div>
                  </label>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
} 