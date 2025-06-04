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

      {/* Information Cards Grid */}
      <div className="grid md:grid-cols-2 gap-6 mb-10">
        {/* Usage Guide Card */}
        <Card className="shadow-lg border-0">
          <CardHeader className="bg-gray-50 border-b border-gray-100 rounded-t-lg">
            <CardTitle className="flex items-center gap-3 text-gray-900">
              <Info className="h-6 w-6 text-gray-600" />
              How to Use
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-3">
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-gray-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Fill out the complete form with your agreement details</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-gray-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Click "Preview Agreement" to review the filled PDF</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-gray-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Download your personalized agreement when ready</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-gray-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Email the agreement to all parties automatically</span>
                </li>
                {homeownerData && (
                  <li className="flex items-start gap-3 text-primary font-medium">
                    <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <span>Your homeowner profile data will be pre-filled</span>
                  </li>
                )}
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Features Card */}
        <Card className="shadow-lg border-0">
          <CardHeader className="bg-gray-50 border-b border-gray-100 rounded-t-lg">
            <CardTitle className="flex items-center gap-3 text-gray-900">
              <Shield className="h-6 w-6 text-gray-600" />
              Key Features
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-3">
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-gray-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Comprehensive form validation and error checking</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-gray-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Automated PDF generation with custom data</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-gray-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Email delivery to all parties with attachments</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-gray-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Integration with existing homeowner profiles</span>
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Action Cards */}
      <div className="grid md:grid-cols-3 gap-6">
        {/* Preview */}
        <Card className="shadow-lg border-0 hover:shadow-xl transition-shadow duration-200">
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Eye className="h-6 w-6 text-gray-600" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">Preview Agreement</h4>
            <p className="text-sm text-gray-600">Review your filled agreement before finalizing</p>
          </CardContent>
        </Card>

        {/* Download */}
        <Card className="shadow-lg border-0 hover:shadow-xl transition-shadow duration-200">
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Download className="h-6 w-6 text-gray-600" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">Download PDF</h4>
            <p className="text-sm text-gray-600">Save your personalized agreement document</p>
          </CardContent>
        </Card>

        {/* Email */}
        <Card className="shadow-lg border-0 hover:shadow-xl transition-shadow duration-200">
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Send className="h-6 w-6 text-gray-600" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">Email Agreement</h4>
            <p className="text-sm text-gray-600">Send to all parties automatically</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 