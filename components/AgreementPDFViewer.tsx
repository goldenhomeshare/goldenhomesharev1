"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, Eye, Send, FileText } from "lucide-react";
import { toast } from "sonner";

interface AgreementPDFViewerProps {
  agreementId: string;
  title?: string;
  description?: string;
  showEmailOption?: boolean;
}

export function AgreementPDFViewer({ 
  agreementId, 
  title = "Golden HomeShare Agreement",
  description = "View, download, or send your official Golden HomeShare agreement",
  showEmailOption = true
}: AgreementPDFViewerProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isEmailLoading, setIsEmailLoading] = useState(false);

  const handleViewPDF = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/agreements/${agreementId}/pdf`);
      
      if (!response.ok) {
        throw new Error("Failed to generate PDF");
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      
      // Open PDF in new tab
      window.open(url, "_blank");
      
      // Clean up object URL
      setTimeout(() => URL.revokeObjectURL(url), 100);
      
    } catch (error) {
      console.error("Error viewing PDF:", error);
      toast.error("Failed to view agreement. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadPDF = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/agreements/${agreementId}/pdf`);
      
      if (!response.ok) {
        throw new Error("Failed to generate PDF");
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      
      // Create download link
      const link = document.createElement('a');
      link.href = url;
      link.download = `homesharing-agreement-${agreementId.slice(-8)}.pdf`;
      
      // Trigger download
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Clean up object URL
      URL.revokeObjectURL(url);
      
      toast.success("Agreement downloaded successfully!");
      
    } catch (error) {
      console.error("Error downloading PDF:", error);
      toast.error("Failed to download agreement. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendEmail = async () => {
    setIsEmailLoading(true);
    try {
      const response = await fetch(`/api/agreements/${agreementId}/email`, {
        method: "POST",
      });
      
      if (!response.ok) {
        throw new Error("Failed to send email");
      }
      
      toast.success("Agreement sent via email successfully!");
      
    } catch (error) {
      console.error("Error sending email:", error);
      toast.error("Failed to send email. Please try again.");
    } finally {
      setIsEmailLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          {title}
        </CardTitle>
        <CardDescription>
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            onClick={handleViewPDF}
            disabled={isLoading}
            variant="outline"
            className="flex items-center gap-2"
          >
            <Eye className="h-4 w-4" />
            {isLoading ? "Loading..." : "View Agreement"}
          </Button>
          
          <Button
            onClick={handleDownloadPDF}
            disabled={isLoading}
            className="flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            {isLoading ? "Loading..." : "Download PDF"}
          </Button>
          
          {showEmailOption && (
            <Button
              onClick={handleSendEmail}
              disabled={isEmailLoading}
              variant="secondary"
              className="flex items-center gap-2"
            >
              <Send className="h-4 w-4" />
              {isEmailLoading ? "Sending..." : "Send Email"}
            </Button>
          )}
        </div>
        
        <div className="mt-4 p-3 bg-muted rounded-lg">
          <p className="text-sm text-muted-foreground">
            <strong>Agreement ID:</strong> {agreementId.slice(-8).toUpperCase()}
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            Official Golden HomeShare licensing agreement with legally binding terms for your homesharing arrangement.
          </p>
        </div>
      </CardContent>
    </Card>
  );
} 