"use client";

import { useEffect, useState } from "react";
import { ListingsMap } from "@/app/components/ListingsMap";
import { ListingCard } from "@/app/components/ListingCard";
import { ProductCard } from "@/app/components/ProductCard";
import { notFound, useParams } from "next/navigation";
import { Map, List } from "lucide-react";

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
  const [showMobileMap, setShowMobileMap] = useState(false);

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
      setLoading(false);
    }
    
    fetchData();
  }, [category]);

  const handleVisibleListingsChange = (newVisibleListings: Listing[]) => {
    // Deduplicate listings by ID to prevent duplicate keys
    const uniqueListings = newVisibleListings.filter((listing, index, array) => 
      array.findIndex(l => l.id === listing.id) === index
    );
    setVisibleListings(uniqueListings);
  };

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
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Available Homeshares</h1>
              <p className="text-gray-600 mt-1">
                {/* Show different text based on device and view */}
                <span className="md:hidden">
                  {showMobileMap 
                    ? `${visibleListings.length} of ${data.length} listing${data.length !== 1 ? 's' : ''} visible on map`
                    : `${data.length} listing${data.length !== 1 ? 's' : ''} available`
                  }
                </span>
                <span className="hidden md:inline">
                  {visibleListings.length} of {data.length} listing{data.length !== 1 ? 's' : ''} visible on map
                </span>
              </p>
            </div>
            
            {/* Mobile View Toggle Buttons */}
            <div className="flex md:hidden gap-2">
              <button
                onClick={() => setShowMobileMap(false)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  !showMobileMap 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <List size={16} />
                List
              </button>
              <button
                onClick={() => setShowMobileMap(true)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  showMobileMap 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Map size={16} />
                Map
              </button>
            </div>
          </div>
        </div>
        
        {/* Mobile View - Conditional Rendering */}
        <div className="flex-1 md:hidden">
          {showMobileMap ? (
            /* Mobile Map View */
            <div className="h-full">
              <ListingsMap 
                listings={data} 
                className="w-full h-full"
                onVisibleListingsChange={handleVisibleListingsChange}
              />
            </div>
          ) : (
            /* Mobile List View - Show ALL listings */
            <div className="h-full overflow-y-auto">
              <div className="p-4">
                {data.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500">No listings available</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {data.map((listing, index) => (
                      <ListingCard
                        key={`mobile-all-${index}-${listing.id}`}
                        {...listing}
                        isSelected={selectedListing === listing.id}
                        onClick={() => setSelectedListing(listing.id)}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
        
        {/* Desktop View - Side by Side Layout */}
        <div className="flex-1 hidden md:flex">
          {/* Map - takes remaining space */}
          <div className="flex-1">
            <ListingsMap 
              listings={data} 
              className="w-full h-full"
              onVisibleListingsChange={handleVisibleListingsChange}
            />
          </div>
          
          {/* Listings Sidebar - Right side with grid layout */}
          <div className="w-[600px] bg-white border-l border-gray-200 flex flex-col">
            <div className="p-4 border-b border-gray-200">
              <h2 className="font-semibold text-gray-900">Visible Listings</h2>
              <p className="text-sm text-gray-500 mt-1">
                Showing listings currently visible on the map
              </p>
            </div>
            <div className="flex-1 overflow-y-auto">
              <div className="p-4">
                {visibleListings.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500">
                      {data.length === 0 
                        ? "No listings available" 
                        : "Pan or zoom the map to see listings in this area"
                      }
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-4">
                    {visibleListings.map((listing, index) => (
                      <ListingCard
                        key={`visible-${index}-${listing.id}`}
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