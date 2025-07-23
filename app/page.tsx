import { AirbnbStyleRow } from "../app/components/AirbnbStyleRow";
import { HelpersDataFetcher } from "../app/components/HelpersDataFetcher";
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
              {/* Background Image - Tilted - Only show on large screens */}
              <div className="hidden xl:block absolute top-2 right-4 w-72 h-56 md:top-4 md:right-0 md:w-96 md:h-80 transform rotate-12 rounded-3xl overflow-hidden shadow-xl bg-white border border-gray-100">
                <Image 
                  src="/helpful.jpg" 
                  alt="Helpful assistance" 
                  fill
                  className="object-cover"
                />
              </div>
              
              {/* Foreground Image - Main Focus */}
              <div className="absolute top-6 left-4 w-72 h-56 md:top-8 md:left-8 md:w-80 md:h-64 xl:left-0 xl:w-96 xl:h-80 transform -rotate-6 rounded-3xl overflow-hidden shadow-2xl bg-white border border-gray-100 z-10">
                <Image 
                  src="/old-young-hero.jpg" 
                  alt="Caring intergenerational relationship" 
                  fill
                  className="object-cover"
                />
              </div>
              
              {/* CTA Buttons - Positioned to align with second paragraph */}
              <div className="absolute bottom-[-3rem] md:bottom-[0.5rem] xl:bottom-1 left-1/2 transform -translate-x-1/2 flex flex-col lg:flex-row gap-3 justify-center items-center px-4 w-full max-w-md lg:max-w-none">
                <Link href="/homeowner/signup-wizard" className="w-full lg:w-auto lg:flex-shrink-0">
                  <button className="w-full font-semibold py-4 px-8 lg:px-12 rounded-lg transition-colors duration-200 text-lg whitespace-nowrap host-helper-button">
                    Host a Helper
                  </button>
                </Link>
                <Link href="/housemate/signup-wizard" className="w-full lg:w-auto lg:flex-shrink-0">
                  <button className="w-full font-semibold py-4 px-8 lg:px-12 rounded-lg transition-colors duration-200 text-lg whitespace-nowrap become-helper-button">
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
      
      {/* What Helpers Can Help With Section */}
      <section className="bg-amber-100 -mt-1 pt-2 pb-24">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          
          {/* Mobile Title - Show on mobile only */}
          <div className="text-center mb-12 lg:hidden">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Get Help With
            </h2>
            <div className="flex justify-center">
              <ChevronDown className="w-8 h-8 text-gray-600" />
            </div>
          </div>
          
                    {/* Desktop Layout - Text Left, Grid Right */}
          <div className="hidden lg:block mb-16">
            {/* Top Row - Title, Companionship and Transportation */}
            <div className="grid grid-cols-3 gap-8 mb-8">
              {/* Get Help With Title */}
              <div className="flex items-center justify-start">
                <h2 className="text-3xl md:text-4xl lg:text-6xl font-bold text-gray-900 leading-tight text-left ml-28 -mt-16">
                  Get Help<br/>With
                </h2>
              </div>
              
              {/* Companionship - positioned over Tech Help */}
              <div className="text-center">
                <div className="flex justify-center items-center mb-6 h-24">
                  <Image 
                    src="/Companionship icon without bottom.png" 
                    alt="Companionship" 
                    width={100}
                    height={100}
                    className="object-contain"
                  />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">Companionship</h3>
                <p className="text-lg text-gray-600 leading-relaxed max-w-xs mx-auto">
                  Friendly conversation, shared activities, or simply having someone around.
                </p>
              </div>

              {/* Transportation - positioned over Meal Prep */}
              <div className="text-center">
                <div className="flex justify-center items-center mb-6 h-24">
                  <Image 
                    src="/Transportation icon bottom removed .png" 
                    alt="Transportation" 
                    width={100}
                    height={100}
                    className="object-contain"
                  />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">Transportation</h3>
                <p className="text-lg text-gray-600 leading-relaxed max-w-xs mx-auto">
                  Rides to appointments, grocery runs, or social activities when needed.
                </p>
              </div>
            </div>

            {/* Second Row - 3 columns spanning entire section */}
            <div className="grid grid-cols-3 gap-8 mb-8">
              {/* Household Tasks */}
              <div className="text-center">
                <div className="flex justify-center items-center mb-6 h-24">
                  <Image 
                    src="/Cleaning-icon.png" 
                    alt="Household Tasks" 
                    width={100}
                    height={100}
                    className="object-contain"
                  />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">Household Tasks</h3>
                <p className="text-lg text-gray-600 leading-relaxed max-w-xs mx-auto">
                  Light cleaning, organizing, or maintaining your home's daily upkeep.
                </p>
              </div>

              {/* Tech Help */}
              <div className="text-center">
                <div className="flex justify-center items-center mb-6 h-24">
                  <Image 
                    src="/Tech-help-icon.png" 
                    alt="Tech Help" 
                    width={100}
                    height={100}
                    className="object-contain"
                  />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">Tech Help</h3>
                <p className="text-lg text-gray-600 leading-relaxed max-w-xs mx-auto">
                  Setting up devices, troubleshooting technology, or helping with digital tasks.
                </p>
              </div>

              {/* Meal Preparation */}
              <div className="text-center">
                <div className="flex justify-center items-center mb-6 h-24">
                  <Image 
                    src="/Meal-prep icon.png" 
                    alt="Meal Preparation" 
                    width={100}
                    height={100}
                    className="object-contain"
                  />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">Meal Preparation</h3>
                <p className="text-lg text-gray-600 leading-relaxed max-w-xs mx-auto">
                  Cooking together, meal planning, or sharing kitchen responsibilities.
                </p>
              </div>
            </div>

                        {/* Third Row - 3 columns spanning entire section */}
            <div className="grid grid-cols-3 gap-8">
              {/* Pet Care */}
              <div className="text-center">
                <div className="flex justify-center items-center mb-6 h-24">
                  <Image 
                    src="/Pet-care-icon.png" 
                    alt="Pet Care" 
                    width={100}
                    height={100}
                    className="object-contain"
                  />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">Pet Care</h3>
                <p className="text-lg text-gray-600 leading-relaxed max-w-xs mx-auto">
                  Walking dogs, feeding pets, or providing companionship for your furry friends.
                </p>
              </div>

              {/* Errands & Shopping */}
              <div className="text-center">
                <div className="flex justify-center items-center mb-6 h-24">
                  <Image 
                    src="/Errands icon bottom removed.png" 
                    alt="Errands & Shopping" 
                    width={100}
                    height={100}
                    className="object-contain"
                  />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">Errands & Shopping</h3>
                <p className="text-lg text-gray-600 leading-relaxed max-w-xs mx-auto">
                  Grocery shopping, pharmacy visits, or picking up essentials around town.
                </p>
              </div>

              {/* Garden & Yard Care */}
              <div className="text-center">
                <div className="flex justify-center items-center mb-6 h-24">
                  <Image 
                    src="/Yard work icon.png" 
                    alt="Garden & Yard Care" 
                    width={100}
                    height={100}
                    className="object-contain"
                  />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">Garden & Yard Care</h3>
                <p className="text-lg text-gray-600 leading-relaxed max-w-xs mx-auto">
                  Tending to plants, light gardening, or maintaining outdoor spaces.
                </p>
              </div>
            </div>
          </div>

          {/* Mobile Layout - Keep original for mobile/tablet */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16 lg:hidden">
            {/* Household Tasks */}
            <div className="text-center">
              <div className="flex justify-center items-center mb-6 h-24">
                <Image 
                  src="/Cleaning-icon.png" 
                  alt="Household Tasks" 
                  width={96}
                  height={96}
                  className="object-contain"
                />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-4">Household Tasks</h3>
              <p className="text-lg text-gray-600 leading-relaxed">
                Light cleaning, organizing, or maintaining your home's daily upkeep.
              </p>
            </div>

            {/* Meal Preparation */}
            <div className="text-center">
              <div className="flex justify-center items-center mb-6 h-24">
                <Image 
                  src="/Meal-prep icon.png" 
                  alt="Meal Preparation" 
                  width={96}
                  height={96}
                  className="object-contain"
                />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-4">Meal Preparation</h3>
              <p className="text-lg text-gray-600 leading-relaxed">
                Cooking together, meal planning, or sharing kitchen responsibilities.
              </p>
            </div>

            {/* Companionship */}
            <div className="text-center">
              <div className="flex justify-center items-center mb-6 h-24">
                <Image 
                  src="/Companionship icon without bottom.png" 
                  alt="Companionship" 
                  width={96}
                  height={96}
                  className="object-contain"
                />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-4">Companionship</h3>
              <p className="text-lg text-gray-600 leading-relaxed">
                Friendly conversation, shared activities, or simply having someone around.
              </p>
            </div>

            {/* Errands & Shopping */}
            <div className="text-center">
              <div className="flex justify-center items-center mb-6 h-24">
                <Image 
                  src="/Errands icon bottom removed.png" 
                  alt="Errands & Shopping" 
                  width={96}
                  height={96}
                  className="object-contain"
                />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-4">Errands & Shopping</h3>
              <p className="text-lg text-gray-600 leading-relaxed">
                Grocery shopping, pharmacy visits, or picking up essentials around town.
              </p>
            </div>

            {/* Pet Care */}
            <div className="text-center">
              <div className="flex justify-center items-center mb-6 h-24">
                <Image 
                  src="/Pet-care-icon.png" 
                  alt="Pet Care" 
                  width={96}
                  height={96}
                  className="object-contain"
                />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-4">Pet Care</h3>
              <p className="text-lg text-gray-600 leading-relaxed">
                Walking dogs, feeding pets, or providing companionship for your furry friends.
              </p>
            </div>

            {/* Transportation */}
            <div className="text-center">
              <div className="flex justify-center items-center mb-6 h-24">
                <Image 
                  src="/Transportation icon bottom removed .png" 
                  alt="Transportation" 
                  width={96}
                  height={96}
                  className="object-contain"
                />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-4">Transportation</h3>
              <p className="text-lg text-gray-600 leading-relaxed">
                Rides to appointments, grocery runs, or social activities when needed.
              </p>
            </div>

            {/* Garden & Yard Care */}
            <div className="text-center">
              <div className="flex justify-center items-center mb-6 h-24">
                <Image 
                  src="/Yard work icon.png" 
                  alt="Garden & Yard Care" 
                  width={96}
                  height={96}
                  className="object-contain"
                />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-4">Garden & Yard Care</h3>
              <p className="text-lg text-gray-600 leading-relaxed">
                Tending to plants, light gardening, or maintaining outdoor spaces.
              </p>
            </div>

            {/* Tech Help */}
            <div className="text-center">
              <div className="flex justify-center items-center mb-6 h-24">
                <Image 
                  src="/Tech-help-icon.png" 
                  alt="Tech Help" 
                  width={96}
                  height={96}
                  className="object-contain"
                />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-4">Tech Help</h3>
              <p className="text-lg text-gray-600 leading-relaxed">
                Setting up devices, troubleshooting technology, or helping with digital tasks.
              </p>
            </div>
          </div>

          {/* Call to Action */}
          <div className="text-center">
            <div className="flex justify-center">
              <Link href="/homeowner/signup-wizard" className="w-full lg:w-auto lg:flex-shrink-0">
                <button className="w-full font-semibold py-4 px-8 lg:px-12 rounded-lg transition-colors duration-200 text-lg whitespace-nowrap become-helper-button">
                  Find a Helper
                </button>
              </Link>
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
              backgroundPosition: "center 20%",
              borderBottomLeftRadius: "70% 15%",
              borderBottomRightRadius: "70% 15%"
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

      {/* All Helper Categories - No Duplicates */}
      <HelpersDataFetcher />


    </>
  );
}

