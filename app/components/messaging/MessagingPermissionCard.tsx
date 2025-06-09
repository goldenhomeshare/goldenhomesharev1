"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MessageCircle, Shield, Clock, AlertCircle, CheckCircle, Mail, RefreshCw } from "lucide-react";
import Link from "next/link";

interface MessagingPermissionCardProps {
  userId?: string;
  className?: string;
}

interface MessagingStatus {
  canMessage: boolean;
  isVerified: boolean;
  onboardingCompleted: boolean;
  reason?: string;
  needsApproval?: boolean;
}

export function MessagingPermissionCard({ userId, className = "" }: MessagingPermissionCardProps) {
  const [status, setStatus] = useState<MessagingStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchMessagingStatus = async () => {
    try {
      const response = await fetch("/api/messaging/permissions");
      if (response.ok) {
        const data = await response.json();
        setStatus(data);
      } else {
        console.error("Failed to fetch messaging status");
      }
    } catch (error) {
      console.error("Error fetching messaging status:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchMessagingStatus();
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchMessagingStatus();
  };

  const getStatusInfo = () => {
    if (!status) {
      return {
        icon: AlertCircle,
        title: "Unable to Check Status",
        description: "We couldn't verify your messaging permissions.",
        badge: { text: "Unknown", variant: "secondary" as const },
        color: "text-gray-600",
        bgColor: "bg-gray-100",
        actionText: "Try Again",
        showAction: true,
      };
    }

    if (status.canMessage) {
      return {
        icon: CheckCircle,
        title: "Messaging Available",
        description: "You can send and receive messages.",
        badge: { text: "Approved", variant: "default" as const },
        color: "text-green-600",
        bgColor: "bg-green-100",
        actionText: "Go to Messages",
        showAction: false,
      };
    }

    if (!status.onboardingCompleted) {
      return {
        icon: Clock,
        title: "Complete Your Profile",
        description: "Please complete your profile setup before messaging.",
        badge: { text: "Setup Required", variant: "secondary" as const },
        color: "text-blue-600",
        bgColor: "bg-blue-100",
        actionText: "Complete Profile",
        showAction: true,
      };
    }

    if (status.needsApproval) {
      return {
        icon: Shield,
        title: "Approval Required",
        description: status.reason || "Your account needs approval before you can send messages.",
        badge: { text: "Pending Approval", variant: "outline" as const },
        color: "text-orange-600",
        bgColor: "bg-orange-100",
        actionText: "Contact Support",
        showAction: true,
      };
    }

    return {
      icon: AlertCircle,
      title: "Messaging Restricted",
      description: status.reason || "Messaging is currently not available for your account.",
      badge: { text: "Restricted", variant: "destructive" as const },
      color: "text-red-600",
      bgColor: "bg-red-100",
      actionText: "Learn More",
      showAction: true,
    };
  };

  if (loading) {
    return (
      <Card className={`${className}`}>
        <CardContent className="p-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gray-100 rounded-full animate-pulse"></div>
            <div className="flex-1">
              <div className="h-4 bg-gray-100 rounded animate-pulse mb-2"></div>
              <div className="h-3 bg-gray-100 rounded animate-pulse w-2/3"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const statusInfo = getStatusInfo();
  const IconComponent = statusInfo.icon;

  return (
    <Card className={`border border-gray-200 ${className}`}>
      <CardHeader className="pb-3">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 ${statusInfo.bgColor} rounded-full flex items-center justify-center`}>
            <IconComponent className={`w-5 h-5 ${statusInfo.color}`} />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <CardTitle className="text-lg">{statusInfo.title}</CardTitle>
              <Badge variant={statusInfo.badge.variant}>{statusInfo.badge.text}</Badge>
            </div>
            <p className="text-sm text-gray-600">{statusInfo.description}</p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex-shrink-0"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </CardHeader>

      {statusInfo.showAction && (
        <CardContent className="pt-0">
          <div className="flex gap-2">
            {!status?.onboardingCompleted ? (
              <Button asChild className="flex-1">
                <Link href="/onboarding">
                  {statusInfo.actionText}
                </Link>
              </Button>
            ) : status?.needsApproval ? (
              <>
                <Button asChild variant="outline" className="flex-1">
                  <Link href="/background-check">
                    <Shield className="w-4 h-4 mr-2" />
                    Background Check
                  </Link>
                </Button>
                <Button asChild className="flex-1">
                  <a href="mailto:support@goldenhomeshare.com?subject=Messaging Approval Request">
                    <Mail className="w-4 h-4 mr-2" />
                    Contact Support
                  </a>
                </Button>
              </>
            ) : (
              <Button onClick={handleRefresh} className="flex-1">
                {statusInfo.actionText}
              </Button>
            )}
          </div>
        </CardContent>
      )}
    </Card>
  );
} 