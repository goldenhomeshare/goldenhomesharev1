import Link from "next/link";
import Image from "next/image";
import { Shield, CheckCircle, Users, Phone, AlertTriangle, FileText, Eye, Clock, Home, MessageCircle, CreditCard } from "lucide-react";

export default function Safety() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-white">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-16">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Safety & Security
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Your safety is our top priority. Learn about our comprehensive verification process, 
              safety guidelines, and the measures we take to ensure secure homesharing experiences.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Trust & Verification</h2>
              <p className="text-lg text-gray-600 mb-6">
                Golden HomeShare implements rigorous verification processes to ensure all participants 
                are trustworthy, reliable, and committed to creating safe living environments.
              </p>
              <p className="text-lg text-gray-600 mb-6">
                Every member undergoes comprehensive background checks, reference verification, 
                and identity confirmation before joining our community.
              </p>
              <Link 
                href="/onboarding"
                className="inline-flex items-center bg-primary hover:bg-primary/90 text-white px-8 py-4 rounded-2xl font-semibold text-lg transition-colors shadow-lg"
              >
                Join Our Safe Community
              </Link>
            </div>
            <div className="relative">
              <div className="w-full h-[400px] overflow-hidden rounded-2xl">
                <Image 
                  src="/helping-happy-bg.jpg" 
                  alt="Safe and secure homesharing community" 
                  width={600}
                  height={400}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Verification Process Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Our Verification Process
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-lg text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <FileText className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Background Checks</h3>
              <p className="text-gray-600">
                Comprehensive criminal background checks and identity verification for all members 
                ensure community safety and peace of mind.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-lg text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Reference Verification</h3>
              <p className="text-gray-600">
                We verify personal and professional references to ensure members have a history 
                of responsible behavior and positive relationships.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-lg text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Identity Confirmation</h3>
              <p className="text-gray-600">
                Photo ID verification and video interviews confirm member identities 
                and ensure authenticity across our platform.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Safety Guidelines Section */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Safety Guidelines
          </h2>
          
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-6">For Homeowners</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <Eye className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Screen Carefully</h4>
                    <p className="text-gray-600">Review housemate profiles thoroughly and conduct video calls before making decisions.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Document Agreements</h4>
                    <p className="text-gray-600">Always use written agreements outlining expectations, responsibilities, and house rules.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <Home className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Secure Your Space</h4>
                    <p className="text-gray-600">Ensure proper locks, secure valuables, and establish clear boundaries for shared spaces.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <MessageCircle className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Maintain Communication</h4>
                    <p className="text-gray-600">Keep open, regular communication and address concerns promptly and respectfully.</p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-6">For Housemates</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <Shield className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Trust Your Instincts</h4>
                    <p className="text-gray-600">If something doesn't feel right during the application process, trust your feelings and seek support.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <Users className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Meet in Safe Spaces</h4>
                    <p className="text-gray-600">Initial meetings should be in public places or with trusted friends present when possible.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Know Your Rights</h4>
                    <p className="text-gray-600">Understand housing laws, tenant rights, and keep copies of all agreements and communications.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Stay Connected</h4>
                    <p className="text-gray-600">Maintain contact with family and friends, and inform them of your living arrangements.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Platform Safety Features */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Platform Safety Features
          </h2>
          
          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-6 h-6 text-primary" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Secure Messaging</h4>
              <p className="text-sm text-gray-600">All communications happen through our secure platform until you're ready to exchange personal contact information.</p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Eye className="w-6 h-6 text-primary" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Profile Verification</h4>
              <p className="text-sm text-gray-600">Verified badges show when members have completed our full verification process.</p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="w-6 h-6 text-primary" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Report System</h4>
              <p className="text-sm text-gray-600">Easy-to-use reporting tools for inappropriate behavior or safety concerns.</p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <CreditCard className="w-6 h-6 text-primary" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Secure Payment</h4>
              <p className="text-sm text-gray-600">All financial transactions are processed securely through our platform with bank-level encryption and fraud protection.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Important Notice Section */}
      <section className="bg-white py-16">
        <div className="max-w-4xl mx-auto px-4 md:px-8">
          <div className="bg-yellow-50 p-8 rounded-2xl border border-yellow-200">
            <div className="text-center">
              <AlertTriangle className="w-12 h-12 text-yellow-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Important Safety Notice</h3>
              <p className="text-gray-700 mb-6">
                Golden HomeShare provides a platform for connecting homeowners and housemates, but we cannot guarantee 
                the safety or suitability of any individual. Always conduct your own due diligence, trust your instincts, 
                and prioritize your personal safety in all interactions.
              </p>
              <p className="text-gray-700 font-medium">
                This program provides companionship and practical household support only. No medical care, 
                personal hygiene assistance, or professional services are included.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-primary/5 py-16">
        <div className="max-w-4xl mx-auto px-4 md:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Questions About Safety?
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Our safety team is here to help. Contact us with any questions or concerns about our safety measures.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/about"
              className="inline-flex items-center bg-primary hover:bg-primary/90 text-white px-8 py-4 rounded-2xl font-semibold text-lg transition-colors shadow-lg"
            >
              Learn More About Us
            </Link>
            <Link 
              href="/"
              className="inline-flex items-center bg-white hover:bg-gray-50 text-primary border-2 border-primary px-8 py-4 rounded-2xl font-semibold text-lg transition-colors"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
} 