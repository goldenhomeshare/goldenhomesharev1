"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

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
    const errorData = await response.json();
    const errorMessage = errorData.error === "stripe_connect_required" 
      ? "stripe_connect_required" 
      : "Failed to update application status";
    throw new Error(errorMessage);
  }

  return response.json();
}

export function ApplicationActionButtons({ applicationId }: ApplicationActionButtonsProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleApprove = async () => {
    setIsLoading(true);
    try {
      // Update the application status to APPROVED
      await updateApplicationStatus(applicationId, "APPROVED");
      
      toast.success("Application approved! Redirecting to create agreement...", {
        duration: 4000,
      });
      
      // Small delay to ensure UI updates and user sees the success message
      setTimeout(() => {
        router.push(`/homeowner/agreement/${applicationId}`);
      }, 1000);
      
    } catch (error: any) {
      console.error("Error approving application:", error);
      
      // Check if the error is due to missing Stripe Connect
      if (error.message && error.message.includes("stripe_connect_required")) {
        toast.error("You need to set up Stripe Connect before approving applications. Redirecting to billing setup...", {
          duration: 5000,
        });
        
        setTimeout(() => {
          router.push("/billing");
        }, 1500);
      } else {
        toast.error("Failed to approve application. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleReject = async () => {
    setIsLoading(true);
    try {
      await updateApplicationStatus(applicationId, "REJECTED");
      toast.success("Application rejected successfully");
      
      // Refresh the page to update the UI
      window.location.reload();
      
    } catch (error) {
      console.error("Error rejecting application:", error);
      toast.error("Failed to reject application. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex gap-2">
      <Button
        onClick={handleApprove}
        disabled={isLoading}
        className="bg-green-600 hover:bg-green-700 text-white"
        size="sm"
      >
        {isLoading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
            Approving...
          </>
        ) : (
          <>
            <CheckCircle className="h-4 w-4 mr-2" />
            Approve & Create Agreement
          </>
        )}
      </Button>
      
      <Button
        onClick={handleReject}
        disabled={isLoading}
        variant="destructive"
        size="sm"
      >
        {isLoading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
            Rejecting...
          </>
        ) : (
          <>
            <XCircle className="h-4 w-4 mr-2" />
            Reject
          </>
        )}
      </Button>
    </div>
  );
} 