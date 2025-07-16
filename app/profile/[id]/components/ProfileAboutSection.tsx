"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

interface ProfileAboutSectionProps {
  bio: string;
  firstName: string;
}

export function ProfileAboutSection({ bio, firstName }: ProfileAboutSectionProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  
  // Simple truncation to roughly 4 lines worth of text (about 200-250 characters)
  const truncateLength = 200;
  const shouldTruncate = bio.length > truncateLength;
  const displayText = isExpanded || !shouldTruncate ? bio : bio.substring(0, truncateLength) + "...";

  return (
    <div className="mb-8">
      <div className="text-sm sm:text-base lg:text-lg text-gray-700 leading-relaxed">
        {displayText}
        {shouldTruncate && (
          <div className="mt-3">
            <Button 
              variant="outline" 
              size="sm" 
              className="text-sm"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? 'Show less' : 'Show more'}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
} 