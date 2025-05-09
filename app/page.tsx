import { ProductRow } from "../app/components/ProductRow";
import Image from "next/image";
import { Users, Shield, Layers } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <section className="mb-24 px-4 md:px-8">
      {/* Development Notice Banner */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-blue-500 to-primary shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-2 text-center">
          <p className="text-white font-medium text-sm sm:text-base">
            <span className="inline-block mr-2 rounded-full bg-white/20 px-2 py-0.5 text-xs font-semibold">
              COMING SOON
            </span>
            This platform is currently in development and will be launching in Summer 2025
          </p>
        </div>
      </div>

      {/* Add padding to account for the fixed banner */}
      <div className="pt-12"></div>

      {/* Hero Section with Primary Background */}
      <div className="max-w-7xl mx-auto bg-primary text-white py-16 md:py-24 px-4 md:px-8 mb-12 rounded-2xl">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div className="space-y-6">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
              Turn a Spare Room Into Connection, Support, and Monthly Income.
            </h1>
            <p className="text-lg md:text-xl">
              Golden HomeShare connects older adults looking for support or friendly companionship with
              vetted housemates who provide light household help for affordable housing. It's a win-win!
            </p>
          </div>
          <div className="hidden md:block">
            <div className="relative h-[400px] w-full rounded-lg overflow-hidden">
              <Image
                src="/helpful.jpg"
                alt="Homeowner and homesharer together"
                fill
                style={{ objectFit: "cover" }}
                priority
              />
            </div>
          </div>
        </div>
      </div>

      {/* Test Signup Links */}
      <div className="max-w-7xl mx-auto mb-16 flex justify-center gap-4">
        <Link
          href="/test-onboarding-flow/homeowner"
          className="bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-lg flex items-center justify-center font-medium"
        >
          Test Homeowner Signup
        </Link>
        <Link
          href="/test-onboarding-flow/housemate"
          className="bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-lg flex items-center justify-center font-medium"
        >
          Test Housemate Signup
        </Link>
      </div>

      {/* Features */}
      <div className="max-w-7xl mx-auto mb-20">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
          Golden HomeShare Makes Sharing A Home Safe & Simple
        </h2>
        <p className="text-center text-lg text-muted-foreground mb-12 max-w-3xl mx-auto">
          Golden HomeShare is a platform that connects older adults looking for safe and affordable homesharing
          arrangements with vetted housemates. Our priority is safety and simplicity in finding a match
          that feels comfortable for you. We're with you every step of the way!
        </p>
        <div className="grid md:grid-cols-3 gap-6">
          {/* Feature 1 */}
          <div className="bg-slate-50 p-8 rounded-lg">
            <div className="bg-primary text-white w-14 h-14 rounded flex items-center justify-center mb-6">
              <Users size={24} />
            </div>
            <h3 className="text-xl font-semibold mb-4">Well Matched</h3>
            <p className="text-muted-foreground">
              Golden HomeShare uses a sophisticated matching algorithm and real human support staff to create a space where compatible homeowners and housemates can connect.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="bg-slate-50 p-8 rounded-lg">
            <div className="bg-primary text-white w-14 h-14 rounded flex items-center justify-center mb-6">
              <Shield size={24} />
            </div>
            <h3 className="text-xl font-semibold mb-4">Safe & Supportive</h3>
            <p className="text-muted-foreground">
              At Golden HomeShare each participant must verify their identity, email address, phone number, and pass a background check before entering into a homesharing arrangement. Our team of real humans are there to support you throughout the process.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="bg-slate-50 p-8 rounded-lg">
            <div className="bg-primary text-white w-14 h-14 rounded flex items-center justify-center mb-6">
              <Layers size={24} />
            </div>
            <h3 className="text-xl font-semibold mb-4">All-in-one</h3>
            <p className="text-muted-foreground">
              The Golden HomeShare platform does it all! You can view your matches, see the ways in which you are compatible, chat and have video calls to get to know each other right in the platform. Using our process, by the time you're ready to move in together you won't feel like strangers.
            </p>
          </div>
        </div>
      </div>

      {/* Safety Section */}
      <div className="relative bg-primary text-white py-16 md:py-20 px-4 md:px-8 rounded-2xl mb-20 overflow-hidden">
        <div className="grid md:grid-cols-2 gap-8 items-center max-w-7xl mx-auto">
          <div className="relative md:h-[400px]">
            <Image
              src="/trust.jpg"
              alt="Smiling homeowner"
              width={500}
              height={600}
              className="mx-auto md:mx-0 rounded-lg object-cover h-[300px] md:h-full w-auto"
            />
          </div>
          <div className="space-y-6 md:ml-auto max-w-xl">
            <div className="flex justify-center mb-4">
              <div className="bg-white/20 p-4 rounded-lg inline-block">
                <Shield size={32} className="text-white" />
              </div>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-center md:text-left">Safety Is Our Priority</h2>
            <p className="text-lg md:text-xl text-center md:text-left">
              At Golden HomeShare we value the safety of our Hosts and Guests.
              The Golden HomeShare team is with you every step of the way.
            </p>
          </div>
        </div>
      </div>

      {/* Safety Features */}
      <div className="max-w-7xl mx-auto grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
        <div className="bg-slate-50 p-6 rounded-lg">
          <div className="bg-primary text-white w-10 h-10 rounded-full flex items-center justify-center mb-4">
            <Shield size={20} />
          </div>
          <h3 className="text-lg font-semibold">Background Check required on all Hosts and Guests</h3>
        </div>
        <div className="bg-slate-50 p-6 rounded-lg">
          <div className="bg-primary text-white w-10 h-10 rounded-full flex items-center justify-center mb-4">
            <Shield size={20} />
          </div>
          <h3 className="text-lg font-semibold">Host identification and address verified</h3>
        </div>
        <div className="bg-slate-50 p-6 rounded-lg">
          <div className="bg-primary text-white w-10 h-10 rounded-full flex items-center justify-center mb-4">
            <Shield size={20} />
          </div>
          <h3 className="text-lg font-semibold">Secure homeshare agreements to protect both parties</h3>
        </div>
        <div className="bg-slate-50 p-6 rounded-lg">
          <div className="bg-primary text-white w-10 h-10 rounded-full flex items-center justify-center mb-4">
            <Shield size={20} />
          </div>
          <h3 className="text-lg font-semibold">Dedicated mediation support for any conflicts or concerns</h3>
        </div>
      </div>

      {/* Product Rows */}
      <ProductRow category="newest" />
      <ProductRow category="templates" />
      <ProductRow category="icons" />
      <ProductRow category="uikits" />
    </section>
  );
}
