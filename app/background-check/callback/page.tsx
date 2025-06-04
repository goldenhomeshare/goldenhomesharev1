import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Clock, AlertCircle, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default async function BackgroundCheckCallbackPage({
  searchParams,
}: {
  searchParams: { invitation_id?: string; status?: string };
}) {
  const user = await getCurrentUser();
  
  if (!user) {
    redirect("/api/auth/login");
  }

  const { invitation_id, status } = searchParams;

  const getStatusInfo = (status?: string) => {
    switch (status) {
      case "completed":
        return {
          icon: CheckCircle,
          title: "Background Check Submitted",
          description: "Your background check information has been submitted successfully. We'll notify you once it's processed.",
          badge: { text: "Submitted", variant: "default" as const },
          color: "text-green-600",
          bgColor: "bg-green-50",
          borderColor: "border-green-200"
        };
      case "cancelled":
        return {
          icon: AlertCircle,
          title: "Background Check Cancelled",
          description: "Your background check was cancelled. You can restart the process if needed.",
          badge: { text: "Cancelled", variant: "destructive" as const },
          color: "text-red-600",
          bgColor: "bg-red-50",
          borderColor: "border-red-200"
        };
      default:
        return {
          icon: Clock,
          title: "Background Check In Progress",
          description: "Your background check is being processed. This usually takes 24-48 hours.",
          badge: { text: "Processing", variant: "secondary" as const },
          color: "text-blue-600",
          bgColor: "bg-blue-50",
          borderColor: "border-blue-200"
        };
    }
  };

  const statusInfo = getStatusInfo(status);
  const IconComponent = statusInfo.icon;

  return (
    <div className="max-w-2xl mx-auto px-4 md:px-8 py-8">
      {/* Back button */}
      <Link 
        href="/background-check"
        className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Background Check
      </Link>

      {/* Status Card */}
      <Card className={`mb-8 ${statusInfo.borderColor} ${statusInfo.bgColor}`}>
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className={`p-3 rounded-full bg-white`}>
              <IconComponent className={`w-8 h-8 ${statusInfo.color}`} />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <CardTitle className="text-xl">{statusInfo.title}</CardTitle>
                <Badge variant={statusInfo.badge.variant}>
                  {statusInfo.badge.text}
                </Badge>
              </div>
              <p className="text-gray-600">
                {statusInfo.description}
              </p>
              {invitation_id && (
                <p className="text-sm text-gray-500 mt-2">
                  Invitation ID: {invitation_id}
                </p>
              )}
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Next Steps */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">What Happens Next?</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm font-semibold mt-0.5">
                1
              </div>
              <div>
                <h4 className="font-semibold">Processing</h4>
                <p className="text-sm text-gray-600">
                  Checkr will process your background check information (usually 24-48 hours)
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm font-semibold mt-0.5">
                2
              </div>
              <div>
                <h4 className="font-semibold">Notification</h4>
                <p className="text-sm text-gray-600">
                  You'll receive an email when your background check is complete
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm font-semibold mt-0.5">
                3
              </div>
              <div>
                <h4 className="font-semibold">Verification</h4>
                <p className="text-sm text-gray-600">
                  Your profile will be automatically updated with verification status
                </p>
              </div>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button asChild>
              <Link href="/background-check">
                Check Status
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/dashboard">
                Go to Dashboard
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Support */}
      <Card className="mt-8">
        <CardContent className="p-4">
          <div className="text-sm text-gray-600">
            <p className="font-semibold mb-2">Need Help?</p>
            <p>
              If you have questions about your background check or need to update your information, 
              please contact our support team.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 