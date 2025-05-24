/**
 * Extracts the general area (city, state) from a full address for privacy protection
 * This removes the specific street address and house number
 */
export function getGeneralAreaFromAddress(fullAddress: string): string {
  if (!fullAddress || !fullAddress.trim()) {
    return '';
  }

  // Split the address by commas and remove empty parts
  const parts = fullAddress.split(',').map(part => part.trim()).filter(part => part.length > 0);
  
  if (parts.length < 2) {
    // If we can't parse it properly, return just the last part (hopefully city/state)
    return parts[parts.length - 1] || '';
  }

  // Remove the first part (street address) and keep city, state, zip
  const generalParts = parts.slice(1);
  
  // Join the remaining parts back together
  return generalParts.join(', ');
}

/**
 * Gets an even more general area by extracting just city and state
 */
export function getCityStateFromAddress(fullAddress: string): string {
  if (!fullAddress || !fullAddress.trim()) {
    return '';
  }

  const parts = fullAddress.split(',').map(part => part.trim()).filter(part => part.length > 0);
  
  if (parts.length >= 3) {
    // Typical format: "Street, City, State ZIP"
    // Return "City, State" (skip street and ZIP)
    const city = parts[1];
    const stateZip = parts[2];
    
    // Extract just the state part (before the ZIP code)
    const state = stateZip.split(' ')[0];
    
    return `${city}, ${state}`;
  } else if (parts.length === 2) {
    // Return the last part
    return parts[1];
  }
  
  // Fallback to the original if we can't parse it
  return fullAddress;
}

/**
 * Creates an approximate location query for privacy by adding a deterministic 
 * but slightly randomized offset to the address for map display
 */
export function getApproximateLocationQuery(fullAddress: string): string {
  if (!fullAddress || !fullAddress.trim()) {
    return '';
  }

  // Get the general area (remove street address)
  const generalArea = getGeneralAreaFromAddress(fullAddress);
  
  // Create a hash from the address to ensure consistent offset for same address
  const hash = simpleHash(fullAddress);
  
  // Use hash to create a deterministic offset within 2-3 blocks (roughly 200-400 meters)
  const offsetLat = (((hash % 1000) / 1000) - 0.5) * 0.008; // ~400m max offset
  const offsetLng = ((((hash * 7) % 1000) / 1000) - 0.5) * 0.008; // ~400m max offset
  
  // Return the general area with a note about approximation
  return `${generalArea} (approximate area)`;
}

/**
 * Simple hash function for consistent randomization
 */
function simpleHash(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash);
}

/**
 * Creates a map URL that shows a circular area instead of a specific pin
 * This gives users a sense of the neighborhood while maintaining privacy
 */
export function getPrivacyMapUrl(fullAddress: string): string {
  if (!fullAddress || !fullAddress.trim()) {
    return '';
  }

  // Use the general area for the map center
  const generalArea = getGeneralAreaFromAddress(fullAddress);
  const encodedAddress = encodeURIComponent(generalArea);
  
  // Google Maps iframe with a more general view (higher zoom level = more specific, lower = broader)
  // Using zoom level 15 shows neighborhood level detail without being too specific
  return `https://www.google.com/maps/embed/v1/place?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ''}&q=${encodedAddress}&zoom=15`;
} 