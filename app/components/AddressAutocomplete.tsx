"use client";

import { useEffect, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Loader } from "@googlemaps/js-api-loader";

interface AddressAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  name?: string;
}

export function AddressAutocomplete({
  value,
  onChange,
  placeholder = "Enter the full address (e.g., 123 Main St, City, State 12345)",
  className = "",
  name = "address"
}: AddressAutocompleteProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initializeAutocomplete = async () => {
      try {
        const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
        
        if (!apiKey || apiKey === 'DEMO_KEY') {
          // Fallback to regular input if no API key
          setError("Google Maps API key not configured");
          return;
        }

        const loader = new Loader({
          apiKey: apiKey,
          version: "weekly",
          libraries: ["places"]
        });

        await loader.load();
        
        // Check if Google Maps and Places library are properly loaded
        if (typeof google === 'undefined' || 
            typeof google.maps === 'undefined' || 
            typeof google.maps.places === 'undefined' ||
            typeof google.maps.places.Autocomplete === 'undefined') {
          setError("Google Places API failed to load");
          return;
        }
        
        if (inputRef.current && !autocompleteRef.current) {
          // Initialize the autocomplete with updated options
          autocompleteRef.current = new google.maps.places.Autocomplete(
            inputRef.current,
            {
              types: ["address"],
              componentRestrictions: { country: ["us", "ca"] }, // Restrict to US and Canada
              fields: ["formatted_address", "geometry", "place_id", "address_components"]
            }
          );

          // Handle place selection
          autocompleteRef.current.addListener("place_changed", () => {
            const place = autocompleteRef.current?.getPlace();
            if (place?.formatted_address) {
              onChange(place.formatted_address);
            }
          });

          setIsLoaded(true);
        }
      } catch (err) {
        console.error("Error loading Google Maps:", err);
        // More specific error for API issues
        if (err instanceof Error && err.message.includes("legacy")) {
          setError("Please enable Places API (New) in Google Cloud Console");
        } else {
          setError("Failed to load Google Maps");
        }
      }
    };

    initializeAutocomplete();

    // Cleanup
    return () => {
      if (autocompleteRef.current && typeof google !== 'undefined' && google.maps && google.maps.event) {
        google.maps.event.clearInstanceListeners(autocompleteRef.current);
      }
    };
  }, [onChange]);

  // Handle manual input changes (when user types without selecting from autocomplete)
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  if (error) {
    // Fallback to regular input
    return (
      <div className="space-y-2">
        <Input
          name={name}
          placeholder={placeholder}
          value={value}
          onChange={handleInputChange}
          className={className}
        />
        <p className="text-xs text-muted-foreground">
          {error.includes("Places API") 
            ? "Google Places API needs to be enabled. Enter address manually for now."
            : "Google Places autocomplete unavailable. Enter address manually."
          }
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <Input
        ref={inputRef}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={handleInputChange}
        className={className}
        autoComplete="off"
      />
      {isLoaded && (
        <p className="text-xs text-muted-foreground">
          🌍 Start typing to see address suggestions
        </p>
      )}
      {!isLoaded && !error && (
        <p className="text-xs text-muted-foreground">
          Loading address suggestions...
        </p>
      )}
    </div>
  );
} 