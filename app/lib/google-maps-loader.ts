// Centralized Google Maps API loader to prevent duplicate script loading

interface GoogleMapsConfig {
  libraries?: string[];
}

// Global state to track loading status
let isGoogleMapsLoaded = false;
let isGoogleMapsLoading = false;
let googleMapsPromise: Promise<void> | null = null;

/**
 * Load Google Maps API script if not already loaded
 * @param config Configuration for libraries to load
 * @returns Promise that resolves when Google Maps is ready
 */
export function loadGoogleMapsAPI(config: GoogleMapsConfig = {}): Promise<void> {
  // If already loaded, return resolved promise
  if (isGoogleMapsLoaded && window.google?.maps) {
    return Promise.resolve();
  }

  // If currently loading, return the existing promise
  if (isGoogleMapsLoading && googleMapsPromise) {
    return googleMapsPromise;
  }

  // Check if script already exists in the DOM
  const existingScript = document.querySelector('script[src*="maps.googleapis.com"]');
  if (existingScript && window.google?.maps) {
    isGoogleMapsLoaded = true;
    return Promise.resolve();
  }

  // Start loading
  isGoogleMapsLoading = true;
  
  googleMapsPromise = new Promise<void>((resolve, reject) => {
    // Check if API key is available
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    if (!apiKey || apiKey === 'DEMO_KEY' || apiKey === '') {
      isGoogleMapsLoading = false;
      reject(new Error('Google Maps API key is not configured. Please set NEXT_PUBLIC_GOOGLE_MAPS_API_KEY in your environment variables.'));
      return;
    }

    // Build libraries parameter
    const libraries = config.libraries?.length ? config.libraries : ['geometry'];
    const librariesParam = libraries.join(',');

    // Create script element
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=${librariesParam}`;
    script.async = true;
    script.defer = true;
    
    script.onload = () => {
      // Add a small delay to ensure all libraries are fully initialized
      setTimeout(() => {
        if (window.google?.maps) {
          isGoogleMapsLoaded = true;
          isGoogleMapsLoading = false;
          resolve();
        } else {
          isGoogleMapsLoading = false;
          reject(new Error('Google Maps API loaded but window.google.maps is not available'));
        }
      }, 100);
    };
    
    script.onerror = () => {
      isGoogleMapsLoading = false;
      reject(new Error('Failed to load Google Maps API. Please check your API key and ensure the Maps JavaScript API is enabled in Google Cloud Console.'));
    };
    
    // Remove any existing script to prevent conflicts
    if (existingScript) {
      existingScript.remove();
    }
    
    document.head.appendChild(script);
  });

  return googleMapsPromise;
}

/**
 * Check if Google Maps API is ready to use
 */
export function isGoogleMapsReady(): boolean {
  return isGoogleMapsLoaded && !!window.google?.maps;
}

/**
 * Reset the loader state (useful for testing)
 */
export function resetGoogleMapsLoader(): void {
  isGoogleMapsLoaded = false;
  isGoogleMapsLoading = false;
  googleMapsPromise = null;
}

// Extend Window interface for TypeScript
declare global {
  interface Window {
    google: any;
  }
} 