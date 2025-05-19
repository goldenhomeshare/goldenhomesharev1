"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { AlertTriangle } from "lucide-react";

export default function HomeseekerOnboardingPage() {
  const [form, setForm] = useState({
    name: "",
    age: "",
    gender: "",
    occupation: "",
    interests: "",
    pets: "",
    smoking: "",
    schedule: "",
    about: "",
  });

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // No-op: This is a test flow, data is not saved
    alert("This is a test flow. Data will not be saved.");
  }

  return (
    <div className="min-h-screen bg-muted flex flex-col items-center justify-start py-12">
      <div className="bg-amber-50 border-l-4 border-amber-400 p-4 mb-8 rounded-md w-full max-w-xl">
        <div className="flex">
          <div className="flex-shrink-0">
            <AlertTriangle className="h-5 w-5 text-amber-400" aria-hidden="true" />
          </div>
          <div className="ml-3">
            <p className="text-sm text-amber-700">
              <span className="font-medium">Testing Mode:</span> This onboarding flow is currently being tested. Any information entered is only for experience evaluation and will not be saved.
            </p>
          </div>
        </div>
      </div>
      <div className="max-w-xl w-full flex flex-col gap-8 items-center">
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Housemate Onboarding</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
              <div>
                <Label htmlFor="name">Name</Label>
                <Input id="name" name="name" value={form.name} onChange={handleChange} required />
              </div>
              <div>
                <Label htmlFor="age">Age</Label>
                <Input id="age" name="age" type="number" value={form.age} onChange={handleChange} required />
              </div>
              <div>
                <Label htmlFor="gender">Gender</Label>
                <Input id="gender" name="gender" value={form.gender} onChange={handleChange} required />
              </div>
              <div>
                <Label htmlFor="occupation">Occupation</Label>
                <Input id="occupation" name="occupation" value={form.occupation} onChange={handleChange} />
              </div>
              <div>
                <Label htmlFor="interests">Interests</Label>
                <Input id="interests" name="interests" value={form.interests} onChange={handleChange} />
              </div>
              <div>
                <Label htmlFor="pets">Do you have pets?</Label>
                <Input id="pets" name="pets" value={form.pets} onChange={handleChange} />
              </div>
              <div>
                <Label htmlFor="smoking">Do you smoke?</Label>
                <Input id="smoking" name="smoking" value={form.smoking} onChange={handleChange} />
              </div>
              <div>
                <Label htmlFor="schedule">Typical Schedule</Label>
                <Input id="schedule" name="schedule" value={form.schedule} onChange={handleChange} />
              </div>
              <div>
                <Label htmlFor="about">Tell us about yourself</Label>
                <textarea
                  id="about"
                  name="about"
                  value={form.about}
                  onChange={handleChange}
                  className="w-full border rounded p-2 min-h-[80px]"
                />
              </div>
              <Button type="submit" className="mt-4 w-full">Submit (Test Only)</Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 