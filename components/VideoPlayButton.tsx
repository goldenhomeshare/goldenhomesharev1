'use client';

import { useState, useEffect } from 'react';
import MuxPlayer from "@mux/mux-player-react";

interface VideoPlayButtonProps {
  playbackId: string;
}

export function VideoPlayButton({ playbackId }: VideoPlayButtonProps) {
  const [showModal, setShowModal] = useState(false);

  const handlePlay = () => {
    setShowModal(true);
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
      document.body.style.overflow = 'hidden';
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
      <button 
        className="bg-green-600 hover:bg-green-700 rounded-full p-8 md:p-12 shadow-2xl transition-all duration-300 hover:scale-105"
        onClick={handlePlay}
      >
        <svg className="w-12 h-12 md:w-16 md:h-16 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
          <path d="M8 5v14l11-7z"/>
        </svg>
      </button>

      {/* Video Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300"
            onClick={handleCloseModal}
          />
          
          {/* Modal Content */}
          <div className="relative w-full h-full max-w-4xl max-h-[70vh] mx-4 animate-in zoom-in-95 fade-in duration-500">
            <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-2xl">
              <MuxPlayer
                streamType="on-demand"
                playbackId={playbackId}
                autoPlay={true}
                muted={false}
                loop={false}
                metadataVideoTitle="Meet Golden HomeShare"
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
            
            {/* Close Button */}
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