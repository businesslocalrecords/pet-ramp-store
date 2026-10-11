import React, { useState } from 'react';
import { useCart } from '../lib/cart-context';
import { ArrowRight, ShoppingCart, X } from 'lucide-react';

/**
 * Sticky Mobile CTA Bar - shows on mobile when user scrolls past hero.
 * Displays cart count and primary CTA to boost mobile conversion.
 */
export const StickyMobileCTA: React.FC = () => {
  const { totalQuantity, checkoutUrl, cart } = useCart();
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  // Show bar when user scrolls past first section (hero)
  React.useEffect(() => {
    const handleScroll = () => {
      const heroHeight = window.innerHeight * 0.7; // ~70vh
      const shouldShow = window.scrollY > heroHeight && totalQuantity > 0;
      setVisible(shouldShow && !dismissed);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial check

    return () => window.removeEventListener('scroll', handleScroll);
  }, [totalQuantity, dismissed]);

  if (!visible || totalQuantity === 0) return null;

  const subtotal = cart?.cost.subtotalAmount.amount ?? '0';
  const currency = cart?.cost.subtotalAmount.currencyCode ?? 'USD';

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-50 md:hidden animate-slide-up bg-white border-t border-stone-200 shadow-xl shadow-stone-200/50"
      role="region"
      aria-label="Cart summary"
    >
      <button
        onClick={() => setDismissed(true)}
        className="absolute top-2 right-2 p-1 text-stone-400 hover:text-stone-600 transition-colors"
        aria-label="Dismiss cart bar"
      >
        <X className="w-5 h-5" />
      </button>

      <a
        href={checkoutUrl || '#'}
        className="flex items-center justify-between p-4 gap-4"
        aria-label={`View cart with ${totalQuantity} items, total ${subtotal} ${currency}`}
      >
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-stone-100 flex items-center justify-center shrink-0">
            <ShoppingCart className="w-5 h-5 text-stone-600" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-stone-900 truncate">Cart ({totalQuantity} {totalQuantity === 1 ? 'item' : 'items'})</p>
            <p className="text-sm font-bold text-stone-900">{subtotal} {currency}</p>
          </div>
        </div>
        <button className="flex items-center gap-2 px-5 py-2.5 bg-stone-900 text-white rounded-xl font-semibold text-sm shrink-0 transition-colors hover:bg-stone-800">
          Checkout
          <ArrowRight className="w-4 h-4" />
        </button>
      </a>
    </div>
  );
}