"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { FileText, Download, Eye, Send, Calendar, DollarSign, User, Home, FileSignature, Plus, Trash2, Settings } from "lucide-react";
import { toast } from "sonner";

export interface AgreementFormData {
  // Basic Agreement Information
  effectiveDate: string;
  
  // Host Information (Licensor)
  hostName: string;
  hostAddress: string;
  hostPhone: string;
  hostEmail: string;
  
  // Seeker Information (Licensee)
  seekerName: string;
  seekerPhone: string;
  seekerEmail: string;
  
  // Property Information
  propertyAddress: string;
  roomDescription: string;
  
  // Financial Terms
  monthlyAmount: string;
  securityDeposit: string;
  
  // Agreement Terms
  moveInDate: string;
  endDate: string;
  agreementLength: string;
  
  // Property Addendum - Licensee Areas
  bedroomAAccess: boolean;
  bedroomANotes: string;
  bedroomBAccess: boolean;
  bedroomBNotes: string;
  otherAreasAccess: boolean;
  otherAreasNotes: string;
  
  // Property Addendum - Shared Areas
  livingAreaAccess: boolean;
  livingAreaNotes: string;
  kitchenAccess: boolean;
  kitchenNotes: string;
  diningAreaAccess: boolean;
  diningAreaNotes: string;
  laundryAreaAccess: boolean;
  laundryAreaNotes: string;
  indoorStorageAccess: boolean;
  indoorStorageNotes: string;
  parkingAreaAccess: boolean;
  parkingAreaNotes: string;
  outdoorAreaAccess: boolean;
  outdoorAreaNotes: string;
  outdoorStorageAccess: boolean;
  outdoorStorageNotes: string;
  otherSharedAccess: boolean;
  otherSharedNotes: string;
  
  // Specific Items Section
  specificItemsOwnership: string;
  
  // House Rules - TV Usage
  tvUsage: 'anytime' | 'ask' | 'limited' | 'offlimits';
  tvLimitedHours: string;
  
  // House Rules - Music
  musicUsage: 'anytime' | 'ask' | 'limited' | 'offlimits';
  musicLimitedHours: string;
  
  // House Rules - Social Activities
  alcoholAllowed: boolean;
  alcoholParameters: string;
  smokingAllowed: boolean;
  smokingParameters: string;
  otherActivitiesAllowed: boolean;
  otherActivitiesParameters: string;
  
  // House Rules - Quiet Hours
  quietHoursFrom: string;
  quietHoursTo: string;
  quietHoursDays: string;
  
  // House Rules - Pets
  petsAllowed: boolean;
  petSpeciesRestrictions: string;
  petOtherParameters: string;
  
  // House Rules - Guests
  guestsAllowed: boolean;
  guestDaysOccasions: string;
  guestOtherParameters: string;
  
  // House Rules - Communication
  noticesInPerson: boolean;
  noticesPhone: boolean;
  noticesText: boolean;
  noticesEmail: boolean;
  noticesOther: boolean;
  noticesOtherMethod: string;
  disagreementsInPerson: boolean;
  disagreementsPhone: boolean;
  disagreementsText: boolean;
  disagreementsEmail: boolean;
  disagreementsOther: boolean;
  disagreementsOtherMethod: string;
  
  // Support Services Requested
  supportRequested: Array<{
    id: string;
    hoursPerWeek: number;
  }>;
  
  // House Rules - Chores
  choresList: Array<{
    task: string;
    owner: string;
    frequency: string;
  }>;
  dishesPolicy: 'rightaway' | 'overnight' | 'nopreference';
  expiredFoodPolicy: 'rightaway' | 'fewdays' | 'nopreference';
  
  // Custom Section
  customAgreements: string;
  
  // Additional Information
  specialConditions: string;
  additionalNotes: string;
}

interface FillableAgreementFormProps {
  title?: string;
  description?: string;
  onFormSubmit?: (data: AgreementFormData) => void;
  homeownerData?: {
    user: any;
    homeownerProfile: any;
    listings: any[];
  } | null;
  currentUser?: any;
}

export function FillableAgreementForm({ 
  title = "Fill Golden HomeShare Agreement",
  description = "Complete the form below to generate your personalized agreement",
  onFormSubmit,
  homeownerData,
  currentUser
}: FillableAgreementFormProps) {
  const [isLoading, setIsLoading] = useState(false);

  // Helper function to parse lifestyle data from homeowner profile
  const parseLifestyleData = (lifestyle: any) => {
    if (!lifestyle) return {};
    try {
      return typeof lifestyle === 'string' ? JSON.parse(lifestyle) : lifestyle;
    } catch {
      return {};
    }
  };

  // Helper function to extract house rules from listings
  const extractHouseRulesFromListings = (listings: any[]) => {
    const allRules: any[] = [];
    listings.forEach(listing => {
      if (listing.houseRules && Array.isArray(listing.houseRules)) {
        allRules.push(...listing.houseRules);
      }
    });
    return allRules;
  };

  // Helper function to extract support tasks from listings
  const extractSupportTasksFromListings = (listings: any[]) => {
    const allSupportTasks: any[] = [];
    listings.forEach(listing => {
      if (listing.supportRequested && Array.isArray(listing.supportRequested)) {
        allSupportTasks.push(...listing.supportRequested);
      }
    });
    
    // Deduplicate support tasks by ID and merge hours
    const consolidatedTasks: Record<string, { id: string; hoursPerWeek: number }> = {};
    allSupportTasks.forEach(task => {
      const taskId = typeof task === 'string' ? task : task.id;
      const taskHours = typeof task === 'string' ? 1 : (task.hoursPerWeek || 1);
      
      if (consolidatedTasks[taskId]) {
        // If task already exists, take the maximum hours
        consolidatedTasks[taskId].hoursPerWeek = Math.max(consolidatedTasks[taskId].hoursPerWeek, taskHours);
      } else {
        consolidatedTasks[taskId] = { id: taskId, hoursPerWeek: taskHours };
      }
    });
    
    return Object.values(consolidatedTasks);
  };

  // Helper function to map house rules to form fields
  const mapHouseRulesToFormData = (houseRules: any[], profileLifestyle: any) => {
    const formUpdates: Partial<AgreementFormData> = {};
    
    // Map common house rules (excluding guest and smoking policies from listings)
    houseRules.forEach(rule => {
      const ruleId = typeof rule === 'string' ? rule : rule.id;
      const ruleValue = typeof rule === 'string' ? null : rule.value;
      
      switch (ruleId) {
        case 'petPolicy':
          if (ruleValue === 'yes' || ruleValue === 'discussionRequired') {
            formUpdates.petsAllowed = true;
            formUpdates.petOtherParameters = ruleValue === 'discussionRequired' ? 'Pet approval required' : '';
          } else {
            formUpdates.petsAllowed = false;
          }
          break;
        // Skip smokingPolicy and guestPolicy from listings - these will only come from profile
        case 'quietHours':
          if (ruleValue) {
            // Try to parse quiet hours like "10 PM - 7 AM"
            const match = ruleValue.match(/(\d{1,2}(?::\d{2})?\s*(?:AM|PM))\s*-\s*(\d{1,2}(?::\d{2})?\s*(?:AM|PM))/i);
            if (match) {
              formUpdates.quietHoursFrom = convertTo24Hour(match[1]);
              formUpdates.quietHoursTo = convertTo24Hour(match[2]);
            }
          }
          break;
        case 'additionalRules':
          if (ruleValue) {
            formUpdates.customAgreements = (formUpdates.customAgreements || '') + 
              (formUpdates.customAgreements ? '\n\n' : '') + ruleValue;
          }
          break;
      }
    });

    // Map profile lifestyle preferences (these take precedence and are the only source for guest/smoking policies)
    if (profileLifestyle.smokingPolicy) {
      formUpdates.smokingAllowed = profileLifestyle.smokingPolicy !== 'no-smoking';
      if (profileLifestyle.smokingPolicy === 'outdoor-only') {
        formUpdates.smokingParameters = 'Outdoor smoking only';
      }
    }

    if (profileLifestyle.guestPolicy) {
      formUpdates.guestsAllowed = profileLifestyle.guestPolicy !== 'no-guests';
      if (profileLifestyle.guestPolicy && profileLifestyle.guestPolicy !== 'no-guests') {
        const guestPolicyMap: Record<string, string> = {
          'dayNightApproval': 'Day and night with approval',
          'dayOnly': 'Day only',
          'always-welcome': 'Guests always welcome with notice',
          'occasional': 'Occasional guests with advance notice',
          'rare': 'Rare guests only'
        };
        formUpdates.guestDaysOccasions = guestPolicyMap[profileLifestyle.guestPolicy] || profileLifestyle.guestPolicy;
      }
    }

    return formUpdates;
  };

  // Helper function to convert 12-hour time to 24-hour format
  const convertTo24Hour = (time12h: string): string => {
    const [time, modifier] = time12h.split(/\s*(AM|PM)/i);
    let [hours, minutes] = time.split(':');
    if (!minutes) minutes = '00';
    
    if (hours === '12') {
      hours = '00';
    }
    if (modifier.toUpperCase() === 'PM') {
      hours = (parseInt(hours, 10) + 12).toString();
    }
    
    return `${hours.padStart(2, '0')}:${minutes.padStart(2, '0')}`;
  };

  // Initialize form data with defaults and populate from homeowner data if available
  const getInitialFormData = (): AgreementFormData => {
    const defaultData: AgreementFormData = {
      // Basic Agreement Information
      effectiveDate: "",
      
      // Host Information (Licensor)
      hostName: "",
      hostAddress: "",
      hostPhone: "",
      hostEmail: "",
      
      // Seeker Information (Licensee)
      seekerName: "",
      seekerPhone: "",
      seekerEmail: "",
      
      // Property Information
      propertyAddress: "",
      roomDescription: "",
      
      // Financial Terms
      monthlyAmount: "",
      securityDeposit: "",
      
      // Agreement Terms
      moveInDate: "",
      endDate: "",
      agreementLength: "12",
      
      // Property Addendum - Licensee Areas
      bedroomAAccess: false,
      bedroomANotes: "",
      bedroomBAccess: false,
      bedroomBNotes: "",
      otherAreasAccess: false,
      otherAreasNotes: "",
      
      // Property Addendum - Shared Areas
      livingAreaAccess: true,
      livingAreaNotes: "",
      kitchenAccess: true,
      kitchenNotes: "",
      diningAreaAccess: true,
      diningAreaNotes: "",
      laundryAreaAccess: true,
      laundryAreaNotes: "",
      indoorStorageAccess: false,
      indoorStorageNotes: "",
      parkingAreaAccess: false,
      parkingAreaNotes: "",
      outdoorAreaAccess: false,
      outdoorAreaNotes: "",
      outdoorStorageAccess: false,
      outdoorStorageNotes: "",
      otherSharedAccess: false,
      otherSharedNotes: "",
      
      // Specific Items Section
      specificItemsOwnership: "",
      
      // House Rules - TV Usage
      tvUsage: 'anytime',
      tvLimitedHours: "",
      
      // House Rules - Music
      musicUsage: 'anytime',
      musicLimitedHours: "",
      
      // House Rules - Social Activities
      alcoholAllowed: true,
      alcoholParameters: "",
      smokingAllowed: false,
      smokingParameters: "",
      otherActivitiesAllowed: false,
      otherActivitiesParameters: "",
      
      // House Rules - Quiet Hours
      quietHoursFrom: "22:00",
      quietHoursTo: "07:00",
      quietHoursDays: "Daily",
      
      // House Rules - Pets
      petsAllowed: false,
      petSpeciesRestrictions: "",
      petOtherParameters: "",
      
      // House Rules - Guests
      guestsAllowed: true,
      guestDaysOccasions: "",
      guestOtherParameters: "",
      
      // House Rules - Communication
      noticesInPerson: true,
      noticesPhone: false,
      noticesText: true,
      noticesEmail: true,
      noticesOther: false,
      noticesOtherMethod: "",
      disagreementsInPerson: true,
      disagreementsPhone: false,
      disagreementsText: false,
      disagreementsEmail: false,
      disagreementsOther: false,
      disagreementsOtherMethod: "",
      
      // Support Services Requested
      supportRequested: [],
      
      // House Rules - Chores
      choresList: [],
      dishesPolicy: 'rightaway',
      expiredFoodPolicy: 'rightaway',
      
      // Custom Section
      customAgreements: "",
      
      // Additional Information
      specialConditions: "",
      additionalNotes: ""
    };

    // If homeowner data is available, pre-populate relevant fields
    if (homeownerData) {
      const { user, homeownerProfile, listings } = homeownerData;
      const lifestyleData = parseLifestyleData(homeownerProfile?.lifestyle);
      
      // Populate host information
      defaultData.hostName = `${user.firstName} ${user.lastName}`;
      defaultData.hostEmail = user.email;
      
      // If there are listings, use the first one's address as default
      if (listings.length > 0) {
        defaultData.propertyAddress = listings[0].address || "";
        defaultData.hostAddress = listings[0].address || "";
        
        // If there's pricing info, use it as a starting point
        if (listings[0].price) {
          defaultData.monthlyAmount = listings[0].price.toString();
        }
      }
      
      // Extract and map house rules
      const allHouseRules = extractHouseRulesFromListings(listings);
      const houseRuleUpdates = mapHouseRulesToFormData(allHouseRules, lifestyleData);
      
      // Extract support tasks from listings
      const supportTasks = extractSupportTasksFromListings(listings);
      defaultData.supportRequested = supportTasks;
      
      // Apply house rule updates
      Object.assign(defaultData, houseRuleUpdates);
    }

    return defaultData;
  };

  const [formData, setFormData] = useState<AgreementFormData>(getInitialFormData());

  const handleInputChange = (field: keyof AgreementFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleCheckboxChange = (field: keyof AgreementFormData, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: checked
    }));
  };

  const addChore = () => {
    setFormData(prev => ({
      ...prev,
      choresList: [...prev.choresList, { task: "", owner: "", frequency: "" }]
    }));
  };

  const updateChore = (index: number, field: 'task' | 'owner' | 'frequency', value: string) => {
    setFormData(prev => ({
      ...prev,
      choresList: prev.choresList.map((chore, i) => 
        i === index ? { ...chore, [field]: value } : chore
      )
    }));
  };

  const removeChore = (index: number) => {
    setFormData(prev => ({
      ...prev,
      choresList: prev.choresList.filter((_, i) => i !== index)
    }));
  };

  const validateForm = (): boolean => {
    const requiredFields: (keyof AgreementFormData)[] = [
      'effectiveDate', 'hostName', 'hostEmail', 'seekerName', 'seekerEmail', 
      'propertyAddress', 'monthlyAmount', 'securityDeposit', 'moveInDate', 'endDate'
    ];
    
    const missingFields = requiredFields.filter(field => !formData[field]);
    
    if (missingFields.length > 0) {
      toast.error(`Please fill in all required fields: ${missingFields.join(', ')}`);
      return false;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.hostEmail)) {
      toast.error("Please enter a valid host email address");
      return false;
    }
    if (!emailRegex.test(formData.seekerEmail)) {
      toast.error("Please enter a valid seeker email address");
      return false;
    }
    
    // Validate at least one licensee area is selected
    if (!formData.bedroomAAccess && !formData.bedroomBAccess && !formData.otherAreasAccess) {
      toast.error("Please select at least one licensee area (bedroom or other area)");
      return false;
    }
    
    // Validate required bedroom and bathroom descriptions
    if (!formData.bedroomANotes || !formData.bedroomBNotes) {
      toast.error("Please provide descriptions for both the licensee bedroom and bathroom");
      return false;
    }
    
    return true;
  };

  const getEndpoint = () => {
    return '/api/agreements/generate-complete';
  };

  const handleGeneratePDF = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const response = await fetch(getEndpoint(), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('Server error:', errorData);
        throw new Error(errorData.details || `Server error: ${response.status} ${response.statusText}`);
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      
      // Create download link
      const link = document.createElement('a');
      link.href = url;
      link.download = `golden-homeshare-agreement-${formData.hostName.replace(/\s+/g, '-').toLowerCase()}-${formData.seekerName.replace(/\s+/g, '-').toLowerCase()}.pdf`;
      
      // Trigger download
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Clean up object URL
      URL.revokeObjectURL(url);
      
      toast.success('Agreement generated and downloaded successfully!');
      
      if (onFormSubmit) {
        onFormSubmit(formData);
      }
      
    } catch (error) {
      console.error("Error generating agreement:", error);
      toast.error(`Failed to generate agreement: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePreview = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const response = await fetch(getEndpoint(), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('Server error:', errorData);
        throw new Error(errorData.details || `Server error: ${response.status} ${response.statusText}`);
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      
      // Open PDF in new tab
      window.open(url, "_blank");
      
      // Clean up object URL after a delay
      setTimeout(() => URL.revokeObjectURL(url), 100);
      
    } catch (error) {
      console.error("Error previewing agreement:", error);
      toast.error(`Failed to preview agreement: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendEmail = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const response = await fetch('/api/agreements/send-filled', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to send agreement');
      }

      toast.success("Agreement sent to both parties successfully!");
      
    } catch (error) {
      console.error("Error sending agreement:", error);
      toast.error("Failed to send agreement. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-8">
      {/* Header Section */}
      <div className="text-center">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
            <FileText className="h-6 w-6 text-primary" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
        </div>
        <p className="text-gray-600 max-w-2xl mx-auto">{description}</p>
      </div>

      {/* Homeowner Listings Selection */}
      {homeownerData && homeownerData.listings.length > 0 && (
        <Card className="shadow-lg border-0">
          <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 border-b border-green-100 rounded-t-lg">
            <div className="text-center">
              <div className="flex items-center justify-center gap-3 mb-3">
                <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                  <Home className="h-5 w-5 text-green-600" />
                </div>
                <CardTitle className="text-xl text-gray-900">Property & Auto-Population</CardTitle>
              </div>
              <CardDescription className="text-gray-600">
                Choose your listing to automatically populate property details and house rules
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            {/* Listing Selection */}
            <div className="space-y-4">
              <div className="space-y-3">
                <Label htmlFor="listingSelect" className="text-base font-medium text-gray-900">
                  Select Your Property Listing
                </Label>
                <Select 
                  value={formData.propertyAddress || (homeownerData.listings[0]?.address || "")}
                  onValueChange={(selectedAddress) => {
                    const selectedListing = homeownerData.listings.find(l => l.address === selectedAddress);
                    if (selectedListing) {
                      setFormData(prev => ({
                        ...prev,
                        propertyAddress: selectedListing.address || "",
                        hostAddress: selectedListing.address || "",
                        monthlyAmount: selectedListing.price?.toString() || prev.monthlyAmount,
                        roomDescription: selectedListing.description ? 
                          (typeof selectedListing.description === 'string' ? 
                            selectedListing.description : 
                            JSON.stringify(selectedListing.description)
                          ).slice(0, 200) + "..." : prev.roomDescription
                      }));
                      
                      // Re-apply house rules from the selected listing
                      if (selectedListing.houseRules) {
                        const profileLifestyle = parseLifestyleData(homeownerData.homeownerProfile?.lifestyle);
                        const houseRuleUpdates = mapHouseRulesToFormData(
                          Array.isArray(selectedListing.houseRules) ? selectedListing.houseRules : [],
                          profileLifestyle
                        );
                        setFormData(prev => ({ ...prev, ...houseRuleUpdates }));
                      }
                    }
                  }}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Choose a property listing..." />
                  </SelectTrigger>
                  <SelectContent>
                    {homeownerData.listings.map((listing) => (
                      <SelectItem key={listing.id} value={listing.address || listing.id}>
                        <div className="w-full">
                          <div className="font-medium text-gray-900 text-sm mb-1">{listing.name}</div>
                          <div className="text-xs text-gray-600 mb-2">{listing.address}</div>
                          <div className="flex items-center gap-2">
                            {listing.price && (
                              <span className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded-full">
                                ${listing.price}/month
                              </span>
                            )}
                            {listing.houseRules && Array.isArray(listing.houseRules) && listing.houseRules.length > 0 && (
                              <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded-full">
                                {listing.houseRules.length} rules
                              </span>
                            )}
                          </div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-sm text-gray-500">
                  This will automatically fill in property details, pricing, and house rules below
                </p>
              </div>

              {/* Auto-Populated Data Summary */}
              {(() => {
                const currentListing = homeownerData.listings.find(l => 
                  l.address === formData.propertyAddress || 
                  (homeownerData.listings.length === 1 && l === homeownerData.listings[0])
                );
                const profileLifestyle = parseLifestyleData(homeownerData.homeownerProfile?.lifestyle);
                const allHouseRules = currentListing?.houseRules ? 
                  extractHouseRulesFromListings([currentListing]) : [];
                const supportTasks = currentListing ? extractSupportTasksFromListings([currentListing]) : [];

                // Helper function to format rule names
                const formatRuleName = (ruleId: string): string => {
                  const ruleNameMap: Record<string, string> = {
                    'petPolicy': 'Pet Policy',
                    'quietHours': 'Quiet Hours',
                    'additionalRules': 'Additional Rules',
                    'smokingPolicy': 'Smoking Policy',
                    'guestPolicy': 'Guest Policy',
                    'alcoholPolicy': 'Alcohol Policy',
                    'musicPolicy': 'Music Policy',
                    'tvPolicy': 'TV Policy'
                  };
                  return ruleNameMap[ruleId] || ruleId.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
                };

                // Helper function to format rule values
                const formatRuleValue = (ruleId: string, ruleValue: string | null): string => {
                  if (!ruleValue) return '';
                  
                  const formattingMap: Record<string, Record<string, string>> = {
                    'petPolicy': {
                      'no': 'No pets allowed',
                      'yes': 'Pets allowed',
                      'discussionRequired': 'Pets allowed with approval',
                      'cats': 'Cats allowed',
                      'dogs': 'Dogs allowed',
                      'small-pets': 'Small pets only'
                    },
                    'smokingPolicy': {
                      'no-smoking': 'No smoking',
                      'outdoor-only': 'Outdoor smoking only',
                      'yes': 'Smoking allowed',
                      'designated-areas': 'Designated smoking areas only'
                    },
                    'guestPolicy': {
                      'always-welcome': 'Guests always welcome',
                      'with-notice': 'Guests welcome with notice',
                      'weekends-only': 'Weekend guests only',
                      'no-guests': 'No guests allowed',
                      'dayNightApproval': 'Day and night guests with approval',
                      'dayOnly': 'Day guests only',
                      'occasional': 'Occasional guests with advance notice',
                      'rare': 'Rare guests only'
                    }
                  };

                  // Check if we have a specific mapping for this rule and value
                  if (formattingMap[ruleId] && formattingMap[ruleId][ruleValue]) {
                    return formattingMap[ruleId][ruleValue];
                  }

                  // Handle time ranges for quiet hours
                  if (ruleId === 'quietHours' && ruleValue.includes('-')) {
                    return ruleValue; // Keep time ranges as-is since they're already formatted
                  }

                  // Default formatting: replace hyphens with spaces and capitalize
                  return ruleValue
                    .replace(/-/g, ' ')
                    .replace(/([A-Z])/g, ' $1')
                    .replace(/^./, str => str.toUpperCase())
                    .trim();
                };

                // Helper function to format profile lifestyle values
                const formatProfileValue = (policyType: string, value: string): string => {
                  const profileFormattingMap: Record<string, Record<string, string>> = {
                    'smokingPolicy': {
                      'no-smoking': 'No smoking allowed',
                      'outdoor-only': 'Outdoor smoking only',
                      'yes': 'Smoking allowed',
                      'designated-areas': 'Designated smoking areas only'
                    },
                    'guestPolicy': {
                      'always-welcome': 'Guests always welcome',
                      'with-notice': 'Guests welcome with advance notice',
                      'weekends-only': 'Weekend guests only', 
                      'no-guests': 'No guests allowed',
                      'dayNightApproval': 'Day and night guests with approval',
                      'dayOnly': 'Day guests only',
                      'occasional': 'Occasional guests with advance notice',
                      'rare': 'Rare guests only'
                    }
                  };

                  if (profileFormattingMap[policyType] && profileFormattingMap[policyType][value]) {
                    return profileFormattingMap[policyType][value];
                  }

                  // Default formatting
                  return value
                    .replace(/-/g, ' ')
                    .replace(/([A-Z])/g, ' $1')
                    .replace(/^./, str => str.toUpperCase())
                    .trim();
                };

                // Helper function to format support services
                const formatSupportService = (serviceId: string): string => {
                  const supportLabels: Record<string, string> = {
                    cleaning: "House Cleaning",
                    cooking: "Meal Preparation/Cooking",
                    gardening: "Yard Work & Gardening",
                    errands: "Shopping & Errands",
                    companionship: "Companionship",
                    petCare: "Pet Care",
                    techSupport: "Technology Support",
                    homeMaintenance: "Home Maintenance",
                    transportation: "Transportation"
                  };
                  return supportLabels[serviceId] || serviceId.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
                };

                // Collect summary data
                const summaryData = [];

                // Host info
                if (homeownerData.user) {
                  summaryData.push({
                    label: 'Host',
                    value: `${homeownerData.user.firstName} ${homeownerData.user.lastName} (${homeownerData.user.email})`
                  });
                }

                // Property info
                if (currentListing) {
                  summaryData.push({
                    label: 'Property',
                    value: currentListing.address
                  });

                  if (currentListing.price) {
                    summaryData.push({
                      label: 'Monthly Fee',
                      value: `$${currentListing.price}/month`
                    });
                  }

                  if (currentListing.description) {
                    const description = typeof currentListing.description === 'string' ? 
                      currentListing.description : 
                      JSON.stringify(currentListing.description);
                    if (description) {
                      summaryData.push({
                        label: 'Description',
                        value: description.length > 80 ? description.slice(0, 80) + '...' : description
                      });
                    }
                  }
                }

                // House rules
                const formattedRules = allHouseRules
                  .filter(rule => {
                    const ruleId = typeof rule === 'string' ? rule : rule.id;
                    return ruleId !== 'guestPolicy' && ruleId !== 'smokingPolicy';
                  })
                  .map(rule => {
                    const ruleId = typeof rule === 'string' ? rule : rule.id;
                    const ruleValue = typeof rule === 'string' ? null : rule.value;
                    const formattedValue = formatRuleValue(ruleId, ruleValue);
                    return formattedValue || formatRuleName(ruleId);
                  });

                // Profile policies
                const profilePolicies = [];
                if (profileLifestyle.smokingPolicy) {
                  profilePolicies.push(formatProfileValue('smokingPolicy', profileLifestyle.smokingPolicy));
                }
                if (profileLifestyle.guestPolicy) {
                  profilePolicies.push(formatProfileValue('guestPolicy', profileLifestyle.guestPolicy));
                }

                // Add individual house rules and policies
                const allPolicies = [...formattedRules, ...profilePolicies];
                allPolicies.forEach((policy, index) => {
                  summaryData.push({
                    label: index === 0 ? 'House Rules' : '',
                    value: policy
                  });
                });

                // Add individual support services
                supportTasks.forEach((support, index) => {
                  summaryData.push({
                    label: index === 0 ? 'Support' : '',
                    value: `${formatSupportService(support.id)} (${support.hoursPerWeek}h/week)`
                  });
                });

                if (summaryData.length > 0) {
                  return (
                    <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-4 h-4 bg-blue-600 rounded-sm"></div>
                        <h4 className="text-sm font-semibold text-blue-900">Auto-Populated Summary</h4>
                      </div>
                      
                      <div className="space-y-2">
                        {summaryData.map((item, index) => (
                          <div key={index} className="flex gap-3">
                            <span className="text-xs font-medium text-blue-800 min-w-[80px] pt-0.5">
                              {item.label}{item.label ? ':' : ''}
                            </span>
                            <span className="text-xs text-gray-700 flex-1">
                              {item.value}
                            </span>
                          </div>
                        ))}
                      </div>
                      
                      <p className="text-xs text-blue-700 mt-3 italic">
                        This information has been pre-filled in the form below and can be modified as needed.
                      </p>
                    </div>
                  );
                }
                return null;
              })()}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Main Form */}
      <Card className="shadow-lg border-0">
        <CardContent className="p-8 space-y-8">
          {/* Basic Agreement Information */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-3">
              <Calendar className="h-5 w-5 text-indigo-600" />
              <h3 className="text-lg font-semibold">Agreement Dates</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="effectiveDate">Effective Date *</Label>
                <Input
                  id="effectiveDate"
                  type="date"
                  value={formData.effectiveDate}
                  onChange={(e) => handleInputChange('effectiveDate', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="moveInDate">Start Date (Move-in) *</Label>
                <Input
                  id="moveInDate"
                  type="date"
                  value={formData.moveInDate}
                  onChange={(e) => handleInputChange('moveInDate', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endDate">End Date *</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => handleInputChange('endDate', e.target.value)}
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* Host Information */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-3">
              <User className="h-5 w-5 text-blue-600" />
              <h3 className="text-lg font-semibold">Licensor (Host) Information</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="hostName">Full Name *</Label>
                <Input
                  id="hostName"
                  value={formData.hostName}
                  onChange={(e) => handleInputChange('hostName', e.target.value)}
                  placeholder="John Doe"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="hostEmail">Email Address *</Label>
                <Input
                  id="hostEmail"
                  type="email"
                  value={formData.hostEmail}
                  onChange={(e) => handleInputChange('hostEmail', e.target.value)}
                  placeholder="host@example.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="hostPhone">Phone Number</Label>
                <Input
                  id="hostPhone"
                  value={formData.hostPhone}
                  onChange={(e) => handleInputChange('hostPhone', e.target.value)}
                  placeholder="(555) 123-4567"
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* Seeker Information */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-3">
              <User className="h-5 w-5 text-green-600" />
              <h3 className="text-lg font-semibold">Licensee (Seeker) Information</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="seekerName">Full Name *</Label>
                <Input
                  id="seekerName"
                  value={formData.seekerName}
                  onChange={(e) => handleInputChange('seekerName', e.target.value)}
                  placeholder="Jane Smith"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="seekerEmail">Email Address *</Label>
                <Input
                  id="seekerEmail"
                  type="email"
                  value={formData.seekerEmail}
                  onChange={(e) => handleInputChange('seekerEmail', e.target.value)}
                  placeholder="seeker@example.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="seekerPhone">Phone Number</Label>
                <Input
                  id="seekerPhone"
                  value={formData.seekerPhone}
                  onChange={(e) => handleInputChange('seekerPhone', e.target.value)}
                  placeholder="(555) 987-6543"
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* Property Information */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-3">
              <Home className="h-5 w-5 text-purple-600" />
              <h3 className="text-lg font-semibold">Property Information</h3>
            </div>
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <Label htmlFor="propertyAddress">Property Address *</Label>
                <Input
                  id="propertyAddress"
                  value={formData.propertyAddress}
                  onChange={(e) => handleInputChange('propertyAddress', e.target.value)}
                  placeholder="456 Oak Street, City, State 12345"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="roomDescription">Room/Space Description</Label>
                <Textarea
                  id="roomDescription"
                  value={formData.roomDescription}
                  onChange={(e) => handleInputChange('roomDescription', e.target.value)}
                  placeholder="Private bedroom with shared kitchen and living areas"
                  rows={3}
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* Financial Terms */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-3">
              <DollarSign className="h-5 w-5 text-yellow-600" />
              <h3 className="text-lg font-semibold">Financial Terms</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="monthlyAmount">Monthly License Fee *</Label>
                <Input
                  id="monthlyAmount"
                  value={formData.monthlyAmount}
                  onChange={(e) => handleInputChange('monthlyAmount', e.target.value)}
                  placeholder="800"
                  type="number"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="securityDeposit">Security Deposit *</Label>
                <Input
                  id="securityDeposit"
                  value={formData.securityDeposit}
                  onChange={(e) => handleInputChange('securityDeposit', e.target.value)}
                  placeholder="400"
                  type="number"
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* Property Addendum - Licensee Areas */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-3">
              <Home className="h-5 w-5 text-red-600" />
              <h3 className="text-lg font-semibold">Licensee Use Areas</h3>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Specify which bedroom and bathroom the licensee may use (revocable license):
            </p>
            
            <div className="space-y-6">
              {/* Bedroom Section - Required */}
              <div className="p-4 border-2 border-red-200 rounded-lg bg-red-50">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Label className="text-base font-semibold text-red-900">Licensee Bedroom *</Label>
                    <span className="text-xs px-2 py-1 bg-red-200 text-red-800 rounded-full">Required</span>
                  </div>
                  <Textarea
                    placeholder="Describe the specific bedroom the licensee may use (location, size, features, furnishings, etc.)..."
                    value={formData.bedroomANotes}
                    onChange={(e) => handleInputChange('bedroomANotes', e.target.value)}
                    rows={3}
                    className="border-red-300 focus:border-red-500"
                  />
                </div>
              </div>

              {/* Bathroom Section - Required */}
              <div className="p-4 border-2 border-red-200 rounded-lg bg-red-50">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Label className="text-base font-semibold text-red-900">Licensee Bathroom *</Label>
                    <span className="text-xs px-2 py-1 bg-red-200 text-red-800 rounded-full">Required</span>
                  </div>
                  <Textarea
                    placeholder="Describe the specific bathroom the licensee may use (full/half bath, shared/exclusive, location, special arrangements, etc.)..."
                    value={formData.bedroomBNotes}
                    onChange={(e) => handleInputChange('bedroomBNotes', e.target.value)}
                    rows={3}
                    className="border-red-300 focus:border-red-500"
                  />
                </div>
              </div>

              {/* Additional Areas - Optional */}
              <div className="p-4 border rounded-lg">
                <div className="space-y-3">
                  <Label className="text-base font-semibold text-gray-900">Additional Areas (Optional)</Label>
                  <Textarea
                    placeholder="Describe any additional areas the licensee may use (storage space, workspace, etc.)..."
                    value={formData.otherAreasNotes}
                    onChange={(e) => handleInputChange('otherAreasNotes', e.target.value)}
                    rows={2}
                  />
                </div>
              </div>
            </div>
            
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
              <p className="text-sm text-amber-800">
                ⚖️ <strong>License Agreement:</strong> These areas are granted as a revocable license, not exclusive tenancy rights. 
                The licensor retains ownership and may revoke access with proper notice as specified in the agreement.
              </p>
            </div>
          </div>

          <Separator />

          {/* Property Addendum - Shared Areas */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-3">
              <Home className="h-5 w-5 text-blue-600" />
              <h3 className="text-lg font-semibold">Shared Areas Access</h3>
            </div>
            <p className="text-sm text-muted-foreground mb-6">
              Select the areas both parties will have access to and add any specific notes or restrictions:
            </p>
            
            <div className="space-y-4">
              {/* Essential Areas */}
              <div className="space-y-4">
                <h4 className="text-sm font-semibold text-blue-900 flex items-center gap-2">
                  <Home className="w-4 h-4" />
                  Essential Common Areas
                </h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Living Area */}
                  <div className={`p-4 border-2 rounded-lg transition-all ${
                    formData.livingAreaAccess 
                      ? 'border-blue-300 bg-blue-50' 
                      : 'border-gray-200 bg-gray-50'
                  }`}>
                    <div className="flex items-start gap-3">
                      <input
                        type="checkbox"
                        id="livingAreaAccess"
                        checked={formData.livingAreaAccess}
                        onChange={(e) => handleCheckboxChange('livingAreaAccess', e.target.checked)}
                        className="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <div className="flex-1">
                        <Label htmlFor="livingAreaAccess" className="text-base font-medium cursor-pointer">
                          Living Room/Family Room
                        </Label>
                        <p className="text-xs text-gray-600 mt-1">
                          Main gathering space, seating area, entertainment
                        </p>
                        <Input
                          placeholder="Special arrangements or restrictions..."
                          value={formData.livingAreaNotes}
                          onChange={(e) => handleInputChange('livingAreaNotes', e.target.value)}
                          className="mt-2 text-sm"
                          disabled={!formData.livingAreaAccess}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Kitchen */}
                  <div className={`p-4 border-2 rounded-lg transition-all ${
                    formData.kitchenAccess 
                      ? 'border-blue-300 bg-blue-50' 
                      : 'border-gray-200 bg-gray-50'
                  }`}>
                    <div className="flex items-start gap-3">
                      <input
                        type="checkbox"
                        id="kitchenAccess"
                        checked={formData.kitchenAccess}
                        onChange={(e) => handleCheckboxChange('kitchenAccess', e.target.checked)}
                        className="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <div className="flex-1">
                        <Label htmlFor="kitchenAccess" className="text-base font-medium cursor-pointer">
                          Kitchen
                        </Label>
                        <p className="text-xs text-gray-600 mt-1">
                          Cooking, food storage, appliances
                        </p>
                        <Input
                          placeholder="Cooking schedule, storage arrangements..."
                          value={formData.kitchenNotes}
                          onChange={(e) => handleInputChange('kitchenNotes', e.target.value)}
                          className="mt-2 text-sm"
                          disabled={!formData.kitchenAccess}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Dining Area */}
                  <div className={`p-4 border-2 rounded-lg transition-all ${
                    formData.diningAreaAccess 
                      ? 'border-blue-300 bg-blue-50' 
                      : 'border-gray-200 bg-gray-50'
                  }`}>
                    <div className="flex items-start gap-3">
                      <input
                        type="checkbox"
                        id="diningAreaAccess"
                        checked={formData.diningAreaAccess}
                        onChange={(e) => handleCheckboxChange('diningAreaAccess', e.target.checked)}
                        className="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <div className="flex-1">
                        <Label htmlFor="diningAreaAccess" className="text-base font-medium cursor-pointer">
                          Dining Area
                        </Label>
                        <p className="text-xs text-gray-600 mt-1">
                          Meals, table space for activities
                        </p>
                        <Input
                          placeholder="Meal times, table usage..."
                          value={formData.diningAreaNotes}
                          onChange={(e) => handleInputChange('diningAreaNotes', e.target.value)}
                          className="mt-2 text-sm"
                          disabled={!formData.diningAreaAccess}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Laundry */}
                  <div className={`p-4 border-2 rounded-lg transition-all ${
                    formData.laundryAreaAccess 
                      ? 'border-blue-300 bg-blue-50' 
                      : 'border-gray-200 bg-gray-50'
                  }`}>
                    <div className="flex items-start gap-3">
                      <input
                        type="checkbox"
                        id="laundryAreaAccess"
                        checked={formData.laundryAreaAccess}
                        onChange={(e) => handleCheckboxChange('laundryAreaAccess', e.target.checked)}
                        className="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <div className="flex-1">
                        <Label htmlFor="laundryAreaAccess" className="text-base font-medium cursor-pointer">
                          Laundry Area
                        </Label>
                        <p className="text-xs text-gray-600 mt-1">
                          Washer, dryer, laundry supplies
                        </p>
                        <Input
                          placeholder="Usage schedule, detergent sharing..."
                          value={formData.laundryAreaNotes}
                          onChange={(e) => handleInputChange('laundryAreaNotes', e.target.value)}
                          className="mt-2 text-sm"
                          disabled={!formData.laundryAreaAccess}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Additional Shared Areas */}
                  <div className={`p-4 border-2 rounded-lg transition-all ${
                    formData.otherSharedAccess 
                      ? 'border-blue-300 bg-blue-50' 
                      : 'border-gray-200 bg-gray-50'
                  }`}>
                    <div className="flex items-start gap-3">
                      <input
                        type="checkbox"
                        id="otherSharedAccess"
                        checked={formData.otherSharedAccess}
                        onChange={(e) => handleCheckboxChange('otherSharedAccess', e.target.checked)}
                        className="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <div className="flex-1">
                        <Label htmlFor="otherSharedAccess" className="text-base font-medium cursor-pointer">
                          Additional Shared Areas
                        </Label>
                        <p className="text-xs text-gray-600 mt-1">
                          Other areas specific to your property
                        </p>
                        <Input
                          placeholder="Describe any other shared areas (basement, garage, workshop, etc.)..."
                          value={formData.otherSharedNotes}
                          onChange={(e) => handleInputChange('otherSharedNotes', e.target.value)}
                          className="mt-2 text-sm"
                          disabled={!formData.otherSharedAccess}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Parking */}
                  <div className={`p-4 border-2 rounded-lg transition-all ${
                    formData.parkingAreaAccess 
                      ? 'border-blue-300 bg-blue-50' 
                      : 'border-gray-200 bg-gray-50'
                  }`}>
                    <div className="flex items-start gap-3">
                      <input
                        type="checkbox"
                        id="parkingAreaAccess"
                        checked={formData.parkingAreaAccess}
                        onChange={(e) => handleCheckboxChange('parkingAreaAccess', e.target.checked)}
                        className="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <div className="flex-1">
                        <Label htmlFor="parkingAreaAccess" className="text-base font-medium cursor-pointer">
                          Parking Space
                        </Label>
                        <p className="text-xs text-gray-600 mt-1">
                          Driveway, garage, street parking
                        </p>
                        <Input
                          placeholder="Specific spots, guest parking arrangements..."
                          value={formData.parkingAreaNotes}
                          onChange={(e) => handleInputChange('parkingAreaNotes', e.target.value)}
                          className="mt-2 text-sm"
                          disabled={!formData.parkingAreaAccess}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg mt-6">
              <p className="text-sm text-blue-800">
                💡 <strong>Tip:</strong> Be specific about usage expectations, cleaning responsibilities, 
                and any time restrictions to prevent future misunderstandings.
              </p>
            </div>
          </div>

          <Separator />

          {/* House Rules */}
          <div className="space-y-6">
            <div className="flex items-center gap-2 mb-3">
              <Settings className="h-5 w-5 text-orange-600" />
              <h3 className="text-lg font-semibold">House Rules</h3>
              {homeownerData && (
                <Badge variant="secondary" className="ml-2">
                  Auto-populated from your profile & listings
                </Badge>
              )}
            </div>

            {/* Auto-populated Rules Notice */}
            {homeownerData && (
              <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
                <p className="text-sm text-orange-800">
                  ℹ️ The sections below have been pre-filled based on your homeowner profile and selected listing's house rules. 
                  You can modify any of these settings as needed.
                </p>
              </div>
            )}

            {/* TV and Music Usage */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3 p-4 border rounded-lg">
                <Label className="text-base font-medium">TV Usage in Shared Areas</Label>
                <Select value={formData.tvUsage} onValueChange={(value) => handleInputChange('tvUsage', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="anytime">Turn on anytime at reasonable volume</SelectItem>
                    <SelectItem value="ask">Ask if other person is in same room</SelectItem>
                    <SelectItem value="limited">Limited to specific hours</SelectItem>
                    <SelectItem value="offlimits">TV off-limits</SelectItem>
                  </SelectContent>
                </Select>
                {formData.tvUsage === 'limited' && (
                  <Input
                    placeholder="Specify days/hours..."
                    value={formData.tvLimitedHours}
                    onChange={(e) => handleInputChange('tvLimitedHours', e.target.value)}
                  />
                )}
              </div>

              <div className="space-y-3 p-4 border rounded-lg">
                <Label className="text-base font-medium">Music in Shared Areas</Label>
                <Select value={formData.musicUsage} onValueChange={(value) => handleInputChange('musicUsage', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="anytime">Play anytime at reasonable volume</SelectItem>
                    <SelectItem value="ask">Ask if other person is in same room</SelectItem>
                    <SelectItem value="limited">Limited to specific hours</SelectItem>
                    <SelectItem value="offlimits">Music off-limits</SelectItem>
                  </SelectContent>
                </Select>
                {formData.musicUsage === 'limited' && (
                  <Input
                    placeholder="Specify days/hours..."
                    value={formData.musicLimitedHours}
                    onChange={(e) => handleInputChange('musicLimitedHours', e.target.value)}
                  />
                )}
              </div>
            </div>

            {/* Social Activities */}
            <div className="space-y-4 p-4 border rounded-lg">
              <div className="flex items-center gap-2">
                <Label className="text-base font-medium">Social and Leisure Activities</Label>
                {homeownerData && (formData.smokingAllowed || formData.alcoholAllowed) && (
                  <Badge variant="outline" className="text-xs">
                    Auto-filled
                  </Badge>
                )}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start space-x-3">
                  <Switch
                    checked={formData.alcoholAllowed}
                    onCheckedChange={(checked) => handleCheckboxChange('alcoholAllowed', checked)}
                  />
                  <div className="flex-1 space-y-2">
                    <Label>Drinking Alcohol</Label>
                    <Input
                      placeholder="Specify parameters..."
                      value={formData.alcoholParameters}
                      onChange={(e) => handleInputChange('alcoholParameters', e.target.value)}
                      disabled={!formData.alcoholAllowed}
                    />
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <Switch
                    checked={formData.smokingAllowed}
                    onCheckedChange={(checked) => handleCheckboxChange('smokingAllowed', checked)}
                  />
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                      <Label>Smoking</Label>
                      {homeownerData && formData.smokingParameters && (
                        <Badge variant="outline" className="text-xs">
                          From profile
                        </Badge>
                      )}
                    </div>
                    <Input
                      placeholder="Specify parameters..."
                      value={formData.smokingParameters}
                      onChange={(e) => handleInputChange('smokingParameters', e.target.value)}
                      disabled={!formData.smokingAllowed}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Quiet Hours */}
            <div className="space-y-3 p-4 border rounded-lg">
              <div className="flex items-center gap-2">
                <Label className="text-base font-medium">Quiet Hours</Label>
                {homeownerData && (formData.quietHoursFrom !== "22:00" || formData.quietHoursTo !== "07:00") && (
                  <Badge variant="outline" className="text-xs">
                    From listing
                  </Badge>
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>From</Label>
                  <Input
                    type="time"
                    value={formData.quietHoursFrom}
                    onChange={(e) => handleInputChange('quietHoursFrom', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>To</Label>
                  <Input
                    type="time"
                    value={formData.quietHoursTo}
                    onChange={(e) => handleInputChange('quietHoursTo', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Days/Occasions</Label>
                  <Input
                    placeholder="Daily, weekends, etc."
                    value={formData.quietHoursDays}
                    onChange={(e) => handleInputChange('quietHoursDays', e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Pets */}
            <div className="space-y-3 p-4 border rounded-lg">
              <div className="flex items-center space-x-3">
                <Switch
                  checked={formData.petsAllowed}
                  onCheckedChange={(checked) => handleCheckboxChange('petsAllowed', checked)}
                />
                <div className="flex items-center gap-2">
                  <Label className="text-base font-medium">Pets Allowed</Label>
                  {homeownerData && formData.petOtherParameters && (
                    <Badge variant="outline" className="text-xs">
                      From listing
                    </Badge>
                  )}
                </div>
              </div>
              {formData.petsAllowed && (
                <div className="space-y-3 ml-6">
                  <div className="space-y-2">
                    <Label>Species/Breed Restrictions</Label>
                    <Input
                      placeholder="Dogs only, no cats, etc."
                      value={formData.petSpeciesRestrictions}
                      onChange={(e) => handleInputChange('petSpeciesRestrictions', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Other Pet Parameters</Label>
                    <Input
                      placeholder="Size limits, registration required, etc."
                      value={formData.petOtherParameters}
                      onChange={(e) => handleInputChange('petOtherParameters', e.target.value)}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Guests */}
            <div className="space-y-3 p-4 border rounded-lg">
              <div className="flex items-center space-x-3">
                <Switch
                  checked={formData.guestsAllowed}
                  onCheckedChange={(checked) => handleCheckboxChange('guestsAllowed', checked)}
                />
                <div className="flex items-center gap-2">
                  <Label className="text-base font-medium">Guests Allowed</Label>
                  {homeownerData && formData.guestDaysOccasions && (
                    <Badge variant="outline" className="text-xs">
                      From listing/profile
                    </Badge>
                  )}
                </div>
              </div>
              {formData.guestsAllowed && (
                <div className="space-y-3 ml-6">
                  <div className="space-y-2">
                    <Label>Days/Occasions</Label>
                    <Input
                      placeholder="Weekends only, with 24hr notice, etc."
                      value={formData.guestDaysOccasions}
                      onChange={(e) => handleInputChange('guestDaysOccasions', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Other Guest Parameters</Label>
                    <Input
                      placeholder="Maximum number, overnight restrictions, etc."
                      value={formData.guestOtherParameters}
                      onChange={(e) => handleInputChange('guestOtherParameters', e.target.value)}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Dishes and Food Policy */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3 p-4 border rounded-lg">
                <Label className="text-base font-medium">Dishes Should Be Washed</Label>
                <Select value={formData.dishesPolicy} onValueChange={(value) => handleInputChange('dishesPolicy', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="rightaway">Right away—no sitting in sink</SelectItem>
                    <SelectItem value="overnight">Overnight is fine</SelectItem>
                    <SelectItem value="nopreference">No preference</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3 p-4 border rounded-lg">
                <Label className="text-base font-medium">Expired Food Should Be Thrown Out</Label>
                <Select value={formData.expiredFoodPolicy} onValueChange={(value) => handleInputChange('expiredFoodPolicy', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="rightaway">Right away—no sitting in fridge</SelectItem>
                    <SelectItem value="fewdays">Within a few days is fine</SelectItem>
                    <SelectItem value="nopreference">No preference</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <Separator />

          {/* Chores */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-lg font-semibold">Chore Assignments</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addChore}
                className="flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Add Chore
              </Button>
            </div>
            
            {formData.choresList.map((chore, index) => (
              <div key={index} className="flex items-center gap-3 p-4 border rounded-lg">
                <div className="flex-1 space-y-2">
                  <Input
                    placeholder="Task (e.g., Take out trash)"
                    value={chore.task}
                    onChange={(e) => updateChore(index, 'task', e.target.value)}
                  />
                </div>
                <div className="flex-1 space-y-2">
                  <Select value={chore.owner} onValueChange={(value) => updateChore(index, 'owner', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Who does it?" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="host">Host</SelectItem>
                      <SelectItem value="seeker">Seeker</SelectItem>
                      <SelectItem value="both">Both</SelectItem>
                      <SelectItem value="alternate">Alternate</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex-1 space-y-2">
                  <Input
                    placeholder="Frequency (e.g., Weekly)"
                    value={chore.frequency}
                    onChange={(e) => updateChore(index, 'frequency', e.target.value)}
                  />
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => removeChore(index)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>

          <Separator />

          {/* Support Services Requested */}
          {formData.supportRequested.length > 0 && (
            <>
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Label className="text-lg font-semibold">Support Services Requested</Label>
                  {homeownerData && (
                    <Badge variant="outline" className="text-xs">
                      From listings
                    </Badge>
                  )}
                </div>
                
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-800 mb-4">
                    The homeowner would appreciate help with the following services as part of this homesharing arrangement:
                  </p>
                  
                  <div className="space-y-3">
                    {formData.supportRequested.map((support, index) => {
                      const supportLabels: Record<string, string> = {
                        cleaning: "Cleaning",
                        cooking: "Cooking",
                        gardening: "Yard Work",
                        errands: "Shopping & Errands",
                        companionship: "Companionship",
                        petCare: "Pet Care",
                        techSupport: "Tech Support",
                        homeMaintenance: "Home Maintenance",
                        transportation: "Transportation"
                      };
                      
                      const supportLabel = supportLabels[support.id] || support.id;
                      
                      return (
                        <div key={index} className="flex justify-between items-center bg-white px-4 py-3 rounded-lg border">
                          <span className="font-medium text-gray-900">{supportLabel}</span>
                          <span className="text-sm text-gray-600">
                            {support.hoursPerWeek} {support.hoursPerWeek === 1 ? 'hour' : 'hours'} per week
                          </span>
                        </div>
                      );
                    })}
                    
                    <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <p className="text-xs text-yellow-800">
                        <strong>Note:</strong> These support services are mutual agreements and should be discussed between both parties. 
                        The specific terms, timing, and expectations for these services should be clearly established and can be 
                        detailed in the Custom Agreements section below.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <Separator />
            </>
          )}

          {/* Custom Agreements */}
          <div className="space-y-4">
            <Label className="text-lg font-semibold">Custom Agreements</Label>
            <Textarea
              value={formData.customAgreements}
              onChange={(e) => handleInputChange('customAgreements', e.target.value)}
              placeholder="Any additional custom agreements between both parties..."
              rows={4}
            />
          </div>

          <Separator />

          {/* Additional Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Additional Information</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="specialConditions">Special Conditions</Label>
                <Textarea
                  id="specialConditions"
                  value={formData.specialConditions}
                  onChange={(e) => handleInputChange('specialConditions', e.target.value)}
                  placeholder="Any special conditions or requirements..."
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="additionalNotes">Additional Notes</Label>
                <Textarea
                  id="additionalNotes"
                  value={formData.additionalNotes}
                  onChange={(e) => handleInputChange('additionalNotes', e.target.value)}
                  placeholder="Any other important information..."
                  rows={3}
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-6">
            <Button
              onClick={handlePreview}
              disabled={isLoading}
              variant="outline"
              className="flex items-center gap-2"
            >
              <Eye className="h-4 w-4" />
              {isLoading ? "Loading..." : "Preview Agreement"}
            </Button>
            
            <Button
              onClick={handleGeneratePDF}
              disabled={isLoading}
              className="flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              {isLoading ? "Generating..." : "Download Agreement"}
            </Button>
            
            <Button
              onClick={handleSendEmail}
              disabled={isLoading}
              variant="secondary"
              className="flex items-center gap-2"
            >
              <Send className="h-4 w-4" />
              {isLoading ? "Sending..." : "Email to Both Parties"}
            </Button>
          </div>

          <div className="text-xs text-muted-foreground border-t pt-4">
            <p>* Required fields. By generating this agreement, both parties acknowledge they have read and agree to the terms and conditions of the Golden HomeShare Limited License Agreement.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 