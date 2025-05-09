import { ProductRow } from "../app/components/ProductRow";
import Image from "next/image";
import { Users, Shield, Layers } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <section className="mb-24 px-4 md:px-8">
      {/* Development Notice Banner */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-blue-500 to-primary shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-2 text-center">
          <p className="text-white font-medium text-sm sm:text-base">
            <span className="inline-block mr-2 rounded-full bg-white/20 px-2 py-0.5 text-xs font-semibold">COMING SOON</span>
            This platform is currently in development and will be launching in Summer 2025
          </p>
        </div>
      </div>
      
      {/* Add padding to account for the fixed banner */}
      <div className="pt-12"></div>
      
      {/* Hero Section with Primary Background - now with rounded corners */}
      <div className="max-w-7xl mx-auto bg-primary text-white py-16 md:py-24 px-4 md:px-8 mb-12 rounded-2xl">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-8 items-center">
          <div className="space-y-6">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
              Turn a Spare Room Into Connection, Support, and Monthly Income.
            </h1>
            
            <p className="text-lg md:text-xl">
              Golden HomeShare connects older adults looking for support or friendly companionship with 
              vetted housemates who provide light household help for affordable housing. It's a win-win!
            </p>
          </div>
          
          <div className="hidden md:block">
            {/* Replace this div with an Image component */}
            <div className="relative h-[400px] w-full rounded-lg overflow-hidden">
              <Image 
                src="/helpful.jpg" 
                alt="Homeowner and homesharer together" 
                fill
                style={{ objectFit: "cover" }}
                priority
              />
            </div>
          </div>
        </div>
      </div>
      
      {/* Test Signup Links - moved below hero section */}
      <div className="max-w-7xl mx-auto mb-16 flex justify-center gap-4">
        <Link 
          href="/test-onboarding-flow/homeowner" 
          className="bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-lg flex items-center justify-center font-medium"
        >
          Test Homeowner Signup
        </Link>
        <Link 
          href="/test-onboarding-flow/housemate" 
          className="bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-lg flex items-center justify-center font-medium"
        >
          Test Housemate Signup
        </Link>
      </div>

      <div className="max-w-7xl mx-auto">
        <div className="max-w-5xl mx-auto mb-20">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
            Golden HomeShare Makes Sharing A Home Safe & Simple
          </h2>
          
          <p className="text-center text-lg text-muted-foreground mb-12 max-w-3xl mx-auto">
            Golden HomeShare is a platform that connects older adults looking for safe and affordable homesharing
            arrangements with vetted housemates. Our priority is safety and simplicity in finding a match
            that feels comfortable for you. We're with you every step of the way!
          </p>
          
          <div className="grid md:grid-cols-3 gap-6">
            {/* Feature 1 */}
            <div className="bg-slate-50 p-8 rounded-lg">
              <div className="bg-primary text-white w-14 h-14 rounded flex items-center justify-center mb-6">
                <Users size={24} />
              </div>
              
              <h3 className="text-xl font-semibold mb-4">Well Matched</h3>
              
              <p className="text-muted-foreground">
                Golden HomeShare uses a sophisticated matching algorithm and real human support staff to create a space where compatible homeowners and housemates can connect. You’re in charge of who you connect with and how you move forward.
              </p>
            </div>
            
            {/* Feature 2 */}
            <div className="bg-slate-50 p-8 rounded-lg">
              <div className="bg-primary text-white w-14 h-14 rounded flex items-center justify-center mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/></svg>
              </div>
              
              <h3 className="text-xl font-semibold mb-4">Safe & Supportive</h3>
              
              <p className="text-muted-foreground">
                At Golden HomeShare each participant must verify their identity and pass a background check before entering into a homesharing arrangement. Whether you're offering a room or looking for one, real people are here to help throughout every step.
              </p>
            </div>
            
            {/* Feature 3 */}
            <div className="bg-slate-50 p-8 rounded-lg">
              <div className="bg-primary text-white w-14 h-14 rounded flex items-center justify-center mb-6">
                <Layers size={24} />
              </div>
              
              <h3 className="text-xl font-semibold mb-4">All-in-one</h3>
              
              <p className="text-muted-foreground">
              Golden HomeShare keeps things simple. You can browse profiles, chat, and connect, all within the platform.
              There's nothing extra to download or manage. By the time you're ready to move in, you'll already know each other.
              </p>
            </div>
          </div>
        </div>
        
        {/* Safety Section */}
        <div className="relative bg-primary text-white py-16 md:py-20 px-4 md:px-8 rounded-2xl mb-20 overflow-hidden">
          <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-8 items-center">
            <div className="relative md:h-[400px]">
              <div className="md:absolute md:left-0 md:top-0 md:bottom-0 md:w-full">
                <Image 
                  src="/trust.jpg" 
                  alt="Smiling homeowner" 
                  width={500}
                  height={600}
                  className="mx-auto md:mx-0 rounded-lg object-cover h-[300px] md:h-full w-auto"
                />
              </div>
            </div>
            
            <div className="space-y-6 md:ml-auto max-w-xl">
              <div className="flex justify-center mb-4">
                <div className="bg-white/20 p-4 rounded-lg inline-block">
                  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                    <path d="m9 12 2 2 4-4"></path>
                  </svg>
                </div>
              </div>
              
              <h2 className="text-4xl md:text-5xl font-bold text-center md:text-left">Safety Is Our Priority</h2>
              
              <p className="text-lg md:text-xl text-center md:text-left">
                At Golden HomeShare we value the safety of our Hosts and Guests. 
                The Golden HomeShare team is with you every step of the way.
              </p>
            </div>
          </div>
        </div>
        
        {/* Safety Features */}
        <div className="max-w-7xl mx-auto grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          <div className="bg-slate-50 p-6 rounded-lg">
            <div className="bg-primary text-white w-10 h-10 rounded-full flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                <path d="m9 12 2 2 4-4"></path>
              </svg>
            </div>
            <h3 className="text-lg font-semibold">Background Check required on all Hosts and Guests</h3>
          </div>
          
          <div className="bg-slate-50 p-6 rounded-lg">
            <div className="bg-primary text-white w-10 h-10 rounded-full flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                <path d="m9 12 2 2 4-4"></path>
              </svg>
            </div>
            <h3 className="text-lg font-semibold">Host and guest identification and address verified</h3>
          </div>
          
          <div className="bg-slate-50 p-6 rounded-lg">
            <div className="bg-primary text-white w-10 h-10 rounded-full flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                <path d="m9 12 2 2 4-4"></path>
              </svg>
            </div>
            <h3 className="text-lg font-semibold">Secure homeshare agreements to protect both parties</h3>
          </div>
          
          <div className="bg-slate-50 p-6 rounded-lg">
            <div className="bg-primary text-white w-10 h-10 rounded-full flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                <path d="m9 12 2 2 4-4"></path>
              </svg>
            </div>
            <h3 className="text-lg font-semibold">Dedicated mediation support for any conflicts or concerns</h3>
          </div>
        </div>
        
        <ProductRow category="newest" />
        <ProductRow category="templates" />
        <ProductRow category="icons" />
        <ProductRow category="uikits" />
      </div>
    </section>
  );
}
