import Link from "next/link";
import { Home, Utensils, Car, Flower2, ShieldCheck, Laptop, Wrench, HeartHandshake, Workflow, Calendar, Sparkles, HelpCircle, Clapperboard, PenTool, Dog, RollerCoaster, AlertTriangle, DollarSign, ShieldAlert } from "lucide-react";

export default function HouseholdHelpPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      {/* Testing Notice Banner */}
      <div className="bg-amber-50 border-l-4 border-amber-400 p-4 mb-4 rounded-md">
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
      
      {/* Medical Service Disclaimer */}
      <div className="bg-blue-50 border-2 border-blue-300 p-5 mb-8 rounded-md shadow-md">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <ShieldAlert className="h-7 w-7 text-blue-600" aria-hidden="true" />
          </div>
          <div className="ml-3">
            <h3 className="text-base font-semibold text-blue-800">Important: Service Scope Limitation</h3>
            <p className="mt-2 text-sm text-blue-700 leading-relaxed">
              Golden HomeShare facilitates <span className="font-semibold">non-medical</span> homesharing arrangements only. Our platform does not support requests for medical care, nursing services, or healthcare assistance. For medical needs, please consult licensed healthcare professionals.
            </p>
          </div>
        </div>
      </div>
      
      <div className="mb-6 text-center">
        <h1 className="text-3xl font-bold mb-2">Household Help</h1>
        <p className="text-muted-foreground">
          Select what kind of help you're looking for around the house
        </p>
      </div>

      <div className="bg-white shadow-lg rounded-lg p-8 mb-10">
        <div className="mb-6">
          <p className="text-sm text-slate-600">
            Many homeowners look for specific types of household support in exchange for reduced rent or other arrangements. Select all types of help you're interested in receiving.
          </p>
        </div>
        
        {/* Household Chores */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-4">Home Maintenance</h2>
          <div className="grid grid-cols-3 gap-4">
            <label className="cursor-pointer">
              <input type="checkbox" name="householdHelp" value="cleaning" className="sr-only peer" />
              <div className="flex flex-col items-center p-4 rounded-lg border peer-checked:border-primary peer-checked:bg-primary/5 hover:bg-slate-50 h-full">
                <div className="w-12 h-12 rounded-full bg-slate-100 mb-3 flex items-center justify-center">
                  <Sparkles size={24} className="text-slate-600" />
                </div>
                <span className="font-medium text-center">Cleaning</span>
                <span className="text-xs text-center text-slate-500">Regular cleaning assistance</span>
              </div>
            </label>
            
            <label className="cursor-pointer">
              <input type="checkbox" name="householdHelp" value="cooking" className="sr-only peer" />
              <div className="flex flex-col items-center p-4 rounded-lg border peer-checked:border-primary peer-checked:bg-primary/5 hover:bg-slate-50 h-full">
                <div className="w-12 h-12 rounded-full bg-slate-100 mb-3 flex items-center justify-center">
                  <Utensils size={24} className="text-slate-600" />
                </div>
                <span className="font-medium text-center">Cooking</span>
                <span className="text-xs text-center text-slate-500">Meal preparation help</span>
              </div>
            </label>
            
            <label className="cursor-pointer">
              <input type="checkbox" name="householdHelp" value="repairs" className="sr-only peer" />
              <div className="flex flex-col items-center p-4 rounded-lg border peer-checked:border-primary peer-checked:bg-primary/5 hover:bg-slate-50 h-full">
                <div className="w-12 h-12 rounded-full bg-slate-100 mb-3 flex items-center justify-center">
                  <Wrench size={24} className="text-slate-600" />
                </div>
                <span className="font-medium text-center">Repairs</span>
                <span className="text-xs text-center text-slate-500">Minor home repairs</span>
              </div>
            </label>
            
            <label className="cursor-pointer">
              <input type="checkbox" name="householdHelp" value="gardening" className="sr-only peer" />
              <div className="flex flex-col items-center p-4 rounded-lg border peer-checked:border-primary peer-checked:bg-primary/5 hover:bg-slate-50 h-full">
                <div className="w-12 h-12 rounded-full bg-slate-100 mb-3 flex items-center justify-center">
                  <Flower2 size={24} className="text-slate-600" />
                </div>
                <span className="font-medium text-center">Gardening</span>
                <span className="text-xs text-center text-slate-500">Garden and yard work</span>
              </div>
            </label>
            
            <label className="cursor-pointer">
              <input type="checkbox" name="householdHelp" value="errands" className="sr-only peer" />
              <div className="flex flex-col items-center p-4 rounded-lg border peer-checked:border-primary peer-checked:bg-primary/5 hover:bg-slate-50 h-full">
                <div className="w-12 h-12 rounded-full bg-slate-100 mb-3 flex items-center justify-center">
                  <Car size={24} className="text-slate-600" />
                </div>
                <span className="font-medium text-center">Errands</span>
                <span className="text-xs text-center text-slate-500">Shopping and errands</span>
              </div>
            </label>
          </div>
        </div>

        {/* Specialized Support */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-4">Specialized Support</h2>
          <div className="grid grid-cols-3 gap-4">
            <label className="cursor-pointer">
              <input type="checkbox" name="specializedHelp" value="companionship" className="sr-only peer" />
              <div className="flex flex-col items-center p-4 rounded-lg border peer-checked:border-primary peer-checked:bg-primary/5 hover:bg-slate-50 h-full">
                <div className="w-12 h-12 rounded-full bg-slate-100 mb-3 flex items-center justify-center">
                  <HeartHandshake size={24} className="text-slate-600" />
                </div>
                <span className="font-medium text-center">Companionship</span>
                <span className="text-xs text-center text-slate-500">Someone to spend time with</span>
              </div>
            </label>
            
            <label className="cursor-pointer">
              <input type="checkbox" name="specializedHelp" value="petCare" className="sr-only peer" />
              <div className="flex flex-col items-center p-4 rounded-lg border peer-checked:border-primary peer-checked:bg-primary/5 hover:bg-slate-50 h-full">
                <div className="w-12 h-12 rounded-full bg-slate-100 mb-3 flex items-center justify-center">
                  <Dog size={24} className="text-slate-600" />
                </div>
                <span className="font-medium text-center">Pet Care</span>
                <span className="text-xs text-center text-slate-500">Help with pets</span>
              </div>
            </label>
            
            <label className="cursor-pointer">
              <input type="checkbox" name="specializedHelp" value="techSupport" className="sr-only peer" />
              <div className="flex flex-col items-center p-4 rounded-lg border peer-checked:border-primary peer-checked:bg-primary/5 hover:bg-slate-50 h-full">
                <div className="w-12 h-12 rounded-full bg-slate-100 mb-3 flex items-center justify-center">
                  <Laptop size={24} className="text-slate-600" />
                </div>
                <span className="font-medium text-center">Tech Support</span>
                <span className="text-xs text-center text-slate-500">Computer/device assistance</span>
              </div>
            </label>
            
            <label className="cursor-pointer">
              <input type="checkbox" name="specializedHelp" value="security" className="sr-only peer" />
              <div className="flex flex-col items-center p-4 rounded-lg border peer-checked:border-primary peer-checked:bg-primary/5 hover:bg-slate-50 h-full">
                <div className="w-12 h-12 rounded-full bg-slate-100 mb-3 flex items-center justify-center">
                  <ShieldCheck size={24} className="text-slate-600" />
                </div>
                <span className="font-medium text-center">Home Security</span>
                <span className="text-xs text-center text-slate-500">Presence when you're away</span>
              </div>
            </label>
          </div>
        </div>

        {/* Schedule & Expectations */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-4">Schedule & Expectations</h2>
          
          <div className="mb-6">
            <label className="block text-sm font-medium mb-1" htmlFor="expectedHours">
              Expected Hours Per Week
            </label>
            <div className="relative">
              <Calendar size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <select
                id="expectedHours"
                className="w-full pl-10 p-2 border rounded-md appearance-none bg-white"
              >
                <option>Select expected hours</option>
                <option>1-5 hours per week</option>
                <option>5-10 hours per week</option>
                <option>10-15 hours per week</option>
                <option>15-20 hours per week</option>
                <option>20+ hours per week</option>
              </select>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="helpDescription">
              Describe Your Expectations
            </label>
            <textarea
              id="helpDescription"
              rows={4}
              className="w-full p-2 border rounded-md"
              placeholder="Describe in detail the help you're looking for and any specific arrangements..."
            ></textarea>
          </div>
        </div>

        {/* Compensation */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-4">Compensation Offered</h2>
          <div className="grid grid-cols-3 gap-4">
            <label className="cursor-pointer">
              <input type="checkbox" name="compensation" value="reducedRent" className="sr-only peer" />
              <div className="flex flex-col items-center p-4 rounded-lg border peer-checked:border-primary peer-checked:bg-primary/5 hover:bg-slate-50 h-full">
                <div className="w-12 h-12 rounded-full bg-slate-100 mb-3 flex items-center justify-center">
                  <Home size={24} className="text-slate-600" />
                </div>
                <span className="font-medium text-center">Reduced Rent</span>
                <span className="text-xs text-center text-slate-500">Discount on monthly rent</span>
              </div>
            </label>
            
            <label className="cursor-pointer">
              <input type="checkbox" name="compensation" value="financial" className="sr-only peer" />
              <div className="flex flex-col items-center p-4 rounded-lg border peer-checked:border-primary peer-checked:bg-primary/5 hover:bg-slate-50 h-full">
                <div className="w-12 h-12 rounded-full bg-slate-100 mb-3 flex items-center justify-center">
                  <DollarSign size={24} className="text-slate-600" />
                </div>
                <span className="font-medium text-center">Financial</span>
                <span className="text-xs text-center text-slate-500">Direct financial compensation</span>
              </div>
            </label>
            
            <label className="cursor-pointer">
              <input type="checkbox" name="compensation" value="mealSharing" className="sr-only peer" />
              <div className="flex flex-col items-center p-4 rounded-lg border peer-checked:border-primary peer-checked:bg-primary/5 hover:bg-slate-50 h-full">
                <div className="w-12 h-12 rounded-full bg-slate-100 mb-3 flex items-center justify-center">
                  <Utensils size={24} className="text-slate-600" />
                </div>
                <span className="font-medium text-center">Meal Sharing</span>
                <span className="text-xs text-center text-slate-500">Shared meals included</span>
              </div>
            </label>
            
            <label className="cursor-pointer">
              <input type="checkbox" name="compensation" value="other" className="sr-only peer" />
              <div className="flex flex-col items-center p-4 rounded-lg border peer-checked:border-primary peer-checked:bg-primary/5 hover:bg-slate-50 h-full">
                <div className="w-12 h-12 rounded-full bg-slate-100 mb-3 flex items-center justify-center">
                  <HelpCircle size={24} className="text-slate-600" />
                </div>
                <span className="font-medium text-center">Other</span>
                <span className="text-xs text-center text-slate-500">Other compensation</span>
              </div>
            </label>
          </div>
        </div>

        <div className="pt-6 flex justify-between">
          <Link
            href="/test-onboarding-flow/homeowner/housemate-preferences"
            className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Back
          </Link>
          <Link
            href="/test-onboarding-flow/homeowner/photos"
            className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
          >
            Continue
          </Link>
        </div>
      </div>
    </div>
  );
} 