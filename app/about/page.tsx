import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Users, Shield, Heart, Calculator } from "lucide-react";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "About Us | Golden HomeShare",
    description: "Learn about Golden HomeShare's mission to connect older adults with trusted housemates, creating meaningful relationships while addressing housing affordability.",
  };
}

export default function About() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-white">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-16">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              About Golden HomeShare
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We're revolutionizing how older adults and young professionals connect, 
              creating meaningful relationships while addressing housing affordability and companionship needs.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Mission</h2>
              <p className="text-lg text-gray-600 mb-6">
                Golden HomeShare bridges generations by connecting homeowners who have spare rooms 
                with individuals seeking affordable housing and meaningful community connections.
              </p>
              <p className="text-lg text-gray-600 mb-6">
                Our platform facilitates safe, mutually beneficial living arrangements where housemates 
                provide light household support and companionship in exchange for affordable accommodation.
              </p>
              <Link 
                href="/onboarding"
                className="inline-flex items-center bg-primary hover:bg-primary/90 text-white px-8 py-4 rounded-2xl font-semibold text-lg transition-colors shadow-lg"
              >
                Get Started
              </Link>
            </div>
            <div className="relative">
              <div className="w-full h-[400px] overflow-hidden rounded-2xl">
                <Image 
                  src="/old-young-hero.jpg" 
                  alt="Intergenerational connection" 
                  width={600}
                  height={400}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Why Choose Golden HomeShare?
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-lg text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Shield className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Safety First</h3>
              <p className="text-gray-600">
                Comprehensive background checks, references, and verification ensure all participants are trustworthy and reliable.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-lg text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Perfect Matches</h3>
              <p className="text-gray-600">
                Our sophisticated matching algorithm connects compatible individuals based on lifestyle, preferences, and needs.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-lg text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Heart className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Ongoing Support</h3>
              <p className="text-gray-600">
                We provide continued guidance and support throughout your homesharing journey to ensure success.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Cost Savings Link Section */}
      <section className="bg-white py-16">
        <div className="max-w-4xl mx-auto px-4 md:px-8 text-center">
          <div className="bg-gradient-to-r from-primary/10 to-blue-50 p-8 rounded-2xl">
            <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Calculator className="w-8 h-8 text-primary" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Discover Your Savings Potential
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              See how much you can save on in-home support costs or rental expenses with our interactive cost calculator.
            </p>
            <Link 
              href="/cost-savings"
              className="inline-flex items-center bg-primary hover:bg-primary/90 text-white px-8 py-4 rounded-2xl font-semibold text-lg transition-colors shadow-lg"
            >
              Calculate Your Savings
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            How Golden HomeShare Works
          </h2>
          
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-6">For Homeowners</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-sm font-semibold">1</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Complete Your Profile</h4>
                    <p className="text-gray-600">Tell us about your home, preferences, and what kind of support you'd appreciate.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-sm font-semibold">2</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Get Matched</h4>
                    <p className="text-gray-600">We'll connect you with pre-screened housemates who align with your needs and lifestyle.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-sm font-semibold">3</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Welcome Your Housemate</h4>
                    <p className="text-gray-600">Enjoy companionship, light household support, and extra income from your new living arrangement.</p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-6">For Housemates</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-sm font-semibold">1</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Apply & Get Verified</h4>
                    <p className="text-gray-600">Complete our application process including background checks and references.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-sm font-semibold">2</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Find Your Home</h4>
                    <p className="text-gray-600">Browse available rooms and connect with homeowners who match your preferences.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-sm font-semibold">3</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Move In & Contribute</h4>
                    <p className="text-gray-600">Enjoy affordable housing while providing companionship and light household support.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-primary/5 py-16">
        <div className="max-w-4xl mx-auto px-4 md:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Join our community today and discover the benefits of intergenerational homesharing.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/onboarding"
              className="inline-flex items-center bg-primary hover:bg-primary/90 text-white px-8 py-4 rounded-2xl font-semibold text-lg transition-colors shadow-lg"
            >
              Join Golden HomeShare
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