"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { X, Search, MapPin, Calendar, Users, Home, UserPlus, Sparkles, ChefHat, TreePine, ShoppingBag, Heart, PawPrint, Monitor, Car, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';

interface MobileSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialSearchType?: 'housemates' | 'homes';
}

interface SearchState {
  searchType: 'housemates' | 'homes';
  location: string;
  dateRange: { start: Date | null; end: Date | null };
  helpTypes: string[];
  budget: number;
  guests: number;
  helpStarts: string;
}

const helpOptions = [
  { id: "cleaning", label: "Cleaning", color: 'bg-blue-50', iconColor: 'text-blue-700', icon: Sparkles },
  { id: "cooking", label: "Cooking", color: 'bg-orange-50', iconColor: 'text-orange-700', icon: ChefHat },
  { id: "yardWork", label: "Yard Work", color: 'bg-green-50', iconColor: 'text-green-700', icon: TreePine },
  { id: "shoppingErrands", label: "Shopping", color: 'bg-purple-50', iconColor: 'text-purple-700', icon: ShoppingBag },
  { id: "companionship", label: "Companion", color: 'bg-pink-50', iconColor: 'text-pink-700', icon: Heart },
  { id: "petCare", label: "Pet Care", color: 'bg-amber-50', iconColor: 'text-amber-700', icon: PawPrint },
  { id: "techSupport", label: "Tech Help", color: 'bg-indigo-50', iconColor: 'text-indigo-700', icon: Monitor },
  { id: "transportation", label: "Transport", color: 'bg-slate-50', iconColor: 'text-slate-700', icon: Car },
];

// Cities we currently operate in - same as desktop navbar
const operatingCities = [
  { name: 'Columbia, MO', description: 'University town with active community', color: 'bg-blue-50', iconColor: 'text-blue-700', icon: 'graduation-cap' },
  { name: 'Jefferson City, MO', description: 'State capital with historic charm', color: 'bg-amber-50', iconColor: 'text-amber-700', icon: 'landmark' },
  { name: 'Boonville, MO', description: 'Riverfront community', color: 'bg-emerald-50', iconColor: 'text-emerald-700', icon: 'house' },
  { name: 'Fulton, MO', description: 'Small town with friendly neighbors', color: 'bg-green-50', iconColor: 'text-green-700', icon: 'home' },
  { name: 'Holts Summit, MO', description: 'Suburban area near Jefferson City', color: 'bg-slate-50', iconColor: 'text-slate-700', icon: 'building' }
];

// Function to render city icons - same as desktop navbar
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
    case 'house':
      return (
        <svg className={iconProps} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      );
    case 'home':
      return (
        <svg className={iconProps} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      );
    case 'building':
      return (
        <svg className={iconProps} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      );
    default:
      return (
        <svg className={iconProps} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      );
  }
};

export function MobileSearchModal({ isOpen, onClose, initialSearchType }: MobileSearchModalProps) {
  const [searchState, setSearchState] = useState<SearchState>({
    searchType: initialSearchType || 'housemates',
    location: '',
    dateRange: { start: null, end: null },
    helpTypes: [],
    budget: 0,
    guests: 1,
    helpStarts: ''
  });
  
  // Track which fullscreen section is open and which sections are expanded
  const [fullscreenSection, setFullscreenSection] = useState<'where' | 'what' | null>(null);
  const [expandedSection, setExpandedSection] = useState<'where' | 'when' | 'what' | null>(null);
  const [locationFilter, setLocationFilter] = useState('');
  const [currentCalendarMonth, setCurrentCalendarMonth] = useState(new Date());

  const router = useRouter();

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setSearchState({
        searchType: initialSearchType || 'housemates',
        location: '',
        dateRange: { start: null, end: null },
        helpTypes: [],
        budget: 0,
        guests: 1,
        helpStarts: ''
      });
      setFullscreenSection(null);
      setExpandedSection('where'); // Start with Where section expanded
      setLocationFilter('');
      setCurrentCalendarMonth(new Date());
    }
  }, [isOpen, initialSearchType]);

  // Close modal with escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (fullscreenSection) {
          setFullscreenSection(null);
        } else {
          onClose();
        }
      }
    };
    
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }
    
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose, fullscreenSection]);

  // Filter cities based on user input
  const filteredCities = operatingCities.filter(city =>
    city.name.toLowerCase().includes(locationFilter.toLowerCase())
  );

  // Calendar helper functions
  const formatDateRange = () => {
    const { start } = searchState.dateRange;
    if (!start) return '';
    return start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const handleDateSelect = (date: Date) => {
    // Single date selection only
    setSearchState(prev => ({ ...prev, dateRange: { start: date, end: date } }));
    // Close expanded section and move to next
    setTimeout(() => {
      setExpandedSection('what');
    }, 300);
  };

  const handleFlexibleDateSelect = (flexibility: string) => {
    const today = new Date();
    setSearchState(prev => ({ 
      ...prev, 
      dateRange: { start: today, end: today },
      helpStarts: flexibility
    }));
    // Close expanded section and move to next
    setTimeout(() => {
      setExpandedSection('what');
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
    const { start } = searchState.dateRange;
    if (!start) return false;
    return date.getTime() === start.getTime();
  };

  // Check if a date is in the past
  const isDateInPast = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dateToCheck = new Date(date);
    dateToCheck.setHours(0, 0, 0, 0);
    return dateToCheck < today;
  };

  const handleSearch = () => {
    const params = new URLSearchParams();
    
    if (searchState.location) {
      params.set('location', searchState.location);
    }
    
    if (searchState.helpStarts || searchState.dateRange.start) {
      params.set('helpStarts', searchState.helpStarts || formatDateRange());
    }
    
    if (searchState.helpTypes.length > 0) {
      params.set('typeOfHelp', searchState.helpTypes.join(','));
    }
    
    const queryString = params.toString();
    const targetUrl = searchState.searchType === 'housemates' 
      ? `/products/icon${queryString ? `?${queryString}` : ''}`
      : `/products/template${queryString ? `?${queryString}` : ''}`;
    
    router.push(targetUrl);
    onClose();
  };

  // Enhanced location selection
  const handleLocationSelect = (location: string) => {
    setSearchState(prev => ({ ...prev, location }));
    setLocationFilter(location);
    // Close expanded section and move to next
    setTimeout(() => {
      setExpandedSection('when');
    }, 200);
  };

  const handleClearAll = () => {
    setSearchState({
      searchType: searchState.searchType, // Keep the current type
      location: '',
      dateRange: { start: null, end: null },
      helpTypes: [],
      budget: 0,
      guests: 1,
      helpStarts: ''
    });
    setLocationFilter('');
    setFullscreenSection(null);
    setExpandedSection('where'); // Reset to Where section expanded
  };

  const toggleHelpType = (helpType: string) => {
    setSearchState(prev => ({
      ...prev,
      helpTypes: prev.helpTypes.includes(helpType)
        ? prev.helpTypes.filter(type => type !== helpType)
        : [...prev.helpTypes, helpType]
    }));
  };

  // Handle changing search type (tabs)
  const handleSearchTypeChange = (type: 'housemates' | 'homes') => {
    setSearchState(prev => ({ ...prev, searchType: type }));
  };

  // Get display text for sections
  const getSectionDisplayText = (section: 'where' | 'when' | 'what') => {
    switch (section) {
      case 'where':
        return searchState.location || 'Search locations';
      case 'when':
        return searchState.helpStarts || (searchState.dateRange.start ? 'Dates selected' : 'Add dates');
      case 'what':
        if (searchState.searchType === 'housemates') {
          return searchState.helpTypes.length > 0 ? `${searchState.helpTypes.length} selected` : 'Add help types';
        } else {
          return searchState.guests > 1 ? `${searchState.guests} guests` : 'Add guests';
        }
      default:
        return '';
    }
  };

  if (!isOpen) return null;

  // Fullscreen Where Interface
  if (fullscreenSection === 'where') {
    return (
      <div className="fixed inset-0 z-50 bg-gray-50 flex flex-col">
        {/* Top spacing */}
        <div className="h-5 flex-shrink-0"></div>
        
        {/* Header with integrated search bar */}
        <div className="bg-white rounded-t-[3rem] shadow-lg">
          <div className="p-4">
            <div className="relative">
              <button 
                onClick={() => setFullscreenSection(null)}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 text-gray-600 hover:text-gray-800 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <Input
                placeholder="Search destinations"
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
                className="pl-12 pr-4 h-14 text-base border border-black focus:border-black focus:ring-0 rounded-xl bg-white transition-all duration-200"
                autoFocus
              />
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto touch-pan-y p-4 bg-white rounded-b-3xl" style={{ WebkitOverflowScrolling: 'touch' }}>
          {/* Recent searches */}
          {searchState.location && (
            <div className="mb-8">
              <h3 className="text-sm font-medium text-gray-600 mb-4">Recent searches</h3>
              <button
                onClick={() => handleLocationSelect(searchState.location)}
                className="w-full p-4 text-left hover:bg-gray-50 flex items-center space-x-3 rounded-lg transition-colors duration-200"
              >
                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-gray-600" />
                </div>
                <div>
                  <div className="font-medium text-gray-900">{searchState.location}</div>
                </div>
              </button>
            </div>
          )}

          {/* Currently operating in */}
          <div>
            <h3 className="text-sm font-medium text-gray-600 mb-4">Currently operating in</h3>
            <div className="space-y-2">
              {(locationFilter ? filteredCities : operatingCities).map((city) => (
                <button 
                  key={city.name}
                  className="w-full flex items-center gap-4 p-4 hover:bg-gray-50 rounded-lg cursor-pointer transition-all duration-200 group text-left"
                  onClick={() => handleLocationSelect(city.name)}
                >
                  <div className={`w-12 h-12 ${city.color} rounded-lg flex items-center justify-center ${city.iconColor} group-hover:scale-105 transition-transform duration-200`}>
                    {renderCityIcon(city.icon)}
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">{city.name}</div>
                    <div className="text-sm text-gray-500">{city.description}</div>
                  </div>
                </button>
              ))}
            </div>
            {filteredCities.length === 0 && locationFilter && (
              <div className="p-4 text-center">
                <div className="text-sm text-gray-600 mb-2">We don't currently serve "{locationFilter}"</div>
                <div className="text-xs text-gray-500">We're only operating in select Missouri locations at this time</div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }



  // Fullscreen What Interface
  if (fullscreenSection === 'what') {
    return (
      <div className="fixed inset-0 z-50 bg-gray-50 flex flex-col">
        {/* Top spacing */}
        <div className="h-5 flex-shrink-0"></div>
        
        {/* Header with integrated title bar */}
        <div className="bg-white rounded-t-[3rem] shadow-lg">
          <div className="p-4">
            <div className="relative">
              <button 
                onClick={() => setFullscreenSection(null)}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 text-gray-600 hover:text-gray-800 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <div className="flex items-center justify-center h-14">
                <h1 className="text-lg font-semibold text-gray-900">
                  {searchState.searchType === 'housemates' ? 'What help do you need?' : 'How many guests?'}
                </h1>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto touch-pan-y p-4 bg-white rounded-b-3xl" style={{ WebkitOverflowScrolling: 'touch' }}>
          {searchState.searchType === 'housemates' ? (
            <div>
              {/* Recent selections */}
              {searchState.helpTypes.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-sm font-medium text-gray-600 mb-4">Recent selections</h3>
                  <div className="space-y-2">
                    {helpOptions.filter(option => searchState.helpTypes.includes(option.id)).map((option) => {
                      const Icon = option.icon;
                      
                      return (
                        <button
                          key={option.id}
                          onClick={() => toggleHelpType(option.id)}
                          className="w-full p-4 text-left hover:bg-gray-50 flex items-center space-x-3 rounded-lg transition-colors duration-200"
                        >
                          <div className="w-12 h-12 bg-gray-800 text-white rounded-lg flex items-center justify-center">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">{option.label}</div>
                            <div className="text-sm text-gray-500">Selected</div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
              
              {/* Popular help types */}
              <div>
                <div className="space-y-2">
                  {helpOptions.map((option) => {
                    const Icon = option.icon;
                    const isSelected = searchState.helpTypes.includes(option.id);
                    
                    if (isSelected) return null; // Don't show in this section if already selected
                    
                    return (
                      <button
                        key={option.id}
                        onClick={() => toggleHelpType(option.id)}
                        className="w-full p-4 text-left hover:bg-gray-50 flex items-center space-x-3 rounded-lg transition-colors duration-200"
                      >
                        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${option.color} ${option.iconColor}`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{option.label}</div>
                          <div className="text-sm text-gray-500">Find helpers for {option.label.toLowerCase()}</div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : (
            <div>
              <h3 className="text-sm font-medium text-gray-600 mb-4">Number of guests</h3>
              <div className="max-w-sm mx-auto">
                <button className="w-full p-4 text-left hover:bg-gray-50 flex items-center justify-between rounded-lg transition-colors duration-200">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                      <Users className="w-5 h-5 text-gray-600" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">Guests</div>
                      <div className="text-sm text-gray-500">{searchState.guests} {searchState.guests === 1 ? 'person' : 'people'}</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        setSearchState(prev => ({ ...prev, guests: Math.max(1, prev.guests - 1) }));
                      }}
                      className="w-8 h-8 border border-gray-300 rounded-full flex items-center justify-center hover:bg-gray-50 transition-colors duration-200"
                    >
                      -
                    </button>
                    <span className="w-8 text-center font-medium">{searchState.guests}</span>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        setSearchState(prev => ({ ...prev, guests: prev.guests + 1 }));
                      }}
                      className="w-8 h-8 border border-gray-300 rounded-full flex items-center justify-center hover:bg-gray-50 transition-colors duration-200"
                    >
                      +
                    </button>
                  </div>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Main Search Interface - Overview with all sections visible
  return (
    <div className="fixed inset-0 z-50 bg-white flex flex-col">
      {/* Tabs positioned at very top with close button integrated */}
      <div className="relative bg-gray-50 pt-4 pb-2 flex-shrink-0">
        {/* Close button positioned absolute in top right - centered with tabs */}
        <button 
          onClick={onClose} 
          className="absolute top-1/2 right-4 -translate-y-1/2 w-10 h-10 bg-white hover:bg-gray-50 rounded-full flex items-center justify-center transition-colors z-10 shadow-sm border border-gray-200"
        >
          <X className="w-6 h-6 text-black" />
        </button>

        {/* Tabs centered */}
        <div className="flex justify-center px-8">
          <div className="flex space-x-12">
            <button
              onClick={() => handleSearchTypeChange('housemates')}
              className={`flex flex-col items-center py-2 transition-colors duration-200 ${
                searchState.searchType === 'housemates' 
                  ? 'text-black' 
                  : 'text-gray-500'
              }`}
            >
              <div className="relative w-12 h-12 mb-2">
                <Image
                  src="/updated-helper-7-18.png"
                  alt="Helper"
                  fill
                  className="object-contain"
                />
              </div>
              <span className="font-medium text-sm">Helpers</span>
              {searchState.searchType === 'housemates' && (
                <div className="w-full h-0.5 bg-black rounded-full mt-2 transition-all duration-200" />
              )}
            </button>
            
            <button
              onClick={() => handleSearchTypeChange('homes')}
              className={`flex flex-col items-center py-2 transition-colors duration-200 ${
                searchState.searchType === 'homes' 
                  ? 'text-black' 
                  : 'text-gray-500'
              }`}
            >
              <div className="relative w-12 h-12 mb-2">
                <Image
                  src="/updated-home-icon-min.png"
                  alt="Homes"
                  fill
                  className="object-contain"
                />
              </div>
              <span className="font-medium text-sm">Homes</span>
              {searchState.searchType === 'homes' && (
                <div className="w-full h-0.5 bg-black rounded-full mt-2 transition-all duration-200" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Main content area - shows all sections in overview */}
      <div 
        className="flex-1 bg-gray-50"
        style={{ 
          height: 'calc(100vh - 140px)' // Account for header and footer
        }}
      >
        <div className="min-h-full pb-4">
          {/* Where Section - Preview with dropdown */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 mx-4 mt-2 mb-4 transition-all duration-300">
            {expandedSection === 'where' ? (
              // Expanded Where Section - Preview
              <div className="p-5">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Where?</h3>
                
                <div className="relative mb-4">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    placeholder="Search locations"
                    value={locationFilter}
                    onChange={(e) => setLocationFilter(e.target.value)}
                    className="pl-12 h-12 text-base border border-black focus:border-black focus:ring-0 rounded-xl bg-white transition-all duration-200"
                  />
                </div>

                {/* Show first 3 cities */}
                <div className="space-y-2 mb-4">
                  {(locationFilter ? filteredCities : operatingCities).slice(0, 3).map((city) => (
                    <button 
                      key={city.name}
                      className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg cursor-pointer transition-all duration-200 group text-left"
                      onClick={() => handleLocationSelect(city.name)}
                    >
                      <div className={`w-10 h-10 ${city.color} rounded-lg flex items-center justify-center ${city.iconColor} group-hover:scale-105 transition-transform duration-200`}>
                        {renderCityIcon(city.icon)}
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-gray-900 text-sm">{city.name}</div>
                        <div className="text-xs text-gray-500">{city.description}</div>
                      </div>
                    </button>
                  ))}
                </div>

                {/* Dropdown arrow for more locations */}
                {(locationFilter ? filteredCities : operatingCities).length > 3 && (
                  <div className="flex justify-center mt-4">
                    <button
                      onClick={() => setFullscreenSection('where')}
                      className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              // Collapsed Where Section
              <button
                onClick={() => setExpandedSection('where')}
                className="w-full p-3 flex items-center justify-between text-left hover:bg-gray-50 transition-all duration-200 rounded-xl"
              >
                <h3 className="text-lg font-medium text-gray-400">Where?</h3>
                <div className="text-sm font-semibold text-gray-900">{getSectionDisplayText('where')}</div>
              </button>
            )}
          </div>

          {/* When Section - Expandable inline calendar */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 mx-4 mb-4 transition-all duration-300">
            {expandedSection === 'when' ? (
              // Expanded When Section with Calendar
              <div className="p-5">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">When?</h3>
                
                {/* As Soon As Possible Button */}
                <div className="flex items-center justify-center mb-6">
                  <button
                    onClick={() => handleFlexibleDateSelect('As soon as possible')}
                    className="px-6 py-3 text-base border border-gray-300 rounded-full hover:bg-gray-50 transition-colors font-medium"
                  >
                    As soon as possible
                  </button>
                </div>

                {/* Calendar */}
                <div className="grid grid-cols-1 gap-6">
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
                </div>
              </div>
            ) : (
              // Collapsed When Section
              <button
                onClick={() => setExpandedSection('when')}
                className="w-full p-3 flex items-center justify-between text-left hover:bg-gray-50 transition-all duration-200 rounded-xl"
              >
                <h3 className="text-lg font-medium text-gray-400">When?</h3>
                <div className="text-sm font-semibold text-gray-900">{getSectionDisplayText('when')}</div>
              </button>
            )}
          </div>

          {/* What/Who Section - Preview with dropdown - Hide when calendar is expanded */}
          {expandedSection !== 'when' && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 mx-4 mb-4 transition-all duration-300">
            {expandedSection === 'what' ? (
              // Expanded What Section - Preview
              <div className="p-5">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  {searchState.searchType === 'housemates' ? 'What?' : 'Who?'}
                </h3>
                
                {searchState.searchType === 'housemates' ? (
                  <div>
                    {/* Show first 3 help options */}
                    <div className="space-y-3 mb-4">
                      {helpOptions.slice(0, 3).map((option) => {
                        const Icon = option.icon;
                        const isSelected = searchState.helpTypes.includes(option.id);
                        
                        return (
                          <div
                            key={option.id}
                            className={`flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors ${
                              isSelected ? 'bg-gray-100' : ''
                            }`}
                            onClick={() => toggleHelpType(option.id)}
                          >
                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                              isSelected ? 'bg-gray-800 text-white' : `${option.color} ${option.iconColor}`
                            }`}>
                              {isSelected ? (
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                              ) : (
                                <Icon className="w-5 h-5" />
                              )}
                            </div>
                            <div className="flex-1">
                              <div className={`font-medium ${isSelected ? 'text-gray-900' : 'text-gray-900'}`}>
                                {option.label}
                              </div>
                              <div className="text-sm text-gray-500">Find helpers for {option.label.toLowerCase()}</div>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Dropdown arrow for more help types */}
                    {helpOptions.length > 3 && (
                      <div className="flex justify-center mt-4">
                        <button
                          onClick={() => setFullscreenSection('what')}
                          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                        >
                          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="max-w-sm mx-auto">
                    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div>
                        <div className="text-lg font-medium text-gray-900">Guests</div>
                        <div className="text-sm text-gray-500">Number of people</div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <button 
                          onClick={() => setSearchState(prev => ({ ...prev, guests: Math.max(1, prev.guests - 1) }))}
                          className="w-8 h-8 border border-gray-300 rounded-full flex items-center justify-center hover:bg-gray-50 transition-colors duration-200"
                        >
                          -
                        </button>
                        <span className="w-8 text-center font-medium">{searchState.guests}</span>
                        <button 
                          onClick={() => setSearchState(prev => ({ ...prev, guests: prev.guests + 1 }))}
                          className="w-8 h-8 border border-gray-300 rounded-full flex items-center justify-center hover:bg-gray-50 transition-colors duration-200"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              // Collapsed What Section
              <button
                onClick={() => setExpandedSection('what')}
                className="w-full p-3 flex items-center justify-between text-left hover:bg-gray-50 transition-all duration-200 rounded-xl"
              >
                <h3 className="text-lg font-medium text-gray-400">
                  {searchState.searchType === 'housemates' ? 'What?' : 'Who?'}
                </h3>
                <div className="text-sm font-semibold text-gray-900">{getSectionDisplayText('what')}</div>
              </button>
            )}
          </div>
          )}
        </div>
      </div>

      {/* Fixed Footer */}
      <div className="flex-shrink-0 bg-gray-50 p-6">
        <div className="flex items-center justify-between">
          <button 
            onClick={handleClearAll}
            className="text-xl font-medium text-gray-900 underline transition-colors duration-200 hover:text-gray-700"
          >
            Clear all
          </button>
          {expandedSection === 'when' ? (
            <Button 
              onClick={() => setExpandedSection('what')}
              className="px-20 py-6 text-xl font-normal bg-black hover:bg-gray-800 text-white transition-all duration-200 hover:shadow-md"
            >
              Next
            </Button>
          ) : (
            <Button 
              onClick={handleSearch}
              className="px-20 py-6 text-xl font-normal text-white transition-all duration-200 hover:shadow-md"
              style={{ backgroundColor: '#c98f31' }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#b8802c'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#c98f31'}
            >
              <Search className="w-6 h-6 mr-3" />
              Search
            </Button>
          )}
        </div>
      </div>
    </div>
  );
} 