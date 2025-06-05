"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { RefreshCw, CheckCircle, AlertCircle, Clock } from "lucide-react";
import { useRouter } from "next/navigation";

export default function RefreshStatusButton() {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [messageType, setMessageType] = useState<'success' | 'error' | 'info'>('info');
  const router = useRouter();

  const handleRefresh = async () => {
    setIsLoading(true);
    setMessage(null);

    try {
      console.log("🔄 Starting background check status sync...");

      const response = await fetch("/api/checkr/status-sync", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      console.log("📊 Status sync result:", data);

      if (data.isVerified && data.updated) {
        setMessage("✅ Background check status refreshed and verified!");
        setMessageType('success');
        
        setTimeout(() => {
          router.refresh();
        }, 2000);
        return;
      }

      if (data.isVerified && !data.updated) {
        setMessage("✅ Status confirmed - you are verified!");
        setMessageType('success');
        
        setTimeout(() => {
          router.refresh();
        }, 1500);
        return;
      }

      if (data.status === 'pending' || data.status === 'in_progress') {
        setMessage("🔄 Background check still in progress. We'll keep checking automatically.");
        setMessageType('info');
      } else if (data.status === 'none') {
        setMessage("ℹ️ No background check found. Use the form below to start a new one.");
        setMessageType('info');
      } else {
        setMessage(`ℹ️ Status: ${data.status}. Synced from Checkr successfully.`);
        setMessageType('info');
      }

    } catch (error) {
      console.error("❌ Error syncing status:", error);
      setMessage("❌ Error checking status. Please try again or contact support.");
      setMessageType('error');
    } finally {
      setIsLoading(false);
    }
  };

  const getMessageIcon = () => {
    switch (messageType) {
      case 'success':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'error':
        return <AlertCircle className="w-4 h-4 text-red-600" />;
      default:
        return <Clock className="w-4 h-4 text-blue-600" />;
    }
  };

  const getMessageColor = () => {
    switch (messageType) {
      case 'success':
        return 'text-green-600';
      case 'error':
        return 'text-red-600';
      default:
        return 'text-blue-600';
    }
  };

  return (
    <div className="space-y-2">
      <Button 
        onClick={handleRefresh}
        variant="outline" 
        size="sm"
        disabled={isLoading}
        className="flex items-center gap-2"
      >
        <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
        {isLoading ? "Checking..." : "Check Status"}
      </Button>
      {message && (
        <div className={`flex items-center gap-2 text-sm ${getMessageColor()} max-w-xs`}>
          {getMessageIcon()}
          <span className="leading-tight">{message}</span>
        </div>
      )}
    </div>
  );
} 