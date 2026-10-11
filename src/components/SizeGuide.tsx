import React, { useState } from 'react';
import { ShieldCheck, Ruler, Truck, RotateCcw, CheckCircle2 } from 'lucide-react';

interface SizeOption {
  tier: string;
  weightCapacity: string;
  vehicleType: string;
  idealBreeds: string;
  dimensions: string;
  badge: string;
}

export const SizeGuide: React.FC = () => {
  const [selectedTier, setSelectedTier] = useState<number>(0);

  const sizes: SizeOption[] = [
    {
      tier: "Standard Compact",
      weightCapacity: "Up to 150 lbs",
      vehicleType: "Sedans, Hatchbacks & Compact SUVs",
      idealBreeds: "Beagles, French Bulldogs, Border Collies, Spaniels",
      dimensions: "62\" L x 16\" W x 4\" H (Folded: 31\")",
      badge: "Best Seller"
    },
    {
      tier: "Heavy-Duty Extended",
      weightCapacity: "Up to 250 lbs",
      vehicleType: "Full-Size SUVs, Trucks & Lifted Vehicles",
      idealBreeds: "German Shepherds, Golden Retrievers, Mastiffs, Labs",
      dimensions: "70\" L x 18\" W x 4\" H (Folded: 35\")",
      badge: "Maximum Reach"
    }
  ];

  return (
    <section className="py-16 px-4 md:px-8 bg-gradient-to-b from-stone-50 to-white text-stone-900 font-sans">
      <div className="max-w-5xl mx-auto">
        <div className="text-center space-y-3 mb-12">
          {/* Precision Fit Selector Header */}
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wider uppercase bg-amber-100 text-amber-800">
            <Ruler className="w-3.5 h-3.5" /> Precision Fit System
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-stone-900">
            Find the Perfect Fit for Your Companion
          </h2>
          <p className="max-w-xl mx-auto text-stone-600 text-sm md:text-base">
            Engineered with precise geometric angles to ensure a safe, gentle slope for effortless vehicle entry.
          </p>
        </div>

        {/* Symmetric Dual Column Size Selector Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          {sizes.map((item, idx) => {
            const isSelected = selectedTier === idx;
            return (
              <div
                key={idx}
                onClick={() => setSelectedTier(idx)}
                className={`relative cursor-pointer rounded-2xl p-6 md:p-8 transition-all duration-300 border-2 flex flex-col justify-between ${
                  isSelected
                    ? 'border-stone-900 bg-white shadow-xl shadow-stone-200/50 scale-[1.02]'
                    : 'border-stone-200 bg-stone-50/50 hover:border-stone-300'
                }`}
              >
                {item.badge && (
                  <span className="absolute top-4 right-4 bg-stone-900 text-white text-[10px] uppercase tracking-widest px-2.5 py-1 rounded-md font-bold">
                    {item.badge}
                  </span>
                )}

                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center border ${isSelected ? 'border-stone-900 bg-stone-900 text-white' : 'border-stone-400'}`}>
                      {isSelected && <CheckCircle2 className="w-3.5 h-3.5" />}
                    </div>
                    <h3 className="text-xl font-bold text-stone-900">{item.tier}</h3>
                  </div>
                  <p className="text-sm text-stone-500 mb-6">{item.vehicleType}</p>

                  <div className="space-y-3 border-t border-stone-100 pt-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-stone-500 font-medium">Weight Capacity:</span>
                      <span className="font-bold text-stone-900">{item.weightCapacity}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-stone-500 font-medium">Open Dimensions:</span>
                      <span className="font-semibold text-stone-800 text-right">{item.dimensions}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-stone-100">
                  <span className="text-xs font-semibold text-stone-400 uppercase tracking-wider block mb-1">Recommended For:</span>
                  <p className="text-xs text-stone-700 font-medium">{item.idealBreeds}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Geometric Trust Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-stone-900 text-stone-100 p-6 rounded-2xl shadow-lg">
          <div className="flex items-center gap-3.5 p-2">
            <ShieldCheck className="w-8 h-8 text-amber-400 shrink-0" />
            <div>
              <h4 className="text-sm font-bold">30-Day Risk-Free Trial</h4>
              <p className="text-xs text-stone-400">Test it out with your dog in your own car.</p>
            </div>
          </div>
          <div className="flex items-center gap-3.5 p-2 border-t sm:border-t-0 sm:border-l border-stone-800 sm:pl-6">
            <Truck className="w-8 h-8 text-amber-400 shrink-0" />
            <div>
              <h4 className="text-sm font-bold">Express Insured Shipping</h4>
              <p className="text-xs text-stone-400">Directly from our domestic fulfillment centers.</p>
            </div>
          </div>
          <div className="flex items-center gap-3.5 p-2 border-t sm:border-t-0 sm:border-l border-stone-800 sm:pl-6">
            <RotateCcw className="w-8 h-8 text-amber-400 shrink-0" />
            <div>
              <h4 className="text-sm font-bold">Hassle-Free Returns</h4>
              <p className="text-xs text-stone-400">Easy prepaid return labels if needed.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};