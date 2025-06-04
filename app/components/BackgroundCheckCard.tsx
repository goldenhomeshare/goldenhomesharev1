"use client";

import Link from "next/link";
import { Shield, CheckCircle, Clock, AlertCircle, ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface BackgroundCheckCardProps {
  isVerified: boolean;
  checkrReportStatus?: string | null;
  className?: string;
}

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
  };

  const statusInfo = getStatusInfo();
  const IconComponent = statusInfo.icon;

  return (
    <Link
      href={statusInfo.href}
      className={`group flex flex-col items-center text-center p-6 rounded-xl hover:bg-gray-50 transition-all duration-200 hover:scale-105 hover:shadow-lg ${className}`}
    >
      <div className={`p-4 rounded-full ${statusInfo.bgColor} group-hover:bg-white transition-colors duration-200 mb-4 relative`}>
        <IconComponent className={`w-12 h-12 ${statusInfo.color} group-hover:scale-110 transition-transform duration-200`} />
        <ExternalLink className="w-4 h-4 text-gray-400 absolute -top-1 -right-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
      </div>
      
      <div className="mb-3">
        <Badge variant={statusInfo.badge.variant} className="mb-2">
          {statusInfo.badge.text}
        </Badge>
      </div>
      
      <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-gray-700">
        {statusInfo.title}
      </h3>
      <p className="text-sm text-muted-foreground group-hover:text-gray-600 mb-4">
        {statusInfo.description}
      </p>
      
      <div className="text-sm font-medium text-blue-600 group-hover:text-blue-700 flex items-center gap-1">
        {statusInfo.actionText}
        <ExternalLink className="w-3 h-3" />
      </div>
    </Link>
  );
} 