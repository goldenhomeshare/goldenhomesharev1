import Link from "next/link";
import { Home, Building2, Coffee, Ban, Dog, Cat, PawPrint, Palette, GraduationCap, Music, BookOpen, Bike, Clock, Clock3, Clock4, Clock5, Clock9, User, Heart, Users, CalendarDays, CalendarClock, Cigarette, Wind, UserCircle2, CircleUser, CircleDashed, AlertTriangle, DollarSign, Settings, Handshake } from "lucide-react";

export default function HousemateOnboarding() {
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
        <h1 className="text-3xl font-bold mb-2">About You</h1>
        <p className="text-muted-foreground">
          Tell us a bit about yourself as a potential housemate
        </p>
      </div>

      <div className="bg-white shadow-lg rounded-lg p-8 mb-10">
        {/* Profile Picture Upload */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-32 h-32 rounded-full bg-slate-100 flex items-center justify-center mb-4">
            <User size={32} className="text-slate-400" />
          </div>
          <button className="text-primary text-sm">Click to upload your profile picture</button>
        </div>

        {/* Basic Information */}
        <div className="space-y-6 mb-8">
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="name">
              Your Name
            </label>
            <div className="relative">
              <User size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                id="name"
                type="text"
                className="w-full pl-10 p-2 border rounded-md"
                placeholder="Enter your name"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="description">
              Brief Description
            </label>
            <textarea
              id="description"
              rows={4}
              className="w-full p-2 border rounded-md"
              placeholder="Tell potential homeowners about yourself, your background, and why you'd make a great housemate..."
            ></textarea>
          </div>
        </div>

        {/* Your Gender */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-4">Your Gender</h2>
          <div className="grid grid-cols-3 gap-4">
            <label className="cursor-pointer">
              <input type="radio" name="gender" className="sr-only peer" />
              <div className="flex flex-col items-center p-4 rounded-lg border peer-checked:border-primary peer-checked:bg-primary/5 hover:bg-slate-50 h-full">
                <div className="w-12 h-12 rounded-full bg-slate-100 mb-3 flex items-center justify-center">
                  <CircleUser size={24} className="text-slate-600" />
                </div>
                <span className="font-medium text-center">Female</span>
                <span className="text-xs text-center text-slate-500">I identify as female</span>
              </div>
            </label>
            
            <label className="cursor-pointer">
              <input type="radio" name="gender" className="sr-only peer" />
              <div className="flex flex-col items-center p-4 rounded-lg border peer-checked:border-primary peer-checked:bg-primary/5 hover:bg-slate-50 h-full">
                <div className="w-12 h-12 rounded-full bg-slate-100 mb-3 flex items-center justify-center">
                  <UserCircle2 size={24} className="text-slate-600" />
                </div>
                <span className="font-medium text-center">Male</span>
                <span className="text-xs text-center text-slate-500">I identify as male</span>
              </div>
            </label>
            
            <label className="cursor-pointer">
              <input type="radio" name="gender" className="sr-only peer" />
              <div className="flex flex-col items-center p-4 rounded-lg border peer-checked:border-primary peer-checked:bg-primary/5 hover:bg-slate-50 h-full">
                <div className="w-12 h-12 rounded-full bg-slate-100 mb-3 flex items-center justify-center">
                  <CircleDashed size={24} className="text-slate-600" />
                </div>
                <span className="font-medium text-center">Other</span>
                <span className="text-xs text-center text-slate-500">I identify differently</span>
              </div>
            </label>
          </div>
        </div>

        {/* Your Age Range */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-4">Your Age Range</h2>
          <div className="grid grid-cols-3 gap-4">
            <label className="cursor-pointer">
              <input type="radio" name="ageRange" className="sr-only peer" />
              <div className="flex flex-col items-center p-4 rounded-lg border peer-checked:border-primary peer-checked:bg-primary/5 hover:bg-slate-50 h-full">
                <div className="w-12 h-12 rounded-full bg-slate-100 mb-3 flex items-center justify-center">
                  <Clock size={24} className="text-slate-600" />
                </div>
                <span className="font-medium text-center">18 to 29</span>
                <span className="text-xs text-center text-slate-500">Young adult</span>
              </div>
            </label>
            
            <label className="cursor-pointer">
              <input type="radio" name="ageRange" className="sr-only peer" />
              <div className="flex flex-col items-center p-4 rounded-lg border peer-checked:border-primary peer-checked:bg-primary/5 hover:bg-slate-50 h-full">
                <div className="w-12 h-12 rounded-full bg-slate-100 mb-3 flex items-center justify-center">
                  <Clock3 size={24} className="text-slate-600" />
                </div>
                <span className="font-medium text-center">30 to 39</span>
                <span className="text-xs text-center text-slate-500">Early career</span>
              </div>
            </label>
            
            <label className="cursor-pointer">
              <input type="radio" name="ageRange" className="sr-only peer" />
              <div className="flex flex-col items-center p-4 rounded-lg border peer-checked:border-primary peer-checked:bg-primary/5 hover:bg-slate-50 h-full">
                <div className="w-12 h-12 rounded-full bg-slate-100 mb-3 flex items-center justify-center">
                  <Clock4 size={24} className="text-slate-600" />
                </div>
                <span className="font-medium text-center">40 to 49</span>
                <span className="text-xs text-center text-slate-500">Mid-career</span>
              </div>
            </label>
            
            <label className="cursor-pointer">
              <input type="radio" name="ageRange" className="sr-only peer" />
              <div className="flex flex-col items-center p-4 rounded-lg border peer-checked:border-primary peer-checked:bg-primary/5 hover:bg-slate-50 h-full">
                <div className="w-12 h-12 rounded-full bg-slate-100 mb-3 flex items-center justify-center">
                  <Clock5 size={24} className="text-slate-600" />
                </div>
                <span className="font-medium text-center">50 to 64</span>
                <span className="text-xs text-center text-slate-500">Late career</span>
              </div>
            </label>
            
            <label className="cursor-pointer">
              <input type="radio" name="ageRange" className="sr-only peer" />
              <div className="flex flex-col items-center p-4 rounded-lg border peer-checked:border-primary peer-checked:bg-primary/5 hover:bg-slate-50 h-full">
                <div className="w-12 h-12 rounded-full bg-slate-100 mb-3 flex items-center justify-center">
                  <Clock9 size={24} className="text-slate-600" />
                </div>
                <span className="font-medium text-center">65 and up</span>
                <span className="text-xs text-center text-slate-500">Senior adult</span>
              </div>
            </label>
          </div>
        </div>

        {/* Smoking Status */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-4">Smoking Status</h2>
          <div className="grid grid-cols-3 gap-4">
            <label className="cursor-pointer">
              <input type="radio" name="smoking" className="sr-only peer" />
              <div className="flex flex-col items-center p-4 rounded-lg border peer-checked:border-primary peer-checked:bg-primary/5 hover:bg-slate-50 h-full">
                <div className="w-12 h-12 rounded-full bg-slate-100 mb-3 flex items-center justify-center">
                  <Ban size={24} className="text-slate-600" />
                </div>
                <span className="font-medium text-center">Non-Smoker</span>
                <span className="text-xs text-center text-slate-500">I don't smoke</span>
              </div>
            </label>
            
            <label className="cursor-pointer">
              <input type="radio" name="smoking" className="sr-only peer" />
              <div className="flex flex-col items-center p-4 rounded-lg border peer-checked:border-primary peer-checked:bg-primary/5 hover:bg-slate-50 h-full">
                <div className="w-12 h-12 rounded-full bg-slate-100 mb-3 flex items-center justify-center">
                  <Cigarette size={24} className="text-slate-600" />
                </div>
                <span className="font-medium text-center">Smoker</span>
                <span className="text-xs text-center text-slate-500">I smoke regularly</span>
              </div>
            </label>
            
            <label className="cursor-pointer">
              <input type="radio" name="smoking" className="sr-only peer" />
              <div className="flex flex-col items-center p-4 rounded-lg border peer-checked:border-primary peer-checked:bg-primary/5 hover:bg-slate-50 h-full">
                <div className="w-12 h-12 rounded-full bg-slate-100 mb-3 flex items-center justify-center">
                  <Wind size={24} className="text-slate-600" />
                </div>
                <span className="font-medium text-center">Outdoor Only</span>
                <span className="text-xs text-center text-slate-500">I only smoke outside</span>
              </div>
            </label>
          </div>
        </div>

        {/* Pets */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-4">Pets</h2>
          <div className="grid grid-cols-3 gap-4">
            <label className="cursor-pointer">
              <input type="radio" name="pets" className="sr-only peer" />
              <div className="flex flex-col items-center p-4 rounded-lg border peer-checked:border-primary peer-checked:bg-primary/5 hover:bg-slate-50 h-full">
                <div className="w-12 h-12 rounded-full bg-slate-100 mb-3 flex items-center justify-center">
                  <Ban size={24} className="text-slate-600" />
                </div>
                <span className="font-medium text-center">No Pets</span>
                <span className="text-xs text-center text-slate-500">I don't have any pets</span>
              </div>
            </label>
            
            <label className="cursor-pointer">
              <input type="radio" name="pets" className="sr-only peer" />
              <div className="flex flex-col items-center p-4 rounded-lg border peer-checked:border-primary peer-checked:bg-primary/5 hover:bg-slate-50 h-full">
                <div className="w-12 h-12 rounded-full bg-slate-100 mb-3 flex items-center justify-center">
                  <Dog size={24} className="text-slate-600" />
                </div>
                <span className="font-medium text-center">Have Dog(s)</span>
                <span className="text-xs text-center text-slate-500">I have one or more dogs</span>
              </div>
            </label>
            
            <label className="cursor-pointer">
              <input type="radio" name="pets" className="sr-only peer" />
              <div className="flex flex-col items-center p-4 rounded-lg border peer-checked:border-primary peer-checked:bg-primary/5 hover:bg-slate-50 h-full">
                <div className="w-12 h-12 rounded-full bg-slate-100 mb-3 flex items-center justify-center">
                  <Cat size={24} className="text-slate-600" />
                </div>
                <span className="font-medium text-center">Have Cat(s)</span>
                <span className="text-xs text-center text-slate-500">I have one or more cats</span>
              </div>
            </label>
            
            <label className="cursor-pointer">
              <input type="radio" name="pets" className="sr-only peer" />
              <div className="flex flex-col items-center p-4 rounded-lg border peer-checked:border-primary peer-checked:bg-primary/5 hover:bg-slate-50 h-full">
                <div className="w-12 h-12 rounded-full bg-slate-100 mb-3 flex items-center justify-center">
                  <PawPrint size={24} className="text-slate-600" />
                </div>
                <span className="font-medium text-center">Other Pets</span>
                <span className="text-xs text-center text-slate-500">I have other types of pets</span>
              </div>
            </label>
          </div>
        </div>

        {/* Budget Range */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-4">Your Monthly Budget</h2>
          <p className="text-sm text-muted-foreground mb-4">Enter your preferred monthly budget for housing</p>
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="budget">
              Budget Amount ($)
            </label>
            <div className="relative">
              <DollarSign size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                id="budget"
                type="number"
                className="w-full pl-10 p-2 border rounded-md"
                placeholder="Enter your monthly budget"
                min="0"
                step="100"
              />
            </div>
          </div>
        </div>
        
        {/* Interests */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-4">Your Interests</h2>
          <p className="text-sm text-muted-foreground mb-4">Select all that apply</p>
          <div className="grid grid-cols-3 gap-4">
            <label className="cursor-pointer">
              <input type="checkbox" name="interests" value="reading" className="sr-only peer" />
              <div className="flex flex-col items-center p-4 rounded-lg border peer-checked:border-primary peer-checked:bg-primary/5 hover:bg-slate-50 h-full">
                <div className="w-12 h-12 rounded-full bg-slate-100 mb-3 flex items-center justify-center">
                  <BookOpen size={24} className="text-slate-600" />
                </div>
                <span className="font-medium text-center">Reading</span>
                <span className="text-xs text-center text-slate-500">Books & literature</span>
              </div>
            </label>
            
            <label className="cursor-pointer">
              <input type="checkbox" name="interests" value="music" className="sr-only peer" />
              <div className="flex flex-col items-center p-4 rounded-lg border peer-checked:border-primary peer-checked:bg-primary/5 hover:bg-slate-50 h-full">
                <div className="w-12 h-12 rounded-full bg-slate-100 mb-3 flex items-center justify-center">
                  <Music size={24} className="text-slate-600" />
                </div>
                <span className="font-medium text-center">Music</span>
                <span className="text-xs text-center text-slate-500">Playing or listening</span>
              </div>
            </label>
            
            <label className="cursor-pointer">
              <input type="checkbox" name="interests" value="art" className="sr-only peer" />
              <div className="flex flex-col items-center p-4 rounded-lg border peer-checked:border-primary peer-checked:bg-primary/5 hover:bg-slate-50 h-full">
                <div className="w-12 h-12 rounded-full bg-slate-100 mb-3 flex items-center justify-center">
                  <Palette size={24} className="text-slate-600" />
                </div>
                <span className="font-medium text-center">Art</span>
                <span className="text-xs text-center text-slate-500">Visual arts & crafts</span>
              </div>
            </label>

            <label className="cursor-pointer">
              <input type="checkbox" name="interests" value="education" className="sr-only peer" />
              <div className="flex flex-col items-center p-4 rounded-lg border peer-checked:border-primary peer-checked:bg-primary/5 hover:bg-slate-50 h-full">
                <div className="w-12 h-12 rounded-full bg-slate-100 mb-3 flex items-center justify-center">
                  <GraduationCap size={24} className="text-slate-600" />
                </div>
                <span className="font-medium text-center">Education</span>
                <span className="text-xs text-center text-slate-500">Learning & teaching</span>
              </div>
            </label>
            
            <label className="cursor-pointer">
              <input type="checkbox" name="interests" value="cooking" className="sr-only peer" />
              <div className="flex flex-col items-center p-4 rounded-lg border peer-checked:border-primary peer-checked:bg-primary/5 hover:bg-slate-50 h-full">
                <div className="w-12 h-12 rounded-full bg-slate-100 mb-3 flex items-center justify-center">
                  <Coffee size={24} className="text-slate-600" />
                </div>
                <span className="font-medium text-center">Cooking</span>
                <span className="text-xs text-center text-slate-500">Food & cuisine</span>
              </div>
            </label>
            
            <label className="cursor-pointer">
              <input type="checkbox" name="interests" value="outdoors" className="sr-only peer" />
              <div className="flex flex-col items-center p-4 rounded-lg border peer-checked:border-primary peer-checked:bg-primary/5 hover:bg-slate-50 h-full">
                <div className="w-12 h-12 rounded-full bg-slate-100 mb-3 flex items-center justify-center">
                  <Bike size={24} className="text-slate-600" />
                </div>
                <span className="font-medium text-center">Outdoors</span>
                <span className="text-xs text-center text-slate-500">Nature & activities</span>
              </div>
            </label>
          </div>
        </div>

        <div className="pt-6 flex justify-between">
          <Link
            href="/"
            className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Back to Home
          </Link>
          <Link
            href="/test-onboarding-flow/housemate/housemate-preferences"
            className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
          >
            Continue
          </Link>
        </div>
      </div>
    </div>
  );
} 