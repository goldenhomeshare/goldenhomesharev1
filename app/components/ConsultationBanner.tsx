import Link from 'next/link';

export function ConsultationBanner() {
  return (
    <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 text-white sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-3 flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-0">
          <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left">
            <p className="text-sm font-medium leading-relaxed">
              Need help listing your home or finding a housemate?
            </p>
            <p className="text-sm font-semibold mt-1 sm:mt-0 sm:ml-2">
              Get free support from our experts!
            </p>
          </div>
          <div className="flex-shrink-0">
            <a
              href="tel:8164332979"
              className="inline-flex items-center px-5 py-2.5 border border-transparent text-sm font-medium rounded-md text-emerald-700 bg-white hover:bg-emerald-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-emerald-600 focus:ring-white transition-colors shadow-sm"
            >
              (816) 433-2979
            </a>
          </div>
        </div>
      </div>
    </div>
  );
} 