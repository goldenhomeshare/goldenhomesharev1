import { AirbnbStyleRow } from "../app/components/AirbnbStyleRow";
import Image from "next/image";
import Link from "next/link";
import { VideoPlayButton } from "../components/VideoPlayButton";
import { VideoModal } from "./components/VideoModal";

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
  Search,
  ChevronDown,
  Play,
  X
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
      <section className="pt-8 -mb-8 px-6 md:px-12">
        <div className="max-w-7xl mx-auto">

          {/* Papa-style Hero Section */}
          <div className="mb-24 grid md:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-8">
                                           <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold text-gray-900 leading-tight">
                Home Sharing<br />
                Made Easy.
              </h1>
              
                             <div className="space-y-6">
                                   <p className="text-xl md:text-3xl text-gray-900 leading-relaxed">
                  Here, Reliable Helpers Provide Household Support in Exchange for Affordable Rooms. </p>
                 

               </div>
              
              
            </div>
            
            {/* Right Content - Tilted Overlapping Images */}
            <div className="relative h-96 md:h-[500px]">
              {/* Background Image - Tilted */}
              <div className="absolute top-4 right-0 w-80 h-64 md:w-96 md:h-80 transform rotate-12 rounded-3xl overflow-hidden shadow-xl bg-white border border-gray-100">
                <Image 
                  src="/helpful.jpg" 
                  alt="Helpful assistance" 
                  fill
                  className="object-cover"
                />
              </div>
              
              {/* Foreground Image - Main Focus */}
              <div className="absolute top-8 left-0 w-80 h-64 md:w-96 md:h-80 transform -rotate-6 rounded-3xl overflow-hidden shadow-2xl bg-white border border-gray-100 z-10">
                <Image 
                  src="/old-young-hero.jpg" 
                  alt="Caring intergenerational relationship" 
                  fill
                  className="object-cover"
                />
              </div>
              
              {/* CTA Buttons - Positioned to align with second paragraph */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Link href="/homeowner/signup-wizard">
                  <button className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-white font-semibold py-6 px-16 rounded-lg transition-colors duration-200 text-xl whitespace-nowrap">
                    Host a Helper
                  </button>
                </Link>
                <Link href="/housemate/signup-wizard">
                  <button className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white font-semibold py-6 px-16 rounded-lg transition-colors duration-200 text-xl whitespace-nowrap">
                    Become a Helper
                  </button>
                </Link>
              </div>
            </div>
          </div>
          
        </div>
      </section>

      {/* Curved Transition Section - Papa Style Edge-to-Edge */}
      <div className="relative">
        <svg 
          className="w-full h-20 md:h-28 lg:h-32" 
          viewBox="0 0 1440 160" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
        >
          <path 
            d="M0,0 C360,100 1080,100 1440,0 L1440,160 L0,160 Z" 
            fill="#fef3c7"
          />
        </svg>
      </div>
      
      {/* Host and Helper Layout with Exchange in Middle */}
      <section className="bg-amber-100 -mt-1 pt-2 pb-24">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          {/* Main Section Title */}
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4">
              How Golden Works
            </h2>
            <div className="flex justify-center">
              <ChevronDown className="w-8 h-8 text-gray-600" />
            </div>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 md:gap-12 items-start mb-16">
            {/* Host Section */}
            <div className="text-center space-y-4 flex flex-col h-full">
              <h3 className="text-3xl md:text-4xl font-bold text-gray-900">Host</h3>
              
              {/* Host Illustration */}
              <div className="flex justify-center py-3">
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
              <div className="space-y-4 flex-1">
                <h4 className="text-lg font-semibold text-gray-600 mb-4">
                  What You'll Get From Hosting
                </h4>
                <div className="space-y-3">
                  <div className="bg-gray-50 p-5 rounded-lg min-h-[80px] flex items-center justify-center">
                    <p className="text-gray-700 text-base font-medium">Up to 10 hours of weekly household support</p>
                  </div>
                  <div className="bg-gray-50 p-5 rounded-lg min-h-[80px] flex items-center justify-center">
                    <p className="text-gray-700 text-base font-medium">5–6 nights of weekly overnight presence</p>
                  </div>
                  <div className="bg-gray-50 p-5 rounded-lg min-h-[80px] flex items-center justify-center">
                    <p className="text-gray-700 text-base font-medium">Monthly rental income</p>
                  </div>
                </div>
              </div>
              
              {/* Host Signup Button */}
              <div className="pt-4">
                <Link href="/homeowner/signup-wizard">
                  <button className="w-full bg-primary hover:bg-primary/90 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200">
                    Signup to Host
                  </button>
                </Link>
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
                <h4 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Live Well at Home</h4>
                <p className="text-xl md:text-2xl text-gray-700 font-medium">Live Well for Less</p>
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
            <div className="text-center space-y-4 flex flex-col h-full">
              <h3 className="text-3xl md:text-4xl font-bold text-gray-900">Helper</h3>
              
              {/* Helper Illustration */}
              <div className="flex justify-center py-3">
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
              <div className="space-y-4 flex-1">
                <h4 className="text-lg font-semibold text-gray-600 mb-4">
                  What You'll Get From Helping
                </h4>
                <div className="space-y-3">
                  <div className="bg-gray-50 p-5 rounded-lg min-h-[80px] flex items-center justify-center">
                    <p className="text-gray-700 text-base font-medium">Access to private room and shared spaces</p>
                  </div>
                  <div className="bg-gray-50 p-5 rounded-lg min-h-[80px] flex items-center justify-center">
                    <p className="text-gray-700 text-base font-medium">Affordable housing for help</p>
                  </div>
                  <div className="bg-gray-50 p-5 rounded-lg min-h-[80px] flex items-center justify-center">
                    <p className="text-gray-700 text-base font-medium">Flexible housing arrangement</p>
                  </div>
                </div>
              </div>
              
              {/* Helper Signup Button */}
              <div className="pt-4">
                <Link href="/housemate/signup-wizard">
                  <button className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200">
                    Signup to Help
                  </button>
                </Link>
              </div>
            </div>
          </div>

          {/* Help With */}
          <div className="max-w-5xl mx-auto mb-12 -mt-6">
            <h3 className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-8">Help With:</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
              <div className="bg-gray-50 p-6 rounded-lg flex items-center space-x-4">
                <Sparkles className="flex-shrink-0 w-8 h-8 text-gray-600" />
                <span className="text-gray-700 font-semibold text-lg">Cleaning</span>
              </div>
              <div className="bg-gray-50 p-6 rounded-lg flex items-center space-x-4">
                <ChefHat className="flex-shrink-0 w-8 h-8 text-gray-600" />
                <span className="text-gray-700 font-semibold text-lg">Cooking</span>
              </div>
              <div className="bg-gray-50 p-6 rounded-lg flex items-center space-x-4">
                <Trees className="flex-shrink-0 w-8 h-8 text-gray-600" />
                <span className="text-gray-700 font-semibold text-lg">Yard Work</span>
              </div>
              <div className="bg-gray-50 p-6 rounded-lg flex items-center space-x-4">
                <ShoppingBag className="flex-shrink-0 w-8 h-8 text-gray-600" />
                <span className="text-gray-700 font-semibold text-lg">Shopping & Errands</span>
              </div>
              <div className="bg-gray-50 p-6 rounded-lg flex items-center space-x-4">
                <Heart className="flex-shrink-0 w-8 h-8 text-gray-600" />
                <span className="text-gray-700 font-semibold text-lg">Companionship</span>
              </div>
              <div className="bg-gray-50 p-6 rounded-lg flex items-center space-x-4">
                <PawPrint className="flex-shrink-0 w-8 h-8 text-gray-600" />
                <span className="text-gray-700 font-semibold text-lg">Pet Care</span>
              </div>
              <div className="bg-gray-50 p-6 rounded-lg flex items-center space-x-4">
                <Monitor className="flex-shrink-0 w-8 h-8 text-gray-600" />
                <span className="text-gray-700 font-semibold text-lg">Tech Support</span>
              </div>
              <div className="bg-gray-50 p-6 rounded-lg flex items-center space-x-4">
                <Car className="flex-shrink-0 w-8 h-8 text-gray-600" />
                <span className="text-gray-700 font-semibold text-lg">Transportation</span>
              </div>
            </div>
          </div>

          {/* Important Notice */}
          <div className="max-w-4xl mx-auto mb-12">
            <div className="bg-blue-50 rounded-xl p-8 text-center">
              <p className="text-gray-700 text-lg leading-relaxed">
                <span className="font-semibold text-gray-900">Important:</span> No medical care, personal hygiene assistance, or professional services are included. Housemates are not trained caregivers or medical professionals.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* Meet Golden Section - Papa Style */}
      <section className="relative bg-gradient-to-b from-amber-100 to-white">
        {/* Main Video Section with Curved Background */}
        <div className="relative min-h-[600px] md:min-h-[700px] lg:min-h-[800px] overflow-hidden">
          
          {/* Background Image Layer */}
          <div 
            className="absolute inset-0 bg-cover bg-no-repeat"
            style={{ 
              backgroundImage: "url('/mux-video-thumbnail.png')",
              backgroundPosition: "center 20%"
            }}
          ></div>
          
          {/* Curved top overlay to create smooth transition from amber section */}
          <div 
            className="absolute top-0 left-0 right-0 h-16 md:h-20 lg:h-24 bg-amber-100 z-5"
            style={{ 
              borderBottomLeftRadius: "80% 60%",
              borderBottomRightRadius: "80% 60%"
            }}
          ></div>
          

          
          {/* Content Container */}
          <div className="relative z-20 flex items-center justify-center min-h-[600px] md:min-h-[700px] lg:min-h-[800px] px-6 md:px-12">
            <div className="text-center">
              {/* Center - Play Button */}
              <div className="flex justify-center items-center relative z-30 mb-8">
                <VideoModal />
              </div>
              
              {/* Meet Golden Text - Below Play Button */}
              <h2 className="text-6xl md:text-7xl lg:text-8xl font-bold text-white leading-tight">
                Meet Golden
              </h2>
            </div>
          </div>
        </div>
      </section>

      {/* Cooking Helpers Section */}
      <section className="pt-8 pb-8 px-6">
        <AirbnbStyleRow category="cooking-helpers" />
      </section>

      {/* Tech-Savvy Helpers Section */}
      <section className="pt-8 pb-8 px-6">
        <AirbnbStyleRow category="tech-helpers" />
      </section>

      {/* Pet-Friendly Helpers Section */}
      <section className="pt-8 pb-8 px-6">
        <AirbnbStyleRow category="pet-helpers" />
      </section>

      {/* Errands & Driving Helpers Section */}
      <section className="pt-8 pb-8 px-6">
        <AirbnbStyleRow category="errands-helpers" />
      </section>

      {/* Looking for Rooms Section */}
      <section className="pt-8 pb-8 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-gray-50 rounded-3xl p-8 md:p-12 text-center border border-gray-200">
            <div className="flex justify-center mb-6">
              <div className="flex items-center justify-center h-16 w-16 rounded-full bg-white border border-gray-300 hover:bg-gray-100 transition-colors duration-200">
                <Search className="h-8 w-8 text-gray-600" />
              </div>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Looking for an Available Room?
            </h2>
            <p className="text-lg md:text-xl text-gray-700 mb-8 max-w-2xl mx-auto">
              Check out our homes tab to browse available rooms from verified homeowners in your area.
            </p>
            <Link href="/homes">
              <div className="inline-flex flex-col items-center group cursor-pointer">
                <div className="flex items-center justify-center h-12 w-12 rounded-full bg-white border border-gray-300 hover:bg-gray-100 transition-colors duration-200 mb-2 group-hover:scale-105">
                  <Search className="h-6 w-6 text-gray-600" />
                </div>
                <span className="text-sm font-medium text-gray-600 group-hover:text-gray-900">
                  Browse Homes
                </span>
              </div>
            </Link>
          </div>
        </div>
      </section>


    </>
  );
}

