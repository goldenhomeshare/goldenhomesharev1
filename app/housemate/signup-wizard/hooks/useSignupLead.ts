import { useState, useCallback } from "react";
import { WizardFormData } from "../components/HousemateSignupWizard";

interface UseSignupLeadProps {
  userId?: string;
}

export function useSignupLead({ userId }: UseSignupLeadProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sessionId] = useState(() => {
    // Generate a unique session ID for anonymous users
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
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
    if (isSubmitting) return;
    
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
        
        // Location
        city: formData.location.city || undefined,
        state: formData.location.state || undefined,
        
        // Budget
        maxBudget: formData.maxBudget ? parseInt(formData.maxBudget) : undefined,
        
        // Profile Picture
        profilePicture: formData.profilePicture || undefined,
        
        // Education & Occupation
        educationLevel: formData.education.level || undefined,
        educationProgram: formData.education.degreeProgram || undefined,
        stillAttending: formData.education.stillAttending || undefined,
        isRetired: formData.occupation.isRetired || undefined,
        occupation: formData.occupation.description || undefined,
        
        // Lifestyle
        schedule: formData.schedule || undefined,
        socialPreference: formData.socialPreference || undefined,
        hobbies: formData.hobbies.length > 0 ? formData.hobbies : undefined,
        hasPets: formData.lifestyle.hasPets || undefined,
        petDescription: formData.lifestyle.petDescription || undefined,
        numberOfPeople: formData.lifestyle.numberOfPeople || undefined,
        smokingStatus: formData.lifestyle.smokingStatus || undefined,
        guestPolicy: formData.lifestyle.guestPolicy || undefined,
        
        // Match Preferences
        preferredGender: formData.preferredGender || undefined,
        canHelpWith: formData.canHelpWith.length > 0 ? formData.canHelpWith : undefined,
        
        // Bio
        bio: formData.bio || undefined,
        
        // Tracking
        lastCompletedStep: currentStep,
        sessionId: userId ? undefined : sessionId,
        
        // Campaign metadata
        source: metadata?.source,
        campaign: metadata?.campaign,
        medium: metadata?.medium,
        referrer: metadata?.referrer || (typeof window !== 'undefined' ? document.referrer : undefined),
      };

      const response = await fetch('/api/signup-lead', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(leadData),
      });

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
      setIsSubmitting(false);
    }
  }, [isSubmitting, sessionId, userId]);

  const markCompleted = useCallback(async (formData: WizardFormData) => {
    return saveSignupLead(formData, 10, { source: 'completed' });
  }, [saveSignupLead]);

  return {
    saveSignupLead,
    markCompleted,
    isSubmitting,
    sessionId,
  };
} 