"use client";

import Link from "next/link";
import Image from "next/image";
import { Shield, CheckCircle, Search, AlertTriangle, FileText, Eye, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

export default function BackgroundChecks() {
  const [isExpanded, setIsExpanded] = useState(false);
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-white">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-16">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-xl font-medium mb-4 bg-gradient-to-r from-amber-500 to-amber-600 bg-clip-text text-transparent">GoldenProtect — Background checks</p>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">Safe homesharing starts with background checks</h2>
              <p className="text-lg text-gray-600 leading-relaxed">
                When it comes to welcoming a housemate into your home, safety means the world. That's why we run a background check on every helper before they can message or request to book with homeowners.*
              </p>
            </div>
            <div className="relative">
              <div className="w-full h-[300px] overflow-hidden rounded-2xl">
                <Image 
                  src="/safety screening.png" 
                  alt="Safe and secure homesharing community" 
                  width={600}
                  height={300}
                  className="w-full h-full object-contain"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Background Check Details Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 md:px-8">
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Criminal background checks</h2>
            <p className="text-lg text-gray-600">
              We provide comprehensive background checks to help ensure the safety of our homesharing community—because your peace of mind matters to us.
            </p>
          </div>

          {/* Dropdown Card */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
            <button 
              className="w-full flex items-center justify-between p-6 border-b border-gray-200 hover:bg-gray-50 transition-colors"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              <div className="flex items-center">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mr-4">
                  <Shield className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">Golden HomeShare Background Check</h3>
              </div>
              {isExpanded ? (
                <ChevronUp className="w-6 h-6 text-gray-400" />
              ) : (
                <ChevronDown className="w-6 h-6 text-gray-400" />
              )}
            </button>

            {isExpanded && (
              <div className="p-6">
                <div className="mb-6">
                  <h4 className="font-semibold text-gray-900 mb-2">What it is</h4>
                  <p className="text-gray-600">
                    Initial criminal background check run on all individual helpers you can hire on Golden HomeShare.
                  </p>
                </div>

                <div className="mb-6">
                  <h4 className="font-semibold text-gray-900 mb-2">When to use it</h4>
                  <p className="text-gray-600">
                    Already completed on all individual helpers you can hire.
                  </p>
                </div>

                <div className="mb-6">
                  <h4 className="font-semibold text-gray-900 mb-2">Report availability</h4>
                  <p className="text-gray-600">
                    Homeowners can see that the check was completed, but cannot review detailed background check reports.
                  </p>
                </div>

                <div className="mb-8">
                  <h4 className="font-semibold text-gray-900 mb-4">What it includes</h4>
                  <ul className="space-y-3">
                    <li className="flex items-center">
                      <CheckCircle className="w-5 h-5 text-primary mr-3 flex-shrink-0" />
                      <span className="text-gray-700">County criminal records</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="w-5 h-5 text-primary mr-3 flex-shrink-0" />
                      <span className="text-gray-700">National criminal databases</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="w-5 h-5 text-primary mr-3 flex-shrink-0" />
                      <span className="text-gray-700">Sex offender registries</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="w-5 h-5 text-primary mr-3 flex-shrink-0" />
                      <span className="text-gray-700">Global watchlists</span>
                    </li>
                  </ul>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Performed by Checkr</span>
                  <Link 
                    href="/about/safety/background-checks/details" 
                    className="text-primary hover:text-primary/80 font-medium underline"
                  >
                    Learn more
                  </Link>
                </div>
              </div>
            )}
          </div>

          <div className="mt-8">
            <div className="bg-primary/5 border border-primary/20 rounded-2xl p-6">
              <div className="flex items-start">
                <AlertTriangle className="w-6 h-6 text-primary mr-3 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Screening Process</h4>
                  <p className="text-gray-700">
                    Every helper is screened through Checkr, a nationally recognized background check provider. To qualify, they must have a clean criminal record with no felonies, misdemeanors, or other criminal offenses that are shown on the background check. Minor traffic violations are excluded from our search. This strict screening ensures all helpers meet our high standards for safety and trust.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* When Checks Are Required */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="text-center mb-16">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <Shield className="w-10 h-10 text-primary" />
            </div>
            <h2 className="text-2xl text-gray-900 mb-2">When Background Checks Are Required</h2>
            <p className="text-gray-600 max-w-3xl mx-auto">
              To ensure community safety, background checks must be completed before certain platform activities
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6 text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="w-6 h-6 text-primary" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Before Messaging</h4>
              <p className="text-sm text-gray-600">Helpers must complete background verification before they can send messages to homeowners.</p>
            </div>

            <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6 text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Eye className="w-6 h-6 text-primary" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Before Booking Requests</h4>
              <p className="text-sm text-gray-600">Only verified helpers can submit booking requests or applications to homeowners.</p>
            </div>


          </div>
        </div>
      </section>

      {/* Important Notice Section */}
      <section className="py-16">
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
            Questions About Background Checks?
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Our safety team is here to help. Contact us with any questions or concerns about our background check process.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/safety"
              className="inline-flex items-center bg-primary hover:bg-primary/90 text-white px-8 py-4 rounded-2xl font-semibold text-lg transition-colors shadow-lg"
            >
              View Safety Overview
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