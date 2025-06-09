"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Shield, CheckCircle, Clock, AlertCircle, Mail, Phone } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface BackgroundCheckCardProps {
  isVerified: boolean;
  checkrReportStatus?: string;
  className?: string;
}

// Feature flag for Checkr API integration
const CHECKR_API_ENABLED = process.env.NEXT_PUBLIC_CHECKR_API_ENABLED === 'true';

export default function BackgroundCheckCard({ 
  isVerified, 
  checkrReportStatus, 
  className = "" 
}: BackgroundCheckCardProps) {
  
  const getStatusInfo = () => {
    if (isVerified && checkrReportStatus === "clear") {
      return {
        icon: CheckCircle,
        title: "Background Check Complete",
        description: "Your background check has been verified",
        badge: { text: "Verified", variant: "default" as const },
        color: "text-green-600",
        bgColor: "bg-green-100",
        actionText: "View Status",
        href: "/background-check"
      };
    }
    
    if (checkrReportStatus === "pending" || checkrReportStatus === "in_progress") {
      return {
        icon: Clock,
        title: "Background Check in Progress",
        description: "Your background check is being processed",
        badge: { text: "In Progress", variant: "secondary" as const },
        color: "text-orange-600",
        bgColor: "bg-orange-100",
        actionText: "Check Status",
        href: "/background-check"
      };
    }
    
    if (checkrReportStatus === "consider" || checkrReportStatus === "disputed") {
      return {
        icon: AlertCircle,
        title: "Background Check Needs Review",
        description: "Please review your background check results",
        badge: { text: "Needs Review", variant: "destructive" as const },
        color: "text-yellow-600",
        bgColor: "bg-yellow-100",
        actionText: "View Details",
        href: "/background-check"
      };
    }
    
    // Default - no background check initiated
    if (CHECKR_API_ENABLED) {
      return {
        icon: Shield,
        title: "Complete Background Check",
        description: "Increase trust by completing your background verification",
        badge: { text: "Not Started", variant: "outline" as const },
        color: "text-blue-600",
        bgColor: "bg-blue-100",
        actionText: "Start Verification",
        href: "/background-check"
      };
    } else {
      return {
        icon: Shield,
        title: "Contact Us for Background Check",
        description: "Contact us to receive a secure verification link",
        badge: { text: "Contact Required", variant: "outline" as const },
        color: "text-blue-600",
        bgColor: "bg-blue-100",
        actionText: "Contact Us",
        href: "/background-check"
      };
    }
  };

  const statusInfo = getStatusInfo();
  const IconComponent = statusInfo.icon;

  return (
    <Card className={cn("w-full", className)}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className={cn("p-2 rounded-full", statusInfo.bgColor)}>
              <IconComponent className={cn("h-5 w-5", statusInfo.color)} />
            </div>
            <div>
              <CardTitle className="text-base font-semibold">
                {statusInfo.title}
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                {statusInfo.description}
              </p>
            </div>
          </div>
          <Badge variant={statusInfo.badge.variant}>
            {statusInfo.badge.text}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        {!CHECKR_API_ENABLED && !isVerified && (
          <div className="mb-4 space-y-3">
            <div className="flex gap-2">
              <a 
                href="mailto:support@goldenhomeshare.com?subject=Background Check Request"
                className="flex-1 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg p-3 text-center transition-colors group"
              >
                <Mail className="w-4 h-4 text-blue-600 mx-auto mb-1" />
                <p className="text-xs text-blue-700 font-medium">Email Us</p>
              </a>
                             <a 
                 href="tel:+1-816-433-2979"
                 className="flex-1 bg-green-50 hover:bg-green-100 border border-green-200 rounded-lg p-3 text-center transition-colors group"
               >
                 <Phone className="w-4 h-4 text-green-600 mx-auto mb-1" />
                 <p className="text-xs text-green-700 font-medium">Call Us</p>
               </a>
            </div>
          </div>
        )}
        
        <Link href={statusInfo.href}>
          <Button className="w-full" variant="default">
            {statusInfo.actionText}
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
} 