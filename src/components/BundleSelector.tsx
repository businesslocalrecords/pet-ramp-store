import React, { useState, useEffect } from 'react';
import { CheckCircle2, Loader2, Sparkles, ArrowRight, Package } from 'lucide-react';
import { useCart } from '../lib/cart-context';
import { fetchProductByHandle } from '../lib/shopify';

interface Variant {
  id: string;
  title: string;
  price: { amount: string; currencyCode: string };
  availableForSale: boolean;
}

interface Offer {
  id: string;
  title: string;
  subtitle: string;
  quantity: number;
  price: number;
  compareAt: number;
  perUnit: number;
  badge?: string;
  perks: string[];
  highlight?: boolean;
}

/**
 * Bundle selector — 3-tier offer structure (AOV optimization).
 * Classic 1/2/3 unit decoy pricing to maximize average order value.
 */
export const BundleSelector: React.FC = () => {
  const { addItem, loading: cartLoading, checkoutUrl } = useCart();
  const [selectedId, setSelectedId] = useState('two');
  const [rampVariant, setRampVariant] = useState<Variant | null>(null);
  const [matVariant, setMatVariant] = useState<Variant | null>(null);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const offers: Offer[] = [
    {
      id: 'one',
      title: '1× PawGrip Ramp',
      subtitle: 'Single ramp',
      quantity: 1,
      price: 149,
      compareAt: 199,
      perUnit: 149,
      perks: ['Free insured shipping', '30-day money-back guarantee'],
    },
    {
      id: 'two',
      title: '1× Ramp + Non-Slip Mat',
      subtitle: 'The complete setup',
      quantity: 1,
      price: 168,
      compareAt: 248,
      perUnit: 168,
      badge: 'Most Popular — Save $80',
      highlight: true,
      perks: [
        'Non-slip locking mat (a $49 value)',
        'Free insured express shipping',
        '30-day money-back guarantee',
      ],
    },
    {
      id: 'three',
      title: '2× Ramps + Mat',
      subtitle: 'Two vehicles covered',
      quantity: 2,
      price: 278,
      compareAt: 447,
      perUnit: 139,
      badge: 'Best Value — Save $169',
      perks: [
        '2 ramps (SUV + sedan)',
        '2 non-slip locking mats',
        'Priority white-glove shipping',
        '30-day money-back guarantee',
      ],
    },
  ];

  useEffect(() => {
    async function loadProducts() {
      try {
        setLoading(true);
        const ramp = await fetchProductByHandle('dog-car-ramp');
        if (ramp) {
          const variants = ramp.variants.edges.map((e) => e.node);
          setRampVariant(variants.find((v) => v.availableForSale) ?? variants[0] ?? null);
        }
        const mat = await fetchProductByHandle('non-slip-mat');
        if (mat) {
          const variants = mat.variants.edges.map((e) => e.node);
          setMatVariant(variants.find((v) => v.availableForSale) ?? variants[0] ?? null);
        }
      } catch (err) {
        console.error('Failed to load products:', err);
      } finally {
        setLoading(false);
      }
    }
    loadProducts();
  }, []);

  const selected = offers.find((o) => o.id === selectedId)!;
  const savPct = Math.round((1 - selected.price / selected.compareAt) * 100);

  const handleAddToCart = async () => {
    setAdding(true);
    setError(null);
    try {
      if (rampVariant) {
        await addItem(rampVariant.id, selected.quantity);
        if (selected.id !== 'one' && matVariant) {
          await addItem(matVariant.id, selected.quantity);
        }
      }
      if (checkoutUrl) {
        window.location.assign(checkoutUrl);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add to cart');
    } finally {
      setAdding(false);
    }
  };

  return (
    <section id="offer" className="py-20 lg:py-24 px-4 sm:px-6 bg-stone-50 text-stone-900 scroll-mt-16">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase bg-amber-100 text-amber-800">
            <Sparkles className="w-3.5 h-3.5" /> Limited Launch Pricing
          </span>
          <h2 className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight">
            Choose Your Package
          </h2>
          <p className="mt-4 text-stone-600 text-lg">
            Bundles ship from our domestic warehouse and include the 30-day risk-free trial.
          </p>
        </div>

        {loading && !rampVariant ? (
          <div className="flex flex-col items-center py-16">
            <Loader2 className="w-10 h-10 text-stone-400 animate-spin" />
            <p className="mt-4 text-stone-500">Loading live pricing...</p>
          </div>
        ) : (
          <>
            {/* Offer cards */}
            <div className="grid md:grid-cols-3 gap-5 mb-10">
              {offers.map((offer) => {
                const isSelected = selectedId === offer.id;
                return (
                  <div
                    key={offer.id}
                    onClick={() => setSelectedId(offer.id)}
                    role="radio"
                    aria-checked={isSelected}
                    tabIndex={0}
                    onKeyDown={(e) => e.key === 'Enter' && setSelectedId(offer.id)}
                    className={`relative cursor-pointer rounded-3xl p-6 transition-all duration-300 border-2 flex flex-col ${
                      isSelected
                        ? 'border-stone-900 bg-white shadow-[6px_6px_0px_0px_rgba(28,25,23,1)]'
                        : offer.highlight
                          ? 'border-amber-300 bg-white hover:border-amber-400'
                          : 'border-stone-200 bg-white hover:border-stone-300'
                    }`}
                  >
                    {offer.badge && (
                      <span
                        className={`absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-widest shadow-sm ${
                          offer.highlight ? 'bg-amber-500 text-stone-900' : 'bg-stone-900 text-white'
                        }`}
                      >
                        {offer.badge}
                      </span>
                    )}

                    <div className="text-center mb-5">
                      <h3 className="text-lg font-bold leading-tight">{offer.title}</h3>
                      <p className="text-xs text-stone-500 mt-0.5">{offer.subtitle}</p>
                    </div>

                    <div className="text-center mb-5">
                      <div className="flex items-center justify-center gap-2">
                        <span className="text-lg font-bold text-stone-400 line-through decoration-red-500/70 decoration-2">
                          ${offer.compareAt}
                        </span>
                      </div>
                      <div className="flex items-baseline justify-center gap-1 mt-1">
                        <span className="text-4xl font-extrabold tracking-tight">${offer.price}</span>
                      </div>
                      <span className="inline-block mt-2 px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-700 text-xs font-bold">
                        Save ${offer.compareAt - offer.price} ({Math.round((1 - offer.price / offer.compareAt) * 100)}%)
                      </span>
                    </div>

                    <ul className="space-y-2.5 mb-5 mt-auto">
                      {offer.perks.map((perk, i) => (
                        <li key={i} className="flex items-start gap-2 text-xs text-stone-700">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-px" />
                          <span>{perk}</span>
                        </li>
                      ))}
                    </ul>

                    <div
                      className={`h-1 rounded-full transition-colors ${
                        isSelected ? 'bg-stone-900' : 'bg-stone-100'
                      }`}
                    />
                  </div>
                );
              })}
            </div>

            {/* Summary + CTA */}
            <div className="max-w-md mx-auto p-7 rounded-3xl bg-stone-900 text-stone-100 shadow-xl">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-amber-400 mb-4">
                <Package className="w-4 h-4" /> Your selection
              </div>

              <div className="flex items-center justify-between text-stone-300 mb-2">
                <span className="text-sm">{selected.title}</span>
                <span className="text-sm">${selected.price}</span>
              </div>
              <div className="flex items-center justify-between text-stone-300 mb-2">
                <span className="text-sm">Shipping</span>
                <span className="text-sm text-emerald-400 font-semibold">FREE</span>
              </div>
              <div className="flex items-center justify-between pt-3 border-t border-stone-800 mb-5">
                <span className="font-semibold">Total today</span>
                <span className="text-3xl font-extrabold">${selected.price}</span>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={adding || cartLoading || !rampVariant}
                className="group w-full flex items-center justify-center gap-2.5 px-8 py-4 bg-amber-500 hover:bg-amber-400 text-stone-900 rounded-2xl font-bold text-lg transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {adding ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" /> Processing...
                  </>
                ) : (
                  <>
                    Claim My {savPct}% Discount
                    <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                  </>
                )}
              </button>

              <p className="mt-4 text-center text-xs text-stone-400 leading-relaxed">
                30-day money-back guarantee &middot; Free returns &middot; Ships within 24 hours
              </p>

              {error && (
                <p className="mt-3 text-center text-sm text-red-400">{error}</p>
              )}
            </div>
          </>
        )}
      </div>
    </section>
  );
};