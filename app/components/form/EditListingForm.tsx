"use client";

import { EditProduct, type State } from "@/app/actions";
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
import { useEffect, useState, useCallback } from "react";
import { useActionState} from "react";
import { toast } from "sonner";
import { SelectCategory } from "../SelectCategory";
import { Textarea } from "@/components/ui/textarea";
import { TipTapEditor } from "../Editor";
import { UploadDropzone } from "@/app/lib/uploadthing";
import { Submitbutton } from "../SubmitButtons";
import { Bath, Car, Wifi, Utensils, Tv, Snowflake, Sun, Home, DoorOpen, WashingMachine, Armchair, Briefcase, Sparkles, Salad, Flower, ShoppingBag, HeartHandshake, Cat, Wrench, Shield, Clock, VolumeX, Cigarette, CigaretteOff, Wine, GlassWater, Users, UserMinus, X, Plus, Upload, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useDropzone } from "@uploadthing/react";
import { generateClientDropzoneAccept, generatePermittedFileTypes } from "uploadthing/client";
import { useUploadThing } from "@/app/lib/uploadthing";
import { AddressMap } from "../AddressMap";
import { AddressAutocomplete } from "../AddressAutocomplete";

interface EditListingFormProps {
  listing: {
    id: string;
    name: string;
    price: number;
    smallDescription: string;
    description: any;
    images: string[];
    productFile: string;
    category: string;
    address: string | null;
    amenities: any;
    supportRequested: any;
    houseRules: any;
  };
}

export function EditListingForm({ listing }: EditListingFormProps) {
  const initalState: State = { message: "", status: undefined };
  const [state, formAction] = useActionState(EditProduct, initalState);
  const [json, setJson] = useState<null | JSONContent>(listing.description as JSONContent || null);
  const [images, setImages] = useState<null | string[]>(listing.images || null);
  const [productFile, SetProductFile] = useState<null | string>(listing.productFile || null);
  const [address, setAddress] = useState<string>(listing.address || "");
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>(listing.amenities || []);
  const [selectedSupport, setSelectedSupport] = useState<Array<{id: string, hoursPerWeek: number}>>(listing.supportRequested || []);
  const [selectedHouseRules, setSelectedHouseRules] = useState<Array<{id: string, value?: string}>>(listing.houseRules || []);
  const [selectedImageModal, setSelectedImageModal] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);

  // Custom upload hook for images
  const { startUpload, routeConfig, isUploading } = useUploadThing("imageUploader", {
    onClientUploadComplete: (res: { url: string }[]) => {
      const newImages = res.map((item: { url: string }) => item.url);
      setImages(prev => prev ? [...prev, ...newImages] : newImages);
      setUploadProgress(0);
      toast.success("Your images have been uploaded");
    },
    onUploadError: (error: Error) => {
      setUploadProgress(0);
      toast.error("Something went wrong, try again");
    },
    onUploadProgress: (progress: number) => {
      setUploadProgress(progress);
    },
  });

  // Custom dropzone for images
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles?.length) {
      startUpload(acceptedFiles);
    }
  }, [startUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: routeConfig ? generateClientDropzoneAccept(generatePermittedFileTypes(routeConfig).fileTypes) : undefined,
    multiple: true,
    maxFiles: 10,
  });

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

  const removeImage = (indexToRemove: number) => {
    setImages(prev => 
      prev ? prev.filter((_, index) => index !== indexToRemove) : null
    );
  };

  useEffect(() => {
    if (state.status === "success") {
      toast.success(state.message);
      redirect("/my-products");
    }

    if (state.status === "error") {
      toast.error(state.message);
    }
  }, [state]);

  return (
    <form action={formAction}>
      <input type="hidden" name="productId" value={listing.id} />
      <CardHeader>
        <CardTitle>Edit Your Listing</CardTitle>
        <CardDescription>
          Update your listing information to attract the right housemates.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-y-10">
        <div className="flex flex-col gap-y-2">
          <Label>Name</Label>
          <Input
            name="name"
            type="text"
            placeholder="Name of your Product"
            defaultValue={listing.name}
            required
          />
          {state?.errors?.["name"]?.[0] && (
            <p className="text-destructive">{state.errors["name"][0]}</p>
          )}
        </div>

        <div className="flex flex-col gap-y-2">
          <Label>Category</Label>
          <SelectCategory defaultValue={listing.category} />
          {state?.errors?.["category"]?.[0] && (
            <p className="text-destructive">{state.errors["category"][0]}</p>
          )}
        </div>

        <div className="flex flex-col gap-y-2">
          <Label>Price</Label>
          <Input
            placeholder="$55"
            type="number"
            name="price"
            defaultValue={listing.price}
            required
          />
          {state?.errors?.["price"]?.[0] && (
            <p className="text-destructive">{state.errors["price"][0]}</p>
          )}
        </div>

        <div className="flex flex-col gap-y-2">
          <Label>Small Summary</Label>
          <Textarea
            name="smallDescription"
            placeholder="Please describe your product shortly right here..."
            defaultValue={listing.smallDescription}
            required
          />
          {state?.errors?.["smallDescription"]?.[0] && (
            <p className="text-destructive">
              {state.errors["smallDescription"][0]}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-y-2">
          <div className="flex items-center gap-2">
            <Label>Property Address</Label>
            <span className="text-xs text-muted-foreground italic">don't worry, no one will see this</span>
          </div>
          <AddressAutocomplete
            value={address}
            onChange={(value) => setAddress(value)}
            className="mb-4"
          />
          {state?.errors?.["address"]?.[0] && (
            <p className="text-destructive">{state.errors["address"][0]}</p>
          )}
          
          {/* Map Component */}
          <div className="mt-2">
            <AddressMap address={address} className="w-full" />
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
              {state.errors["description"][0]}
            </p>
          )}
        </div>

        {/* Amenities Section */}
        <div className="flex flex-col gap-y-4">
          <Label>Amenities & Features</Label>
          <input
            type="hidden"
            name="amenities"
            value={JSON.stringify(selectedAmenities)}
          />
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {amenities.map((amenity) => {
              const Icon = amenity.icon;
              const isSelected = selectedAmenities.includes(amenity.id);
              
              return (
                <button
                  key={amenity.id}
                  type="button"
                  onClick={() => toggleAmenity(amenity.id)}
                  className={`flex flex-col items-center p-4 rounded-lg border transition-all hover:shadow-md ${
                    isSelected 
                      ? 'border-primary bg-primary/10 text-primary' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <Icon size={24} className="mb-2" />
                  <span className="text-sm font-medium text-center">{amenity.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Support Services Section */}
        <div className="flex flex-col gap-y-4">
          <Label>Support Services Requested</Label>
          <p className="text-sm text-muted-foreground">
            What kind of support would you like from your housemate? Select services and specify hours per week.
          </p>
          <input
            type="hidden"
            name="supportRequested"
            value={JSON.stringify(selectedSupport)}
          />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {supportOptions.map((support) => {
              const Icon = support.icon;
              const selectedItem = selectedSupport.find(item => item.id === support.id);
              const isSelected = !!selectedItem;
              
              return (
                <div
                  key={support.id}
                  className={`rounded-lg border transition-all ${
                    isSelected 
                      ? 'border-primary bg-primary/10' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => toggleSupport(support.id)}
                    className={`w-full flex items-center p-4 text-left ${
                      isSelected ? '' : 'hover:bg-gray-50'
                    }`}
                  >
                    <Icon size={24} className={`mr-3 ${isSelected ? 'text-primary' : ''}`} />
                    <span className={`font-medium ${isSelected ? 'text-primary' : ''}`}>
                      {support.label}
                    </span>
                  </button>
                  
                  {isSelected && (
                    <div className="px-4 pb-4">
                      <div className="flex items-center gap-2 pt-2 border-t border-gray-200">
                        <span className="text-sm text-muted-foreground">Hours per week:</span>
                        <Input
                          type="number"
                          min="1"
                          max="20"
                          value={selectedItem.hoursPerWeek}
                          onChange={(e) => updateSupportHours(support.id, parseInt(e.target.value) || 1)}
                          onClick={(e) => e.stopPropagation()}
                          className="w-20 h-8 text-center"
                        />
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* House Rules Section */}
        <div className="flex flex-col gap-y-4">
          <Label>House Rules</Label>
          <p className="text-sm text-muted-foreground">
            Set clear expectations for your shared living space.
          </p>
          <input
            type="hidden"
            name="houseRules"
            value={JSON.stringify(selectedHouseRules)}
          />
          <div className="space-y-4">
            {houseRulesOptions.map((rule) => {
              const Icon = rule.icon;
              const selectedRule = selectedHouseRules.find(r => r.id === rule.id);
              const isSelected = !!selectedRule;
              
              return (
                <div
                  key={rule.id}
                  className={`p-4 rounded-lg border transition-all ${
                    isSelected ? 'border-primary bg-primary/5' : 'border-gray-200'
                  }`}
                >
                  <div className="flex items-center mb-3">
                    <Icon size={20} className={`mr-3 ${isSelected ? 'text-primary' : ''}`} />
                    <span className={`font-medium ${isSelected ? 'text-primary' : ''}`}>
                      {rule.label}
                    </span>
                  </div>
                  
                  {rule.options ? (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      {rule.options.map((option) => (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() => 
                            selectedRule?.value === option.value 
                              ? toggleHouseRule(rule.id)
                              : toggleHouseRule(rule.id, option.value)
                          }
                          className={`p-2 text-sm rounded border transition-all ${
                            selectedRule?.value === option.value
                              ? 'border-primary bg-primary text-primary-foreground'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  ) : rule.hasCustomInput && (
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => 
                          isSelected 
                            ? toggleHouseRule(rule.id)
                            : toggleHouseRule(rule.id, rule.defaultValue)
                        }
                        className={`px-3 py-1 text-sm rounded border transition-all ${
                          isSelected
                            ? 'border-primary bg-primary text-primary-foreground'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        {isSelected ? 'Remove' : 'Add'}
                      </button>
                      {isSelected && (
                        <Input
                          type="text"
                          value={selectedRule.value || ''}
                          onChange={(e) => updateHouseRuleValue(rule.id, e.target.value)}
                          placeholder={rule.defaultValue}
                          className="flex-1"
                        />
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Images Section */}
        <div className="flex flex-col gap-y-2">
          <input
            type="hidden"
            name="images"
            value={JSON.stringify(images)}
          />
          <Label>Product Images</Label>
          
          {/* Current Images */}
          {images && images.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-4">
              {images.map((image, index) => (
                <div key={index} className="relative group">
                  <div className="aspect-square relative overflow-hidden rounded-lg border">
                    <Image
                      src={image}
                      alt={`Product image ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Upload New Images */}
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
              isDragActive 
                ? 'border-primary bg-primary/10' 
                : 'border-gray-300 hover:border-gray-400'
            }`}
          >
            <input {...getInputProps()} />
            <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            {isUploading ? (
              <div>
                <p className="text-lg font-medium text-gray-900">Uploading...</p>
                <div className="mt-2 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-primary h-2 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
                <p className="text-sm text-gray-500 mt-2">{uploadProgress}% complete</p>
              </div>
            ) : isDragActive ? (
              <p className="text-lg font-medium text-gray-900">Drop the images here...</p>
            ) : (
              <div>
                <p className="text-lg font-medium text-gray-900">
                  Drag & drop images here, or click to select
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  Upload up to 10 images (PNG, JPG, GIF up to 10MB each)
                </p>
              </div>
            )}
          </div>
          
          {state?.errors?.["images"]?.[0] && (
            <p className="text-destructive">{state.errors["images"][0]}</p>
          )}
        </div>

        <div className="flex flex-col gap-y-2">
          <Label>Product File</Label>
          <input
            type="hidden"
            name="productFile"
            value={productFile ?? ""}
          />
          <UploadDropzone
            endpoint="productFileUpload"
            onClientUploadComplete={(res) => {
              SetProductFile(res[0].url);
              toast.success("Your Product file has been uploaded");
            }}
            onUploadError={(error: Error) => {
              toast.error("Something went wrong, try again");
            }}
          />
          {state?.errors?.["productFile"]?.[0] && (
            <p className="text-destructive">
              {state.errors["productFile"][0]}
            </p>
          )}
        </div>
      </CardContent>
      <CardFooter className="mt-5">
        <Submitbutton title="Update Listing" />
      </CardFooter>
    </form>
  );
} 