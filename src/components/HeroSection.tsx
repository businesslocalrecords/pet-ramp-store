import React from 'react';
import { ArrowRight } from 'lucide-react';

/**
 * Hero section: headline, value props, and primary CTA.
 *
 * Asset: hero placeholder is served from /assets/hero-placeholder.svg
 * (in public/assets/). Replace with your real photo: hero-ramp.webp.
 */
export const HeroSection: React.FC = () => {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-gradient-to-b from-stone-50 to-white text-stone-900">
      <div className="container max-w-7xl mx-auto px-4 sm:px-8 py-20 grid lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-6">
          <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wider uppercase bg-amber-100 text-amber-800">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-600" />
            Handcrafted dog car ramps
          </span>

          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-stone-900 leading-[1.1]">
            Safe, Gentle Vehicle Entry
            <br />
            <span className="text-amber-700">For Every Companion</span>
          </h1>

          <p className="text-lg md:text-xl text-stone-600 max-w-xl leading-relaxed">
            Premium ramps engineered with precision geometric angles so your dog
            can get in and out of your car safely — without jumping or strain.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <button className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-stone-900 hover:bg-stone-800 text-white rounded-xl font-semibold transition-colors">
              Shop Ramps <ArrowRight className="w-5 h-5" />
            </button>
            <button className="inline-flex items-center justify-center gap-2 px-8 py-4 border-2 border-stone-300 hover:border-stone-400 text-stone-700 rounded-xl font-semibold transition-colors">
              Watch Proof
            </button>
          </div>

          <p className="text-sm text-stone-500">
            Free insured shipping · 30-day risk-free trial · No questions asked
          </p>
        </div>

        <div className="relative">
          <img
            src="/assets/hero-placeholder.svg"
            alt="Dog using ramp to enter car"
            className="w-full max-w-md mx-auto rounded-3xl shadow-2xl shadow-stone-200/60"
          />
        </div>
      </div>
    </section>
  );
};