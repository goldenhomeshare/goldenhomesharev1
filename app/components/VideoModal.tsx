'use client';

import { useState } from 'react';
import { Play, X } from 'lucide-react';

export function VideoModal() {
  const [showModal, setShowModal] = useState(false);
  
  return (
    <>
      <button 
        className="rounded-full p-8 md:p-12 shadow-2xl hover:scale-110 transition-all duration-300 group"
        style={{ backgroundColor: '#c88e30' }}
        onClick={() => setShowModal(true)}
      >
        <Play size={64} className="text-white ml-1 md:w-20 md:h-20" fill="currentColor" />
      </button>

      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm">
          {/* Mobile: Full screen approach */}
          <div className="sm:hidden flex flex-col h-full p-2">
            {/* Close button at top */}
            <div className="flex justify-end mb-2">
              <button
                onClick={() => setShowModal(false)}
                className="text-white font-semibold px-4 py-2 rounded-full shadow-lg"
                style={{ backgroundColor: '#c88e30' }}
              >
                ✕
              </button>
            </div>
            
            {/* Video takes remaining space */}
            <div className="flex-1 flex items-center justify-center">
              <div className="relative w-full bg-white rounded-lg overflow-hidden shadow-2xl">
                <div className="relative w-full" style={{ aspectRatio: '16/9' }}>
                  <iframe
                    src="https://player.mux.com/02jjNf02t5q4b15cQRe02PVcJVYAJf33vU6zQLEf02Xy8Cs?metadata-video-title=Golden+HomeShare+Website+video+updated+&autoplay=1&controls=0&background=1"
                    className="w-full h-full"
                    style={{ border: 'none' }}
                    allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
                    allowFullScreen
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Desktop/Tablet: Centered approach */}
          <div className="hidden sm:flex items-center justify-center h-full p-4">
            <div className="relative w-full max-w-2xl md:max-w-4xl lg:max-w-6xl">
              {/* Close button bubble above video */}
              <div className="flex justify-end mb-4">
                <button
                  onClick={() => setShowModal(false)}
                  className="text-white font-semibold px-4 py-2 rounded-full shadow-lg transition-all duration-300 hover:scale-105 hover:opacity-90"
                  style={{ backgroundColor: '#c88e30' }}
                >
                  CLOSE
                </button>
              </div>
              
              {/* Video container */}
              <div className="relative bg-white rounded-2xl overflow-hidden shadow-2xl">
                <div className="relative w-full" style={{ aspectRatio: '16/9' }}>
                  <iframe
                    src="https://player.mux.com/02jjNf02t5q4b15cQRe02PVcJVYAJf33vU6zQLEf02Xy8Cs?metadata-video-title=Golden+HomeShare+Website+video+updated+&autoplay=1&controls=0&background=1"
                    className="w-full h-full"
                    style={{ border: 'none' }}
                    allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
                    allowFullScreen
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
} 