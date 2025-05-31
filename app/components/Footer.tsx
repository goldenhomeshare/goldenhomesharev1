import Link from "next/link";
import { Mail, Phone, MapPin } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-primary/95 text-white">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Company Info & Service Description */}
          <div className="md:col-span-2">
            <h3 className="text-xl font-bold mb-4">Golden HomeShare</h3>
            <p className="text-white/80 mb-4 leading-relaxed">
              A secure homesharing marketplace connecting older adult homeowners with trusted housemates. 
              We facilitate mutually beneficial living arrangements where housemates provide up to 10 hours 
              weekly of light household support and companionship in exchange for affordable accommodation.
            </p>
            <div className="bg-primary/80 border border-white/20 p-4 rounded-lg">
              <h4 className="font-semibold text-white mb-2">Payment Information</h4>
              <p className="text-sm text-white/90">
                All transactions are processed in <strong>USD (US Dollars)</strong>. We facilitate monthly rent payments and platform fees between homeowners and housemates.
              </p>
            </div>
          </div>

          {/* Customer Service Contact */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Customer Service</h4>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-white" />
                <div>
                  <p className="font-medium">(816) 433-2979</p>
                  <p className="text-sm text-white/70">Mon-Fri 8AM-8PM CST</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-white" />
                <div>
                  <p className="font-medium">support@goldenhomeshare.com</p>
                  <p className="text-sm text-white/70">24-hour response</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-white mt-1" />
                <div>
                  <p className="font-medium">Business Address:</p>
                  <p className="text-sm text-white/70">
                    Golden HomeShare LLC<br />
                    1209 E Walnut St<br />
                    Columbia, MO 65201<br />
                    United States
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <div className="space-y-2">
              <Link href="/about" className="block text-white/80 hover:text-white transition-colors">
                About Us
              </Link>
              <Link href="/help" className="block text-white/80 hover:text-white transition-colors">
                Help & Support
              </Link>
              <Link href="/safety" className="block text-white/80 hover:text-white transition-colors">
                Safety Information
              </Link>
              <Link href="/terms" className="block text-white/80 hover:text-white transition-colors">
                Terms of Use
              </Link>
              <Link href="/privacy" className="block text-white/80 hover:text-white transition-colors">
                Privacy Policy
              </Link>
              <Link href="/cost-savings" className="block text-white/80 hover:text-white transition-colors">
                Cost Calculator
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/20 mt-12 pt-8">
          <div className="md:flex md:items-center md:justify-between">
            <div className="text-sm text-white/70">
              <p>&copy; 2024 Golden HomeShare LLC. All rights reserved.</p>
              <p className="mt-1">
                Licensed homesharing platform. All payments processed securely in USD.
              </p>
            </div>
            <div className="mt-4 md:mt-0">
              <p className="text-sm text-white/70">
                Regulated by applicable state and local housing authorities
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
} 