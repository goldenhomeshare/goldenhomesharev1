"use client";

import { useEffect, useState } from "react";
import { ListingsMap } from "@/app/components/ListingsMap";
import { ListingCard } from "@/app/components/ListingCard";
import { ProductCard } from "@/app/components/ProductCard";
import { HousemateCard } from "@/app/components/HousemateCard";
import { ContactHousemateModal } from "@/app/components/ContactHousemateModal";
import { notFound, useParams, useRouter } from "next/navigation";
import { Map, List, CheckCircle, Filter, X, ChevronDown } from "lucide-react";
import { toast } from "sonner";
import { HousemateProfileCardNew } from "@/app/components/HousemateProfileCardNew";
import { HousemateHorizontalCard } from "@/app/components/HousemateHorizontalCard";
import { isHousemateWithinRadius, isLocationMatch } from "@/app/lib/zipCodeUtils";

interface Listing {
  id: string;
  name: string;
  price: number;
  smallDescription: string;
  images: string[];
  address?: string;
  amenities?: string[];
}

interface HousemateProfile {
  id: string;
  name: string;
  price: number;
  smallDescription: string;
  images: string[];
  occupation?: string;
  gender?: string;
  ageRange?: string;
  schedule?: string;
  socialPreference?: string;
  hobbies?: string[];
  preferredGender?: string;
  lifestyle?: any;
  email?: string;
  userId?: string;
  canHelpWith?: string[] | string;
  maxBudget?: number;
}

async function getData(category: string) {
  try {
    // Use window.location.origin for client-side fetches to ensure proper URL resolution
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
    const url = `${baseUrl}/api/products?category=${category}`;
    
    console.log('Fetching data from:', url);
    
    const response = await fetch(url, {
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    console.log('Response status:', response.status, response.statusText);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error:', errorText);
      throw new Error(`Failed to fetch data: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log('Fetched data:', data);
    return data;
  } catch (error) {
    console.error('Error fetching data:', error);
    // Return empty array instead of throwing to prevent the component from breaking
    return [];
  }
}

export default function CategoryPage() {
  const params = useParams();
  const router = useRouter();
  const category = params.category as string;
  const [data, setData] = useState<Listing[] | HousemateProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedListing, setSelectedListing] = useState<string | null>(null);
  const [visibleListings, setVisibleListings] = useState<Listing[]>([]);
  const [showMobileMap, setShowMobileMap] = useState(true);
  
  // Form state for filters
  const [location, setLocation] = useState("");
  const [sortBy, setSortBy] = useState("Recommended");
  const [budgetMax, setBudgetMax] = useState(0);
  const [selectedGender, setSelectedGender] = useState("");
  const [smokingPreference, setSmokingPreference] = useState("");
  const [languagePreference, setLanguagePreference] = useState("");
  const [selectedSchedule, setSelectedSchedule] = useState("");
  const [selectedSocialStyle, setSelectedSocialStyle] = useState("");
  const [selectedOccupation, setSelectedOccupation] = useState("");
  
  // Custom dropdown state
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileDropdownOpen, setIsMobileDropdownOpen] = useState(false);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  
  // Can help with multiselect state
  const [selectedHelpOptions, setSelectedHelpOptions] = useState<string[]>([]);
  
  // Support options available for selection
  const supportOptions = [
    { id: "cleaning", label: "Cleaning" },
    { id: "cooking", label: "Cooking" },
    { id: "gardening", label: "Gardening" },
    { id: "errands", label: "Errands" },
    { id: "companionship", label: "Companionship" },
    { id: "petCare", label: "Pet Care" },
    { id: "techSupport", label: "Tech Support" },
    { id: "homeSecurity", label: "Home Security" },
  ];
  
  // Schedule options
  const scheduleOptions = [
    { id: "early-riser", label: "Early Riser" },
    { id: "night-owl", label: "Night Owl" },
    { id: "flexible", label: "Flexible" },
  ];
  
  // Social style options
  const socialStyleOptions = [
    { id: "social", label: "Social" },
    { id: "independent", label: "Independent" },
    { id: "balanced", label: "Balanced" },
  ];
  
  // Occupation options
  const occupationOptions = [
    { id: "student", label: "Student" },
    { id: "professional", label: "Professional" },
    { id: "retired", label: "Retired" },
  ];
  
  // Contact modal state
  const [contactModal, setContactModal] = useState<{
    isOpen: boolean;
    housemateName: string;
    housemateEmail: string;
    housemateId: string;
  }>({
    isOpen: false,
    housemateName: "",
    housemateEmail: "",
    housemateId: ""
  });

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

  const handleContactHousemate = async (housemateId: string, email: string) => {
    try {
      // Get current user to check authentication
      const userResponse = await fetch("/api/auth/user");
      
      if (!userResponse.ok) {
        // User is not authenticated, redirect to login
        toast.error("Please log in to contact housemates.");
        router.push("/api/auth/login");
        return;
      }
      
      const currentUser = await userResponse.json();
      
      // Check if user is trying to contact themselves
      if (currentUser.id === housemateId) {
        toast.error("You cannot contact yourself.");
        return;
      }
      
      // Find the housemate data to get their name
      const housemateData = data as HousemateProfile[];
      const housemate = housemateData.find(h => h.userId === housemateId);
      
      if (housemate) {
        setContactModal({
          isOpen: true,
          housemateName: housemate.name,
          housemateEmail: email,
          housemateId: housemateId
        });
      } else {
        toast.error("Unable to contact housemate. Please try again.");
      }
    } catch (error) {
      console.error("Error checking user:", error);
      toast.error("Please log in to contact housemates.");
      router.push("/api/auth/login");
    }
  };

  const closeContactModal = () => {
    setContactModal({
      isOpen: false,
      housemateName: "",
      housemateEmail: "",
      housemateId: ""
    });
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

  // If this is the icon category, show housemate profiles
  if (category === 'icon') {
    const housemateData = data as HousemateProfile[];
    
    // Calculate active filters count
    const activeFiltersCount = [
      selectedGender,
      smokingPreference,
      languagePreference,
      selectedSchedule,
      selectedSocialStyle,
      selectedOccupation,
      selectedHelpOptions.length > 0,
      budgetMax > 0
    ].filter(Boolean).length;
    
    const clearAllFilters = () => {
      setSelectedGender("");
      setSmokingPreference("");
      setLanguagePreference("");
      setSelectedSchedule("");
      setSelectedSocialStyle("");
      setSelectedOccupation("");
      setSelectedHelpOptions([]);
      setBudgetMax(0);
    };
    
    // Filter housemates based on selected criteria
    const filteredHousemates = housemateData.filter((housemate) => {
      // Parse lifestyle data
      let lifestyleData: any = {};
      if (housemate.lifestyle) {
        try {
          lifestyleData = typeof housemate.lifestyle === 'string' 
            ? JSON.parse(housemate.lifestyle) 
            : housemate.lifestyle;
        } catch {
          lifestyleData = {};
        }
      }

      // Location filter - check if housemate is within 35 miles of entered location
      if (location && location.trim()) {
        const searchLocation = location.trim();
        
        // Check if the housemate has location data
        if (lifestyleData.location?.city && lifestyleData.location?.state) {
          const isMatch = isLocationMatch(
            searchLocation,
            lifestyleData.location.city,
            lifestyleData.location.state,
            35 // 35 mile radius for zip codes
          );
          if (!isMatch) {
            return false;
          }
        }
        // If housemate has no location data, still include them in results
        // Users can contact them to discuss location preferences
      }

      // Parse canHelpWith data
      let canHelpWithArray: string[] = [];
      if (housemate.canHelpWith) {
        try {
          canHelpWithArray = typeof housemate.canHelpWith === 'string' 
            ? JSON.parse(housemate.canHelpWith) 
            : housemate.canHelpWith;
        } catch {
          canHelpWithArray = [];
        }
      }

      // Budget filter
      const housemateBudget = housemate.price || housemate.maxBudget || 0;
      if (housemateBudget < budgetMax) {
        return false;
      }

      // Can help with filters
      if (selectedHelpOptions.length > 0) {
        const hasAllMatchingOptions = selectedHelpOptions.every(option => 
          canHelpWithArray.includes(option)
        );
        if (!hasAllMatchingOptions) {
          return false;
        }
      }

      // Gender filter
      if (selectedGender && housemate.gender !== selectedGender) {
        return false;
      }

      // Smoking preference filter
      if (smokingPreference) {
        const housemateSmoking = lifestyleData.smokingStatus;
        if (smokingPreference === "no" && housemateSmoking !== "no") {
          return false;
        }
        if (smokingPreference === "occasional" && housemateSmoking !== "outside") {
          return false;
        }
        if (smokingPreference === "regular" && housemateSmoking !== "yes") {
          return false;
        }
      }

      // Language preference filter
      if (languagePreference) {
        const housemateLanguage = lifestyleData.language;
        if (languagePreference.toLowerCase() !== housemateLanguage?.toLowerCase()) {
          return false;
        }
      }

      // Schedule preference filter
      if (selectedSchedule) {
        if (selectedSchedule !== housemate.schedule) {
          return false;
        }
      }

      // Social style preference filter
      if (selectedSocialStyle) {
        if (selectedSocialStyle !== housemate.socialPreference) {
          return false;
        }
      }

      // Occupation filter
      if (selectedOccupation) {
        // Determine the housemate's occupation type
        let housemateOccupationType = "";
        
        if (lifestyleData.occupationDetails?.isRetired) {
          housemateOccupationType = "retired";
        } else if (lifestyleData.education?.stillAttending) {
          housemateOccupationType = "student";
        } else if (housemate.occupation || lifestyleData.occupationDetails?.description) {
          housemateOccupationType = "professional";
        }
        
        if (selectedOccupation !== housemateOccupationType) {
          return false;
        }
      }

      return true;
    });
    
    return (
      <>
        <div className="min-h-screen bg-gray-50">
          {/* Header with verification badge */}
          <div className="border-b border-gray-200 px-4 py-6">
            <div className="max-w-7xl mx-auto">
              <div className="flex items-center justify-center text-center">
                <div className="flex items-center gap-2 text-gray-700 text-sm max-w-sm">
                  <CheckCircle size={16} className="text-blue-400 flex-shrink-0" />
                  <span className="font-medium leading-tight">
                    All housemates with this badge are background checked with{" "}
                    <a 
                      href="https://checkr.com" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 underline whitespace-nowrap"
                    >
                      Checkr
                    </a>
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile Layout */}
          <div className="lg:hidden h-screen flex flex-col">
            {/* Mobile Header with Filters Button */}
            <div className="bg-white p-4">
              <div className="flex items-center justify-between">
                <h1 className="text-lg font-semibold text-gray-900">Find Housemates</h1>
                <button
                  onClick={() => setShowMobileFilters(true)}
                  className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  <Filter size={16} />
                  Filters
                  {activeFiltersCount > 0 && (
                    <span className="bg-green-800 text-white text-xs px-2 py-1 rounded-full min-w-[20px] h-5 flex items-center justify-center">
                      {activeFiltersCount}
                    </span>
                  )}
                </button>
              </div>
              
              {/* Mobile listing count display */}
              <div className="mt-2">
                <p className="text-sm text-gray-600">
                  {filteredHousemates.length > 1000 
                    ? `Over ${Math.floor(filteredHousemates.length / 1000) * 1000} housemates` 
                    : `${filteredHousemates.length} housemate${filteredHousemates.length !== 1 ? 's' : ''}`
                  }
                  {filteredHousemates.length !== housemateData.length && 
                    ` (filtered from ${housemateData.length} total)`
                  }
                </p>
              </div>
            </div>

            {/* Mobile Location Filter - Always visible */}
            <div className="bg-white p-6 border-b border-gray-200">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Location
                </label>
                <input 
                  type="text" 
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Zip code or city (e.g., 12345, Anytown)"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-green-800 focus:ring-0"
                />
                {location && (
                  <p className="text-xs text-green-700 mt-3 font-medium">
                    {/^\d{5}$/.test(location.trim()) 
                      ? `Searching within 35-mile radius of ${location}` 
                      : `Filtering results for "${location}"`
                    }
                  </p>
                )}
              </div>
            </div>

            {/* Mobile Housemates List - Stacked Cards */}
            <div className="p-6">
              {/* Sort Dropdown */}
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-semibold text-gray-900">
                  {filteredHousemates.length} housemate{filteredHousemates.length !== 1 ? 's' : ''} found
                </h2>
                <div className="relative">
                  <button
                    onClick={() => setIsMobileDropdownOpen(!isMobileDropdownOpen)}
                    className="flex items-center justify-between bg-white border border-gray-300 rounded-lg px-4 py-2 pr-3 text-sm font-medium text-gray-700 hover:border-gray-400 focus:outline-none cursor-pointer min-w-[160px]"
                  >
                    <span>{sortBy}</span>
                    <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${isMobileDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>
                  
                  {/* Custom Dropdown Menu */}
                  {isMobileDropdownOpen && (
                    <>
                      {/* Backdrop to close dropdown */}
                      <div 
                        className="fixed inset-0 z-10" 
                        onClick={() => setIsMobileDropdownOpen(false)}
                      />
                      
                      {/* Dropdown Options */}
                      <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-20 overflow-hidden">
                        {[
                          "Recommended",
                          "Distance", 
                          "Price: Low to High",
                          "Price: High to Low",
                          "Top Rated"
                        ].map((option) => (
                          <button
                            key={option}
                            onClick={() => {
                              setSortBy(option);
                              setIsMobileDropdownOpen(false);
                            }}
                            className={`w-full text-left px-4 py-3 text-sm hover:bg-gray-50 transition-colors ${
                              sortBy === option 
                                ? 'bg-gray-50 text-gray-900 font-medium' 
                                : 'text-gray-700'
                            }`}
                          >
                            {option}
                          </button>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Housemates List - Stacked */}
              <div className="space-y-6 pb-20">
                {filteredHousemates.map((housemate) => {
                  // Parse lifestyle data to get location
                  let lifestyleData: any = {};
                  if (housemate.lifestyle) {
                    try {
                      lifestyleData = typeof housemate.lifestyle === 'string' 
                        ? JSON.parse(housemate.lifestyle) 
                        : housemate.lifestyle;
                    } catch {
                      lifestyleData = {};
                    }
                  }
                  
                  // Determine display location
                  const displayLocation = lifestyleData.location?.city && lifestyleData.location?.state
                    ? `${lifestyleData.location.city}, ${lifestyleData.location.state}`
                    : "Location not specified";
                  
                  return (
                    <HousemateHorizontalCard
                      key={`housemate-${housemate.id}`}
                      id={housemate.id}
                      name={housemate.name}
                      location={displayLocation}
                      occupation={housemate.occupation || "Not specified"}
                      gender={housemate.gender || "Not specified"}
                      ageRange={housemate.ageRange || "Not specified"}
                      maxBudget={housemate.price}
                      profileImage={housemate.images?.[0]}
                      bio={housemate.smallDescription}
                      isVerified={true}
                      userId={housemate.userId || ""}
                      email={housemate.email || ""}
                      lifestyle={housemate.lifestyle}
                      onContact={handleContactHousemate}
                    />
                  );
                })}
              </div>
              
              {filteredHousemates.length === 0 && (
                <div className="text-center py-12">
                  {activeFiltersCount > 0 ? (
                    <>
                      <p className="text-gray-500 text-lg">No housemates match your current filters.</p>
                      <p className="text-gray-400 text-sm mt-2">Try adjusting your filter criteria or clearing all filters.</p>
                      <button 
                        onClick={clearAllFilters}
                        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Clear All Filters
                      </button>
                    </>
                  ) : (
                    <>
                      <p className="text-gray-500 text-lg">No housemate profiles available at the moment.</p>
                      <p className="text-gray-400 text-sm mt-2">Check back later for new profiles.</p>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Desktop Layout */}
          <div className="hidden lg:flex max-w-7xl mx-auto">
            {/* Left Sidebar - Filters - Desktop Only */}
            <div className="w-80 bg-white p-6 shadow-sm">
              <h1 className="text-xl font-bold text-gray-900 mb-4">Showing results for</h1>
              
              {/* Location Filter */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location
                </label>
                <p className="text-xs text-gray-500 mb-2">
                  Enter zip code or city for location-based search
                </p>
                <input 
                  type="text" 
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Zip code or city (e.g., 12345, Anytown)"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-green-800 focus:ring-0"
                />
                {location && (
                  <p className="text-xs text-green-700 mt-2 font-medium">
                    {/^\d{5}$/.test(location.trim()) 
                      ? `Searching within 35-mile radius of ${location}` 
                      : `Filtering results for "${location}"`
                    }
                  </p>
                )}
              </div>

              {/* Filters Section */}
              <div className="border-t border-gray-200 pt-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900">Filters ({activeFiltersCount})</h3>
                  <button 
                    onClick={clearAllFilters}
                    className="text-green-700 hover:text-green-800 text-sm font-medium"
                  >
                    Clear all
                  </button>
                </div>

                {/* Listing count display */}
                <div className="mb-6">
                  <p className="text-sm text-gray-600">
                    {filteredHousemates.length > 1000 
                      ? `Over ${Math.floor(filteredHousemates.length / 1000) * 1000} housemates` 
                      : `${filteredHousemates.length} housemate${filteredHousemates.length !== 1 ? 's' : ''}`
                    }
                    {filteredHousemates.length !== housemateData.length && 
                      ` (filtered from ${housemateData.length} total)`
                    }
                  </p>
                </div>

                {/* Budget Filter */}
                <div className="mb-6">
                  <h4 className="font-medium text-gray-900 mb-3">Minimum Budget</h4>
                  <div className="mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-bold text-green-700">At least ${budgetMax}</span>
                      <span className="text-sm text-gray-500">per month</span>
                    </div>
                  </div>
                  <div className="mt-3">
                    <input 
                      type="range" 
                      min="0" 
                      max="2000" 
                      value={budgetMax}
                      onChange={(e) => setBudgetMax(Number(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none slider cursor-pointer"
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-2">
                      <span>$0</span>
                      <span>$2000</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      See housemates with budgets at or above this amount
                    </p>
                  </div>
                </div>

                {/* Gender Filter */}
                <div className="mb-6">
                  <h4 className="font-medium text-gray-900 mb-3">Gender</h4>
                  <p className="text-xs text-gray-500 mb-3">Select preferred gender</p>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { id: "male", label: "Male" },
                      { id: "female", label: "Female" }
                    ].map((option) => {
                      const isSelected = selectedGender === option.id;
                      
                      return (
                        <button
                          key={option.id}
                          type="button"
                          onClick={() => {
                            if (isSelected) {
                              setSelectedGender("");
                            } else {
                              setSelectedGender(option.id);
                            }
                          }}
                          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                            isSelected
                              ? 'bg-green-800 text-white hover:bg-green-900'
                              : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                          }`}
                        >
                          {option.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Smoking Preference Filter */}
                <div className="mb-6">
                  <h4 className="font-medium text-gray-900 mb-3">Smoking Preference</h4>
                  <p className="text-xs text-gray-500 mb-3">Select your smoking preference</p>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { id: "no", label: "No Smoking" },
                      { id: "occasional", label: "Designated Areas" },
                      { id: "regular", label: "Smoking Allowed" }
                    ].map((option) => {
                      const isSelected = smokingPreference === option.id;
                      
                      return (
                        <button
                          key={option.id}
                          type="button"
                          onClick={() => {
                            if (isSelected) {
                              setSmokingPreference("");
                            } else {
                              setSmokingPreference(option.id);
                            }
                          }}
                          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                            isSelected
                              ? 'bg-green-800 text-white hover:bg-green-900'
                              : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                          }`}
                        >
                          {option.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Language Preference Filter */}
                <div className="mb-6">
                  <h4 className="font-medium text-gray-900 mb-3">Language Preference</h4>
                  <p className="text-xs text-gray-500 mb-3">Select preferred language</p>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { id: "English", label: "English" },
                      { id: "Spanish", label: "Spanish" }
                    ].map((option) => {
                      const isSelected = languagePreference === option.id;
                      
                      return (
                        <button
                          key={option.id}
                          type="button"
                          onClick={() => {
                            if (isSelected) {
                              setLanguagePreference("");
                            } else {
                              setLanguagePreference(option.id);
                            }
                          }}
                          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                            isSelected
                              ? 'bg-green-800 text-white hover:bg-green-900'
                              : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                          }`}
                        >
                          {option.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Schedule Preference Filter */}
                <div className="mb-6">
                  <h4 className="font-medium text-gray-900 mb-3">Schedule Preference</h4>
                  <p className="text-xs text-gray-500 mb-3">Select preferred schedule type</p>
                  <div className="flex flex-wrap gap-2">
                    {scheduleOptions.map((option) => {
                      const isSelected = selectedSchedule === option.id;
                      
                      return (
                        <button
                          key={option.id}
                          type="button"
                          onClick={() => {
                            if (isSelected) {
                              setSelectedSchedule("");
                            } else {
                              setSelectedSchedule(option.id);
                            }
                          }}
                          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                            isSelected
                              ? 'bg-green-800 text-white hover:bg-green-900'
                              : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                          }`}
                        >
                          {option.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Social Style Preference Filter */}
                <div className="mb-6">
                  <h4 className="font-medium text-gray-900 mb-3">Social Style</h4>
                  <p className="text-xs text-gray-500 mb-3">Select preferred social style</p>
                  <div className="flex flex-wrap gap-2">
                    {socialStyleOptions.map((option) => {
                      const isSelected = selectedSocialStyle === option.id;
                      
                      return (
                        <button
                          key={option.id}
                          type="button"
                          onClick={() => {
                            if (isSelected) {
                              setSelectedSocialStyle("");
                            } else {
                              setSelectedSocialStyle(option.id);
                            }
                          }}
                          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                            isSelected
                              ? 'bg-green-800 text-white hover:bg-green-900'
                              : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                          }`}
                        >
                          {option.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Occupation Filter */}
                <div className="mb-6">
                  <h4 className="font-medium text-gray-900 mb-3">Occupation</h4>
                  <p className="text-xs text-gray-500 mb-3">Select occupation type</p>
                  <div className="flex flex-wrap gap-2">
                    {occupationOptions.map((option) => {
                      const isSelected = selectedOccupation === option.id;
                      
                      return (
                        <button
                          key={option.id}
                          type="button"
                          onClick={() => {
                            if (isSelected) {
                              setSelectedOccupation("");
                            } else {
                              setSelectedOccupation(option.id);
                            }
                          }}
                          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                            isSelected
                              ? 'bg-green-800 text-white hover:bg-green-900'
                              : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                          }`}
                        >
                          {option.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Can Help With Filter */}
                <div className="mb-6">
                  <h4 className="font-medium text-gray-900 mb-3">Can help with</h4>
                  <p className="text-xs text-gray-500 mb-3">Select services you're looking for</p>
                  <div className="flex flex-wrap gap-2">
                    {supportOptions.map((option) => {
                      const isSelected = selectedHelpOptions.includes(option.id);
                      
                      return (
                        <button
                          key={option.id}
                          type="button"
                          onClick={() => {
                            if (isSelected) {
                              setSelectedHelpOptions(prev => prev.filter(id => id !== option.id));
                            } else {
                              setSelectedHelpOptions(prev => [...prev, option.id]);
                            }
                          }}
                          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                            isSelected
                              ? 'bg-green-800 text-white hover:bg-green-900'
                              : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                          }`}
                        >
                          {option.label}
                        </button>
                      );
                    })}
                  </div>
                  
                  {/* Selected options summary */}
                  {selectedHelpOptions.length > 0 && (
                    <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                      <div className="text-xs font-medium text-blue-800 mb-2">
                        Looking for help with:
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {selectedHelpOptions.map((optionId) => {
                          const option = supportOptions.find(opt => opt.id === optionId);
                          return option ? (
                            <span
                              key={optionId}
                              className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-200 text-blue-800"
                            >
                              {option.label}
                            </span>
                          ) : null;
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 p-6">
              {/* Sort Dropdown */}
              <div className="flex justify-end mb-6">
                <div className="relative">
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="flex items-center justify-between bg-white border border-gray-300 rounded-lg px-4 py-2 pr-3 text-sm font-medium text-gray-700 hover:border-gray-400 focus:outline-none cursor-pointer min-w-[160px]"
                  >
                    <span>{sortBy}</span>
                    <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>
                  
                  {/* Custom Dropdown Menu */}
                  {isDropdownOpen && (
                    <>
                      {/* Backdrop to close dropdown */}
                      <div 
                        className="fixed inset-0 z-10" 
                        onClick={() => setIsDropdownOpen(false)}
                      />
                      
                      {/* Dropdown Options */}
                      <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-20 overflow-hidden">
                        {[
                          "Recommended",
                          "Distance", 
                          "Price: Low to High",
                          "Price: High to Low",
                          "Top Rated"
                        ].map((option) => (
                          <button
                            key={option}
                            onClick={() => {
                              setSortBy(option);
                              setIsDropdownOpen(false);
                            }}
                            className={`w-full text-left px-4 py-3 text-sm hover:bg-gray-50 transition-colors ${
                              sortBy === option 
                                ? 'bg-gray-50 text-gray-900 font-medium' 
                                : 'text-gray-700'
                            }`}
                          >
                            {option}
                          </button>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Housemates List - Vertical Stack */}
              <div className="space-y-4">
                {filteredHousemates.map((housemate) => {
                  // Parse lifestyle data to get location
                  let lifestyleData: any = {};
                  if (housemate.lifestyle) {
                    try {
                      lifestyleData = typeof housemate.lifestyle === 'string' 
                        ? JSON.parse(housemate.lifestyle) 
                        : housemate.lifestyle;
                    } catch {
                      lifestyleData = {};
                    }
                  }
                  
                  // Determine display location
                  const displayLocation = lifestyleData.location?.city && lifestyleData.location?.state
                    ? `${lifestyleData.location.city}, ${lifestyleData.location.state}`
                    : "Location not specified";
                  
                  return (
                    <HousemateHorizontalCard
                      key={`housemate-${housemate.id}`}
                      id={housemate.id}
                      name={housemate.name}
                      location={displayLocation}
                      occupation={housemate.occupation || "Not specified"}
                      gender={housemate.gender || "Not specified"}
                      ageRange={housemate.ageRange || "Not specified"}
                      maxBudget={housemate.price}
                      profileImage={housemate.images?.[0]}
                      bio={housemate.smallDescription}
                      isVerified={true}
                      userId={housemate.userId || ""}
                      email={housemate.email || ""}
                      lifestyle={housemate.lifestyle}
                      onContact={handleContactHousemate}
                    />
                  );
                })}
              </div>
              
              {filteredHousemates.length === 0 && (
                <div className="text-center py-12">
                  {activeFiltersCount > 0 ? (
                    <>
                      <p className="text-gray-500 text-lg">No housemates match your current filters.</p>
                      <p className="text-gray-400 text-sm mt-2">Try adjusting your filter criteria or clearing all filters.</p>
                      <button 
                        onClick={clearAllFilters}
                        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Clear All Filters
                      </button>
                    </>
                  ) : (
                    <>
                      <p className="text-gray-500 text-lg">No housemate profiles available at the moment.</p>
                      <p className="text-gray-400 text-sm mt-2">Check back later for new profiles.</p>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Contact Modal */}
        <ContactHousemateModal
          isOpen={contactModal.isOpen}
          onClose={closeContactModal}
          housemateName={contactModal.housemateName}
          housemateEmail={contactModal.housemateEmail}
          housemateId={contactModal.housemateId}
        />

        {/* Mobile Filters Modal */}
        {showMobileFilters && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 lg:hidden">
            <div className="fixed inset-0 flex items-end justify-center">
              <div className="bg-white w-full max-h-[85vh] rounded-t-xl overflow-hidden">
                {/* Modal Header */}
                <div className="flex items-center justify-between p-4 border-b border-gray-200">
                  <h2 className="text-lg font-semibold text-gray-900">Filters ({activeFiltersCount})</h2>
                  <div className="flex items-center gap-3">
                    <button 
                      onClick={clearAllFilters}
                      className="text-green-700 hover:text-green-800 text-sm font-medium"
                    >
                      Clear all
                    </button>
                    <button
                      onClick={() => setShowMobileFilters(false)}
                      className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                      <X size={20} className="text-gray-600" />
                    </button>
                  </div>
                </div>

                {/* Modal Content */}
                <div className="overflow-y-auto max-h-[calc(85vh-64px)] p-4">
                  {/* Budget Filter */}
                  <div className="mb-6">
                    <h4 className="font-medium text-gray-900 mb-3">Minimum Budget</h4>
                    <div className="mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-bold text-green-700">At least ${budgetMax}</span>
                        <span className="text-sm text-gray-500">per month</span>
                      </div>
                    </div>
                    <div className="mt-3">
                      <input 
                        type="range" 
                        min="0" 
                        max="2000" 
                        value={budgetMax}
                        onChange={(e) => setBudgetMax(Number(e.target.value))}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none slider cursor-pointer"
                      />
                      <div className="flex justify-between text-xs text-gray-500 mt-2">
                        <span>$0</span>
                        <span>$2000</span>
                      </div>
                      <p className="text-xs text-gray-500 mt-2">
                        See housemates with budgets at or above this amount
                      </p>
                    </div>
                  </div>

                  {/* Gender Filter */}
                  <div className="mb-6">
                    <h4 className="font-medium text-gray-900 mb-3">Gender</h4>
                    <p className="text-xs text-gray-500 mb-3">Select preferred gender</p>
                    <div className="flex flex-wrap gap-2">
                      {[
                        { id: "male", label: "Male" },
                        { id: "female", label: "Female" }
                      ].map((option) => {
                        const isSelected = selectedGender === option.id;
                        
                        return (
                          <button
                            key={option.id}
                            type="button"
                            onClick={() => {
                              if (isSelected) {
                                setSelectedGender("");
                              } else {
                                setSelectedGender(option.id);
                              }
                            }}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                              isSelected
                                ? 'bg-green-800 text-white hover:bg-green-900'
                                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                            }`}
                          >
                            {option.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Smoking Preference Filter */}
                  <div className="mb-6">
                    <h4 className="font-medium text-gray-900 mb-3">Smoking Preference</h4>
                    <p className="text-xs text-gray-500 mb-3">Select your smoking preference</p>
                    <div className="flex flex-wrap gap-2">
                      {[
                        { id: "no", label: "No Smoking" },
                        { id: "occasional", label: "Designated Areas" },
                        { id: "regular", label: "Smoking Allowed" }
                      ].map((option) => {
                        const isSelected = smokingPreference === option.id;
                        
                        return (
                          <button
                            key={option.id}
                            type="button"
                            onClick={() => {
                              if (isSelected) {
                                setSmokingPreference("");
                              } else {
                                setSmokingPreference(option.id);
                              }
                            }}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                              isSelected
                                ? 'bg-green-800 text-white hover:bg-green-900'
                                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                            }`}
                          >
                            {option.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Language Preference Filter */}
                  <div className="mb-6">
                    <h4 className="font-medium text-gray-900 mb-3">Language Preference</h4>
                    <p className="text-xs text-gray-500 mb-3">Select preferred language</p>
                    <div className="flex flex-wrap gap-2">
                      {[
                        { id: "English", label: "English" },
                        { id: "Spanish", label: "Spanish" }
                      ].map((option) => {
                        const isSelected = languagePreference === option.id;
                        
                        return (
                          <button
                            key={option.id}
                            type="button"
                            onClick={() => {
                              if (isSelected) {
                                setLanguagePreference("");
                              } else {
                                setLanguagePreference(option.id);
                              }
                            }}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                              isSelected
                                ? 'bg-green-800 text-white hover:bg-green-900'
                                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                            }`}
                          >
                            {option.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Schedule Preference Filter */}
                  <div className="mb-6">
                    <h4 className="font-medium text-gray-900 mb-3">Schedule Preference</h4>
                    <p className="text-xs text-gray-500 mb-3">Select preferred schedule type</p>
                    <div className="flex flex-wrap gap-2">
                      {scheduleOptions.map((option) => {
                        const isSelected = selectedSchedule === option.id;
                        
                        return (
                          <button
                            key={option.id}
                            type="button"
                            onClick={() => {
                              if (isSelected) {
                                setSelectedSchedule("");
                              } else {
                                setSelectedSchedule(option.id);
                              }
                            }}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                              isSelected
                                ? 'bg-green-800 text-white hover:bg-green-900'
                                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                            }`}
                          >
                            {option.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Social Style Preference Filter */}
                  <div className="mb-6">
                    <h4 className="font-medium text-gray-900 mb-3">Social Style</h4>
                    <p className="text-xs text-gray-500 mb-3">Select preferred social style</p>
                    <div className="flex flex-wrap gap-2">
                      {socialStyleOptions.map((option) => {
                        const isSelected = selectedSocialStyle === option.id;
                        
                        return (
                          <button
                            key={option.id}
                            type="button"
                            onClick={() => {
                              if (isSelected) {
                                setSelectedSocialStyle("");
                              } else {
                                setSelectedSocialStyle(option.id);
                              }
                            }}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                              isSelected
                                ? 'bg-green-800 text-white hover:bg-green-900'
                                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                            }`}
                          >
                            {option.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Occupation Filter */}
                  <div className="mb-6">
                    <h4 className="font-medium text-gray-900 mb-3">Occupation</h4>
                    <p className="text-xs text-gray-500 mb-3">Select occupation type</p>
                    <div className="flex flex-wrap gap-2">
                      {occupationOptions.map((option) => {
                        const isSelected = selectedOccupation === option.id;
                        
                        return (
                          <button
                            key={option.id}
                            type="button"
                            onClick={() => {
                              if (isSelected) {
                                setSelectedOccupation("");
                              } else {
                                setSelectedOccupation(option.id);
                              }
                            }}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                              isSelected
                                ? 'bg-green-800 text-white hover:bg-green-900'
                                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                            }`}
                          >
                            {option.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Can Help With Filter */}
                  <div className="mb-6">
                    <h4 className="font-medium text-gray-900 mb-3">Can help with</h4>
                    <p className="text-xs text-gray-500 mb-3">Select services you're looking for</p>
                    <div className="flex flex-wrap gap-2">
                      {supportOptions.map((option) => {
                        const isSelected = selectedHelpOptions.includes(option.id);
                        
                        return (
                          <button
                            key={option.id}
                            type="button"
                            onClick={() => {
                              if (isSelected) {
                                setSelectedHelpOptions(prev => prev.filter(id => id !== option.id));
                              } else {
                                setSelectedHelpOptions(prev => [...prev, option.id]);
                              }
                            }}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                              isSelected
                                ? 'bg-green-800 text-white hover:bg-green-900'
                                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                            }`}
                          >
                            {option.label}
                          </button>
                        );
                      })}
                    </div>
                    
                    {/* Selected options summary */}
                    {selectedHelpOptions.length > 0 && (
                      <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                        <div className="text-xs font-medium text-blue-800 mb-2">
                          Looking for help with:
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {selectedHelpOptions.map((optionId) => {
                            const option = supportOptions.find(opt => opt.id === optionId);
                            return option ? (
                              <span
                                key={optionId}
                                className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-200 text-blue-800"
                              >
                                {option.label}
                              </span>
                            ) : null;
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Modal Footer */}
                <div className="border-t border-gray-200 p-4">
                  <button
                    onClick={() => setShowMobileFilters(false)}
                    className="w-full bg-green-800 hover:bg-green-900 text-white py-3 rounded-lg font-medium transition-colors"
                  >
                    Show {filteredHousemates.length} Result{filteredHousemates.length !== 1 ? 's' : ''}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </>
    );
  }

  // If this is the template category, show the map view with sidebar grid layout
  if (category === 'template') {
    const listingData = data as Listing[];
    
    return (
      <div className="h-screen flex flex-col">
        {/* Mobile View Toggle Buttons */}
        <div className="md:hidden px-4 py-2 bg-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">
                {visibleListings.length > 0
                  ? (visibleListings.length > 1000 
                      ? `Over ${Math.floor(visibleListings.length / 1000) * 1000} listings in view` 
                      : `${visibleListings.length} listing${visibleListings.length !== 1 ? 's' : ''} in view`
                    )
                  : (listingData.length > 1000 
                      ? `Over ${Math.floor(listingData.length / 1000) * 1000} total listings` 
                      : `${listingData.length} total listing${listingData.length !== 1 ? 's' : ''}`
                    )
                }
              </p>
            </div>
            <div className="flex gap-2">
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
        
        {/* Mobile View - Both map and list, but toggle visibility */}
        <div className="flex-1 md:hidden relative">
          {/* Mobile Map View - Always mounted but hidden/shown */}
          <div className={`absolute inset-0 ${showMobileMap ? 'block' : 'hidden'}`}>
            <ListingsMap 
              listings={listingData} 
              className="w-full h-full"
              onVisibleListingsChange={handleVisibleListingsChange}
            />
          </div>
          
          {/* Mobile List View - Always mounted but hidden/shown */}
          <div className={`absolute inset-0 ${!showMobileMap ? 'block' : 'hidden'} overflow-y-auto`}>
            <div className="p-4">
              {visibleListings.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">
                    {listingData.length === 0 
                      ? "No listings available" 
                      : "Switch to map view and pan around to see listings in different areas"
                    }
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {visibleListings.map((listing, index) => (
                    <ListingCard
                      key={`mobile-visible-${index}-${listing.id}`}
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
        
        {/* Desktop View - Side by Side Layout */}
        <div className="flex-1 hidden md:flex">
          {/* Map - takes 1/3 of the space */}
          <div className="w-1/3">
            <ListingsMap 
              listings={listingData} 
              className="w-full h-full"
              onVisibleListingsChange={handleVisibleListingsChange}
            />
          </div>
          
          {/* Listings Sidebar - Right side with grid layout - takes 2/3 of the space */}
          <div className="flex-1 bg-white border-l border-gray-200 flex flex-col">
            {/* Desktop listing count header */}
            <div className="p-4 bg-white">
              <p className="text-sm text-gray-600">
                {visibleListings.length > 0 
                  ? (visibleListings.length > 1000 
                      ? `Over ${Math.floor(visibleListings.length / 1000) * 1000} listings in this area` 
                      : `${visibleListings.length} listing${visibleListings.length !== 1 ? 's' : ''} in this area`
                    )
                  : (listingData.length > 1000 
                      ? `Over ${Math.floor(listingData.length / 1000) * 1000} total listings` 
                      : `${listingData.length} total listing${listingData.length !== 1 ? 's' : ''}`
                    )
                }
              </p>
            </div>
            
            <div className="flex-1 overflow-y-auto">
              <div className="p-4">
                {visibleListings.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500">
                      {listingData.length === 0 
                        ? "No listings available" 
                        : "Pan or zoom the map to see listings in this area"
                      }
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-3 gap-4">
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
      {/* Listing count header */}
      <div className="mb-6 pt-4">
        <p className="text-sm text-gray-600">
          {(data as Listing[]).length > 1000 
            ? `Over ${Math.floor((data as Listing[]).length / 1000) * 1000} listings` 
            : `${(data as Listing[]).length} listing${(data as Listing[]).length !== 1 ? 's' : ''}`
          }
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 sm:grid-cols-2 gap-10 mt-4">
        {(data as Listing[]).map((product) => (
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
