import { AirbnbStyleRow } from "../app/components/AirbnbStyleRow";
import Image from "next/image";
import { Users, Shield, Layers } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <>
      {/* Hero Section - Full width image with overlay content */}
      <div className="relative w-full h-[500px] md:h-[600px] mb-6 overflow-hidden rounded-b-[120px] md:rounded-b-[144px]">
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
            <div className="max-w-xl mx-auto md:mx-0">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight text-white mb-6 text-center md:text-left">
                Turn a Spare Room Into Connection, Support, and Extra Income.
              </h1>
            </div>
          </div>
        </div>
      </div>

      <section className="mb-24 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-5xl mx-auto mb-20">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
              Golden HomeShare Makes Sharing A Home Safe & Simple
            </h2>
            
            {/* Action Cards */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16 max-w-2xl mx-auto">
              <Link 
                href="/onboarding"
                className="flex-1 bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-lg transition-all duration-200 group"
              >
                <div className="text-center">
                  <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                      <polyline points="9,22 9,12 15,12 15,22"/>
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">List Your Space</h3>
                  <p className="text-gray-600 text-sm">Share your home with vetted housemates</p>
                </div>
              </Link>
              
              <Link 
                href="/onboarding"
                className="flex-1 bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-lg transition-all duration-200 group"
              >
                <div className="text-center">
                  <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                      <circle cx="11" cy="11" r="8"/>
                      <path d="m21 21-4.35-4.35"/>
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">Find Housing</h3>
                  <p className="text-gray-600 text-sm">Discover affordable homesharing options</p>
                </div>
              </Link>
            </div>
            
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
            
            {/* Features Section - New Layout */}
            <div className="rounded-3xl p-8 md:p-12 mb-20">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                {/* Left Content */}
                <div>
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
                    
                    <div className="flex items-start gap-4">
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
                    Get started
                  </Link>
                </div>
                
                {/* Right Image */}
                <div className="relative">
                  <img 
                    src="/kitchen-woman.jpg" 
                    alt="Happy woman in kitchen" 
                    className="rounded-2xl object-cover w-full h-[400px]"
                  />
                </div>
              </div>
            </div>
            
            {/* Testimonials Section */}
            <div className="mb-20">
              <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-12">
                What Our Community Says
              </h2>
              
              <div className="grid md:grid-cols-3 gap-6">
                {/* Homeowner Review 1 */}
                <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                      <Users className="text-primary" size={20} />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Margaret S.</h4>
                      <p className="text-gray-600 text-sm">Homeowner • Columbia, MO</p>
                    </div>
                  </div>
                  <blockquote className="text-gray-700 italic text-sm">
                    "Golden HomeShare helped me find the perfect housemate. The screening process made me feel safe, and now I have both companionship and help around the house."
                  </blockquote>
                </div>
                
                {/* Homeowner Review 2 */}
                <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                        <polyline points="9,22 9,12 15,12 15,22"/>
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Robert K.</h4>
                      <p className="text-gray-600 text-sm">Homeowner • Columbia, MO</p>
                    </div>
                  </div>
                  <blockquote className="text-gray-700 italic text-sm">
                    "After my wife passed, the house felt too empty. Through Golden HomeShare, I found a wonderful housemate who brings joy back into my home while helping with expenses."
                  </blockquote>
                </div>
                
                {/* Housemate Review */}
                <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                        <circle cx="11" cy="11" r="8"/>
                        <path d="m21 21-4.35-4.35"/>
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Sarah M.</h4>
                      <p className="text-gray-600 text-sm">Housemate • Columbia, MO</p>
                    </div>
                  </div>
                  <blockquote className="text-gray-700 italic text-sm">
                    "As a graduate student, finding affordable housing was impossible until I discovered Golden HomeShare. Living with Eleanor has been amazing - she's like family now."
                  </blockquote>
                </div>
              </div>
            </div>
          </div>
          
          {/* Our Process Section */}
          <div className="py-16 md:py-20 px-4 md:px-8 mb-20">
            <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-8 items-start">
              <div className="relative">
                <img 
                  src="/young-green-happy.jpg" 
                  alt="Happy woman" 
                  className="rounded-lg object-cover w-full h-[300px] md:h-[600px]"
                />
              </div>
              
              <div className="space-y-6">
                <h2 className="text-4xl md:text-5xl font-bold text-gray-900">Our Process</h2>
                
                <p className="text-lg text-gray-600">
                  Our proven 7-step process ensures compatibility and peace of mind through every step of your homesharing journey.
                </p>
                
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="bg-primary/10 rounded-lg p-2 mt-1">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                        <polyline points="14,2 14,8 20,8"/>
                        <line x1="16" y1="13" x2="8" y2="13"/>
                        <line x1="16" y1="17" x2="8" y2="17"/>
                        <polyline points="10,9 9,9 8,9"/>
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">Application</h3>
                      <p className="text-gray-600 text-sm">Complete our comprehensive application to get started</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="bg-primary/10 rounded-lg p-2 mt-1">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                        <path d="m9 12 2 2 4-4"/>
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">Background checks and references</h3>
                      <p className="text-gray-600 text-sm">Thorough verification for safety and peace of mind</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="bg-primary/10 rounded-lg p-2 mt-1">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">Interview</h3>
                      <p className="text-gray-600 text-sm">Personal interview to understand your needs and preferences</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="bg-primary/10 rounded-lg p-2 mt-1">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                        <circle cx="11" cy="11" r="8"/>
                        <path d="m21 21-4.35-4.35"/>
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">Match Search</h3>
                      <p className="text-gray-600 text-sm">We search for compatible matches based on your criteria</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="bg-primary/10 rounded-lg p-2 mt-1">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                        <path d="M16 3h5v5"/>
                        <path d="M8 3H3v5"/>
                        <path d="M12 22v-8.3a4 4 0 0 0-1.172-2.872L3 3"/>
                        <path d="m21 3-7.9 7.9"/>
                        <path d="M16 21h5v-5"/>
                        <path d="M8 21H3v-5"/>
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">Match Introduction</h3>
                      <p className="text-gray-600 text-sm">Facilitated introduction to your potential housemate</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="bg-primary/10 rounded-lg p-2 mt-1">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                        <polyline points="14,2 14,8 20,8"/>
                        <line x1="9" y1="15" x2="15" y2="15"/>
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">Match Agreement</h3>
                      <p className="text-gray-600 text-sm">Secure legal agreements to protect both parties</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="bg-primary/10 rounded-lg p-2 mt-1">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                        <path d="M3 11h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-5Zm0 0a9 9 0 1 1 18 0m0 0v5a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3Z"/>
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">Ongoing support</h3>
                      <p className="text-gray-600 text-sm">Continued guidance and support throughout your arrangement</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Listings Section */}
          <div className="mb-16">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Explore Available Listings
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Discover comfortable and affordable homesharing opportunities in your area. Each listing is verified and background-checked for your safety.
              </p>
            </div>
            
            <AirbnbStyleRow category="newest" />
            <AirbnbStyleRow category="rooms" />
            <AirbnbStyleRow category="housemates" />
          </div>
        </div>
      </section>
    </>
  );
}
