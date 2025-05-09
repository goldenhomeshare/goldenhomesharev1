import Link from "next/link";
import { Upload, Image, ImagePlus, Check, Home, AlertTriangle } from "lucide-react";

export default function PropertyPhotosPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      {/* Testing Notice Banner */}
      <div className="bg-amber-50 border-l-4 border-amber-400 p-4 mb-8 rounded-md">
        <div className="flex">
          <div className="flex-shrink-0">
            <AlertTriangle className="h-5 w-5 text-amber-400" aria-hidden="true" />
          </div>
          <div className="ml-3">
            <p className="text-sm text-amber-700">
              <span className="font-medium">Testing Mode:</span> This onboarding flow is currently being tested. Any information entered is only for experience evaluation and will not be saved.
            </p>
          </div>
        </div>
      </div>
      
      <div className="mb-6 text-center">
        <h1 className="text-3xl font-bold mb-2">Property Photos</h1>
        <p className="text-muted-foreground">
          Upload photos of your property to attract potential housemates
        </p>
      </div>

      <div className="bg-white shadow-lg rounded-lg p-8 mb-10">
        {/* Photo upload section */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-4">Upload Photos</h2>
          <p className="text-sm text-slate-600 mb-6">
            High-quality photos help your listing stand out. We recommend uploading at least 5 photos.
          </p>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
            {/* Main photo upload */}
            <div className="border-2 border-dashed border-slate-300 rounded-lg p-4 flex flex-col items-center justify-center h-48 bg-slate-50 hover:bg-slate-100 cursor-pointer">
              <ImagePlus size={36} className="text-slate-400 mb-2" />
              <p className="text-sm text-center text-slate-600">Upload main photo</p>
              <p className="text-xs text-center text-slate-500">This will be your featured image</p>
            </div>
            
            {/* Additional photo uploads */}
            {[1, 2, 3, 4, 5].map((index) => (
              <div 
                key={index}
                className="border-2 border-dashed border-slate-300 rounded-lg p-4 flex flex-col items-center justify-center h-48 bg-slate-50 hover:bg-slate-100 cursor-pointer"
              >
                <Upload size={36} className="text-slate-400 mb-2" />
                <p className="text-sm text-center text-slate-600">Add photo</p>
              </div>
            ))}
          </div>
          
          <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
            <h3 className="font-medium mb-2">Photo tips:</h3>
            <ul className="text-sm text-slate-600 space-y-1">
              <li className="flex items-start">
                <Check size={16} className="text-primary mt-0.5 mr-2 flex-shrink-0" />
                <span>Include photos of all rooms available to the housemate</span>
              </li>
              <li className="flex items-start">
                <Check size={16} className="text-primary mt-0.5 mr-2 flex-shrink-0" />
                <span>Take photos in daylight with good lighting</span>
              </li>
              <li className="flex items-start">
                <Check size={16} className="text-primary mt-0.5 mr-2 flex-shrink-0" />
                <span>Show common areas like kitchen, living room, and outdoor space</span>
              </li>
              <li className="flex items-start">
                <Check size={16} className="text-primary mt-0.5 mr-2 flex-shrink-0" />
                <span>Highlight special features of your home</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Navigation buttons */}
        <div className="pt-6 flex justify-between">
          <Link
            href="/test-onboarding-flow/homeowner/household-help"
            className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Back
          </Link>
          <Link
            href="/test-onboarding-flow/homeowner/confirmation"
            className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
          >
            Continue
          </Link>
        </div>
      </div>
    </div>
  );
} 