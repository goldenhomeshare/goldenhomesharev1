import Link from "next/link";
import Image from "next/image";
import { Shield, CheckCircle, Users, Phone, AlertTriangle, FileText, Eye, Clock, Home, MessageCircle, CreditCard, Search, Handshake } from "lucide-react";

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
              Your safety is our top priority. Learn about our verification process, 
              safety guidelines, and the measures we take to ensure secure homesharing experiences.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Trust & Verification</h2>
              <p className="text-lg text-gray-600 mb-6">
                Golden HomeShare implements verification processes to help ensure participants 
                are committed to creating safe living environments.
              </p>
              <p className="text-lg text-gray-600 mb-6">
                Members complete background checks and identity verification before joining our community.
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
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Our Verification Process
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              We help create a safer community through our verification requirements
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="shadow-lg border-0 rounded-2xl overflow-hidden">
              <div className="bg-gradient-to-r from-primary/5 to-primary/10 border-b border-gray-100 rounded-t-lg p-8 text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FileText className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-2xl text-gray-900 mb-2">Background Checks</h3>
                <p className="text-gray-600">Comprehensive screening for community safety</p>
              </div>
              <div className="p-8 bg-white rounded-b-lg">
                <p className="text-gray-600">
                  All members complete criminal background checks and identity verification 
                  to help ensure community safety and peace of mind.
                </p>
              </div>
            </div>

            <div className="shadow-lg border-0 rounded-2xl overflow-hidden">
              <div className="bg-gradient-to-r from-primary/5 to-primary/10 border-b border-gray-100 rounded-t-lg p-8 text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-2xl text-gray-900 mb-2">Profile Verification</h3>
                <p className="text-gray-600">Identity confirmation and profile validation</p>
              </div>
              <div className="p-8 bg-white rounded-b-lg">
                <p className="text-gray-600">
                  Photo ID verification and profile reviews help confirm member identities 
                  and ensure authenticity across our platform.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Background Check Details Section */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="text-center mb-16">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <Search className="w-10 h-10 text-primary" />
            </div>
            <h2 className="text-2xl text-gray-900 mb-2">What Our Background Checks Cover</h2>
            <p className="text-gray-600 max-w-3xl mx-auto">
              Our screening process includes multiple layers of verification to help ensure community safety
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            <div className="shadow-lg border-0 rounded-2xl overflow-hidden">
              <div className="bg-gradient-to-r from-primary/5 to-primary/10 border-b border-gray-100 rounded-t-lg p-6 text-center">
                <h3 className="text-lg font-semibold text-gray-900">Criminal History Screening</h3>
              </div>
              <div className="p-8 bg-white rounded-b-lg">
                <ul className="space-y-4 text-gray-600">
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-primary mr-3 mt-0.5 flex-shrink-0" />
                    <span>National criminal database searches</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-primary mr-3 mt-0.5 flex-shrink-0" />
                    <span>County-level criminal records</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-primary mr-3 mt-0.5 flex-shrink-0" />
                    <span>Federal criminal history</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-primary mr-3 mt-0.5 flex-shrink-0" />
                    <span>Sex offender registry checks</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="shadow-lg border-0 rounded-2xl overflow-hidden">
              <div className="bg-gradient-to-r from-primary/5 to-primary/10 border-b border-gray-100 rounded-t-lg p-6 text-center">
                <h3 className="text-lg font-semibold text-gray-900">Identity Verification</h3>
              </div>
              <div className="p-8 bg-white rounded-b-lg">
                <ul className="space-y-4 text-gray-600">
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-primary mr-3 mt-0.5 flex-shrink-0" />
                    <span>Photo ID verification</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-primary mr-3 mt-0.5 flex-shrink-0" />
                    <span>Address verification</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-primary mr-3 mt-0.5 flex-shrink-0" />
                    <span>Identity document authentication</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-primary mr-3 mt-0.5 flex-shrink-0" />
                    <span>Profile completeness verification</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="mt-8 max-w-4xl mx-auto">
            <div className="bg-primary/5 border border-primary/20 rounded-2xl p-6">
              <div className="flex items-start">
                <AlertTriangle className="w-6 h-6 text-primary mr-3 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Important Note</h4>
                  <p className="text-gray-700">
                    Our background checks are conducted by certified third-party screening services and comply with all federal and state regulations. 
                    Results are evaluated on a case-by-case basis, considering factors such as the nature, severity, and recency of any findings.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Homeshare Agreements Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="text-center mb-16">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <Handshake className="w-10 h-10 text-primary" />
            </div>
            <h2 className="text-2xl text-gray-900 mb-2">Homeshare Agreements</h2>
            <p className="text-gray-600 max-w-3xl mx-auto">
              We provide tools and guidance to help you create clear agreements that protect both homeowners and housemates
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            <div className="shadow-lg border-0 rounded-2xl overflow-hidden">
              <div className="bg-gradient-to-r from-primary/5 to-primary/10 border-b border-gray-100 rounded-t-lg p-6 text-center">
                <h3 className="text-lg font-semibold text-gray-900">Agreement Templates</h3>
              </div>
              <div className="p-8 bg-white rounded-b-lg">
                <p className="text-gray-600 mb-6">
                  Our platform provides customizable agreement templates that cover essential aspects of homesharing arrangements.
                </p>
                <ul className="space-y-3 text-gray-600">
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-primary mr-3 mt-0.5 flex-shrink-0" />
                    <span>Monthly payment terms and schedules</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-primary mr-3 mt-0.5 flex-shrink-0" />
                    <span>Household rules and expectations</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-primary mr-3 mt-0.5 flex-shrink-0" />
                    <span>Guest policies and common area usage</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-primary mr-3 mt-0.5 flex-shrink-0" />
                    <span>Utilities and shared expenses</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="shadow-lg border-0 rounded-2xl overflow-hidden">
              <div className="bg-gradient-to-r from-primary/5 to-primary/10 border-b border-gray-100 rounded-t-lg p-6 text-center">
                <h3 className="text-lg font-semibold text-gray-900">Key Protections</h3>
              </div>
              <div className="p-8 bg-white rounded-b-lg">
                <p className="text-gray-600 mb-6">
                  Well-structured agreements provide clarity and help prevent misunderstandings, 
                  creating a foundation for successful homesharing relationships.
                </p>
                <ul className="space-y-3 text-gray-600">
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-primary mr-3 mt-0.5 flex-shrink-0" />
                    <span>Termination procedures and notice periods</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-primary mr-3 mt-0.5 flex-shrink-0" />
                    <span>Dispute resolution processes</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-primary mr-3 mt-0.5 flex-shrink-0" />
                    <span>Privacy and personal space boundaries</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-primary mr-3 mt-0.5 flex-shrink-0" />
                    <span>Emergency contact and safety protocols</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="mt-8 max-w-4xl mx-auto">
            <div className="bg-primary/5 border border-primary/20 rounded-2xl p-6">
              <div className="flex items-start">
                <Handshake className="w-6 h-6 text-primary mr-3 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Getting Started</h4>
                  <p className="text-gray-700">
                    Once you're matched with a potential housemate, our platform will guide you through creating a customized agreement 
                    that meets your specific needs. We recommend reviewing the agreement together and seeking independent legal advice if needed.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Safety Guidelines Section */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="text-center mb-16">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <Shield className="w-10 h-10 text-primary" />
            </div>
            <h2 className="text-2xl text-gray-900 mb-2">Safety Guidelines</h2>
            <p className="text-gray-600">
              Best practices for safe and successful homesharing experiences
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            <div className="shadow-lg border-0 rounded-2xl overflow-hidden">
              <div className="bg-gradient-to-r from-primary/5 to-primary/10 border-b border-gray-100 rounded-t-lg p-6 text-center">
                <h3 className="text-lg font-semibold text-gray-900">For Homeowners</h3>
              </div>
              <div className="p-8 bg-white rounded-b-lg">
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <Eye className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">Screen Carefully</h4>
                      <p className="text-gray-600">Review housemate profiles thoroughly and conduct video calls before making decisions.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <FileText className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">Document Agreements</h4>
                      <p className="text-gray-600">Always use written agreements outlining expectations, responsibilities, and house rules.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <Home className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">Secure Your Space</h4>
                      <p className="text-gray-600">Ensure proper locks, secure valuables, and establish clear boundaries for shared spaces.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="shadow-lg border-0 rounded-2xl overflow-hidden">
              <div className="bg-gradient-to-r from-primary/5 to-primary/10 border-b border-gray-100 rounded-t-lg p-6 text-center">
                <h3 className="text-lg font-semibold text-gray-900">For Housemates</h3>
              </div>
              <div className="p-8 bg-white rounded-b-lg">
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <Shield className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">Trust Your Instincts</h4>
                      <p className="text-gray-600">If something doesn't feel right during the application process, trust your feelings and seek support.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <Users className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">Meet in Safe Spaces</h4>
                      <p className="text-gray-600">Initial meetings should be in public places or with trusted friends present when possible.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <Phone className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">Stay Connected</h4>
                      <p className="text-gray-600">Maintain contact with family and friends, and inform them of your living arrangements.</p>
                    </div>
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
          <div className="text-center mb-16">
            <h2 className="text-2xl text-gray-900 mb-2">Platform Safety Features</h2>
            <p className="text-gray-600">Built-in tools to help keep you safe</p>
          </div>
          
          <div className="grid md:grid-cols-4 gap-6">
            <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6 text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-6 h-6 text-primary" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Secure Messaging</h4>
              <p className="text-sm text-gray-600">All communications happen through our secure platform until you're ready to exchange personal contact information.</p>
            </div>

            <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6 text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Eye className="w-6 h-6 text-primary" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Profile Verification</h4>
              <p className="text-sm text-gray-600">Verified badges show when members have completed our verification process.</p>
            </div>

            <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6 text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="w-6 h-6 text-primary" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Report System</h4>
              <p className="text-sm text-gray-600">Easy-to-use reporting tools for inappropriate behavior or safety concerns.</p>
            </div>

            <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6 text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <CreditCard className="w-6 h-6 text-primary" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Secure Payment</h4>
              <p className="text-sm text-gray-600">All financial transactions are processed securely through our platform with bank-level encryption.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Important Notice Section */}
      <section className="bg-white py-16">
        <div className="max-w-4xl mx-auto px-4 md:px-8">
          <div className="bg-primary/5 border border-primary/20 rounded-2xl p-8">
            <div className="text-center">
              <AlertTriangle className="w-12 h-12 text-primary mx-auto mb-4" />
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