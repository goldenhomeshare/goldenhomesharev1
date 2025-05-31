"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { SubmitButton } from "./SubmitButton";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";

interface SchedulingFormProps {
  onSubmit: (data: FormData) => void;
  title?: string;
  description?: string;
  duration?: number;
  isEditing?: boolean;
}

export function SchedulingForm({
  onSubmit,
  title = "",
  description = "",
  duration = 30,
  isEditing = false,
}: SchedulingFormProps) {
  const [selectedDuration, setSelectedDuration] = useState(String(duration));

  return (
    <div className="h-full w-full flex-1 flex flex-col items-center justify-center">
      <Card>
        <CardHeader>
          <CardTitle>
            {isEditing ? "Edit Meeting" : "Schedule a Meeting"}
          </CardTitle>
          <CardDescription>
            {isEditing 
              ? "Update your meeting details." 
              : "Create a new meeting appointment."}
          </CardDescription>
        </CardHeader>
        <form action={onSubmit}>
          <CardContent className="grid gap-y-5">
            <div className="flex flex-col gap-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                name="title"
                defaultValue={title}
                placeholder="Meeting with..."
                required
              />
            </div>

            <div className="grid gap-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                defaultValue={description}
                placeholder="What would you like to discuss?"
              />
            </div>

            <div className="grid gap-y-2">
              <Label htmlFor="duration">Duration</Label>
              <Select
                name="duration"
                value={selectedDuration}
                onValueChange={setSelectedDuration}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select the duration" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Duration</SelectLabel>
                    <SelectItem value="15">15 Minutes</SelectItem>
                    <SelectItem value="30">30 Minutes</SelectItem>
                    <SelectItem value="45">45 Minutes</SelectItem>
                    <SelectItem value="60">1 Hour</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
          <CardFooter className="w-full flex justify-between">
            <Button type="button" variant="secondary">
              Cancel
            </Button>
            <SubmitButton 
              text={isEditing ? "Update Meeting" : "Create Meeting"} 
            />
          </CardFooter>
        </form>
      </Card>
    </div>
  );
} 