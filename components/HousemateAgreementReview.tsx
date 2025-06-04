"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CheckCircle, FileText, Loader2, PenTool, AlertCircle, Download, Eye } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface HousemateAgreementReviewProps {
  application: any;
  agreement: any;
}

export function HousemateAgreementReview({ application, agreement }: HousemateAgreementReviewProps) {
  const [signature, setSignature] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState<'review' | 'sign' | 'complete'>('review');
  const router = useRouter();

  const agreementData = agreement.agreementData;

  const handleProceedToSign = () => {
    setCurrentStep('sign');
  };

  const handleSign = async () => {
    if (!signature.trim()) {
      toast.error("Please enter your full name to sign the agreement");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/agreements/sign-housemate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          agreementId: agreement.id,
          signature: signature.trim(),
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to sign agreement');
      }

      toast.success("Agreement signed successfully! You can now proceed to payment.");
      
      // Redirect to billing page
      router.push(`/billing?application=${application.id}`);
      
    } catch (error) {
      console.error('Error signing agreement:', error);
      toast.error('Failed to sign agreement. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadAgreement = async () => {
    if (!agreement?.agreementData) {
      toast.error("No agreement data found");
      return;
    }

    try {
      const response = await fetch('/api/agreements/generate-complete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(agreement.agreementData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to generate PDF');
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `agreement-${application.id}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast.success('Agreement PDF downloaded successfully!');
    } catch (error) {
      console.error('Error downloading agreement:', error);
      toast.error('Failed to download agreement. Please try again.');
    }
  };

  const handlePreviewAgreement = async () => {
    if (!agreement?.agreementData) {
      toast.error("No agreement data found");
      return;
    }

    try {
      const response = await fetch('/api/agreements/generate-complete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(agreement.agreementData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to generate PDF');
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      
      // Open PDF in new tab for preview
      const newWindow = window.open(url, '_blank');
      if (!newWindow) {
        // Fallback if popup is blocked
        const link = document.createElement('a');
        link.href = url;
        link.target = '_blank';
        link.click();
      }
      
      // Clean up the URL after a delay
      setTimeout(() => URL.revokeObjectURL(url), 10000);

      toast.success('Agreement opened for preview!');
    } catch (error) {
      console.error('Error previewing agreement:', error);
      toast.error('Failed to preview agreement. Please try again.');
    }
  };

  if (currentStep === 'sign') {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PenTool className="h-5 w-5 text-blue-600" />
            Sign Agreement
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-blue-800 font-medium mb-2">Ready to Sign</p>
            <p className="text-blue-700 text-sm">
              By signing this agreement, you confirm that you have read and understood all terms and conditions, and you agree to abide by them.
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <Label htmlFor="signature">Electronic Signature *</Label>
              <Input
                id="signature"
                value={signature}
                onChange={(e) => setSignature(e.target.value)}
                placeholder="Type your full name"
                className="text-lg"
              />
              <p className="text-sm text-gray-500 mt-1">
                By typing your name, you agree to electronically sign this document
              </p>
            </div>

            <div className="flex gap-3 pt-4 border-t">
              <Button
                onClick={() => setCurrentStep('review')}
                variant="outline"
                className="flex-1"
              >
                Back to Review
              </Button>
              <Button
                onClick={handleSign}
                disabled={isLoading || !signature.trim()}
                className="flex-1 bg-green-600 hover:bg-green-700"
                size="lg"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Signing Agreement...
                  </>
                ) : (
                  <>
                    <PenTool className="h-4 w-4 mr-2" />
                    Sign Agreement
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Review step
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-blue-600" />
            Housemate Agreement Review
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5" />
              <div>
                <p className="text-amber-800 font-medium mb-1">Review Required</p>
                <p className="text-amber-700 text-sm">
                  Please carefully review this agreement before signing. Once signed, you'll be able to proceed with payment to secure your booking.
                </p>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Property Details</h3>
              <div className="space-y-1 text-sm">
                <p><span className="font-medium">Property:</span> {application.product?.name}</p>
                <p><span className="font-medium">Address:</span> {agreementData?.propertyAddress}</p>
                <p><span className="font-medium">Monthly Rate:</span> ${agreementData?.monthlyAmount}</p>
                <p><span className="font-medium">Security Deposit:</span> ${agreementData?.securityDeposit}</p>
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Agreement Dates</h3>
              <div className="space-y-1 text-sm">
                <p><span className="font-medium">Move-in Date:</span> {agreementData?.moveInDate}</p>
                <p><span className="font-medium">Agreement End:</span> {agreementData?.endDate}</p>
                <p><span className="font-medium">Effective Date:</span> {agreementData?.effectiveDate}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Agreement Details */}
      <Card>
        <CardHeader>
          <CardTitle>Agreement Terms</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Property Access */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Property Access</h3>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div>
                <p><span className="font-medium">Bedroom Access:</span> {agreementData?.bedroomAAccess ? 'Yes' : 'No'}</p>
                <p><span className="font-medium">Kitchen Access:</span> {agreementData?.kitchenAccess ? 'Yes' : 'No'}</p>
              </div>
              <div>
                <p><span className="font-medium">Living Area Access:</span> {agreementData?.livingAreaAccess ? 'Yes' : 'No'}</p>
              </div>
            </div>
          </div>

          {/* House Rules */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">House Rules</h3>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div>
                <p><span className="font-medium">Pets Allowed:</span> {agreementData?.petsAllowed ? 'Yes' : 'No'}</p>
                <p><span className="font-medium">Smoking Allowed:</span> {agreementData?.smokingAllowed ? 'Yes' : 'No'}</p>
                <p><span className="font-medium">Guests Allowed:</span> {agreementData?.guestsAllowed ? 'Yes' : 'No'}</p>
              </div>
              <div>
                <p><span className="font-medium">TV Usage:</span> {agreementData?.tvUsage}</p>
                <p><span className="font-medium">Music Usage:</span> {agreementData?.musicUsage}</p>
              </div>
            </div>
          </div>

          {/* Responsibilities */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Responsibilities</h3>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div>
                <p><span className="font-medium">Dishes Policy:</span> {agreementData?.dishesPolicy}</p>
              </div>
              <div>
                <p><span className="font-medium">Expired Food Policy:</span> {agreementData?.expiredFoodPolicy}</p>
              </div>
            </div>
          </div>

          {/* Additional Notes */}
          {agreementData?.additionalNotes && (
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Additional Notes</h3>
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-sm text-gray-700 whitespace-pre-wrap">
                  {agreementData.additionalNotes}
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Parties Information */}
      <Card>
        <CardHeader>
          <CardTitle>Agreement Parties</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Homeowner</h3>
              <div className="space-y-1 text-sm">
                <p><span className="font-medium">Name:</span> {agreementData?.hostName}</p>
                <p><span className="font-medium">Email:</span> {agreementData?.hostEmail}</p>
                {agreementData?.hostPhone && (
                  <p><span className="font-medium">Phone:</span> {agreementData.hostPhone}</p>
                )}
                <div className="flex items-center gap-2 mt-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-green-700 text-xs">Signed</span>
                </div>
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Housemate (You)</h3>
              <div className="space-y-1 text-sm">
                <p><span className="font-medium">Name:</span> {agreementData?.seekerName}</p>
                <p><span className="font-medium">Email:</span> {agreementData?.seekerEmail}</p>
                {agreementData?.seekerPhone && (
                  <p><span className="font-medium">Phone:</span> {agreementData.seekerPhone}</p>
                )}
                <div className="flex items-center gap-2 mt-2">
                  <AlertCircle className="h-4 w-4 text-amber-600" />
                  <span className="text-amber-700 text-xs">Pending Signature</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col gap-4">
            {/* Preview and Download Options */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                onClick={handlePreviewAgreement}
                variant="outline"
                size="lg"
                className="flex items-center gap-2"
              >
                <Eye className="h-4 w-4" />
                Preview Agreement PDF
              </Button>
              <Button
                onClick={handleDownloadAgreement}
                variant="outline"
                size="lg"
                className="flex items-center gap-2"
              >
                <Download className="h-4 w-4" />
                Download Agreement PDF
              </Button>
            </div>
            
            {/* Main Action */}
            <div className="flex justify-center pt-2 border-t">
              <Button
                onClick={handleProceedToSign}
                className="bg-blue-600 hover:bg-blue-700"
                size="lg"
              >
                <PenTool className="h-4 w-4 mr-2" />
                Proceed to Sign Agreement
              </Button>
            </div>
          </div>
          <p className="text-center text-sm text-gray-500 mt-3">
            After signing, you'll be redirected to complete your payment
          </p>
        </CardContent>
      </Card>
    </div>
  );
} 