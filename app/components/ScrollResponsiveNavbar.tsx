"use client";

import { useState, useEffect, useCallback } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from "next/link";
import Image from "next/image";
import { Search, X } from "lucide-react";

interface ScrollResponsiveNavbarProps {
  showNavLinks: boolean;
  navLinksComponent: React.ReactNode;
  userNavigation: React.ReactNode;
}

export function ScrollResponsiveNavbar({ 
  showNavLinks, 
  navLinksComponent, 
  userNavigation 
}: ScrollResponsiveNavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [ignoreScrollEvents, setIgnoreScrollEvents] = useState(false);
  const [showWhereDropdown, setShowWhereDropdown] = useState(false);
  const [showTypeOfHelpDropdown, setShowTypeOfHelpDropdown] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [showDemographicDropdown, setShowDemographicDropdown] = useState(false);
  const [selectedDateRange, setSelectedDateRange] = useState<{start: Date | null, end: Date | null}>({start: null, end: null});
  const [currentCalendarMonth, setCurrentCalendarMonth] = useState(new Date());
  const [activeField, setActiveField] = useState<number | null>(null);
  const [selectedWhere, setSelectedWhere] = useState('');
  const [selectedHelpStarts, setSelectedHelpStarts] = useState('');
  const [selectedTypeOfHelp, setSelectedTypeOfHelp] = useState<string[]>([]);
  const [selectedWho, setSelectedWho] = useState('');
  const [selectedDemographic, setSelectedDemographic] = useState<string[]>([]);
  const [isCondensedExpanded, setIsCondensedExpanded] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  // Determine if we should show condensed mode based on page and scroll state
  const shouldShowCondensed = () => {
    // Show full search bar only on home page and /homes page
    const isMainPage = pathname === '/' || pathname === '/homes' || pathname.startsWith('/homes/');
    
    if (isMainPage) {
      // On main pages, only show condensed when scrolled
      return isScrolled;
    } else {
      // On search result pages, show condensed by default (unless at very top)
      return true;
    }
  };

  const isInCondensedMode = shouldShowCondensed() && !isCondensedExpanded;

  // Simple scroll handler - expanded ONLY at very top
  const handleScroll = useCallback(() => {
    // Ignore scroll events briefly after state changes to prevent bounce
    if (ignoreScrollEvents) return;
    
    const scrollTop = window.pageYOffset;
    
    // Trigger condensed on ANY scroll movement, even sub-pixel
    if (!isScrolled && scrollTop > 0) {
      setIgnoreScrollEvents(true);
      setIsScrolled(true);
      
      // Longer ignore period to fully prevent bounce
      setTimeout(() => {
        setIgnoreScrollEvents(false);
      }, 200);
    } else if (isScrolled && scrollTop <= 0) {
      // Return to expanded when at or below top (handles overscroll)
      setIgnoreScrollEvents(true);
      setIsScrolled(false);
      setIsCondensedExpanded(false); // Reset expanded state when returning to top
      
      // Longer ignore period to fully prevent bounce
      setTimeout(() => {
        setIgnoreScrollEvents(false);
      }, 200);
    }
  }, [isScrolled, ignoreScrollEvents]);

  useEffect(() => {
    let ticking = false;
    let settlingTimeout: NodeJS.Timeout;
    
    const debouncedHandleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          // Clear any pending settling timeout
          clearTimeout(settlingTimeout);
          
          // Wait for scroll to settle before changing state
          settlingTimeout = setTimeout(() => {
            handleScroll();
          }, 100);
          
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', debouncedHandleScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', debouncedHandleScroll);
      clearTimeout(settlingTimeout);
    };
  }, [handleScroll]);

  // Determine which icon to show based on current page
  const getSelectedIcon = () => {
    if (pathname === '/homes' || pathname.startsWith('/homes/') || pathname === '/products/template') {
      return {
        src: "/header-homes.png",
        alt: "Homes"
      };
    }
    // Default to helper icon for homepage and other pages
    return {
      src: "/headr-helper.png",
      alt: "Helper"
    };
  };

  const selectedIcon = getSelectedIcon();

  // Determine if we're in helper mode
  const isHelperMode = pathname === '/' || pathname.startsWith('/products/icon') || pathname.includes('helper') || pathname.includes('housemate');
  
  // Get search fields based on mode
  const getSearchFields = () => {
    if (isHelperMode) {
      return {
        condensed: ['Home', 'Anytime', 'Support'],
        full: [
          { label: 'Where', placeholder: 'Search locations' },
          { label: 'Help starts', placeholder: 'Add dates' },
          { label: 'Type of help', placeholder: 'Add tasks' }
        ]
      };
    }
    // Check if we're on homes page or products/template (where homes are displayed)
    const isHomesMode = pathname === '/homes' || pathname.startsWith('/homes/') || pathname === '/products/template';
    
    if (isHomesMode) {
      return {
        condensed: ['Home', 'Anytime', 'Value'],
        full: [
          { label: 'Where', placeholder: 'Search destinations' },
          { label: 'Available', placeholder: 'Add dates' },
          { label: 'Budget', placeholder: 'Add budget' }
        ]
      };
    }
    
    return {
      condensed: ['Anywhere', 'Anytime', 'Add guests'],
      full: [
        { label: 'Where', placeholder: 'Search destinations' },
        { label: 'Check in', placeholder: 'Add dates' },
        { label: 'Check out', placeholder: 'Add dates' },
        { label: 'Who', placeholder: 'Add guests' }
      ]
    };
  };

  const searchFields = getSearchFields();

  // Handle location selection
  const handleLocationSelect = (location: string) => {
    setSelectedWhere(location);
    setShowWhereDropdown(false);
    // Move to next field (Help starts) and auto-open calendar
    setTimeout(() => {
      setActiveField(1);
      setShowCalendar(true);
    }, 100);
  };

  // Handle type of help selection (multi-select)
  const handleTypeOfHelpSelect = (helpType: string) => {
    setSelectedTypeOfHelp(prev => {
      const newSelection = prev.includes(helpType)
        ? prev.filter(item => item !== helpType)
        : [...prev, helpType];
      
      return newSelection;
    });
    // Keep dropdown open for multi-select - users can manually close or use backdrop
  };

  // Handle input changes with auto-advance
  const handleInputChange = (index: number, value: string) => {
    switch (index) {
      case 0: setSelectedWhere(value); break;
      case 1: 
        // Date field is read-only, controlled by calendar
        break;
      case 2: 
        // Type of help is read-only and handled by dropdown
        break;
      case 3: 
        // Demographics field is read-only and handled by dropdown
        break;
    }
  };

  // Handle field focus with auto-advance logic
  const handleFieldFocus = (index: number) => {
    // Close all dropdowns first
    setShowWhereDropdown(false);
    setShowCalendar(false);
    setShowTypeOfHelpDropdown(false);
    setShowDemographicDropdown(false);
    
    // Set active field
    setActiveField(index);
    
    // Open the appropriate dropdown for the clicked field immediately
    if (index === 0) {
      setShowWhereDropdown(true);
    } else if (index === 1) {
      setShowCalendar(true);
    } else if (index === 2) {
      setShowTypeOfHelpDropdown(true);
    }
  };

  // Handle field blur
  const handleFieldBlur = (index: number) => {
    setTimeout(() => setActiveField(null), 100);
    // Auto-close dropdowns with delays to allow for interactions
    if (index === 0) {
      setTimeout(() => setShowWhereDropdown(false), 200);
    }
    // Don't auto-close calendar, type of help, or demographic dropdowns - they have their own backdrop handlers
  };

  // Handle condensed search bar click to expand
  const handleCondensedClick = () => {
    setIsCondensedExpanded(true);
    setActiveField(0);
    setShowWhereDropdown(true);
  };

  // Calendar helper functions
  const formatDateRange = () => {
    const { start } = selectedDateRange;
    if (!start) return '';
    return start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const handleDateSelect = (date: Date) => {
    // Single date selection only
    setSelectedDateRange({ start: date, end: date });
    // Auto-advance to next field and open dropdown
    setTimeout(() => {
      setShowCalendar(false);
      setActiveField(2);
      setShowTypeOfHelpDropdown(true);
    }, 300);
  };

  const handleFlexibleDateSelect = (flexibility: string) => {
    const today = new Date();
    setSelectedDateRange({ start: today, end: today });
    setSelectedHelpStarts(flexibility);
    setTimeout(() => {
      setShowCalendar(false);
      setActiveField(2);
      setShowTypeOfHelpDropdown(true);
    }, 300);
  };

  const navigateCalendar = (direction: 'prev' | 'next') => {
    const newMonth = new Date(currentCalendarMonth);
    newMonth.setMonth(currentCalendarMonth.getMonth() + (direction === 'next' ? 1 : -1));
    setCurrentCalendarMonth(newMonth);
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    
    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add all days in the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }
    
    return days;
  };

  const isDateInRange = (date: Date) => {
    const { start } = selectedDateRange;
    if (!start) return false;
    return date.getTime() === start.getTime();
  };

  const isDateRangeStart = (date: Date) => {
    return selectedDateRange.start && date.getTime() === selectedDateRange.start.getTime();
  };

  const isDateRangeEnd = (date: Date) => {
    return selectedDateRange.start && date.getTime() === selectedDateRange.start.getTime();
  };

  // Available help options
  const helpOptions = [
    { id: "cleaning", label: "Cleaning" },
    { id: "cooking", label: "Cooking" },
    { id: "gardening", label: "Gardening" },
    { id: "errands", label: "Errands" },
    { id: "companionship", label: "Companionship" },
    { id: "petCare", label: "Pet Care" },
    { id: "techSupport", label: "Tech Support" },
    { id: "homeSecurity", label: "Home Security" },
  ];

  // Available demographic options
  const demographicOptions = [
    { category: "Professional Status", options: [
      { id: "retired", label: "Retired", icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
        </svg>
      )},
      { id: "student", label: "Student", icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
        </svg>
      )},
      { id: "professional", label: "Professional", icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      )}
    ]},
    { category: "Gender", options: [
      { id: "male", label: "Male", icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      )},
      { id: "female", label: "Female", icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      )}
    ]},
    { category: "Smoking", options: [
      { id: "smoking", label: "Smoking", icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12h18m-9-9l9 9-9 9" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h8" />
        </svg>
      )},
      { id: "nonSmoking", label: "Non-smoking", icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L18.364 5.636 5.636 18.364" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h8" />
        </svg>
      )}
    ]}
  ];

  // Handle demographic selection (multi-select)
  const handleDemographicSelect = (demographic: string) => {
    setSelectedDemographic(prev => {
      const newSelection = prev.includes(demographic)
        ? prev.filter(item => item !== demographic)
        : [...prev, demographic];
      
      return newSelection;
    });
    // Keep dropdown open for multi-select - users can manually close or use backdrop
  };

  // Handle search button click
  const handleSearch = () => {
    const params = new URLSearchParams();
    
    if (selectedWhere) {
      params.set('location', selectedWhere);
    }
    if (selectedHelpStarts || selectedDateRange.start) {
      params.set('helpStarts', selectedHelpStarts || formatDateRange());
    }
    if (selectedTypeOfHelp.length > 0) {
      params.set('typeOfHelp', selectedTypeOfHelp.join(','));
    }
    
    const queryString = params.toString();
    
    // Determine target URL based on current page
    let targetUrl;
    if (pathname === '/homes' || pathname.startsWith('/homes/')) {
      // If on homes page, search should go to /products/template
      targetUrl = `/products/template${queryString ? `?${queryString}` : ''}`;
    } else {
      // If on home page (helpers mode), search should go to /products/icon
      targetUrl = `/products/icon${queryString ? `?${queryString}` : ''}`;
    }
    
    router.push(targetUrl);
    
    // Auto-condense after searching
    setIsCondensedExpanded(false);
    setActiveField(null);
  };

  // Handle clearing all selections
  const handleClearAll = () => {
    setSelectedWhere('');
    setSelectedHelpStarts('');
    setSelectedTypeOfHelp([]);
    setSelectedDateRange({ start: null, end: null });
  };

  // Handle clearing individual selection
  const handleClearField = (fieldIndex: number) => {
    switch (fieldIndex) {
      case 0:
        setSelectedWhere('');
        break;
      case 1:
        setSelectedHelpStarts('');
        setSelectedDateRange({ start: null, end: null });
        break;
      case 2:
        setSelectedTypeOfHelp([]);
        break;
    }
  };

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl w-full mx-auto px-4 md:px-8">
        {/* Main Navbar Row */}
        <div className="flex items-center justify-between">
          {/* Logo - Positioned further left like Airbnb */}
          <div className={`flex-shrink-0 transition-all duration-500 ease-in-out pt-7 ${isInCondensedMode ? '-mb-30' : 'pb-7'}`}>
            <Link href="/">
              {/* Full logo for larger screens - no size changes */}
              <div className="hidden sm:flex items-center -ml-4 md:-ml-8 lg:-ml-12">
                <Image
                  src="/golden-logo.png"
                  alt="Golden HomeShare"
                  width={320}
                  height={96}
                  className="w-auto h-24 md:h-28 lg:h-32"
                  priority
                />
              </div>
              {/* Logo for mobile - no size changes */}
              <div className="sm:hidden flex items-center -ml-4">
                <Image
                  src="/golden-logo.png"
                  alt="Golden HomeShare"
                  width={240}
                  height={72}
                  className="w-auto h-20"
                  priority
                />
              </div>
            </Link>
          </div>

          {/* Center Content Area - Same top padding, remove bottom when scrolled */}
          <div className={`flex-1 flex justify-center transition-all duration-500 ease-in-out pt-7 ${isInCondensedMode ? '-mb-30' : 'pb-7'}`}>
            {/* Condensed Search Bar when scrolled (hide when expanded) */}
            <div className={`transition-all duration-500 ease-in-out ${
              isInCondensedMode ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform -translate-y-2 pointer-events-none absolute'
            }`}>
              <div 
                className="flex items-center bg-white border border-gray-300 rounded-full shadow-sm hover:shadow-md transition-shadow duration-200 max-w-lg w-full h-18 cursor-pointer" 
                onClick={handleCondensedClick}
              >
                {/* Selected Icon */}
                                  <div className="flex items-center pl-4">
                  <div className="relative w-14 h-14">
                    <Image 
                      src={selectedIcon.src} 
                      alt={selectedIcon.alt}
                      fill
                      className="object-contain"
                    />
                  </div>

                </div>
                
                {/* Condensed Search Sections */}
                <div className="flex-1 flex items-center">
                  {searchFields.condensed.map((text, index) => {
                    const getCondensedValue = () => {
                      if (isHelperMode) {
                        switch (index) {
                          case 0: {
                            // For /products/icon page, show "Helpers in [City]" when location is selected
                            if (pathname === '/products/icon' && selectedWhere) {
                              // Extract city name only (remove state)
                              const cityOnly = selectedWhere.split(',')[0].trim();
                              return `Helpers in ${cityOnly}`;
                            }
                            return selectedWhere || text;
                          }
                          case 1: return text; // Always show placeholder text, not actual dates
                          case 2: return text; // Always show placeholder text, not actual tasks
                          default: return text;
                        }
                      }
                      
                      // For homes mode and default mode, use the same logic
                      switch (index) {
                        case 0: return selectedWhere || text;
                        case 1: return formatDateRange() || text;
                        case 2: return text; // This is "Value" for homes mode, "Add guests" for default mode
                        default: return text;
                      }
                    };
                    
                    const displayValue = getCondensedValue();
                    const hasValue = displayValue !== text;
                    
                    return (
                      <div key={index} className="flex items-center">
                        <div 
                          className="px-5 py-4 cursor-pointer hover:bg-gray-50 rounded-md transition-colors flex items-center"
                          onClick={(e) => {
                            e.stopPropagation(); // Prevent condensed bar expansion
                            setIsCondensedExpanded(true); // Expand to full search bar
                            handleFieldFocus(index);
                          }}
                        >
                          <span className={`text-xl ${hasValue ? 'text-gray-900 font-medium' : 'text-gray-600'}`}>
                            {displayValue}
                          </span>
                        </div>
                        {index < searchFields.condensed.length - 1 && (
                          <div className="w-px h-8 bg-gray-400"></div>
                        )}
                      </div>
                    );
                  })}
                </div>
                
                {/* Search Button */}
                <div className="pr-1">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent condensed bar expansion
                      handleSearch();
                    }}
                    className={`bg-primary hover:bg-primary/90 text-white rounded-full transition-all duration-200 flex items-center gap-2 ${
                      activeField !== null ? 'px-5 py-3' : 'p-2.5'
                    }`}
                  >
                    {activeField !== null && (
                      <span className="text-lg font-medium">Search</span>
                    )}
                    <Search className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Navigation Links (show when not scrolled OR when condensed is expanded) */}
            <div className={`hidden lg:flex justify-center items-center transition-all duration-500 ease-in-out ${
              (!isInCondensedMode || isCondensedExpanded) && showNavLinks ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform -translate-y-2 pointer-events-none absolute'
            }`}>
              {navLinksComponent}
            </div>
          </div>

          {/* User Navigation - Same top padding, remove bottom when scrolled */}
          <div className={`flex items-center gap-x-1 flex-shrink-0 transition-all duration-500 ease-in-out pt-7 ${isInCondensedMode ? '-mb-30' : 'pb-7'}`}>
            {userNavigation}
          </div>
        </div>
        
        {/* Full Search Bar Row (only show when not scrolled or condensed is expanded) */}
        <div className={`flex justify-center transition-all duration-500 ease-in-out ${
          !isInCondensedMode || isCondensedExpanded ? 'pb-4 opacity-100 transform translate-y-0' : 'pb-0 opacity-0 transform -translate-y-4 pointer-events-none'
        }`}>
          <div className="relative max-w-5xl w-full">
            <div className={`flex items-center border border-gray-300 rounded-full shadow-sm hover:shadow-md transition-all duration-200 ${
              activeField !== null ? 'bg-gray-100' : 'bg-white'
            }`}>
              {searchFields.full.map((field, index) => {
                const getFieldValue = () => {
                  if (isHelperMode) {
                    switch (index) {
                      case 0: {
                        // For /products/icon page, show "Helpers in [City]" when location is selected
                        if (pathname === '/products/icon' && selectedWhere) {
                          return `Helpers in ${selectedWhere}`;
                        }
                        return selectedWhere;
                      }
                      case 1: return formatDateRange() || selectedHelpStarts;
                      case 2: return selectedTypeOfHelp.length > 0 ? selectedTypeOfHelp.join(', ') : '';
                      default: return '';
                    }
                  }
                  
                  // Check if we're on homes page or products/template (where homes are displayed)
                  const isHomesMode = pathname === '/homes' || pathname.startsWith('/homes/') || pathname === '/products/template';
                  
                  if (isHomesMode) {
                    switch (index) {
                      case 0: return selectedWhere;
                      case 1: return formatDateRange();
                      case 2: return ''; // Budget field placeholder
                      default: return '';
                    }
                  }
                  
                  // Default mode (non-homes pages)
                  switch (index) {
                    case 0: return selectedWhere;
                    case 1: return formatDateRange();
                    case 2: return ''; // Check out field
                    case 3: return ''; // Who field placeholder
                    default: return '';
                  }
                };
                
                const fieldValue = getFieldValue();
                const isActive = activeField === index || (index === 0 && showWhereDropdown) || (index === 2 && showTypeOfHelpDropdown);
                
                return (
                  <div key={index} className="flex-1 relative">
                    <div 
                      className={`px-6 py-6 relative ${
                        isActive 
                          ? 'bg-white shadow-lg z-10 rounded-full' : 
                          activeField !== null ? 'opacity-60' : ''
                      } transition-all duration-200`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="text-lg font-semibold text-gray-900 mb-1">{field.label}</div>
                        {fieldValue && (
                          <button
                            onClick={() => handleClearField(index)}
                            className="text-gray-400 hover:text-gray-600 transition-colors"
                          >
                            <X className="w-6 h-6" />
                          </button>
                        )}
                      </div>
                      <input 
                        type="text" 
                        value={fieldValue}
                        onChange={(e) => handleInputChange(index, e.target.value)}
                        placeholder={field.placeholder} 
                        className={`w-full text-xl bg-transparent border-none outline-none ${
                          fieldValue ? 'text-gray-900 font-medium' : 'text-gray-600 placeholder-gray-400'
                        }`}
                        onFocus={() => handleFieldFocus(index)}
                        onBlur={() => handleFieldBlur(index)}
                        onClick={index === 0 ? () => handleFieldFocus(0) : index === 1 ? () => handleFieldFocus(1) : index === 2 ? () => handleFieldFocus(2) : undefined}
                        readOnly={index === 0 || index === 1 || index === 2}
                      />
                    </div>
                    {/* Divider - only show when this field and next field are both inactive */}
                    {index < searchFields.full.length - 1 && !isActive && activeField !== index + 1 && (
                      <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-px h-8 bg-gray-300 z-0"></div>
                    )}
                  </div>
                );
              })}
              <div className={`pr-2 ${activeField !== null ? 'opacity-100' : ''} transition-opacity duration-200`}>
                <button 
                  onClick={handleSearch}
                  className={`bg-primary hover:bg-primary/90 text-white rounded-full transition-all duration-200 flex items-center gap-3 ${
                    activeField !== null ? 'px-6 py-4' : 'p-4'
                  }`}
                >
                  {activeField !== null && (
                    <span className="text-lg font-medium">Search</span>
                  )}
                  <Search className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            {/* Where Dropdown */}
            {showWhereDropdown && (
              <>
                {/* Backdrop to close dropdown */}
                <div 
                  className="fixed inset-0 z-40" 
                  onClick={() => {
                    setShowWhereDropdown(false);
                    setActiveField(null);
                    // Don't close expanded search - let user navigate between sections
                  }}
                />
                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-lg border border-gray-200 z-50 max-h-96 overflow-hidden">
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Suggested destinations</h3>
                  <div className="space-y-3 max-h-80 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                    {/* Columbia, MO */}
                    <div 
                      className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors"
                      onClick={() => handleLocationSelect('Columbia, MO')}
                    >
                      <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                        <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                      </div>
                      <div>
                        <div className="font-medium text-gray-900 text-lg">Columbia, MO</div>
                        <div className="text-base text-gray-500">University town with great community</div>
                      </div>
                    </div>
                    
                    {/* Kansas City, MO */}
                    <div 
                      className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors"
                      onClick={() => handleLocationSelect('Kansas City, MO')}
                    >
                      <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                        <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                      </div>
                      <div>
                        <div className="font-medium text-gray-900 text-lg">Kansas City, MO</div>
                        <div className="text-base text-gray-500">Urban area with diverse neighborhoods</div>
                      </div>
                    </div>
                    
                    {/* St. Louis, MO */}
                    <div 
                      className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors"
                      onClick={() => handleLocationSelect('St. Louis, MO')}
                    >
                      <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                        <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                      </div>
                      <div>
                        <div className="font-medium text-gray-900 text-lg">St. Louis, MO</div>
                        <div className="text-base text-gray-500">Historic city with cultural attractions</div>
                      </div>
                    </div>
                    
                    {/* Springfield, MO */}
                    <div 
                      className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors"
                      onClick={() => handleLocationSelect('Springfield, MO')}
                    >
                      <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                        <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                      </div>
                      <div>
                        <div className="font-medium text-gray-900 text-lg">Springfield, MO</div>
                        <div className="text-base text-gray-500">Popular with travelers near you</div>
                      </div>
                    </div>
                    
                    {/* Jefferson City, MO */}
                    <div 
                      className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors"
                      onClick={() => handleLocationSelect('Jefferson City, MO')}
                    >
                      <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                        <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                      </div>
                      <div>
                        <div className="font-medium text-gray-900 text-lg">Jefferson City, MO</div>
                        <div className="text-base text-gray-500">State capital with community feel</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              </>
            )}
            
            {/* Type of Help Dropdown */}
            {showTypeOfHelpDropdown && (
              <>
                {/* Backdrop to close dropdown */}
                <div 
                  className="fixed inset-0 z-40" 
                  onClick={() => {
                    setShowTypeOfHelpDropdown(false);
                    setActiveField(null);
                    // Don't close expanded search - let user navigate between sections
                  }}
                />
                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-lg border border-gray-200 z-50 max-h-[600px] overflow-hidden">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Type of help needed</h3>
                    <button
                      onClick={() => {
                        setShowTypeOfHelpDropdown(false);
                        setActiveField(null);
                      }}
                      className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="space-y-3 max-h-60 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                    {helpOptions.map((option) => {
                      const isSelected = selectedTypeOfHelp.includes(option.label);
                      return (
                        <div 
                          key={option.id}
                          className={`flex items-center gap-4 p-3 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors ${
                            isSelected ? 'bg-blue-50 border border-blue-200' : ''
                          }`}
                          onClick={() => handleTypeOfHelpSelect(option.label)}
                        >
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                            isSelected ? 'bg-blue-600 text-white' : 'bg-gray-100'
                          }`}>
                            {isSelected ? (
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                            ) : (
                              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                              </svg>
                            )}
                          </div>
                          <div>
                            <div className={`font-medium text-lg ${isSelected ? 'text-blue-900' : 'text-gray-900'}`}>
                              {option.label}
                            </div>
                            <div className="text-base text-gray-500">Find helpers for {option.label.toLowerCase()}</div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  {/* Search Button */}
                  <div className="flex items-center justify-center mt-6 pt-6 border-t border-gray-200">
                    <button
                      onClick={() => {
                        setShowTypeOfHelpDropdown(false);
                        setActiveField(null);
                        handleSearch();
                      }}
                                              className="px-6 py-3 text-sm bg-primary hover:bg-primary/90 text-white rounded-full transition-colors font-medium"
                    >
                      Search
                    </button>
                  </div>
                </div>
              </div>
              </>
            )}
            
            {/* Calendar Popup */}
            {showCalendar && (
              <>
                {/* Backdrop to close calendar */}
                <div 
                  className="fixed inset-0 z-40" 
                  onClick={() => {
                    setShowCalendar(false);
                    setActiveField(null);
                    // Don't close expanded search - let user navigate between sections
                  }}
                />
                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-lg border border-gray-200 z-50 max-w-4xl mx-auto">
                  <div className="p-6">
                    {/* As Soon As Possible Button */}
                    <div className="flex items-center justify-center mb-6">
                      <button
                        onClick={() => handleFlexibleDateSelect('As soon as possible')}
                        className="px-6 py-3 text-base border border-gray-300 rounded-full hover:bg-gray-50 transition-colors font-medium"
                      >
                        As soon as possible
                      </button>
                    </div>

                    {/* Dual Month View */}
                    <div className="grid grid-cols-2 gap-8">
                      {/* Current Month */}
                      <div>
                        <div className="flex items-center justify-between mb-4">
                          <button
                            onClick={() => navigateCalendar('prev')}
                            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                          </button>
                          <h3 className="text-lg font-semibold text-gray-900">
                            {currentCalendarMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                          </h3>
                          <div className="w-8 h-8" />
                        </div>
                        <div className="grid grid-cols-7 gap-1 mb-2">
                          {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, index) => (
                            <div key={index} className="text-center text-sm font-medium text-gray-500 py-2">
                              {day}
                            </div>
                          ))}
                        </div>
                        <div className="grid grid-cols-7 gap-1">
                          {getDaysInMonth(currentCalendarMonth).map((date, index) => (
                            <div key={index} className="aspect-square">
                              {date && (
                                <button
                                  onClick={() => handleDateSelect(date)}
                                  className={`w-full h-full flex items-center justify-center text-base rounded-full transition-colors ${
                                    isDateInRange(date)
                                      ? 'bg-black text-white'
                                      : 'hover:bg-gray-100 text-gray-900'
                                  }`}
                                >
                                  {date.getDate()}
                                </button>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Next Month */}
                      <div>
                        <div className="flex items-center justify-between mb-4">
                          <div className="w-8 h-8" />
                          <h3 className="text-lg font-semibold text-gray-900">
                            {new Date(currentCalendarMonth.getFullYear(), currentCalendarMonth.getMonth() + 1).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                          </h3>
                          <button
                            onClick={() => navigateCalendar('next')}
                            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </button>
                        </div>
                        <div className="grid grid-cols-7 gap-1 mb-2">
                          {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, index) => (
                            <div key={index} className="text-center text-sm font-medium text-gray-500 py-2">
                              {day}
                            </div>
                          ))}
                        </div>
                        <div className="grid grid-cols-7 gap-1">
                          {getDaysInMonth(new Date(currentCalendarMonth.getFullYear(), currentCalendarMonth.getMonth() + 1)).map((date, index) => (
                            <div key={index} className="aspect-square">
                              {date && (
                                <button
                                  onClick={() => handleDateSelect(date)}
                                  className={`w-full h-full flex items-center justify-center text-base rounded-full transition-colors ${
                                    isDateInRange(date)
                                      ? 'bg-black text-white'
                                      : 'hover:bg-gray-100 text-gray-900'
                                  }`}
                                >
                                  {date.getDate()}
                                </button>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Quick Selection Buttons */}
                    <div className="flex items-center justify-center gap-2 mt-6 pt-6 border-t border-gray-200">
                      <button
                        onClick={() => handleFlexibleDateSelect('± 1 day')}
                        className="px-4 py-2 text-base border border-gray-300 rounded-full hover:bg-gray-50 transition-colors"
                      >
                        ± 1 day
                      </button>
                      <button
                        onClick={() => handleFlexibleDateSelect('± 2 days')}
                        className="px-4 py-2 text-base border border-gray-300 rounded-full hover:bg-gray-50 transition-colors"
                      >
                        ± 2 days
                      </button>
                      <button
                        onClick={() => handleFlexibleDateSelect('± 3 days')}
                        className="px-4 py-2 text-base border border-gray-300 rounded-full hover:bg-gray-50 transition-colors"
                      >
                        ± 3 days
                      </button>
                      <button
                        onClick={() => handleFlexibleDateSelect('± 7 days')}
                        className="px-4 py-2 text-base border border-gray-300 rounded-full hover:bg-gray-50 transition-colors"
                      >
                        ± 7 days
                      </button>
                      <button
                        onClick={() => handleFlexibleDateSelect('± 14 days')}
                        className="px-4 py-2 text-base border border-gray-300 rounded-full hover:bg-gray-50 transition-colors"
                      >
                        ± 14 days
                      </button>
                    </div>
                  </div>
                </div>
              </>
            )}
            

          </div>
        </div>
        
        {/* Backdrop to close expanded condensed search bar - only when no dropdowns are open */}
        {isCondensedExpanded && isInCondensedMode && !showWhereDropdown && !showTypeOfHelpDropdown && !showCalendar && activeField === null && (
          <div 
            className="fixed inset-0 z-30" 
            onClick={() => {
              setIsCondensedExpanded(false);
              setActiveField(null);
            }}
          />
        )}
        
        {/* Additional backdrop to close expanded search when clicking outside navbar area */}
        {isCondensedExpanded && isInCondensedMode && (
          <div 
            className="fixed inset-x-0 top-0 bottom-0 z-20"
            style={{ top: '200px' }} // Start below the navbar area
            onClick={() => {
              setIsCondensedExpanded(false);
              setActiveField(null);
              setShowWhereDropdown(false);
              setShowTypeOfHelpDropdown(false);
              setShowCalendar(false);
            }}
          />
        )}
      </div>
    </nav>
  );
} 