import { CostComparisonSupport } from "../../components/CostComparisonSupport";
import { CostComparisonRent } from "../../components/CostComparisonRent";
import Link from "next/link";

export default function CostSavings() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <section className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-12">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Cost Savings Calculator
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Discover how much you can save with Golden HomeShare. Compare the costs of traditional in-home support 
              and rental expenses with our affordable homesharing solution.
            </p>
            <Link 
              href="/"
              className="inline-flex items-center text-primary hover:text-primary/80 font-semibold"
            >
              ← Back to Home
            </Link>
          </div>
        </div>
      </section>

      {/* Cost Comparison for In-Home Support */}
      <CostComparisonSupport />

      {/* Cost Comparison for Rent Savings */}
      <CostComparisonRent />

      {/* Call to Action Section */}
      <section className="bg-white py-16">
        <div className="max-w-4xl mx-auto px-4 md:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Ready to Start Saving?
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Join Golden HomeShare today and connect with trusted housemates who can provide 
            companionship and support while helping you save money.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/onboarding"
              className="inline-flex items-center bg-primary hover:bg-primary/90 text-white px-8 py-4 rounded-2xl font-semibold text-lg transition-colors shadow-lg"
            >
              Get Started Today
            </Link>
            <Link 
              href="/about"
              className="inline-flex items-center bg-white hover:bg-gray-50 text-primary border-2 border-primary px-8 py-4 rounded-2xl font-semibold text-lg transition-colors"
            >
              Learn More
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
} 