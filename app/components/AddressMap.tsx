"use client";

import { useState, useEffect } from "react";

interface AddressMapProps {
  address: string;
  className?: string;
}

export function AddressMap({ address, className = "" }: AddressMapProps) {
  const [mapSrc, setMapSrc] = useState<string>("");

  useEffect(() => {
    if (address && address.trim()) {
      // Encode the address for use in URL
      const encodedAddress = encodeURIComponent(address.trim());
      
      // Check if Google Maps API key is available
      const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
      
      if (apiKey && apiKey !== 'DEMO_KEY') {
        // Use Google Maps Embed API with API key
        const src = `https://www.google.com/maps/embed/v1/place?key=${apiKey}&q=${encodedAddress}`;
        setMapSrc(src);
      } else {
        // Fallback: Use basic Google Maps iframe (limited functionality but works)
        const src = `https://maps.google.com/maps?q=${encodedAddress}&t=&z=15&ie=UTF8&iwloc=&output=embed`;
        setMapSrc(src);
      }
    } else {
      setMapSrc("");
    }
  }, [address]);

  if (!address || !address.trim() || !mapSrc) {
    return (
      <div className={`bg-gray-100 rounded-lg flex items-center justify-center h-64 ${className}`}>
        <p className="text-gray-500 text-sm">Enter an address to see the location on the map</p>
      </div>
    );
  }

  return (
    <div className={`relative rounded-lg overflow-hidden border ${className}`}>
      <iframe
        src={mapSrc}
        width="100%"
        height="300"
        style={{ border: 0 }}
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        className="w-full"
        title={`Map showing ${address}`}
      />
    </div>
  );
} 