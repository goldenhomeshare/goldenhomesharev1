"use client";

import React, { useState } from 'react';

export function CostComparisonSupport() {
  const [hoursPerWeek, setHoursPerWeek] = useState(5);
  
  // Calculate costs based on user inputs
  const calculateCosts = () => {
    const privateHomecareHourlyRate = 36; // $36/hour
    // Overnight care is standard for comparison since Golden HomeShare includes it
    const overnightRatePrivate = 1750; // $1,750 per week (7 nights)
    
    const privateHomecareWeekly = (hoursPerWeek * privateHomecareHourlyRate) + overnightRatePrivate;
    
    // Golden HomeShare base cost includes nightlight support (basic presence and safety monitoring)
    const baseCostWithNightlightSupport = 99; // Base weekly rate includes nightlight support
    const additionalSupportCost = hoursPerWeek > 0 ? 0 : 0; // Up to 10 hours included in base price
    const goldenHomeShareWeekly = baseCostWithNightlightSupport + additionalSupportCost;
    
    return {
      privateHomecare: {
        weekly: Math.round(privateHomecareWeekly),
        yearly: Math.round(privateHomecareWeekly * 52)
      },
      goldenHomeShare: {
        weekly: goldenHomeShareWeekly,
        yearly: goldenHomeShareWeekly * 52
      }
    };
  };
  
  const costs = calculateCosts();
  const maxSavings = costs.privateHomecare.yearly - costs.goldenHomeShare.yearly;
  
  const costComparisonData = [
    {
      service: "Private Homecare Provider",
      hoursPerWeek: `${hoursPerWeek} hrs/week @ $36/hr`,
      overnightRate: "$1,750/week ($250/night × 7 nights)",
      costPerWeek: `$${costs.privateHomecare.weekly.toLocaleString()}`,
      costPerYear: `$${costs.privateHomecare.yearly.toLocaleString()}`
    },
    {
      service: "Golden HomeShare",
      hoursPerWeek: "Up to 10 hrs/week included",
      overnightRate: "Nightlight support & presence included",
      costPerWeek: `$${costs.goldenHomeShare.weekly}`,
      costPerYear: `$${costs.goldenHomeShare.yearly.toLocaleString()}`
    }
  ];

  return (
    <section className="mb-16 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Unified Cost Comparison Component */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
          {/* Header with Integrated Controls */}
          <div className="bg-gradient-to-r from-green-800 to-green-900 text-white px-6 py-6">
            <div className="flex items-center justify-center">
              {/* Centered Hour Selector */}
              <div className="flex items-center gap-4">
                <span className="text-white text-sm font-medium whitespace-nowrap">Hours needed per week:</span>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setHoursPerWeek(Math.max(0, hoursPerWeek - 1))}
                    className="w-10 h-10 rounded-full bg-white text-green-800 font-bold text-lg hover:bg-green-50 transition-colors shadow-sm"
                  >
                    -
                  </button>
                  <div className="w-16 h-10 flex items-center justify-center bg-white rounded-lg text-green-800 font-bold text-xl shadow-sm">
                    {hoursPerWeek}
                  </div>
                  <button
                    onClick={() => setHoursPerWeek(Math.min(10, hoursPerWeek + 1))}
                    className="w-10 h-10 rounded-full bg-white text-green-800 font-bold text-lg hover:bg-green-50 transition-colors shadow-sm"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Comparison Table */}
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
                      {item.costPerWeek}
                    </div>
                    <div className="text-xs md:text-sm text-gray-500 mb-2 md:mb-4">per week</div>
                    
                    <div className="space-y-1 md:space-y-3 text-xs md:text-sm">
                      <div className="flex justify-between items-center py-1 md:py-2 border-b border-gray-200">
                        <span className="text-gray-600">Support Hours:</span>
                        <span className="font-medium text-right text-xs md:text-sm">{item.hoursPerWeek}</span>
                      </div>
                      <div className="flex justify-between items-center py-1 md:py-2">
                        <span className="text-gray-600">Overnight Care:</span>
                        <span className="font-medium text-right text-xs md:text-sm max-w-[60%]">{item.overnightRate}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Savings Summary */}
            <div className="mt-4 md:mt-8 text-center p-4 md:p-6 bg-gradient-to-r from-green-800 to-green-900 rounded-xl text-white">
              <h3 className="text-sm md:text-lg font-semibold mb-1 md:mb-2 text-green-100">Your Potential Annual Savings</h3>
              <div className="text-2xl md:text-3xl font-bold mb-1 md:mb-2 text-white">${maxSavings.toLocaleString()}</div>
              <p className="text-green-200 text-xs md:text-sm">
                Plus invaluable companionship and community support
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
} 