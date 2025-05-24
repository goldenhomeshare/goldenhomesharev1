"use client";

import { useEffect, useState, useCallback } from "react";
import { ListingsMap } from "@/app/components/ListingsMap";
import { ListingCard } from "@/app/components/ListingCard";
import { ProductCard } from "@/app/components/ProductCard";
import { notFound, useParams } from "next/navigation";

interface Listing {
  id: string;
  name: string;
  price: number;
  smallDescription: string;
  images: string[];
  address?: string;
  amenities?: string[];
}

async function getData(category: string) {
  try {
    const response = await fetch(`/api/products?category=${category}`, {
      cache: 'no-store'
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch data');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching data:', error);
    return [];
  }
}

export default function CategoryPage() {
  const params = useParams();
  const category = params.category as string;
  const [data, setData] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedListing, setSelectedListing] = useState<string | null>(null);
  const [visibleListings, setVisibleListings] = useState<Listing[]>([]);
  const [allMarkers, setAllMarkers] = useState<{ listing: Listing; position: google.maps.LatLng }[]>([]);

  useEffect(() => {
    async function fetchData() {
      if (!category) return;
      
      // Validate category
      if (!['template', 'uikit', 'icon', 'all'].includes(category)) {
        notFound();
        return;
      }
      
      setLoading(true);
      const result = await getData(category);
      setData(result);
      setVisibleListings(result); // Initially show all listings
      setLoading(false);
    }
    
    fetchData();
  }, [category]);

  // Handle map bounds change to filter visible listings
  const handleBoundsChange = useCallback((bounds: google.maps.LatLngBounds) => {
    if (!allMarkers.length) return;

    const listenersInBounds = allMarkers.filter(marker => 
      bounds.contains(marker.position)
    );

    setVisibleListings(listenersInBounds.map(marker => marker.listing));
  }, [allMarkers]);

  // Handle markers ready callback
  const handleMarkersReady = useCallback((markers: { listing: Listing; position: google.maps.LatLng }[]) => {
    setAllMarkers(markers);
    // Initially trigger bounds change with current map bounds if available
    if (markers.length > 0) {
      setVisibleListings(markers.map(marker => marker.listing));
    }
  }, []);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500">Loading...</div>
        </div>
      </div>
    );
  }

  // If this is the template category, show the map view with sidebar grid layout
  if (category === 'template') {
    return (
      <div className="h-screen flex flex-col">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-4 md:px-8 py-4 z-10">
          <h1 className="text-2xl font-bold text-gray-900">Available Homeshares</h1>
          <p className="text-gray-600 mt-1">
            {visibleListings.length} of {data.length} listing{data.length !== 1 ? 's' : ''} visible
          </p>
        </div>
        
        {/* Map and Sidebar Layout */}
        <div className="flex-1 flex">
          {/* Map - takes remaining space */}
          <div className="flex-1">
            <ListingsMap 
              listings={data} 
              className="w-full h-full"
              onBoundsChange={handleBoundsChange}
              onMarkersReady={handleMarkersReady}
            />
          </div>
          
          {/* Listings Sidebar - Right side with grid layout */}
          <div className="w-[600px] bg-white border-l border-gray-200 flex flex-col">
            <div className="p-4 border-b border-gray-200">
              <h2 className="font-semibold text-gray-900">Visible Listings</h2>
              <p className="text-sm text-gray-500 mt-1">
                Showing {visibleListings.length} listing{visibleListings.length !== 1 ? 's' : ''} in current map view
              </p>
            </div>
            <div className="flex-1 overflow-y-auto">
              <div className="p-4">
                {visibleListings.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500">No listings visible in current map area</p>
                    <p className="text-sm text-gray-400 mt-2">Try zooming out or moving the map</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-4">
                    {visibleListings.map((listing) => (
                      <ListingCard
                        key={listing.id}
                        {...listing}
                        isSelected={selectedListing === listing.id}
                        onClick={() => setSelectedListing(listing.id)}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // For other categories, show the original grid view
  return (
    <section className="max-w-7xl mx-auto px-4 md:px-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 sm:grid-cols-2 gap-10 mt-4">
        {data.map((product) => (
          <ProductCard
            key={product.id}
            images={product.images}
            price={product.price}
            name={product.name}
            id={product.id}
            smallDescription={product.smallDescription}
          />
        ))}
      </div>
    </section>
  );
}