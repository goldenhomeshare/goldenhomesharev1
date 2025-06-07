"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User } from "lucide-react";
import { WizardFormData } from "../HousemateSignupWizard";
import { useState, useEffect } from "react";

interface BasicDetailsStepProps {
  formData: WizardFormData;
  updateFormData: (updates: Partial<WizardFormData>) => void;
}

export function BasicDetailsStep({ formData, updateFormData }: BasicDetailsStepProps) {
  const [errors, setErrors] = useState({
    email: "",
    phone: ""
  });

  // Email validation
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      return "Email is required";
    }
    if (!emailRegex.test(email)) {
      return "Please enter a valid email address";
    }
    return "";
  };

  // Phone validation
  const validatePhone = (phone: string) => {
    // Remove all non-numeric characters for validation
    const phoneNumbers = phone.replace(/\D/g, '');
    
    if (!phone) {
      return "Phone number is required";
    }
    if (phoneNumbers.length < 10) {
      return "Please enter a valid 10-digit phone number";
    }
    if (phoneNumbers.length > 11) {
      return "Phone number is too long";
    }
    return "";
  };

  // Format phone number as user types
  const formatPhoneNumber = (value: string) => {
    // Remove all non-numeric characters
    const phoneNumber = value.replace(/\D/g, '');
    
    // Format as (XXX) XXX-XXXX
    if (phoneNumber.length >= 6) {
      return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3, 6)}-${phoneNumber.slice(6, 10)}`;
    } else if (phoneNumber.length >= 3) {
      return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3)}`;
    }
    return phoneNumber;
  };

  const handleFirstNameChange = (value: string) => {
    updateFormData({ firstName: value });
  };

  const handleLastNameChange = (value: string) => {
    updateFormData({ lastName: value });
  };

  const handleEmailChange = (value: string) => {
    updateFormData({ email: value });
    
    // Validate email and set error
    const emailError = validateEmail(value);
    setErrors(prev => ({ ...prev, email: emailError }));
  };

  const handlePhoneChange = (value: string) => {
    // Format the phone number
    const formattedPhone = formatPhoneNumber(value);
    updateFormData({ phone: formattedPhone });
    
    // Validate phone and set error
    const phoneError = validatePhone(formattedPhone);
    setErrors(prev => ({ ...prev, phone: phoneError }));
  };

  // Validate on mount if data exists - only run once
  useEffect(() => {
    if (formData.email) {
      const emailError = validateEmail(formData.email);
      if (emailError) {
        setErrors(prev => ({ ...prev, email: emailError }));
      }
    }
    if (formData.phone) {
      const phoneError = validatePhone(formData.phone);
      if (phoneError) {
        setErrors(prev => ({ ...prev, phone: phoneError }));
      }
    }
  }, []); // Only run on mount

  return (
    <div className="space-y-8">
      <div className="max-w-md mx-auto space-y-6">
        {/* Header */}
        <div className="text-center">
          <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="w-8 h-8 text-green-600" />
          </div>
        </div>

        {/* Form Fields */}
        <div className="space-y-4">
          {/* Name Fields */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="firstName" className="text-base font-medium">
                First Name *
              </Label>
              <Input
                id="firstName"
                type="text"
                placeholder="Your first name"
                value={formData.firstName}
                onChange={(e) => handleFirstNameChange(e.target.value)}
                className="mt-2 h-12 text-lg border-gray-200 rounded-xl focus:border-primary focus:ring-0"
              />
            </div>

            <div>
              <Label htmlFor="lastName" className="text-base font-medium">
                Last Name *
              </Label>
              <Input
                id="lastName"
                type="text"
                placeholder="Your last name"
                value={formData.lastName}
                onChange={(e) => handleLastNameChange(e.target.value)}
                className="mt-2 h-12 text-lg border-gray-200 rounded-xl focus:border-primary focus:ring-0"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <Label htmlFor="email" className="text-base font-medium">
              Email Address *
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="your.email@example.com"
              value={formData.email}
              onChange={(e) => handleEmailChange(e.target.value)}
              className={`mt-2 h-12 text-lg border-gray-200 rounded-xl focus:border-primary focus:ring-0 ${
                errors.email ? 'border-red-300 focus:border-red-500' : ''
              }`}
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">{errors.email}</p>
            )}
          </div>

          {/* Phone Number */}
          <div>
            <Label htmlFor="phone" className="text-base font-medium">
              Phone Number *
            </Label>
            <Input
              id="phone"
              type="tel"
              placeholder="(555) 123-4567"
              value={formData.phone}
              onChange={(e) => handlePhoneChange(e.target.value)}
              className={`mt-2 h-12 text-lg border-gray-200 rounded-xl focus:border-primary focus:ring-0 ${
                errors.phone ? 'border-red-300 focus:border-red-500' : ''
              }`}
            />
            {errors.phone && (
              <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
            )}
          </div>
        </div>

      </div>
    </div>
  );
} 