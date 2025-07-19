"use client";

import { cn } from '@/lib/utils';
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import { useState, useRef, useEffect } from "react";

export function NavbarLinks () {
    const location = usePathname(); 
    const router = useRouter();
    const [isVideoPlaying, setIsVideoPlaying] = useState(false);
    const [isVideoLoaded, setIsVideoLoaded] = useState(false);
    const [justNavigatedToHelper, setJustNavigatedToHelper] = useState(false);
    const [hasVideoCompleted, setHasVideoCompleted] = useState(false);
    const videoRef = useRef<HTMLVideoElement>(null);

    // Play video when we navigate to helper page (if we just clicked helper)
    useEffect(() => {
        if (location === "/" && justNavigatedToHelper) {
            setIsVideoPlaying(true);
            setIsVideoLoaded(false);
            setJustNavigatedToHelper(false);
        }
        // Reset video state when leaving helper page
        else if (location !== "/" && isVideoPlaying) {
            setIsVideoPlaying(false);
            setIsVideoLoaded(false);
            setHasVideoCompleted(false);
        }
    }, [location, justNavigatedToHelper, isVideoPlaying]);

    const handleHelperClick = (e: React.MouseEvent) => {
        e.preventDefault();
        
        // If already on helper page, do nothing
        if (location === "/") {
            return;
        }
        
        // Navigate to helper page first, then video will play
        setJustNavigatedToHelper(true);
        router.push("/");
    };

    const handleVideoEnd = () => {
        // Video finished, show helper hand-up image if still on helper page
        if (location === "/") {
            setHasVideoCompleted(true);
        }
        // Small delay to ensure smooth transition
        setTimeout(() => {
            setIsVideoPlaying(false);
            setIsVideoLoaded(false);
        }, 50);
    };

    const handleVideoLoaded = () => {
        setIsVideoLoaded(true);
        if (videoRef.current) {
            videoRef.current.currentTime = 0;
            videoRef.current.play().catch(console.error);
        }
    };

    return (
        <div className="flex justify-center items-center gap-x-6" style={{ backgroundColor: '#f5f5f5' }}>
            {/* Helpers and Homes Navigation */}
            <div className="flex items-center gap-x-16" style={{ backgroundColor: '#f5f5f5' }}>
              {/* Helpers */}
              <button 
                onClick={handleHelperClick}
                className={cn(
                    "flex flex-col items-center transition-all duration-200 hover:text-gray-900 cursor-pointer border-none p-0 outline-none focus:outline-none"
                )}
                                  data-search-tab
                  style={{ backgroundColor: '#f5f5f5', boxShadow: 'none' }}
                >
                  <div className="flex items-center gap-6 pb-2" style={{ backgroundColor: '#f5f5f5' }}>
                    <div className="relative w-20 h-20" style={{ backgroundColor: '#f5f5f5' }}>
                      {/* Helper Image - show when not playing video */}
                      {!isVideoPlaying && (
                          <Image 
                            src={hasVideoCompleted && location === "/" ? "/helper-hand-up.png" : "/updated-helper-7-18.png"} 
                            alt="Helper"
                            fill
                            className="object-contain transition-opacity duration-200"
                            style={{ backgroundColor: '#f5f5f5' }}
                          />
                      )}
                      
                      {/* Preload hand-up image for seamless transition */}
                      <div className="absolute inset-0 opacity-0 pointer-events-none">
                          <Image 
                            src="/helper-hand-up.png" 
                            alt="Helper Hand Up"
                            fill
                            className="object-contain"
                            style={{ backgroundColor: '#f5f5f5' }}
                          />
                      </div>
                    
                    {/* Video Replacement - show when playing on helper page */}
                    {isVideoPlaying && location === "/" && (
                        <>
                            {/* Loading state */}
                            {!isVideoLoaded && (
                                <div className="absolute inset-0 flex items-center justify-center rounded-lg" style={{ backgroundColor: '#f5f5f5' }}>
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#c98f31]"></div>
                                </div>
                            )}
                            
                            {/* Video element */}
                            <video
                                ref={videoRef}
                                className={`w-full h-full object-contain transition-opacity duration-200 ${
                                    isVideoLoaded ? 'opacity-100' : 'opacity-0'
                                }`}
                                autoPlay
                                muted
                                onEnded={handleVideoEnd}
                                onLoadedData={handleVideoLoaded}
                                style={{ 
                                  width: '80px', 
                                  height: '80px', 
                                  backgroundColor: '#f5f5f5',
                                  borderRadius: '0px'
                                }}
                            >
                                <source src="/helper-waving.mp4" type="video/mp4" />
                                Your browser does not support the video tag.
                            </video>
                            
                            {/* Subtle glow effect during video - made more subtle for gray background */}
                            <div className="absolute inset-0 -z-10 bg-gray-300/10 rounded-lg blur-sm transform scale-105"></div>
                        </>
                    )}
                  </div>
                  <span className={cn(
                    "text-2xl transition-all duration-200",
                    location === "/" 
                      ? "font-semibold text-black" 
                      : "font-normal text-gray-500 hover:text-gray-700"
                  )}>
                    Helpers
                  </span>
                </div>
                {location === "/" && <div className="w-full h-0.5 bg-black rounded-full"></div>}
              </button>

              {/* Homes */}
              <Link 
                href="/homes" 
                className={cn(
                    "flex flex-col items-center transition-all duration-200 hover:text-gray-900"
                )}
                                  data-search-tab
                  style={{ backgroundColor: '#f5f5f5', boxShadow: 'none' }}
                >
                  <div className="flex items-center gap-6 pb-2" style={{ backgroundColor: '#f5f5f5' }}>
                    <div className="relative w-20 h-20" style={{ backgroundColor: '#f5f5f5' }}>
                      <Image 
                        src="/updated-home-icon-min.png" 
                        alt="Homes"
                        fill
                        className="object-contain"
                        style={{ backgroundColor: '#f5f5f5' }}
                      />
                  </div>
                  <span className={cn(
                    "text-2xl transition-all duration-200",
                    location === "/homes" 
                      ? "font-semibold text-black" 
                      : "font-normal text-gray-500 hover:text-gray-700"
                  )}>
                    Homes
                  </span>
                </div>
                {location === "/homes" && <div className="w-full h-0.5 bg-black rounded-full"></div>}
              </Link>
            </div>
        </div>
    );
}
