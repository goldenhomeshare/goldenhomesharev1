"use client";

import { useState, useEffect, useCallback } from 'react';
import { usePathname } from 'next/navigation';
import Link from "next/link";
import Image from "next/image";
import { Search } from "lucide-react";

interface ScrollResponsiveNavbarProps {
  showNavLinks: boolean;
  navLinksComponent: React.ReactNode;
  userNavigation: React.ReactNode;
}

export function ScrollResponsiveNavbar({ 
  showNavLinks, 
  navLinksComponent, 
  userNavigation 
}: ScrollResponsiveNavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [ignoreScrollEvents, setIgnoreScrollEvents] = useState(false);
  const pathname = usePathname();

  // Simple scroll handler - expanded ONLY at very top
  const handleScroll = useCallback(() => {
    // Ignore scroll events briefly after state changes to prevent bounce
    if (ignoreScrollEvents) return;
    
    const scrollTop = window.pageYOffset;
    
    // Trigger condensed on ANY scroll movement, even sub-pixel
    if (!isScrolled && scrollTop > 0) {
      setIgnoreScrollEvents(true);
      setIsScrolled(true);
      
      // Longer ignore period to fully prevent bounce
      setTimeout(() => {
        setIgnoreScrollEvents(false);
      }, 200);
    } else if (isScrolled && scrollTop <= 0) {
      // Return to expanded when at or below top (handles overscroll)
      setIgnoreScrollEvents(true);
      setIsScrolled(false);
      
      // Longer ignore period to fully prevent bounce
      setTimeout(() => {
        setIgnoreScrollEvents(false);
      }, 200);
    }
  }, [isScrolled, ignoreScrollEvents]);

  useEffect(() => {
    let ticking = false;
    let settlingTimeout: NodeJS.Timeout;
    
    const debouncedHandleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          // Clear any pending settling timeout
          clearTimeout(settlingTimeout);
          
          // Wait for scroll to settle before changing state
          settlingTimeout = setTimeout(() => {
            handleScroll();
          }, 100);
          
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', debouncedHandleScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', debouncedHandleScroll);
      clearTimeout(settlingTimeout);
    };
  }, [handleScroll]);

  // Determine which icon to show based on current page
  const getSelectedIcon = () => {
    if (pathname === '/homes' || pathname.startsWith('/homes/')) {
      return {
        src: "/header-homes.png",
        alt: "Homes"
      };
    }
    // Default to helper icon for homepage and other pages
    return {
      src: "/headr-helper.png",
      alt: "Helper"
    };
  };

  const selectedIcon = getSelectedIcon();

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl w-full mx-auto px-4 md:px-8">
        {/* Main Navbar Row */}
        <div className="flex items-center justify-between">
          {/* Logo - Positioned further left like Airbnb */}
          <div className={`flex-shrink-0 transition-all duration-500 ease-in-out pt-7 ${isScrolled ? '-mb-14' : 'pb-7'} -ml-4 md:-ml-8`}>
            <Link href="/">
              {/* Full logo for larger screens - no size changes */}
              <div className="hidden sm:flex items-center">
                <Image
                  src="/golden-logo.png"
                  alt="Golden HomeShare"
                  width={320}
                  height={96}
                  className="w-auto h-16 md:h-20 lg:h-24"
                  priority
                />
              </div>
              {/* Logo for mobile - no size changes */}
              <div className="sm:hidden flex items-center">
                <Image
                  src="/golden-logo.png"
                  alt="Golden HomeShare"
                  width={240}
                  height={72}
                  className="w-auto h-12"
                  priority
                />
              </div>
            </Link>
          </div>

          {/* Center Content Area - Same top padding, remove bottom when scrolled */}
          <div className={`flex-1 flex justify-center transition-all duration-500 ease-in-out pt-7 ${isScrolled ? '-mb-14' : 'pb-7'}`}>
            {/* Condensed Search Bar when scrolled */}
            <div className={`transition-all duration-500 ease-in-out ${
              isScrolled ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform -translate-y-2 pointer-events-none absolute'
            }`}>
              <div className="flex items-center bg-white border border-gray-300 rounded-full shadow-sm hover:shadow-md transition-shadow duration-200 max-w-lg w-full h-10">
                {/* Selected Icon */}
                <div className="flex items-center pl-3">
                  <div className="relative w-6 h-6">
                    <Image 
                      src={selectedIcon.src} 
                      alt={selectedIcon.alt}
                      fill
                      className="object-contain"
                    />
                  </div>
                  <div className="w-px h-4 bg-gray-300 mx-2"></div>
                </div>
                
                {/* Condensed Search Sections */}
                <div className="flex-1 flex items-center">
                  <div className="px-2 py-1">
                    <span className="text-sm text-gray-600">Anywhere</span>
                  </div>
                  <div className="w-px h-3 bg-gray-300"></div>
                  <div className="px-2 py-1">
                    <span className="text-sm text-gray-600">Anytime</span>
                  </div>
                  <div className="w-px h-3 bg-gray-300"></div>
                  <div className="px-2 py-1">
                    <span className="text-sm text-gray-600">Add guests</span>
                  </div>
                </div>
                
                {/* Search Button */}
                <div className="pr-1">
                  <button className="bg-rose-500 hover:bg-rose-600 text-white rounded-full p-1.5 transition-colors duration-200">
                    <Search className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>

            {/* Navigation Links (only show when not scrolled) */}
            <div className={`hidden lg:flex justify-center items-center transition-all duration-500 ease-in-out ${
              !isScrolled && showNavLinks ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform -translate-y-2 pointer-events-none absolute'
            }`}>
              {navLinksComponent}
            </div>
          </div>

          {/* User Navigation - Same top padding, remove bottom when scrolled */}
          <div className={`flex items-center gap-x-1 flex-shrink-0 transition-all duration-500 ease-in-out pt-7 ${isScrolled ? '-mb-14' : 'pb-7'}`}>
            {userNavigation}
          </div>
        </div>
        
        {/* Full Search Bar Row (only show when not scrolled) */}
        <div className={`flex justify-center transition-all duration-500 ease-in-out ${
          !isScrolled ? 'pb-4 opacity-100 transform translate-y-0' : 'pb-0 opacity-0 transform -translate-y-4 pointer-events-none'
        }`}>
          <div className="flex items-center bg-white border border-gray-300 rounded-full shadow-sm hover:shadow-md transition-shadow duration-200 max-w-3xl w-full">
            <div className="flex-1 px-6 py-3 relative">
              <div className="text-xs font-semibold text-gray-900 mb-1">Where</div>
              <input 
                type="text" 
                placeholder="Search destinations" 
                className="w-full text-sm text-gray-600 placeholder-gray-400 bg-transparent border-none outline-none"
              />
              <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-px h-8 bg-gray-300"></div>
            </div>
            <div className="flex-1 px-6 py-3 relative">
              <div className="text-xs font-semibold text-gray-900 mb-1">Check in</div>
              <input 
                type="text" 
                placeholder="Add dates" 
                className="w-full text-sm text-gray-600 placeholder-gray-400 bg-transparent border-none outline-none"
              />
              <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-px h-8 bg-gray-300"></div>
            </div>
            <div className="flex-1 px-6 py-3 relative">
              <div className="text-xs font-semibold text-gray-900 mb-1">Check out</div>
              <input 
                type="text" 
                placeholder="Add dates" 
                className="w-full text-sm text-gray-600 placeholder-gray-400 bg-transparent border-none outline-none"
              />
              <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-px h-8 bg-gray-300"></div>
            </div>
            <div className="flex-1 px-6 py-3">
              <div className="text-xs font-semibold text-gray-900 mb-1">Who</div>
              <input 
                type="text" 
                placeholder="Add guests" 
                className="w-full text-sm text-gray-600 placeholder-gray-400 bg-transparent border-none outline-none"
              />
            </div>
            <div className="pr-2">
              <button className="bg-rose-500 hover:bg-rose-600 text-white rounded-full p-4 transition-colors duration-200">
                <Search className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
} 