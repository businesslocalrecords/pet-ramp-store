import React from 'react';
import { UrgencyBar } from '../components/UrgencyBar';
import { StickyHeader } from '../components/StickyHeader';
import { HeroSection } from '../components/HeroSection';
import { VideoProof } from '../components/VideoProof';
import { SizeGuide } from '../components/SizeGuide';
import { ComparisonTable } from '../components/ComparisonTable';
import { Testimonials } from '../components/Testimonials';
import { BundleSelector } from '../components/BundleSelector';
import { TrustBadges } from '../components/TrustBadges';
import { ShippingReturns } from '../components/ShippingReturns';
import { Faq } from '../components/Faq';
import { Footer } from '../components/Footer';
import { StickyMobileCTA } from '../components/StickyMobileCTA';

/**
 * Single-product landing page for the PawGrip Pro dog car ramp.
 * Section order follows the conversion funnel:
 * urgency -> hero -> proof -> fit -> compare -> social proof -> offer -> trust -> logistics -> FAQ -> footer.
 */
const Page: React.FC = () => {
  return (
    <div className="min-h-screen bg-white text-stone-900 antialiased selection:bg-amber-200 selection:text-stone-900">
      {/* Announcement / scarcity bar */}
      <UrgencyBar />

      {/* Persistent buy CTA */}
      <StickyHeader />

      <main>
        {/* Hero + offer */}
        <HeroSection />

        {/* Video proof */}
        <VideoProof />

        {/* Size guide */}
        <SizeGuide />

        {/* Comparison */}
        <ComparisonTable />

        {/* Reviews */}
        <Testimonials />

        {/* Offer / bundles */}
        <BundleSelector />

        {/* Trust badges */}
        <TrustBadges />

        {/* Shipping & returns */}
        <ShippingReturns />

        {/* FAQ */}
        <Faq />
      </main>

      <Footer />

      {/* Mobile sticky cart */}
      <StickyMobileCTA />
    </div>
  );
};

export default Page;