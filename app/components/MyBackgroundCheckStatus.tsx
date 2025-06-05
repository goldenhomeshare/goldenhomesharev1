'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Shield, CheckCircle, Clock, AlertCircle, RefreshCw, User, Calendar, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";

interface BackgroundCheckData {
  user: {
    id: string;
    email: string;
    name: string;
  };
  status: {
    overall: string;
    invitation: string;
    report: string;
  };
  result: string;
  summary: {
    isComplete: boolean;
    isClear: boolean;
    isConsider: boolean;
    isPending: boolean;
    isExpired: boolean;
    message: string;
  };
  candidate?: {
    name: string;
    email: string;
    createdAt: string;
  };
  invitation?: {
    status: string;
    invitationUrl?: string;
    expiresAt?: string;
    package?: string;
  };
  report?: {
    status: string;
    result: string;
    completedAt?: string;
    package?: string;
  };
}

interface ApiResponse {
  success: boolean;
  data?: BackgroundCheckData;
  error?: string;
  message?: string;
}

export default function MyBackgroundCheckStatus() {
  const [data, setData] = useState<BackgroundCheckData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStatus = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/checkr/my-status');
      const result: ApiResponse = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || `API error: ${response.status}`);
      }
      
      if (result.success && result.data) {
        setData(result.data);
      } else {
        throw new Error(result.error || 'Failed to fetch status');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      console.error('Error fetching background check status:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
  }, []);

  const getStatusDisplay = () => {
    if (!data) return null;

    const { summary } = data;

    if (summary.isComplete && summary.isClear) {
      return {
        icon: CheckCircle,
        title: "Background Check Complete",
        subtitle: "Clear - No Issues Found",
        color: "text-green-600",
        bgColor: "bg-green-50",
        borderColor: "border-green-200",
        badge: { text: "✅ Clear", variant: "default" as const }
      };
    } else if (summary.isComplete && summary.isConsider) {
      return {
        icon: AlertCircle,
        title: "Background Check Complete",
        subtitle: "Items Found Requiring Review",
        color: "text-yellow-600",
        bgColor: "bg-yellow-50",
        borderColor: "border-yellow-200",
        badge: { text: "⚠️ Consider", variant: "secondary" as const }
      };
    } else if (summary.isPending) {
      return {
        icon: Clock,
        title: "Background Check In Progress",
        subtitle: "Processing Your Application",
        color: "text-blue-600",
        bgColor: "bg-blue-50",
        borderColor: "border-blue-200",
        badge: { text: "⏳ Pending", variant: "outline" as const }
      };
    } else if (summary.isExpired) {
      return {
        icon: AlertCircle,
        title: "Background Check Expired",
        subtitle: "Please Contact Support",
        color: "text-red-600",
        bgColor: "bg-red-50",
        borderColor: "border-red-200",
        badge: { text: "❌ Expired", variant: "destructive" as const }
      };
    } else {
      return {
        icon: Shield,
        title: "Background Check Status",
        subtitle: "Ready to Start",
        color: "text-gray-600",
        bgColor: "bg-gray-50",
        borderColor: "border-gray-200",
        badge: { text: "Not Started", variant: "outline" as const }
      };
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <div className="flex items-center gap-3">
            <RefreshCw className="w-5 h-5 animate-spin" />
            <span>Loading your background check status...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="border-red-200 bg-red-50">
        <CardContent className="py-6">
          <div className="flex items-center gap-3 mb-4">
            <AlertCircle className="w-5 h-5 text-red-600" />
            <h3 className="font-semibold text-red-900">Error Loading Status</h3>
          </div>
          <p className="text-red-700 mb-4">{error}</p>
          <Button 
            onClick={fetchStatus} 
            variant="outline" 
            size="sm"
            className="border-red-300 text-red-700 hover:bg-red-100"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Try Again
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (!data) {
    return (
      <Card>
        <CardContent className="py-6 text-center text-gray-500">
          No background check data available
        </CardContent>
      </Card>
    );
  }

  const statusDisplay = getStatusDisplay();
  if (!statusDisplay) return null;

  const IconComponent = statusDisplay.icon;

  return (
    <div className="space-y-6">
      {/* Main Status Card */}
      <Card className={cn("transition-all", statusDisplay.borderColor, statusDisplay.bgColor)}>
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-full bg-white shadow-sm">
              <IconComponent className={cn("w-8 h-8", statusDisplay.color)} />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <CardTitle className="text-xl">{statusDisplay.title}</CardTitle>
                <Badge variant={statusDisplay.badge.variant}>
                  {statusDisplay.badge.text}
                </Badge>
              </div>
              <p className="text-lg font-medium text-gray-700 mb-1">
                {statusDisplay.subtitle}
              </p>
              <p className="text-gray-600">
                {data.summary.message}
              </p>
            </div>
            <Button 
              onClick={fetchStatus}
              variant="outline"
              size="sm"
              disabled={loading}
            >
              <RefreshCw className={cn("w-4 h-4 mr-2", loading && "animate-spin")} />
              Refresh
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* User Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            Your Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-600">Name</label>
              <p className="font-medium">{data.user.name}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Email</label>
              <p className="font-medium">{data.user.email}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Status Information */}
      {(data.candidate || data.invitation || data.report) && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Background Check Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            
            {/* Candidate Information */}
            {data.candidate && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Candidate Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-gray-600">Name:</span>
                    <span className="ml-2 font-medium">{data.candidate.name}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Email:</span>
                    <span className="ml-2 font-medium">{data.candidate.email}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Created:</span>
                    <span className="ml-2 font-medium">
                      {new Date(data.candidate.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Invitation Information */}
            {data.invitation && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Invitation Status</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-gray-600">Status:</span>
                    <span className="ml-2 font-medium capitalize">{data.invitation.status}</span>
                  </div>
                  {data.invitation.package && (
                    <div>
                      <span className="text-gray-600">Package:</span>
                      <span className="ml-2 font-medium">{data.invitation.package}</span>
                    </div>
                  )}
                  {data.invitation.expiresAt && (
                    <div>
                      <span className="text-gray-600">Expires:</span>
                      <span className="ml-2 font-medium">
                        {new Date(data.invitation.expiresAt).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                </div>
                {data.invitation.invitationUrl && data.invitation.status === 'pending' && (
                  <div className="mt-3">
                    <Button
                      onClick={() => window.open(data.invitation!.invitationUrl, '_blank')}
                      className="w-full sm:w-auto"
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Complete Background Check
                    </Button>
                  </div>
                )}
              </div>
            )}

            {/* Report Information */}
            {data.report && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Report Details</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-gray-600">Status:</span>
                    <span className="ml-2 font-medium capitalize">{data.report.status}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Result:</span>
                    <span className="ml-2 font-medium capitalize">{data.report.result}</span>
                  </div>
                  {data.report.package && (
                    <div>
                      <span className="text-gray-600">Package:</span>
                      <span className="ml-2 font-medium">{data.report.package}</span>
                    </div>
                  )}
                  {data.report.completedAt && (
                    <div>
                      <span className="text-gray-600">Completed:</span>
                      <span className="ml-2 font-medium">
                        {new Date(data.report.completedAt).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}

          </CardContent>
        </Card>
      )}
    </div>
  );
} 