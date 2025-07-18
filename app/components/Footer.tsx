import Link from "next/link";
import { Mail, Phone, MapPin, Globe } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-12">
        {/* Main footer sections */}
        <div className="grid md:grid-cols-3 gap-8">
          {/* Support Section */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-4">Support</h4>
            <div className="space-y-3 text-sm">
              <Link href="/help" className="block text-gray-700 hover:underline">Help Center</Link>
              <Link href="/safety" className="block text-gray-700 hover:underline">Safety information</Link>
              <Link href="/about/safety/background-checks" className="block text-gray-700 hover:underline">Background checks</Link>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-gray-500" />
                <a href="tel:8164332979" className="text-gray-700 hover:underline">(816) 433-2979</a>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-gray-500" />
                <a href="mailto:support@goldenhomeshare.com" className="text-gray-700 hover:underline">Contact support</a>
              </div>
            </div>
          </div>

          {/* Hosting Section */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-4">Hosting</h4>
            <div className="space-y-3 text-sm">
              <Link href="/list" className="block text-gray-700 hover:underline">List your home</Link>
              <Link href="/homeowner/signup-wizard" className="block text-gray-700 hover:underline">Become a host</Link>
              <Link href="/cost-savings" className="block text-gray-700 hover:underline">Cost calculator</Link>
              <Link href="/homeowner/applications" className="block text-gray-700 hover:underline">View applications</Link>
              <Link href="/homeshare-agreement" className="block text-gray-700 hover:underline">Hosting agreements</Link>
              <Link href="/help" className="block text-gray-700 hover:underline">Hosting resources</Link>
            </div>
          </div>

          {/* Golden HomeShare Section */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-4">Golden HomeShare</h4>
            <div className="space-y-3 text-sm">
              <Link href="/about" className="block text-gray-700 hover:underline">About us</Link>
              <Link href="/housemate/signup-wizard" className="block text-gray-700 hover:underline">Find a home</Link>
              <Link href="/terms" className="block text-gray-700 hover:underline">Terms of service</Link>
              <Link href="/privacy" className="block text-gray-700 hover:underline">Privacy policy</Link>
              <Link href="/billing" className="block text-gray-700 hover:underline">Billing</Link>
              <a href="mailto:support@goldenhomeshare.com" className="block text-gray-700 hover:underline">Contact us</a>
            </div>
          </div>
        </div>

        {/* Bottom section */}
        <div className="flex items-center justify-center pt-8 mt-8 border-t border-gray-200">
          <div className="flex items-center gap-6 text-sm text-gray-600">
            <Link href="/terms" className="hover:underline">Terms</Link>
            <Link href="/privacy" className="hover:underline">Privacy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
} 