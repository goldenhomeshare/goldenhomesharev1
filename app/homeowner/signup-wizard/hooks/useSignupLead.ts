import { useState, useCallback, useRef, useEffect } from "react";
import { WizardFormData } from "../components/HomeownerSignupWizard";

interface UseSignupLeadProps {
  userId?: string;
}

export function useSignupLead({ userId }: UseSignupLeadProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isMountedRef = useRef(true);
  const isSubmittingRef = useRef(false);
  
  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);
  const [sessionId] = useState(() => {
    // Generate a unique session ID for anonymous users - only generate once
    if (typeof window !== 'undefined') {
      // Try to get existing sessionId from sessionStorage first
      const existingSessionId = sessionStorage.getItem('homeowner_signup_session');
      if (existingSessionId) {
        return existingSessionId;
      }
    }
    
    const newSessionId = `homeowner_session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('homeowner_signup_session', newSessionId);
    }
    
    return newSessionId;
  });

  const saveSignupLead = useCallback(async (
    formData: WizardFormData, 
    currentStep: number,
    metadata?: {
      source?: string;
      campaign?: string;
      medium?: string;
      referrer?: string;
    }
  ) => {
    if (isSubmittingRef.current) {
      console.log('Already submitting, skipping...');
      return { success: false, error: 'Already submitting' };
    }
    
    isSubmittingRef.current = true;
    setIsSubmitting(true);
    
    try {
      const leadData = {
        // Contact Information
        firstName: formData.firstName || undefined,
        lastName: formData.lastName || undefined,
        email: formData.email || undefined,
        phone: formData.phone || undefined,
        
        // Demographics
        dateOfBirth: formData.dateOfBirth || undefined,
        language: formData.language || undefined,
        gender: formData.gender || undefined,
        
        // Profile Picture
        profilePicture: formData.profilePicture || undefined,
        
        // Lifestyle
        schedule: formData.schedule || undefined,
        socialPreference: formData.socialPreference || undefined,
        hobbies: formData.hobbies.length > 0 ? formData.hobbies : undefined,
        hasPets: formData.lifestyle.hasPets || undefined,
        petDescription: formData.lifestyle.petDescription || undefined,
        numberOfPeople: formData.lifestyle.numberOfPeople || undefined,
        smokingPolicy: formData.lifestyle.smokingPolicy || undefined,
        guestPolicy: formData.lifestyle.guestPolicy || undefined,
        
        // Preferences
        preferredCareerStage: formData.preferredCareerStage || undefined,
        preferredGender: formData.preferredGender || undefined,
        
        // Bio
        bio: formData.bio || undefined,
        
        // Tracking
        lastCompletedStep: currentStep,
        sessionId: userId ? undefined : sessionId,
        userType: 'homeowner', // Identify this as a homeowner lead
        
        // Campaign metadata
        source: metadata?.source,
        campaign: metadata?.campaign,
        medium: metadata?.medium,
        referrer: metadata?.referrer || (typeof window !== 'undefined' ? document.referrer : undefined),
      };

      // Add timeout to prevent hanging requests
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
      
      const response = await fetch('/api/signup-lead', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(leadData),
        signal: controller.signal,
      });
      
      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error('Failed to save signup lead');
      }

      const result = await response.json();
      return result;
      
    } catch (error) {
      console.error('Error saving signup lead:', error);
      // Don't throw error to avoid disrupting user flow
      return { success: false, error };
    } finally {
      isSubmittingRef.current = false;
      if (isMountedRef.current) {
        setIsSubmitting(false);
      }
    }
  }, [sessionId, userId]); // Removed isSubmitting to prevent dependency loop

  const markCompleted = useCallback(async (formData: WizardFormData) => {
    return saveSignupLead(formData, 7, { source: 'completed' }); // 7 steps for homeowner
  }, [saveSignupLead]);

  return {
    saveSignupLead,
    markCompleted,
    isSubmitting,
    sessionId,
  };
} 