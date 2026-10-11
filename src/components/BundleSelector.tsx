import React, { useState } from 'react';
import { CheckCircle2, ShoppingBag } from 'lucide-react';

/**
 * Bundle selector: ramps + non-slip mat (AOV boost).
 *
 * Wire prices/product IDs to Shopify products via fetchProducts() from
 * src/lib/shopify.ts once the storefront is connected.
 */
export const BundleSelector: React.FC = () => {
  const [withMat, setWithMat] = useState(false);
  const rampPrice = '$149';
  const matPrice = '$49';

  const total = withMat ? `$${149 + 49}` : rampPrice;
  const discount = withMat ? 20 : 0;

  return (
    <section className="py-16 px-4 md:px-8 bg-gradient-to-b from-amber-50 to-white text-stone-900">
      <div className="max-w-4xl mx-auto">
        <div className="text-center space-y-3 mb-10">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wider uppercase bg-amber-200 text-amber-900">
            Best Value
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">Complete the Setup</h2>
          <p className="text-stone-600 max-w-xl mx-auto">
            Add a non-slip mat to keep the ramp locked in place and protect your
            car's interior. Bundle and save.
          </p>
        </div>

        <div className="relative bg-white rounded-2xl p-1.5 shadow-xl border border-amber-200 inline-flex w-full sm:w-auto">
          <button
            className={`flex-1 sm:flex-none px-8 py-3.5 rounded-xl font-semibold transition-all ${
              !withMat
                ? 'bg-stone-900 text-white shadow'
                : 'text-stone-600 hover:bg-stone-50'
            }`}
            onClick={() => setWithMat(false)}
          >
            Ramp Only
          </button>
          <button
            className={`flex-1 sm:flex-none px-8 py-3.5 rounded-xl font-semibold transition-all ${
              withMat
                ? 'bg-stone-900 text-white shadow'
                : 'text-stone-600 hover:bg-stone-50'
            }`}
            onClick={() => setWithMat(true)}
          >
            Ramp + Non-Slip Mat
          </button>
        </div>

        <div className="mt-8 bg-stone-900 text-stone-100 rounded-2xl p-6 sm:p-8 shadow-xl">
          <div className="flex flex-col sm:flex-row gap-8 items-start">
            <div className="flex-1 space-y-3">
              <div className="flex items-center justify-between text-stone-300">
                <span className="font-medium">Your Ramp</span>
                <span>{rampPrice}</span>
              </div>
              {withMat && (
                <div className="flex items-center justify-between text-stone-300">
                  <span className="font-medium">Non-Slip Mat</span>
                  <span className="line-through opacity-60">{matPrice}</span>
                </div>
              )}
              <div className="flex items-center justify-between pt-3 border-t border-stone-800">
                <span className="font-semibold text-stone-300">Bundle discount</span>
                <span className={withMat ? 'text-emerald-400 font-semibold' : 'text-stone-500'}>
                  {withMat ? '-20%' : '-'}
                </span>
              </div>
              <div className="flex items-center justify-between text-lg font-bold">
                <span>Total</span>
                <span>{total}</span>
              </div>
              {withMat && (
                <div className="text-amber-400 text-sm font-semibold flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  Bundle discount applied — you save {matPrice}
                </div>
              )}
            </div>

            <button className="w-full sm:w-auto px-8 py-4 bg-amber-500 hover:bg-amber-600 text-stone-900 rounded-xl font-bold transition-colors">
              Add to Cart &middot; {total}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};