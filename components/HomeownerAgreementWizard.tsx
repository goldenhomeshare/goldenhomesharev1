"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CheckCircle, FileText, Loader2, PenTool, Download, FileSignature } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { FillableAgreementForm, type AgreementFormData } from "@/components/FillableAgreementForm";

interface HomeownerAgreementWizardProps {
  application: any;
  homeownerData: any;
  existingAgreement?: any;
}

interface SigningStepProps {
  agreementData: AgreementFormData;
  onSign: (signature: string) => void;
  isLoading: boolean;
}

// Signing step component
function SigningStep({ agreementData, onSign, isLoading }: SigningStepProps) {
  const [signature, setSignature] = useState("");

  const handleSign = () => {
    if (!signature.trim()) {
      toast.error("Please enter your full name to sign the agreement");
      return;
    }
    onSign(signature);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <FileSignature className="w-12 h-12 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-3">Sign Agreement</h1>
          <p className="text-gray-600 max-w-xl mx-auto">
            Review and sign your agreement to proceed with the housemate arrangement
          </p>
        </div>

        <Card className="shadow-lg border-0">
          <CardHeader className="bg-gradient-to-r from-primary/5 to-primary/10 border-b border-gray-100 rounded-t-lg">
            <div className="text-center">
              <CardTitle className="text-xl text-gray-900 mb-2">
                Electronic Signature Required
              </CardTitle>
              <p className="text-gray-600 text-sm">
                Complete your electronic signature to finalize the agreement
              </p>
            </div>
          </CardHeader>
          <CardContent className="p-8 bg-white rounded-b-lg">
            <div className="space-y-6">
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <p className="text-blue-800 font-medium mb-2">Ready to Sign</p>
                <p className="text-blue-700 text-sm">
                  By signing this agreement, you confirm that all information is accurate and you agree to the terms. 
                  The housemate will be notified to review the agreement and complete their payment.
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="signature" className="text-base font-medium">
                    Electronic Signature *
                  </Label>
                  <Input
                    id="signature"
                    value={signature}
                    onChange={(e) => setSignature(e.target.value)}
                    placeholder="Type your full name"
                    className="text-lg mt-2 h-12 rounded-xl"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    By typing your name, you agree to electronically sign this document
                  </p>
                </div>

                <div className="pt-4">
                  <Button
                    onClick={handleSign}
                    disabled={isLoading || !signature.trim()}
                    className="w-full py-6 text-lg bg-primary hover:bg-primary/90 rounded-xl font-semibold"
                    size="lg"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin mr-3" />
                        Signing Agreement...
                      </>
                    ) : (
                      <>
                        <FileSignature className="h-5 w-5 mr-3" />
                        Sign & Complete Agreement
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export function HomeownerAgreementWizard({ application, homeownerData, existingAgreement }: HomeownerAgreementWizardProps) {
  const [currentStep, setCurrentStep] = useState<'form' | 'sign' | 'complete'>('form');
  const [agreementData, setAgreementData] = useState<AgreementFormData | null>(null);
  const [agreementId, setAgreementId] = useState<string | null>(existingAgreement?.id || null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // Check if we should skip to signing step
  useEffect(() => {
    if (existingAgreement && !existingAgreement.homeownerSigned) {
      // Agreement exists but homeowner hasn't signed yet - skip to signing
      setCurrentStep('sign');
      setAgreementData(getPrePopulatedFormData() as AgreementFormData);
    } else if (existingAgreement && existingAgreement.homeownerSigned && existingAgreement.housemateSigned) {
      // Both have signed - show complete step
      setCurrentStep('complete');
    }
  }, [existingAgreement]);

  // Pre-populate form data with application details (READ-ONLY DATA)
  const getPrePopulatedFormData = (): Partial<AgreementFormData> => {
    const homeownerProfile = homeownerData?.homeownerProfile;
    const user = homeownerData?.user;
    
    return {
      // SEEKER INFORMATION (from application - READ-ONLY)
      seekerName: `${application.housemate?.firstName || ''} ${application.housemate?.lastName || ''}`.trim(),
      seekerEmail: application.housemate?.email || '',
      seekerPhone: application.housemate?.housemateProfile?.phone || '',
      
      // PROPERTY INFORMATION (from listing - READ-ONLY)
      propertyAddress: application.product?.address || '',
      
      // HOMEOWNER INFORMATION (from owner data - READ-ONLY)
      hostName: `${user?.firstName || ''} ${user?.lastName || ''}`.trim(),
      hostEmail: user?.email || '',
      hostPhone: homeownerProfile?.phone || '',
      
      // AGREEMENT DATES (from application - READ-ONLY)
      moveInDate: application.moveInDate ? new Date(application.moveInDate).toISOString().split('T')[0] : '',
      endDate: application.moveOutDate ? new Date(application.moveOutDate).toISOString().split('T')[0] : '',
      effectiveDate: new Date().toISOString().split('T')[0],
      
      // FINANCIAL TERMS (from listing - READ-ONLY)
      monthlyAmount: application.product?.price?.toString() || '',
      securityDeposit: '0',
      
      // REASONABLE DEFAULTS FOR EDITABLE FIELDS
      bedroomAAccess: true,
      kitchenAccess: true,
      livingAreaAccess: true,
      petsAllowed: false,
      smokingAllowed: false,
      guestsAllowed: true,
      tvUsage: "anytime" as const,
      musicUsage: "anytime" as const,
      dishesPolicy: "rightaway" as const,
      expiredFoodPolicy: "rightaway" as const,
      additionalNotes: "",
      
      // IMPORTANT: Don't override supportRequested - let FillableAgreementForm extract it from homeownerData
      // supportRequested: undefined, // This allows the form to extract from listings
    };
  };

  const handleFormSubmit = async (formData: AgreementFormData) => {
    setIsLoading(true);
    try {
      // Check if agreement already exists first
      if (existingAgreement) {
        console.log("Agreement already exists, proceeding to sign with ID:", existingAgreement.id);
        setAgreementId(existingAgreement.id);
        setAgreementData(formData);
        
        // If homeowner hasn't signed yet, go to signing step
        if (!existingAgreement.homeownerSigned) {
          setCurrentStep('sign');
          setIsLoading(false);
          return;
        }
      }

      // Step 1: Create the agreement in the database (only if it doesn't exist)
      console.log("Creating agreement with data:", formData);
      
      const createResponse = await fetch('/api/agreements/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          applicationId: application.id,
          agreementData: formData,
        }),
      });

      if (!createResponse.ok) {
        const error = await createResponse.json();
        
        // If agreement already exists, handle gracefully by using the existing agreement
        if (createResponse.status === 409 && error.agreementId) {
          console.log("Agreement already exists, using existing ID:", error.agreementId);
          setAgreementId(error.agreementId);
          setAgreementData(formData);
          
          // Check if homeowner needs to sign
          if (error.existingAgreement && !error.existingAgreement.homeownerSigned) {
            setCurrentStep('sign');
            setIsLoading(false);
            return;
          } else if (error.existingAgreement && error.existingAgreement.homeownerSigned) {
            // Already signed, show completion
            toast.success("Agreement already exists and is signed!");
            router.push('/homeowner/applications');
            return;
          }
        }
        
        throw new Error(error.message || 'Failed to create agreement');
      }

      const { agreementId: newAgreementId } = await createResponse.json();
      console.log("Agreement created with ID:", newAgreementId);
      
      // Store the agreement ID for future use
      setAgreementId(newAgreementId);

      // Step 2: Sign the agreement as homeowner
      const signResponse = await fetch('/api/agreements/sign-homeowner', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          agreementId: newAgreementId,
          signature: formData.hostName, // Use host name as signature
        }),
      });

      if (!signResponse.ok) {
        const error = await signResponse.json();
        throw new Error(error.message || 'Failed to sign agreement');
      }

      // Step 3: Notify housemate (this happens in the sign-homeowner API)
      
      // Step 4: Redirect to a completion page or back to applications
      toast.success("Agreement created and signed! The housemate has been notified to review and complete payment.", {
        duration: 6000,
      });
      
      // Redirect back to applications page
      router.push('/homeowner/applications');
      
    } catch (error) {
      console.error("Error in agreement creation flow:", error);
      toast.error("Failed to process agreement. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleHomeownerSign = async (signature: string) => {
    if (!agreementData) {
      toast.error("No agreement data found");
      return;
    }

    if (!agreementId) {
      toast.error("No agreement ID found");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/agreements/sign-homeowner', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          agreementId: agreementId,
          signature,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to sign agreement');
      }

      toast.success("Agreement signed successfully! The housemate will be notified to review and sign.");
      setCurrentStep('complete');

    } catch (error) {
      console.error('Error signing agreement:', error);
      toast.error('Failed to sign agreement. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadAgreement = async () => {
    if (!agreementData) return;

    try {
      const response = await fetch('/api/agreements/generate-complete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(agreementData),
      });

      if (!response.ok) {
        throw new Error('Failed to generate PDF');
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

  if (currentStep === 'complete') {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-md mx-auto px-4 text-center py-12">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
            {/* Success Icon */}
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>
            
            {/* Success Message */}
            <h1 className="text-2xl font-bold text-gray-900 mb-3">
              Agreement Signed Successfully!
            </h1>
            <p className="text-gray-600 mb-6">
              The housemate has been notified and will receive a link to review and sign the agreement.
            </p>
            
            <div className="flex flex-col gap-3">
              <Button
                onClick={handleDownloadAgreement}
                variant="outline"
                className="flex items-center gap-2 rounded-xl"
              >
                <Download className="h-4 w-4" />
                Download Agreement
              </Button>
              
              <Button
                onClick={() => router.push('/homeowner/applications')}
                className="flex items-center gap-2 bg-primary hover:bg-primary/90 rounded-xl"
              >
                Back to Applications
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (currentStep === 'sign' && agreementData) {
    return (
      <SigningStep
        agreementData={agreementData}
        onSign={handleHomeownerSign}
        isLoading={isLoading}
      />
    );
  }

  // Default: Show the form
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Modern Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <FileText className="w-12 h-12 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-3">Create Housemate Agreement</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Complete the agreement form for {application.housemate?.firstName} {application.housemate?.lastName}
          </p>
        </div>

        {/* Progress Steps */}
        <div className="mb-10">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <div className="flex flex-wrap gap-3 justify-center">
              <div className="px-4 py-3 text-sm font-medium rounded-xl bg-primary text-white shadow-md">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  <span>Complete Agreement Form</span>
                </div>
              </div>
              <div className="text-gray-400">→</div>
              <div className="px-4 py-3 text-sm font-medium rounded-xl text-gray-400 bg-gray-50 border border-gray-100">
                Sign & Send to Housemate
              </div>
            </div>
          </div>
        </div>

        {/* Main Card */}
        <Card className="shadow-lg border-0">
          <CardHeader className="bg-gradient-to-r from-primary/5 to-primary/10 border-b border-gray-100 rounded-t-lg">
            <div className="text-center">
              <CardTitle className="text-2xl text-gray-900 mb-2">
                Housemate Agreement Form
              </CardTitle>
              <p className="text-gray-600">
                Complete all required fields to create the agreement. Pre-filled information cannot be modified for security.
              </p>
            </div>
          </CardHeader>
          <CardContent className="p-8 bg-white rounded-b-lg">
            <FillableAgreementForm
              title=""
              description=""
              onFormSubmit={handleFormSubmit}
              homeownerData={homeownerData}
              currentUser={homeownerData?.user}
              prePopulatedData={getPrePopulatedFormData()}
              readOnlyFields={[
                'seekerName',
                'seekerEmail', 
                'propertyAddress',
                'hostName',
                'hostEmail',
                'moveInDate',
                'endDate',
                'monthlyAmount'
              ]}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 