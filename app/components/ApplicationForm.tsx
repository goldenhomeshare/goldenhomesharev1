"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Loader2, CheckCircle, CalendarIcon } from "lucide-react";
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
  supportRequested?: any;
}

// Utility function to calculate total hours from supportRequested data
function getTotalHoursPerWeek(supportRequested?: any): number {
  if (!supportRequested) return 0;
  
  // Handle if it's already an array
  if (Array.isArray(supportRequested)) {
    let totalHours = 0;
    supportRequested.forEach((item: any) => {
      if (typeof item === 'object' && item.hoursPerWeek) {
        totalHours += item.hoursPerWeek;
      }
    });
    return totalHours;
  }
  
  return 0;
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
  applicationId,
  supportRequested
}: ApplicationFormProps) {
  const [message, setMessage] = useState("");
  const [moveInDate, setMoveInDate] = useState<Date>();
  const [moveOutDate, setMoveOutDate] = useState<Date>();
  const [isLoading, setIsLoading] = useState(false);
  const [submitted, setSubmitted] = useState(hasExistingApplication);
  const [currentCalendarMonth, setCurrentCalendarMonth] = useState(new Date());
  const [openCalendar, setOpenCalendar] = useState<boolean>(false);
  const [selectingType, setSelectingType] = useState<'moveIn' | 'moveOut'>('moveIn');

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

  // Custom calendar helper functions (matching search bar style)
  const navigateCalendar = (direction: 'prev' | 'next') => {
    const newMonth = new Date(currentCalendarMonth);
    newMonth.setMonth(currentCalendarMonth.getMonth() + (direction === 'next' ? 1 : -1));
    setCurrentCalendarMonth(newMonth);
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    
    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add all days in the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }
    
    return days;
  };

  const isDateInPast = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dateToCheck = new Date(date);
    dateToCheck.setHours(0, 0, 0, 0);
    return dateToCheck < today;
  };

  const isDateSelected = (date: Date, selectedDate: Date | undefined) => {
    if (!selectedDate) return false;
    return date.getTime() === selectedDate.getTime();
  };

  const handleDateSelect = (date: Date) => {
    if (isDateInPast(date)) return;
    
    if (selectingType === 'moveIn') {
      setMoveInDate(date);
      // Reset move-out date if it's invalid with new move-in date
      if (moveOutDate && moveOutDate <= date) {
        setMoveOutDate(undefined);
      }
      // Auto-switch to selecting move-out date
      setSelectingType('moveOut');
    } else {
      // Check move-out date constraints
      if (moveInDate) {
        if (date <= moveInDate) return;
        const minimumMoveOutDate = getMinimumMoveOutDate(moveInDate);
        if (date < minimumMoveOutDate) return;
        const maximumMoveOutDate = getMaximumMoveOutDate(moveInDate);
        if (date > maximumMoveOutDate) return;
      }
      setMoveOutDate(date);
      // Close calendar after selecting move-out date
      setOpenCalendar(false);
    }
  };

  const isDateDisabled = (date: Date, type: 'moveIn' | 'moveOut') => {
    if (isDateInPast(date)) return true;
    
    if (type === 'moveOut' && moveInDate) {
      if (date <= moveInDate) return true;
      const minimumMoveOutDate = getMinimumMoveOutDate(moveInDate);
      if (date < minimumMoveOutDate) return true;
      const maximumMoveOutDate = getMaximumMoveOutDate(moveInDate);
      if (date > maximumMoveOutDate) return true;
    }
    
    return false;
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
          <div className="text-center py-2 mb-2">
            {(() => {
              const totalHours = getTotalHoursPerWeek(supportRequested);
              if (totalHours > 0) {
                const originalPrice = price + (15 * totalHours * 4);
                                 return (
                   <div className="text-3xl font-bold text-gray-900 mb-1">
                     <span className="text-lg line-through text-gray-400 mr-2">${originalPrice.toLocaleString()}</span>
                     <span className="text-2xl font-bold underline">${price.toLocaleString()}</span>
                     <span className="text-lg font-normal text-gray-600">/mo with {totalHours}hrs support/wk</span>
                   </div>
                 );
              } else {
                return (
                  <div className="text-3xl font-bold text-gray-900 mb-1">
                    ${price.toLocaleString()}
                    <span className="text-lg font-normal text-gray-600">/month</span>
                  </div>
                );
              }
            })()}
          </div>
        )}
        

      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">


          {/* Date Selection */}
          <div className="space-y-4">
            <div>
              <Popover open={openCalendar} onOpenChange={setOpenCalendar}>
                <div className="border border-gray-300 rounded-xl overflow-hidden bg-white">
                  <div className="grid grid-cols-2">
                    {/* Move-in Date */}
                    <PopoverTrigger asChild>
                      <button
                        className="p-4 text-left hover:bg-gray-50 transition-colors border-r border-gray-300"
                        onClick={() => {
                          setSelectingType('moveIn');
                          setOpenCalendar(true);
                        }}
                      >
                        <div className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">
                          MOVE-IN
                        </div>
                        <div className="text-sm text-gray-900">
                          {moveInDate ? format(moveInDate, "MMM d") : "Add date"}
                        </div>
                      </button>
                    </PopoverTrigger>

                    {/* Move-out Date */}
                    <PopoverTrigger asChild>
                      <button
                        className="p-4 text-left hover:bg-gray-50 transition-colors"
                        onClick={() => {
                          setSelectingType('moveOut');
                          setOpenCalendar(true);
                        }}
                      >
                        <div className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">
                          MOVE-OUT
                        </div>
                        <div className="text-sm text-gray-900">
                          {moveOutDate ? format(moveOutDate, "MMM d") : "Add date"}
                        </div>
                      </button>
                    </PopoverTrigger>
                  </div>
                </div>

                <PopoverContent className="w-[800px] p-0" align="end">
                  <div className="p-6">
                    {/* Header showing current selection mode */}
                    <div className="mb-6 text-center">
                      <p className="text-sm text-gray-600">
                        {selectingType === 'moveIn' ? 'Select move-in date' : 'Select move-out date'}
                      </p>
                    </div>

                    {/* Dual Month Calendar */}
                    <div className="grid grid-cols-2 gap-8">
                      {/* Current Month */}
                      <div>
                        <div className="flex items-center justify-between mb-4">
                          <button
                            onClick={() => navigateCalendar('prev')}
                            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                          </button>
                          <h3 className="text-lg font-semibold text-gray-900">
                            {currentCalendarMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                          </h3>
                          <div className="w-8 h-8" />
                        </div>
                        <div className="grid grid-cols-7 gap-1 mb-2">
                          {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, index) => (
                            <div key={index} className="text-center text-sm font-medium text-gray-500 py-2">
                              {day}
                            </div>
                          ))}
                        </div>
                        <div className="grid grid-cols-7 gap-1">
                          {getDaysInMonth(currentCalendarMonth).map((date, index) => (
                            <div key={index} className="aspect-square">
                              {date && (
                                <button
                                  onClick={() => handleDateSelect(date)}
                                  disabled={isDateDisabled(date, selectingType)}
                                  className={`w-full h-full flex items-center justify-center text-base rounded-full transition-colors ${
                                    isDateDisabled(date, selectingType)
                                      ? 'text-gray-300 cursor-not-allowed'
                                      : isDateSelected(date, moveInDate) || isDateSelected(date, moveOutDate)
                                      ? 'bg-black text-white'
                                      : 'hover:bg-gray-100 text-gray-900'
                                  }`}
                                >
                                  {date.getDate()}
                                </button>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Next Month */}
                      <div>
                        <div className="flex items-center justify-between mb-4">
                          <div className="w-8 h-8" />
                          <h3 className="text-lg font-semibold text-gray-900">
                            {new Date(currentCalendarMonth.getFullYear(), currentCalendarMonth.getMonth() + 1).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                          </h3>
                          <button
                            onClick={() => navigateCalendar('next')}
                            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </button>
                        </div>
                        <div className="grid grid-cols-7 gap-1 mb-2">
                          {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, index) => (
                            <div key={index} className="text-center text-sm font-medium text-gray-500 py-2">
                              {day}
                            </div>
                          ))}
                        </div>
                        <div className="grid grid-cols-7 gap-1">
                          {getDaysInMonth(new Date(currentCalendarMonth.getFullYear(), currentCalendarMonth.getMonth() + 1)).map((date, index) => (
                            <div key={index} className="aspect-square">
                              {date && (
                                <button
                                  onClick={() => handleDateSelect(date)}
                                  disabled={isDateDisabled(date, selectingType)}
                                  className={`w-full h-full flex items-center justify-center text-base rounded-full transition-colors ${
                                    isDateDisabled(date, selectingType)
                                      ? 'text-gray-300 cursor-not-allowed'
                                      : isDateSelected(date, moveInDate) || isDateSelected(date, moveOutDate)
                                      ? 'bg-black text-white'
                                      : 'hover:bg-gray-100 text-gray-900'
                                  }`}
                                >
                                  {date.getDate()}
                                </button>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
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

          </div>
          
          <Button type="submit" disabled={isLoading || !moveInDate} className="w-full rounded-full py-4">
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Applying...
              </>
            ) : (
              "Apply"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
} 