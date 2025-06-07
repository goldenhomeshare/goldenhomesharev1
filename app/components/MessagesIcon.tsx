"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, Loader2 } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import { isMessagingPollingEnabled, getMessagingPollingInterval } from '@/app/lib/polling-config';

interface MessagesIconProps {
  userType?: "HOMEOWNER" | "HOUSEMATE" | "ADMIN" | null;
}

export function MessagesIcon({ userType }: MessagesIconProps) {
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isNavigating, setIsNavigating] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const getMessagesLink = () => {
    switch (userType) {
      case "HOMEOWNER":
        return "/homeowner/messages";
      case "HOUSEMATE":
        return "/housemate/messages";
      default:
        return "/onboarding";
    }
  };

  const fetchUnreadCount = async () => {
    if (!userType || userType === "ADMIN") {
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/messages/unread-count');
      if (response.ok) {
        const data = await response.json();
        setUnreadCount(data.count || 0);
      }
    } catch (error) {
      console.error('Error fetching unread count:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (isNavigating) return; // Prevent double clicks
    
    setIsNavigating(true);
    
    try {
      // Add a minimum loading duration to ensure visibility
      const [navigationResult] = await Promise.all([
        router.push(getMessagesLink()),
        new Promise(resolve => setTimeout(resolve, 500)) // Minimum 500ms loading
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

  useEffect(() => {
    fetchUnreadCount();
    
    // Conditionally set up polling based on configuration
    let interval: NodeJS.Timeout | undefined;
    
    if (isMessagingPollingEnabled()) {
      const pollingInterval = getMessagingPollingInterval();
      interval = setInterval(fetchUnreadCount, pollingInterval);
    }
    
    // Always refresh when page becomes visible (user returns from chat)
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        fetchUnreadCount();
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      if (interval) {
        clearInterval(interval);
      }
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [userType]);

  // Don't render if user doesn't have a valid user type
  if (!userType || userType === "ADMIN") {
    return null;
  }

  return (
    <Button 
      variant="ghost" 
      className="relative hover:bg-transparent flex items-center justify-center disabled:opacity-75 transition-all duration-200" 
      style={{ padding: '8px', width: '48px', height: '48px' }}
      onClick={handleClick}
      disabled={isNavigating}
    >
      <div className="relative flex items-center justify-center">
        {isNavigating ? (
          <div className="flex items-center justify-center">
            <Loader2 
              className="animate-spin text-blue-600" 
              style={{ width: '32px', height: '32px' }}
            />
          </div>
        ) : (
          <MessageCircle 
            className={`transition-all duration-200 ${isNavigating ? 'opacity-0' : 'opacity-100'}`}
            style={{ width: '32px', height: '32px' }}
          />
        )}
        {!isLoading && !isNavigating && unreadCount > 0 && (
          <div 
            className="absolute bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center min-w-[18px] h-[18px] px-1"
            style={{
              top: '-6px',
              right: '-6px',
              fontSize: '11px',
              lineHeight: '1'
            }}
          >
            {unreadCount > 99 ? "99+" : unreadCount}
          </div>
        )}
      </div>
    </Button>
  );
} 