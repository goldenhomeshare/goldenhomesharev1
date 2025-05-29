"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ChevronLeft, ChevronRight, Loader2, CheckCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Step Components
import { BasicInfoStep } from "./steps/BasicInfoStep";
import { ConfirmAddressStep } from "./steps/ConfirmAddressStep";
import { PricingStep } from "./steps/PricingStep";
import { AmenitiesStep } from "./steps/AmenitiesStep";
import { SupportStep } from "./steps/SupportStep";
import { HouseRulesStep } from "./steps/HouseRulesStep";
import { PhotosStep } from "./steps/PhotosStep";
import { DescriptionStep } from "./steps/DescriptionStep";
import { ReviewStep } from "./steps/ReviewStep";

interface ListingWizardProps {
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
}

export interface WizardFormData {
  // Basic Info
  title: string;
  category: string;
  smallDescription: string;
  // Address - Structured
  streetAddress: string;
  aptSuite: string;
  city: string;
  state: string;
  zipCode: string;
  // Pricing
  price: number;
  // Amenities
  selectedAmenities: string[];
  // Support
  supportRequested: Array<{id: string, hoursPerWeek: number}>;
  // House Rules
  houseRules: Array<{id: string, value?: string}>;
  // Photos
  images: string[];
  // Description
  description: string;
}

const STEPS = [
  { id: 1, title: "Basic Info", description: "Title and summary for your listing" },
  { id: 2, title: "Location", description: "Where your property is located" },
  { id: 3, title: "Description", description: "Detailed description" },
  { id: 4, title: "Support", description: "Support options" },
  { id: 5, title: "Amenities", description: "What you offer" },
  { id: 6, title: "House Rules", description: "Rules for your home" },
  { id: 7, title: "Photos", description: "Upload property photos" },
  { id: 8, title: "Pricing", description: "Set your monthly price" },
  { id: 9, title: "Review", description: "Final review before publishing" },
];

export function ListingWizard({ userId, firstName, lastName, email }: ListingWizardProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<WizardFormData>({
    title: "",
    category: "",
    smallDescription: "",
    streetAddress: "",
    aptSuite: "",
    city: "",
    state: "",
    zipCode: "",
    price: 0,
    selectedAmenities: [],
    supportRequested: [],
    houseRules: [],
    images: [],
    description: "",
  });

  const router = useRouter();

  const updateFormData = (data: Partial<WizardFormData>) => {
    setFormData(prev => ({ ...prev, ...data }));
  };

  const nextStep = () => {
    // Explicit validation for pricing step
    if (currentStep === 8 && formData.price < 200) {
      toast.error("Minimum price of $200 required to cover platform fee");
      return;
    }
    
    if (currentStep < STEPS.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Step validation logic
  const isStepValidByNumber = (stepNumber: number) => {
    switch (stepNumber) {
      case 1:
        return formData.title && formData.smallDescription;
      case 2:
        return formData.streetAddress && formData.city && formData.state && formData.zipCode;
      case 3:
        return formData.description.trim().length > 0;
      case 4:
        return true;
      case 5:
        return true;
      case 6:
        return true;
      case 7:
        return formData.images.length > 0;
      case 8:
        return formData.price >= 200;
      case 9:
        return true;
      default:
        return false;
    }
  };

  const getHighestCompletedStep = () => {
    for (let i = 1; i <= STEPS.length; i++) {
      if (!isStepValidByNumber(i)) {
        return i - 1;
      }
    }
    return STEPS.length;
  };

  const canNavigateToStep = (stepNumber: number) => {
    const highestCompleted = getHighestCompletedStep();
    return stepNumber <= Math.max(highestCompleted + 1, currentStep);
  };

  const progress = (currentStep / STEPS.length) * 100;

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <BasicInfoStep formData={formData} updateFormData={updateFormData} />;
      case 2:
        return <ConfirmAddressStep formData={formData} updateFormData={updateFormData} />;
      case 3:
        return <DescriptionStep formData={formData} updateFormData={updateFormData} />;
      case 4:
        return <SupportStep formData={formData} updateFormData={updateFormData} />;
      case 5:
        return <AmenitiesStep formData={formData} updateFormData={updateFormData} />;
      case 6:
        return <HouseRulesStep formData={formData} updateFormData={updateFormData} />;
      case 7:
        return <PhotosStep formData={formData} updateFormData={updateFormData} />;
      case 8:
        return <PricingStep formData={formData} updateFormData={updateFormData} />;
      case 9:
        return <ReviewStep formData={formData} firstName={firstName} lastName={lastName} email={email} />;
      default:
        return null;
    }
  };

  const handleSubmit = async () => {
    if (!isStepValidByNumber(currentStep)) {
      toast.error("Please complete all required fields");
      return;
    }
    setIsSubmitting(true);
    try {
      const submitFormData = new FormData();
      submitFormData.append("name", formData.title);
      submitFormData.append("category", formData.category || "");
      submitFormData.append("price", formData.price.toString());
      submitFormData.append("smallDescription", formData.smallDescription);
      const fullAddress = formData.streetAddress && formData.city && formData.state && formData.zipCode
        ? `${formData.streetAddress}${formData.aptSuite ? `, ${formData.aptSuite}` : ''}, ${formData.city}, ${formData.state} ${formData.zipCode}, United States`
        : "";
      if (!fullAddress) {
        toast.error("Please complete all address fields");
        return;
      }
      submitFormData.append("address", fullAddress);
      submitFormData.append("description", formData.description);
      submitFormData.append("images", JSON.stringify(formData.images));
      submitFormData.append("amenities", JSON.stringify(formData.selectedAmenities));
      submitFormData.append("supportRequested", JSON.stringify(formData.supportRequested));
      submitFormData.append("houseRules", JSON.stringify(formData.houseRules));
      submitFormData.append("productFile", "");
      const { SellProduct } = await import("@/app/actions");
      const result = await SellProduct(null, submitFormData);
      if (result && result.status === "error") {
        toast.error(result.message || "Failed to create listing");
      } else {
        toast.success("Listing created successfully!");
      }
    } catch (error) {
      console.error("Error creating listing:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 py-12">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Your Listing</h1>
          <p className="text-lg text-gray-600 mb-8">
            Step-by-step guidance to help you publish your home
          </p>
          {/* Progress Bar */}
          <div className="max-w-md mx-auto">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-gray-700">Progress</span>
              <span className="text-sm text-gray-500">
                Step {currentStep} of {STEPS.length}
              </span>
            </div>
            <Progress value={progress} className="h-3" />
          </div>
        </div>
        {/* Section Navigation */}
        <div className="mb-10">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <div className="flex flex-wrap gap-3 justify-center">
              {STEPS.map((step) => {
                const canNavigate = canNavigateToStep(step.id);
                const isCompleted = isStepValidByNumber(step.id);
                const isCurrent = currentStep === step.id;
                return (
                  <button
                    key={step.id}
                    type="button"
                    onClick={() => canNavigate && setCurrentStep(step.id)}
                    disabled={!canNavigate}
                    className={`px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
                      isCurrent
                        ? 'bg-primary text-white shadow-md'
                        : isCompleted
                        ? 'text-primary bg-primary/10 hover:bg-primary/20 border border-primary/20'
                        : canNavigate
                        ? 'text-gray-600 hover:text-primary hover:bg-gray-50 border border-gray-200'
                        : 'text-gray-400 bg-gray-50 border border-gray-100 cursor-not-allowed opacity-60'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      {isCompleted && !isCurrent && (
                        <CheckCircle className="w-4 h-4" />
                      )}
                      <span>{step.title}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
        {/* Step Content */}
        <Card className="mb-10 shadow-lg border-0">
          <CardHeader className="bg-gradient-to-r from-primary/5 to-primary/10 border-b border-gray-100 rounded-t-lg">
            <div className="text-center">
              <CardTitle className="text-2xl text-gray-900 mb-2">
                {STEPS[currentStep - 1].title}
              </CardTitle>
              <p className="text-gray-600">{STEPS[currentStep - 1].description}</p>
            </div>
          </CardHeader>
          <CardContent className="p-8 bg-white rounded-b-lg">
            {renderStep()}
          </CardContent>
        </Card>
        {/* Navigation */}
        <div className="w-full flex justify-center gap-4">
          {currentStep === STEPS.length ? (
            <Button
              onClick={handleSubmit}
              disabled={!isStepValidByNumber(currentStep) || isSubmitting}
              className="max-w-md w-full py-8 px-12 text-xl bg-primary hover:bg-primary/90 text-white rounded-3xl shadow-lg font-semibold transition-colors duration-200"
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={24} className="animate-spin mr-3" />
                  Creating Listing...
                </>
              ) : (
                "Create Listing"
              )}
            </Button>
          ) : (
            <Button
              onClick={nextStep}
              disabled={!isStepValidByNumber(currentStep)}
              className="max-w-md w-full py-8 px-12 text-xl bg-primary hover:bg-primary/90 text-white rounded-3xl shadow-lg font-semibold transition-colors duration-200"
            >
              Next
            </Button>
          )}
        </div>
      </div>
    </div>
  );
} 