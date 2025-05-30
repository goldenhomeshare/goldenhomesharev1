import { BuyProduct } from "@/app/actions";
import { ProductDescription } from "@/app/components/ProductDescription";
import { BuyButton } from "@/app/components/SubmitButtons";
import { HomeownerProfileCard } from "@/app/components/HomeownerProfileCard";
import { MessageHostButton } from "@/app/components/chat/MessageHostButton";
import { ApproximateLocationMap } from "@/app/components/ApproximateLocationMap";
import prisma from "@/app/lib/db";
import { Button } from "@/components/ui/button";
import { unstable_noStore as noStore } from "next/cache";
import { getCurrentUser } from "@/lib/auth";

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
      preferredAgeRanges: any | null;
      preferredGender: string | null;
      lifestyle: any | null;
    }]>`
      SELECT "profilePicture", bio, gender, "ageRange", schedule, "socialPreference", hobbies, "socialMedia",
             "preferredAgeRanges", "preferredGender", lifestyle
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

  return (
    <>
      <section className="mx-auto px-4  lg:mt-10 max-w-7xl lg:px-8 lg:grid lg:grid-rows-1 lg:grid-cols-7 lg:gap-x-8 lg:gap-y-10 xl:gap-x-16">
        <Carousel className=" lg:row-end-1 lg:col-span-4">
          <CarouselContent>
            {data.images?.map((item, index) => (
              <CarouselItem key={index}>
                <div className="aspect-w-4 aspect-h-3 rounded-lg bg-gray-100 overflow-hidden">
                  <Image
                    src={item as string}
                    alt="yoo"
                    fill
                    className="object-cover w-full h-full rounded-lg"
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="ml-16" />
          <CarouselNext className="mr-16" />
        </Carousel>

        <div className="max-w-2xl mx-auto mt-5 lg:max-w-none lg:mt-0 lg:row-end-2 lg:row-span-2 lg:col-span-3">
          <h1 className="text-2xl font-extrabold tracking-tight text-gray-900 sm:text-3xl">
            {data.name}
          </h1>

          <p className="mt-2 text-muted-foreground">{data.smallDescription}</p>
          <form action={BuyProduct}>
            <input type="hidden" name="id" value={data.id} />
            <BuyButton price={data.price as number} />
          </form>

          {canMessageHost && 
           data.User && 
           data.User.firstName && 
           data.User.lastName && 
           data.User.id && 
           data.id &&
           data.name && (
            <MessageHostButton
              productId={data.id}
              hostId={data.User.id}
              hostName={`${data.User.firstName} ${data.User.lastName}`}
              productName={data.name}
            />
          )}

          <div className="border-t border-gray-200 mt-10 pt-10">
            <div className="grid grid-cols-2 w-full gap-y-3">
              <h3 className="text-sm font-medium text-muted-foreground col-span-1">
                Released:
              </h3>
              <h3 className="text-sm font-medium col-span-1">
                {new Intl.DateTimeFormat("en-US", {
                  dateStyle: "long",
                }).format(data.createdAt)}
              </h3>

              {data.category && (
                <>
                  <h3 className="text-sm font-medium text-muted-foreground col-span-1">
                    Category:
                  </h3>
                  <h3 className="text-sm font-medium col-span-1">{data.category}</h3>
                </>
              )}
            </div>
          </div>

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

          {supportRequested.length > 0 && (
            <>
              <div className="border-t border-gray-200 mt-6 pt-6">
                <h3 className="text-base font-medium mb-4">Support Requested</h3>
                <div className="grid grid-cols-2 gap-4">
                  {supportRequested.map((supportItem: any) => {
                    const supportId = typeof supportItem === 'string' ? supportItem : supportItem.id;
                    const hoursPerWeek = typeof supportItem === 'string' ? null : supportItem.hoursPerWeek;
                    const support = supportIcons[supportId];
                    if (!support) return null;
                    
                    const Icon = support.icon;
                    return (
                      <div key={supportId} className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center">
                          <Icon size={16} className="text-slate-600" />
                        </div>
                        <div>
                          <span className="text-sm">{support.label}</span>
                          {hoursPerWeek && (
                            <span className="block text-xs text-muted-foreground">{hoursPerWeek} hours/week</span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </>
          )}

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

          <div className="border-t border-gray-200 mt-10"></div>
        </div>

        <div className="w-full max-w-2xl mx-auto mt-16 lg:max-w-none lg:mt-0 lg:col-span-4">
          <ProductDescription content={data.description as JSONContent} />
          
          {data.User && (
            <HomeownerProfileCard 
              homeowner={{
                firstName: data.User.firstName,
                lastName: data.User.lastName,
                profileImage: data.User.profileImage,
                homeownerProfile: data.User.homeownerProfile,
              }}
            />
          )}
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