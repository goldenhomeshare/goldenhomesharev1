"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FileText, Search, MessageCircle, Loader2 } from "lucide-react";
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
  const router = useRouter();
  const pathname = usePathname();

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

  if (!user) return null;

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-t border-gray-200 px-6 py-3 pb-safe z-50 shadow-lg">
      <div className="flex items-center justify-around max-w-sm mx-auto">
        {/* Messages */}
        <div className="flex flex-col items-center min-w-0 flex-1">
          <Button
            variant="ghost"
            size="sm"
            className="flex items-center justify-center p-3 h-12 w-12 rounded-full hover:bg-accent disabled:opacity-75 transition-all duration-200"
            onClick={handleMessagesClick}
            disabled={isNavigating}
          >
            {isNavigating ? (
              <Loader2 className="w-7 h-7 animate-spin text-blue-600" />
            ) : (
              <MessageCircle className="w-7 h-7" />
            )}
          </Button>
          <span className="text-xs font-medium text-gray-600 mt-1 truncate">Messages</span>
        </div>

        {/* Applications */}
        <div className="flex flex-col items-center min-w-0 flex-1">
          <Button
            variant="ghost"
            size="sm"
            asChild
            className="flex items-center justify-center p-3 h-12 w-12 rounded-full hover:bg-accent"
          >
            <Link href={`/${user.userType?.toLowerCase() || 'housemate'}/applications`}>
              <FileText className="w-7 h-7" />
            </Link>
          </Button>
          <span className="text-xs font-medium text-gray-600 mt-1 truncate">Applications</span>
        </div>

        {/* Browse Homes/Housemates */}
        <div className="flex flex-col items-center min-w-0 flex-1">
          <Button
            variant="ghost"
            size="sm"
            asChild
            className="flex items-center justify-center p-3 h-12 w-12 rounded-full hover:bg-accent"
          >
            <Link href={user.userType === "HOMEOWNER" ? "/products/icon" : "/products/template"}>
              <Search className="w-7 h-7" />
            </Link>
          </Button>
          <span className="text-xs font-medium text-gray-600 mt-1 truncate">
            {user.userType === "HOMEOWNER" ? "Browse Housemates" : "Browse Homes"}
          </span>
        </div>
      </div>
    </div>
  );
} 