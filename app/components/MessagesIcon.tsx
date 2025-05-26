"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MessageCircle } from "lucide-react";

interface MessagesIconProps {
  userType?: "HOMEOWNER" | "HOUSEMATE" | "ADMIN" | null;
}

export function MessagesIcon({ userType }: MessagesIconProps) {
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

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

  useEffect(() => {
    fetchUnreadCount();
    
    // Poll for updates every 30 seconds
    const interval = setInterval(fetchUnreadCount, 30000);
    
    // Refresh when page becomes visible (user returns from chat)
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        fetchUnreadCount();
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      clearInterval(interval);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [userType]);

  // Don't render if user doesn't have a valid user type
  if (!userType || userType === "ADMIN") {
    return null;
  }

  return (
    <Button variant="ghost" size="sm" asChild className="relative hover:bg-muted flex flex-col items-center gap-1 h-auto py-2">
      <Link href={getMessagesLink()}>
        <div className="relative">
          <MessageCircle className="h-12 w-12" />
          {!isLoading && unreadCount > 0 && (
            <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center min-w-[1.25rem] border-2 border-white">
              {unreadCount > 9 ? "9+" : unreadCount}
            </div>
          )}
        </div>
        <span className="text-xs font-medium">Messages</span>
      </Link>
    </Button>
  );
} 