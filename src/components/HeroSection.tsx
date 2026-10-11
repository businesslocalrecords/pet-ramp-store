import React, { useEffect, useState } from 'react';
import { ArrowRight, Star, Play, Truck, ShieldCheck, RotateCcw, Sparkles } from 'lucide-react';
import { trackViewItem, trackAddToCart } from '../lib/analytics';
import { useCart } from '../lib/cart-context';
import { fetchProductByHandle } from '../lib/shopify';

/**
 * Hero section — the primary conversion block.
 * Structure: offer badge -> headline -> social proof -> price/offer -> CTA -> micro-trust row.
 */
export const HeroSection: React.FC = () => {
  const { addItem, checkoutUrl } = useCart();
  const [rampVariantId, setRampVariantId] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);

  // Default price display (fallback if Shopify not connected)
  const price = 149;
  const compareAt = 199;

  useEffect(() => {
    trackViewItem('dog-car-ramp', 'PawGrip Pro Dog Car Ramp', price, 'USD');
  }, []);

  // Fetch the live default variant so "Buy Now" can checkout directly
  useEffect(() => {
    let cancelled = false;
    fetchProductByHandle('dog-car-ramp')
      .then((product) => {
        if (!cancelled && product) {
          const variant = product.variants.edges.find((e) => e.node.availableForSale);
          if (variant) setRampVariantId(variant.node.id);
        }
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  const handleBuyNow = async () => {
    // No storefront connected yet — send visitor to the offer section to pick a package
    if (!rampVariantId) {
      document.getElementById('offer')?.scrollIntoView({ behavior: 'smooth' });
      return;
    }

    setAdding(true);
    try {
      await addItem(rampVariantId, 1);
      trackAddToCart('dog-car-ramp', 'PawGrip Pro Dog Car Ramp', price, 1, 'USD');
      if (checkoutUrl) {
        window.location.href = checkoutUrl;
      }
    } catch (err) {
      console.error('Add to cart failed:', err);
      setAdding(false);
    }
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-stone-50 via-white to-stone-50 text-stone-900">
      {/* Symmetric geometric backdrop */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.35]" aria-hidden="true">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[900px] h-[900px] rounded-full border border-stone-200" />
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[700px] h-[700px] rounded-full border border-stone-200/70" />
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full border border-stone-200/50" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-px h-full bg-gradient-to-b from-transparent via-stone-200 to-transparent" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-20 lg:pt-20 lg:pb-28">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">

          {/* LEFT: Offer copy */}
          <div className="order-2 lg:order-1 max-w-xl mx-auto lg:mx-0 text-center lg:text-left">
            {/* Launch badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-50 border border-amber-200 mb-6">
              <Sparkles className="w-4 h-4 text-amber-600" />
              <span className="text-xs font-bold tracking-widest uppercase text-amber-700">
                Vet-Recommended &middot; New Launch
              </span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-[3.5rem] font-extrabold tracking-tight leading-[1.05] text-stone-900">
              The Last Dog Ramp
              <br />
              You Will Ever Need
            </h1>

            {/* Sub-headline */}
            <p className="mt-5 text-lg sm:text-xl text-stone-600 leading-relaxed">
              Protect your dog's joints and your back. The PawGrip Pro gets dogs up to
              <span className="font-semibold text-stone-900"> 250 lbs </span>
              into any vehicle in seconds — no lifting, no jumping, no stress.
            </p>

            {/* Social proof - stars */}
            <div className="mt-6 flex items-center justify-center lg:justify-start gap-3">
              <div className="flex items-center gap-0.5">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star
                    key={i}
                    className="w-5 h-5 text-amber-500 fill-amber-500 animate-star-pop"
                    style={{ animationDelay: `${i * 100}ms` }}
                  />
                ))}
              </div>
              <span className="text-sm font-semibold text-stone-900">4.9/5</span>
              <span className="text-sm text-stone-500">from 2,847 verified reviews</span>
            </div>

            {/* Offer box */}
            <div className="mt-8 p-6 sm:p-7 rounded-3xl bg-white border-2 border-stone-900 shadow-[8px_8px_0px_0px_rgba(28,25,23,1)]">
              <div className="flex items-end justify-center lg:justify-start gap-3">
                <span className="text-2xl font-bold text-stone-400 line-through decoration-red-500/70 decoration-2">
                  ${compareAt}
                </span>
                <span className="text-5xl sm:text-6xl font-extrabold text-stone-900 tracking-tight">
                  ${price}
                </span>
                <span className="mb-2 px-2.5 py-1 rounded-lg bg-red-100 text-red-700 text-sm font-bold">
                  Save 25%
                </span>
              </div>
              <p className="mt-2 text-sm text-stone-500 text-center lg:text-left">
                Or 4 interest-free payments of ${(price / 4).toFixed(2)} with Shop Pay
              </p>

              <div className="mt-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                </span>
                <span className="text-xs font-semibold text-emerald-700">In stock — ships in 24 hours</span>
              </div>

              {/* Primary CTA */}
              <button
                onClick={handleBuyNow}
                disabled={adding}
                className="group mt-5 w-full flex items-center justify-center gap-2.5 px-8 py-4 bg-stone-900 hover:bg-stone-800 text-white rounded-2xl font-bold text-lg transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {adding ? 'Adding to cart...' : 'Get My Ramp — Save $50'}
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </button>

              <a
                href="#video"
                className="mt-3 w-full flex items-center justify-center gap-2 px-8 py-3 rounded-2xl border-2 border-stone-200 hover:border-stone-300 text-stone-700 font-semibold transition-colors"
              >
                <Play className="w-4 h-4 fill-stone-700" />
                Watch a 32-second demo
              </a>
            </div>

            {/* Micro trust row */}
            <div className="mt-7 grid grid-cols-3 gap-2 text-center">
              <div className="flex flex-col items-center gap-1.5 p-2">
                <Truck className="w-5 h-5 text-stone-700" />
                <span className="text-xs font-semibold text-stone-700">Free Insured<br/>Shipping</span>
              </div>
              <div className="flex flex-col items-center gap-1.5 p-2 border-x border-stone-200">
                <ShieldCheck className="w-5 h-5 text-stone-700" />
                <span className="text-xs font-semibold text-stone-700">30-Day<br/>Money Back</span>
              </div>
              <div className="flex flex-col items-center gap-1.5 p-2">
                <RotateCcw className="w-5 h-5 text-stone-700" />
                <span className="text-xs font-semibold text-stone-700">Free Returns<br/>No Questions</span>
              </div>
            </div>
          </div>

          {/* RIGHT: Product image */}
          <div className="order-1 lg:order-2 relative">
            <div className="relative">
              {/* Glow behind image */}
              <div className="absolute inset-0 bg-gradient-to-tr from-amber-200/40 via-transparent to-stone-200/40 blur-3xl rounded-full" />
              <img
                src="/assets/hero-ramp.svg"
                alt="PawGrip Pro dog car ramp — dog safely walking up a telescoping ramp into an SUV"
                width={1200}
                height={900}
                className="relative w-full h-auto drop-shadow-2xl"
                fetchPriority="high"
              />
            </div>

            {/* Price tag chip */}
            <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 lg:left-auto lg:right-0 lg:translate-x-4 flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-stone-900 text-white shadow-xl">
              <span className="text-xs text-stone-400">Launch price ends in</span>
              <span className="font-mono font-bold text-amber-400">23:59:59</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};