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
import { useEffect, useState, useCallback } from "react";
import { useActionState} from "react";
import { toast } from "sonner";
import { SelectCategory } from "../SelectCategory";
import { Textarea } from "@/components/ui/textarea";
import { TipTapEditor } from "../Editor";
import { UploadDropzone } from "@/app/lib/uploadthing";
import { Submitbutton } from "../SubmitButtons";
import { Bath, Car, Wifi, Utensils, Tv, Snowflake, Sun, Home, DoorOpen, WashingMachine, Armchair, Briefcase, Sparkles, Salad, Flower, ShoppingBag, HeartHandshake, Cat, Wrench, Shield, Clock, VolumeX, Cigarette, CigaretteOff, Wine, GlassWater, Users, UserMinus, X, Plus, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useDropzone } from "@uploadthing/react";
import { generateClientDropzoneAccept, generatePermittedFileTypes } from "uploadthing/client";
import { useUploadThing } from "@/app/lib/uploadthing";

export function SellForm() {
  const initalState: State = { message: "", status: undefined };
  const [state, formAction] = useActionState (SellProduct, initalState);
  const [json, setJson] = useState<null | JSONContent>(null);
  const [images, setImages] = useState<null | string[]>(null);
  const [productFile, SetProductFile] = useState<null | string>(null);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [selectedSupport, setSelectedSupport] = useState<Array<{id: string, hoursPerWeek: number}>>([]);
  const [selectedHouseRules, setSelectedHouseRules] = useState<Array<{id: string, value?: string}>>([]);
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
                <div key={ruleOpt.id} className="border border-gray-200 rounded-lg p-6 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center">
                      <Icon size={24} className="text-slate-600" />
                    </div>
                    <Label className="text-base font-medium">{ruleOpt.label}</Label>
                  </div>
                  
                  {ruleOpt.options ? (
                    <div className="space-y-2">
                      {ruleOpt.options.map((option) => {
                        const isOptionSelected = selectedRule?.value === option.value;
                        
                        return (
                          <div key={option.value}>
                            <label className="cursor-pointer">
                              <input
                                type="radio"
                                name={`house-rule-${ruleOpt.id}`}
                                className="sr-only peer"
                                checked={isOptionSelected}
                                onChange={() => toggleHouseRule(ruleOpt.id, option.value)}
                              />
                              <div className="flex items-center p-3 rounded-lg border peer-checked:border-primary peer-checked:bg-primary/5 hover:bg-slate-50 transition-colors">
                                <div className="flex-1">
                                  <span className="font-medium text-sm">{option.label}</span>
                                </div>
                                <div className={`w-4 h-4 rounded-full border-2 transition-colors ${
                                  isOptionSelected 
                                    ? 'border-primary bg-primary' 
                                    : 'border-gray-300'
                                }`}>
                                  {isOptionSelected && (
                                    <div className="w-full h-full rounded-full bg-white scale-50"></div>
                                  )}
                                </div>
                              </div>
                            </label>
                          </div>
                        );
                      })}
                      
                      {selectedRule && (
                        <div className="mt-3">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => toggleHouseRule(ruleOpt.id)}
                            className="text-xs"
                          >
                            Clear Selection
                          </Button>
                        </div>
                      )}
                    </div>
                  ) : ruleOpt.hasCustomInput ? (
                    <div className="space-y-3">
                      <label className="cursor-pointer">
                        <input
                          type="checkbox"
                          className="sr-only peer"
                          checked={isSelected}
                          onChange={() => {
                            if (isSelected) {
                              toggleHouseRule(ruleOpt.id);
                            } else {
                              toggleHouseRule(ruleOpt.id, ruleOpt.defaultValue);
                            }
                          }}
                        />
                        <div className="flex items-center p-3 rounded-lg border peer-checked:border-primary peer-checked:bg-primary/5 hover:bg-slate-50 transition-colors">
                          <div className="flex-1">
                            <span className="font-medium text-sm">Enable quiet hours</span>
                          </div>
                          <div className={`w-4 h-4 rounded border transition-colors ${
                            isSelected 
                              ? 'border-primary bg-primary' 
                              : 'border-gray-300'
                          }`}>
                            {isSelected && (
                              <svg className="w-3 h-3 text-white ml-0.5 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                              </svg>
                            )}
                          </div>
                        </div>
                      </label>
                      
                      {isSelected && (
                        <div className="ml-3">
                          <Label className="text-sm text-muted-foreground mb-2 block">
                            Specify quiet hours:
                          </Label>
                          <Input
                            type="text"
                            value={selectedRule?.value || ""}
                            onChange={(e) => updateHouseRuleValue(ruleOpt.id, e.target.value)}
                            placeholder={ruleOpt.defaultValue}
                            className="px-3 py-2 text-sm border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200"
                          />
                        </div>
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
          <Label>Listing Images</Label>
          
          {images && images.length > 0 ? (
            <div className="flex flex-col lg:flex-row gap-6">
              {/* Upload Zone - Left Side */}
              <div className="lg:w-80 flex-shrink-0">
                <div className="space-y-4">
                  {/* Custom Upload Card */}
                  <div
                    {...getRootProps()}
                    className={`
                      border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
                      ${isDragActive 
                        ? 'border-primary bg-primary/5' 
                        : isUploading 
                        ? 'border-gray-300 cursor-not-allowed bg-gray-50' 
                        : 'border-gray-300 hover:border-primary hover:bg-gray-50'
                      }
                    `}
                  >
                    <input {...getInputProps()} disabled={isUploading} />
                    <div className="flex flex-col items-center gap-3">
                      {isUploading ? (
                        <>
                          <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                            <Upload className="w-6 h-6 text-primary animate-pulse" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              Uploading...
                            </p>
                            {uploadProgress > 0 && (
                              <div className="mt-2">
                                <div className="flex justify-between items-center mb-1">
                                  <span className="text-xs text-gray-600">
                                    Progress
                                  </span>
                                  <span className="text-xs text-primary font-medium">{uploadProgress}%</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-1.5">
                                  <div 
                                    className="bg-primary h-1.5 rounded-full transition-all duration-300"
                                    style={{ width: `${uploadProgress}%` }}
                                  ></div>
                                </div>
                              </div>
                            )}
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center">
                            <Plus className="w-6 h-6 text-gray-600" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              Add photos
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              Images up to 4MB, max 10
                            </p>
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    disabled={isUploading}
                    onClick={() => {
                      setImages(null);
                      toast.success("All images removed");
                    }}
                  >
                    Remove All Images
                  </Button>
                </div>
              </div>
              
              {/* Images Grid - Right Side */}
              <div className="flex-1">
                <div className="space-y-4">
                  <div className="text-sm text-muted-foreground">
                    Click on images to view full size, or hover to remove individual images:
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {images.map((imageUrl, index) => (
                      <div key={index} className="relative group">
                        <div 
                          className="relative w-full h-32 rounded-lg overflow-hidden border border-gray-200 cursor-pointer hover:border-primary transition-colors"
                          onClick={() => setSelectedImageModal(imageUrl)}
                        >
                          <Image
                            src={imageUrl}
                            alt={`Property image ${index + 1}`}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          className="absolute top-2 right-2 w-6 h-6 p-0 opacity-70 md:opacity-0 md:group-hover:opacity-100 transition-opacity hover:opacity-100"
                          onClick={(e) => {
                            e.stopPropagation();
                            setImages(prev => prev ? prev.filter((_, i) => i !== index) : null);
                            toast.success("Image removed");
                          }}
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* Initial Upload Card */
            <div
              {...getRootProps()}
              className={`
                border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-colors
                ${isDragActive 
                  ? 'border-primary bg-primary/5' 
                  : isUploading 
                  ? 'border-gray-300 cursor-not-allowed bg-gray-50' 
                  : 'border-gray-300 hover:border-primary hover:bg-gray-50'
                }
              `}
            >
              <input {...getInputProps()} disabled={isUploading} />
              <div className="flex flex-col items-center gap-4">
                {isUploading ? (
                  <>
                    <div className="w-16 h-16 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Upload className="w-8 h-8 text-primary animate-pulse" />
                    </div>
                    <div>
                      <p className="text-lg font-medium text-gray-900">
                        Uploading...
                      </p>
                      {uploadProgress > 0 && (
                        <div className="mt-3 max-w-sm">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-sm text-gray-600">
                              Upload Progress
                            </span>
                            <span className="text-sm text-primary font-medium">{uploadProgress}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-primary h-2 rounded-full transition-all duration-300"
                              style={{ width: `${uploadProgress}%` }}
                            ></div>
                          </div>
                        </div>
                      )}
                    </div>
                  </>
                ) : (
                  <>
                    <div className="w-16 h-16 rounded-lg bg-gray-100 flex items-center justify-center">
                      <Plus className="w-8 h-8 text-gray-600" />
                    </div>
                    <div>
                      <p className="text-lg font-medium text-gray-900">
                        Add photos
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        Click to select or drag and drop images
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        Images up to 4MB, max 10
                      </p>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}
          
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
            config={{ mode: "auto" }}
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

      {/* Full Size Image Modal */}
      {selectedImageModal && (
        <div 
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedImageModal(null)}
        >
          <div className="relative max-w-4xl max-h-full">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              className="absolute top-4 right-4 z-10"
              onClick={() => setSelectedImageModal(null)}
            >
              <X className="w-4 h-4" />
            </Button>
            <Image
              src={selectedImageModal}
              alt="Full size property image"
              width={800}
              height={600}
              className="max-w-full max-h-full object-contain rounded-lg"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}
    </form>
  );
}