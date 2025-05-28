"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";

// Step Components
import { ListingTypeStep } from "./steps/ListingTypeStep";
import { BasicInfoStep } from "./steps/BasicInfoStep";
import { AddressStep } from "./steps/AddressStep";
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
  
  // Address
  address: string;
  
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
  { title: "Listing Type", component: "listingType" },
  { title: "Basic Info", component: "basicInfo" },
  { title: "Location", component: "address" },
  { title: "Pricing", component: "pricing" },
  { title: "Amenities", component: "amenities" },
  { title: "Support", component: "support" },
  { title: "House Rules", component: "houseRules" },
  { title: "Photos", component: "photos" },
  { title: "Description", component: "description" },
  { title: "Review", component: "review" },
];

export function ListingWizard({ userId, firstName, lastName, email }: ListingWizardProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<WizardFormData>({
    title: "",
    category: "",
    smallDescription: "",
    address: "",
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

  const canProceed = (step: number): boolean => {
    switch (step) {
      case 0: // Listing Type
        return !!formData.category;
      case 1: // Basic Info
        return !!formData.title.trim() && !!formData.smallDescription.trim();
      case 2: // Address
        return !!formData.address.trim();
      case 3: // Pricing
        return formData.price > 0;
      case 4: // Amenities
        return true; // Optional
      case 5: // Support
        return true; // Optional
      case 6: // House Rules
        return true; // Optional
      case 7: // Photos
        return formData.images.length > 0;
      case 8: // Description
        return !!formData.description.trim();
      case 9: // Review
        return true;
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (currentStep < STEPS.length - 1 && canProceed(currentStep)) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleSubmit = async () => {
    if (!canProceed(currentStep)) {
      toast.error("Please complete all required fields");
      return;
    }

    setIsSubmitting(true);

    try {
      const submitFormData = new FormData();
      submitFormData.append("name", formData.title);
      submitFormData.append("category", formData.category);
      submitFormData.append("price", formData.price.toString());
      submitFormData.append("smallDescription", formData.smallDescription);
      submitFormData.append("address", formData.address);
      submitFormData.append("description", formData.description);
      submitFormData.append("images", JSON.stringify(formData.images));
      submitFormData.append("amenities", JSON.stringify(formData.selectedAmenities));
      submitFormData.append("supportRequested", JSON.stringify(formData.supportRequested));
      submitFormData.append("houseRules", JSON.stringify(formData.houseRules));
      submitFormData.append("productFile", ""); // Not used in this wizard

      // Import and call the action
      const { SellProduct } = await import("@/app/actions");
      const result = await SellProduct(null, submitFormData);

      if (result && result.status === "error") {
        toast.error(result.message || "Failed to create listing");
      } else {
        toast.success("Listing created successfully!");
        // Redirect will be handled by the action
      }
    } catch (error) {
      console.error("Error creating listing:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStep = () => {
    const stepComponent = STEPS[currentStep].component;
    
    switch (stepComponent) {
      case "listingType":
        return <ListingTypeStep formData={formData} updateFormData={updateFormData} />;
      case "basicInfo":
        return <BasicInfoStep formData={formData} updateFormData={updateFormData} />;
      case "address":
        return <AddressStep formData={formData} updateFormData={updateFormData} />;
      case "pricing":
        return <PricingStep formData={formData} updateFormData={updateFormData} />;
      case "amenities":
        return <AmenitiesStep formData={formData} updateFormData={updateFormData} />;
      case "support":
        return <SupportStep formData={formData} updateFormData={updateFormData} />;
      case "houseRules":
        return <HouseRulesStep formData={formData} updateFormData={updateFormData} />;
      case "photos":
        return <PhotosStep formData={formData} updateFormData={updateFormData} />;
      case "description":
        return <DescriptionStep formData={formData} updateFormData={updateFormData} />;
      case "review":
        return <ReviewStep formData={formData} firstName={firstName} lastName={lastName} email={email} />;
      default:
        return null;
    }
  };

  const progressPercentage = ((currentStep + 1) / STEPS.length) * 100;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-semibold text-gray-900">Create Your Listing</h1>
              <p className="text-sm text-gray-600 mt-1">
                Step {currentStep + 1} of {STEPS.length}: {STEPS[currentStep].title}
              </p>
            </div>
            <Button
              variant="outline"
              onClick={() => router.push("/sell")}
              className="text-gray-600 hover:text-gray-800"
            >
              Exit
            </Button>
          </div>
          
          {/* Progress Bar */}
          <div className="mt-4">
            <Progress value={progressPercentage} className="h-2" />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-8">
            {renderStep()}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center mt-8">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 0}
            className="flex items-center gap-2"
          >
            <ChevronLeft size={16} />
            Previous
          </Button>

          <div className="flex items-center gap-2">
            {STEPS.map((_, index) => (
              <div
                key={index}
                className={`w-3 h-3 rounded-full transition-colors ${
                  index === currentStep
                    ? "bg-primary"
                    : index < currentStep
                    ? "bg-primary/60"
                    : "bg-gray-200"
                }`}
              />
            ))}
          </div>

          {currentStep === STEPS.length - 1 ? (
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting || !canProceed(currentStep)}
              className="flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Listing"
              )}
            </Button>
          ) : (
            <Button
              onClick={handleNext}
              disabled={!canProceed(currentStep)}
              className="flex items-center gap-2"
            >
              Next
              <ChevronRight size={16} />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
} 