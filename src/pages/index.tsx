import React from 'react';
import { HeroSection } from '../components/HeroSection';
import { VideoProof } from '../components/VideoProof';
import { SizeGuide } from '../components/SizeGuide';
import { BundleSelector } from '../components/BundleSelector';
import { TrustBadges } from '../components/TrustBadges';
import { ShippingReturns } from '../components/ShippingReturns';

/**
 * Single hero landing page for the dog car ramp store.
 */
const Page: React.FC = () => {
  return (
    <main className="min-h-screen bg-white text-stone-900">
      <HeroSection />
      <VideoProof />
      <SizeGuide />
      <BundleSelector />
      <TrustBadges />
      <ShippingReturns />
    </main>
  );
};

export default Page;