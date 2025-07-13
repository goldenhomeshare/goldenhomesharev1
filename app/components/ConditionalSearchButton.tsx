"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { Search, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ConditionalSearchButtonProps {
  className?: string;
  iconSize?: number;
  showLabel?: boolean;
  labelClassName?: string;
  buttonSize?: "sm" | "lg" | "default";
}

export function ConditionalSearchButton({ 
  className = "",
  iconSize = 32,
  showLabel = false,
  labelClassName = "",
  buttonSize = "sm"
}: ConditionalSearchButtonProps) {
  const pathname = usePathname();
  
  // Determine if we're on the homes page or helpers mode
  const isHomesMode = pathname === '/homes' || pathname.startsWith('/homes/');
  
  const targetUrl = isHomesMode ? "/products/template" : "/products/icon";
  const buttonText = isHomesMode ? "Browse Homes" : "Browse Housemates";
  const IconComponent = isHomesMode ? FileText : Search;
  
  return (
    <div className={`flex flex-col items-center ${className}`}>
      <Button
        variant="ghost"
        size={buttonSize}
        asChild
        className="flex items-center justify-center p-2 h-12 w-12 rounded-full hover:bg-accent"
      >
        <Link href={targetUrl}>
          <IconComponent style={{ width: `${iconSize}px`, height: `${iconSize}px` }} />
        </Link>
      </Button>
      
      {showLabel && (
        <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1">
          <span className={`text-xs font-medium text-gray-600 whitespace-nowrap ${labelClassName}`}>
            {buttonText}
          </span>
        </div>
      )}
    </div>
  );
}

// Mobile version with different styling
export function MobileConditionalSearchButton({ 
  className = "",
  showLabel = true 
}: {
  className?: string;
  showLabel?: boolean;
}) {
  const pathname = usePathname();
  
  const isHomesMode = pathname === '/homes' || pathname.startsWith('/homes/');
  const targetUrl = isHomesMode ? "/products/template" : "/products/icon";
  const buttonText = isHomesMode ? "Browse Homes" : "Browse Housemates";
  
  return (
    <div className={`flex flex-col items-center min-w-0 flex-1 ${className}`}>
      <Button
        variant="ghost"
        size="sm"
        asChild
        className="flex items-center justify-center p-2 h-10 w-10 rounded-full hover:bg-accent"
      >
        <Link href={targetUrl}>
          <Search className="w-6 h-6" />
        </Link>
      </Button>
      {showLabel && (
        <span className="text-xs font-medium text-gray-600 mt-1 truncate">
          {buttonText}
        </span>
      )}
    </div>
  );
} 