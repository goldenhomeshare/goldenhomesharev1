import { FillableAgreementForm } from "@/components/FillableAgreementForm";
import { ArrowLeft, FileText, Shield } from "lucide-react";
import Link from "next/link";

export default function FillAgreementPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 to-stone-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <Link href="/" className="flex items-center">
                <div className="bg-stone-600 rounded-full p-2 mr-3">
                  <FileText className="h-6 w-6 text-white" />
                </div>
                <span className="text-xl font-bold text-gray-900">Golden HomeShare</span>
              </Link>
            </div>
            <Link 
              href="/"
              className="flex items-center text-sm text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to Home
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="py-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Page Header */}
          <div className="text-center mb-12">
            <div className="flex justify-center mb-4">
              <div className="bg-stone-100 rounded-full p-3">
                <FileText className="h-8 w-8 text-stone-600" />
              </div>
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              📄 Agreement Generator
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Complete the form below to generate your personalized Golden HomeShare agreement
            </p>
          </div>

          {/* Important Notice */}
          <div className="mb-8 p-6 bg-amber-50 border border-amber-200 rounded-xl">
            <div className="flex items-start gap-3">
              <Shield className="h-6 w-6 text-amber-600 mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-amber-900 mb-2">Important Legal Information</h3>
                <p className="text-amber-800 text-sm mb-2">
                  This form generates a <strong>licensing agreement, not a lease</strong>. This distinction is 
                  important for legal protection under Missouri law.
                </p>
                <ul className="text-amber-800 text-sm space-y-1">
                  <li>• Both parties should review the agreement carefully before signing</li>
                  <li>• Ensure compliance with local housing codes and municipal requirements</li>
                  <li>• Keep copies of the signed agreement for your records</li>
                  <li>• Contact us with any questions at support@goldenhomeshare.com</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Form */}
          <FillableAgreementForm 
            title="Complete Your Agreement Information"
            description="Fill in the details below to generate your personalized Golden HomeShare agreement"
          />

          {/* Help Section */}
          <div className="mt-12 bg-white rounded-xl shadow-sm border p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Need Help?</h3>
            <div className="grid sm:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Contact Support</h4>
                <div className="space-y-2 text-sm text-gray-600">
                  <div>📧 support@goldenhomeshare.com</div>
                  <div>📞 (816) 433-2979</div>
                </div>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-2">What Happens Next?</h4>
                <ol className="text-sm text-gray-600 space-y-1">
                  <li>1. Complete and submit the form</li>
                  <li>2. Review the generated agreement</li>
                  <li>3. Download or email to both parties</li>
                  <li>4. Both parties sign and keep copies</li>
                </ol>
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
} 