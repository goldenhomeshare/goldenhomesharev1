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
import { FileText, Download, Eye, Send, Calendar, DollarSign, User, Home, FileSignature, Plus, Trash2, Settings, Clock, Loader2 } from "lucide-react";
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
  agreementLength?: string;
  
  // Area Access Properties
  bedroomAAccess?: boolean;
  bedroomANotes?: string;
  bedroomBAccess?: boolean;
  bedroomBNotes?: string;
  otherAreasAccess?: boolean;
  otherAreasNotes?: string;
  livingAreaAccess?: boolean;
  livingAreaNotes?: string;
  kitchenAccess?: boolean;
  kitchenNotes?: string;
  diningAreaAccess?: boolean;
  diningAreaNotes?: string;
  laundryAreaAccess?: boolean;
  laundryAreaNotes?: string;
  indoorStorageAccess?: boolean;
  indoorStorageNotes?: string;
  parkingAreaAccess?: boolean;
  parkingAreaNotes?: string;
  outdoorAreaAccess?: boolean;
  outdoorAreaNotes?: string;
  outdoorStorageAccess?: boolean;
  outdoorStorageNotes?: string;
  otherSharedAccess?: boolean;
  otherSharedNotes?: string;
  specificItemsOwnership?: string;
  
  // House Rules - TV Usage (required field - no auto-fill)
  tvUsage: 'anytime' | 'ask' | 'limited' | 'offlimits' | '';
  tvLimitedHours: string;
  
  // House Rules - Music (required field - no auto-fill)
  musicUsage: 'anytime' | 'ask' | 'limited' | 'offlimits' | '';
  musicLimitedHours: string;
  
  // House Rules - Social Activities
  alcoholPolicyChoice: '' | 'not-allowed' | 'moderate' | 'no-restrictions';
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
  
  // House Rules - Chores (required fields - no auto-fill)
  choresList?: Array<any>;
  dishesPolicy: 'rightaway' | 'overnight' | 'nopreference' | '';
  expiredFoodPolicy: 'rightaway' | 'fewdays' | 'nopreference' | '';
  
  // Custom Section - Combined and individual for compatibility
  customAgreements: string;
  combinedAgreements: string;
  
  // Additional Information - kept for backwards compatibility but will be merged
  specialConditions: string;
  additionalNotes: string;
}

interface FillableAgreementFormProps {
  title?: string;
  description?: string;
  onFormSubmit?: (data: AgreementFormData) => void;
  onValidationChange?: (isValid: boolean) => void;
  homeownerData?: {
    user: any;
    homeownerProfile: any;
    listings: any[];
  } | null;
  currentUser?: any;
  prePopulatedData?: Partial<AgreementFormData>;
  readOnlyFields?: string[];
}

export function FillableAgreementForm({ 
  title = "Fill Golden HomeShare Agreement",
  description = "Complete the form below to generate your personalized agreement",
  onFormSubmit,
  onValidationChange,
  homeownerData,
  currentUser,
  prePopulatedData,
  readOnlyFields = []
}: FillableAgreementFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [signature, setSignature] = useState("");
  const [showSigningSection, setShowSigningSection] = useState(false);

  // Helper function to parse lifestyle data from homeowner profile
  const parseLifestyleData = (lifestyle: any) => {
    if (!lifestyle) return {};
    try {
      return typeof lifestyle === 'string' ? JSON.parse(lifestyle) : lifestyle;
    } catch {
      return {};
    }
  };

  // Helper function to extract text content from TipTap/ProseMirror JSON
  const extractTextFromTipTap = (tipTapJson: any): string => {
    if (!tipTapJson || typeof tipTapJson === 'string') {
      return tipTapJson || '';
    }

    let text = '';
    
    const extractText = (node: any) => {
      if (node.type === 'text') {
        text += node.text || '';
      } else if (node.content && Array.isArray(node.content)) {
        node.content.forEach(extractText);
      }
      
      // Add space or line break for certain block elements
      if (node.type === 'paragraph' || node.type === 'heading') {
        text += ' ';
      }
    };

    try {
      if (tipTapJson.content && Array.isArray(tipTapJson.content)) {
        tipTapJson.content.forEach(extractText);
      } else if (Array.isArray(tipTapJson)) {
        tipTapJson.forEach(extractText);
      } else {
        extractText(tipTapJson);
      }
      
      return text.trim().replace(/\s+/g, ' '); // Clean up extra whitespace
    } catch (error) {
      console.warn('Failed to extract text from TipTap JSON:', error);
      return '';
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
          if (ruleValue === 'yes') {
            formUpdates.petsAllowed = true;
            formUpdates.petOtherParameters = 'Pets are welcome';
          } else if (ruleValue === 'discussionRequired') {
            formUpdates.petsAllowed = true;
            formUpdates.petOtherParameters = 'Pet approval required - must discuss with homeowner';
          } else if (ruleValue === 'no') {
            formUpdates.petsAllowed = false;
            formUpdates.petOtherParameters = 'No pets allowed on the property';
          } else {
            // Handle other specific pet policies
            formUpdates.petsAllowed = true;
            formUpdates.petOtherParameters = ruleValue || 'See homeowner for pet guidelines';
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
              formUpdates.quietHoursDays = 'Daily';
            } else {
              // If it's just a time range without AM/PM, assume it's already in 24-hour format
              const simpleMatch = ruleValue.match(/(\d{1,2}:\d{2})\s*-\s*(\d{1,2}:\d{2})/);
              if (simpleMatch) {
                formUpdates.quietHoursFrom = simpleMatch[1];
                formUpdates.quietHoursTo = simpleMatch[2];
                formUpdates.quietHoursDays = 'Daily';
              }
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
      const smokingPolicy = profileLifestyle.smokingPolicy;
      if (smokingPolicy === 'no-smoking') {
        formUpdates.smokingAllowed = false;
        formUpdates.smokingParameters = 'No smoking allowed anywhere on the property';
      } else if (smokingPolicy === 'outdoor-only') {
        formUpdates.smokingAllowed = true;
        formUpdates.smokingParameters = 'Outdoor smoking only - no smoking inside the house';
      } else if (smokingPolicy === 'designated-areas') {
        formUpdates.smokingAllowed = true;
        formUpdates.smokingParameters = 'Smoking allowed in designated areas only';
      } else if (smokingPolicy === 'smoking-allowed') {
        formUpdates.smokingAllowed = true;
        formUpdates.smokingParameters = 'Smoking allowed both indoors and outdoors';
      } else {
        formUpdates.smokingAllowed = smokingPolicy !== 'no-smoking';
        formUpdates.smokingParameters = smokingPolicy.replace(/-/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase());
      }
    }

    if (profileLifestyle.guestPolicy) {
      const guestPolicy = profileLifestyle.guestPolicy;
      if (guestPolicy === 'no-guests') {
        formUpdates.guestsAllowed = false;
        formUpdates.guestDaysOccasions = 'No guests allowed';
        formUpdates.guestOtherParameters = 'No visitors permitted on the property';
      } else if (guestPolicy === 'dayNightApproval') {
        formUpdates.guestsAllowed = true;
        formUpdates.guestDaysOccasions = 'Day and night guests welcome with prior approval';
        formUpdates.guestOtherParameters = 'Must get homeowner approval before inviting guests';
      } else if (guestPolicy === 'dayOnly') {
        formUpdates.guestsAllowed = true;
        formUpdates.guestDaysOccasions = 'Day guests only - no overnight stays';
        formUpdates.guestOtherParameters = 'Guests must leave by evening, no overnight visitors';
      } else if (guestPolicy === 'always-welcome') {
        formUpdates.guestsAllowed = true;
        formUpdates.guestDaysOccasions = 'Guests always welcome with advance notice';
        formUpdates.guestOtherParameters = 'Please provide reasonable advance notice for guests';
      } else if (guestPolicy === 'occasional') {
        formUpdates.guestsAllowed = true;
        formUpdates.guestDaysOccasions = 'Occasional guests with advance notice';
        formUpdates.guestOtherParameters = 'Limit guest visits to occasional basis with prior notice';
      } else if (guestPolicy === 'rare') {
        formUpdates.guestsAllowed = true;
        formUpdates.guestDaysOccasions = 'Rare guests only with approval';
        formUpdates.guestOtherParameters = 'Very limited guest visits, approval required';
      } else if (guestPolicy === 'weekends-only') {
        formUpdates.guestsAllowed = true;
        formUpdates.guestDaysOccasions = 'Weekend guests only';
        formUpdates.guestOtherParameters = 'Guests only permitted on weekends';
      } else {
        formUpdates.guestsAllowed = true;
        formUpdates.guestDaysOccasions = guestPolicy.replace(/-/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase());
        formUpdates.guestOtherParameters = 'See homeowner for specific guest guidelines';
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

  // Helper function to get smoking policy dropdown value from parameters
  const getSmokingPolicyValue = (): string => {
    if (!formData.smokingAllowed) return 'no-smoking';
    if (formData.smokingParameters.includes('Outdoor smoking only')) return 'outdoor-only';
    if (formData.smokingParameters.includes('both indoors and outdoors')) return 'smoking-allowed';
    return 'outdoor-only'; // default fallback
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
      
      // House Rules - TV Usage (required field - no auto-fill)
      tvUsage: '',
      tvLimitedHours: "",
      
      // House Rules - Music (required field - no auto-fill)
      musicUsage: '',
      musicLimitedHours: "",
      
      // House Rules - Social Activities
      alcoholPolicyChoice: '',
      alcoholAllowed: false,
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
      guestsAllowed: false,
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
      disagreementsEmail: true,
      disagreementsOther: false,
      disagreementsOtherMethod: "",
      
      // Support Services Requested
      supportRequested: [],
      
      // House Rules - Chores (required fields - no auto-fill)
      dishesPolicy: '',
      expiredFoodPolicy: '',
      
      // Custom Section - Combined and individual for compatibility
      customAgreements: "",
      combinedAgreements: "",
      
      // Additional Information - kept for backwards compatibility but will be merged
      specialConditions: "",
      additionalNotes: "",
      
      // Area Access Properties
      bedroomAAccess: true,
      kitchenAccess: true,
      livingAreaAccess: true,
      diningAreaAccess: true,
      laundryAreaAccess: true,
      indoorStorageAccess: false,
      parkingAreaAccess: false,
      outdoorAreaAccess: true,
      outdoorStorageAccess: false,
      otherSharedAccess: false,
      bedroomANotes: "",
      bedroomBNotes: "",
      otherAreasNotes: "",
      livingAreaNotes: "",
      kitchenNotes: "",
      diningAreaNotes: "",
      laundryAreaNotes: "",
      indoorStorageNotes: "",
      parkingAreaNotes: "",
      outdoorAreaNotes: "",
      outdoorStorageNotes: "",
      otherSharedNotes: "",
      specificItemsOwnership: ""
    };

    // Auto-populate from homeowner data if no prePopulatedData is provided
    if (homeownerData && !prePopulatedData) {
      const { user, homeownerProfile, listings } = homeownerData;
      
      // Auto-populate host info
      if (user) {
        defaultData.hostName = `${user.firstName || ''} ${user.lastName || ''}`.trim();
        defaultData.hostEmail = user.email || '';
      }
      
      if (homeownerProfile) {
        defaultData.hostPhone = homeownerProfile.phone || '';
        defaultData.hostAddress = homeownerProfile.address || '';
      }
      
      // Auto-populate from listings
      if (listings && listings.length > 0) {
        const firstListing = listings[0];
        if (firstListing.address) {
          defaultData.propertyAddress = firstListing.address;
        }
        if (firstListing.price) {
          defaultData.monthlyAmount = firstListing.price.toString();
          defaultData.securityDeposit = firstListing.price.toString(); // Default to same as monthly
        }
        if (firstListing.description) {
          defaultData.roomDescription = extractTextFromTipTap(firstListing.description);
        }
      }
      
      // Parse homeowner lifestyle data
      const lifestyleData = parseLifestyleData(homeownerProfile?.lifestyle);
      
      // Consolidate house rules from all listings
      const allHouseRules = extractHouseRulesFromListings(listings);
      const houseRuleUpdates = mapHouseRulesToFormData(allHouseRules, lifestyleData);
      
      // Extract support tasks from listings
      const supportTasks = extractSupportTasksFromListings(listings);
      defaultData.supportRequested = supportTasks;
      
      // Apply house rule updates
      Object.assign(defaultData, houseRuleUpdates);
    }

    // Merge with prePopulatedData if provided (this takes priority)
    if (prePopulatedData) {
      Object.assign(defaultData, prePopulatedData);
    }

    return defaultData;
  };

  const [formData, setFormData] = useState<AgreementFormData>(getInitialFormData());

  // Helper function to check if a field is read-only
  const isReadOnlyField = (fieldName: string): boolean => {
    return readOnlyFields.includes(fieldName);
  };

  const handleInputChange = (field: keyof AgreementFormData, value: string) => {
    // Prevent changes to read-only fields
    if (isReadOnlyField(field)) {
      return;
    }
    
    // If updating the combined field, also update individual fields for compatibility
    if (field === 'combinedAgreements') {
      setFormData(prev => ({
        ...prev,
        [field]: value,
        customAgreements: value, // Keep for API compatibility
        specialConditions: '', // Clear individual fields since we're using combined
        additionalNotes: ''
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const handleCheckboxChange = (field: keyof AgreementFormData, checked: boolean) => {
    // Prevent changes to read-only fields
    if (isReadOnlyField(field)) {
      return;
    }
    
    setFormData(prev => ({
      ...prev,
      [field]: checked
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
    
    // Validate required media usage selections
    if (!formData.tvUsage) {
      toast.error("Please select a TV usage policy");
      return false;
    }
    
    if (!formData.musicUsage) {
      toast.error("Please select a music usage policy");
      return false;
    }

    if (!formData.alcoholPolicyChoice) {
      toast.error("Please select an Alcohol Policy");
      return false;
    }

    // Validate required kitchen and food rules
    if (!formData.dishesPolicy) {
      toast.error("Please select a dishes policy");
      return false;
    }

    if (!formData.expiredFoodPolicy) {
      toast.error("Please select an expired food policy");
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

  const handleCreateAndSign = async () => {
    if (!validateForm()) return;

    if (!signature.trim()) {
      toast.error("Please enter your full name to sign the agreement");
      return;
    }

    setIsLoading(true);
    try {
      // First submit the form data
      if (onFormSubmit) {
        await onFormSubmit(formData);
      }

      // Show success message
      toast.success("Agreement created and signed successfully! The housemate will be notified to review and complete payment.", {
        duration: 6000,
      });
      
    } catch (error) {
      console.error("Error creating and signing agreement:", error);
      toast.error("Failed to create and sign agreement. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleShowSigningSection = () => {
    if (!validateForm()) return;
    setShowSigningSection(true);
  };

  useEffect(() => {
    if (onValidationChange) {
      onValidationChange(validateForm());
    }
  }, [formData, onValidationChange]);

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
      {homeownerData && homeownerData.listings.length > 0 && !prePopulatedData && (
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
              <Label htmlFor="listingSelect" className="text-base font-semibold text-stone-900">
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
                        extractTextFromTipTap(selectedListing.description) : prev.roomDescription
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
                <SelectTrigger className="w-full h-auto min-h-[60px] p-4">
                  <SelectValue placeholder="Choose a property listing..." />
                </SelectTrigger>
                <SelectContent>
                  {homeownerData.listings.map((listing) => (
                    <SelectItem 
                      key={listing.id} 
                      value={listing.address || listing.id} 
                      className="p-4 h-auto [&>span:first-child]:hidden"
                    >
                      <div className="w-full space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="font-semibold text-stone-900 text-base">{listing.name}</div>
                          <div className="flex items-center gap-2">
                            {listing.price && (
                              <span className="text-sm px-3 py-1 bg-green-100 text-green-700 rounded-full font-medium">
                                ${listing.price}/month
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="text-sm text-stone-600 leading-relaxed">{listing.address}</div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Main Form */}
      <Card className="shadow-lg border-0">
        <CardContent className="p-8 space-y-8">
          
          {/* SECTION 1: AUTO-POPULATED DATA */}
          <div className="bg-stone-50 border-2 border-stone-200 rounded-lg p-6">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-6 h-6 bg-stone-600 rounded-sm flex items-center justify-center">
                <User className="h-4 w-4 text-white" />
              </div>
              <h2 className="text-xl font-bold text-stone-900">Auto-Populated Information</h2>
            </div>
            <p className="text-sm text-stone-700 mb-6">
              The following information has been automatically populated from your profile and listing data. You can modify any of these fields as needed.
            </p>

            {/* Host Information */}
            <div className="space-y-4 mb-6">
              <div className="flex items-center gap-2 mb-3">
                <User className="h-5 w-5 text-stone-600" />
                <h3 className="text-lg font-semibold text-stone-900">Host Information</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="hostName">
                    Full Name *
                    {isReadOnlyField('hostName') && (
                      <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">Auto-filled</span>
                    )}
                  </Label>
                  <Input
                    id="hostName"
                    value={formData.hostName}
                    onChange={(e) => handleInputChange('hostName', e.target.value)}
                    placeholder="John Doe"
                    className={`${isReadOnlyField('hostName') ? 'bg-gray-100 border-gray-300 text-gray-600' : 'bg-white'}`}
                    readOnly={isReadOnlyField('hostName')}
                    disabled={isReadOnlyField('hostName')}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="hostEmail">
                    Email Address *
                    {isReadOnlyField('hostEmail') && (
                      <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">Auto-filled</span>
                    )}
                  </Label>
                  <Input
                    id="hostEmail"
                    type="email"
                    value={formData.hostEmail}
                    onChange={(e) => handleInputChange('hostEmail', e.target.value)}
                    placeholder="host@example.com"
                    className={`${isReadOnlyField('hostEmail') ? 'bg-gray-100 border-gray-300 text-gray-600' : 'bg-white'}`}
                    readOnly={isReadOnlyField('hostEmail')}
                    disabled={isReadOnlyField('hostEmail')}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="hostPhone">Phone Number</Label>
                  <Input
                    id="hostPhone"
                    value={formData.hostPhone}
                    onChange={(e) => handleInputChange('hostPhone', e.target.value)}
                    placeholder="(555) 123-4567"
                    className="bg-white"
                  />
                </div>
              </div>
            </div>

            <Separator className="bg-stone-200" />

            {/* Property Information */}
            <div className="space-y-4 my-6">
              <div className="flex items-center gap-2 mb-3">
                <Home className="h-5 w-5 text-stone-600" />
                <h3 className="text-lg font-semibold text-stone-900">Property Information</h3>
              </div>
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="propertyAddress">
                    Property Address *
                    {isReadOnlyField('propertyAddress') && (
                      <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">Auto-filled</span>
                    )}
                  </Label>
                  <Input
                    id="propertyAddress"
                    value={formData.propertyAddress}
                    onChange={(e) => handleInputChange('propertyAddress', e.target.value)}
                    placeholder="456 Oak Street, City, State 12345"
                    className={`${isReadOnlyField('propertyAddress') ? 'bg-gray-100 border-gray-300 text-gray-600' : 'bg-white'}`}
                    readOnly={isReadOnlyField('propertyAddress')}
                    disabled={isReadOnlyField('propertyAddress')}
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
                    className="bg-white"
                  />
                </div>
              </div>
            </div>

            <Separator className="bg-stone-200" />

            {/* Monthly Fee */}
            <div className="space-y-4 my-6">
              <div className="flex items-center gap-2 mb-3">
                <DollarSign className="h-5 w-5 text-stone-600" />
                <h3 className="text-lg font-semibold text-stone-900">Monthly Fee</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="monthlyAmount">
                    Monthly License Fee *
                    {isReadOnlyField('monthlyAmount') && (
                      <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">Auto-filled</span>
                    )}
                  </Label>
                  <Input
                    id="monthlyAmount"
                    value={formData.monthlyAmount}
                    onChange={(e) => handleInputChange('monthlyAmount', e.target.value)}
                    placeholder="800"
                    type="number"
                    className={`${isReadOnlyField('monthlyAmount') ? 'bg-gray-100 border-gray-300 text-gray-600' : 'bg-white'}`}
                    readOnly={isReadOnlyField('monthlyAmount')}
                    disabled={isReadOnlyField('monthlyAmount')}
                  />
                </div>
              </div>
            </div>

            {/* Support Expected */}
            <div className="space-y-4 my-6">
              <div className="flex items-center gap-2 mb-3">
                <Settings className="h-5 w-5 text-stone-600" />
                <h3 className="text-lg font-semibold text-stone-900">Support Expected</h3>
              </div>
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-4">
                <p className="text-sm text-amber-800">
                  <strong>Note:</strong> This support is in addition to typical expectations of keeping shared areas tidy and picking up after oneself.
                </p>
              </div>
              
              {formData.supportRequested.length > 0 && (
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Services from Profile:</Label>
                  <div className="grid gap-2">
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
                  </div>
                </div>
              )}
            </div>

            <Separator className="bg-stone-200" />

            {/* House Rules Auto-populated */}
            <div className="space-y-6">
              <div className="flex items-center gap-2 mb-3">
                <Settings className="h-5 w-5 text-stone-600" />
                <h3 className="text-lg font-semibold">House Rules from Profile</h3>
              </div>

              {homeownerData && (
                <div className="p-3 bg-stone-100 border border-stone-200 rounded-lg">
                  <p className="text-sm text-stone-700">
                    The following rules have been pre-filled based on your homeowner profile and selected listing's house rules.
                  </p>
                </div>
              )}

              <div className="space-y-4">
                {/* Smoking Policy Card */}
                <div className="p-4 border-2 border-stone-300 bg-stone-50 rounded-lg">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-stone-100 flex items-center justify-center">
                      <Settings className="w-5 h-5 text-stone-600" />
                    </div>
                    <div>
                      <Label className="text-base font-medium">
                        Smoking Policy
                      </Label>
                      <p className="text-xs text-gray-600">Smoking rules for the property</p>
                    </div>
                  </div>
                  <Select 
                    value={getSmokingPolicyValue()} 
                    onValueChange={(value) => {
                      const isAllowed = value !== 'no-smoking';
                      handleCheckboxChange('smokingAllowed', isAllowed);
                      if (value === 'no-smoking') {
                        handleInputChange('smokingParameters', 'No smoking allowed anywhere on the property');
                      } else if (value === 'outdoor-only') {
                        handleInputChange('smokingParameters', 'Outdoor smoking only - no smoking inside the house');
                      } else if (value === 'smoking-allowed') {
                        handleInputChange('smokingParameters', 'Smoking allowed both indoors and outdoors');
                      }
                    }}
                  >
                    <SelectTrigger className="bg-white">
                      <SelectValue placeholder="Choose smoking policy..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="no-smoking">No Smoking</SelectItem>
                      <SelectItem value="outdoor-only">Outdoor Only</SelectItem>
                      <SelectItem value="smoking-allowed">Smoking Allowed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Quiet Hours Card */}
                <div className="p-4 border-2 border-stone-300 bg-stone-50 rounded-lg">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-stone-100 flex items-center justify-center">
                      <Clock className="w-5 h-5 text-stone-600" />
                    </div>
                    <div>
                      <Label className="text-base font-medium">Quiet Hours</Label>
                      <p className="text-xs text-gray-600">Designated quiet times in the home</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label className="text-sm">From</Label>
                      <Input
                        type="time"
                        value={formData.quietHoursFrom}
                        onChange={(e) => handleInputChange('quietHoursFrom', e.target.value)}
                        className="text-sm bg-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm">To</Label>
                      <Input
                        type="time"
                        value={formData.quietHoursTo}
                        onChange={(e) => handleInputChange('quietHoursTo', e.target.value)}
                        className="text-sm bg-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm">Days/Occasions</Label>
                      <Input
                        placeholder="Daily, weekends, etc."
                        value={formData.quietHoursDays}
                        onChange={(e) => handleInputChange('quietHoursDays', e.target.value)}
                        className="text-sm bg-white"
                      />
                    </div>
                  </div>
                </div>

                {/* Pets Card */}
                <div className="p-4 border-2 border-stone-300 bg-stone-50 rounded-lg">
                  <div className="flex items-start gap-3 mb-3">
                    <input
                      type="checkbox"
                      id="petsAllowed"
                      checked={formData.petsAllowed}
                      onChange={(e) => handleCheckboxChange('petsAllowed', e.target.checked)}
                      className="mt-1 w-4 h-4 text-stone-600 border-gray-300 rounded focus:ring-stone-500"
                    />
                    <div className="flex-1">
                      <Label htmlFor="petsAllowed" className="text-base font-medium cursor-pointer">
                        Pets Allowed
                      </Label>
                      <p className="text-xs text-gray-600 mt-1">
                        Allow pets on the property
                      </p>
                    </div>
                  </div>
                  {formData.petsAllowed && (
                    <div className="space-y-3 ml-7">
                      <div className="space-y-2">
                        <Label className="text-sm">Species/Breed Restrictions</Label>
                        <Input
                          placeholder="Dogs only, no cats, etc."
                          value={formData.petSpeciesRestrictions}
                          onChange={(e) => handleInputChange('petSpeciesRestrictions', e.target.value)}
                          className="text-sm bg-white"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm">Other Pet Parameters</Label>
                        <Input
                          placeholder="Size limits, registration required, etc."
                          value={formData.petOtherParameters}
                          onChange={(e) => handleInputChange('petOtherParameters', e.target.value)}
                          className="text-sm bg-white"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Guests Card */}
                <div className="p-4 border-2 border-stone-300 bg-stone-50 rounded-lg">
                  <div className="flex items-start gap-3 mb-3">
                    <input
                      type="checkbox"
                      id="guestsAllowed"
                      checked={formData.guestsAllowed}
                      onChange={(e) => handleCheckboxChange('guestsAllowed', e.target.checked)}
                      className="mt-1 w-4 h-4 text-stone-600 border-gray-300 rounded focus:ring-stone-500"
                    />
                    <div className="flex-1">
                      <Label htmlFor="guestsAllowed" className="text-base font-medium cursor-pointer">
                        Guests Allowed
                      </Label>
                      <p className="text-xs text-gray-600 mt-1">
                        Allow visitors and overnight guests
                      </p>
                    </div>
                  </div>
                  {formData.guestsAllowed && (
                    <div className="space-y-3 ml-7">
                      <div className="space-y-2">
                        <Label className="text-sm">Days/Occasions</Label>
                        <Input
                          placeholder="Weekends only, with 24hr notice, etc."
                          value={formData.guestDaysOccasions}
                          onChange={(e) => handleInputChange('guestDaysOccasions', e.target.value)}
                          className="text-sm bg-white"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm">Other Guest Parameters</Label>
                        <Input
                          placeholder="Maximum number, overnight restrictions, etc."
                          value={formData.guestOtherParameters}
                          onChange={(e) => handleInputChange('guestOtherParameters', e.target.value)}
                          className="text-sm bg-white"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* SECTION 2: ADDITIONAL DETAILS TO FILL OUT */}
          <div className="space-y-8">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-6 h-6 bg-blue-600 rounded-sm flex items-center justify-center">
                <FileSignature className="h-4 w-4 text-white" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">Additional Details Required</h2>
            </div>
            <p className="text-sm text-gray-600 mb-6">
              Please complete the following sections to finalize your agreement.
            </p>

            {/* Agreement Dates */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-3">
                <Calendar className="h-5 w-5 text-gray-600" />
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
                  <Label htmlFor="moveInDate">
                    Start Date (Move-in) *
                    {isReadOnlyField('moveInDate') && (
                      <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">Auto-filled</span>
                    )}
                  </Label>
                  <Input
                    id="moveInDate"
                    type="date"
                    value={formData.moveInDate}
                    onChange={(e) => handleInputChange('moveInDate', e.target.value)}
                    className={`${isReadOnlyField('moveInDate') ? 'bg-gray-100 border-gray-300 text-gray-600' : ''}`}
                    readOnly={isReadOnlyField('moveInDate')}
                    disabled={isReadOnlyField('moveInDate')}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endDate">
                    End Date *
                    {isReadOnlyField('endDate') && (
                      <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">Auto-filled</span>
                    )}
                  </Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => handleInputChange('endDate', e.target.value)}
                    className={`${isReadOnlyField('endDate') ? 'bg-gray-100 border-gray-300 text-gray-600' : ''}`}
                    readOnly={isReadOnlyField('endDate')}
                    disabled={isReadOnlyField('endDate')}
                  />
                </div>
              </div>
            </div>

            <Separator />

            {/* Seeker Information */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-3">
                <User className="h-5 w-5 text-gray-600" />
                <h3 className="text-lg font-semibold">Seeker Information</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="seekerName">
                    Full Name *
                    {isReadOnlyField('seekerName') && (
                      <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">Auto-filled</span>
                    )}
                  </Label>
                  <Input
                    id="seekerName"
                    value={formData.seekerName}
                    onChange={(e) => handleInputChange('seekerName', e.target.value)}
                    placeholder="Jane Smith"
                    className={`${isReadOnlyField('seekerName') ? 'bg-gray-100 border-gray-300 text-gray-600' : ''}`}
                    readOnly={isReadOnlyField('seekerName')}
                    disabled={isReadOnlyField('seekerName')}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="seekerEmail">
                    Email Address *
                    {isReadOnlyField('seekerEmail') && (
                      <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">Auto-filled</span>
                    )}
                  </Label>
                  <Input
                    id="seekerEmail"
                    type="email"
                    value={formData.seekerEmail}
                    onChange={(e) => handleInputChange('seekerEmail', e.target.value)}
                    placeholder="seeker@example.com"
                    className={`${isReadOnlyField('seekerEmail') ? 'bg-gray-100 border-gray-300 text-gray-600' : ''}`}
                    readOnly={isReadOnlyField('seekerEmail')}
                    disabled={isReadOnlyField('seekerEmail')}
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

            {/* Financial Terms */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-3">
                <DollarSign className="h-5 w-5 text-gray-600" />
                <h3 className="text-lg font-semibold">Security Deposit</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
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

            {/* Required House Rules */}
            <div className="space-y-6">
              <div className="flex items-center gap-2 mb-3">
                <Settings className="h-5 w-5 text-gray-600" />
                <h3 className="text-lg font-semibold">Required House Rules</h3>
              </div>
              <p className="text-sm text-gray-600 mb-4">
                The following rules require your specific selection to ensure clear expectations for your arrangement.
              </p>

              <div className="space-y-4">
                {/* TV Usage Card */}
                <div className="p-4 border-2 border-gray-300 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                      <Settings className="w-5 h-5 text-gray-600" />
                    </div>
                    <div>
                      <Label className="text-base font-medium">
                        TV Usage <span className="text-red-500">*</span>
                      </Label>
                      <p className="text-xs text-gray-600">How to use TVs in shared areas</p>
                    </div>
                  </div>
                  <Select value={formData.tvUsage} onValueChange={(value) => handleInputChange('tvUsage', value as string)}>
                    <SelectTrigger className="bg-white">
                      <SelectValue placeholder="Choose a TV usage policy..." />
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
                      className="text-sm bg-white mt-3"
                    />
                  )}
                </div>

                {/* Music Usage Card */}
                <div className="p-4 border-2 border-gray-300 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                      <Settings className="w-5 h-5 text-gray-600" />
                    </div>
                    <div>
                      <Label className="text-base font-medium">
                        Music Usage <span className="text-red-500">*</span>
                      </Label>
                      <p className="text-xs text-gray-600">How to play music in shared areas</p>
                    </div>
                  </div>
                  <Select value={formData.musicUsage} onValueChange={(value) => handleInputChange('musicUsage', value as string)}>
                    <SelectTrigger className="bg-white">
                      <SelectValue placeholder="Choose a music usage policy..." />
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
                      className="text-sm bg-white mt-3"
                    />
                  )}
                </div>

                {/* Dishes Policy Card */}
                <div className="p-4 border-2 border-gray-300 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                      <Home className="w-5 h-5 text-gray-600" />
                    </div>
                    <div>
                      <Label className="text-base font-medium">
                        Dishes Policy <span className="text-red-500">*</span>
                      </Label>
                      <p className="text-xs text-gray-600">When should dishes be washed</p>
                    </div>
                  </div>
                  <Select value={formData.dishesPolicy} onValueChange={(value) => handleInputChange('dishesPolicy', value as string)}>
                    <SelectTrigger className="bg-white">
                      <SelectValue placeholder="Choose dishes policy..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="rightaway">Clean immediately after use</SelectItem>
                      <SelectItem value="overnight">Clean within 24 hours</SelectItem>
                      <SelectItem value="nopreference">No specific preference</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Food Policy Card */}
                <div className="p-4 border-2 border-gray-300 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                      <Home className="w-5 h-5 text-gray-600" />
                    </div>
                    <div>
                      <Label className="text-base font-medium">
                        Expired Food Policy <span className="text-red-500">*</span>
                      </Label>
                      <p className="text-xs text-gray-600">When to remove expired food</p>
                    </div>
                  </div>
                  <Select value={formData.expiredFoodPolicy} onValueChange={(value) => handleInputChange('expiredFoodPolicy', value as string)}>
                    <SelectTrigger className="bg-white">
                      <SelectValue placeholder="Choose expired food policy..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="rightaway">Remove immediately when noticed</SelectItem>
                      <SelectItem value="fewdays">Remove within a few days</SelectItem>
                      <SelectItem value="nopreference">No specific preference</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Alcohol Policy Card - Moved to Required */}
                <div className="p-4 border-2 border-gray-300 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                      <Settings className="w-5 h-5 text-gray-600" />
                    </div>
                    <div>
                      <Label className="text-base font-medium">
                        Alcohol Policy <span className="text-red-500">*</span>
                      </Label>
                      <p className="text-xs text-gray-600">Alcohol consumption rules for shared areas</p>
                    </div>
                  </div>
                  <Select
                    value={formData.alcoholPolicyChoice}
                    onValueChange={(value) => {
                      const isAllowed = value !== 'not-allowed';
                      setFormData(prev => ({
                        ...prev,
                        alcoholPolicyChoice: value as '' | 'not-allowed' | 'moderate' | 'no-restrictions',
                        alcoholAllowed: isAllowed,
                        alcoholParameters:
                          value === 'not-allowed' ? 'No alcohol consumption allowed on the property' :
                          value === 'moderate' ? 'Moderate alcohol consumption allowed in shared areas' :
                          value === 'no-restrictions' ? 'No restrictions on alcohol consumption' :
                          '' // Default case, should ideally not be reached if choices are enforced
                      }));
                    }}
                  >
                    <SelectTrigger className="bg-white">
                      <SelectValue placeholder="Choose alcohol policy..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="not-allowed">No alcohol allowed</SelectItem>
                      <SelectItem value="moderate">Moderate drinking allowed</SelectItem>
                      <SelectItem value="no-restrictions">No restrictions</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

              </div>
            </div>

            <Separator />

            {/* Custom Agreements */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-3">
                <FileSignature className="h-5 w-5 text-gray-600" />
                <h3 className="text-lg font-semibold">Custom Agreements & Additional Information</h3>
              </div>
              <div className="space-y-2">
                <Label htmlFor="combinedAgreements">Additional Agreements, Special Conditions & Notes</Label>
                <Textarea
                  id="combinedAgreements"
                  value={formData.combinedAgreements || formData.customAgreements}
                  onChange={(e) => handleInputChange('combinedAgreements', e.target.value)}
                  placeholder="Include any additional custom agreements, special conditions, requirements, or other important information for this arrangement..."
                  rows={8}
                />
                <p className="text-xs text-gray-500">
                  This section can include custom agreements between parties, special conditions or requirements, and any other important notes or information.
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            {!showSigningSection ? (
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
                  onClick={handleShowSigningSection}
                  disabled={isLoading}
                  className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
                >
                  <FileSignature className="h-4 w-4" />
                  Create & Sign Agreement
                </Button>
              </div>
            ) : (
              <div className="space-y-6 pt-6">
                {/* E-Signature Section */}
                <div className="border-2 border-green-200 bg-green-50 rounded-lg p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                      <FileSignature className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-green-800">Sign Agreement</h3>
                      <p className="text-green-700">Complete your electronic signature to finalize the agreement</p>
                    </div>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                    <p className="text-blue-800 font-medium mb-2">Ready to Sign</p>
                    <p className="text-blue-700 text-sm">
                      By signing this agreement, you confirm that all information is accurate and you agree to the terms. 
                      The housemate will be notified to review the agreement and complete their payment.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="signature" className="text-base font-medium">
                        Electronic Signature *
                      </Label>
                      <Input
                        id="signature"
                        value={signature}
                        onChange={(e) => setSignature(e.target.value)}
                        placeholder="Type your full name"
                        className="text-lg mt-2"
                      />
                      <p className="text-sm text-gray-500 mt-1">
                        By typing your name, you agree to electronically sign this document
                      </p>
                    </div>

                    <div className="flex gap-3 pt-4">
                      <Button
                        onClick={() => setShowSigningSection(false)}
                        variant="outline"
                        disabled={isLoading}
                        className="flex items-center gap-2"
                      >
                        Back to Review
                      </Button>
                      
                      <Button
                        onClick={handleCreateAndSign}
                        disabled={isLoading || !signature.trim()}
                        className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
                        size="lg"
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin mr-2" />
                            Signing Agreement...
                          </>
                        ) : (
                          <>
                            <FileSignature className="h-4 w-4 mr-2" />
                            Sign & Complete Agreement
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="text-xs text-muted-foreground border-t pt-4">
              <p>* Required fields. By generating this agreement, both parties acknowledge they have read and agree to the terms and conditions of the Golden HomeShare Limited License Agreement.</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 