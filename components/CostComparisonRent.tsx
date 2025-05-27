"use client";

import React, { useState } from 'react';

export function CostComparisonRent() {
  const [currentRent, setCurrentRent] = useState(1200);
  const [location, setLocation] = useState<"urban" | "suburban" | "rural">("urban");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
  const locationOptions = [
    { value: "urban", label: "Urban" },
    { value: "suburban", label: "Suburban" },
    { value: "rural", label: "Rural" }
  ];

  const selectedLocation = locationOptions.find(option => option.value === location);
  
  // Calculate costs based on user inputs
  const calculateSavings = () => {
    // Location multipliers for rent costs
    const locationMultipliers = {
      urban: 1.0,
      suburban: 0.8,
      rural: 0.6
    } as const;
    
    const adjustedRent = currentRent * locationMultipliers[location];
    const annualRentCost = adjustedRent * 12;
    
    // Golden HomeShare costs - flat $199 per month total
    const goldenHomeShareMonthly = 199; // $199 per month total
    const goldenHomeShareWeekly = goldenHomeShareMonthly / 4.33; // ~4.33 weeks per month
    const goldenHomeShareAnnual = goldenHomeShareMonthly * 12; // 12 months per year
    
    // Calculate savings
    const totalSavings = annualRentCost - goldenHomeShareAnnual;
    
    return {
      currentMonthlyCost: Math.round(adjustedRent),
      currentAnnualCost: Math.round(annualRentCost),
      goldenHomeShareWeekly: Math.round(goldenHomeShareWeekly),
      goldenHomeShareMonthly: goldenHomeShareMonthly,
      goldenHomeShareAnnual: goldenHomeShareAnnual,
      totalSavings: Math.round(totalSavings)
    };
  };
  
  const savings = calculateSavings();

  const costComparisonData = [
    {
      service: "Traditional Housing",
      monthlyRate: `$${savings.currentMonthlyCost.toLocaleString()}`,
      details: `Monthly rent in ${location} location`,
      weeklyEquivalent: `~$${Math.round(savings.currentMonthlyCost / 4.33).toLocaleString()}`,
      annualCost: `$${savings.currentAnnualCost.toLocaleString()}`
    },
    {
      service: "Golden HomeShare",
      monthlyRate: `$${savings.goldenHomeShareMonthly.toLocaleString()}`,
      details: "Matching support & platform access",
      weeklyEquivalent: `$${savings.goldenHomeShareWeekly.toLocaleString()}`,
      annualCost: `$${savings.goldenHomeShareAnnual.toLocaleString()}`
    }
  ];

  return (
    <section className="mb-16 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Unified Housing Cost Calculator */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
          {/* Header with Integrated Controls */}
          <div className="bg-gradient-to-r from-green-800 to-green-900 text-white px-6 py-6">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
              {/* Integrated Controls */}
              <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
                {/* Monthly Rent */}
                <div className="flex items-center gap-3">
                  <span className="text-white text-sm font-medium whitespace-nowrap">Monthly Rent:</span>
                  <input
                    type="number"
                    value={currentRent}
                    onChange={(e) => setCurrentRent(Math.max(100, parseInt(e.target.value) || 100))}
                    className="w-24 sm:w-28 h-10 px-3 text-center text-lg font-bold border-2 rounded-lg text-green-800 focus:outline-none focus:border-green-300 bg-white shadow-sm"
                    min="100"
                    step="50"
                  />
                </div>

                {/* Custom Location Dropdown */}
                <div className="flex items-center gap-3">
                  <span className="text-white text-sm font-medium whitespace-nowrap">Location:</span>
                  <div className="relative">
                    <button
                      onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                      className="px-4 py-3 text-base font-medium border-2 border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:border-green-300 bg-white shadow-sm min-w-[120px] flex items-center justify-between"
                    >
                      <span>{selectedLocation?.label}</span>
                      <svg
                        className={`w-4 h-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    
                    {isDropdownOpen && (
                      <div className="absolute top-full left-0 right-0 mt-1 bg-white border-2 border-gray-200 rounded-xl shadow-lg z-10">
                        {locationOptions.map((option) => (
                          <button
                            key={option.value}
                            onClick={() => {
                              setLocation(option.value as "urban" | "suburban" | "rural");
                              setIsDropdownOpen(false);
                            }}
                            className={`w-full px-4 py-3 text-left text-base font-medium hover:bg-gray-50 first:rounded-t-xl last:rounded-b-xl ${
                              location === option.value ? 'bg-green-50 text-green-700' : 'text-gray-900'
                            }`}
                          >
                            {option.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Comparison Cards */}
          <div className="p-3 md:p-6">
            <div className="grid md:grid-cols-2 gap-3 md:gap-6">
              {costComparisonData.map((item, index) => (
                <div 
                  key={index}
                  className={`relative p-3 md:p-6 rounded-xl border-2 transition-all duration-300 ${
                    item.service === "Golden HomeShare" 
                      ? "border-green-600 bg-green-50 shadow-lg md:transform md:scale-[1.02]" 
                      : "border-gray-200 bg-white hover:border-gray-300"
                  }`}
                >
                  {item.service === "Golden HomeShare" && (
                    <div className="absolute -top-2 left-2 md:-top-3 md:left-4 bg-green-600 text-white px-2 py-0.5 md:px-3 md:py-1 rounded-full text-xs font-semibold">
                      Recommended
                    </div>
                  )}
                  
                  <div className="text-center">
                    <h4 className={`text-sm md:text-lg font-bold mb-2 md:mb-4 ${
                      item.service === "Golden HomeShare" ? "text-green-800" : "text-gray-900"
                    }`}>
                      {item.service}
                    </h4>
                    
                    <div className={`text-2xl md:text-4xl font-bold mb-1 md:mb-2 ${
                      item.service === "Golden HomeShare" ? "text-green-700" : "text-gray-900"
                    }`}>
                      {item.monthlyRate}
                    </div>
                    <div className="text-xs md:text-sm text-gray-500 mb-2 md:mb-4">per month</div>
                    
                    <div className="space-y-1 md:space-y-3 text-xs md:text-sm">
                      <div className="flex justify-between items-center py-1 md:py-2 border-b border-gray-200">
                        <span className="text-gray-600">Details:</span>
                        <span className="font-medium text-right text-xs md:text-sm max-w-[60%]">{item.details}</span>
                      </div>
                      <div className="flex justify-between items-center py-1 md:py-2">
                        <span className="text-gray-600">Weekly Rate:</span>
                        <span className="font-medium text-right text-xs md:text-sm">{item.weeklyEquivalent}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Savings Summary */}
            <div className="mt-4 md:mt-8 text-center p-4 md:p-6 bg-gradient-to-r from-green-800 to-green-900 rounded-xl text-white">
              <h3 className="text-sm md:text-lg font-semibold mb-1 md:mb-2 text-green-100">Your Potential Annual Savings</h3>
              <div className="text-2xl md:text-3xl font-bold mb-1 md:mb-2 text-white">${savings.totalSavings.toLocaleString()}</div>
              <p className="text-green-200 text-xs md:text-sm">
                {savings.currentAnnualCost > 0 ? `That's ${Math.round((savings.totalSavings / savings.currentAnnualCost) * 100)}% savings ` : ''}plus community and safety benefits
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
} 