"use client";

import { cn } from '@/lib/utils';
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { useState, useEffect } from "react";

export function NavbarLinks () {
    const location = usePathname(); 
    const [brightFlash, setBrightFlash] = useState<string | null>(null);

    const handleNavClick = (path: string) => {
      setBrightFlash(path);
      setTimeout(() => {
        setBrightFlash(null);
      }, 1000); // Reset after animation
    };

    return (
    <div className="flex justify-center items-center gap-x-6">
        {/* Helpers and Homes Navigation */}
        <div className="flex items-center gap-x-16">
          {/* Helpers */}
          <Link 
            href="/" 
            className={cn(
                "group flex flex-col items-center transition-all duration-200 hover:text-gray-900"
            )}
            onClick={() => handleNavClick("/")}
          >
            <div className="flex items-center gap-6 pb-2">
              <div className={cn(
                "relative w-16 h-16 hover-vibrate",
                location === "/" && "animate-vibrate",
                brightFlash === "/" && "animate-brightness-flash"
              )} 
              style={{
                animation: location === "/" ? "vibrate 0.6s ease-in-out 1" : undefined
              }}>
                <Image 
                  src="/headr-helper.png" 
                  alt="Helper"
                  fill
                  className="object-contain"
                />
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
          </Link>

          {/* Homes */}
          <Link 
            href="/homes" 
            className={cn(
                "group flex flex-col items-center transition-all duration-200 hover:text-gray-900"
            )}
            onClick={() => handleNavClick("/homes")}
          >
            <div className="flex items-center gap-6 pb-2">
              <div className={cn(
                "relative w-16 h-16 hover-vibrate",
                location === "/homes" && "animate-vibrate",
                brightFlash === "/homes" && "animate-brightness-flash"
              )}
              style={{
                animation: location === "/homes" ? "vibrate 0.6s ease-in-out 1" : undefined
              }}>
                <Image 
                  src="/header-homes.png" 
                  alt="Homes"
                  fill
                  className="object-contain"
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
