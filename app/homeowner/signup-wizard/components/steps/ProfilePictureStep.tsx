"use client";

import { useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Camera, Loader2, UserCircle } from "lucide-react";
import { useUploadThing } from "@/app/lib/uploadthing";
import Image from "next/image";
import React from "react";
import { toast } from "sonner";
import { WizardFormData } from "../HomeownerSignupWizard";

interface ProfilePictureStepProps {
  formData: WizardFormData;
  updateFormData: (updates: Partial<WizardFormData>) => void;
}

export function ProfilePictureStep({ formData, updateFormData }: ProfilePictureStepProps) {
  const { startUpload, isUploading } = useUploadThing("imageUploader", {
    onClientUploadComplete: (res) => {
      if (res && res[0]) {
        updateFormData({ profilePicture: res[0].url });
        toast.success("Profile picture uploaded successfully!");
      }
    },
    onUploadError: (error: Error) => {
      console.error("Upload error:", error);
      toast.error("Failed to upload image. Please try again.");
    },
  });

  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const ProfilePictureUpload = useCallback(({ currentPicture, onRemove }: { currentPicture: string; onRemove: () => void }) => {
    const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;

      // Check file size (8MB limit)
      const maxSize = 8 * 1024 * 1024; // 8MB in bytes
      if (file.size > maxSize) {
        toast.error("File size must be less than 8MB");
        return;
      }

      // Check file type
      if (!file.type.startsWith('image/')) {
        toast.error("Please select an image file");
        return;
      }

      try {
        await startUpload([file]);
      } catch (error) {
        console.error("Upload failed:", error);
        toast.error("Failed to upload image. Please try again.");
      }
      
      // Reset the input so the same file can be selected again
      event.target.value = '';
    };

    return (
      <div className="space-y-4">
        <div 
          className={`relative w-40 h-40 rounded-full overflow-hidden border-4 border-gray-200 cursor-pointer group hover:border-primary transition-colors mx-auto ${isUploading ? 'opacity-50' : ''}`}
          onClick={() => fileInputRef.current?.click()}
        >
          {currentPicture ? (
            <>
              <Image
                src={currentPicture}
                alt="Profile picture"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Camera className="w-10 h-10 text-white" />
              </div>
            </>
          ) : (
            <div className="w-full h-full bg-gray-100 flex flex-col items-center justify-center group-hover:bg-gray-200 transition-colors">
              {isUploading ? (
                <Loader2 className="w-12 h-12 text-gray-400 animate-spin" />
              ) : (
                <>
                  <UserCircle className="w-16 h-16 text-gray-400 mb-2" />
                  <span className="text-sm text-gray-500 text-center px-4">Click to add photo</span>
                </>
              )}
            </div>
          )}
        </div>
        
        {currentPicture && (
          <div className="text-center">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onRemove}
              disabled={isUploading}
            >
              Remove Picture
            </Button>
          </div>
        )}
        
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleUpload}
          className="hidden"
          disabled={isUploading}
        />
      </div>
    );
  }, [isUploading, startUpload]);

  const handleRemove = () => {
    updateFormData({ profilePicture: "" });
    toast.success("Profile picture removed");
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Add Your Profile Picture
        </h3>
        <p className="text-gray-600 mb-8">
          A good profile picture helps potential housemates get to know you better
        </p>
      </div>

      <div className="max-w-md mx-auto">
        <ProfilePictureUpload
          currentPicture={formData.profilePicture}
          onRemove={handleRemove}
        />
        
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            Adding a profile picture helps build trust with potential housemates
          </p>
          <p className="text-xs text-gray-400 mt-2">
            Maximum file size: 8MB • Supported formats: JPG, PNG, GIF, WebP
          </p>
        </div>
      </div>

      {/* Tips */}
      <div className="bg-primary/5 border border-primary/20 rounded-xl p-6">
        <h4 className="font-medium text-primary mb-3">Tips for a great profile picture:</h4>
        <ul className="text-sm text-gray-700 space-y-2">
          <li>• Use a clear, recent photo of yourself</li>
          <li>• Make sure your face is clearly visible</li>
          <li>• Choose a friendly, approachable expression</li>
          <li>• Avoid group photos or photos with sunglasses</li>
          <li>• Good lighting makes a big difference</li>
        </ul>
      </div>
    </div>
  );
} 