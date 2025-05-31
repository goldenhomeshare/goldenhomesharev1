"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface ApplicationActionButtonsProps {
  applicationId: string;
}

async function updateApplicationStatus(applicationId: string, status: "APPROVED" | "REJECTED") {
  const response = await fetch("/api/applications/update-status", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      applicationId,
      status,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to update application status");
  }

  return response.json();
}

export function ApplicationActionButtons({ applicationId }: ApplicationActionButtonsProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleStatusUpdate = async (status: "APPROVED" | "REJECTED") => {
    try {
      setIsLoading(true);
      await updateApplicationStatus(applicationId, status);
      
      toast.success(
        status === "APPROVED" 
          ? "Application approved! The housemate will be notified." 
          : "Application rejected."
      );
      
      // Refresh the page to update the UI
      window.location.reload();
    } catch (error) {
      toast.error("Failed to update application status. Please try again.");
      console.error("Error updating application status:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex gap-2">
      <Button
        size="sm"
        variant="destructive"
        onClick={() => handleStatusUpdate("REJECTED")}
        disabled={isLoading}
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin mr-2" />
        ) : (
          <XCircle className="h-4 w-4 mr-2" />
        )}
        Reject
      </Button>
      <Button
        size="sm"
        onClick={() => handleStatusUpdate("APPROVED")}
        disabled={isLoading}
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin mr-2" />
        ) : (
          <CheckCircle className="h-4 w-4 mr-2" />
        )}
        Approve
      </Button>
    </div>
  );
} 