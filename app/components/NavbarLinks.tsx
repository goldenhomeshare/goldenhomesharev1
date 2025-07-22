"use client";

import { cn } from '@/lib/utils';
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import { useState, useRef, useEffect } from "react";

export function NavbarLinks () {
    const location = usePathname(); 
    const router = useRouter();
    
    // Helper video states
    const [isVideoPlaying, setIsVideoPlaying] = useState(false);
    const [isVideoLoaded, setIsVideoLoaded] = useState(false);
    const [justNavigatedToHelper, setJustNavigatedToHelper] = useState(false);
    const [hasVideoCompleted, setHasVideoCompleted] = useState(false);
    const videoRef = useRef<HTMLVideoElement>(null);

    // House video states
    const [isHouseVideoPlaying, setIsHouseVideoPlaying] = useState(false);
    const [isHouseVideoLoaded, setIsHouseVideoLoaded] = useState(false);
    const [justNavigatedToHouse, setJustNavigatedToHouse] = useState(false);
    const [hasHouseVideoCompleted, setHasHouseVideoCompleted] = useState(false);
    const houseVideoRef = useRef<HTMLVideoElement>(null);

    // Play helper video when we navigate to helper page (if we just clicked helper)
    useEffect(() => {
        if (location === "/" && justNavigatedToHelper) {
            setIsVideoPlaying(true);
            setIsVideoLoaded(false);
            setJustNavigatedToHelper(false);
        }
        // Reset helper video state when leaving helper page
        else if (location !== "/" && isVideoPlaying) {
            setIsVideoPlaying(false);
            setIsVideoLoaded(false);
            setHasVideoCompleted(false);
        }
    }, [location, justNavigatedToHelper, isVideoPlaying]);

    // Play house video when we navigate to homes page (if we just clicked homes)
    useEffect(() => {
        if (location === "/homes" && justNavigatedToHouse) {
            setIsHouseVideoPlaying(true);
            setIsHouseVideoLoaded(false);
            setJustNavigatedToHouse(false);
        }
        // Reset house video state when leaving homes page
        else if (location !== "/homes" && isHouseVideoPlaying) {
            setIsHouseVideoPlaying(false);
            setIsHouseVideoLoaded(false);
            setHasHouseVideoCompleted(false);
        }
    }, [location, justNavigatedToHouse, isHouseVideoPlaying]);

    const handleHelperClick = (e: React.MouseEvent) => {
        e.preventDefault();
        
        // If already on helper page, do nothing
        if (location === "/") {
            return;
        }
        
        // Navigate immediately, don't wait for video states
        setJustNavigatedToHelper(true);
        // Use router.push without awaiting to ensure fast navigation
        router.push("/");
    };

    const handleHouseClick = (e: React.MouseEvent) => {
        e.preventDefault();
        
        // If already on homes page, do nothing
        if (location === "/homes") {
            return;
        }
        
        // Navigate immediately, don't wait for video states
        setJustNavigatedToHouse(true);
        // Use router.push without awaiting to ensure fast navigation
        router.push("/homes");
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

    const handleHouseVideoEnd = () => {
        // Video finished, show house post-video image if still on homes page
        if (location === "/homes") {
            setHasHouseVideoCompleted(true);
        }
        // Shorter delay for faster navigation
        setTimeout(() => {
            setIsHouseVideoPlaying(false);
            setIsHouseVideoLoaded(false);
        }, 100);
    };

    const handleVideoLoaded = () => {
        setIsVideoLoaded(true);
        if (videoRef.current) {
            videoRef.current.currentTime = 0;
            // Small delay to ensure video is ready
            setTimeout(() => {
                videoRef.current?.play().catch(console.error);
            }, 50);
        }
    };

    const handleHouseVideoLoaded = () => {
        setIsHouseVideoLoaded(true);
        if (houseVideoRef.current) {
            houseVideoRef.current.currentTime = 0;
            // Small delay to ensure video is ready
            setTimeout(() => {
                houseVideoRef.current?.play().catch(console.error);
            }, 50);
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
                          {/* Video element - no loading state, appears instantly */}
                          <video
                              ref={videoRef}
                              className="w-full h-full object-contain opacity-100"
                              autoPlay
                              muted
                              playsInline
                              preload="auto"
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
                  
                  {/* Hidden preload video for instant playback */}
                  <video
                      className="hidden"
                      preload="auto"
                      muted
                      playsInline
                  >
                      <source src="/helper-waving.mp4" type="video/mp4" />
                  </video>
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
            <button 
              onClick={handleHouseClick}
              className={cn(
                  "flex flex-col items-center transition-all duration-200 hover:text-gray-900 cursor-pointer border-none p-0 outline-none focus:outline-none"
              )}
              data-search-tab
              style={{ backgroundColor: '#f5f5f5', boxShadow: 'none' }}
            >
              <div className="flex items-center gap-6 pb-2" style={{ backgroundColor: '#f5f5f5' }}>
                <div className="relative w-20 h-20" style={{ backgroundColor: '#f5f5f5' }}>
                  {/* House Image - show when not playing video */}
                  {!isHouseVideoPlaying && (
                      hasHouseVideoCompleted && location === "/homes" ? (
                        <Image 
                          src="/updated-nav-house.png" 
                          alt="Homes"
                          fill
                          className="object-contain transition-opacity duration-200"
                          style={{ 
                            backgroundColor: '#f5f5f5',
                            transform: 'scale(1.1)',
                            transformOrigin: 'center'
                          }}
                        />
                      ) : (
                        <Image 
                          src="/updated-home-icon-min.png" 
                          alt="Homes"
                          fill
                          className="object-contain transition-opacity duration-200"
                          style={{ backgroundColor: '#f5f5f5' }}
                        />
                      )
                  )}
                  
                  {/* Preload post-video image for seamless transition */}
                  <div className="absolute inset-0 opacity-0 pointer-events-none">
                      <Image 
                        src="/updated-nav-house.png" 
                        alt="House Post Video"
                        fill
                        className="object-contain"
                        style={{ 
                          backgroundColor: '#f5f5f5',
                          transform: 'scale(1.1)',
                          transformOrigin: 'center'
                        }}
                      />
                  </div>
                
                {/* House Video Replacement - show when playing on homes page */}
                {isHouseVideoPlaying && location === "/homes" && (
                    <>
                        {/* Video element - no loading state, appears instantly */}
                        <video
                            ref={houseVideoRef}
                            className="w-full h-full object-contain opacity-100"
                            autoPlay
                            muted
                            playsInline
                            preload="auto"
                            onEnded={handleHouseVideoEnd}
                            onLoadedData={handleHouseVideoLoaded}
                            style={{ 
                              width: '88px', 
                              height: '88px', 
                              backgroundColor: '#f5f5f5',
                              borderRadius: '0px',
                              position: 'absolute',
                              top: '50%',
                              left: '50%',
                              transform: 'translate(-50%, -50%)'
                            }}
                        >
                            <source src="/house-video.mp4" type="video/mp4" />
                            Your browser does not support the video tag.
                        </video>
                        
                        {/* Subtle glow effect during video - made more subtle for gray background */}
                        <div className="absolute inset-0 -z-10 bg-gray-300/10 rounded-lg blur-sm transform scale-105"></div>
                    </>
                )}
                
                {/* Hidden preload video for instant playback */}
                <video
                    className="hidden"
                    preload="auto"
                    muted
                    playsInline
                >
                    <source src="/house-video.mp4" type="video/mp4" />
                </video>
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
          </button>
            </div>
        </div>
    );
}
