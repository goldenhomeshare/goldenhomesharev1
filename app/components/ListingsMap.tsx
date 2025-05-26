"use client";

import { useEffect, useRef, useState } from 'react';

interface Listing {
  id: string;
  name: string;
  price: number;
  smallDescription: string;
  images: string[];
  address?: string;
}

interface ListingsMapProps {
  listings: Listing[];
  className?: string;
  onVisibleListingsChange?: (visibleListings: Listing[]) => void;
}

// Global variables to track script loading state
let isGoogleMapsLoading = false;
let isGoogleMapsLoaded = false;
const googleMapsCallbacks: (() => void)[] = [];

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

function loadGoogleMapsScript(): Promise<void> {
  return new Promise((resolve, reject) => {
    // If already loaded, resolve immediately
    if (isGoogleMapsLoaded && window.google && window.google.maps) {
      resolve();
      return;
    }

    // Add callback to queue
    googleMapsCallbacks.push(resolve);

    // If already loading, just wait for it
    if (isGoogleMapsLoading) {
      return;
    }

    // Check if script already exists
    const existingScript = document.querySelector('script[src*="maps.googleapis.com"]');
    if (existingScript) {
      isGoogleMapsLoaded = true;
      // Execute all callbacks
      googleMapsCallbacks.forEach(callback => callback());
      googleMapsCallbacks.length = 0;
      return;
    }

    isGoogleMapsLoading = true;

    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=geometry`;
    script.async = true;
    
    script.onload = () => {
      isGoogleMapsLoaded = true;
      isGoogleMapsLoading = false;
      // Execute all callbacks
      googleMapsCallbacks.forEach(callback => callback());
      googleMapsCallbacks.length = 0;
    };
    
    script.onerror = () => {
      isGoogleMapsLoading = false;
      reject(new Error('Failed to load Google Maps'));
    };
    
    document.head.appendChild(script);
  });
}

export function ListingsMap({ listings, className = "", onVisibleListingsChange }: ListingsMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [mapError, setMapError] = useState<string | null>(null);
  const [selectedListing, setSelectedListing] = useState<string | null>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<google.maps.Marker[]>([]);
  const infoWindowsRef = useRef<google.maps.InfoWindow[]>([]);
  const listingsWithPositionsRef = useRef<(Listing & { position: google.maps.LatLng })[]>([]);

  // Function to check if a position is within map bounds and notify parent
  const updateVisibleListings = () => {
    if (!mapInstanceRef.current || !onVisibleListingsChange) return;
    
    const bounds = mapInstanceRef.current.getBounds();
    if (!bounds) return;

    const visibleListings = listingsWithPositionsRef.current
      .filter(listing => bounds.contains(listing.position))
      .map(({ position, ...listing }) => listing); // Remove position from the returned object
    
    // Deduplicate by ID to prevent duplicate keys in React
    const uniqueVisibleListings = visibleListings.filter((listing, index, array) => 
      array.findIndex(l => l.id === listing.id) === index
    );
    
    onVisibleListingsChange(uniqueVisibleListings);
  };

  useEffect(() => {
    const initializeMap = async () => {
      if (!mapRef.current) return;

      try {
        await loadGoogleMapsScript();

        // Clear existing markers and info windows
        markersRef.current.forEach(marker => marker.setMap(null));
        infoWindowsRef.current.forEach(infoWindow => infoWindow.close());
        markersRef.current = [];
        infoWindowsRef.current = [];
        listingsWithPositionsRef.current = [];

        // Default center (can be updated based on listings)
        const defaultCenter = { lat: 38.9517, lng: -92.3341 }; // Columbia, MO

        // Initialize map only if we don't have one
        if (!mapInstanceRef.current) {
          mapInstanceRef.current = new google.maps.Map(mapRef.current, {
            center: defaultCenter,
            zoom: 12,
            mapTypeControl: false,
            streetViewControl: false,
            fullscreenControl: true,
            styles: [
              {
                featureType: "poi",
                elementType: "labels",
                stylers: [{ visibility: "off" }]
              }
            ]
          });

          // Add map bounds change listener
          mapInstanceRef.current.addListener('bounds_changed', () => {
            // Use a small delay to avoid too frequent updates during dragging
            setTimeout(updateVisibleListings, 100);
          });
        }

        const map = mapInstanceRef.current;
        const geocoder = new google.maps.Geocoder();
        const bounds = new google.maps.LatLngBounds();

        // Process each listing that has an address
        for (const listing of listings) {
          if (!listing.address) continue;

          try {
            // Geocode the address
            const result = await new Promise<google.maps.GeocoderResult[]>((resolve, reject) => {
              geocoder.geocode({ address: listing.address }, (results, status) => {
                if (status === 'OK' && results) {
                  resolve(results);
                } else {
                  reject(new Error(`Geocoding failed: ${status}`));
                }
              });
            });

            if (result.length === 0) continue;

            const location = result[0].geometry.location;
            const lat = location.lat();
            const lng = location.lng();

            // Create offset for privacy
            const hash = simpleHash(listing.address + listing.id);
            const offsetLat = (((hash % 1000) / 1000) - 0.5) * 0.008; // ~400m max offset
            const offsetLng = ((((hash * 7) % 1000) / 1000) - 0.5) * 0.008;
            
            const offsetPosition = new google.maps.LatLng(lat + offsetLat, lng + offsetLng);

            // Store listing with its position for bounds checking
            listingsWithPositionsRef.current.push({
              ...listing,
              position: offsetPosition
            });

            // Create custom marker icon with price
            const markerIcon = {
              url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
                <svg xmlns="http://www.w3.org/2000/svg" width="80" height="40" viewBox="0 0 80 40">
                  <rect x="2" y="2" width="76" height="36" rx="18" ry="18" 
                        fill="white" stroke="#d1d5db" stroke-width="2"/>
                  <text x="40" y="24" text-anchor="middle" 
                        font-family="Arial, sans-serif" font-size="14" font-weight="bold" 
                        fill="#374151">$${listing.price}</text>
                </svg>
              `)}`,
              scaledSize: new google.maps.Size(80, 40),
              anchor: new google.maps.Point(40, 20),
            };

            // Create marker
            const marker = new google.maps.Marker({
              position: offsetPosition,
              map: map,
              icon: markerIcon,
              title: listing.name,
            });

            // Create info window content with image carousel and translucent X
            const imageHtml = listing.images.length > 0 
              ? `<div style="position: relative; width: 280px; height: 187px; overflow: hidden; border-radius: 12px 12px 0 0;">
                   <div id="image-container-${listing.id}" style="width: 100%; height: 100%; position: relative;">
                     ${listing.images.map((image, index) => 
                       `<img src="${image}" alt="${listing.name} - Image ${index + 1}" 
                            style="width: 100%; height: 100%; object-fit: cover; position: absolute; top: 0; left: 0; 
                                   opacity: ${index === 0 ? '1' : '0'}; transition: opacity 0.3s ease;" 
                            id="image-${listing.id}-${index}" />`
                     ).join('')}
                   </div>
                   ${listing.images.length > 1 ? `
                     <div id="prev-btn-${listing.id}" style="position: absolute; left: 12px; top: 50%; transform: translateY(-50%); width: 32px; height: 32px; background: rgba(0,0,0,0.8); border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer;">
                       <svg width="16" height="16" fill="white" viewBox="0 0 24 24">
                         <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/>
                       </svg>
                     </div>
                     <div id="next-btn-${listing.id}" style="position: absolute; right: 12px; top: 50%; transform: translateY(-50%); width: 32px; height: 32px; background: rgba(0,0,0,0.8); border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer;">
                       <svg width="16" height="16" fill="white" viewBox="0 0 24 24">
                         <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/>
                       </svg>
                     </div>
                     <div id="dots-container-${listing.id}" style="position: absolute; bottom: 12px; left: 50%; transform: translateX(-50%); display: flex; gap: 6px;">
                       ${listing.images.map((_, index) => 
                         `<div class="image-dot" data-index="${index}" style="width: 8px; height: 8px; border-radius: 50%; background: ${index === 0 ? 'white' : 'rgba(255,255,255,0.5)'}; cursor: pointer; transition: background 0.3s ease;"></div>`
                       ).join('')}
                     </div>
                   ` : ''}
                   <div id="close-btn-${listing.id}" style="position: absolute; top: 12px; left: 12px; width: 32px; height: 32px; background: rgba(0,0,0,0.8); border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer;">
                     <svg width="16" height="16" fill="white" viewBox="0 0 24 24">
                       <path d="M6.225 4.811a1 1 0 00-1.414 1.414L10.586 12 4.81 17.775a1 1 0 101.414 1.414L12 13.414l5.775 5.775a1 1 0 001.414-1.414L13.414 12l5.775-5.775a1 1 0 00-1.414-1.414L12 10.586 6.225 4.81z"/>
                     </svg>
                   </div>
                 </div>`
              : `<div style="position: relative; width: 280px; height: 187px; background-color: #f3f4f6; border-radius: 12px 12px 0 0; display: flex; align-items: center; justify-content: center; color: #9ca3af;">
                   <svg width="40" height="40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                     <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                   </svg>
                   <div id="close-btn-${listing.id}" style="position: absolute; top: 12px; left: 12px; width: 32px; height: 32px; background: rgba(0,0,0,0.8); border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer;">
                     <svg width="16" height="16" fill="white" viewBox="0 0 24 24">
                       <path d="M6.225 4.811a1 1 0 00-1.414 1.414L10.586 12 4.81 17.775a1 1 0 101.414 1.414L12 13.414l5.775 5.775a1 1 0 001.414-1.414L13.414 12l5.775-5.775a1 1 0 00-1.414-1.414L12 10.586 6.225 4.81z"/>
                     </svg>
                   </div>
                 </div>`;

            // Create info window with clickable card design
            const infoWindow = new google.maps.InfoWindow({
              content: `
                <div id="listing-card-${listing.id}" style="
                  width: 280px; 
                  background: white; 
                  border-radius: 12px; 
                  overflow: hidden; 
                  box-shadow: 0 10px 25px rgba(0,0,0,0.15);
                  cursor: pointer;
                  transition: transform 0.2s;
                " onmouseover="this.style.transform='scale(1.02)'" onmouseout="this.style.transform='scale(1)'" onclick="window.open('/product/${listing.id}', '_blank')">
                  ${imageHtml}
                  <div style="padding: 16px;">
                    <h3 style="font-size: 16px; font-weight: 600; margin: 0 0 8px 0; color: #111827; line-height: 1.3; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${listing.name}</h3>
                    <p style="font-size: 14px; color: #6b7280; margin: 0 0 12px 0; line-height: 1.4; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${listing.smallDescription}</p>
                    <p style="font-size: 14px; font-weight: 600; margin: 0; color: #374151;">$${listing.price} per month</p>
                  </div>
                </div>
              `,
              disableAutoPan: false,
              headerDisabled: true,
              pixelOffset: new google.maps.Size(0, 0),
            });

            // Add click listener to marker
            marker.addListener('click', () => {
              // Close all other info windows
              infoWindowsRef.current.forEach(iw => iw.close());
              
              // Open this info window
              infoWindow.open(map, marker);
              
              // Update selected listing
              setSelectedListing(listing.id);
              map.setCenter(offsetPosition);
              map.setZoom(15);
            });

            // Add event listener for close button after info window is added to DOM
            google.maps.event.addListener(infoWindow, 'domready', () => {
              // Hide Google Maps default close button and other UI elements
              const style = document.createElement('style');
              style.textContent = `
                .gm-ui-hover-effect { display: none !important; }
                .gm-style-iw-chr { display: none !important; }
                .gm-style-iw-tc { display: none !important; }
                .gm-style-iw-cl { display: none !important; }
                .gm-style-iw-d { overflow: hidden !important; }
                .gm-style-iw { 
                  padding: 0 !important; 
                  border-radius: 12px !important;
                  box-shadow: none !important;
                }
                .gm-style-iw-tc::after { display: none !important; }
              `;
              document.head.appendChild(style);

              // Image carousel functionality
              let currentImageIndex = 0;
              const totalImages = listing.images.length;

              const showImage = (index: number) => {
                // Hide all images
                for (let i = 0; i < totalImages; i++) {
                  const img = document.getElementById(`image-${listing.id}-${i}`);
                  if (img) img.style.opacity = '0';
                }
                
                // Show current image
                const currentImg = document.getElementById(`image-${listing.id}-${index}`);
                if (currentImg) currentImg.style.opacity = '1';
                
                // Update dots
                const dots = document.querySelectorAll(`#dots-container-${listing.id} .image-dot`);
                dots.forEach((dot, i) => {
                  (dot as HTMLElement).style.background = i === index ? 'white' : 'rgba(255,255,255,0.5)';
                });
                
                currentImageIndex = index;
              };

              // Previous button
              const prevBtn = document.getElementById(`prev-btn-${listing.id}`);
              if (prevBtn) {
                prevBtn.addEventListener('click', (e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  const newIndex = currentImageIndex > 0 ? currentImageIndex - 1 : totalImages - 1;
                  showImage(newIndex);
                });
              }

              // Next button
              const nextBtn = document.getElementById(`next-btn-${listing.id}`);
              if (nextBtn) {
                nextBtn.addEventListener('click', (e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  const newIndex = currentImageIndex < totalImages - 1 ? currentImageIndex + 1 : 0;
                  showImage(newIndex);
                });
              }

              // Dot navigation
              const dots = document.querySelectorAll(`#dots-container-${listing.id} .image-dot`);
              dots.forEach((dot, index) => {
                dot.addEventListener('click', (e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  showImage(index);
                });
              });

              // Add click handler for custom close button
              const closeButton = document.getElementById(`close-btn-${listing.id}`);
              if (closeButton) {
                closeButton.addEventListener('click', (e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  infoWindow.close();
                });
              }
            });

            markersRef.current.push(marker);
            infoWindowsRef.current.push(infoWindow);
            bounds.extend(offsetPosition);

          } catch (error) {
            console.error(`Error geocoding listing ${listing.id}:`, error);
          }
        }

        // Fit map to show all markers if we have any
        if (markersRef.current.length > 0) {
          map.fitBounds(bounds);
          // Ensure minimum zoom level
          const listener = google.maps.event.addListener(map, "idle", () => {
            if (map.getZoom()! > 16) map.setZoom(16);
            google.maps.event.removeListener(listener);
            // Initial call to update visible listings after map is ready
            updateVisibleListings();
          });
        } else {
          // If no markers, still call updateVisibleListings to show empty array
          updateVisibleListings();
        }

        // Add map click listener to close info windows
        google.maps.event.addListener(map, 'click', () => {
          infoWindowsRef.current.forEach(infoWindow => infoWindow.close());
          setSelectedListing(null);
        });

      } catch (error) {
        console.error('Error loading map:', error);
        setMapError('Unable to load map');
      }
    };

    if (typeof window !== 'undefined') {
      initializeMap();
    }
  }, [listings]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      markersRef.current.forEach(marker => marker.setMap(null));
      infoWindowsRef.current.forEach(infoWindow => infoWindow.close());
    };
  }, []);

  if (mapError) {
    return (
      <div className={`flex items-center justify-center bg-gray-100 rounded-lg ${className}`}>
        <div className="text-center p-8">
          <div className="text-gray-500 mb-2">🗺️</div>
          <p className="text-gray-600">{mapError}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-gray-100 rounded-lg overflow-hidden ${className}`}>
      <div ref={mapRef} className="w-full h-full min-h-[500px]" />
    </div>
  );
}

// Extend Window interface for TypeScript
declare global {
  interface Window {
    google: any;
  }
} 