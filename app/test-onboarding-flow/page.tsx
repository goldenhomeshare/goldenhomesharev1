"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Home, User, AlertTriangle } from "lucide-react";

export default function OnboardingSelectionPage() {
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
        <h1 className="text-3xl font-bold text-center mb-4">Get Started</h1>
        <p className="text-center text-muted-foreground mb-8">
          Are you looking to share your home, or searching for a place to live?
        </p>
        <div className="flex flex-col md:flex-row gap-6 w-full">
          <Link href="/test-onboarding-flow/homeowner/personal-info" className="flex-1">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
              <CardHeader className="flex flex-col items-center">
                <Home className="w-10 h-10 text-primary mb-2" />
                <CardTitle>I'm a Homeowner</CardTitle>
              </CardHeader>
              <CardContent className="text-center text-muted-foreground">
                Start the process to list your home and find a trusted housemate.
              </CardContent>
            </Card>
          </Link>
          <Link href="/test-onboarding-flow/homeseeker" className="flex-1">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
              <CardHeader className="flex flex-col items-center">
                <User className="w-10 h-10 text-primary mb-2" />
                <CardTitle>I'm Looking for a Home</CardTitle>
              </CardHeader>
              <CardContent className="text-center text-muted-foreground">
                Begin your search for a welcoming home and compatible housemates.
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  );
} 