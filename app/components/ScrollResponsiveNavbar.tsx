"use client";

import { useState, useEffect, useCallback, useRef } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from "next/link";
import Image from "next/image";
import { Search, X, Sparkles, ChefHat, TreePine, ShoppingBag, Heart, PawPrint, Monitor, Car } from "lucide-react";
import { MobileSearchModal } from './MobileSearchModal';


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
  
  // Single state to track which dropdown is open
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  
  const [selectedDateRange, setSelectedDateRange] = useState<{start: Date | null, end: Date | null}>({start: null, end: null});
  const [currentCalendarMonth, setCurrentCalendarMonth] = useState(new Date());
  const [activeField, setActiveField] = useState<number | null>(null);
  const [selectedWhere, setSelectedWhere] = useState('');
  const [selectedHelpStarts, setSelectedHelpStarts] = useState('');
  const [selectedTypeOfHelp, setSelectedTypeOfHelp] = useState<string[]>([]);
  const [selectedWho, setSelectedWho] = useState('');
  const [selectedDemographic, setSelectedDemographic] = useState<string[]>([]);
  const [isCondensedExpanded, setIsCondensedExpanded] = useState(false);
  const [locationFilter, setLocationFilter] = useState('');
  const [showMobileModal, setShowMobileModal] = useState(false);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [justNavigatedToHelper, setJustNavigatedToHelper] = useState(false);
  const [hasVideoCompleted, setHasVideoCompleted] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const pathname = usePathname();
  const router = useRouter();

  // Play video when we navigate to helper page (if we just clicked helper)
  useEffect(() => {
    if (pathname === "/" && justNavigatedToHelper) {
      setIsVideoPlaying(true);
      setIsVideoLoaded(false);
      setJustNavigatedToHelper(false);
    }
    // Reset video state when leaving helper page
    else if (pathname !== "/" && isVideoPlaying) {
      setIsVideoPlaying(false);
      setIsVideoLoaded(false);
      setHasVideoCompleted(false);
    }
  }, [pathname, justNavigatedToHelper, isVideoPlaying]);

  // Clean dropdown management - direct state setting
  const closeDropdown = () => {
    setOpenDropdown(null);
    setActiveField(null);
  };

  const handleHelperClick = (e: React.MouseEvent) => {
    e.preventDefault();
    
    // If already on helper page, do nothing
    if (pathname === "/") {
      return;
    }
    
    // Navigate to helper page first, then video will play
    setJustNavigatedToHelper(true);
    router.push("/");
  };

  const handleVideoEnd = () => {
    // Video finished, show helper hand-up image if still on helper page
    if (pathname === "/") {
      setHasVideoCompleted(true);
    }
    // Small delay to ensure smooth transition
    setTimeout(() => {
      setIsVideoPlaying(false);
      setIsVideoLoaded(false);
    }, 50);
  };

  const handleVideoLoaded = () => {
    setIsVideoLoaded(true);
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(console.error);
    }
  };

  // Add a unified click outside handler
  const handleClickOutside = useCallback((e: Event) => {
    const target = e.target as HTMLElement;
    
    // Ignore if clicking the clear button
    if (target.closest('[data-clear-btn]')) return;
    
    // Check if click is inside search container
    const searchContainer = document.querySelector('[data-search-container]');
    if (searchContainer && searchContainer.contains(target)) {
      return; // Don't close if clicking inside search container
    }
    
    // Check if click is inside any dropdown
    const whereDropdown = document.querySelector('[data-where-dropdown]');
    const calendarDropdown = document.querySelector('[data-calendar-dropdown]');
    const helpDropdown = document.querySelector('[data-help-dropdown]');
    
    if (
      (whereDropdown && whereDropdown.contains(target)) ||
      (calendarDropdown && calendarDropdown.contains(target)) ||
      (helpDropdown && helpDropdown.contains(target))
    ) {
      return; // Don't close if clicking inside any dropdown
    }

    // Ignore clicks on elements with data-search-tab
    if (target.closest('[data-search-tab]')) return;
    if (target.closest('[data-condensed-nav]')) return;
    
    // Only close if click is outside both search container and dropdowns
    closeDropdown();
    setIsCondensedExpanded(false);
  }, []);

  // Add click outside listener when any dropdown is open
  useEffect(() => {
    if (openDropdown !== null || isCondensedExpanded) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [openDropdown, isCondensedExpanded, handleClickOutside]);

  // Helper booleans for rendering
  const showWhereDropdown = openDropdown === 'location';
  const showCalendar = openDropdown === 'date';
  const showTypeOfHelpDropdown = openDropdown === 'typeOfHelp';
  const showDemographicDropdown = openDropdown === 'demographic';

  // Cities we currently operate in
  const operatingCities = [
    { name: 'Columbia, MO', description: 'University town with active community', color: 'bg-blue-50', iconColor: 'text-blue-700', icon: 'graduation-cap' },
    { name: 'Jefferson City, MO', description: 'State capital with historic charm', color: 'bg-amber-50', iconColor: 'text-amber-700', icon: 'landmark' },
    { name: 'Boonville, MO', description: 'Riverfront community', color: 'bg-emerald-50', iconColor: 'text-emerald-700', icon: 'house' },
    { name: 'Fulton, MO', description: 'Small town with friendly neighbors', color: 'bg-green-50', iconColor: 'text-green-700', icon: 'home' },
    { name: 'Holts Summit, MO', description: 'Suburban area near Jefferson City', color: 'bg-slate-50', iconColor: 'text-slate-700', icon: 'building' }
  ];

  // Filter cities based on user input
  const filteredCities = operatingCities.filter(city =>
    city.name.toLowerCase().includes(locationFilter.toLowerCase())
  );

  // Function to render city icons
  const renderCityIcon = (iconName: string) => {
    const iconProps = "w-5 h-5";
    switch (iconName) {
      case 'graduation-cap':
        return (
          <svg className={iconProps} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
          </svg>
        );
      case 'landmark':
        return (
          <svg className={iconProps} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
        );
      case 'waves':
        return (
          <svg className={iconProps} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h1m4 0h1m-6 4h1m4 0h1m-6 4h1m4 0h1" />
          </svg>
        );
      case 'home':
        return (
          <svg className={iconProps} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
        );
      case 'star':
        return (
          <svg className={iconProps} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
          </svg>
        );
      case 'house':
        return (
          <svg className={iconProps} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        );
      case 'wheat':
        return (
          <svg className={iconProps} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 2l3 6 3-6-3 6c0 3 6 3 6 3s-6 0-6 3c0-3-6-3-6-3s6 0 6-3z" />
          </svg>
        );
      case 'building':
        return (
          <svg className={iconProps} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
        );
      case 'mountain':
        return (
          <svg className={iconProps} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3l6 6 6-6M3 18h18l-6-6-6 6z" />
          </svg>
        );
      default:
        return (
          <svg className={iconProps} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
            <circle cx="12" cy="9" r="2.5" />
          </svg>
        );
    }
  };

  // Function to render help type icons
  const renderHelpTypeIcon = (iconName: string) => {
    const iconProps = "w-5 h-5";
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
        return <Search className={iconProps} />;
    }
  };



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
        src: "/updated-home-icon-min.png",
        alt: "Homes"
      };
    }
    // Default to helper icon for homepage and other pages
    return {
      src: "/updated-helper-7-18.png",
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

  // Handle location selection from autocomplete
  const handleLocationSelect = (location: string) => {
    setSelectedWhere(location);
    setLocationFilter(location);
    // Move to next field (Help starts) and auto-open calendar
    setTimeout(() => {
      setOpenDropdown('date');
      setActiveField(1);
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
      case 0: 
        setSelectedWhere(value);
        setLocationFilter(value);
        // Auto-open dropdown when typing
        if (!showWhereDropdown && value.length > 0) {
          setOpenDropdown('location');
          setActiveField(0);
        }
        break;
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
    // Auto-clear location field if clicking on it again with existing content (desktop mode only)
    if (index === 0 && selectedWhere && !shouldShowCondensed()) {
      setSelectedWhere('');
      setLocationFilter('');
    }
    
    // Just set active field - dropdown opening is handled by handleDropdownClick
    setActiveField(index);
  };

  // Handle field blur
  const handleFieldBlur = (index: number) => {
    // Small delay to allow for dropdown interaction
    setTimeout(() => {
      if (index === 0 && !showWhereDropdown) {
        // Location field lost focus and dropdown is closed
      }
    }, 200);
  };

  // Handle condensed search bar click
  const handleCondensedClick = () => {
    setIsCondensedExpanded(true);
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
      setOpenDropdown('typeOfHelp');
      setActiveField(2);
    }, 300);
  };

  const handleFlexibleDateSelect = (flexibility: string) => {
    const today = new Date();
    setSelectedDateRange({ start: today, end: today });
    setSelectedHelpStarts(flexibility);
    setTimeout(() => {
      setOpenDropdown('typeOfHelp');
      setActiveField(2);
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

  // Check if a date is in the past
  const isDateInPast = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dateToCheck = new Date(date);
    dateToCheck.setHours(0, 0, 0, 0);
    return dateToCheck < today;
  };

  // Available help options
  const helpOptions = [
    { id: "cleaning", label: "Cleaning", color: 'bg-blue-50', iconColor: 'text-blue-700', icon: 'sparkles' },
    { id: "cooking", label: "Cooking", color: 'bg-orange-50', iconColor: 'text-orange-700', icon: 'chef-hat' },
    { id: "yardWork", label: "Yard Work", color: 'bg-green-50', iconColor: 'text-green-700', icon: 'leaf' },
    { id: "shoppingErrands", label: "Shopping & Errands", color: 'bg-purple-50', iconColor: 'text-purple-700', icon: 'shopping-bag' },
    { id: "companionship", label: "Companionship", color: 'bg-pink-50', iconColor: 'text-pink-700', icon: 'heart' },
    { id: "petCare", label: "Pet Care", color: 'bg-amber-50', iconColor: 'text-amber-700', icon: 'paw' },
    { id: "techSupport", label: "Tech Support", color: 'bg-indigo-50', iconColor: 'text-indigo-700', icon: 'monitor' },
    { id: "transportation", label: "Transportation", color: 'bg-slate-50', iconColor: 'text-slate-700', icon: 'car' },
  ];

  // Note: The helpOptions array is consistent with the products page
  // If there's a mismatch between database values and UI options, 
  // the filtering logic in the products page handles the mapping

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
    setLocationFilter('');
    setSelectedHelpStarts('');
    setSelectedTypeOfHelp([]);
    setSelectedDateRange({ start: null, end: null });
  };

  // Handle clearing individual selection
  const handleClearField = (fieldIndex: number) => {
    switch (fieldIndex) {
      case 0:
        setSelectedWhere('');
        setLocationFilter('');
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
    <nav className={`sticky top-0 z-50 border-b shadow-sm transition-all duration-500 ease-in-out ${
      isInCondensedMode ? 'min-h-[25px]' : 'min-h-[80px]'
    }`} style={{ backgroundColor: '#f5f5f5', borderColor: '#f5f5f5' }}>
      <div className="max-w-7xl w-full mx-auto px-3 lg:px-6 xl:px-8 relative">
        {/* Main Navbar Row */}
        <div className="flex items-center justify-between">
          {/* Logo - Fixed position, hidden on mobile */}
          <div className={`hidden min-[744px]:block absolute left-2 lg:left-4 xl:left-6 z-40 transition-all duration-500 ease-in-out ${
            isInCondensedMode ? 'top-1 lg:top-0.5 xl:top-0' : 'top-2 lg:top-1 xl:top-0'
          }`}>
            <Link href="/">
              {/* Full logo for larger screens - fixed positioning */}
              <div className="flex items-center">
                <Image
                  src="/golden-logo.png"
                  alt="Golden HomeShare"
                  width={320}
                  height={96}
                  className="w-auto h-20 lg:h-24 xl:h-28"
                  priority
                />
              </div>
            </Link>
          </div>

          {/* Logo Spacer - Maintains navbar height, smaller in condensed mode */}
          <div className={`hidden min-[744px]:block flex-shrink-0 w-16 lg:w-20 xl:w-24 transition-all duration-500 ease-in-out ${
            isInCondensedMode ? 'h-1 lg:h-2 xl:h-2' : 'h-20 lg:h-24 xl:h-28'
          }`}></div>

          {/* Center Content Area - Adjusted for fixed logo */}
          <div className={`flex-1 flex justify-center transition-all duration-500 ease-in-out pt-3 ${isInCondensedMode ? '-mb-30' : 'pb-7'}`}>
            {/* Mobile Search Trigger - Full width on mobile */}
            <div className="max-[743px]:block hidden w-full px-4">
              <button
                onClick={() => setShowMobileModal(true)}
                className="w-full flex items-center justify-center bg-white rounded-full shadow-sm hover:shadow-md transition-shadow duration-200 px-6 py-4 text-left"
              >
                <Search className="w-5 h-5 text-black mr-3" />
                <span className="text-black text-base">
                  {pathname === "/homes" || pathname.startsWith("/homes/") 
                    ? "Find nearby homes" 
                    : "Find nearby helpers"
                  }
                </span>
              </button>
              
              {/* Mobile Home/Helper Options - Hide icons when condensed */}
              <div className={`flex items-center justify-center gap-12 mt-4 transition-all duration-500 ease-in-out ${
                isInCondensedMode ? 'mb-[7.375rem]' : '-mb-7.5'
              }`}>
                {/* Helpers Option */}
                <button 
                  onClick={handleHelperClick}
                  className="flex flex-col items-center cursor-pointer border-none p-0 outline-none focus:outline-none"
                  data-search-tab
                  style={{ backgroundColor: '#f5f5f5', boxShadow: 'none' }}
                >
                  <div className={`flex flex-col items-center transition-all duration-500 ease-in-out ${
                    isInCondensedMode ? 'gap-0' : 'gap-2'
                  }`} style={{ backgroundColor: '#f5f5f5' }}>
                    <div className={`relative transition-all duration-500 ease-in-out overflow-hidden ${
                      isInCondensedMode ? 'w-0 h-0 opacity-0' : 'w-20 h-20 opacity-100'
                    }`} style={{ backgroundColor: '#f5f5f5' }}>
                      {/* Helper Image - show when not playing video */}
                      {!isVideoPlaying && (
                        <Image 
                          src={hasVideoCompleted && pathname === "/" ? "/helper-hand-up.png" : "/updated-helper-7-18.png"} 
                          alt="Helper"
                          fill
                          className="object-contain transition-opacity duration-200"
                          priority
                          style={{ backgroundColor: '#f5f5f5' }}
                        />
                      )}
                      
                      {/* Preload hand-up image for seamless transition */}
                      <div className="absolute inset-0 opacity-0 pointer-events-none">
                        <Image 
                          src="/helper-hand-up.png" 
                          alt="Helper Hand Up"
                          fill
                          className="object-contain"
                          style={{ backgroundColor: '#f5f5f5' }}
                        />
                      </div>
                      
                      {/* Video Replacement - show when playing on helper page */}
                      {isVideoPlaying && pathname === "/" && (
                        <>
                          {/* Loading state */}
                          {!isVideoLoaded && (
                            <div className="absolute inset-0 flex items-center justify-center rounded-lg" style={{ backgroundColor: '#f5f5f5' }}>
                              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#c98f31]"></div>
                            </div>
                          )}
                          
                          {/* Video element */}
                          <video
                            ref={videoRef}
                            className={`w-full h-full object-contain transition-opacity duration-200 ${
                              isVideoLoaded ? 'opacity-100' : 'opacity-0'
                            }`}
                            autoPlay
                            muted
                            onEnded={handleVideoEnd}
                            onLoadedData={handleVideoLoaded}
                            style={{ 
                              width: '80px', 
                              height: '80px', 
                              backgroundColor: '#f5f5f5',
                              borderRadius: '0px'
                            }}
                          >
                            <source src="/helper-waving.mp4" type="video/mp4" />
                            Your browser does not support the video tag.
                          </video>
                          
                          {/* Subtle glow effect during video - made more subtle for gray background */}
                          <div className="absolute inset-0 -z-10 bg-gray-300/10 rounded-lg blur-sm transform scale-105"></div>
                        </>
                      )}
                    </div>
                    <span className={`text-lg font-medium ${
                      pathname === "/" 
                        ? "text-black" 
                        : "text-gray-600"
                    }`}>
                      Helpers
                    </span>
                  </div>
                  {pathname === "/" && <div className="w-full h-[3px] bg-black rounded-full"></div>}
                </button>

                {/* Homes Option */}
                <Link 
                  href="/homes" 
                  className="flex flex-col items-center"
                  data-search-tab
                  style={{ backgroundColor: '#f5f5f5', boxShadow: 'none' }}
                >
                  <div className={`flex flex-col items-center transition-all duration-500 ease-in-out ${
                    isInCondensedMode ? 'gap-0' : 'gap-2'
                  }`} style={{ backgroundColor: '#f5f5f5' }}>
                    <div className={`relative transition-all duration-500 ease-in-out overflow-hidden ${
                      isInCondensedMode ? 'w-0 h-0 opacity-0' : 'w-20 h-20 opacity-100'
                    }`} style={{ backgroundColor: '#f5f5f5' }}>
                      <Image 
                        src="/updated-home-icon-min.png" 
                        alt="Homes"
                        fill
                        className="object-contain"
                        priority
                        style={{ backgroundColor: '#f5f5f5' }}
                      />
                    </div>
                    <span className={`text-lg font-medium ${
                      pathname === "/homes" 
                        ? "text-black" 
                        : "text-gray-600"
                    }`}>
                      Homes
                    </span>
                  </div>
                  {pathname === "/homes" && <div className="w-full h-[3px] bg-black rounded-full"></div>}
                </Link>
              </div>
            </div>

            {/* Condensed Search Bar when scrolled (hide when expanded) - Hidden on mobile */}
            <div className={`hidden min-[744px]:flex justify-center transition-all duration-500 ease-in-out ${
              isInCondensedMode ? 'opacity-100 transform translate-y-0 pb-0 -mt-12 -mb-6' : 'opacity-0 transform -translate-y-2 pointer-events-none absolute'
            }`}>
              <div 
                className="flex items-center bg-white border border-gray-300 rounded-full shadow-sm hover:shadow-md transition-shadow duration-200 max-w-lg lg:max-w-xl xl:max-w-2xl h-16 lg:h-18 cursor-pointer z-[9998]" 
                onClick={handleCondensedClick}
                data-search-container
                data-condensed-nav
              >
                {/* Selected Icon */}
                                  <div className="flex items-center pl-3 lg:pl-4">
                  <div className="relative w-10 lg:w-12 xl:w-14 h-10 lg:h-12 xl:h-14">
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
                            // For /products/icon page without location, show "Helpers nearby"
                            if (pathname === '/products/icon' && !selectedWhere) {
                              return 'Helpers nearby';
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
                          className="px-3 lg:px-4 xl:px-5 py-3 lg:py-4 cursor-pointer hover:bg-gray-50 rounded-md transition-colors flex items-center"
                          onMouseDown={(e) => {
                            e.preventDefault();
                            e.stopPropagation(); // Prevent condensed bar expansion
                            setIsCondensedExpanded(true); // Expand to full search bar
                            // Immediately open the appropriate dropdown
                            if (index === 0) {
                              // Auto-clear location field when clicked
                              setSelectedWhere('');
                              setLocationFilter('');
                              setOpenDropdown('location');
                              setActiveField(0);
                            } else if (index === 1) {
                              setOpenDropdown('date');
                              setActiveField(1);
                            } else if (index === 2) {
                              setOpenDropdown('typeOfHelp');
                              setActiveField(2);
                            }
                          }}
                        >
                          <span className={`text-base lg:text-lg xl:text-xl ${hasValue ? 'text-gray-900 font-medium' : 'text-gray-600'}`}>
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
                    className={`text-white rounded-full transition-all duration-200 flex items-center gap-1 lg:gap-2 ${
                      activeField !== null ? 'px-3 lg:px-4 xl:px-5 py-2 lg:py-2.5 xl:py-3' : 'p-2 lg:p-2.5'
                    }`}
                    style={{ backgroundColor: '#c98f31' }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#b8802c'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#c98f31'}
                  >
                    {activeField !== null && (
                      <span className="text-base lg:text-lg font-medium">Search</span>
                    )}
                    <Search className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Navigation Links (show when not scrolled OR when condensed is expanded) */}
            <div className={`hidden min-[744px]:flex justify-center items-center transition-all duration-500 ease-in-out ${
              (!isInCondensedMode || isCondensedExpanded) && showNavLinks ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform -translate-y-2 pointer-events-none absolute'
            }`}>
              {navLinksComponent}
            </div>
          </div>

          {/* User Navigation - Hidden on mobile for clean search interface */}
          <div className={`hidden min-[744px]:flex items-center gap-x-1 flex-shrink-0 transition-all duration-500 ease-in-out ${
            isInCondensedMode ? 'pt-0 -mb-40 -mt-12' : 'pt-3 pb-7'
          }`}>
            {userNavigation}
          </div>
        </div>
        
        {/* Full Search Bar Row (only show when not scrolled or condensed is expanded) - Hidden on mobile */}
        <div className={`hidden min-[744px]:flex justify-center transition-all duration-500 ease-in-out ${
          !isInCondensedMode || isCondensedExpanded ? 'pb-4 opacity-100 transform translate-y-0' : 'pb-0 opacity-0 transform -translate-y-4 pointer-events-none'
        }`}>
          <div className="relative max-w-3xl lg:max-w-4xl xl:max-w-5xl w-full z-[60] mx-4 lg:mx-8" data-search-container>
            <div className={`flex items-center border border-gray-300 rounded-full shadow-sm hover:shadow-md transition-all duration-200 ${
              activeField !== null ? 'bg-gray-100' : 'bg-white'
            } relative overflow-hidden`}>
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
                      case 2: return ''; // We'll show icons instead of text for help types
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
                                            className={`py-2 lg:py-3 xl:py-4 relative cursor-pointer z-[75] ${
                        isActive 
                          ? `${
                              index === searchFields.full.length - 1 
                                ? 'bg-white rounded-l-full rounded-r-none pl-4 lg:pl-5 xl:pl-6 pr-4 lg:pr-5 xl:pr-6' 
                                : 'bg-white shadow-lg rounded-full px-4 lg:px-5 xl:px-6'
                            }` : 
                          activeField !== null ? 'opacity-60 px-4 lg:px-5 xl:px-6' : 'px-4 lg:px-5 xl:px-6'
                      } transition-all duration-200`}
                      onMouseDown={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        // Immediate dropdown switching - no conflicts
                        if (index === 0) {
                          // Auto-clear location field when clicked
                          setSelectedWhere('');
                          setLocationFilter('');
                          setOpenDropdown('location');
                          setActiveField(0);
                        } else if (index === 1) {
                          setOpenDropdown('date');
                          setActiveField(1);
                        } else if (index === 2) {
                          setOpenDropdown('typeOfHelp');
                          setActiveField(2);
                        }
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <div className="text-base lg:text-lg font-semibold text-gray-900 mb-1">{field.label}</div>
                      </div>
                      <div className="relative">
                        <input 
                          type="text" 
                          value={fieldValue}
                          onChange={(e) => {
                            // Only allow changes for location field
                            if (index === 0) {
                              handleInputChange(index, e.target.value);
                            }
                          }}
                          placeholder={field.placeholder} 
                          className={`w-full text-xl bg-transparent border-none outline-none pointer-events-none pr-10 ${
                            fieldValue || (index === 2 && selectedTypeOfHelp.length > 0) ? 'text-gray-900 font-medium' : 'text-gray-600 placeholder-gray-400'
                          } ${index === 0 ? 'pointer-events-auto' : ''} ${
                            index === 2 && selectedTypeOfHelp.length > 0 ? 'placeholder-transparent' : ''
                          }`}
                          readOnly={index !== 0} // Only location field is editable
                          onFocus={index === 0 ? () => {
                            // Location field - auto-clear is now handled in onMouseDown
                          } : undefined}
                        />
                        
                        {/* Show icons for help types field when items are selected */}
                        {index === 2 && isHelperMode && selectedTypeOfHelp.length > 0 && (
                          <div className="absolute left-0 top-0 flex items-center h-full pointer-events-none">
                            <div className="flex items-center gap-1 flex-wrap">
                              {selectedTypeOfHelp.slice(0, 4).map((label, iconIndex) => {
                                // Find the help option that matches this label
                                const helpOption = helpOptions.find(option => option.label === label);
                                if (!helpOption) return null;
                                
                                return (
                                  <div 
                                    key={iconIndex}
                                    className={`w-6 h-6 rounded-md flex items-center justify-center ${helpOption.color} ${helpOption.iconColor}`}
                                  >
                                    {renderHelpTypeIcon(helpOption.icon)}
                                  </div>
                                );
                              })}
                              {selectedTypeOfHelp.length > 4 && (
                                <div className="w-6 h-6 rounded-md flex items-center justify-center bg-gray-100 text-gray-600 text-xs font-medium">
                                  +{selectedTypeOfHelp.length - 4}
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                      {/* Clear button - positioned relative to entire field bubble */}
                      {isActive && ((fieldValue && index !== 0) || (index === 2 && selectedTypeOfHelp.length > 0)) && (
                        <button
                          onMouseDown={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            if (index === 1) {
                              setSelectedDateRange({ start: null, end: null });
                              setSelectedHelpStarts('');
                            } else if (index === 2) {
                              setSelectedTypeOfHelp([]);
                            }
                          }}
                          data-clear-btn
                          className="absolute right-4 top-1/2 transform -translate-y-1/2 w-6 h-6 flex items-center justify-center hover:bg-gray-100 rounded-full transition-colors z-[80] pointer-events-auto"
                        >
                          <X className="w-4 h-4 text-gray-600 hover:text-gray-800" />
                        </button>
                      )}
                    </div>
                    {/* Divider - only show when this field and next field are both inactive */}
                    {index < searchFields.full.length - 1 && !isActive && activeField !== index + 1 && (
                      <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-px h-8 bg-gray-300 z-0"></div>
                    )}
                  </div>
                );
              })}
              <div className={`z-[75] relative transition-all duration-200 ${
                activeField === searchFields.full.length - 1 
                  ? 'bg-white rounded-r-full pr-2 py-2 lg:py-3 xl:py-4' 
                  : `pr-2 ${activeField !== null ? 'opacity-100' : ''}`
              }`}>
                <button 
                  onClick={handleSearch}
                  className={`text-white transition-all duration-200 flex items-center gap-2 lg:gap-3 ${
                    activeField === searchFields.full.length - 1 
                      ? 'px-4 lg:px-5 xl:px-6 py-2 lg:py-3 xl:py-4 rounded-full' 
                      : activeField !== null 
                        ? 'px-4 lg:px-5 xl:px-6 py-2 lg:py-2.5 xl:py-3 rounded-full' 
                        : 'p-2.5 lg:p-3 xl:p-3.5 rounded-full'
                  }`}
                  style={{ backgroundColor: '#c98f31' }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#b8802c'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#c98f31'}
                >
                  {activeField !== null && (
                    <span className="text-base lg:text-lg font-medium">Search</span>
                  )}
                  <Search className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            {/* Where Dropdown */}
            {showWhereDropdown && (
              <div className="absolute top-full left-0 mt-2 bg-white rounded-2xl shadow-lg border border-gray-200 max-h-96 overflow-hidden w-96" style={{ zIndex: 80 }} data-where-dropdown>
                  <div className="p-5 space-y-5 max-h-80 overflow-y-auto">
                    {/* Recent searches section - could be implemented later */}
                    {selectedWhere && (
                      <div>
                        <h3 className="text-xs font-medium text-gray-400 mb-3 uppercase tracking-wider">Recent searches</h3>
                        <div 
                          className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors"
                          onClick={() => handleLocationSelect(selectedWhere)}
                        >
                          <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
                              <circle cx="12" cy="9" r="2.5" />
                            </svg>
                          </div>
                          <div>
                            <div className="font-medium text-gray-900 text-sm">{selectedWhere}</div>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {/* Currently operating destinations */}
                    <div>
                      <h3 className="text-xs font-medium text-gray-400 mb-3 uppercase tracking-wider">Currently Operating In</h3>
                      <div className="space-y-1">
                        {filteredCities.map((city, index) => (
                          <div 
                            key={city.name}
                            className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors group"
                            onClick={() => handleLocationSelect(city.name)}
                          >
                            <div className={`w-10 h-10 ${city.color} rounded-lg flex items-center justify-center ${city.iconColor} group-hover:scale-105 transition-transform`}>
                              {renderCityIcon(city.icon)}
                            </div>
                            <div className="flex-1">
                              <div className="font-medium text-gray-900 text-sm">{city.name}</div>
                              <div className="text-xs text-gray-500">{city.description}</div>
                            </div>
                          </div>
                        ))}
                        {filteredCities.length === 0 && locationFilter && (
                          <div className="p-3 text-center text-gray-500">
                            <div className="text-sm text-gray-600 mb-2">We don't currently serve "{locationFilter}"</div>
                <div className="text-xs text-gray-500">We're only operating in select Missouri locations at this time</div>
                            <div className="text-xs mt-1">We currently operate in Columbia, Jefferson City, Boonville, and other central Missouri cities.</div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
            )}
            
            {/* Type of Help Dropdown */}
            {showTypeOfHelpDropdown && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-lg border border-gray-200 max-h-[600px] overflow-hidden" style={{ zIndex: 80 }} data-help-dropdown>
                <div className="p-6">
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Type of help wanted (multi-select)</h3>
                  </div>
                  <div className="space-y-3 max-h-60 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                    {helpOptions.map((option) => {
                      const isSelected = selectedTypeOfHelp.includes(option.label);
                      return (
                        <div 
                          key={option.id}
                          className={`flex items-center gap-4 p-3 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors ${
                            isSelected ? 'bg-gray-100' : ''
                          }`}
                          onClick={() => handleTypeOfHelpSelect(option.label)}
                        >
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                            isSelected ? 'bg-gray-800 text-white' : `${option.color} ${option.iconColor}`
                          }`}>
                            {isSelected ? (
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                            ) : (
                              renderHelpTypeIcon(option.icon)
                            )}
                          </div>
                          <div>
                            <div className={`font-medium text-lg ${isSelected ? 'text-gray-900' : 'text-gray-900'}`}>
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
                        closeDropdown();
                        handleSearch();
                      }}
                      className="px-6 py-3 text-sm text-white rounded-full transition-colors font-medium"
                      style={{ backgroundColor: '#c98f31' }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#b8802c'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#c98f31'}
                    >
                      Search
                    </button>
                  </div>
                </div>
              </div>
            )}
            
            {/* Calendar Popup */}
            {showCalendar && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-lg border border-gray-200 max-w-4xl mx-auto" style={{ zIndex: 80 }} data-calendar-dropdown>
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
                                  onClick={() => !isDateInPast(date) && handleDateSelect(date)}
                                  disabled={isDateInPast(date)}
                                  className={`w-full h-full flex items-center justify-center text-base rounded-full transition-colors ${
                                    isDateInPast(date)
                                      ? 'text-gray-300 cursor-not-allowed'
                                      : isDateInRange(date)
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
                                  onClick={() => !isDateInPast(date) && handleDateSelect(date)}
                                  disabled={isDateInPast(date)}
                                  className={`w-full h-full flex items-center justify-center text-base rounded-full transition-colors ${
                                    isDateInPast(date)
                                      ? 'text-gray-300 cursor-not-allowed'
                                      : isDateInRange(date)
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
                  </div>
                </div>
            )}
            

          </div>
        </div>
      </div>



      {/* Mobile Search Modal */}
      <MobileSearchModal 
        isOpen={showMobileModal}
        onClose={() => setShowMobileModal(false)}
        initialSearchType={
          pathname === '/homes' || pathname.startsWith('/homes/') || pathname === '/products/template' 
            ? 'homes' 
            : 'housemates' // Default to housemates for all other pages including homepage
        }
      />

    </nav>
  );
} 