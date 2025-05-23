"use client";

import { SellProduct, type State } from "@/app/actions";
import {
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { type JSONContent } from "@tiptap/react";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";
import { useActionState} from "react";
import { toast } from "sonner";
import { SelectCategory } from "../SelectCategory";
import { Textarea } from "@/components/ui/textarea";
import { TipTapEditor } from "../Editor";
import { UploadDropzone } from "@/app/lib/uploadthing";
import { Submitbutton } from "../SubmitButtons";
import { Bath, Car, Wifi, Utensils, Tv, Snowflake, Sun, Home, DoorOpen, WashingMachine, Armchair, Briefcase, Sparkles, Salad, Flower, ShoppingBag, HeartHandshake, Cat, Wrench, Shield, Clock, VolumeX, Cigarette, CigaretteOff, Wine, GlassWater, Users, UserMinus } from "lucide-react";

export function SellForm() {
  const initalState: State = { message: "", status: undefined };
  const [state, formAction] = useActionState (SellProduct, initalState);
  const [json, setJson] = useState<null | JSONContent>(null);
  const [images, setImages] = useState<null | string[]>(null);
  const [productFile, SetProductFile] = useState<null | string>(null);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [selectedSupport, setSelectedSupport] = useState<Array<{id: string, hoursPerWeek: number}>>([]);
  const [selectedHouseRules, setSelectedHouseRules] = useState<Array<{id: string, value?: string}>>([]);

  const amenities = [
    { id: "parking", label: "Parking", icon: Car },
    { id: "wifi", label: "WiFi", icon: Wifi },
    { id: "kitchen", label: "Kitchen Access", icon: Utensils },
    { id: "tv", label: "TV", icon: Tv },
    { id: "ac", label: "Air Conditioning", icon: Snowflake },
    { id: "heating", label: "Heating", icon: Sun },
    { id: "privateBathroom", label: "Private Bathroom", icon: Bath },
    { id: "privateEntrance", label: "Private Entrance", icon: DoorOpen },
    { id: "laundry", label: "Laundry Access", icon: WashingMachine },
    { id: "patio", label: "Patio/Balcony", icon: Home },
    { id: "furnished", label: "Furnished Room", icon: Armchair },
    { id: "workspace", label: "Desk/Workspace", icon: Briefcase },
  ];

  const supportOptions = [
    { id: "cleaning", label: "Cleaning", icon: Sparkles },
    { id: "cooking", label: "Cooking", icon: Salad },
    { id: "gardening", label: "Gardening", icon: Flower },
    { id: "errands", label: "Errands", icon: ShoppingBag },
    { id: "companionship", label: "Companionship", icon: HeartHandshake },
    { id: "petCare", label: "Pet Care", icon: Cat },
    { id: "techSupport", label: "Tech Support", icon: Wrench },
    { id: "homeSecurity", label: "Home Security", icon: Shield },
  ];

  const houseRulesOptions = [
    { 
      id: "guestPolicy", 
      label: "Guest Policy", 
      icon: Users, 
      options: [
        { value: "dayNightApproval", label: "Day and night with approval" },
        { value: "dayOnly", label: "Day only" },
        { value: "no", label: "No" }
      ]
    },
    { 
      id: "smokingPolicy", 
      label: "Smoking Policy", 
      icon: CigaretteOff, 
      options: [
        { value: "yes", label: "Yes" },
        { value: "no", label: "No" },
        { value: "designatedAreas", label: "Designated areas" }
      ]
    },
    { 
      id: "petPolicy", 
      label: "Pet Policy", 
      icon: Cat, 
      options: [
        { value: "yes", label: "Yes" },
        { value: "no", label: "No" },
        { value: "discussionRequired", label: "Discussion required" }
      ]
    },
    { 
      id: "quietHours", 
      label: "Quiet Hours", 
      icon: Clock, 
      hasCustomInput: true, 
      defaultValue: "10 PM - 7 AM" 
    },
  ];

  const toggleAmenity = (amenityId: string) => {
    setSelectedAmenities(prev => 
      prev.includes(amenityId)
        ? prev.filter(id => id !== amenityId)
        : [...prev, amenityId]
    );
  };

  const toggleSupport = (supportId: string) => {
    setSelectedSupport(prev => 
      prev.some(item => item.id === supportId)
        ? prev.filter(item => item.id !== supportId)
        : [...prev, { id: supportId, hoursPerWeek: 1 }]
    );
  };

  const toggleHouseRule = (ruleId: string, value?: string) => {
    setSelectedHouseRules(prev => {
      const existingIndex = prev.findIndex(rule => rule.id === ruleId);
      if (existingIndex >= 0) {
        if (value) {
          // Update existing rule
          return prev.map(rule => 
            rule.id === ruleId ? { ...rule, value } : rule
          );
        } else {
          // Remove rule
          return prev.filter(rule => rule.id !== ruleId);
        }
      } else {
        // Add new rule
        const rule = houseRulesOptions.find(opt => opt.id === ruleId);
        const newRule: {id: string, value?: string} = { id: ruleId };
        if (value) {
          newRule.value = value;
        } else if (rule?.hasCustomInput && rule?.defaultValue) {
          newRule.value = rule.defaultValue;
        }
        return [...prev, newRule];
      }
    });
  };

  const updateHouseRuleValue = (ruleId: string, value: string) => {
    setSelectedHouseRules(prev =>
      prev.map(rule =>
        rule.id === ruleId ? { ...rule, value } : rule
      )
    );
  };

  const updateSupportHours = (supportId: string, hours: number) => {
    setSelectedSupport(prev => 
      prev.map(item => 
        item.id === supportId 
          ? { ...item, hoursPerWeek: hours } 
          : item
      )
    );
  };

  useEffect(() => {
    if (state.status === "success") {
      toast.success(state.message);
    } else if (state.status === "error") {
      toast.error(state.message);
    }
  }, [state]);
  return (
    <form action={formAction}>
      <CardHeader>
        <CardTitle>Make a listing with ease</CardTitle>
        <CardDescription>
          Please describe your idea match here in detail
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-y-10">
        <div className="flex flex-col gap-y-2">
          <Label>Title</Label>
          <Input
            name="name"
            type="text"
            placeholder="Title of your listing"
            required
            minLength={3}
          />
          {state?.errors?.["name"]?.[0] && (
            <p className="text-destructive">{state?.errors?.["name"]?.[0]}</p>
          )}
        </div>
        <div className="flex flex-col gap-y-2">
          <Label>I am a...</Label>
          <SelectCategory />
          {state?.errors?.["category"]?.[0] && (
            <p className="text-destructive">
              {state?.errors?.["category"]?.[0]}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-y-2">
          <Label>Price</Label>
          <Input
            placeholder="$325"
            type="number"
            name="price"
            required
            min={1}
          />
          {state?.errors?.["price"]?.[0] && (
            <p className="text-destructive">{state?.errors?.["price"]?.[0]}</p>
          )}
        </div>

        <div className="flex flex-col gap-y-2">
          <Label>Small Summary</Label>
          <Textarea
            name="smallDescription"
            placeholder="Please describe your listing shortly right here (e.g., Cozy 1 bedroom, close to public transport, etc.)..."
            required
            minLength={10}
          />
          {state?.errors?.["smallDescription"]?.[0] && (
            <p className="text-destructive">
              {state?.errors?.["smallDescription"]?.[0]}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-y-2">
          <input type="hidden" name="amenities" value={JSON.stringify(selectedAmenities)} />
          <Label>Amenities</Label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {amenities.map((amenity) => {
              const Icon = amenity.icon;
              return (
                <label key={amenity.id} className="cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={selectedAmenities.includes(amenity.id)}
                    onChange={() => toggleAmenity(amenity.id)}
                  />
                  <div className="flex flex-col items-center p-4 rounded-lg border peer-checked:border-primary peer-checked:bg-primary/5 hover:bg-slate-50 h-full">
                    <div className="w-12 h-12 rounded-full bg-slate-100 mb-3 flex items-center justify-center">
                      <Icon size={24} className="text-slate-600" />
                    </div>
                    <span className="font-medium text-center">{amenity.label}</span>
                  </div>
                </label>
              );
            })}
          </div>
        </div>

        <div className="flex flex-col gap-y-2">
          <input type="hidden" name="supportRequested" value={JSON.stringify(selectedSupport)} />
          <Label>Support Requested</Label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {supportOptions.map((support) => {
              const Icon = support.icon;
              const isSelected = selectedSupport.some(item => item.id === support.id);
              const selectedItem = selectedSupport.find(item => item.id === support.id);
              
              return (
                <div key={support.id} className="flex flex-col">
                  <label className="cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={isSelected}
                      onChange={() => toggleSupport(support.id)}
                    />
                    <div className="flex flex-col items-center p-4 rounded-lg border peer-checked:border-primary peer-checked:bg-primary/5 hover:bg-slate-50 h-full">
                      <div className="w-12 h-12 rounded-full bg-slate-100 mb-3 flex items-center justify-center">
                        <Icon size={24} className="text-slate-600" />
                      </div>
                      <span className="font-medium text-center">{support.label}</span>
                    </div>
                  </label>
                  
                  {isSelected && (
                    <div className="mt-2 flex flex-col items-center">
                      <Label className="text-xs mb-1">Hours/week</Label>
                      <Input
                        type="number"
                        min={1}
                        max={40}
                        value={selectedItem?.hoursPerWeek || 1}
                        onChange={(e) => updateSupportHours(support.id, parseInt(e.target.value) || 1)}
                        className="text-center w-full"
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex flex-col gap-y-2">
          <input type="hidden" name="houseRules" value={JSON.stringify(selectedHouseRules)} />
          <Label>House Rules</Label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {houseRulesOptions.map((ruleOpt) => {
              const Icon = ruleOpt.icon;
              const selectedRule = selectedHouseRules.find(r => r.id === ruleOpt.id);
              const isSelected = !!selectedRule;

              return (
                <div key={ruleOpt.id} className="flex flex-col space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center">
                      <Icon size={20} className="text-slate-600" />
                    </div>
                    <Label className="font-medium">{ruleOpt.label}</Label>
                  </div>
                  
                  {ruleOpt.options ? (
                    <select
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                      value={selectedRule?.value || ""}
                      onChange={(e) => {
                        if (e.target.value) {
                          toggleHouseRule(ruleOpt.id, e.target.value);
                        } else {
                          toggleHouseRule(ruleOpt.id);
                        }
                      }}
                    >
                      <option value="">Select an option</option>
                      {ruleOpt.options.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  ) : ruleOpt.hasCustomInput ? (
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => {
                          if (isSelected) {
                            toggleHouseRule(ruleOpt.id);
                          } else {
                            toggleHouseRule(ruleOpt.id, ruleOpt.defaultValue);
                          }
                        }}
                        className="rounded border-gray-300 text-primary focus:ring-primary"
                      />
                      <span className="text-sm">Enable quiet hours</span>
                      {isSelected && (
                        <Input
                          type="text"
                          value={selectedRule?.value || ""}
                          onChange={(e) => updateHouseRuleValue(ruleOpt.id, e.target.value)}
                          placeholder={ruleOpt.defaultValue}
                          className="flex-1"
                        />
                      )}
                    </div>
                  ) : null}
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex flex-col gap-y-2">
          <input
            type="hidden"
            name="description"
            value={JSON.stringify(json)}
          />
          <Label>Description</Label>
          <TipTapEditor json={json} setJson={setJson} />
          {state?.errors?.["description"]?.[0] && (
            <p className="text-destructive">
              {state?.errors?.["description"]?.[0]}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-y-2">
          <input type="hidden" name="images" value={JSON.stringify(images)} />
          <Label>Product Images</Label>
          <UploadDropzone
            endpoint="imageUploader"
            onClientUploadComplete={(res) => {
              setImages(res.map((item) => item.url));
              toast.success("Your images have been uploaded");
            }}
            onUploadError={(error: Error) => {
              toast.error("Something went wrong, try again");
            }}
          />
          {state?.errors?.["images"]?.[0] && (
            <p className="text-destructive">{state?.errors?.["images"]?.[0]}</p>
          )}
        </div>

        <div className="flex flex-col gap-y-2">
          <input type="hidden" name="productFile" value={productFile ?? ""} />
          <Label>Product File</Label>
          <UploadDropzone
            onClientUploadComplete={(res) => {
              SetProductFile(res[0].url);
              toast.success("Your Product file has been uplaoded!");
            }}
            endpoint="productFileUpload"
            onUploadError={(error: Error) => {
              toast.error("Something went wrong, try again");
            }}
          />
          {state?.errors?.["productFile"]?.[0] && (
            <p className="text-destructive">
              {state?.errors?.["productFile"]?.[0]}
            </p>
          )}
        </div>
      </CardContent>
      <CardFooter className="mt-5">
        <Submitbutton title="Submit your listing" />
      </CardFooter>
    </form>
  );
}