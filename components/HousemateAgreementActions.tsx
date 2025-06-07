"use client";

import { Button } from "@/components/ui/button";
import { Download, FileText } from "lucide-react";
import { toast } from "sonner";

interface HousemateAgreementActionsProps {
  agreement: any;
  applicationId: string;
}

export function HousemateAgreementActions({ agreement, applicationId }: HousemateAgreementActionsProps) {
  const handleDownloadAgreement = async () => {
    if (!agreement?.agreementData) {
      toast.error("No agreement data found");
      return;
    }

    try {
      // Merge agreement data with signature information
      const completeAgreementData = {
        ...agreement.agreementData,
        // Add signature data from the agreement record
        seekerSignature: agreement.housemateSignature,
        seekerSignedAt: agreement.housemateSignedAt,
        hostSignature: agreement.homeownerSignature,
        hostSignedAt: agreement.homeownerSignedAt,
      };

      const response = await fetch('/api/agreements/generate-complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(completeAgreementData)
      });

      if (!response.ok) {
        throw new Error('Failed to generate PDF');
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `agreement-${applicationId}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast.success('Agreement downloaded successfully!');
    } catch (error) {
      console.error('Download failed:', error);
      toast.error('Failed to download agreement. Please try again.');
    }
  };

  const handleViewAgreement = async () => {
    if (!agreement?.agreementData) {
      toast.error("No agreement data found");
      return;
    }

    try {
      // Merge agreement data with signature information
      const completeAgreementData = {
        ...agreement.agreementData,
        // Add signature data from the agreement record
        seekerSignature: agreement.housemateSignature,
        seekerSignedAt: agreement.housemateSignedAt,
        hostSignature: agreement.homeownerSignature,
        hostSignedAt: agreement.homeownerSignedAt,
      };

      const response = await fetch('/api/agreements/generate-complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(completeAgreementData)
      });

      if (!response.ok) {
        throw new Error('Failed to generate PDF');
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      window.open(url, '_blank');
      setTimeout(() => URL.revokeObjectURL(url), 10000);

      toast.success('Agreement opened for viewing!');
    } catch (error) {
      console.error('Preview failed:', error);
      toast.error('Failed to view agreement. Please try again.');
    }
  };

  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <Button 
        type="button"
        variant="outline" 
        className="flex items-center gap-2"
        onClick={handleDownloadAgreement}
      >
        <Download className="h-4 w-4" />
        Download Agreement
      </Button>
      <Button 
        type="button"
        variant="outline" 
        className="flex items-center gap-2"
        onClick={handleViewAgreement}
      >
        <FileText className="h-4 w-4" />
        View Agreement PDF
      </Button>
    </div>
  );
} 