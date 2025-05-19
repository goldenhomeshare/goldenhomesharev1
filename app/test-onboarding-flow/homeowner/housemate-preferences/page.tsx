import Link from "next/link";
import { User, Users, Calendar, Clock, Heart, Leaf, AlertTriangle, Bird, Music, BookOpen, Coffee, Wine, Ban, Sun, Moon, Sunrise, CircleUser, UserCircle2, CircleDashed, Utensils, Tv, Volume2, Volume, Car, DoorOpen, MessageCircle, Cigarette, Wind, Dog, Cat, PawPrint } from "lucide-react";

export default function HousematePreferencesPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      {/* Testing Notice Banner */}
      <div className="bg-amber-50 border-l-4 border-amber-400 p-4 mb-8 rounded-md">
        <div className="flex">
          <div className="flex-shrink-0">
            <AlertTriangle className="h-5 w-5 text-amber-400" aria-hidden="true" />
          </div>
          <div className="ml-3">
            <p className="text-sm text-amber-700">
              <span className="font-medium">Testing Mode:</span> This onboarding flow is currently being tested. Any information entered is only for experience evaluation and will not be saved.
            </p>
          </div>
        </div>
      </div>
      
      <div className="mb-6 text-center">
        <h1 className="text-3xl font-bold mb-2">Housemate Preferences</h1>
        <p className="text-muted-foreground">
          Tell us what you're looking for in an ideal housemate
        </p>
      </div>

      <div className="bg-white shadow-lg rounded-lg p-8 mb-10">
        {/* Preferred Age Range */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-4">Preferred Age Range</h2>
          <div className="grid grid-cols-3 gap-4">
            <label className="cursor-pointer">
              <input type="checkbox" name="preferredAge" value="18-29" className="sr-only peer" />
              <div className="flex flex-col items-center p-4 rounded-lg border peer-checked:border-primary peer-checked:bg-primary/5 hover:bg-slate-50 h-full">
                <div className="w-12 h-12 rounded-full bg-slate-100 mb-3 flex items-center justify-center">
                  <Clock size={24} className="text-slate-600" />
                </div>
                <span className="font-medium text-center">18 to 29</span>
                <span className="text-xs text-center text-slate-500">Young adult</span>
              </div>
            </label>
            
            <label className="cursor-pointer">
              <input type="checkbox" name="preferredAge" value="30-49" className="sr-only peer" />
              <div className="flex flex-col items-center p-4 rounded-lg border peer-checked:border-primary peer-checked:bg-primary/5 hover:bg-slate-50 h-full">
                <div className="w-12 h-12 rounded-full bg-slate-100 mb-3 flex items-center justify-center">
                  <Clock size={24} className="text-slate-600" />
                </div>
                <span className="font-medium text-center">30 to 49</span>
                <span className="text-xs text-center text-slate-500">Mid-age adult</span>
              </div>
            </label>
            
            <label className="cursor-pointer">
              <input type="checkbox" name="preferredAge" value="50+" className="sr-only peer" />
              <div className="flex flex-col items-center p-4 rounded-lg border peer-checked:border-primary peer-checked:bg-primary/5 hover:bg-slate-50 h-full">
                <div className="w-12 h-12 rounded-full bg-slate-100 mb-3 flex items-center justify-center">
                  <Clock size={24} className="text-slate-600" />
                </div>
                <span className="font-medium text-center">50 and up</span>
                <span className="text-xs text-center text-slate-500">Senior adult</span>
              </div>
            </label>
          </div>
        </div>

        {/* Preferred Gender */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-4">Preferred Gender</h2>
          <div className="grid grid-cols-3 gap-4">
            <label className="cursor-pointer">
              <input type="checkbox" name="preferredGender" value="female" className="sr-only peer" />
              <div className="flex flex-col items-center p-4 rounded-lg border peer-checked:border-primary peer-checked:bg-primary/5 hover:bg-slate-50 h-full">
                <div className="w-12 h-12 rounded-full bg-slate-100 mb-3 flex items-center justify-center">
                  <CircleUser size={24} className="text-slate-600" />
                </div>
                <span className="font-medium text-center">Female</span>
                <span className="text-xs text-center text-slate-500">Female housemates</span>
              </div>
            </label>
            
            <label className="cursor-pointer">
              <input type="checkbox" name="preferredGender" value="male" className="sr-only peer" />
              <div className="flex flex-col items-center p-4 rounded-lg border peer-checked:border-primary peer-checked:bg-primary/5 hover:bg-slate-50 h-full">
                <div className="w-12 h-12 rounded-full bg-slate-100 mb-3 flex items-center justify-center">
                  <UserCircle2 size={24} className="text-slate-600" />
                </div>
                <span className="font-medium text-center">Male</span>
                <span className="text-xs text-center text-slate-500">Male housemates</span>
              </div>
            </label>
            
            <label className="cursor-pointer">
              <input type="checkbox" name="preferredGender" value="any" className="sr-only peer" />
              <div className="flex flex-col items-center p-4 rounded-lg border peer-checked:border-primary peer-checked:bg-primary/5 hover:bg-slate-50 h-full">
                <div className="w-12 h-12 rounded-full bg-slate-100 mb-3 flex items-center justify-center">
                  <CircleDashed size={24} className="text-slate-600" />
                </div>
                <span className="font-medium text-center">Any</span>
                <span className="text-xs text-center text-slate-500">No gender preference</span>
              </div>
            </label>
          </div>
        </div>

        {/* Meal Sharing Preferences */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-4">Meal Sharing</h2>
          <div className="grid grid-cols-3 gap-4">
            <label className="cursor-pointer">
              <input type="checkbox" name="mealSharing" value="shared" className="sr-only peer" />
              <div className="flex flex-col items-center p-4 rounded-lg border peer-checked:border-primary peer-checked:bg-primary/5 hover:bg-slate-50 h-full">
                <div className="w-12 h-12 rounded-full bg-slate-100 mb-3 flex items-center justify-center">
                  <Utensils size={24} className="text-slate-600" />
                </div>
                <span className="font-medium text-center">Shared Meals</span>
                <span className="text-xs text-center text-slate-500">Prefer eating together regularly</span>
              </div>
            </label>
            
            <label className="cursor-pointer">
              <input type="checkbox" name="mealSharing" value="occasional" className="sr-only peer" />
              <div className="flex flex-col items-center p-4 rounded-lg border peer-checked:border-primary peer-checked:bg-primary/5 hover:bg-slate-50 h-full">
                <div className="w-12 h-12 rounded-full bg-slate-100 mb-3 flex items-center justify-center">
                  <Coffee size={24} className="text-slate-600" />
                </div>
                <span className="font-medium text-center">Occasional</span>
                <span className="text-xs text-center text-slate-500">Sometimes share meals</span>
              </div>
            </label>
            
            <label className="cursor-pointer">
              <input type="checkbox" name="mealSharing" value="separate" className="sr-only peer" />
              <div className="flex flex-col items-center p-4 rounded-lg border peer-checked:border-primary peer-checked:bg-primary/5 hover:bg-slate-50 h-full">
                <div className="w-12 h-12 rounded-full bg-slate-100 mb-3 flex items-center justify-center">
                  <DoorOpen size={24} className="text-slate-600" />
                </div>
                <span className="font-medium text-center">Separate</span>
                <span className="text-xs text-center text-slate-500">Prefer independent meals</span>
              </div>
            </label>
          </div>
        </div>

        {/* Communication Style */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-4">Communication Style</h2>
          <div className="grid grid-cols-3 gap-4">
            <label className="cursor-pointer">
              <input type="checkbox" name="communication" value="frequent" className="sr-only peer" />
              <div className="flex flex-col items-center p-4 rounded-lg border peer-checked:border-primary peer-checked:bg-primary/5 hover:bg-slate-50 h-full">
                <div className="w-12 h-12 rounded-full bg-slate-100 mb-3 flex items-center justify-center">
                  <MessageCircle size={24} className="text-slate-600" />
                </div>
                <span className="font-medium text-center">Frequent</span>
                <span className="text-xs text-center text-slate-500">Regular check-ins and chats</span>
              </div>
            </label>
            
            <label className="cursor-pointer">
              <input type="checkbox" name="communication" value="asNeeded" className="sr-only peer" />
              <div className="flex flex-col items-center p-4 rounded-lg border peer-checked:border-primary peer-checked:bg-primary/5 hover:bg-slate-50 h-full">
                <div className="w-12 h-12 rounded-full bg-slate-100 mb-3 flex items-center justify-center">
                  <User size={24} className="text-slate-600" />
                </div>
                <span className="font-medium text-center">As Needed</span>
                <span className="text-xs text-center text-slate-500">Communicate when necessary</span>
              </div>
            </label>
            
            <label className="cursor-pointer">
              <input type="checkbox" name="communication" value="minimal" className="sr-only peer" />
              <div className="flex flex-col items-center p-4 rounded-lg border peer-checked:border-primary peer-checked:bg-primary/5 hover:bg-slate-50 h-full">
                <div className="w-12 h-12 rounded-full bg-slate-100 mb-3 flex items-center justify-center">
                  <Volume size={24} className="text-slate-600" />
                </div>
                <span className="font-medium text-center">Minimal</span>
                <span className="text-xs text-center text-slate-500">Prefer limited interaction</span>
              </div>
            </label>
          </div>
        </div>

        {/* Common Space Usage */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-4">Common Space Usage</h2>
          <div className="grid grid-cols-3 gap-4">
            <label className="cursor-pointer">
              <input type="checkbox" name="commonSpaces" value="shared" className="sr-only peer" />
              <div className="flex flex-col items-center p-4 rounded-lg border peer-checked:border-primary peer-checked:bg-primary/5 hover:bg-slate-50 h-full">
                <div className="w-12 h-12 rounded-full bg-slate-100 mb-3 flex items-center justify-center">
                  <Tv size={24} className="text-slate-600" />
                </div>
                <span className="font-medium text-center">Shared Use</span>
                <span className="text-xs text-center text-slate-500">Regularly use common areas together</span>
              </div>
            </label>
            
            <label className="cursor-pointer">
              <input type="checkbox" name="commonSpaces" value="scheduled" className="sr-only peer" />
              <div className="flex flex-col items-center p-4 rounded-lg border peer-checked:border-primary peer-checked:bg-primary/5 hover:bg-slate-50 h-full">
                <div className="w-12 h-12 rounded-full bg-slate-100 mb-3 flex items-center justify-center">
                  <Calendar size={24} className="text-slate-600" />
                </div>
                <span className="font-medium text-center">Scheduled</span>
                <span className="text-xs text-center text-slate-500">Coordinate use of shared spaces</span>
              </div>
            </label>
            
            <label className="cursor-pointer">
              <input type="checkbox" name="commonSpaces" value="private" className="sr-only peer" />
              <div className="flex flex-col items-center p-4 rounded-lg border peer-checked:border-primary peer-checked:bg-primary/5 hover:bg-slate-50 h-full">
                <div className="w-12 h-12 rounded-full bg-slate-100 mb-3 flex items-center justify-center">
                  <DoorOpen size={24} className="text-slate-600" />
                </div>
                <span className="font-medium text-center">Private</span>
                <span className="text-xs text-center text-slate-500">Prefer separate living spaces</span>
              </div>
            </label>
          </div>
        </div>

        {/* Smoking Preferences */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-4">Smoking Preferences</h2>
          <div className="grid grid-cols-3 gap-4">
            <label className="cursor-pointer">
              <input type="checkbox" name="smoking" value="nonsmoker" className="sr-only peer" />
              <div className="flex flex-col items-center p-4 rounded-lg border peer-checked:border-primary peer-checked:bg-primary/5 hover:bg-slate-50 h-full">
                <div className="w-12 h-12 rounded-full bg-slate-100 mb-3 flex items-center justify-center">
                  <Ban size={24} className="text-slate-600" />
                </div>
                <span className="font-medium text-center">Non-Smoker</span>
                <span className="text-xs text-center text-slate-500">Prefer non-smoking housemate</span>
              </div>
            </label>
            
            <label className="cursor-pointer">
              <input type="checkbox" name="smoking" value="smoker" className="sr-only peer" />
              <div className="flex flex-col items-center p-4 rounded-lg border peer-checked:border-primary peer-checked:bg-primary/5 hover:bg-slate-50 h-full">
                <div className="w-12 h-12 rounded-full bg-slate-100 mb-3 flex items-center justify-center">
                  <Cigarette size={24} className="text-slate-600" />
                </div>
                <span className="font-medium text-center">Smoker OK</span>
                <span className="text-xs text-center text-slate-500">Open to smokers</span>
              </div>
            </label>
            
            <label className="cursor-pointer">
              <input type="checkbox" name="smoking" value="outdoorOnly" className="sr-only peer" />
              <div className="flex flex-col items-center p-4 rounded-lg border peer-checked:border-primary peer-checked:bg-primary/5 hover:bg-slate-50 h-full">
                <div className="w-12 h-12 rounded-full bg-slate-100 mb-3 flex items-center justify-center">
                  <Wind size={24} className="text-slate-600" />
                </div>
                <span className="font-medium text-center">Outdoor Only</span>
                <span className="text-xs text-center text-slate-500">Outdoor smoking only</span>
              </div>
            </label>
          </div>
        </div>
        
        {/* Pet Preferences */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-4">Pet Preferences</h2>
          <div className="grid grid-cols-3 gap-4">
            <label className="cursor-pointer">
              <input type="checkbox" name="pets" value="noPets" className="sr-only peer" />
              <div className="flex flex-col items-center p-4 rounded-lg border peer-checked:border-primary peer-checked:bg-primary/5 hover:bg-slate-50 h-full">
                <div className="w-12 h-12 rounded-full bg-slate-100 mb-3 flex items-center justify-center">
                  <Ban size={24} className="text-slate-600" />
                </div>
                <span className="font-medium text-center">No Pets</span>
                <span className="text-xs text-center text-slate-500">Prefer housemate without pets</span>
              </div>
            </label>
            
            <label className="cursor-pointer">
              <input type="checkbox" name="pets" value="dogFriendly" className="sr-only peer" />
              <div className="flex flex-col items-center p-4 rounded-lg border peer-checked:border-primary peer-checked:bg-primary/5 hover:bg-slate-50 h-full">
                <div className="w-12 h-12 rounded-full bg-slate-100 mb-3 flex items-center justify-center">
                  <Dog size={24} className="text-slate-600" />
                </div>
                <span className="font-medium text-center">Dogs OK</span>
                <span className="text-xs text-center text-slate-500">Open to housemates with dogs</span>
              </div>
            </label>
            
            <label className="cursor-pointer">
              <input type="checkbox" name="pets" value="catFriendly" className="sr-only peer" />
              <div className="flex flex-col items-center p-4 rounded-lg border peer-checked:border-primary peer-checked:bg-primary/5 hover:bg-slate-50 h-full">
                <div className="w-12 h-12 rounded-full bg-slate-100 mb-3 flex items-center justify-center">
                  <Cat size={24} className="text-slate-600" />
                </div>
                <span className="font-medium text-center">Cats OK</span>
                <span className="text-xs text-center text-slate-500">Open to housemates with cats</span>
              </div>
            </label>
            
            <label className="cursor-pointer">
              <input type="checkbox" name="pets" value="otherPets" className="sr-only peer" />
              <div className="flex flex-col items-center p-4 rounded-lg border peer-checked:border-primary peer-checked:bg-primary/5 hover:bg-slate-50 h-full">
                <div className="w-12 h-12 rounded-full bg-slate-100 mb-3 flex items-center justify-center">
                  <PawPrint size={24} className="text-slate-600" />
                </div>
                <span className="font-medium text-center">Other Pets OK</span>
                <span className="text-xs text-center text-slate-500">Open to other types of pets</span>
              </div>
            </label>
          </div>
        </div>

        {/* Visitors Policy */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-4">Visitors Policy</h2>
          <div className="grid grid-cols-3 gap-4">
            <label className="cursor-pointer">
              <input type="checkbox" name="visitors" value="frequent" className="sr-only peer" />
              <div className="flex flex-col items-center p-4 rounded-lg border peer-checked:border-primary peer-checked:bg-primary/5 hover:bg-slate-50 h-full">
                <div className="w-12 h-12 rounded-full bg-slate-100 mb-3 flex items-center justify-center">
                  <Users size={24} className="text-slate-600" />
                </div>
                <span className="font-medium text-center">Frequent</span>
                <span className="text-xs text-center text-slate-500">Regular visitors welcome</span>
              </div>
            </label>
            
            <label className="cursor-pointer">
              <input type="checkbox" name="visitors" value="occasional" className="sr-only peer" />
              <div className="flex flex-col items-center p-4 rounded-lg border peer-checked:border-primary peer-checked:bg-primary/5 hover:bg-slate-50 h-full">
                <div className="w-12 h-12 rounded-full bg-slate-100 mb-3 flex items-center justify-center">
                  <Calendar size={24} className="text-slate-600" />
                </div>
                <span className="font-medium text-center">Occasional</span>
                <span className="text-xs text-center text-slate-500">Some visitors with notice</span>
              </div>
            </label>
            
            <label className="cursor-pointer">
              <input type="checkbox" name="visitors" value="limited" className="sr-only peer" />
              <div className="flex flex-col items-center p-4 rounded-lg border peer-checked:border-primary peer-checked:bg-primary/5 hover:bg-slate-50 h-full">
                <div className="w-12 h-12 rounded-full bg-slate-100 mb-3 flex items-center justify-center">
                  <User size={24} className="text-slate-600" />
                </div>
                <span className="font-medium text-center">Limited</span>
                <span className="text-xs text-center text-slate-500">Prefer few to no visitors</span>
              </div>
            </label>
          </div>
        </div>

        {/* Schedule Compatibility */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-4">Schedule Compatibility</h2>
          <div className="grid grid-cols-3 gap-4">
            <label className="cursor-pointer">
              <input type="checkbox" name="schedule" value="earlyRiser" className="sr-only peer" />
              <div className="flex flex-col items-center p-4 rounded-lg border peer-checked:border-primary peer-checked:bg-primary/5 hover:bg-slate-50 h-full">
                <div className="w-12 h-12 rounded-full bg-slate-100 mb-3 flex items-center justify-center">
                  <Sunrise size={24} className="text-slate-600" />
                </div>
                <span className="font-medium text-center">Early Riser</span>
                <span className="text-xs text-center text-slate-500">Active in morning hours</span>
              </div>
            </label>
            
            <label className="cursor-pointer">
              <input type="checkbox" name="schedule" value="nightOwl" className="sr-only peer" />
              <div className="flex flex-col items-center p-4 rounded-lg border peer-checked:border-primary peer-checked:bg-primary/5 hover:bg-slate-50 h-full">
                <div className="w-12 h-12 rounded-full bg-slate-100 mb-3 flex items-center justify-center">
                  <Moon size={24} className="text-slate-600" />
                </div>
                <span className="font-medium text-center">Night Owl</span>
                <span className="text-xs text-center text-slate-500">Active in evening hours</span>
              </div>
            </label>
            
            <label className="cursor-pointer">
              <input type="checkbox" name="schedule" value="any" className="sr-only peer" />
              <div className="flex flex-col items-center p-4 rounded-lg border peer-checked:border-primary peer-checked:bg-primary/5 hover:bg-slate-50 h-full">
                <div className="w-12 h-12 rounded-full bg-slate-100 mb-3 flex items-center justify-center">
                  <Sun size={24} className="text-slate-600" />
                </div>
                <span className="font-medium text-center">Flexible</span>
                <span className="text-xs text-center text-slate-500">No strong schedule preference</span>
              </div>
            </label>
          </div>
        </div>

        {/* Social Preferences */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-4">Social Preferences</h2>
          <div className="grid grid-cols-3 gap-4">
            <label className="cursor-pointer">
              <input type="checkbox" name="social" value="social" className="sr-only peer" />
              <div className="flex flex-col items-center p-4 rounded-lg border peer-checked:border-primary peer-checked:bg-primary/5 hover:bg-slate-50 h-full">
                <div className="w-12 h-12 rounded-full bg-slate-100 mb-3 flex items-center justify-center">
                  <Users size={24} className="text-slate-600" />
                </div>
                <span className="font-medium text-center">Social</span>
                <span className="text-xs text-center text-slate-500">Enjoys shared activities</span>
              </div>
            </label>
            
            <label className="cursor-pointer">
              <input type="checkbox" name="social" value="independent" className="sr-only peer" />
              <div className="flex flex-col items-center p-4 rounded-lg border peer-checked:border-primary peer-checked:bg-primary/5 hover:bg-slate-50 h-full">
                <div className="w-12 h-12 rounded-full bg-slate-100 mb-3 flex items-center justify-center">
                  <User size={24} className="text-slate-600" />
                </div>
                <span className="font-medium text-center">Independent</span>
                <span className="text-xs text-center text-slate-500">Prefers personal space</span>
              </div>
            </label>
            
            <label className="cursor-pointer">
              <input type="checkbox" name="social" value="balanced" className="sr-only peer" />
              <div className="flex flex-col items-center p-4 rounded-lg border peer-checked:border-primary peer-checked:bg-primary/5 hover:bg-slate-50 h-full">
                <div className="w-12 h-12 rounded-full bg-slate-100 mb-3 flex items-center justify-center">
                  <Heart size={24} className="text-slate-600" />
                </div>
                <span className="font-medium text-center">Balanced</span>
                <span className="text-xs text-center text-slate-500">Mix of social and alone time</span>
              </div>
            </label>
          </div>
        </div>

        <div className="pt-6 flex justify-between">
          <Link
            href="/test-onboarding-flow/homeowner/property-details"
            className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Back
          </Link>
          <Link
            href="/test-onboarding-flow/homeowner/household-help"
            className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
          >
            Continue
          </Link>
        </div>
      </div>
    </div>
  );
} 