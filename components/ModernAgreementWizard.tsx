"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, FileText, Download, Eye, Send, Info, Shield } from "lucide-react";
import { FillableAgreementForm } from "@/components/FillableAgreementForm";

interface ModernAgreementWizardProps {
  homeownerData?: {
    user: any;
    homeownerProfile: any;
    listings: any[];
  } | null;
  currentUser?: any;
}

export function ModernAgreementWizard({ homeownerData, currentUser }: ModernAgreementWizardProps) {
  return (
    <div>
      {/* Status Indicator */}
      {homeownerData && (
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full text-primary text-sm font-medium">
            <CheckCircle className="w-4 h-4" />
            Your profile data will be automatically populated
          </div>
        </div>
      )}

      {/* Main Agreement Form */}
      <Card className="mb-10 shadow-lg border-0">
        <CardHeader className="bg-gradient-to-r from-primary/5 to-primary/10 border-b border-gray-100 rounded-t-lg">
          <div className="text-center">
            <CardTitle className="text-2xl text-gray-900 mb-2 flex items-center justify-center gap-3">
              <FileText className="h-7 w-7 text-gray-600" />
              Agreement Generator
            </CardTitle>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Complete the form below to generate your personalized Golden HomeShare agreement
            </p>
          </div>
        </CardHeader>
        <CardContent className="p-8 bg-white rounded-b-lg">
          <FillableAgreementForm
            title=""
            description=""
            homeownerData={homeownerData}
            currentUser={currentUser}
          />
        </CardContent>
      </Card>
    </div>
  );
} 