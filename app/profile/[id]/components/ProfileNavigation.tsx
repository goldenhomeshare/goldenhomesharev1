"use client";

import React from "react";

export function ProfileNavigation() {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const yOffset = -100;
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  return (
    <div className="sticky top-4 z-10 mb-8">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
        <div className="flex flex-wrap gap-2 justify-center">
          <button
            type="button"
            onClick={() => scrollToSection('about-section')}
            className="px-3 py-2 text-xs font-medium text-gray-600 hover:text-primary hover:bg-primary/5 rounded-lg transition-colors"
          >
            About
          </button>
          <button
            type="button"
            onClick={() => scrollToSection('preferences-section')}
            className="px-3 py-2 text-xs font-medium text-gray-600 hover:text-primary hover:bg-primary/5 rounded-lg transition-colors"
          >
            Preferences
          </button>
          <button
            type="button"
            onClick={() => scrollToSection('housing-section')}
            className="px-3 py-2 text-xs font-medium text-gray-600 hover:text-primary hover:bg-primary/5 rounded-lg transition-colors"
          >
            Housing
          </button>
          <button
            type="button"
            onClick={() => scrollToSection('lifestyle-section')}
            className="px-3 py-2 text-xs font-medium text-gray-600 hover:text-primary hover:bg-primary/5 rounded-lg transition-colors"
          >
            Lifestyle
          </button>
          <button
            type="button"
            onClick={() => scrollToSection('services-section')}
            className="px-3 py-2 text-xs font-medium text-gray-600 hover:text-primary hover:bg-primary/5 rounded-lg transition-colors"
          >
            Services
          </button>
        </div>
      </div>
    </div>
  );
} 