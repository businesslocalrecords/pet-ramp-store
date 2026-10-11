/** Canonical offer definitions, shared by the selector, buy box, and mobile bar. */

export interface OfferTier {
  id: string;
  label: string;
  sublabel: string;
  price: number;
  compareAt: number;
  badge?: 'MOST POPULAR' | 'BEST VALUE';
  perks: string[];
}

export const TIERS: OfferTier[] = [
  {
    id: 'one',
    label: '1 Ramp',
    sublabel: 'Single vehicle',
    price: 149,
    compareAt: 199,
    perks: ['Free insured shipping', '30-day money-back guarantee'],
  },
  {
    id: 'two',
    label: '1 Ramp + Mat',
    sublabel: 'The complete setup',
    price: 168,
    compareAt: 248,
    badge: 'MOST POPULAR',
    perks: [
      'Non-slip locking mat (a $49 value)',
      'Free insured shipping',
      '30-day money-back guarantee',
    ],
  },
  {
    id: 'three',
    label: '2 Ramps',
    sublabel: 'Two vehicles covered',
    price: 278,
    compareAt: 447,
    badge: 'BEST VALUE',
    perks: ['2 ramps for two vehicles', 'Priority shipping', '30-day money-back guarantee'],
  },
];

/** Default tier shown on load. */
export const DEFAULT_TIER_ID = 'two';

/** Returns a tier by id, falling back to the recommended bundle. */
export function getTier(id: string): OfferTier {
  return TIERS.find((t) => t.id === id) ?? TIERS[1];
}