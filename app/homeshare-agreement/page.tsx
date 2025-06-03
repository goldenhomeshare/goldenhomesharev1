import { AgreementPDFViewer } from "@/components/AgreementPDFViewer";
import { ArrowLeft, Shield, Home, Users, FileText } from "lucide-react";
import Link from "next/link";

export default function HomeShareAgreementPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <Link href="/" className="flex items-center">
                <div className="bg-primary rounded-full p-2 mr-3">
                  <Home className="h-6 w-6 text-white" />
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
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Page Header */}
          <div className="text-center mb-12">
            <div className="flex justify-center mb-4">
              <div className="bg-primary/10 rounded-full p-3">
                <FileText className="h-8 w-8 text-primary" />
              </div>
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Golden HomeShare Agreement
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Review our official licensing agreement that governs all homesharing arrangements on our platform.
            </p>
          </div>

          {/* Key Information */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <div className="bg-white p-6 rounded-xl shadow-sm border">
              <div className="flex items-center mb-3">
                <Shield className="h-6 w-6 text-green-600 mr-2" />
                <h3 className="font-semibold text-gray-900">Legal Protection</h3>
              </div>
              <p className="text-sm text-gray-600">
                Licensing agreement (not lease) designed to protect both hosts and seekers under Missouri law.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-sm border">
              <div className="flex items-center mb-3">
                <Users className="h-6 w-6 text-blue-600 mr-2" />
                <h3 className="font-semibold text-gray-900">Clear Terms</h3>
              </div>
              <p className="text-sm text-gray-600">
                Comprehensive terms covering responsibilities, expectations, and procedures for both parties.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-sm border">
              <div className="flex items-center mb-3">
                <Home className="h-6 w-6 text-purple-600 mr-2" />
                <h3 className="font-semibold text-gray-900">Local Compliance</h3>
              </div>
              <p className="text-sm text-gray-600">
                Designed to comply with local housing codes and municipal requirements.
              </p>
            </div>
          </div>

          {/* PDF Viewer */}
          <div className="flex justify-center mb-12">
            <AgreementPDFViewer 
              agreementId="standard-agreement-001"
              title="Golden HomeShare Agreement"
              description="Official licensing agreement for all homesharing arrangements"
              showEmailOption={false}
            />
          </div>

          {/* Important Notes */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 mb-8">
            <h3 className="font-semibold text-yellow-900 mb-3 flex items-center">
              <Shield className="h-5 w-5 mr-2" />
              Important Legal Distinction
            </h3>
            <p className="text-yellow-800 text-sm">
              All living arrangements facilitated through Golden HomeShare are governed by <strong>license agreements, not leases</strong>. 
              This distinction is critical and is intended to protect both parties under Missouri law. Users are responsible for ensuring 
              their home-sharing arrangements comply with local housing codes and municipal requirements.
            </p>
          </div>

          {/* Contact Information */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Questions About the Agreement?</h3>
            <div className="grid sm:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-600 mb-1">Email:</p>
                <a href="mailto:support@goldenhomeshare.com" className="text-primary hover:text-primary/80 font-medium">
                  support@goldenhomeshare.com
                </a>
              </div>
              <div>
                <p className="text-gray-600 mb-1">Phone:</p>
                <span className="text-gray-900 font-medium">(816) 433-2979</span>
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
} 