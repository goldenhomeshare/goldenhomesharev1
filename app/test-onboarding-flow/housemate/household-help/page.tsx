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
        <h1 className="text-3xl font-bold mb-2">Services You Can Offer</h1>
        <p className="text-muted-foreground">
          Select what kind of help you're willing to provide in exchange for housing
        </p>
      </div>

      <div className="bg-white shadow-lg rounded-lg p-8 mb-10">
        <div className="mb-6">
          <p className="text-sm text-slate-600">
            Many homeowners offer reduced rent or other accommodations in exchange for household help. Select all types of services you're comfortable and skilled at providing.
          </p>
        </div>
        
        {/* Household Services */}
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
                <span className="text-xs text-center text-slate-500">I can help with cleaning</span>
              </div>
            </label>
            
            <label className="cursor-pointer">
              <input type="checkbox" name="householdHelp" value="cooking" className="sr-only peer" />
              <div className="flex flex-col items-center p-4 rounded-lg border peer-checked:border-primary peer-checked:bg-primary/5 hover:bg-slate-50 h-full">
                <div className="w-12 h-12 rounded-full bg-slate-100 mb-3 flex items-center justify-center">
                  <Utensils size={24} className="text-slate-600" />
                </div>
                <span className="font-medium text-center">Cooking</span>
                <span className="text-xs text-center text-slate-500">I can prepare meals</span>
              </div>
            </label>
            
            <label className="cursor-pointer">
              <input type="checkbox" name="householdHelp" value="repairs" className="sr-only peer" />
              <div className="flex flex-col items-center p-4 rounded-lg border peer-checked:border-primary peer-checked:bg-primary/5 hover:bg-slate-50 h-full">
                <div className="w-12 h-12 rounded-full bg-slate-100 mb-3 flex items-center justify-center">
                  <Wrench size={24} className="text-slate-600" />
                </div>
                <span className="font-medium text-center">Repairs</span>
                <span className="text-xs text-center text-slate-500">I can fix minor issues</span>
              </div>
            </label>
            
            <label className="cursor-pointer">
              <input type="checkbox" name="householdHelp" value="gardening" className="sr-only peer" />
              <div className="flex flex-col items-center p-4 rounded-lg border peer-checked:border-primary peer-checked:bg-primary/5 hover:bg-slate-50 h-full">
                <div className="w-12 h-12 rounded-full bg-slate-100 mb-3 flex items-center justify-center">
                  <Flower2 size={24} className="text-slate-600" />
                </div>
                <span className="font-medium text-center">Gardening</span>
                <span className="text-xs text-center text-slate-500">I can maintain gardens</span>
              </div>
            </label>
            
            <label className="cursor-pointer">
              <input type="checkbox" name="householdHelp" value="errands" className="sr-only peer" />
              <div className="flex flex-col items-center p-4 rounded-lg border peer-checked:border-primary peer-checked:bg-primary/5 hover:bg-slate-50 h-full">
                <div className="w-12 h-12 rounded-full bg-slate-100 mb-3 flex items-center justify-center">
                  <Car size={24} className="text-slate-600" />
                </div>
                <span className="font-medium text-center">Errands</span>
                <span className="text-xs text-center text-slate-500">I can run errands</span>
              </div>
            </label>
          </div>
        </div>

        {/* Specialized Services */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-4">Specialized Services</h2>
          <div className="grid grid-cols-3 gap-4">
            <label className="cursor-pointer">
              <input type="checkbox" name="specializedHelp" value="companionship" className="sr-only peer" />
              <div className="flex flex-col items-center p-4 rounded-lg border peer-checked:border-primary peer-checked:bg-primary/5 hover:bg-slate-50 h-full">
                <div className="w-12 h-12 rounded-full bg-slate-100 mb-3 flex items-center justify-center">
                  <HeartHandshake size={24} className="text-slate-600" />
                </div>
                <span className="font-medium text-center">Companionship</span>
                <span className="text-xs text-center text-slate-500">I can provide social company</span>
              </div>
            </label>
            
            <label className="cursor-pointer">
              <input type="checkbox" name="specializedHelp" value="petCare" className="sr-only peer" />
              <div className="flex flex-col items-center p-4 rounded-lg border peer-checked:border-primary peer-checked:bg-primary/5 hover:bg-slate-50 h-full">
                <div className="w-12 h-12 rounded-full bg-slate-100 mb-3 flex items-center justify-center">
                  <Dog size={24} className="text-slate-600" />
                </div>
                <span className="font-medium text-center">Pet Care</span>
                <span className="text-xs text-center text-slate-500">I can care for pets</span>
              </div>
            </label>
            
            <label className="cursor-pointer">
              <input type="checkbox" name="specializedHelp" value="techSupport" className="sr-only peer" />
              <div className="flex flex-col items-center p-4 rounded-lg border peer-checked:border-primary peer-checked:bg-primary/5 hover:bg-slate-50 h-full">
                <div className="w-12 h-12 rounded-full bg-slate-100 mb-3 flex items-center justify-center">
                  <Laptop size={24} className="text-slate-600" />
                </div>
                <span className="font-medium text-center">Tech Support</span>
                <span className="text-xs text-center text-slate-500">I can help with technology</span>
              </div>
            </label>
            
            <label className="cursor-pointer">
              <input type="checkbox" name="specializedHelp" value="security" className="sr-only peer" />
              <div className="flex flex-col items-center p-4 rounded-lg border peer-checked:border-primary peer-checked:bg-primary/5 hover:bg-slate-50 h-full">
                <div className="w-12 h-12 rounded-full bg-slate-100 mb-3 flex items-center justify-center">
                  <ShieldCheck size={24} className="text-slate-600" />
                </div>
                <span className="font-medium text-center">Home Security</span>
                <span className="text-xs text-center text-slate-500">I can help secure the home</span>
              </div>
            </label>
          </div>
        </div>

        {/* Availability & Skills */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-4">Your Availability & Skills</h2>
          
          <div className="mb-6">
            <label className="block text-sm font-medium mb-1" htmlFor="availableHours">
              Hours Available Per Week
            </label>
            <div className="relative">
              <Calendar size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <select
                id="availableHours"
                className="w-full pl-10 p-2 border rounded-md appearance-none bg-white"
              >
                <option>Select available hours</option>
                <option>1-5 hours per week</option>
                <option>5-10 hours per week</option>
                <option>10-15 hours per week</option>
                <option>15-20 hours per week</option>
                <option>20+ hours per week</option>
              </select>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="skillsDescription">
              Describe Your Skills & Experience
            </label>
            <textarea
              id="skillsDescription"
              rows={4}
              className="w-full p-2 border rounded-md"
              placeholder="Describe your relevant skills, experience, and any limitations regarding the services you can provide..."
            ></textarea>
          </div>
        </div>

        {/* Compensation Expectations */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-4">Preferred Compensation</h2>
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
            href="/test-onboarding-flow/housemate/housemate-preferences"
            className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Back
          </Link>
          <Link
            href="/test-onboarding-flow/housemate/confirmation"
            className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
          >
            Submit
          </Link>
        </div>
      </div>
    </div>
  );
} 