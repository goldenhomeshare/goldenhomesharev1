import { AirbnbStyleRow } from "@/app/components/AirbnbStyleRow";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Available Homes
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover comfortable rooms in welcoming homes looking for helpful housemates
          </p>
        </div>
      </div>

      {/* Rooms Available Section */}
      <section className="mb-8 px-6">
        <AirbnbStyleRow category="rooms" />
      </section>
    </div>
  );
} 