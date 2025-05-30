"use client";

import { useEffect, useRef, useState } from 'react';

interface ApproximateLocationMapProps {
  address: string;
  className?: string;
}

// Simple hash function for consistent offset generation
function simpleHash(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash);
}

// Get general area from address (remove street number/name)
function getGeneralArea(fullAddress: string): string {
  const parts = fullAddress.split(',').map(part => part.trim()).filter(part => part.length > 0);
  if (parts.length >= 2) {
    return parts.slice(1).join(', '); // Remove first part (street address)
  }
  return fullAddress;
}

export function ApproximateLocationMap({ address, className = "" }: ApproximateLocationMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [mapError, setMapError] = useState<string | null>(null);

  useEffect(() => {
    const loadGoogleMaps = async () => {
      if (!address || !window.google) {
        setMapError("Unable to load map");
        return;
      }

      // Check if geometry library is available
      if (!window.google.maps.geometry || !window.google.maps.geometry.spherical) {
        setMapError("Google Maps geometry library not available");
        return;
      }

      try {
        const geocoder = new google.maps.Geocoder();
        
        // Geocode the EXACT address to get precise coordinates
        const result = await new Promise<google.maps.GeocoderResult[]>((resolve, reject) => {
          geocoder.geocode({ address: address }, (results, status) => {
            if (status === 'OK' && results) {
              resolve(results);
            } else {
              reject(new Error(`Geocoding failed: ${status}`));
            }
          });
        });

        if (result.length === 0) {
          throw new Error('No results found');
        }

        const exactLocation = result[0].geometry.location;
        const exactLat = exactLocation.lat();
        const exactLng = exactLocation.lng();
        
        // Create deterministic but random-looking offset based on full address
        const hash = simpleHash(address);
        const offsetLat = (((hash % 1000) / 1000) - 0.5) * 0.004; // ~200m max offset (reduced)
        const offsetLng = ((((hash * 7) % 1000) / 1000) - 0.5) * 0.004;
        
        // Apply offset to create approximate center for the map
        const mapCenter = {
          lat: exactLat + offsetLat,
          lng: exactLng + offsetLng
        };

        // Calculate the distance between exact location and map center
        const offsetDistance = google.maps.geometry.spherical.computeDistanceBetween(
          new google.maps.LatLng(exactLat, exactLng),
          new google.maps.LatLng(mapCenter.lat, mapCenter.lng)
        );

        // Set circle radius to ensure it covers the actual location
        // Minimum 250m radius, or offset distance + 100m buffer, whichever is larger
        const circleRadius = Math.max(250, offsetDistance + 100);

        // Initialize map
        const map = new google.maps.Map(mapRef.current!, {
          center: mapCenter,
          zoom: 15, // Slightly zoomed out for better neighborhood context
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: true,
        });

        // Add a circle to show approximate area that includes the actual location
        new google.maps.Circle({
          strokeColor: '#2563eb',
          strokeOpacity: 0.8,
          strokeWeight: 2,
          fillColor: '#3b82f6',
          fillOpacity: 0.2,
          map: map,
          center: mapCenter,
          radius: circleRadius,
        });

        // Add a center dot at the offset location
        new google.maps.Marker({
          position: mapCenter,
          map: map,
          icon: {
            path: google.maps.SymbolPath.CIRCLE,
            scale: 4,
            fillColor: '#1d4ed8',
            fillOpacity: 1,
            strokeWeight: 0,
          },
        });

        // Optional: Add a very subtle indicator that actual location is within the circle
        // (without showing exact location)
        const infoWindow = new google.maps.InfoWindow({
          content: '<div style="padding: 8px; font-size: 14px; color: #666;">Property located within this area</div>',
          position: mapCenter,
        });

        // Show info window briefly, then close it
        infoWindow.open(map);
        setTimeout(() => {
          infoWindow.close();
        }, 3000);

      } catch (error) {
        console.error('Error loading map:', error);
        setMapError('Unable to load map for this location');
      }
    };

    // Load Google Maps API if not already loaded
    if (typeof window !== 'undefined') {
      if (window.google && window.google.maps && window.google.maps.geometry) {
        loadGoogleMaps();
      } else {
        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=geometry`;
        script.async = true;
        script.onload = () => {
          // Add a small delay to ensure geometry library is fully initialized
          setTimeout(() => {
            if (window.google && window.google.maps && window.google.maps.geometry) {
              loadGoogleMaps();
            } else {
              setMapError('Google Maps geometry library failed to load');
            }
          }, 100);
        };
        script.onerror = () => setMapError('Failed to load Google Maps');
        document.head.appendChild(script);
      }
    }
  }, [address]);

  if (mapError) {
    return (
      <div className={`flex items-center justify-center bg-gray-100 rounded-lg ${className}`}>
        <div className="text-center p-8">
          <div className="text-gray-500 mb-2">🗺️</div>
          <p className="text-gray-600">{mapError}</p>
          <p className="text-sm text-gray-500 mt-2">General location: {getGeneralArea(address)}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-gray-100 rounded-lg overflow-hidden ${className}`}>
      <div ref={mapRef} className="w-full h-full min-h-[300px]" />
    </div>
  );
}

// Extend Window interface for TypeScript
declare global {
  interface Window {
    google: any;
  }
} 