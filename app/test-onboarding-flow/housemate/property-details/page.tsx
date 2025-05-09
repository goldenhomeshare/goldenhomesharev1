import Link from "next/link";
import { Home, Building2, MapPin, Bed, Bath, DoorOpen, User, SquareUser, FolderHeart, PiggyBank, GalleryHorizontalEnd, Calendar, AlertTriangle } from "lucide-react";

export default function PropertyDetailsPage() {
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
        <h1 className="text-3xl font-bold mb-2">Property Details</h1>
        <p className="text-muted-foreground">
          Tell us about your home and space you're offering
        </p>
      </div>

      <div className="bg-white shadow-lg rounded-lg p-8 mb-10">
        {/* Property Type */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-4">Property Type</h2>
          <div className="grid grid-cols-3 gap-4">
            <label className="cursor-pointer">
              <input type="radio" name="propertyType" className="sr-only peer" />
              <div className="flex flex-col items-center p-4 rounded-lg border peer-checked:border-primary peer-checked:bg-primary/5 hover:bg-slate-50 h-full">
                <div className="w-12 h-12 rounded-full bg-slate-100 mb-3 flex items-center justify-center">
                  <Home size={24} className="text-slate-600" />
                </div>
                <span className="font-medium text-center">House</span>
                <span className="text-xs text-center text-slate-500">Single family home</span>
              </div>
            </label>
            
            <label className="cursor-pointer">
              <input type="radio" name="propertyType" className="sr-only peer" />
              <div className="flex flex-col items-center p-4 rounded-lg border peer-checked:border-primary peer-checked:bg-primary/5 hover:bg-slate-50 h-full">
                <div className="w-12 h-12 rounded-full bg-slate-100 mb-3 flex items-center justify-center">
                  <Building2 size={24} className="text-slate-600" />
                </div>
                <span className="font-medium text-center">Apartment</span>
                <span className="text-xs text-center text-slate-500">Flat or apartment unit</span>
              </div>
            </label>
            
            <label className="cursor-pointer">
              <input type="radio" name="propertyType" className="sr-only peer" />
              <div className="flex flex-col items-center p-4 rounded-lg border peer-checked:border-primary peer-checked:bg-primary/5 hover:bg-slate-50 h-full">
                <div className="w-12 h-12 rounded-full bg-slate-100 mb-3 flex items-center justify-center">
                  <DoorOpen size={24} className="text-slate-600" />
                </div>
                <span className="font-medium text-center">Other</span>
                <span className="text-xs text-center text-slate-500">Townhouse, condo, etc.</span>
              </div>
            </label>
          </div>
        </div>

        {/* Property Location */}
        <div className="space-y-6 mb-8">
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="address">
              Property Address
            </label>
            <div className="relative">
              <MapPin size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                id="address"
                type="text"
                className="w-full pl-10 p-2 border rounded-md"
                placeholder="Enter your full address"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="city">
                City
              </label>
              <input
                id="city"
                type="text"
                className="w-full p-2 border rounded-md"
                placeholder="City"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="state">
                State
              </label>
              <input
                id="state"
                type="text"
                className="w-full p-2 border rounded-md"
                placeholder="State"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="zip">
                ZIP Code
              </label>
              <input
                id="zip"
                type="text"
                className="w-full p-2 border rounded-md"
                placeholder="ZIP"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="country">
                Country
              </label>
              <input
                id="country"
                type="text"
                className="w-full p-2 border rounded-md"
                placeholder="Country"
                defaultValue="United States"
              />
            </div>
          </div>
        </div>

        {/* Room Details */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-4">Room Details</h2>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="bedrooms">
                Total Bedrooms
              </label>
              <div className="relative">
                <Bed size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <select
                  id="bedrooms"
                  className="w-full pl-10 p-2 border rounded-md appearance-none bg-white"
                >
                  <option>Select number of bedrooms</option>
                  <option>1</option>
                  <option>2</option>
                  <option>3</option>
                  <option>4</option>
                  <option>5+</option>
                </select>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="bathrooms">
                Total Bathrooms
              </label>
              <div className="relative">
                <Bath size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <select
                  id="bathrooms"
                  className="w-full pl-10 p-2 border rounded-md appearance-none bg-white"
                >
                  <option>Select number of bathrooms</option>
                  <option>1</option>
                  <option>1.5</option>
                  <option>2</option>
                  <option>2.5</option>
                  <option>3+</option>
                </select>
              </div>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="roomDescription">
              Room Description
            </label>
            <textarea
              id="roomDescription"
              rows={4}
              className="w-full p-2 border rounded-md"
              placeholder="Describe the room(s) available for homesharing..."
            ></textarea>
          </div>
        </div>

        {/* Accommodation Details */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-4">What's Included</h2>
          <div className="grid grid-cols-3 gap-4">
            <label className="cursor-pointer">
              <input type="checkbox" name="amenities" value="privateBathroom" className="sr-only peer" />
              <div className="flex flex-col items-center p-4 rounded-lg border peer-checked:border-primary peer-checked:bg-primary/5 hover:bg-slate-50 h-full">
                <div className="w-12 h-12 rounded-full bg-slate-100 mb-3 flex items-center justify-center">
                  <Bath size={24} className="text-slate-600" />
                </div>
                <span className="font-medium text-center">Private Bathroom</span>
                <span className="text-xs text-center text-slate-500">Exclusive use</span>
              </div>
            </label>
            
            <label className="cursor-pointer">
              <input type="checkbox" name="amenities" value="privateEntrance" className="sr-only peer" />
              <div className="flex flex-col items-center p-4 rounded-lg border peer-checked:border-primary peer-checked:bg-primary/5 hover:bg-slate-50 h-full">
                <div className="w-12 h-12 rounded-full bg-slate-100 mb-3 flex items-center justify-center">
                  <DoorOpen size={24} className="text-slate-600" />
                </div>
                <span className="font-medium text-center">Private Entrance</span>
                <span className="text-xs text-center text-slate-500">Separate entry</span>
              </div>
            </label>
            
            <label className="cursor-pointer">
              <input type="checkbox" name="amenities" value="kitchenAccess" className="sr-only peer" />
              <div className="flex flex-col items-center p-4 rounded-lg border peer-checked:border-primary peer-checked:bg-primary/5 hover:bg-slate-50 h-full">
                <div className="w-12 h-12 rounded-full bg-slate-100 mb-3 flex items-center justify-center">
                  <FolderHeart size={24} className="text-slate-600" />
                </div>
                <span className="font-medium text-center">Kitchen Access</span>
                <span className="text-xs text-center text-slate-500">Shared or private</span>
              </div>
            </label>
          </div>
        </div>

        {/* Pricing */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-4">Pricing</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="monthlyRent">
                Monthly Rent
              </label>
              <div className="relative">
                <PiggyBank size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  id="monthlyRent"
                  type="text"
                  className="w-full pl-10 p-2 border rounded-md"
                  placeholder="Enter amount in USD"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="securityDeposit">
                Security Deposit
              </label>
              <div className="relative">
                <PiggyBank size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  id="securityDeposit"
                  type="text"
                  className="w-full pl-10 p-2 border rounded-md"
                  placeholder="Enter amount in USD"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Availability */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-4">Availability</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="availableFrom">
                Available From
              </label>
              <div className="relative">
                <Calendar size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  id="availableFrom"
                  type="date"
                  className="w-full pl-10 p-2 border rounded-md"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="minimumStay">
                Minimum Stay
              </label>
              <div className="relative">
                <Calendar size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <select
                  id="minimumStay"
                  className="w-full pl-10 p-2 border rounded-md appearance-none bg-white"
                >
                  <option>Select minimum stay</option>
                  <option>1 month</option>
                  <option>3 months</option>
                  <option>6 months</option>
                  <option>1 year</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation buttons */}
        <div className="pt-6 flex justify-between">
          <Link
            href="/test-onboarding-flow/homeowner"
            className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Back
          </Link>
          <Link
            href="/test-onboarding-flow/homeowner/housemate-preferences"
            className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
          >
            Continue
          </Link>
        </div>
      </div>
    </div>
  );
} 