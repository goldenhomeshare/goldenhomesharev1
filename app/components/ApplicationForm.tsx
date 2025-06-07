"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import { Send, Loader2, CheckCircle, CalendarIcon } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface ApplicationFormProps {
  productId: string;
  productName: string;
  price?: number;
  hasExistingApplication?: boolean;
  existingApplicationStatus?: string;
  applicationId?: string;
}

async function submitApplication(
  productId: string, 
  message: string, 
  moveInDate?: Date, 
  moveOutDate?: Date
) {
  const response = await fetch("/api/applications/submit", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      productId,
      message,
      moveInDate: moveInDate?.toISOString(),
      moveOutDate: moveOutDate?.toISOString(),
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
  price,
  hasExistingApplication = false,
  existingApplicationStatus,
  applicationId
}: ApplicationFormProps) {
  const [message, setMessage] = useState("");
  const [moveInDate, setMoveInDate] = useState<Date>();
  const [moveOutDate, setMoveOutDate] = useState<Date>();
  const [isLoading, setIsLoading] = useState(false);
  const [submitted, setSubmitted] = useState(hasExistingApplication);

  // Calculate minimum move-out date (one month after move-in)
  const getMinimumMoveOutDate = (moveIn: Date) => {
    const minDate = new Date(moveIn);
    minDate.setMonth(minDate.getMonth() + 1);
    return minDate;
  };

  // Calculate maximum move-out date (one year after move-in)
  const getMaximumMoveOutDate = (moveIn: Date) => {
    const maxDate = new Date(moveIn);
    maxDate.setFullYear(maxDate.getFullYear() + 1);
    return maxDate;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!moveInDate) {
      toast.error("Please select a move-in date");
      return;
    }

    if (moveOutDate && moveOutDate <= moveInDate) {
      toast.error("Move-out date must be after move-in date");
      return;
    }

    // Check minimum stay period
    if (moveOutDate && moveInDate) {
      const minimumMoveOutDate = getMinimumMoveOutDate(moveInDate);
      if (moveOutDate < minimumMoveOutDate) {
        toast.error("Minimum stay period is one month");
        return;
      }

      // Check maximum stay period
      const maximumMoveOutDate = getMaximumMoveOutDate(moveInDate);
      if (moveOutDate > maximumMoveOutDate) {
        toast.error("Initial agreements are for up to one year. For longer stays, we'll help you renew the agreement after the first year.");
        return;
      }
    }

    try {
      setIsLoading(true);
      await submitApplication(productId, message, moveInDate, moveOutDate);
      
      toast.success("Application submitted successfully! A chat has been started with the homeowner and they will review your application.");
      setSubmitted(true);
      setMessage("");
      setMoveInDate(undefined);
      setMoveOutDate(undefined);
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
        {/* Price Display */}
        {price && (
          <div className="text-center py-2 border-b border-gray-200 mb-4">
            <div className="text-3xl font-bold text-gray-900 mb-1">
              ${price.toLocaleString()}
              <span className="text-lg font-normal text-gray-600">/month</span>
            </div>
          </div>
        )}
        
        <CardTitle className="text-lg font-normal">Apply to {productName}</CardTitle>
        <CardDescription>
          Submit an application to express your interest in this property. 
          Include your intended stay dates and a personal message to introduce yourself to the homeowner.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Stay Duration Information */}
          <div className="bg-primary/5 border border-primary/20 rounded-xl p-6">
            <h4 className="font-medium text-primary mb-3">Stay Duration Terms</h4>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                <span>Minimum stay: one month</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                <span>Initial agreement term: up to one year</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                <span>Longer stays welcome! Agreements can be renewed after the first year.</span>
              </li>
            </ul>
          </div>

          {/* Date Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="moveInDate">Move-in Date *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !moveInDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {moveInDate ? format(moveInDate, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={moveInDate}
                    onSelect={setMoveInDate}
                    disabled={(date) => date < new Date()}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label htmlFor="moveOutDate">Move-out Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !moveOutDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {moveOutDate ? format(moveOutDate, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={moveOutDate}
                    onSelect={setMoveOutDate}
                    disabled={(date) => {
                      if (date < new Date()) return true;
                      if (moveInDate) {
                        // Disable dates before or equal to move-in date
                        if (date <= moveInDate) return true;
                        // Disable dates less than one month after move-in
                        const minimumMoveOutDate = getMinimumMoveOutDate(moveInDate);
                        if (date < minimumMoveOutDate) return true;
                        // Disable dates more than one year after move-in
                        const maximumMoveOutDate = getMaximumMoveOutDate(moveInDate);
                        if (date > maximumMoveOutDate) return true;
                      }
                      return false;
                    }}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* Personal Message */}
          <div>
            <Label htmlFor="message">Personal Message</Label>
            <Textarea
              id="message"
              placeholder="Tell the homeowner about yourself, your lifestyle, and why you'd be a great housemate..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
              className="resize-none mt-2"
            />
            <p className="text-xs text-muted-foreground mt-1">
              A thoughtful message can help your application stand out.
            </p>
          </div>
          
          <Button type="submit" disabled={isLoading || !moveInDate} className="w-full">
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