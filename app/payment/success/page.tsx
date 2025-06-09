"use client";

import { useEffect, useState } from "react";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation";
import prisma from "../../lib/db";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Home, Calendar, MapPin, Phone, Mail, Clock, Users, Shield, FileText, MessageCircle, CreditCard, ChevronDown, X } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { CreateCustomerPortalSession } from "../../actions";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";

// Force this page to be dynamic
export const dynamic = 'force-dynamic';

interface Application {
  id: string;
  moveInDate: Date | null;
  status: string;
  product: {
    id: string;
    name: string;
    price: number;
    address?: string;
    houseRules?: any;
    amenities?: any;
    User: {
      id: string;
      firstName: string;
      homeownerProfile?: any;
    };
  };
  agreement?: {
    id: string;
    pdfUrl?: string;
  } | null;
  Subscription?: {
    status: string;
  } | null;
}

// PDF Modal Component
function PDFModal({ isOpen, onClose, agreementId, applicationId }: { 
  isOpen: boolean; 
  onClose: () => void; 
  agreementId?: string;
  applicationId: string;
}) {
  const [loading, setLoading] = useState(false);
  const [actualPdfUrl, setActualPdfUrl] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && !actualPdfUrl) {
      setLoading(true);
      // Use agreement ID directly if available
      if (agreementId) {
        setActualPdfUrl(`/api/agreements/${agreementId}/pdf`);
        setLoading(false);
      } else {
        // Fetch application to get agreement ID
        fetch(`/api/applications/${applicationId}`)
          .then(res => res.json())
          .then(data => {
            if (data.agreement?.id) {
              // Use the agreement ID to fetch the PDF
              setActualPdfUrl(`/api/agreements/${data.agreement.id}/pdf`);
            }
            setLoading(false);
          })
          .catch(err => {
            console.error('Error fetching PDF:', err);
            setLoading(false);
          });
      }
    }
  }, [isOpen, agreementId, applicationId, actualPdfUrl]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg w-full max-w-4xl h-[80vh] max-h-[600px] flex flex-col">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold">Housing Agreement</h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Modal Content */}
        <div className="flex-1 p-4">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-gray-600">Loading agreement...</p>
              </div>
            </div>
          ) : actualPdfUrl ? (
            <iframe
              src={actualPdfUrl}
              className="w-full h-full border-0 rounded"
              title="Housing Agreement PDF"
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Agreement not available</p>
                <Button variant="outline" className="mt-4" asChild>
                  <Link href={`/housemate/agreement/${applicationId}`}>
                    View on separate page
                  </Link>
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="border-t border-gray-200 p-4">
          <div className="flex justify-between items-center">
            <Button variant="outline" asChild>
              <Link href={`/housemate/agreement/${applicationId}`} target="_blank">
                Open in new tab
              </Link>
            </Button>
            <Button onClick={onClose}>Close</Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PaymentSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ application?: string }>;
}) {
  const { user } = useKindeBrowserClient();
  const [application, setApplication] = useState<Application | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showPDFModal, setShowPDFModal] = useState(false);
  const [resolvedSearchParams, setResolvedSearchParams] = useState<{ application?: string }>({});

  useEffect(() => {
    searchParams.then(params => {
      setResolvedSearchParams(params);
    });
  }, [searchParams]);

  useEffect(() => {
    if (!user) {
      window.location.href = "/api/auth/login";
      return;
    }

    const applicationId = resolvedSearchParams.application;
    if (!applicationId) {
      setError("No application specified");
      setLoading(false);
      return;
    }

    // Fetch application data
    fetch(`/api/applications/${applicationId}`)
      .then(res => {
        if (!res.ok) {
          throw new Error('Application not found');
        }
        return res.json();
      })
      .then(data => {
        setApplication(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, [user, resolvedSearchParams]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (error || !resolvedSearchParams.application) {
    return (
      <section className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <Card className="shadow-lg border-0 w-full max-w-md">
          <CardHeader className="bg-gradient-to-r from-primary/5 to-primary/10 border-b border-gray-100 rounded-t-lg text-center p-4 sm:p-6">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="w-6 h-6 sm:w-8 sm:h-8 text-red-600" />
            </div>
            <CardTitle className="text-lg sm:text-xl text-gray-900">
              {error === "No application specified" ? "Invalid Request" : "Application Not Found"}
            </CardTitle>
            <CardDescription className="text-sm sm:text-base text-gray-600">
              {error === "No application specified" 
                ? "No application specified. Please try again."
                : "The application could not be found or you don't have access to it."
              }
            </CardDescription>
          </CardHeader>
          <CardContent className="p-4 sm:p-6">
            <Button className="w-full min-h-[44px]" asChild>
              <Link href="/housemate/applications">View Applications</Link>
            </Button>
          </CardContent>
        </Card>
      </section>
    );
  }

  if (!application) {
    return (
      <section className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <Card className="shadow-lg border-0 w-full max-w-md">
          <CardHeader className="bg-gradient-to-r from-primary/5 to-primary/10 border-b border-gray-100 rounded-t-lg text-center p-4 sm:p-6">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="w-6 h-6 sm:w-8 sm:h-8 text-red-600" />
            </div>
            <CardTitle className="text-lg sm:text-xl text-gray-900">Application Not Found</CardTitle>
            <CardDescription className="text-sm sm:text-base text-gray-600">
              The application could not be found or you don't have access to it.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-4 sm:p-6">
            <Button className="w-full min-h-[44px]" asChild>
              <Link href="/housemate/applications">View Applications</Link>
            </Button>
          </CardContent>
        </Card>
      </section>
    );
  }

  const hasActiveSubscription = application.Subscription && application.Subscription.status === "ACTIVE";
  const product = application.product;
  const host = product.User;
  const agreement = application.agreement;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header - Sticky */}
      <div className="sm:hidden sticky top-0 z-10 bg-white border-b border-gray-200 p-4">
        <div className="flex items-center justify-center">
          <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
            <Check className="w-5 h-5 text-green-600" />
          </div>
          <h1 className="text-lg font-bold text-gray-900">Payment Success!</h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        {/* Desktop Header - Hidden on mobile */}
        <div className="hidden sm:block text-center mb-8">
          <div className="w-12 h-12 lg:w-16 lg:h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="w-8 h-8 lg:w-10 lg:h-10 text-green-600" />
          </div>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">Payment Successful!</h1>
          <p className="text-base lg:text-lg text-gray-600">
            Welcome to your new home! Here are your move-in details and next steps.
          </p>
        </div>

        {/* Mobile Success Message */}
        <div className="sm:hidden mb-6">
          <Card className="shadow-lg border-0 w-full">
            <CardContent className="p-4 text-center">
              <p className="text-sm text-gray-600 mb-4">
                Welcome to your new home! Here are your move-in details and next steps.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Payment Status - Full width on mobile, part of grid on desktop */}
        <div className="mb-6">
          <Card className="shadow-lg border-0 w-full hover:shadow-xl transition-shadow">
            <CardHeader className="bg-gradient-to-r from-primary/5 to-primary/10 border-b border-gray-100 rounded-t-lg p-4 sm:p-6">
              <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                <Shield className="h-5 w-5 sm:h-6 sm:w-6 text-green-600" />
                Payment Confirmation
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 sm:p-6">
              <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
                <div>
                  <p className="font-medium text-sm sm:text-base">Subscription Status</p>
                  <p className="text-xs sm:text-sm text-gray-600">Monthly payment for {product.name}</p>
                </div>
                <Badge className="bg-green-100 text-green-800 self-start sm:self-auto">
                  {hasActiveSubscription ? "Active" : "Processing"}
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Subscription Management - Mobile stack, Desktop grid */}
        {hasActiveSubscription && (
          <div className="mb-6">
            <Card className="shadow-lg border-0 w-full hover:shadow-xl transition-shadow">
              <CardHeader className="bg-gradient-to-r from-primary/5 to-primary/10 border-b border-gray-100 rounded-t-lg p-4 sm:p-6">
                <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                  <CreditCard className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
                  Subscription Management
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 sm:p-6">
                <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
                  <div className="flex-1">
                    <p className="font-medium text-sm sm:text-base">Manage Your Subscription</p>
                    <p className="text-xs sm:text-sm text-gray-600">Update payment methods, view invoices, or make changes to your subscription</p>
                  </div>
                  <form action={CreateCustomerPortalSession} className="w-full sm:w-auto">
                    <Button variant="outline" type="submit" className="w-full sm:w-auto min-h-[44px]">
                      <CreditCard className="h-4 w-4 mr-2" />
                      Manage
                    </Button>
                  </form>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Main Content - Mobile stack, Desktop grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 mb-6">
          {/* Property Details - Takes full width on mobile, 2 cols on desktop */}
          <div className="lg:col-span-2">
            <Card className="shadow-lg border-0 w-full hover:shadow-xl transition-shadow">
              <CardHeader className="bg-gradient-to-r from-primary/5 to-primary/10 border-b border-gray-100 rounded-t-lg p-4 sm:p-6">
                <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                  <Home className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                  Property Information
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 sm:p-6 lg:p-8 space-y-4 sm:space-y-6">
                <div>
                  <h3 className="font-medium text-base sm:text-lg">{product.name}</h3>
                  <p className="text-sm sm:text-base text-gray-600 flex items-center gap-2 mt-2">
                    <MapPin className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
                    {product.address || "Address will be provided by your host"}
                  </p>
                </div>
                
                <div>
                  <p className="font-medium text-sm sm:text-base">Monthly Contribution</p>
                  <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-green-600">${product.price}</p>
                </div>

                {application.moveInDate && (
                  <div>
                    <p className="font-medium flex items-center gap-2 text-sm sm:text-base">
                      <Calendar className="h-4 w-4 sm:h-5 sm:w-5" />
                      Move-in Date
                    </p>
                    <p className="text-base sm:text-lg">{format(new Date(application.moveInDate), "EEEE, MMMM do, yyyy")}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Host Contact - Full width on mobile, 1 col on desktop */}
          <div className="lg:col-span-1">
            <Card className="shadow-lg border-0 w-full hover:shadow-xl transition-shadow">
              <CardHeader className="bg-gradient-to-r from-primary/5 to-primary/10 border-b border-gray-100 rounded-t-lg p-4 sm:p-6">
                <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                  <Users className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                  Your Host
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 sm:p-6 space-y-4">
                <div>
                  <h3 className="font-medium text-base sm:text-lg">{host?.firstName}</h3>
                  <p className="text-xs sm:text-sm text-gray-600">Property Owner</p>
                </div>
                
                <div className="space-y-3">
                  <Button variant="outline" className="w-full justify-start min-h-[44px]" asChild>
                    <Link href={`/housemate/messages?homeowner=${host?.id}&product=${product.id}`}>
                      <MessageCircle className="h-4 w-4 mr-2" />
                      Message Your Host
                    </Link>
                  </Button>
                  
                  <Button variant="outline" className="w-full justify-start min-h-[44px]" asChild>
                    <Link href={`/product/${product.id}`}>
                      <Home className="h-4 w-4 mr-2" />
                      View Property Details
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Move-in Instructions - Collapsible on mobile, expanded on desktop */}
        <Card className="shadow-lg border-0 w-full hover:shadow-xl transition-shadow mb-6">
          <CardHeader className="bg-gradient-to-r from-primary/5 to-primary/10 border-b border-gray-100 rounded-t-lg p-4 sm:p-6">
            <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
              <Clock className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
              Move-in Instructions & Next Steps
              <ChevronDown className="h-4 w-4 sm:hidden ml-auto" />
            </CardTitle>
            <CardDescription className="hidden sm:block text-sm sm:text-base">
              Important information for your upcoming move-in
            </CardDescription>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 lg:p-8 space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium mb-3 text-sm sm:text-base">📋 Before Move-in</h4>
                <ul className="text-xs sm:text-sm text-gray-600 space-y-2">
                  <li>• Contact your host to coordinate move-in time</li>
                  <li>• Review the signed housing agreement</li>
                  <li>• Prepare required documents and identification</li>
                  <li>• Plan your moving logistics</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-medium mb-3 text-sm sm:text-base">🔑 On Move-in Day</h4>
                <ul className="text-xs sm:text-sm text-gray-600 space-y-2">
                  <li>• Meet your host at the agreed time</li>
                  <li>• Complete property walkthrough together</li>
                  <li>• Receive keys and access information</li>
                  <li>• Document any existing conditions</li>
                </ul>
              </div>
            </div>

            {/* House Rules - Mobile accordion style, desktop expanded */}
            {product.houseRules && typeof product.houseRules === 'object' && (
              <div>
                <h4 className="font-medium mb-3 text-sm sm:text-base">🏠 House Rules</h4>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="text-xs sm:text-sm text-gray-700 space-y-1">
                    {Object.entries(product.houseRules as Record<string, any>).map(([key, value]) => (
                      <div key={key}>
                        <span className="capitalize font-medium">{key.replace(/([A-Z])/g, ' $1')}:</span> {String(value)}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Amenities - Mobile accordion style, desktop expanded */}
            {product.amenities && typeof product.amenities === 'object' && (
              <div>
                <h4 className="font-medium mb-3 text-sm sm:text-base">✨ Available Amenities</h4>
                <div className="bg-blue-50 rounded-lg p-4">
                  <div className="text-xs sm:text-sm text-gray-700 space-y-1">
                    {Object.entries(product.amenities as Record<string, any>).map(([key, value]) => (
                      value && (
                        <div key={key}>
                          • <span className="capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                        </div>
                      )
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Agreement Access */}
            {agreement && (
              <div>
                <h4 className="font-medium mb-3 text-sm sm:text-base">📄 Housing Agreement</h4>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="min-h-[44px]" 
                  onClick={() => setShowPDFModal(true)}
                >
                  <FileText className="h-4 w-4 mr-2" />
                  View Agreement
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Bottom Action Bar - Mobile fixed bottom, desktop normal */}
        <Card className="shadow-lg border-0 w-full">
          <CardHeader className="bg-gradient-to-r from-primary/5 to-primary/10 border-b border-gray-100 rounded-t-lg p-4 sm:p-6">
            <CardTitle className="text-lg sm:text-xl">🎉 You're All Set!</CardTitle>
          </CardHeader>
          <CardContent className="p-4 sm:p-6">
            <p className="text-xs sm:text-sm text-gray-600 mb-4">
              Your housing arrangement is now confirmed. We recommend reaching out to your host soon to coordinate your move-in details.
            </p>
            <div className="flex flex-col space-y-3 sm:flex-row sm:space-y-0 sm:space-x-3">
              <Button className="w-full sm:w-auto min-h-[44px]" asChild>
                <Link href="/housemate/applications">
                  View My Applications
                </Link>
              </Button>
              <Button variant="outline" className="w-full sm:w-auto min-h-[44px]" asChild>
                <Link href="/housemate/dashboard">
                  Go to Dashboard
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Mobile Bottom Action Bar - Fixed position for key actions */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 space-y-3">
        <Button className="w-full min-h-[44px]" asChild>
          <Link href="/housemate/dashboard">
            Go to Dashboard
          </Link>
        </Button>
      </div>

      {/* Add bottom padding on mobile to account for fixed bottom bar */}
      <div className="sm:hidden h-20"></div>

      {/* PDF Modal */}
      <PDFModal 
        isOpen={showPDFModal} 
        onClose={() => setShowPDFModal(false)} 
        agreementId={agreement?.id}
        applicationId={application.id}
      />
    </div>
  );
}
