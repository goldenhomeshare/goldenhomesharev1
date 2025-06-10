'use client';

import { useState, useEffect } from 'react';
import MuxPlayer from "@mux/mux-player-react";
import { Play, X } from 'lucide-react';

interface VideoSectionProps {
  playbackId: string;
  title?: string;
  description?: string;
  thumbnailUrl?: string;
  autoplay?: boolean;
  muted?: boolean;
  loop?: boolean;
}

export function VideoSection({ 
  playbackId, 
  title, 
  description, 
  thumbnailUrl = "/video-thumbnail.jpg",
  autoplay = false,
  muted = true,
  loop = false 
}: VideoSectionProps) {
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handlePlayClick = () => {
    setIsLoading(true);
    // Small delay for smooth transition
    setTimeout(() => {
      setShowModal(true);
      setIsLoading(false);
    }, 300);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  // Handle escape key to close modal
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && showModal) {
        handleCloseModal();
      }
    };

    if (showModal) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden'; // Prevent background scrolling
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [showModal]);

  return (
    <>
      <section className="px-4 md:px-8 pt-24 pb-16 bg-white">
        <div className="max-w-6xl mx-auto">
          {title && (
            <div className="text-center mb-8">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                {title}
              </h2>
              {description && (
                <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                  {description}
                </p>
              )}
            </div>
          )}
          
          <div className="relative w-full max-w-5xl mx-auto">
            <div className="relative aspect-video rounded-3xl overflow-hidden shadow-2xl bg-black group cursor-pointer">
              {/* Custom Thumbnail with Smooth Play Button */}
              <div 
                className="relative w-full h-full transition-all duration-500 ease-out group-hover:scale-[1.02]" 
                onClick={handlePlayClick}
              >
                <img
                  src={thumbnailUrl}
                  alt={title || "Video thumbnail"}
                  className="w-full h-full object-cover transition-all duration-700 ease-out group-hover:scale-105"
                />
                
                {/* Gradient Overlay for better text/button visibility */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20 transition-all duration-500 group-hover:from-black/50 group-hover:to-black/30" />
                
                {/* Play Button - Smooth and Professional */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className={`
                    relative bg-white/95 backdrop-blur-sm rounded-full p-8 shadow-2xl
                    transform transition-all duration-500 ease-out
                    ${isLoading ? 'scale-95 opacity-75' : 'group-hover:scale-110 group-hover:bg-white'}
                    group-hover:shadow-3xl
                  `}>
                    {isLoading ? (
                      // Loading spinner
                      <div className="w-12 h-12 border-3 border-primary/30 border-t-primary rounded-full animate-spin" />
                    ) : (
                      <Play 
                        size={48} 
                        className="text-primary ml-1 transition-all duration-300 group-hover:text-primary/90" 
                        fill="currentColor"
                      />
                    )}
                    
                    {/* Ripple effect on hover */}
                    <div className="absolute inset-0 rounded-full bg-primary/10 scale-0 group-hover:scale-150 transition-transform duration-700 ease-out -z-10" />
                  </div>
                </div>
              </div>
            </div>
            
            {/* Decorative elements */}
            <div className="absolute -inset-4 bg-gradient-to-r from-primary/5 via-transparent to-primary/5 rounded-3xl -z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
          </div>
        </div>
      </section>

      {/* Video Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300"
            onClick={handleCloseModal}
          />
          
          {/* Modal Content */}
          <div className="relative w-full h-full max-w-6xl max-h-[90vh] mx-4 animate-in zoom-in-95 fade-in duration-500">
            <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-2xl">
              <MuxPlayer
                streamType="on-demand"
                playbackId={playbackId}
                autoPlay={true}
                muted={muted}
                loop={loop}
                metadataVideoTitle={title || "Golden HomeShare Video"}
                metadataViewerUserId="anonymous"
                primaryColor="#6366f1"
                secondaryColor="#f8fafc"
                accentColor="#3b82f6"
                className="w-full h-full"
                style={{
                  height: '100%',
                  maxWidth: '100%',
                } as React.CSSProperties}
                preload="metadata"
                crossOrigin="anonymous"
              />
            </div>
            
            {/* Close Button - Top Right, Outside Video */}
            <button
              onClick={handleCloseModal}
              className="absolute -top-4 -right-4 bg-white hover:bg-gray-50 backdrop-blur-sm rounded-full px-6 py-3 shadow-lg transition-all duration-300 hover:scale-105 group"
              aria-label="Close video"
            >
              <span className="text-gray-700 group-hover:text-gray-900 font-semibold text-sm tracking-wider">
                CLOSE
              </span>
            </button>
          </div>
        </div>
      )}
    </>
  );
} 