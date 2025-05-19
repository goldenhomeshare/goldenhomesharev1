import Link from "next/link";
import { CheckCircle, AlertCircle, Home, AlertTriangle, ShieldCheck } from "lucide-react";

export default function ConfirmationPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      {/* Testing Notice Banner */}
      <div className="bg-amber-50 border-l-4 border-amber-400 p-4 mb-8 rounded-md">
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
      
      <div className="bg-white shadow-lg rounded-lg p-8 mb-10 text-center">
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
            <CheckCircle size={48} className="text-primary" />
          </div>
        </div>
        
        <h1 className="text-3xl font-bold mb-4">Profile Submitted!</h1>
        
        <p className="text-lg text-slate-600 mb-8">
          Thank you for creating your housemate profile on Golden HomeShare. Your profile is now being reviewed by our team.
        </p>
        
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8 text-left">
          <div className="flex items-start">
            <AlertCircle size={24} className="text-blue-500 mr-3 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="font-medium text-blue-800 mb-1">What happens next?</h3>
              <p className="text-sm text-blue-700">
                Our team will review your profile within 24-48 hours. Once approved, you will be prompted to complete a background check before your profile is visible to homeowners. You'll receive an email notification when your profile goes live and you can start browsing housing opportunities.
              </p>
            </div>
          </div>
        </div>
        
        <div className="space-y-3 mb-8 text-left">
          <h3 className="font-medium text-lg">Next steps you can take:</h3>
          <div className="space-y-2">
            <div className="flex items-center p-3 border rounded-lg hover:bg-slate-50">
              <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center mr-3">
                <ShieldCheck size={20} className="text-slate-600" />
              </div>
              <div>
                <h4 className="font-medium">Complete a background check</h4>
                <p className="text-sm text-slate-600">Verify your identity and build trust with potential homeowners</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex justify-center">
          <Link
            href="/"
            className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90"
          >
            Return to Homepage
          </Link>
        </div>
      </div>
    </div>
  );
} 