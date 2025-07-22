import { ProductDescription } from "@/app/components/ProductDescription";
import { HomeownerProfileCard } from "@/app/components/HomeownerProfileCard";
import { ApproximateLocationMap } from "@/app/components/ApproximateLocationMap";
import { ApplicationForm } from "@/app/components/ApplicationForm";
import prisma from "@/app/lib/db";
import { Button } from "@/components/ui/button";
import { unstable_noStore as noStore } from "next/cache";
import { getCurrentUser } from "@/lib/auth";
import ImageGallery from "./ImageGallery";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { JSONContent } from "@tiptap/react";
import Image from "next/image";
import { Bath, Car, Wifi, Utensils, Tv, Snowflake, Sun, Home, DoorOpen, WashingMachine, Armchair, Briefcase, Sparkles, Salad, Flower, ShoppingBag, HeartHandshake, Cat, Wrench, Shield, Clock, VolumeX, Cigarette, CigaretteOff, Wine, GlassWater, Users, UserMinus, FileText } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

// Utility function to extract city from full address (matching card approach)
function getCityFromAddress(fullAddress?: string | null): string {
  if (!fullAddress) return '';
  
  // Split address by commas and trim whitespace
  const parts = fullAddress.split(',').map(part => part.trim()).filter(part => part.length > 0);
  
  // Common US address formats:
  // "123 Main St, Springfield, IL 62701" -> ["123 Main St", "Springfield", "IL 62701"]
  // "Springfield, IL 62701" -> ["Springfield", "IL 62701"]
  
  if (parts.length >= 3) {
    // For format: "Street, City, State ZIP" - city is third from last
    return parts[parts.length - 3];
  } else if (parts.length === 2) {
    // For format: "City, State ZIP" - city is first part
    return parts[0];
  }
  
  // Fallback: return empty string if we can't parse
  return '';
}

const amenityIcons: Record<string, any> = {
  parking: { icon: Car, label: "Parking" },
  wifi: { icon: Wifi, label: "WiFi" },
  kitchen: { icon: Utensils, label: "Kitchen Access" },
  tv: { icon: Tv, label: "TV" },
  ac: { icon: Snowflake, label: "Air Conditioning" },
  heating: { icon: Sun, label: "Heating" },
  privateBathroom: { icon: Bath, label: "Private Bathroom" },
  privateEntrance: { icon: DoorOpen, label: "Private Entrance" },
  laundry: { icon: WashingMachine, label: "Laundry Access" },
  patio: { icon: Home, label: "Patio/Balcony" },
  furnished: { icon: Armchair, label: "Furnished Room" },
  workspace: { icon: Briefcase, label: "Desk/Workspace" },
};

const supportIcons: Record<string, any> = {
  cleaning: { icon: Sparkles, label: "Cleaning" },
  cooking: { icon: Salad, label: "Cooking" },
  gardening: { icon: Flower, label: "Gardening" },
  errands: { icon: ShoppingBag, label: "Errands" },
  companionship: { icon: HeartHandshake, label: "Companionship" },
  petCare: { icon: Cat, label: "Pet Care" },
  techSupport: { icon: Wrench, label: "Tech Support" },
  homeSecurity: { icon: Shield, label: "Home Security" },
};

const houseRulesIcons: Record<string, any> = {
  guestPolicy: { icon: Users, label: "Guest Policy" },
  smokingPolicy: { icon: CigaretteOff, label: "Smoking Policy" },
  petPolicy: { icon: Cat, label: "Pet Policy" },
  quietHours: { icon: Clock, label: "Quiet Hours" },
  additionalRules: { icon: FileText, label: "Additional Rules" },
};

const houseRulesValueLabels: Record<string, Record<string, string>> = {
  guestPolicy: {
    dayNightApproval: "Day and night with approval",
    dayOnly: "Day only",
    no: "No guests allowed",
    "always-welcome": "Guests always welcome with notice",
    "occasional": "Occasional guests with advance notice", 
    "rare": "Rare guests only",
    "no-guests": "No overnight guests"
  },
  smokingPolicy: {
    yes: "Smoking allowed",
    no: "No smoking",
    designatedAreas: "Designated areas only",
    "no-smoking": "No smoking anywhere",
    "outdoor-only": "Outdoor smoking only",
    "smoking-allowed": "Smoking allowed indoors and outdoors"
  },
  petPolicy: {
    yes: "Pets welcome",
    no: "No pets allowed",
    discussionRequired: "Pet approval required"
  }
};

async function getData(id: string) {
  const productData = await prisma.product.findUnique({
    where: {
      id: id,
    },
    select: {
      category: true,
      description: true,
      smallDescription: true,
      name: true,
      images: true,
      price: true,
      address: true,
      createdAt: true,
      id: true,
      User: {
        select: {
          id: true,
          profileImage: true,
          firstName: true,
          lastName: true,
        },
      },
    },
  });

  // Get homeowner profile separately
  let homeownerProfile = null;
  if (productData?.User?.id) {
    const profileResult = await prisma.$queryRaw<[{
      profilePicture: string | null;
      bio: string | null;
      gender: string | null;
      ageRange: string | null;
      schedule: string | null;
      socialPreference: string | null;
      hobbies: any | null;
      socialMedia: any | null;
      preferredGender: string | null;
      preferredCareerStage: string | null;
      lifestyle: any | null;
    }]>`
      SELECT "profilePicture", bio, gender, "ageRange", schedule, "socialPreference", hobbies, "socialMedia",
             "preferredGender", "preferredCareerStage", lifestyle
      FROM "HomeownerProfile" 
      WHERE "userId" = ${productData.User.id}
    `;
    homeownerProfile = profileResult?.[0] || null;
  }
  
  // Get amenities separately with a raw query
  const amenitiesResult = await prisma.$queryRaw<[{amenities: string[]}]>`SELECT amenities FROM "Product" WHERE id = ${id}`;
  const amenities = amenitiesResult?.[0]?.amenities || [];
  
  // Get supportRequested separately with a raw query
  const supportResult = await prisma.$queryRaw<[{supportRequested: string[]}]>`SELECT "supportRequested" FROM "Product" WHERE id = ${id}`;
  const supportRequested = supportResult?.[0]?.supportRequested || [];
  
  // Get houseRules separately with a raw query
  const rulesResult = await prisma.$queryRaw<[{houseRules: string[]}]>`SELECT "houseRules" FROM "Product" WHERE id = ${id}`;
  const houseRules = rulesResult?.[0]?.houseRules || [];
  
  return { 
    ...productData, 
    User: productData?.User ? {
      ...productData.User,
      homeownerProfile,
    } : null,
    amenities, 
    supportRequested, 
    houseRules 
  };
}

async function getApplicationStatus(productId: string, userId: string) {
  const application = await prisma.application.findUnique({
    where: {
      housemateId_productId: {
        housemateId: userId,
        productId: productId,
      },
    },
  });
  
  return application;
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  noStore();
  const resolvedParams = await params;
  const data = await getData(resolvedParams.id);
  const currentUser = await getCurrentUser();
  
  // Safety check to ensure data exists
  if (!data) {
    return <div>Product not found</div>;
  }
  
  const amenities = data.amenities || [];
  const supportRequested = data.supportRequested || [];
  const houseRules = data.houseRules || [];
  
  // Check for existing application if user is logged in and not the owner
  let existingApplication = null;
  if (currentUser && currentUser.id !== data.User?.id && data.id) {
    existingApplication = await getApplicationStatus(data.id, currentUser.id);
  }
  
  // Extract profile-level house rules from homeowner profile
  const profileHouseRules: any[] = [];
  const homeownerProfile = data.User?.homeownerProfile;
  
  if (homeownerProfile?.lifestyle) {
    const lifestyle = homeownerProfile.lifestyle;
    
    // Add smoking policy from profile if available
    if (lifestyle.smokingPolicy) {
      profileHouseRules.push({
        id: "smokingPolicy",
        value: lifestyle.smokingPolicy,
        source: "profile" // Mark as coming from profile
      });
    }
    
    // Add guest policy from profile if available
    if (lifestyle.guestPolicy) {
      profileHouseRules.push({
        id: "guestPolicy", 
        value: lifestyle.guestPolicy,
        source: "profile" // Mark as coming from profile
      });
    }
  }
  
  // Combine listing-specific rules with profile rules, avoiding duplicates
  // Listing-specific rules take precedence over profile rules
  const listingRuleIds = houseRules.map((rule: any) => 
    typeof rule === 'string' ? rule : rule.id
  );
  
  const combinedHouseRules = [
    ...houseRules.map((rule: any) => ({
      ...(typeof rule === 'string' ? { id: rule } : rule),
      source: "listing"
    })),
    ...profileHouseRules.filter(profileRule => 
      !listingRuleIds.includes(profileRule.id)
    )
  ];
  
  // Check if current user is a housemate and not the owner of this listing
  const canMessageHost = currentUser && 
    (currentUser as any).userType === "HOUSEMATE" && 
    currentUser.id !== data.User?.id;

  // Check user type and ownership for the action component
  const isOwner = currentUser?.id === data.User?.id;
  const isHousemate = currentUser && (currentUser as any).userType === "HOUSEMATE";

  // Generate display title using same logic as cards
  const cityName = getCityFromAddress(data.address);
  const displayTitle = cityName ? `Private room in ${cityName}` : data.name;

  return (
    <>
      {/* Desktop: Listing Title above images */}
      <div className="hidden lg:block mx-auto px-4 max-w-7xl lg:px-8 mt-8">
        <h1 className="text-2xl font-semibold tracking-tight text-gray-900 sm:text-3xl mb-6">
          {data.name}
        </h1>
      </div>

      <section className="mx-auto lg:px-4 max-w-7xl lg:px-8">
        <ImageGallery images={data.images as string[]} />

        {/* Mobile: Title and description below images */}
        <div className="lg:hidden -mt-6 pt-10 pb-6 px-4 bg-white relative z-10 rounded-t-3xl text-center">
          <h1 className="text-2xl font-semibold tracking-tight text-gray-900 mb-3">
            {data.name}
          </h1>
          <p className="text-xl text-gray-600 leading-relaxed font-medium">{displayTitle}</p>
        </div>

        {/* Desktop: Short description below images */}
        <div className="hidden lg:block mt-4">
          <p className="text-2xl text-gray-900 font-medium">{displayTitle}</p>
        </div>
      </section>

      {/* Host profile and payment section side by side */}
      <section className="mx-auto px-4 max-w-7xl lg:px-8 lg:grid lg:grid-cols-7 lg:gap-x-8 xl:gap-x-16 mt-4 min-h-screen">
        <div className="w-full max-w-2xl mx-auto lg:max-w-none lg:col-span-4">
          {data.User && (
            <HomeownerProfileCard 
              homeowner={{
                firstName: data.User.firstName,
                lastName: data.User.lastName,
                profileImage: data.User.profileImage,
                homeownerProfile: data.User.homeownerProfile,
              }}
              canMessageHost={!!canMessageHost}
              messageProps={canMessageHost && data.User && data.id && data.name ? {
                productId: data.id,
                hostId: data.User.id,
                productName: data.name,
              } : undefined}
              supportRequested={supportRequested}
            />
          )}

          {/* Mobile: Application Form right after HomeownerProfileCard */}
          <div className="lg:hidden mt-6">
            {!isOwner && data.id ? (
              <ApplicationForm
                productId={data.id}
                productName={data.name || 'Property'}
                price={data.price}
                hasExistingApplication={!!existingApplication}
                existingApplicationStatus={existingApplication?.status || undefined}
                applicationId={existingApplication?.id}
                supportRequested={supportRequested}
              />
            ) : isOwner ? (
              <Card>
                <CardContent className="py-6 text-center">
                  <h3 className="text-lg font-medium mb-2">This is your listing</h3>
                  <p className="text-muted-foreground mb-4">
                    You can view and manage applications from interested housemates in your dashboard.
                  </p>
                  <Button asChild variant="outline">
                    <a href="/applications">View Applications</a>
                  </Button>
                </CardContent>
              </Card>
            ) : null}
          </div>
          
          <ProductDescription content={data.description as JSONContent} />

          {/* Desktop: Amenities moved to left column */}
          {amenities.length > 0 && (
            <>
              <div className="border-t border-gray-200 mt-6 pt-6">
                <h3 className="text-base font-medium mb-4">Amenities</h3>
                <div className="grid grid-cols-2 gap-4">
                  {amenities.map((amenityId: string) => {
                    const amenity = amenityIcons[amenityId];
                    if (!amenity) return null;
                    
                    const Icon = amenity.icon;
                    return (
                      <div key={amenityId} className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center">
                          <Icon size={16} className="text-slate-600" />
                        </div>
                        <span className="text-sm">{amenity.label}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </>
          )}

          {/* Desktop: House Rules moved to left column */}
          {combinedHouseRules.length > 0 && (
            <>
              <div className="border-t border-gray-200 mt-6 pt-6">
                <h3 className="text-base font-medium mb-4">House Rules</h3>
                <div className="grid grid-cols-1 gap-4">
                  {combinedHouseRules.map((ruleItem: any) => {
                    const ruleId = typeof ruleItem === 'string' ? ruleItem : ruleItem.id;
                    const ruleValue = typeof ruleItem === 'string' ? null : ruleItem.value;
                    const rule = houseRulesIcons[ruleId];
                    
                    // Skip additional rules here - they'll be displayed separately below
                    if (ruleId === 'additionalRules') {
                      return null;
                    }
                    
                    // Handle unknown rule types gracefully
                    if (!rule) {
                      return (
                        <div key={ruleId} className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                          <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center">
                            <FileText size={16} className="text-slate-600" />
                          </div>
                          <div className="flex-1">
                            <span className="text-sm font-medium capitalize">{ruleId.replace(/([A-Z])/g, ' $1')}</span>
                            {ruleValue && (
                              <span className="block text-sm text-muted-foreground">{ruleValue}</span>
                            )}
                          </div>
                        </div>
                      );
                    }
                    
                    const Icon = rule.icon;
                    let displayValue = ruleValue;
                    
                    // Get human-readable label for dropdown values
                    if (ruleValue && houseRulesValueLabels[ruleId] && houseRulesValueLabels[ruleId][ruleValue]) {
                      displayValue = houseRulesValueLabels[ruleId][ruleValue];
                    }
                    
                    return (
                      <div key={ruleId} className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                        <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center">
                          <Icon size={16} className="text-slate-600" />
                        </div>
                        <div className="flex-1">
                          <span className="text-sm font-medium">{rule.label}</span>
                          {displayValue && (
                            <span className="block text-sm text-muted-foreground">{displayValue}</span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Display additional rules separately below other rules */}
                {combinedHouseRules.some((rule: any) => {
                  const ruleId = typeof rule === 'string' ? rule : rule.id;
                  return ruleId === 'additionalRules';
                }) && (
                  <div className="mt-6">
                    {combinedHouseRules.map((ruleItem: any) => {
                      const ruleId = typeof ruleItem === 'string' ? ruleItem : ruleItem.id;
                      const ruleValue = typeof ruleItem === 'string' ? null : ruleItem.value;
                      
                      if (ruleId !== 'additionalRules' || !ruleValue) return null;
                      
                      const rule = houseRulesIcons[ruleId];
                      const Icon = rule.icon;
                      
                      return (
                        <div key={ruleId} className="border border-gray-200 rounded-lg p-4 bg-white">
                          <div className="flex items-center gap-3 mb-2">
                            <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center">
                              <Icon size={16} className="text-slate-600" />
                            </div>
                            <span className="text-sm font-medium">{rule.label}</span>
                          </div>
                          <div className="pl-11">
                            <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                              {ruleValue}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        <div className="lg:col-span-3">
          {/* Desktop: Application Form for all users except owners */}
          <div className="hidden lg:block sticky top-40 z-10">
            {!isOwner && data.id ? (
              <ApplicationForm
                productId={data.id}
                productName={data.name || 'Property'}
                price={data.price}
                hasExistingApplication={!!existingApplication}
                existingApplicationStatus={existingApplication?.status || undefined}
                applicationId={existingApplication?.id}
                supportRequested={supportRequested}
              />
            ) : isOwner ? (
              <Card>
                <CardContent className="py-6 text-center">
                  <h3 className="text-lg font-medium mb-2">This is your listing</h3>
                  <p className="text-muted-foreground mb-4">
                    You can view and manage applications from interested housemates in your dashboard.
                  </p>
                  <Button asChild variant="outline">
                    <a href="/applications">View Applications</a>
                  </Button>
                </CardContent>
              </Card>
            ) : null}
          </div>
        </div>
      </section>

      {/* Property Location Map */}
      {data.address && (
        <section className="mx-auto px-4 max-w-7xl lg:px-8 mt-16 mb-16">
          <div className="border-t border-gray-200 pt-10">
            <h2 className="text-2xl font-bold mb-6">Property Location</h2>
            <div className="w-full">
              <ApproximateLocationMap address={data.address} className="w-full h-96" />
            </div>
            <p className="text-sm text-muted-foreground mt-4 text-center">
              🗺️ Approximate area shown for privacy - exact address shared upon booking
            </p>
          </div>
        </section>
      )}
    </>
  );
} 