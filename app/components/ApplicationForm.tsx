"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Send, Loader2, CheckCircle } from "lucide-react";
import { toast } from "sonner";

interface ApplicationFormProps {
  productId: string;
  productName: string;
  hasExistingApplication?: boolean;
  existingApplicationStatus?: string;
  applicationId?: string;
}

async function submitApplication(productId: string, message: string) {
  const response = await fetch("/api/applications/submit", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      productId,
      message,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to submit application");
  }

  return response.json();
}

export function ApplicationForm({ 
  productId, 
  productName, 
  hasExistingApplication = false,
  existingApplicationStatus,
  applicationId
}: ApplicationFormProps) {
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [submitted, setSubmitted] = useState(hasExistingApplication);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setIsLoading(true);
      await submitApplication(productId, message);
      
      toast.success("Application submitted successfully! The homeowner will review your application.");
      setSubmitted(true);
      setMessage("");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to submit application");
      console.error("Error submitting application:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (submitted) {
    return (
      <Card>
        <CardContent className="py-6">
          <div className="flex items-center justify-center space-x-2 text-green-600">
            <CheckCircle className="h-5 w-5" />
            <span className="font-medium">
              {hasExistingApplication 
                ? `Application ${existingApplicationStatus?.toLowerCase()}` 
                : "Application submitted!"
              }
            </span>
          </div>
          {hasExistingApplication && existingApplicationStatus === "PENDING" && (
            <p className="text-sm text-muted-foreground text-center mt-2">
              Your application is being reviewed by the homeowner.
            </p>
          )}
          {hasExistingApplication && existingApplicationStatus === "APPROVED" && (
            <div className="text-center mt-4">
              <p className="text-sm text-muted-foreground mb-3">
                Congratulations! Your application has been approved.
              </p>
              <Button asChild>
                <a href={`/billing?application=${applicationId}`}>
                  Complete Booking
                </a>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Apply to {productName}</CardTitle>
        <CardDescription>
          Submit an application to express your interest in this property. 
          Include a personal message to introduce yourself to the homeowner.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="message" className="block text-sm font-medium mb-2">
              Personal Message
            </label>
            <Textarea
              id="message"
              placeholder="Tell the homeowner about yourself, your lifestyle, and why you'd be a great housemate..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
              className="resize-none"
            />
            <p className="text-xs text-muted-foreground mt-1">
              A thoughtful message can help your application stand out.
            </p>
          </div>
          
          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Submitting Application...
              </>
            ) : (
              <>
                <Send className="h-4 w-4 mr-2" />
                Submit Application
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
} 