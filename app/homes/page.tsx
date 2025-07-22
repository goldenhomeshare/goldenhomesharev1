import { AirbnbStyleRow } from "@/app/components/AirbnbStyleRow";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Rooms Available Section - Row 1 */}
      <section className="mb-8 px-6 pt-8">
        <AirbnbStyleRow category="rooms" />
      </section>
      
      {/* Rooms Available Section - Row 2 */}
      <section className="mb-8 px-6">
        <AirbnbStyleRow category="rooms" />
      </section>
    </div>
  );
} 