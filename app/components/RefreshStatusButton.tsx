"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { RefreshCw, CheckCircle } from "lucide-react";
import { useRouter } from "next/navigation";

export default function RefreshStatusButton() {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const router = useRouter();

  const handleRefresh = async () => {
    setIsLoading(true);
    setMessage(null);

    try {
      const response = await fetch("/api/checkr/verify-status", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to check status");
      }

      if (data.isVerified) {
        setMessage("✅ Verification status updated!");
        // Refresh the page to show updated status
        setTimeout(() => {
          router.refresh();
        }, 1000);
      } else {
        setMessage("No completed background check found yet.");
      }

    } catch (error) {
      setMessage("❌ Error checking status. Please try again.");
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
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
        <p className={`text-sm ${message.includes('✅') ? 'text-green-600' : message.includes('❌') ? 'text-red-600' : 'text-gray-600'}`}>
          {message}
        </p>
      )}
    </div>
  );
} 