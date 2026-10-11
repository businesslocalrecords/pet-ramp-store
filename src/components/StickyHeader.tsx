import React, { useState, useEffect } from 'react';
import { PawPrint, ShoppingCart, ArrowRight } from 'lucide-react';
import { useCart } from '../lib/cart-context';

/**
 * Sticky header that appears on scroll — logo + persistent buy CTA.
 */
export const StickyHeader: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const { totalQuantity } = useCart();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 400);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 inset-x-0 z-40 transition-all duration-300 ${
        scrolled
          ? 'translate-y-0 bg-white/90 backdrop-blur-md border-b border-stone-200 shadow-sm'
          : '-translate-y-full'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <a href="#" className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-stone-900 flex items-center justify-center">
            <PawPrint className="w-5 h-5 text-amber-400" />
          </div>
          <span className="font-extrabold text-stone-900 tracking-tight hidden sm:inline">PawGrip Pro</span>
        </a>

        <div className="flex items-center gap-3">
          <span className="hidden md:inline text-sm text-stone-500 line-through decoration-red-500/70 decoration-2">
            $199
          </span>
          <span className="hidden md:inline font-bold text-stone-900">$149</span>

          {totalQuantity > 0 && (
            <span className="flex items-center gap-1.5 text-sm text-stone-700">
              <ShoppingCart className="w-4 h-4" />
              {totalQuantity}
            </span>
          )}

          <a
            href="#offer"
            className="flex items-center gap-1.5 px-5 py-2.5 bg-stone-900 hover:bg-stone-800 text-white rounded-xl font-bold text-sm transition-colors"
          >
            Buy Now
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    </header>
  );
};