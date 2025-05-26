// Utility functions for zip code and location-based filtering

// Enhanced mapping with zip code prefixes for better coverage
const ZIP_CODE_COORDINATES: Record<string, { lat: number; lng: number }> = {
  // Missouri zip codes - expanded coverage
  "65201": { lat: 38.9517, lng: -92.3341 }, // Columbia, MO
  "65202": { lat: 38.9517, lng: -92.3341 }, // Columbia, MO
  "65203": { lat: 38.9517, lng: -92.3341 }, // Columbia, MO
  "65204": { lat: 38.9517, lng: -92.3341 }, // Columbia, MO
  "65205": { lat: 38.9517, lng: -92.3341 }, // Columbia, MO
  "65206": { lat: 38.9517, lng: -92.3341 }, // Columbia, MO
  "65207": { lat: 38.9517, lng: -92.3341 }, // Columbia, MO
  "64111": { lat: 39.0997, lng: -94.5786 }, // Kansas City, MO
  "64112": { lat: 39.0458, lng: -94.5885 }, // Kansas City, MO
  "64113": { lat: 39.0458, lng: -94.5885 }, // Kansas City, MO
  "64114": { lat: 39.0458, lng: -94.5885 }, // Kansas City, MO
  "64115": { lat: 39.0458, lng: -94.5885 }, // Kansas City, MO
  "63101": { lat: 38.6270, lng: -90.1994 }, // St. Louis, MO
  "63102": { lat: 38.6270, lng: -90.1994 }, // St. Louis, MO
  "63103": { lat: 38.6270, lng: -90.1994 }, // St. Louis, MO
  "63104": { lat: 38.6270, lng: -90.1994 }, // St. Louis, MO
  "63105": { lat: 38.6270, lng: -90.1994 }, // St. Louis, MO
  "65807": { lat: 37.2090, lng: -93.2923 }, // Springfield, MO
  "65804": { lat: 37.2090, lng: -93.2923 }, // Springfield, MO
  "65802": { lat: 37.2090, lng: -93.2923 }, // Springfield, MO
  
  // California zip codes  
  "90210": { lat: 34.0901, lng: -118.4065 }, // Beverly Hills, CA
  "90211": { lat: 34.0901, lng: -118.4065 }, // Beverly Hills, CA
  "94102": { lat: 37.7849, lng: -122.4094 }, // San Francisco, CA
  "94103": { lat: 37.7749, lng: -122.4194 }, // San Francisco, CA
  "94104": { lat: 37.7749, lng: -122.4194 }, // San Francisco, CA
  "94105": { lat: 37.7749, lng: -122.4194 }, // San Francisco, CA
  "90401": { lat: 34.0195, lng: -118.4912 }, // Santa Monica, CA
  "90028": { lat: 34.1016, lng: -118.3267 }, // Hollywood, CA
  "90027": { lat: 34.0983, lng: -118.2956 }, // Los Feliz, CA
  
  // New York zip codes
  "10001": { lat: 40.7505, lng: -73.9934 }, // New York, NY
  "10002": { lat: 40.7156, lng: -73.9877 }, // New York, NY
  "10003": { lat: 40.7310, lng: -73.9896 }, // New York, NY
  "10004": { lat: 40.7310, lng: -73.9896 }, // New York, NY
  "10005": { lat: 40.7310, lng: -73.9896 }, // New York, NY
  "11201": { lat: 40.6928, lng: -73.9903 }, // Brooklyn, NY
  "11202": { lat: 40.6928, lng: -73.9903 }, // Brooklyn, NY
  "11203": { lat: 40.6928, lng: -73.9903 }, // Brooklyn, NY
  "10025": { lat: 40.7980, lng: -73.9665 }, // Upper West Side, NY
  "10024": { lat: 40.7831, lng: -73.9712 }, // Upper West Side, NY
  
  // Florida zip codes
  "33101": { lat: 25.7617, lng: -80.1918 }, // Miami, FL
  "33102": { lat: 25.7617, lng: -80.1918 }, // Miami, FL
  "33139": { lat: 25.7823, lng: -80.1378 }, // Miami Beach, FL
  "33140": { lat: 25.7823, lng: -80.1378 }, // Miami Beach, FL
  "32801": { lat: 28.5383, lng: -81.3792 }, // Orlando, FL
  "32802": { lat: 28.5383, lng: -81.3792 }, // Orlando, FL
  
  // Texas zip codes
  "75201": { lat: 32.7767, lng: -96.7970 }, // Dallas, TX
  "75202": { lat: 32.7767, lng: -96.7970 }, // Dallas, TX
  "77001": { lat: 29.7604, lng: -95.3698 }, // Houston, TX
  "77002": { lat: 29.7604, lng: -95.3698 }, // Houston, TX
  "78701": { lat: 30.2672, lng: -97.7431 }, // Austin, TX
  "78702": { lat: 30.2672, lng: -97.7431 }, // Austin, TX
  
  // Additional major cities
  "60601": { lat: 41.8781, lng: -87.6298 }, // Chicago, IL
  "60602": { lat: 41.8781, lng: -87.6298 }, // Chicago, IL
  "98101": { lat: 47.6062, lng: -122.3321 }, // Seattle, WA
  "98102": { lat: 47.6062, lng: -122.3321 }, // Seattle, WA
  "80202": { lat: 39.7392, lng: -104.9903 }, // Denver, CO
  "80203": { lat: 39.7392, lng: -104.9903 }, // Denver, CO
  "85001": { lat: 33.4484, lng: -112.0740 }, // Phoenix, AZ
  "85002": { lat: 33.4484, lng: -112.0740 }, // Phoenix, AZ
  "02101": { lat: 42.3601, lng: -71.0589 }, // Boston, MA
  "02102": { lat: 42.3601, lng: -71.0589 }, // Boston, MA
  "30301": { lat: 33.7490, lng: -84.3880 }, // Atlanta, GA
  "30302": { lat: 33.7490, lng: -84.3880 }, // Atlanta, GA
  
  // Additional states for better coverage
  "19101": { lat: 39.9526, lng: -75.1652 }, // Philadelphia, PA
  "98001": { lat: 47.3123, lng: -122.2275 }, // Kent, WA
  "97201": { lat: 45.5152, lng: -122.6784 }, // Portland, OR
  "89101": { lat: 36.1699, lng: -115.1398 }, // Las Vegas, NV
  "84101": { lat: 40.7608, lng: -111.8910 }, // Salt Lake City, UT
};

// Zip code prefix to city mapping for unknown zip codes
const ZIP_PREFIX_TO_CITY: Record<string, { city: string; state: string; lat: number; lng: number }> = {
  "652": { city: "Columbia", state: "MO", lat: 38.9517, lng: -92.3341 },
  "641": { city: "Kansas City", state: "MO", lat: 39.0997, lng: -94.5786 },
  "631": { city: "St. Louis", state: "MO", lat: 38.6270, lng: -90.1994 },
  "658": { city: "Springfield", state: "MO", lat: 37.2090, lng: -93.2923 },
  "902": { city: "Los Angeles", state: "CA", lat: 34.0522, lng: -118.2437 },
  "941": { city: "San Francisco", state: "CA", lat: 37.7749, lng: -122.4194 },
  "100": { city: "New York", state: "NY", lat: 40.7128, lng: -74.0060 },
  "112": { city: "Brooklyn", state: "NY", lat: 40.6928, lng: -73.9903 },
  "331": { city: "Miami", state: "FL", lat: 25.7617, lng: -80.1918 },
  "328": { city: "Orlando", state: "FL", lat: 28.5383, lng: -81.3792 },
  "752": { city: "Dallas", state: "TX", lat: 32.7767, lng: -96.7970 },
  "770": { city: "Houston", state: "TX", lat: 29.7604, lng: -95.3698 },
  "787": { city: "Austin", state: "TX", lat: 30.2672, lng: -97.7431 },
  "606": { city: "Chicago", state: "IL", lat: 41.8781, lng: -87.6298 },
  "981": { city: "Seattle", state: "WA", lat: 47.6062, lng: -122.3321 },
  "802": { city: "Denver", state: "CO", lat: 39.7392, lng: -104.9903 },
  "850": { city: "Phoenix", state: "AZ", lat: 33.4484, lng: -112.0740 },
  "021": { city: "Boston", state: "MA", lat: 42.3601, lng: -71.0589 },
  "303": { city: "Atlanta", state: "GA", lat: 33.7490, lng: -84.3880 },
  "191": { city: "Philadelphia", state: "PA", lat: 39.9526, lng: -75.1652 },
};

// Additional city/state to coordinates mapping for fallback
const CITY_STATE_COORDINATES: Record<string, { lat: number; lng: number }> = {
  "Columbia, MO": { lat: 38.9517, lng: -92.3341 },
  "Columbia, Missouri": { lat: 38.9517, lng: -92.3341 },
  "Kansas City, MO": { lat: 39.0997, lng: -94.5786 },
  "Kansas City, Missouri": { lat: 39.0997, lng: -94.5786 },
  "St. Louis, MO": { lat: 38.6270, lng: -90.1994 },
  "St. Louis, Missouri": { lat: 38.6270, lng: -90.1994 },
  "Springfield, MO": { lat: 37.2090, lng: -93.2923 },
  "Springfield, Missouri": { lat: 37.2090, lng: -93.2923 },
  "Los Angeles, CA": { lat: 34.0522, lng: -118.2437 },
  "Los Angeles, California": { lat: 34.0522, lng: -118.2437 },
  "San Francisco, CA": { lat: 37.7749, lng: -122.4194 },
  "San Francisco, California": { lat: 37.7749, lng: -122.4194 },
  "New York, NY": { lat: 40.7128, lng: -74.0060 },
  "New York, New York": { lat: 40.7128, lng: -74.0060 },
  "Chicago, IL": { lat: 41.8781, lng: -87.6298 },
  "Chicago, Illinois": { lat: 41.8781, lng: -87.6298 },
  "Houston, TX": { lat: 29.7604, lng: -95.3698 },
  "Houston, Texas": { lat: 29.7604, lng: -95.3698 },
  "Phoenix, AZ": { lat: 33.4484, lng: -112.0740 },
  "Phoenix, Arizona": { lat: 33.4484, lng: -112.0740 },
  "Philadelphia, PA": { lat: 39.9526, lng: -75.1652 },
  "Philadelphia, Pennsylvania": { lat: 39.9526, lng: -75.1652 },
  "San Antonio, TX": { lat: 29.4241, lng: -98.4936 },
  "San Antonio, Texas": { lat: 29.4241, lng: -98.4936 },
  "San Diego, CA": { lat: 32.7157, lng: -117.1611 },
  "San Diego, California": { lat: 32.7157, lng: -117.1611 },
  "Dallas, TX": { lat: 32.7767, lng: -96.7970 },
  "Dallas, Texas": { lat: 32.7767, lng: -96.7970 },
};

/**
 * Calculate the distance between two points using the Haversine formula
 * @param lat1 Latitude of first point
 * @param lng1 Longitude of first point
 * @param lat2 Latitude of second point
 * @param lng2 Longitude of second point
 * @returns Distance in miles
 */
export function calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 3959; // Radius of the Earth in miles
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in miles
}

/**
 * Get coordinates for a zip code with enhanced lookup
 * @param zipCode The zip code to look up
 * @returns Coordinates object or null if not found
 */
export function getZipCodeCoordinates(zipCode: string): { lat: number; lng: number } | null {
  const cleanZip = zipCode.trim().substring(0, 5);
  
  // First try exact match
  if (ZIP_CODE_COORDINATES[cleanZip]) {
    return ZIP_CODE_COORDINATES[cleanZip];
  }
  
  // Try prefix matching (first 3 digits)
  const prefix3 = cleanZip.substring(0, 3);
  if (ZIP_PREFIX_TO_CITY[prefix3]) {
    return {
      lat: ZIP_PREFIX_TO_CITY[prefix3].lat,
      lng: ZIP_PREFIX_TO_CITY[prefix3].lng
    };
  }
  
  // Try prefix matching (first 2 digits) - less accurate but better coverage
  const prefix2 = cleanZip.substring(0, 2);
  for (const [prefix, location] of Object.entries(ZIP_PREFIX_TO_CITY)) {
    if (prefix.startsWith(prefix2)) {
      return {
        lat: location.lat,
        lng: location.lng
      };
    }
  }
  
  return null;
}

/**
 * Get coordinates for a city, state combination
 * @param city The city name
 * @param state The state name or abbreviation
 * @returns Coordinates object or null if not found
 */
export function getCityStateCoordinates(city: string, state: string): { lat: number; lng: number } | null {
  if (!city || !state) return null;
  
  const cityState1 = `${city.trim()}, ${state.trim()}`;
  const cityState2 = `${city.trim()}, ${getFullStateName(state.trim())}`;
  const cityState3 = `${city.trim()}, ${getStateAbbreviation(state.trim())}`;
  
  return CITY_STATE_COORDINATES[cityState1] || 
         CITY_STATE_COORDINATES[cityState2] || 
         CITY_STATE_COORDINATES[cityState3] || 
         null;
}

/**
 * Enhanced location matching - handles both radius and city matching
 * @param searchLocation The location entered by user (zip code or city)
 * @param housemateCity The housemate's city
 * @param housemateState The housemate's state
 * @param radiusInMiles The search radius in miles for zip codes (default: 35)
 * @returns true if location matches, false otherwise
 */
export function isLocationMatch(
  searchLocation: string, 
  housemateCity: string, 
  housemateState: string, 
  radiusInMiles: number = 35
): boolean {
  if (!searchLocation || !housemateCity || !housemateState) return false;
  
  const cleanSearch = searchLocation.trim();
  
  // If search looks like a zip code (5 digits), use radius filtering
  if (/^\d{5}$/.test(cleanSearch)) {
    return isHousemateWithinRadius(cleanSearch, housemateCity, housemateState, radiusInMiles);
  }
  
  // For non-zip searches, do flexible text matching
  const housemateLocation = `${housemateCity}, ${housemateState}`.toLowerCase();
  const searchTerm = cleanSearch.toLowerCase();
  
  // Check if search term matches city name
  if (housemateCity.toLowerCase().includes(searchTerm)) {
    return true;
  }
  
  // Check if search term matches full location string
  if (housemateLocation.includes(searchTerm)) {
    return true;
  }
  
  // Check for common abbreviations and variations
  const stateAbbr = getStateAbbreviation(housemateState);
  const fullStateName = getFullStateName(housemateState);
  
  if (searchTerm.includes(stateAbbr.toLowerCase()) || 
      searchTerm.includes(fullStateName.toLowerCase())) {
    return true;
  }
  
  return false;
}

/**
 * Check if a housemate is within the specified radius of a zip code
 * @param zipCode The center zip code to search from
 * @param housemateCity The housemate's city
 * @param housemateState The housemate's state
 * @param radiusInMiles The search radius in miles (default: 35)
 * @returns true if within radius, false otherwise
 */
export function isHousemateWithinRadius(
  zipCode: string, 
  housemateCity: string, 
  housemateState: string, 
  radiusInMiles: number = 35
): boolean {
  const centerCoords = getZipCodeCoordinates(zipCode);
  if (!centerCoords) return false;
  
  const housemateCoords = getCityStateCoordinates(housemateCity, housemateState);
  if (!housemateCoords) return false;
  
  const distance = calculateDistance(
    centerCoords.lat, 
    centerCoords.lng, 
    housemateCoords.lat, 
    housemateCoords.lng
  );
  
  return distance <= radiusInMiles;
}

/**
 * Get full state name from abbreviation
 */
function getFullStateName(stateAbbr: string): string {
  const stateMap: Record<string, string> = {
    'AL': 'Alabama', 'AK': 'Alaska', 'AZ': 'Arizona', 'AR': 'Arkansas', 'CA': 'California',
    'CO': 'Colorado', 'CT': 'Connecticut', 'DE': 'Delaware', 'FL': 'Florida', 'GA': 'Georgia',
    'HI': 'Hawaii', 'ID': 'Idaho', 'IL': 'Illinois', 'IN': 'Indiana', 'IA': 'Iowa',
    'KS': 'Kansas', 'KY': 'Kentucky', 'LA': 'Louisiana', 'ME': 'Maine', 'MD': 'Maryland',
    'MA': 'Massachusetts', 'MI': 'Michigan', 'MN': 'Minnesota', 'MS': 'Mississippi', 'MO': 'Missouri',
    'MT': 'Montana', 'NE': 'Nebraska', 'NV': 'Nevada', 'NH': 'New Hampshire', 'NJ': 'New Jersey',
    'NM': 'New Mexico', 'NY': 'New York', 'NC': 'North Carolina', 'ND': 'North Dakota', 'OH': 'Ohio',
    'OK': 'Oklahoma', 'OR': 'Oregon', 'PA': 'Pennsylvania', 'RI': 'Rhode Island', 'SC': 'South Carolina',
    'SD': 'South Dakota', 'TN': 'Tennessee', 'TX': 'Texas', 'UT': 'Utah', 'VT': 'Vermont',
    'VA': 'Virginia', 'WA': 'Washington', 'WV': 'West Virginia', 'WI': 'Wisconsin', 'WY': 'Wyoming'
  };
  return stateMap[stateAbbr.toUpperCase()] || stateAbbr;
}

/**
 * Get state abbreviation from full name
 */
function getStateAbbreviation(stateName: string): string {
  const stateMap: Record<string, string> = {
    'Alabama': 'AL', 'Alaska': 'AK', 'Arizona': 'AZ', 'Arkansas': 'AR', 'California': 'CA',
    'Colorado': 'CO', 'Connecticut': 'CT', 'Delaware': 'DE', 'Florida': 'FL', 'Georgia': 'GA',
    'Hawaii': 'HI', 'Idaho': 'ID', 'Illinois': 'IL', 'Indiana': 'IN', 'Iowa': 'IA',
    'Kansas': 'KS', 'Kentucky': 'KY', 'Louisiana': 'LA', 'Maine': 'ME', 'Maryland': 'MD',
    'Massachusetts': 'MA', 'Michigan': 'MI', 'Minnesota': 'MN', 'Mississippi': 'MS', 'Missouri': 'MO',
    'Montana': 'MT', 'Nebraska': 'NE', 'Nevada': 'NV', 'New Hampshire': 'NH', 'New Jersey': 'NJ',
    'New Mexico': 'NM', 'New York': 'NY', 'North Carolina': 'NC', 'North Dakota': 'ND', 'Ohio': 'OH',
    'Oklahoma': 'OK', 'Oregon': 'OR', 'Pennsylvania': 'PA', 'Rhode Island': 'RI', 'South Carolina': 'SC',
    'South Dakota': 'SD', 'Tennessee': 'TN', 'Texas': 'TX', 'Utah': 'UT', 'Vermont': 'VT',
    'Virginia': 'VA', 'Washington': 'WA', 'West Virginia': 'WV', 'Wisconsin': 'WI', 'Wyoming': 'WY'
  };
  return stateMap[stateName] || stateName;
} 