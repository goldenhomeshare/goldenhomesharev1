'use client';

import { useState, useEffect } from 'react';
import { Play, X } from 'lucide-react';

export function VideoModal() {
  const [showModal, setShowModal] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 640); // sm breakpoint is 640px
    };
    
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);
  
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
          {/* Single video container that adapts to screen size */}
          <div className={`flex items-center justify-center h-full ${isMobile ? 'p-4' : 'p-4'}`}>
            <div className={`relative w-full ${isMobile ? 'max-w-full' : 'max-w-2xl md:max-w-4xl lg:max-w-6xl'}`}>
              {/* Video container */}
              <div className={`relative bg-white overflow-hidden shadow-2xl ${isMobile ? 'rounded-lg' : 'rounded-2xl'}`}>
                <div className="relative w-full" style={{ aspectRatio: '16/9' }}>
                  <iframe
                    src="https://player.mux.com/02jjNf02t5q4b15cQRe02PVcJVYAJf33vU6zQLEf02Xy8Cs?metadata-video-title=Golden+HomeShare+Website+video+updated+&autoplay=1&controls=1"
                    className="w-full h-full"
                    style={{ border: 'none' }}
                    allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
                    allowFullScreen
                  />
                </div>
                
                {/* Close button overlay - positioned on top of video */}
                <button
                  onClick={() => setShowModal(false)}
                  className={`absolute ${isMobile ? 'top-3 right-3 px-3 py-2' : 'top-4 right-4 px-4 py-2'} text-white font-semibold rounded-full shadow-lg transition-all duration-300 hover:scale-105 hover:opacity-90 z-50`}
                  style={{ backgroundColor: '#c88e30' }}
                >
                  CLOSE
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
} 