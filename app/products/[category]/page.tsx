"use client";

import { useEffect, useState } from "react";
import { ListingsMap } from "@/app/components/ListingsMap";
import { ListingCard } from "@/app/components/ListingCard";
import { ProductCard } from "@/app/components/ProductCard";
import { HousemateCard } from "@/app/components/HousemateCard";
import { ContactHousemateModal } from "@/app/components/ContactHousemateModal";
import { notFound, useParams, useRouter, useSearchParams } from "next/navigation";
import { Map, List, CheckCircle, Filter, X, Sparkles, ChefHat, TreePine, ShoppingBag, Heart, PawPrint, Monitor, Car } from "lucide-react";
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
  const searchParams = useSearchParams();
  const category = params.category as string;
  const [data, setData] = useState<Listing[] | HousemateProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedListing, setSelectedListing] = useState<string | null>(null);
  const [visibleListings, setVisibleListings] = useState<Listing[]>([]);
  const [showMobileMap, setShowMobileMap] = useState(true);
  
  // Applied filters state (used for actual filtering)
  const [appliedLocation, setAppliedLocation] = useState("");
  const [appliedBudgetMax, setAppliedBudgetMax] = useState(0);
  const [appliedGender, setAppliedGender] = useState("");
  const [appliedSmokingPreference, setAppliedSmokingPreference] = useState("");
  const [appliedLanguagePreference, setAppliedLanguagePreference] = useState("");
  const [appliedSchedule, setAppliedSchedule] = useState("");
  const [appliedSocialStyle, setAppliedSocialStyle] = useState("");
  const [appliedOccupation, setAppliedOccupation] = useState("");
  const [appliedHelpOptions, setAppliedHelpOptions] = useState<string[]>([]);
  
  // Pending filters state (used in modal before applying)
  const [location, setLocation] = useState("");
  const [budgetMax, setBudgetMax] = useState(0);
  const [selectedGender, setSelectedGender] = useState("");
  const [smokingPreference, setSmokingPreference] = useState("");
  const [languagePreference, setLanguagePreference] = useState("");
  const [selectedSchedule, setSelectedSchedule] = useState("");
  const [selectedSocialStyle, setSelectedSocialStyle] = useState("");
  const [selectedOccupation, setSelectedOccupation] = useState("");
  const [selectedHelpOptions, setSelectedHelpOptions] = useState<string[]>([]);
  
  // Custom dropdown state
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 18; // 6 rows × 3 columns
  
  // Support options available for selection
  const supportOptions = [
    { id: "cleaning", label: "Cleaning", color: 'bg-blue-50', iconColor: 'text-blue-700', icon: 'sparkles' },
    { id: "cooking", label: "Cooking", color: 'bg-orange-50', iconColor: 'text-orange-700', icon: 'chef-hat' },
    { id: "yardWork", label: "Yard Work", color: 'bg-green-50', iconColor: 'text-green-700', icon: 'leaf' },
    { id: "shoppingErrands", label: "Shopping & Errands", color: 'bg-purple-50', iconColor: 'text-purple-700', icon: 'shopping-bag' },
    { id: "companionship", label: "Companionship", color: 'bg-pink-50', iconColor: 'text-pink-700', icon: 'heart' },
    { id: "petCare", label: "Pet Care", color: 'bg-amber-50', iconColor: 'text-amber-700', icon: 'paw' },
    { id: "techSupport", label: "Tech Support", color: 'bg-indigo-50', iconColor: 'text-indigo-700', icon: 'monitor' },
    { id: "transportation", label: "Transportation", color: 'bg-slate-50', iconColor: 'text-slate-700', icon: 'car' },
  ];

  // Helper function to map database values to UI option IDs
  const mapDatabaseToUIOption = (databaseValue: string): string => {
    // Handle the gardening -> yardWork mapping
    if (databaseValue === "gardening") {
      return "yardWork";
    }
    return databaseValue;
  };

  // Helper function to check if an option matches (handles backward compatibility)
  const doesOptionMatch = (selectedOption: string, databaseArray: string[]): boolean => {
    // Direct match
    if (databaseArray.includes(selectedOption)) {
      return true;
    }
    
    // Handle yardWork -> gardening mapping for backward compatibility
    if (selectedOption === "yardWork" && databaseArray.includes("gardening")) {
      return true;
    }
    
    return false;
  };

  // Function to render help type icons
  const renderHelpTypeIcon = (iconName: string) => {
    const iconProps = "w-4 h-4";
    switch (iconName) {
      case 'sparkles':
        return <Sparkles className={iconProps} />;
      case 'chef-hat':
        return <ChefHat className={iconProps} />;
      case 'leaf':
        return <TreePine className={iconProps} />;
      case 'shopping-bag':
        return <ShoppingBag className={iconProps} />;
      case 'heart':
        return <Heart className={iconProps} />;
      case 'paw':
        return <PawPrint className={iconProps} />;
      case 'monitor':
        return <Monitor className={iconProps} />;
      case 'car':
        return <Car className={iconProps} />;
      default:
        return <Filter className={iconProps} />;
    }
  };
  
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

  // Function to calculate preview count based on pending filters
  const calculatePreviewCount = (housemateData: HousemateProfile[]) => {
    return housemateData.filter((housemate) => {
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

      // Location filter
      if (location && location.trim()) {
        const searchLocation = location.trim();
        if (lifestyleData.location?.city && lifestyleData.location?.state) {
          const isMatch = isLocationMatch(
            searchLocation,
            lifestyleData.location.city,
            lifestyleData.location.state,
            35
          );
          if (!isMatch) {
            return false;
          }
        }
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

      // Help options filter
      if (selectedHelpOptions.length > 0) {
        const hasAllMatchingOptions = selectedHelpOptions.every(option => 
          doesOptionMatch(option, canHelpWithArray)
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
  };

  // Function to apply pending filters
  const applyFilters = () => {
    setAppliedLocation(location);
    setAppliedBudgetMax(budgetMax);
    setAppliedGender(selectedGender);
    setAppliedSmokingPreference(smokingPreference);
    setAppliedLanguagePreference(languagePreference);
    setAppliedSchedule(selectedSchedule);
    setAppliedSocialStyle(selectedSocialStyle);
    setAppliedOccupation(selectedOccupation);
    setAppliedHelpOptions(selectedHelpOptions);
    setShowMobileFilters(false);
    setCurrentPage(1); // Reset to first page when filters are applied
  };

  // Function to open filters modal and initialize pending filters
  const openFiltersModal = () => {
    // Initialize pending filters with current applied filters
    setLocation(appliedLocation);
    setBudgetMax(appliedBudgetMax);
    setSelectedGender(appliedGender);
    setSmokingPreference(appliedSmokingPreference);
    setLanguagePreference(appliedLanguagePreference);
    setSelectedSchedule(appliedSchedule);
    setSelectedSocialStyle(appliedSocialStyle);
    setSelectedOccupation(appliedOccupation);
    setSelectedHelpOptions(appliedHelpOptions);
    setShowMobileFilters(true);
  };

  // Handle escape key to close filters modal
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && showMobileFilters) {
        setShowMobileFilters(false);
      }
    };

    if (showMobileFilters) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [showMobileFilters]);

  // Load URL parameters and set initial filter state
  useEffect(() => {
    const locationParam = searchParams.get('location');
    const helpStartsParam = searchParams.get('helpStarts');
    const typeOfHelpParam = searchParams.get('typeOfHelp');
    const whoParam = searchParams.get('who');
    
    if (locationParam) {
      setLocation(locationParam);
      setAppliedLocation(locationParam);
    }
    
    // Map other parameters to relevant filters
    if (typeOfHelpParam) {
      // Handle comma-separated values for multi-select
      const helpTypes = typeOfHelpParam.split(',').map(type => type.trim());
      const allMatchedHelpOptions: string[] = [];
      
      helpTypes.forEach(helpType => {
        const searchTerm = helpType.toLowerCase();
        const matchedHelpOptions = supportOptions.filter(option => {
          const optionLabel = option.label.toLowerCase();
          // Check if the search term contains the option label or vice versa
          return searchTerm.includes(optionLabel) || optionLabel.includes(searchTerm) ||
                 // Handle common variations
                 (searchTerm.includes('clean') && optionLabel.includes('clean')) ||
                 (searchTerm.includes('cook') && optionLabel.includes('cook')) ||
                 (searchTerm.includes('garden') && optionLabel.includes('yard')) ||
                 (searchTerm.includes('errand') && optionLabel.includes('errand')) ||
                 (searchTerm.includes('companion') && optionLabel.includes('companion')) ||
                 (searchTerm.includes('pet') && optionLabel.includes('pet')) ||
                 (searchTerm.includes('tech') && optionLabel.includes('tech')) ||
                 (searchTerm.includes('security') && optionLabel.includes('security')) ||
                 // Handle additional common terms
                 (searchTerm.includes('house') && optionLabel.includes('clean')) ||
                 (searchTerm.includes('meal') && optionLabel.includes('cook')) ||
                 (searchTerm.includes('shopping') && optionLabel.includes('errand')) ||
                 (searchTerm.includes('computer') && optionLabel.includes('tech')) ||
                 (searchTerm.includes('dog') && optionLabel.includes('pet')) ||
                 (searchTerm.includes('cat') && optionLabel.includes('pet')) ||
                 (searchTerm.includes('yard') && optionLabel.includes('yard'));
        });
        
        // Add matched options to the array, avoiding duplicates
        matchedHelpOptions.forEach(option => {
          if (!allMatchedHelpOptions.includes(option.id)) {
            allMatchedHelpOptions.push(option.id);
          }
        });
      });
      
      if (allMatchedHelpOptions.length > 0) {
        setSelectedHelpOptions(allMatchedHelpOptions);
        setAppliedHelpOptions(allMatchedHelpOptions);
      }
    }
    
    if (whoParam) {
      // Try to match demographics - could be gender, age, occupation, etc.
      const lowerWho = whoParam.toLowerCase();
      if (lowerWho.includes('male') || lowerWho.includes('female')) {
        if (lowerWho.includes('male') && !lowerWho.includes('female')) {
          setSelectedGender('male');
          setAppliedGender('male');
        } else if (lowerWho.includes('female') && !lowerWho.includes('male')) {
          setSelectedGender('female');
          setAppliedGender('female');
        }
      }
      
      if (lowerWho.includes('student')) {
        setSelectedOccupation('student');
        setAppliedOccupation('student');
      } else if (lowerWho.includes('professional')) {
        setSelectedOccupation('professional');
        setAppliedOccupation('professional');
      } else if (lowerWho.includes('retired')) {
        setSelectedOccupation('retired');
        setAppliedOccupation('retired');
      }
    }
  }, [searchParams]);

  useEffect(() => {
    async function fetchData() {
      if (!category) return;
      
      // Validate category
      if (!['template', 'uikit', 'icon', 'all', 'housemate', 'housemates'].includes(category)) {
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

  // If this is the icon category (or housemate/housemates), show housemate profiles
  if (category === 'icon' || category === 'housemate' || category === 'housemates') {
    const housemateData = data as HousemateProfile[];
    
    // Calculate active filters count
    const activeFiltersCount = [
      appliedGender,
      appliedSmokingPreference,
      appliedLanguagePreference,
      appliedSchedule,
      appliedSocialStyle,
      appliedOccupation,
      appliedHelpOptions.length > 0,
      appliedBudgetMax > 0
    ].filter(Boolean).length;
    
    const clearAllFilters = () => {
      // Clear applied filters
      setAppliedGender("");
      setAppliedSmokingPreference("");
      setAppliedLanguagePreference("");
      setAppliedSchedule("");
      setAppliedSocialStyle("");
      setAppliedOccupation("");
      setAppliedHelpOptions([]);
      setAppliedBudgetMax(0);
      
      // Clear pending filters
      setSelectedGender("");
      setSmokingPreference("");
      setLanguagePreference("");
      setSelectedSchedule("");
      setSelectedSocialStyle("");
      setSelectedOccupation("");
      setSelectedHelpOptions([]);
      setBudgetMax(0);
      
      // Reset pagination when filters change
      setCurrentPage(1);
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
      if (appliedLocation && appliedLocation.trim()) {
        const searchLocation = appliedLocation.trim();
        
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
      if (housemateBudget < appliedBudgetMax) {
        return false;
      }

      // Can help with filters
      if (appliedHelpOptions.length > 0) {
        const hasAllMatchingOptions = appliedHelpOptions.every(option => 
          doesOptionMatch(option, canHelpWithArray)
        );
        if (!hasAllMatchingOptions) {
          return false;
        }
      }

      // Gender filter
      if (appliedGender && housemate.gender !== appliedGender) {
        return false;
      }

      // Smoking preference filter
      if (appliedSmokingPreference) {
        const housemateSmoking = lifestyleData.smokingStatus;
        if (appliedSmokingPreference === "no" && housemateSmoking !== "no") {
          return false;
        }
        if (appliedSmokingPreference === "occasional" && housemateSmoking !== "outside") {
          return false;
        }
        if (appliedSmokingPreference === "regular" && housemateSmoking !== "yes") {
          return false;
        }
      }

      // Language preference filter
      if (appliedLanguagePreference) {
        const housemateLanguage = lifestyleData.language;
        if (appliedLanguagePreference.toLowerCase() !== housemateLanguage?.toLowerCase()) {
          return false;
        }
      }

      // Schedule preference filter
      if (appliedSchedule) {
        if (appliedSchedule !== housemate.schedule) {
          return false;
        }
      }

      // Social style preference filter
      if (appliedSocialStyle) {
        if (appliedSocialStyle !== housemate.socialPreference) {
          return false;
        }
      }

      // Occupation filter
      if (appliedOccupation) {
        // Determine the housemate's occupation type
        let housemateOccupationType = "";
        
        if (lifestyleData.occupationDetails?.isRetired) {
          housemateOccupationType = "retired";
        } else if (lifestyleData.education?.stillAttending) {
          housemateOccupationType = "student";
        } else if (housemate.occupation || lifestyleData.occupationDetails?.description) {
          housemateOccupationType = "professional";
        }
        
        if (appliedOccupation !== housemateOccupationType) {
          return false;
        }
      }

      return true;
    });
    
    // Pagination calculations and functions
    const totalPages = Math.ceil(filteredHousemates.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const currentPageHousemates = filteredHousemates.slice(startIndex, endIndex);
    
    const goToPage = (page: number) => {
      if (page >= 1 && page <= totalPages) {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    };
    
    const nextPage = () => goToPage(currentPage + 1);
    const prevPage = () => goToPage(currentPage - 1);
    
    // Generate page numbers for pagination
    const generatePageNumbers = () => {
      const pages = [];
      const maxPagesToShow = 5;
      
      if (totalPages <= maxPagesToShow) {
        // Show all pages if total is less than max
        for (let i = 1; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        // Show first page, current page range, and last page
        pages.push(1);
        
        let startPage = Math.max(2, currentPage - 1);
        let endPage = Math.min(totalPages - 1, currentPage + 1);
        
        if (startPage > 2) {
          pages.push('...');
        }
        
        for (let i = startPage; i <= endPage; i++) {
          pages.push(i);
        }
        
        if (endPage < totalPages - 1) {
          pages.push('...');
        }
        
        if (totalPages > 1) {
          pages.push(totalPages);
        }
      }
      
      return pages;
    };
    
    return (
      <>
        <div className="min-h-screen bg-gray-50 overflow-x-hidden">
          {/* Helper Counter and Filters - Under Navbar */}
          <div className="py-3">
            <div className="max-w-7xl mx-auto px-4 flex items-center gap-4">
              <span className="text-lg font-semibold text-gray-900">
                {filteredHousemates.length} helpers
              </span>
              <button
                onClick={openFiltersModal}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
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
          </div>
          
          {/* Mobile Layout */}
          <div className="lg:hidden flex flex-col overflow-x-hidden">
            {/* Housemates List - Stacked */}
            <div className="px-4 py-6">
              {/* Housemates List - Stacked */}
              <div className="space-y-4 pb-40 lg:pb-20">
                {currentPageHousemates.map((housemate) => {
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
              
              {/* Mobile Pagination */}
              {currentPageHousemates.length > 0 && totalPages > 1 && (
                <div className="flex justify-center py-8">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={prevPage}
                      disabled={currentPage === 1}
                      className={`px-3 py-2 rounded-md text-sm font-medium ${
                        currentPage === 1
                          ? 'text-gray-400 cursor-not-allowed'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      ‹
                    </button>
                    
                    {generatePageNumbers().map((page, index) => (
                      <button
                        key={index}
                        onClick={() => typeof page === 'number' && goToPage(page)}
                        disabled={page === '...'}
                        className={`px-3 py-2 rounded-md text-sm font-medium ${
                          page === currentPage
                            ? 'bg-black text-white'
                            : page === '...'
                            ? 'text-gray-400 cursor-not-allowed'
                            : 'text-gray-600 hover:text-gray-900'
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                    
                    <button
                      onClick={nextPage}
                      disabled={currentPage === totalPages}
                      className={`px-3 py-2 rounded-md text-sm font-medium ${
                        currentPage === totalPages
                          ? 'text-gray-400 cursor-not-allowed'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      ›
                    </button>
                  </div>
                </div>
              )}
              
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
          <div className="hidden lg:block max-w-7xl mx-auto">

            {/* Main Content Area */}
            <div className="p-6">
              {/* Housemates List - Grid Layout */}
              <div className="grid grid-cols-2 gap-4">
                {currentPageHousemates.map((housemate) => {
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
              
              {/* Desktop Pagination */}
              {currentPageHousemates.length > 0 && totalPages > 1 && (
                <div className="flex justify-center py-8">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={prevPage}
                      disabled={currentPage === 1}
                      className={`px-3 py-2 rounded-md text-sm font-medium ${
                        currentPage === 1
                          ? 'text-gray-400 cursor-not-allowed'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      ‹
                    </button>
                    
                    {generatePageNumbers().map((page, index) => (
                      <button
                        key={index}
                        onClick={() => typeof page === 'number' && goToPage(page)}
                        disabled={page === '...'}
                        className={`px-3 py-2 rounded-md text-sm font-medium ${
                          page === currentPage
                            ? 'bg-black text-white'
                            : page === '...'
                            ? 'text-gray-400 cursor-not-allowed'
                            : 'text-gray-600 hover:text-gray-900'
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                    
                    <button
                      onClick={nextPage}
                      disabled={currentPage === totalPages}
                      className={`px-3 py-2 rounded-md text-sm font-medium ${
                        currentPage === totalPages
                          ? 'text-gray-400 cursor-not-allowed'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      ›
                    </button>
                  </div>
                </div>
              )}
              
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

        {/* Filters Modal */}
        {showMobileFilters && (
          <div className="fixed inset-0 z-50" onClick={() => setShowMobileFilters(false)}>
            <div className="fixed inset-0 flex items-end lg:items-center justify-center">
              <div className="bg-white w-full lg:w-auto lg:min-w-[600px] lg:max-w-[800px] max-h-[85vh] lg:max-h-[80vh] rounded-t-xl lg:rounded-xl overflow-hidden shadow-2xl border border-gray-200 flex flex-col" onClick={(e) => e.stopPropagation()}>
                {/* Modal Header */}
                <div className="flex items-center justify-between p-4 border-b border-gray-200 flex-shrink-0">
                  <h2 className="text-lg font-semibold text-gray-900">Filters ({activeFiltersCount})</h2>
                  <button
                    onClick={() => setShowMobileFilters(false)}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <X size={20} className="text-gray-600" />
                  </button>
                </div>

                {/* Modal Content */}
                <div className="overflow-y-auto flex-1 p-4">
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

                  {/* Type of Help Wanted Filter */}
                  <div className="mb-6">
                    <h4 className="font-medium text-gray-900 mb-3">Type of help wanted (select all that apply)</h4>
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
                            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                              isSelected
                                ? 'bg-green-800 text-white hover:bg-green-900'
                                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                            }`}
                          >
                            <div className={`flex items-center justify-center ${
                              isSelected ? 'text-white' : 'text-gray-600'
                            }`}>
                              {renderHelpTypeIcon(option.icon)}
                            </div>
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
                                className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-blue-200 text-blue-800"
                              >
                                <div className="flex items-center justify-center text-blue-800">
                                  {renderHelpTypeIcon(option.icon)}
                                </div>
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
                <div className="border-t border-gray-200 p-4 flex-shrink-0">
                  <div className="flex items-center justify-between">
                    <button 
                      onClick={clearAllFilters}
                      className="text-green-700 hover:text-green-800 text-sm font-medium underline"
                    >
                      Clear all
                    </button>
                    <button
                      onClick={applyFilters}
                      className="bg-green-800 hover:bg-green-900 text-white py-3 px-8 rounded-lg font-medium transition-colors"
                    >
                      Show {calculatePreviewCount(housemateData).length} Result{calculatePreviewCount(housemateData).length !== 1 ? 's' : ''}
                    </button>
                  </div>
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
