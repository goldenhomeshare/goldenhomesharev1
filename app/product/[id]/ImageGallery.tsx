"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

// Image Modal Component
function ImageModal({ 
  images, 
  currentIndex, 
  isOpen, 
  onClose, 
  onNext, 
  onPrevious 
}: {
  images: string[];
  currentIndex: number;
  isOpen: boolean;
  onClose: () => void;
  onNext: () => void;
  onPrevious: () => void;
}) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowRight') {
        onNext();
      } else if (e.key === 'ArrowLeft') {
        onPrevious();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, onNext, onPrevious]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-95 z-50 flex items-center justify-center">
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors z-10"
      >
        <X size={32} />
      </button>

      {/* Previous button */}
      {images.length > 1 && (
        <button
          onClick={onPrevious}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 transition-colors z-10"
        >
          <ChevronLeft size={48} />
        </button>
      )}

      {/* Next button */}
      {images.length > 1 && (
        <button
          onClick={onNext}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 transition-colors z-10"
        >
          <ChevronRight size={48} />
        </button>
      )}

      {/* Image */}
      <div className="relative max-w-[90vw] max-h-[90vh] w-full h-full">
        <Image
          src={images[currentIndex]}
          alt={`Property image ${currentIndex + 1}`}
          fill
          className="object-contain"
          priority
        />
      </div>

      {/* Image counter */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white bg-black bg-opacity-50 px-3 py-1 rounded">
        {currentIndex + 1} / {images.length}
      </div>
    </div>
  );
}

export default function ImageGallery({ images }: { images: string[] }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [mobileImageIndex, setMobileImageIndex] = useState(0);

  const openModal = (index: number) => {
    setCurrentImageIndex(index);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const previousImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const nextMobileImage = () => {
    setMobileImageIndex((prev) => (prev + 1) % images.length);
  };

  const previousMobileImage = () => {
    setMobileImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <>
      {/* Mobile Carousel (lg and below) */}
      <div className="lg:hidden relative">
        <div className="relative h-[70vh] w-full lg:rounded-lg overflow-hidden">
          <Image
            src={images[mobileImageIndex]}
            alt={`Property image ${mobileImageIndex + 1}`}
            fill
            className="object-cover cursor-pointer"
            onClick={() => openModal(mobileImageIndex)}
          />
          
          {/* Curved bottom overlay for smooth transition */}
          <div className="absolute bottom-0 left-0 right-0 h-8 bg-white rounded-t-3xl"></div>
          
          {/* Image counter for mobile */}
          <div className="absolute top-4 right-4 bg-black bg-opacity-70 text-white px-3 py-1.5 rounded-full text-sm font-medium">
            {mobileImageIndex + 1} / {images.length}
          </div>
          
          {/* Navigation buttons */}
          {images.length > 1 && (
            <>
              <button
                onClick={previousMobileImage}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-90 hover:bg-opacity-100 rounded-full p-2.5 shadow-lg transition-all"
              >
                <ChevronLeft size={22} className="text-gray-700" />
              </button>
              <button
                onClick={nextMobileImage}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-90 hover:bg-opacity-100 rounded-full p-2.5 shadow-lg transition-all"
              >
                <ChevronRight size={22} className="text-gray-700" />
              </button>
            </>
          )}
        </div>
      </div>

      {/* Desktop Grid Layout (lg and above) */}
      <div className="hidden lg:block">
        <div className="grid grid-cols-4 gap-2 h-[500px]">
          {/* Main large image */}
          {images && images.length > 0 && (
            <div 
              className="col-span-2 row-span-2 relative rounded-lg overflow-hidden cursor-pointer hover:opacity-90 transition-opacity"
              onClick={() => openModal(0)}
            >
              <Image
                src={images[0] as string}
                alt="Main property image"
                fill
                className="object-cover"
              />
            </div>
          )}
          
          {/* Smaller images grid */}
          {images && images.slice(1, 5).map((image, index) => (
            <div 
              key={index} 
              className="relative rounded-lg overflow-hidden cursor-pointer hover:opacity-90 transition-opacity"
              onClick={() => openModal(index + 1)}
            >
              <Image
                src={image as string}
                alt={`Property image ${index + 2}`}
                fill
                className="object-cover"
              />
              {/* Show "Show all photos" badge on last visible image if there are more */}
              {index === 3 && images && images.length > 5 && (
                <div className="absolute bottom-3 right-3 bg-white rounded-lg px-3 py-2 shadow-md border border-gray-200 flex items-center gap-2 hover:bg-gray-50 transition-colors">
                  <div className="grid grid-cols-3 gap-0.5 w-4 h-4">
                    <div className="w-1 h-1 bg-gray-700 rounded-sm"></div>
                    <div className="w-1 h-1 bg-gray-700 rounded-sm"></div>
                    <div className="w-1 h-1 bg-gray-700 rounded-sm"></div>
                    <div className="w-1 h-1 bg-gray-700 rounded-sm"></div>
                    <div className="w-1 h-1 bg-gray-700 rounded-sm"></div>
                    <div className="w-1 h-1 bg-gray-700 rounded-sm"></div>
                    <div className="w-1 h-1 bg-gray-700 rounded-sm"></div>
                    <div className="w-1 h-1 bg-gray-700 rounded-sm"></div>
                    <div className="w-1 h-1 bg-gray-700 rounded-sm"></div>
                  </div>
                  <span className="text-sm font-medium text-gray-700">Show all photos</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Modal */}
      <ImageModal
        images={images}
        currentIndex={currentImageIndex}
        isOpen={isModalOpen}
        onClose={closeModal}
        onNext={nextImage}
        onPrevious={previousImage}
      />
    </>
  );
} 