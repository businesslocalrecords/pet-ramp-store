import { useCallback, useEffect, useState, type ReactNode } from 'react';
import { useCart } from './cart-context';
import { fetchProductByHandle, fetchProductStock, type ProductVariantEdge } from './shopify';
import { collectAttributionParams, appendAttribution } from './dki';
import { trackAddToCart, trackBeginCheckout, pushBeginCheckoutDataLayer } from './analytics';
import { TIERS } from './offers';
import { PurchaseContext, type PurchaseContextValue } from './purchase-context';

const RAMP_HANDLE = 'dog-car-ramp';
const MAT_HANDLE = 'non-slip-mat';
const BUMP_PRICE = 15;
const COUPON_CODE = 'RAMP20';

type Variant = ProductVariantEdge['node'];

/**
 * Single source of truth for the purchase flow.
 *
 * Both the desktop buy box and the mobile sticky buy bar call the same `buy()`,
 * so there is exactly one place that writes to the cart, fires conversion
 * events, and forwards attribution into the Shopify checkout.
 */
export function PurchaseProvider({ children }: { children: ReactNode }) {
  const { addItem, loading: cartLoading, checkoutUrl } = useCart();

  const [selectedId, setSelectedId] = useState('two');
  const [bumpEnabled, setBumpEnabled] = useState(false);

  const [rampVariants, setRampVariants] = useState<Variant[]>([]);
  const [matVariant, setMatVariant] = useState<Variant | null>(null);
  const [stock, setStock] = useState<number | null>(null);
  const [buying, setBuying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [ramp, mat, stockLevel] = await Promise.all([
          fetchProductByHandle(RAMP_HANDLE),
          fetchProductByHandle(MAT_HANDLE),
          fetchProductStock(RAMP_HANDLE),
        ]);
        if (cancelled) return;

        if (ramp) setRampVariants(ramp.variants.edges.map((e) => e.node));
        if (mat) {
          const variants = mat.variants.edges.map((e) => e.node);
          setMatVariant(variants.find((v) => v.availableForSale) ?? variants[0] ?? null);
        }
        setStock(stockLevel);
      } catch (err) {
        console.error('PurchaseProvider: failed to load products', err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const tier = TIERS.find((t) => t.id === selectedId) ?? TIERS[1];

  const rampVariant = rampVariants.find((v) => v.availableForSale) ?? rampVariants[0] ?? null;

  /** Resolve the ramp variant for a tier, preferring a bundle variant. */
  const resolveRampVariant = useCallback(
    (units: number): Variant | null => {
      if (!rampVariants.length) return null;
      if (units === 1) return rampVariant;
      return rampVariants.find((v) => /2|double|twin|bundle/i.test(v.title)) ?? rampVariant;
    },
    [rampVariants, rampVariant]
  );

  const bumpActive = bumpEnabled && Boolean(matVariant);
  const total = tier.price + (bumpActive ? BUMP_PRICE : 0);
  const savingsPercent = Math.round((1 - tier.price / tier.compareAt) * 100);

  const buy = useCallback(async () => {
    const units = tier.id === 'three' ? 2 : 1;
    const chosen = resolveRampVariant(units);

    if (!chosen) {
      setError('Checkout is temporarily unavailable. Please try again in a moment.');
      return;
    }

    setBuying(true);
    setError(null);

    const items = [
      { item_id: chosen.id, item_name: 'PawGrip Pro Dog Car Ramp', price: tier.price, quantity: units },
      ...(bumpActive && matVariant
        ? [{ item_id: matVariant.id, item_name: 'Non-Slip Mat (order bump)', price: BUMP_PRICE, quantity: 1 }]
        : []),
    ];

    try {
      // Atomic write: ramp (+ optional mat) in one flow
      await addItem(chosen.id, units);
      if (bumpActive && matVariant) {
        await addItem(matVariant.id, 1, [{ key: '_order_bump', value: 'non-slip-mat' }]);
      }

      trackAddToCart(RAMP_HANDLE, 'PawGrip Pro Dog Car Ramp', total, units, 'USD');
      trackBeginCheckout(items, 'USD');
      pushBeginCheckoutDataLayer(items, 'USD', COUPON_CODE);

      if (checkoutUrl) {
        // CRITICAL: forward click IDs + UTMs so attribution survives the
        // cross-domain hop to Shopify checkout
        window.location.assign(appendAttribution(checkoutUrl, collectAttributionParams()));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    } finally {
      setBuying(false);
    }
  }, [tier, bumpActive, matVariant, resolveRampVariant, addItem, checkoutUrl, total]);

  const value: PurchaseContextValue = {
    tier,
    selectedId,
    selectTier: setSelectedId,
    bumpEnabled,
    setBumpEnabled,
    total,
    savingsPercent,
    bumpPrice: BUMP_PRICE,
    loading: loading || cartLoading,
    ready: !loading,
    rampVariants,
    matVariant,
    stock,
    buying,
    error,
    buy,
  };

  return <PurchaseContext.Provider value={value}>{children}</PurchaseContext.Provider>;
}