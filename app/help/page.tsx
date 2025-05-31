import Link from "next/link";
import { 
  HelpCircle, 
  Users, 
  Home, 
  Shield, 
  Phone, 
  Mail, 
  MessageCircle, 
  FileText, 
  CreditCard, 
  Settings, 
  Search,
  ChevronRight,
  HeadphonesIcon
} from "lucide-react";

export default function Help() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-white">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-16">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Help & Support Center
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Find answers to your questions about Golden HomeShare. We're here to help you navigate 
              your homesharing journey with confidence.
            </p>
          </div>

          {/* Quick Search */}
          <div className="max-w-2xl mx-auto mb-16">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search for help topics..."
                className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-2xl text-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Quick Help Categories */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Popular Help Topics
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Home className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4 text-center">Getting Started</h3>
              <p className="text-gray-600 text-center mb-6">
                Learn how to create your profile, verify your account, and find your first match.
              </p>
              <div className="space-y-3">
                <Link href="#getting-started" className="flex items-center justify-between text-primary hover:text-primary/80 text-sm">
                  Creating Your Profile <ChevronRight className="w-4 h-4" />
                </Link>
                <Link href="#getting-started" className="flex items-center justify-between text-primary hover:text-primary/80 text-sm">
                  Account Verification <ChevronRight className="w-4 h-4" />
                </Link>
                <Link href="#getting-started" className="flex items-center justify-between text-primary hover:text-primary/80 text-sm">
                  Finding Matches <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Shield className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4 text-center">Safety & Security</h3>
              <p className="text-gray-600 text-center mb-6">
                Understand our safety measures, background checks, and how to stay secure.
              </p>
              <div className="space-y-3">
                <Link href="#safety" className="flex items-center justify-between text-blue-600 hover:text-blue-500 text-sm">
                  Background Checks <ChevronRight className="w-4 h-4" />
                </Link>
                <Link href="#safety" className="flex items-center justify-between text-blue-600 hover:text-blue-500 text-sm">
                  Safety Guidelines <ChevronRight className="w-4 h-4" />
                </Link>
                <Link href="#safety" className="flex items-center justify-between text-blue-600 hover:text-blue-500 text-sm">
                  Reporting Issues <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CreditCard className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4 text-center">Payments & Billing</h3>
              <p className="text-gray-600 text-center mb-6">
                Get help with payments, billing questions, and financial arrangements.
              </p>
              <div className="space-y-3">
                <Link href="#payments" className="flex items-center justify-between text-green-600 hover:text-green-500 text-sm">
                  Payment Methods <ChevronRight className="w-4 h-4" />
                </Link>
                <Link href="#payments" className="flex items-center justify-between text-green-600 hover:text-green-500 text-sm">
                  Billing Cycles <ChevronRight className="w-4 h-4" />
                </Link>
                <Link href="#payments" className="flex items-center justify-between text-green-600 hover:text-green-500 text-sm">
                  Refund Policy <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Detailed FAQ Sections */}
      <section className="bg-white py-16" id="getting-started">
        <div className="max-w-4xl mx-auto px-4 md:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-12">Getting Started</h2>
          
          <div className="space-y-8">
            <div className="border-b border-gray-200 pb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">How do I create my profile?</h3>
              <p className="text-gray-600 mb-4">
                Creating your profile is easy! Start by clicking "Get Started" and choosing whether you're a homeowner 
                looking for a housemate or someone seeking affordable housing.
              </p>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-700">
                  <strong>For Homeowners:</strong> You'll describe your home, available space, and what kind of support 
                  you'd appreciate from a housemate.
                </p>
                <p className="text-sm text-gray-700 mt-2">
                  <strong>For Housemates:</strong> You'll share your background, preferences, and what you can offer 
                  to a homeowner.
                </p>
              </div>
            </div>

            <div className="border-b border-gray-200 pb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">What documents do I need for verification?</h3>
              <p className="text-gray-600 mb-4">
                We require several documents to ensure everyone's safety and trustworthiness:
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-2">
                <li>Government-issued photo ID (driver's license or passport)</li>
                <li>Proof of income or financial stability</li>
                <li>Background check consent form</li>
                <li>Three personal or professional references</li>
                <li>Emergency contact information</li>
              </ul>
            </div>

            <div className="border-b border-gray-200 pb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">How does the matching process work?</h3>
              <p className="text-gray-600 mb-4">
                Our intelligent matching system considers multiple factors to find compatible matches:
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-2">
                <li>Location preferences and proximity</li>
                <li>Lifestyle compatibility (pets, smoking, noise levels)</li>
                <li>Support needs and capabilities</li>
                <li>Schedule alignment</li>
                <li>Personality and communication styles</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Safety Section */}
      <section className="py-16" id="safety">
        <div className="max-w-4xl mx-auto px-4 md:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-12">Safety & Security</h2>
          
          <div className="space-y-8">
            <div className="border-b border-gray-200 pb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">What background checks do you perform?</h3>
              <p className="text-gray-600 mb-4">
                We conduct comprehensive background checks for all users, including:
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-2">
                <li>Criminal history verification</li>
                <li>Identity verification</li>
                <li>Reference checks from previous landlords or employers</li>
                <li>Social media and online presence review</li>
                <li>Financial background screening</li>
              </ul>
            </div>

            <div className="border-b border-gray-200 pb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">What should I do if I feel unsafe?</h3>
              <p className="text-gray-600 mb-4">
                Your safety is our top priority. If you feel unsafe at any time:
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-2">
                <li>Use the in-app emergency reporting feature</li>
                <li>Contact local authorities if there's immediate danger</li>
                <li>Reach out to your emergency contacts</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Payments Section */}
      <section className="bg-white py-16" id="payments">
        <div className="max-w-4xl mx-auto px-4 md:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-12">Payments & Billing</h2>
          
          <div className="space-y-8">
            <div className="border-b border-gray-200 pb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">How do payments work?</h3>
              <p className="text-gray-600 mb-4">
                Payments are handled securely through our platform:
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-2">
                <li>All payments are processed through secure, encrypted channels</li>
                <li>Homeowners receive monthly payments directly to their bank account</li>
                <li>Housemates pay monthly rent through the platform</li>
                <li>We handle all payment processing and provide receipts</li>
              </ul>
            </div>

            <div className="border-b border-gray-200 pb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">What payment methods do you accept?</h3>
              <ul className="list-disc list-inside text-gray-600 space-y-2">
                <li>Bank transfers (ACH)</li>
                <li>Credit and debit cards</li>
                <li>Digital wallets (Apple Pay, Google Pay)</li>
                <li>Automated monthly billing</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Support */}
      <section className="bg-primary/5 py-16">
        <div className="max-w-4xl mx-auto px-4 md:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Still Need Help?
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-2xl shadow-lg text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Phone className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Call Us</h3>
              <p className="text-gray-600 mb-4">Speak directly with our support team</p>
              <p className="text-primary font-semibold">816 433 2979</p>
              <p className="text-sm text-gray-500">Mon-Fri 8AM-8PM PST</p>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-lg text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Email Support</h3>
              <p className="text-gray-600 mb-4">Get detailed help via email</p>
              <p className="text-blue-600 font-semibold">support@goldenhomeshare.com</p>
              <p className="text-sm text-gray-500">Response within 24 hours</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
} 