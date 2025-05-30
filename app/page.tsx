import { AirbnbStyleRow } from "../app/components/AirbnbStyleRow";
import Image from "next/image";
import { Users, Shield, Layers, Sparkles, Salad, Flower, ShoppingBag, HeartHandshake, Cat, Wrench, Monitor, Car } from "lucide-react";
import Link from "next/link";
import { VideoSection } from "../components/VideoSection";
import { videoConfig } from "../lib/video-config";

export default function Home() {
  return (
    <>
      {/* Hero Section - Full width image with overlay content */}
      <div className="relative w-full h-[500px] md:h-[600px] overflow-hidden rounded-b-[120px] md:rounded-b-[144px]">
        {/* Background Image */}
        <Image 
          src="/old-young-hero.jpg" 
          alt="Homeowner and homesharer together" 
          fill
          style={{ objectFit: "cover" }}
          priority
        />
        
        {/* Content Overlay */}
        <div className="absolute inset-0 bg-black/20 flex items-end pb-8 md:pb-16">
          <div className="max-w-7xl mx-auto px-4 md:px-8 w-full">
            <div className="flex justify-between items-end">
              <div className="max-w-xl mx-auto md:mx-0 mb-8 md:mb-0">
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight text-white mb-6 text-center md:text-left">
                  Turn a Spare Room Into Support, Extra Income, and Community
                </h1>
                
                {/* Get Started Button - Mobile only, below text */}
                <div className="md:hidden text-center">
                  <Link 
                    href="/onboarding"
                    className="inline-flex items-center bg-primary hover:bg-primary/90 text-white px-12 py-6 rounded-2xl font-semibold text-lg transition-colors shadow-lg"
                  >
                    Get Started
                  </Link>
                </div>
              </div>
              
              {/* Get Started Button - Desktop only, bottom right */}
              <div className="hidden md:block">
                <Link 
                  href="/onboarding"
                  className="inline-flex items-center bg-primary hover:bg-primary/90 text-white px-12 py-6 rounded-2xl font-semibold text-lg transition-colors shadow-lg"
                >
                  Get Started
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Video Section */}
      <VideoSection 
        playbackId={videoConfig.homePageVideo.playbackId}
        title={videoConfig.homePageVideo.title}
        description={videoConfig.homePageVideo.description}
        thumbnailUrl={videoConfig.homePageVideo.thumbnailUrl}
        autoplay={videoConfig.homePageVideo.autoplay}
        muted={videoConfig.homePageVideo.muted}
        loop={videoConfig.homePageVideo.loop}
      />

      {/* Golden HomeShare Benefits Section */}
      <section className="mt-16 mb-24">
        <div className="grid md:grid-cols-2 gap-0 items-center">
          {/* Left Side - Background Image */}
          <div className="relative">
            <div className="relative w-full h-[400px] md:h-[600px] rounded-bl-[60px] overflow-hidden">
              <Image 
                src="/helping-happy-bg.jpg" 
                alt="Helping hands providing support" 
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>
          
          {/* Right Side - Text Content */}
          <div className="px-6 md:px-12 py-8 md:py-16 space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-8">What is homesharing?</h2>
            
            <p className="text-lg text-gray-700 leading-relaxed text-center">
              Housemates help homeowners by providing <strong>up to 10 hours weekly support (depending on arrangement)</strong> plus overnight presence <strong>(5-6 nights per week)</strong> in exchange for affordable accommodation.
            </p>
            
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-gray-900 text-center">Types of Support Available:</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                <div className="flex items-center gap-3 bg-gray-100 p-3 rounded-xl">
                  <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                    <Sparkles size={16} className="text-gray-600" />
                  </div>
                  <span className="text-sm font-medium text-gray-700">Cleaning</span>
                </div>
                
                <div className="flex items-center gap-3 bg-gray-100 p-3 rounded-xl">
                  <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                    <Salad size={16} className="text-gray-600" />
                  </div>
                  <span className="text-sm font-medium text-gray-700">Cooking</span>
                </div>
                
                <div className="flex items-center gap-3 bg-gray-100 p-3 rounded-xl">
                  <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                    <Flower size={16} className="text-gray-600" />
                  </div>
                  <span className="text-sm font-medium text-gray-700">Yard Work</span>
                </div>
                
                <div className="flex items-center gap-3 bg-gray-100 p-3 rounded-xl">
                  <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                    <ShoppingBag size={16} className="text-gray-600" />
                  </div>
                  <span className="text-sm font-medium text-gray-700">Shopping & Errands</span>
                </div>
                
                <div className="flex items-center gap-3 bg-gray-100 p-3 rounded-xl">
                  <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                    <HeartHandshake size={16} className="text-gray-600" />
                  </div>
                  <span className="text-sm font-medium text-gray-700">Companionship</span>
                </div>
                
                <div className="flex items-center gap-3 bg-gray-100 p-3 rounded-xl">
                  <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                    <Cat size={16} className="text-gray-600" />
                  </div>
                  <span className="text-sm font-medium text-gray-700">Pet Care</span>
                </div>
                
                <div className="flex items-center gap-3 bg-gray-100 p-3 rounded-xl">
                  <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                    <Monitor size={16} className="text-gray-600" />
                  </div>
                  <span className="text-sm font-medium text-gray-700">Tech Support</span>
                </div>
                
                <div className="flex items-center gap-3 bg-gray-100 p-3 rounded-xl">
                  <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                    <Wrench size={16} className="text-gray-600" />
                  </div>
                  <span className="text-sm font-medium text-gray-700">Home Maintenance</span>
                </div>
                
                <div className="flex items-center gap-3 bg-gray-100 p-3 rounded-xl">
                  <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                    <Car size={16} className="text-gray-600" />
                  </div>
                  <span className="text-sm font-medium text-gray-700">Transportation</span>
                </div>
              </div>
            </div>
            
            <div className="bg-green-50 p-4 rounded-lg border-l-4 border-green-700">
              <p className="text-green-800 text-sm">
                <strong>Important:</strong> This program provides companionship and practical household support only. <strong>No medical care, personal hygiene assistance, or professional services</strong> are included. Housemates are not trained caregivers or medical professionals.
              </p>
            </div>
          </div>
        </div>
        
        {/* Buttons Below Section */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8 px-6">
          <Link 
            href="/onboarding"
            className="inline-flex items-center bg-primary hover:bg-primary/90 text-white px-8 py-4 rounded-2xl font-semibold text-lg transition-colors shadow-lg"
          >
            Start Your Journey
          </Link>
          <Link 
            href="/about"
            className="inline-flex items-center bg-white hover:bg-gray-50 text-primary border-2 border-primary px-8 py-4 rounded-2xl font-semibold text-lg transition-colors"
          >
            Learn More
          </Link>
        </div>
      </section>

      {/* Available Housemates Section - Full Width */}
      <section className="mb-8 px-6">
        <AirbnbStyleRow category="housemates" />
      </section>

      {/* Partners Section */}
      <section className="mb-24 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-5xl mx-auto mb-20">
            {/* Our Partners Section */}
            <div className="mb-20">
              <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-900 mb-12">
                Partnered with
              </h2>
              
              <div className="flex justify-center">
                <Link 
                  href="https://lovecolumbia.org/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-white rounded-lg p-8 shadow-sm border border-gray-100 w-80 h-40 flex items-center justify-center hover:shadow-md transition-shadow"
                >
                  <img 
                    src="/love-columbia-logo.png" 
                    alt="Love Columbia" 
                    className="max-w-full max-h-full object-contain"
                  />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section - Full Width */}
      <section className="mb-24">
        <div className="grid md:grid-cols-2 gap-0 items-center">
          {/* Left Content */}
          <div className="px-6 md:px-12 py-8 md:py-16 space-y-6">
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">
              Find your perfect homesharing match
            </h2>
            
            {/* Feature Points */}
            <div className="space-y-6 mb-8">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 flex items-center justify-center flex-shrink-0 mt-1">
                  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                    <path d="m9 12 2 2 4-4"/>
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl text-gray-900">
                    100% of participants are background checked before connecting
                  </h3>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 flex items-center justify-center flex-shrink-0 mt-1">
                  <Users size={32} className="text-primary" />
                </div>
                <div>
                  <h3 className="text-xl text-gray-900">
                    Sophisticated matching algorithm with human support
                  </h3>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 flex items-center justify-center flex-shrink-0 mt-1">
                  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                    <path d="M12 2L2 7l10 5 10-5-10-5z"/>
                    <path d="M2 17l10 5 10-5"/>
                    <path d="M2 12l10 5 10-5"/>
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl text-gray-900">
                    Complete platform with chat, payment, and secure agreements
                  </h3>
                </div>
              </div>
            </div>
            
            <Link 
              href="/onboarding"
              className="inline-flex items-center bg-primary hover:bg-primary/90 text-white px-8 py-4 rounded-lg font-semibold transition-colors"
            >
              Get Matched
            </Link>
          </div>
          
          {/* Right Image - Full width to edge */}
          <div className="relative">
            <img 
              src="/kitchen-woman.jpg" 
              alt="Happy woman in kitchen" 
              className="object-cover w-full h-[400px] md:h-[600px] rounded-br-[60px]"
            />
            
            {/* Review Overlay - Desktop only */}
            <div className="hidden md:block absolute top-6 left-6 right-6">
              <div className="bg-white/95 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/20 max-w-md">
                <blockquote className="text-gray-800 font-medium text-base mb-3">
                  "Golden HomeShare made finding a housemate so easy. The background checks gave me peace of mind."
                </blockquote>
                <cite className="text-gray-600 text-sm font-semibold not-italic">
                  Margaret S, Golden HomeShare member
                </cite>
              </div>
            </div>
          </div>
          
          {/* Review Below Image - Mobile only */}
          <div className="md:hidden px-6 py-4">
            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
              <blockquote className="text-gray-800 font-medium text-base mb-3">
                "Golden HomeShare made finding a housemate so easy. The background checks gave me peace of mind."
              </blockquote>
              <cite className="text-gray-600 text-sm font-semibold not-italic">
                Margaret S, Golden HomeShare member
              </cite>
            </div>
          </div>
        </div>
      </section>

      {/* Rooms Available Section - Moved here from the end */}
      <section className="mb-4 px-6">
        <AirbnbStyleRow category="rooms" />
      </section>

      {/* Our Process Section - Full Width */}
      <section className="mb-12">
        <div className="grid md:grid-cols-2 gap-0 items-center">
          {/* Left Image - Full width to edge */}
          <div className="relative">
            <img 
              src="/young-green-happy.jpg" 
              alt="Happy woman" 
              className="object-cover w-full h-[400px] md:h-[600px] rounded-bl-[60px]"
            />
            
            {/* Review Overlay - Desktop only */}
            <div className="hidden md:block absolute bottom-6 left-6 right-6">
              <div className="bg-white/95 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/20 max-w-md">
                <blockquote className="text-gray-800 font-medium text-base mb-3">
                  "As a graduate student, I couldn't afford my own place. Golden HomeShare connected me with Eleanor, and now I have an affordable home and a wonderful mentor."
                </blockquote>
                <cite className="text-gray-600 text-sm font-semibold not-italic">
                  Sarah M, Golden HomeShare member
                </cite>
              </div>
            </div>
          </div>
          
          {/* Review Below Image - Mobile only */}
          <div className="md:hidden px-6 py-4">
            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
              <blockquote className="text-gray-800 font-medium text-base mb-3">
                "As a graduate student, I couldn't afford my own place. Golden HomeShare connected me with Eleanor, and now I have an affordable home and a wonderful mentor."
              </blockquote>
              <cite className="text-gray-600 text-sm font-semibold not-italic">
                Sarah M, Golden HomeShare member
              </cite>
            </div>
          </div>
          
          {/* Right Content */}
          <div className="px-6 md:px-12 py-8 md:py-16 space-y-6">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-8">Our Process</h2>
            
            <div className="space-y-5">
              <div className="flex items-start gap-5">
                <div className="bg-primary/10 rounded-xl p-3 mt-1 flex-shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                    <polyline points="14,2 14,8 20,8"/>
                    <line x1="16" y1="13" x2="8" y2="13"/>
                    <line x1="16" y1="17" x2="8" y2="17"/>
                    <polyline points="10,9 9,9 8,9"/>
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 text-base mb-1">Application</h3>
                  <p className="text-gray-600 text-sm">Complete our comprehensive application to get started</p>
                </div>
              </div>
              
              <div className="flex items-start gap-5">
                <div className="bg-primary/10 rounded-xl p-3 mt-1 flex-shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                    <path d="m9 12 2 2 4-4"/>
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 text-base mb-1">Background checks and references</h3>
                  <p className="text-gray-600 text-sm">Thorough verification for safety and peace of mind</p>
                </div>
              </div>
              
              <div className="flex items-start gap-5">
                <div className="bg-primary/10 rounded-xl p-3 mt-1 flex-shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 text-base mb-1">Interview</h3>
                  <p className="text-gray-600 text-sm">Personal interview to understand your needs and preferences</p>
                </div>
              </div>
              
              <div className="flex items-start gap-5">
                <div className="bg-primary/10 rounded-xl p-3 mt-1 flex-shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                    <path d="M12 2L2 7l10 5 10-5-10-5z"/>
                    <path d="M2 17l10 5 10-5"/>
                    <path d="M2 12l10 5 10-5"/>
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 text-base mb-1">Match Search</h3>
                  <p className="text-gray-600 text-sm">We search for compatible matches based on your criteria</p>
                </div>
              </div>
              
              <div className="flex items-start gap-5">
                <div className="bg-primary/10 rounded-xl p-3 mt-1 flex-shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                    <path d="M16 3h5v5"/>
                    <path d="M8 3H3v5"/>
                    <path d="M12 22v-8.3a4 4 0 0 0-1.172-2.872L3 3"/>
                    <path d="m21 3-7.9 7.9"/>
                    <path d="M16 21h5v-5"/>
                    <path d="M8 21H3v-5"/>
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 text-base mb-1">Match Introduction</h3>
                  <p className="text-gray-600 text-sm">Facilitated introduction to your potential housemate</p>
                </div>
              </div>
              
              <div className="flex items-start gap-5">
                <div className="bg-primary/10 rounded-xl p-3 mt-1 flex-shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                    <polyline points="14,2 14,8 20,8"/>
                    <line x1="9" y1="15" x2="15" y2="15"/>
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 text-base mb-1">Match Agreement</h3>
                  <p className="text-gray-600 text-sm">Secure legal agreements to protect both parties</p>
                </div>
              </div>
              
              <div className="flex items-start gap-5">
                <div className="bg-primary/10 rounded-xl p-3 mt-1 flex-shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                    <path d="M3 11h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-5Zm0 0a9 9 0 1 1 18 0m0 0v5a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3Z"/>
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 text-base mb-1">Ongoing support</h3>
                  <p className="text-gray-600 text-sm">Continued guidance and support throughout your arrangement</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Listings Section - Full Width with consistent padding */}
      <section className="mb-16 px-6">
        {/* Join Now Button - Above listings */}
        <div className="text-center mb-8">
          <Link 
            href="/onboarding"
            className="inline-flex items-center bg-primary hover:bg-primary/90 text-white px-12 py-6 rounded-2xl font-semibold text-lg transition-colors shadow-lg"
          >
            Join Now
          </Link>
        </div>
        
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Explore Available Listings
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover comfortable and affordable homesharing opportunities in your area. Each listing is verified and background-checked for your safety.
          </p>
        </div>
        
        <AirbnbStyleRow category="newest" />
      </section>
    </>
  );
}

