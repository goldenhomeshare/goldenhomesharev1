"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Shield, Loader2, CheckCircle, AlertCircle, ExternalLink } from "lucide-react";
import { useRouter } from "next/navigation";

export default function BackgroundCheckForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleInitiateCheck = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/checkr/initiate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          package: "basic_plus_criminal",
          flow: "hosted" // Use hosted flow
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to initiate background check");
      }

      // For hosted flow, redirect to Checkr's hosted page
      if (data.redirectUrl || data.invitationUrl) {
        const redirectUrl = data.redirectUrl || data.invitationUrl;
        console.log("Redirecting to Checkr hosted page:", redirectUrl);
        
        // Open in current window (recommended for hosted flow)
        window.location.href = redirectUrl;
        
        // Set success message in case redirect fails
        setSuccess("Redirecting to secure background check form...");
      } else {
        setSuccess("Background check invitation created successfully! You will receive an email with further instructions.");
      }

    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <Card className="border-green-200 bg-green-50">
        <CardContent className="p-6">
          <div className="flex items-center gap-3 text-green-800">
            <CheckCircle className="w-6 h-6" />
            <div>
              <h3 className="font-semibold">Background Check Initiated</h3>
              <p className="text-sm mt-1">{success}</p>
              {success.includes("Redirecting") && (
                <p className="text-xs mt-2">If you're not redirected automatically, check your email for the invitation link.</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3 text-red-800">
              <AlertCircle className="w-5 h-5" />
              <div>
                <p className="text-sm font-semibold">Error</p>
                <p className="text-sm">{error}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="text-center space-y-4">
        <div className="flex justify-center">
          <div className="p-4 bg-blue-100 rounded-full">
            <Shield className="w-12 h-12 text-blue-600" />
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-2">Start Your Background Check</h3>
          <p className="text-gray-600 mb-4">
            We'll redirect you to Checkr's secure platform to complete your background check. 
            This process is quick, secure, and will help build trust with other users on the platform.
          </p>
          
          {/* Background Check Package Details */}
          <div className="bg-gray-50 border rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-semibold text-gray-900">Basic Plus Criminal</h4>
              <span className="text-lg font-bold text-blue-600">$29.99*</span>
            </div>
            <div className="space-y-2 text-sm text-gray-700">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span>Global Watchlist Search</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span>National Criminal Search (Standard)</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span>Sex Offender Search</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span>SSN Trace</span>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-3">
              *Fee is paid directly to Checkr for background check processing. This fee will be refunded after your first month's rent is paid.
            </p>
          </div>
        </div>

        <Button 
          onClick={handleInitiateCheck}
          className="w-full" 
          disabled={isLoading}
          size="lg"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Creating Invitation...
            </>
          ) : (
            <>
              <Shield className="w-4 h-4 mr-2" />
              Start Background Check
            </>
          )}
        </Button>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <Shield className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-blue-800">
            <p className="font-semibold mb-1">Powered by Checkr</p>
            <p>
              Your background check will be processed by Checkr on their secure platform. 
              You'll be redirected to their site to complete the process safely.
            </p>
          </div>
        </div>
      </div>

      <p className="text-xs text-gray-500 text-center">
        By proceeding, you consent to a background check and agree to our{" "}
        <a href="/privacy" className="text-blue-600 hover:underline">Privacy Policy</a>{" "}
        and <a href="/terms" className="text-blue-600 hover:underline">Terms of Service</a>.
      </p>
    </div>
  );
} 