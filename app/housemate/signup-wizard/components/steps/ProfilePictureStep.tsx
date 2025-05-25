"use client";

import { useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Camera, Loader2, UserCircle } from "lucide-react";
import { useUploadThing } from "@/app/lib/uploadthing";
import Image from "next/image";
import React from "react";
import { toast } from "sonner";
import { WizardFormData } from "../HousemateSignupWizard";

interface ProfilePictureStepProps {
  formData: WizardFormData;
  updateFormData: (updates: Partial<WizardFormData>) => void;
}

export function ProfilePictureStep({ formData, updateFormData }: ProfilePictureStepProps) {
  const ProfilePictureUpload = useCallback(({ currentPicture, onUploadComplete, onRemove }: { currentPicture: string; onUploadComplete: (url: string) => void; onRemove: () => void }) => {
    const { startUpload, isUploading } = useUploadThing("profilePictureUpload", {
      onClientUploadComplete: (res) => {
        if (res && res[0]) {
          onUploadComplete(res[0].url);
        }
      },
      onUploadError: (error: Error) => {
        toast.error("Upload failed. Please try again.");
      },
    });

    const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file) {
        await startUpload([file]);
      }
      // Reset the input so the same file can be selected again
      event.target.value = '';
    };

    const fileInputRef = React.useRef<HTMLInputElement>(null);

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
  }, []);

  const handleUploadComplete = (url: string) => {
    updateFormData({ profilePicture: url });
    toast.success("Profile picture uploaded successfully!");
  };

  const handleRemove = () => {
    updateFormData({ profilePicture: "" });
    toast.success("Profile picture removed");
  };

  return (
    <div className="space-y-8">
      <div className="max-w-md mx-auto">
        <ProfilePictureUpload
          currentPicture={formData.profilePicture}
          onUploadComplete={handleUploadComplete}
          onRemove={handleRemove}
        />
        
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            Adding a profile picture helps build trust with potential homeowners
          </p>
          <p className="text-xs text-gray-400 mt-2">
            Maximum file size: 2MB • Supported formats: JPG, PNG, GIF
          </p>
        </div>
      </div>
    </div>
  );
} 