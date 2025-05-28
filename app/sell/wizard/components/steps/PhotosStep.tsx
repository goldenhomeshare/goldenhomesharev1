"use client";

import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { useUploadThing } from "@/app/lib/uploadthing";
import { useDropzone } from "@uploadthing/react";
import { generateClientDropzoneAccept, generatePermittedFileTypes } from "uploadthing/client";
import { Plus, Upload, X, Camera } from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";
import { WizardFormData } from "../ListingWizard";

interface PhotosStepProps {
  formData: WizardFormData;
  updateFormData: (data: Partial<WizardFormData>) => void;
}

export function PhotosStep({ formData, updateFormData }: PhotosStepProps) {
  const [selectedImageModal, setSelectedImageModal] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);

  const { startUpload, routeConfig, isUploading } = useUploadThing("imageUploader", {
    onClientUploadComplete: (res: { url: string }[]) => {
      const newImages = res.map((item: { url: string }) => item.url);
      const updatedImages = [...formData.images, ...newImages];
      updateFormData({ images: updatedImages });
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

  const removeImage = (index: number) => {
    const updatedImages = formData.images.filter((_, i) => i !== index);
    updateFormData({ images: updatedImages });
    toast.success("Image removed");
  };

  const removeAllImages = () => {
    updateFormData({ images: [] });
    toast.success("All images removed");
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <Camera className="w-8 h-8 text-primary" />
        </div>
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">
          Add photos of your space
        </h2>
        <p className="text-gray-600">
          High-quality photos help your listing stand out and attract the right housemates
        </p>
      </div>

      {formData.images && formData.images.length > 0 ? (
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
                          Add more photos
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          Images up to 4MB, max 10 total
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
                onClick={removeAllImages}
              >
                Remove All Images
              </Button>
            </div>
          </div>
          
          {/* Images Grid - Right Side */}
          <div className="flex-1">
            <div className="space-y-4">
              <div className="text-sm text-gray-600">
                Click on images to view full size, or hover to remove individual images:
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {formData.images.map((imageUrl, index) => (
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
                        removeImage(index);
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

      {/* Photo Tips */}
      <div className="bg-primary/5 border border-primary/20 rounded-xl p-6">
        <h3 className="font-medium text-primary mb-3">📸 Photo Tips</h3>
        <ul className="space-y-2 text-sm text-gray-700">
          <li className="flex items-start gap-2">
            <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></span>
            <span>Include photos of the bedroom, bathroom, common areas, and exterior</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></span>
            <span>Take photos during daytime with good natural lighting</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></span>
            <span>Clean and declutter spaces before photographing</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></span>
            <span>Show the space from different angles to give a complete view</span>
          </li>
        </ul>
      </div>

      {formData.images.length > 0 && (
        <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-xl">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
              <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
              </svg>
            </div>
            <span className="text-sm font-medium text-green-800">
              Excellent! You've added {formData.images.length} photo{formData.images.length !== 1 ? 's' : ''}.
            </span>
          </div>
        </div>
      )}

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
    </div>
  );
} 