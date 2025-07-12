import { AirbnbStyleRow } from "../app/components/AirbnbStyleRow";
import Image from "next/image";

import Link from "next/link";

import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { 
  Sparkles, 
  ChefHat, 
  Trees, 
  ShoppingBag, 
  Heart, 
  PawPrint, 
  Monitor, 
  Wrench, 
  Car,
  Search
} from "lucide-react";

export default async function Home() {
  // Redirect logged-in users to their dashboard
  const user = await getCurrentUser();
  if (user) {
    const userType = (user as any).userType;
    switch (userType) {
      case "HOMEOWNER":
        redirect("/homeowner/dashboard");
        break;
      case "HOUSEMATE":
        redirect("/housemate/dashboard");
        break;
      case "ADMIN":
        redirect("/admin/dashboard");
        break;
      default:
        // If user exists but hasn't completed onboarding, let them access home page
        break;
    }
  }

  return (
    <>
      {/* What is homesharing Section */}
      <section className="pt-8 mb-24 px-6 md:px-12">
        <div className="max-w-7xl mx-auto">


          
          {/* Host and Helper Layout with Exchange in Middle */}
          <div className="grid md:grid-cols-3 gap-8 md:gap-12 items-start mb-16">
            {/* Host Section */}
            <div className="text-center space-y-6 flex flex-col h-full">
              <h3 className="text-3xl md:text-4xl font-bold text-gray-900">Host</h3>
              <p className="text-lg text-gray-600">
                Has a room to share and could use a little help around the house.
              </p>
              
              {/* Host Illustration */}
              <div className="flex justify-center py-6">
                <div className="relative w-56 h-42 md:w-64 md:h-48">
                  <Image 
                    src="/host-hero.png" 
                    alt="Host hero image" 
                    fill
                    className="object-contain"
                  />
                </div>
              </div>
              
              {/* What Host Provides */}
              <div className="space-y-4">
                <p className="text-base font-semibold text-gray-900">
                  Provides:
                </p>
                <div className="space-y-2">
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-gray-700">Private room & shared living space</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-gray-700">Discounted rent in exchange for help</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Exchange Section - Now in the middle */}
            <div className="flex items-center justify-center h-full relative">
              {/* Curved Arrow - Top */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-24 hidden md:block">
                <svg width="160" height="60" viewBox="0 0 160 60" className="text-gray-500">
                  <path d="M15 45 Q80 15 145 45" stroke="currentColor" strokeWidth="2.5" fill="none" markerEnd="url(#arrowhead)" />
                  <defs>
                    <marker id="arrowhead" markerWidth="12" markerHeight="8" 
                      refX="11" refY="4" orient="auto">
                      <polygon points="0 0, 12 4, 0 8" fill="currentColor" />
                    </marker>
                  </defs>
                </svg>
              </div>
              
              <div className="text-center px-8">
                <h4 className="text-xl font-bold text-gray-900 mb-2">A simple exchange:</h4>
                <p className="text-lg text-gray-700 font-medium">housing for help</p>
              </div>
              
              {/* Curved Arrow - Bottom */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 translate-y-12 hidden md:block">
                <svg width="160" height="60" viewBox="0 0 160 60" className="text-gray-500">
                  <path d="M145 15 Q80 45 15 15" stroke="currentColor" strokeWidth="2.5" fill="none" markerEnd="url(#arrowhead2)" />
                  <defs>
                    <marker id="arrowhead2" markerWidth="12" markerHeight="8" 
                      refX="11" refY="4" orient="auto">
                      <polygon points="0 0, 12 4, 0 8" fill="currentColor" />
                    </marker>
                  </defs>
                </svg>
              </div>
            </div>

            {/* Helper Section */}
            <div className="text-center space-y-6 flex flex-col h-full">
              <h3 className="text-3xl md:text-4xl font-bold text-gray-900">Helper</h3>
              <p className="text-lg text-gray-600">
                Looking for affordable living and a meaningful place to stay.
              </p>
              
              {/* Helper Illustration */}
              <div className="flex justify-center py-6">
                <div className="relative w-56 h-42 md:w-64 md:h-48">
                  <Image 
                    src="/Housemate-Onboarding.png" 
                    alt="Housemate helper onboarding" 
                    fill
                    className="object-contain"
                  />
                </div>
              </div>
              
              {/* What Helper Provides */}
              <div className="space-y-4">
                <p className="text-base font-semibold text-gray-900">
                  Provides:
                </p>
                <div className="space-y-2">
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-gray-700">Up to 10 hours per week of household support</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-gray-700">Overnight presence 5-6 days per week</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Types of Support Available */}
          <div className="max-w-5xl mx-auto mb-12">
            <h3 className="text-2xl font-bold text-gray-900 text-center mb-8">Types of Support Available:</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg flex items-center space-x-3">
                <Sparkles className="flex-shrink-0 w-5 h-5 text-gray-600" />
                <span className="text-gray-700 font-medium">Cleaning</span>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg flex items-center space-x-3">
                <ChefHat className="flex-shrink-0 w-5 h-5 text-gray-600" />
                <span className="text-gray-700 font-medium">Cooking</span>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg flex items-center space-x-3">
                <Trees className="flex-shrink-0 w-5 h-5 text-gray-600" />
                <span className="text-gray-700 font-medium">Yard Work</span>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg flex items-center space-x-3">
                <ShoppingBag className="flex-shrink-0 w-5 h-5 text-gray-600" />
                <span className="text-gray-700 font-medium">Shopping & Errands</span>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg flex items-center space-x-3">
                <Heart className="flex-shrink-0 w-5 h-5 text-gray-600" />
                <span className="text-gray-700 font-medium">Companionship</span>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg flex items-center space-x-3">
                <PawPrint className="flex-shrink-0 w-5 h-5 text-gray-600" />
                <span className="text-gray-700 font-medium">Pet Care</span>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg flex items-center space-x-3">
                <Monitor className="flex-shrink-0 w-5 h-5 text-gray-600" />
                <span className="text-gray-700 font-medium">Tech Support</span>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg flex items-center space-x-3">
                <Wrench className="flex-shrink-0 w-5 h-5 text-gray-600" />
                <span className="text-gray-700 font-medium">Home Maintenance</span>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg flex items-center space-x-3">
                <Car className="flex-shrink-0 w-5 h-5 text-gray-600" />
                <span className="text-gray-700 font-medium">Transportation</span>
              </div>
            </div>
          </div>

          {/* Important Notice */}
          <div className="max-w-4xl mx-auto mb-12">
            <div className="bg-gray-50 border-l-4 border-gray-400 rounded-lg p-6">

              <p className="text-gray-600">
                <strong>No medical care, personal hygiene assistance, or professional services</strong> are included. Housemates are not trained caregivers or medical professionals.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* Available Housemates Section - Full Width */}
      <section className="pt-8 pb-8 px-6">
        <AirbnbStyleRow category="housemates" />
      </section>

      {/* Rooms Available Section - Moved here from the end */}
      <section className="pt-8 pb-8 px-6">
        <AirbnbStyleRow category="rooms" />
      </section>


    </>
  );
}

