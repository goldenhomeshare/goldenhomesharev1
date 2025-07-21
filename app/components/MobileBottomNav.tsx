"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FileText, Search, MessageCircle, Loader2, Heart, UserCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";

interface MobileBottomNavProps {
  user: {
    email: string;
    name: string;
    userImage: string;
    userType: "HOMEOWNER" | "HOUSEMATE" | "ADMIN" | null;
  } | null;
}

export function MobileBottomNav({ user }: MobileBottomNavProps) {
  const [isNavigating, setIsNavigating] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const router = useRouter();
  const pathname = usePathname();

  // Scroll direction detection
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Only hide if scrolling down and past a minimum threshold
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        // Scrolling down - hide nav
        setIsVisible(false);
      } else if (currentScrollY < lastScrollY) {
        // Scrolling up - show nav
        setIsVisible(true);
      }
      
      setLastScrollY(currentScrollY);
    };

    // Add scroll event listener with throttling
    let timeoutId: NodeJS.Timeout;
    const throttledScroll = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(handleScroll, 10);
    };

    window.addEventListener('scroll', throttledScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', throttledScroll);
      clearTimeout(timeoutId);
    };
  }, [lastScrollY]);

  const getMessagesLink = () => {
    switch (user?.userType) {
      case "HOMEOWNER":
        return "/homeowner/messages";
      case "HOUSEMATE":
        return "/housemate/messages";
      default:
        return "/onboarding";
    }
  };

  const handleMessagesClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (isNavigating) return;
    
    setIsNavigating(true);
    
    try {
      await Promise.all([
        router.push(getMessagesLink()),
        new Promise(resolve => setTimeout(resolve, 500))
      ]);
    } catch (error) {
      console.error('Navigation error:', error);
      setIsNavigating(false);
    }
  };

  // Reset navigation state when pathname changes
  useEffect(() => {
    setIsNavigating(false);
  }, [pathname]);

  // Show bottom nav for both logged in and non-logged in users
  return (
    <div 
      className={`max-[743px]:block hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-6 pt-1 pb-[calc(env(safe-area-inset-bottom)+0.5rem)] z-40 shadow-lg transition-transform duration-300 ease-in-out ${
        isVisible ? 'translate-y-0' : 'translate-y-full'
      }`}
    >
      <div className="flex items-center justify-around w-full max-w-md mx-auto">
        {user ? (
          // Logged in user navigation
          <>
            {/* Messages */}
            <div className="flex flex-col items-center">
              <button
                className="flex flex-col items-center gap-1 py-1 disabled:opacity-75 transition-all duration-200"
                onClick={handleMessagesClick}
                disabled={isNavigating}
              >
                {isNavigating ? (
                  <Loader2 className="w-5 h-5 animate-spin text-[#c98f31]" />
                ) : (
                  <MessageCircle className={`w-5 h-5 ${pathname.includes('/messages') ? "text-[#c98f31]" : "text-gray-500"}`} />
                )}
                <span className={`text-xs ${
                  pathname.includes('/messages') ? "text-[#c98f31] font-medium" : "text-gray-600 font-normal"
                }`}>Messages</span>
              </button>
            </div>

            {/* Applications */}
            <div className="flex flex-col items-center">
              <Link href={`/${user.userType?.toLowerCase() || 'housemate'}/applications`} className="flex flex-col items-center gap-1 py-1">
                <FileText className={`w-5 h-5 ${pathname.includes('/applications') ? "text-[#c98f31]" : "text-gray-500"}`} />
                <span className={`text-xs ${
                  pathname.includes('/applications') ? "text-[#c98f31] font-medium" : "text-gray-600 font-normal"
                }`}>Applications</span>
              </Link>
            </div>

            {/* Browse Homes/Housemates */}
            <div className="flex flex-col items-center">
              <Link href={pathname === '/homes' ? "/products/template" : "/products/icon"} className="flex flex-col items-center gap-1 py-1">
                <Search className={`w-5 h-5 ${pathname.includes('/products') ? "text-[#c98f31]" : "text-gray-500"}`} />
                <span className={`text-xs ${
                  pathname.includes('/products') ? "text-[#c98f31] font-medium" : "text-gray-600 font-normal"
                }`}>Browse</span>
              </Link>
            </div>
          </>
        ) : (
          // Non-logged in user navigation
          <>
            {/* Explore */}
            <div className="flex flex-col items-center">
              <Link href="/" className="flex flex-col items-center gap-1 py-1">
                <Search className={`w-5 h-5 ${pathname === "/" ? "text-[#c98f31]" : "text-gray-500"}`} />
                <span className={`text-xs ${
                  pathname === "/" ? "text-[#c98f31] font-medium" : "text-gray-600 font-normal"
                }`}>Explore</span>
              </Link>
            </div>

            {/* Favorites */}
            <div className="flex flex-col items-center">
              <Link href="/favorites" className="flex flex-col items-center gap-1 py-1">
                <Heart className={`w-5 h-5 ${pathname === "/favorites" ? "text-[#c98f31]" : "text-gray-500"}`} />
                <span className={`text-xs ${
                  pathname === "/favorites" ? "text-[#c98f31] font-medium" : "text-gray-600 font-normal"
                }`}>Favorites</span>
              </Link>
            </div>

            {/* Login */}
            <div className="flex flex-col items-center">
              <Link href="/onboarding" className="flex flex-col items-center gap-1 py-1">
                <UserCircle className={`w-5 h-5 ${pathname === "/onboarding" || pathname.startsWith("/auth") ? "text-[#c98f31]" : "text-gray-500"}`} />
                <span className={`text-xs ${
                  pathname === "/onboarding" || pathname.startsWith("/auth") ? "text-[#c98f31] font-medium" : "text-gray-600 font-normal"
                }`}>Log in</span>
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
} 