import Link from "next/link";
import { Shield, Lock, Eye, FileText, Mail, Phone } from "lucide-react";

export default function Privacy() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <section className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 md:px-8 py-12">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Golden HomeShare Privacy Policy
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              We are committed to protecting your privacy. This policy explains what information we collect, how we use it, and how we protect it.
            </p>
            <div className="flex justify-center gap-4 text-sm text-gray-500">
              <span>Effective Date: May 31, 2025</span>
            </div>
          </div>
        </div>
      </section>

      {/* Introduction */}
      <section className="bg-white py-16">
        <div className="max-w-4xl mx-auto px-4 md:px-8">
          <div className="bg-primary/5 border border-primary/20 p-8 rounded-2xl mb-12">
            <p className="text-gray-700 leading-relaxed text-lg">
              Golden HomeShare ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains what information we collect, how we use it, and how we protect it when you use our website and services (the "Platform"). By using Golden HomeShare, you agree to the terms of this Privacy Policy and our Terms of Use.
            </p>
          </div>
        </div>
      </section>

      {/* Privacy Policy Content */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 md:px-8 space-y-12">
          
          {/* Section 1 */}
          <div className="bg-white p-8 rounded-2xl shadow-lg">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                <span className="text-primary font-bold">1</span>
              </div>
              Who Can Use Golden HomeShare
            </h2>
            <p className="text-gray-700 leading-relaxed">
              Golden HomeShare is intended for users age 18 and older. We do not knowingly collect information from anyone under 13. If we become aware that a user is under 18, we will close the account.
            </p>
          </div>

          {/* Section 2 */}
          <div className="bg-white p-8 rounded-2xl shadow-lg">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                <span className="text-primary font-bold">2</span>
              </div>
              Information We Collect
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">We may collect:</p>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                <span>Personal information you provide (e.g., name, contact info, profile details)</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                <span>Information related to your housing preferences</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                <span>Data from optional background checks (with your consent)</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                <span>Payment information (processed securely by Stripe)</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                <span>Usage data from cookies and analytics tools</span>
              </li>
            </ul>
          </div>

          {/* Section 3 */}
          <div className="bg-white p-8 rounded-2xl shadow-lg">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                <span className="text-primary font-bold">3</span>
              </div>
              How We Use Your Information
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">We use your information to:</p>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                <span>Provide and improve our matching services</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                <span>Communicate with you</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                <span>Facilitate optional background checks</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                <span>Process payments (via Stripe)</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                <span>Improve site functionality and user experience</span>
              </li>
            </ul>
          </div>

          {/* Section 4 */}
          <div className="bg-white p-8 rounded-2xl shadow-lg">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                <span className="text-primary font-bold">4</span>
              </div>
              Cookies and Tracking
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">We use cookies to:</p>
            <ul className="space-y-2 text-gray-700 mb-4">
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                <span>Remember login details</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                <span>Understand user preferences</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                <span>Track usage data for internal analytics</span>
              </li>
            </ul>
            <p className="text-gray-700 leading-relaxed">
              You can adjust cookie settings in your browser, but disabling them may limit your ability to use the Platform.
            </p>
          </div>

          {/* Section 5 */}
          <div className="bg-white p-8 rounded-2xl shadow-lg">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                <span className="text-primary font-bold">5</span>
              </div>
              Who We Share Information With
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">We do not sell your information. We may share it with:</p>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                <span>Third-party vendors who provide services (e.g., Checkr for background checks, Stripe for payments)</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                <span>Legal authorities if required by law or to protect our rights</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                <span>Partners only with your explicit consent</span>
              </li>
            </ul>
          </div>

          {/* Section 6 */}
          <div className="bg-white p-8 rounded-2xl shadow-lg">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                <span className="text-primary font-bold">6</span>
              </div>
              Security Measures
            </h2>
            <p className="text-gray-700 leading-relaxed">
              We use industry-standard practices (including encryption and secure hosting) to protect your data. However, no system is 100% secure, and we encourage you to use strong passwords and safeguard your login information.
            </p>
          </div>

          {/* Section 7 */}
          <div className="bg-white p-8 rounded-2xl shadow-lg">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                <span className="text-primary font-bold">7</span>
              </div>
              Retention and Deletion
            </h2>
            <p className="text-gray-700 leading-relaxed">
              We retain your data as long as your account is active. You may request deletion of your account and associated data by contacting us. Deletion requests may require identity verification.
            </p>
          </div>

          {/* Section 8 */}
          <div className="bg-white p-8 rounded-2xl shadow-lg">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                <span className="text-primary font-bold">8</span>
              </div>
              Your Rights
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">You may:</p>
            <ul className="space-y-2 text-gray-700 mb-4">
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                <span>Access or update your personal information</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                <span>Request data deletion</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                <span>Opt out of non-essential communications</span>
              </li>
            </ul>
            <p className="text-gray-700 leading-relaxed">
              To exercise these rights, contact us at{" "}
              <a href="mailto:support@goldenhomeshare.com" className="text-primary hover:text-primary/80 font-semibold">
                support@goldenhomeshare.com
              </a>.
            </p>
          </div>

          {/* Section 9 */}
          <div className="bg-white p-8 rounded-2xl shadow-lg">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                <span className="text-primary font-bold">9</span>
              </div>
              California Privacy Rights
            </h2>
            <p className="text-gray-700 leading-relaxed">
              California residents may request information regarding the disclosure of their data to third parties for direct marketing. To make such a request, email us at{" "}
              <a href="mailto:support@goldenhomeshare.com" className="text-primary hover:text-primary/80 font-semibold">
                support@goldenhomeshare.com
              </a>.
            </p>
          </div>

          {/* Section 10 */}
          <div className="bg-white p-8 rounded-2xl shadow-lg">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                <span className="text-primary font-bold">10</span>
              </div>
              Third-Party Links
            </h2>
            <p className="text-gray-700 leading-relaxed">
              Our Platform may contain links to third-party websites. We are not responsible for their privacy practices. Review their privacy policies before providing personal information.
            </p>
          </div>

          {/* Section 11 */}
          <div className="bg-white p-8 rounded-2xl shadow-lg">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                <span className="text-primary font-bold">11</span>
              </div>
              Changes to This Policy
            </h2>
            <p className="text-gray-700 leading-relaxed">
              We may update this Privacy Policy periodically. Any material changes will be posted on this page with the updated effective date. Continued use of the Platform after changes indicates acceptance.
            </p>
          </div>

          {/* Section 12 */}
          <div className="bg-white p-8 rounded-2xl shadow-lg">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                <span className="text-primary font-bold">12</span>
              </div>
              Contact Us
            </h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              If you have questions or concerns about this Privacy Policy, contact:
            </p>
            <div className="bg-primary/5 border border-primary/20 p-6 rounded-xl">
              <h3 className="font-semibold text-gray-900 mb-4">Golden HomeShare</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-primary" />
                  <a href="mailto:support@goldenhomeshare.com" className="text-primary hover:text-primary/80 font-semibold">
                    support@goldenhomeshare.com
                  </a>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-primary" />
                  <span className="text-gray-700 font-medium">816-433-2979</span>
                </div>
              </div>
            </div>
          </div>

          {/* Final Agreement */}
          <div className="bg-primary/10 border border-primary/30 p-8 rounded-2xl text-center">
            <p className="text-gray-900 font-semibold text-lg">
              By using Golden HomeShare, you agree to this Privacy Policy and our Terms of Use.
            </p>
          </div>

        </div>
      </section>

      {/* Contact Section */}
      <section className="bg-gray-100 py-16">
        <div className="max-w-4xl mx-auto px-4 md:px-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Privacy Questions or Concerns?
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Our privacy team is here to help with any questions about how we handle your data.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/help"
              className="inline-flex items-center bg-primary hover:bg-primary/90 text-white px-8 py-4 rounded-2xl font-semibold text-lg transition-colors shadow-lg"
            >
              Contact Privacy Team
            </Link>
            <Link 
              href="/terms"
              className="inline-flex items-center bg-white hover:bg-gray-50 text-primary border-2 border-primary px-8 py-4 rounded-2xl font-semibold text-lg transition-colors"
            >
              View Terms of Use
            </Link>
          </div>
          
          <div className="mt-12 pt-8 border-t border-gray-300 text-sm text-gray-500">
            <p>Golden HomeShare LLC • 1209 E Walnut St • Columbia, MO 65201</p>
            <p className="mt-2">Data Protection Officer: privacy@goldenhomeshare.com</p>
          </div>
        </div>
      </section>
    </div>
  );
} 