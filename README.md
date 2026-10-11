# PawGrip Pro — Headless Shopify Landing Page

A high-conversion, single-product landing page for a foldable dog car ramp.
Built with **React 19 + Vite + Tailwind CSS v4**, powered by the **Shopify Storefront API** (headless — Shopify handles checkout).

## Sections

| # | Section | Purpose |
|---|---------|---------|
| 1 | `UrgencyBar` | Rotating social proof + countdown + promo code |
| 2 | `StickyHeader` | Persistent logo + price + buy CTA on scroll |
| 3 | `HeroSection` | Headline, price anchor, live stock, primary CTA |
| 4 | `VideoProof` | Custom video player with controls + proof stats |
| 5 | `SizeGuide` | Two-tier selector with geometric angle diagrams |
| 6 | `ComparisonTable` | Ramp vs. jumping vs. lifting |
| 7 | `Testimonials` | Verified review cards + aggregate rating |
| 8 | `BundleSelector` | 3-tier offer structure (AOV optimization) |
| 9 | `TrustBadges` | Guarantee / shipping / vet / security badges |
| 10 | `ShippingReturns` | 4-step process + policy details |
| 11 | `Faq` | Accordion + FAQPage JSON-LD for SEO |
| 12 | `Footer` | Final CTA + links + social |
| 13 | `StickyMobileCTA` | Mobile cart bar with checkout link |

## Quick Start

```bash
npm install
cp .env.example .env.local     # then fill in your Shopify credentials
npm run shopify:seed:dry       # preview the catalog (no credentials needed)
npm run shopify:seed           # create the catalog in Shopify
npm run dev                    # http://localhost:5173
npm run build                  # production bundle in dist/
npm run lint                   # oxlint
```

## Shopify Setup

### 1. The two different tokens (this trips everyone up)

| Token | Variable | Used for | Can create products? |
|-------|----------|----------|---------------------|
| **Storefront API** | `VITE_SHOPIFY_STOREFRONT_TOKEN` (32-char hex) | React frontend — reads products, writes carts | **No** — read-only |
| **Admin API** | `SHOPIFY_ADMIN_ACCESS_TOKEN` (`shpat_…`) | `scripts/shopify-seed.mjs` | **Yes** |

The Storefront token in `.env.local` cannot create products; that API is
read-only by design. To generate the Admin token:

1. Shopify Admin → **Settings** → **Apps and sales channels**
2. → **Develop apps** (enable custom app development if prompted)
3. → **Create an app** → name it e.g. "PawGrip Catalog Seeder"
4. → **Configure** → **Admin API integration** → add scopes:
   `read_products`, `write_products`, `read_collections`, `write_collections`,
   `read_inventory`, `write_inventory`, `read_publications`,
   `write_publications`, `read_locations`, `write_locations`
5. → **Save** → **Install app** → confirm
6. → **API credentials** → reveal **Admin API access token** → copy it
   *(shown only once)*
7. Add to `.env.local`:
   ```env
   SHOPIFY_ADMIN_ACCESS_TOKEN=shpat_xxxxxxxxxxxxxxxx
   ```

### 2. Create the catalog

```bash
npm run shopify:seed:dry    # preview, no credentials needed, no writes
npm run shopify:seed        # create everything (needs the Admin token)
npm run shopify:verify      # re-check what exists in the store
```

The seeder is idempotent — it matches on handle, so running it twice updates
rather than duplicates. Created IDs land in `scripts/seed-output.json`.

### 3. Products created

| Handle | Title | Price | Compare-at | Tag | Role |
|--------|-------|-------|-----------|-----|------|
| `premium-foldable-dog-car-ramp` | The Premium Foldable Dog Car Ramp | $79.99 | $139.99 | `hero-product` | Main funnel product |
| `heavy-duty-traction-mat-upgrade-2-pack` | Heavy-Duty Traction Mat Upgrade (2-Pack) | $15.00 | $30.00 | `order-bump` | Pre-checkout bump |
| `crash-tested-adjustable-car-safety-tether` | Crash-Tested Adjustable Car Safety Tether | $19.99 | $35.00 | `post-purchase-upsell` | Cart upsell |
| `orthopedic-foam-bed-steps` | Orthopedic Foam Bed Steps | $65.00 | $99.00 | — | Home Mobility |
| `advanced-hip-joint-soft-chews` | Advanced Hip & Joint Soft Chews | $29.99 | $45.00 | — | Joint Care (add Subscribe & Save) |

Plus collections: **Car Mobility**, **Home Mobility**, **Joint Care**, and a
hidden **Bumps** collection.

**Pricing rationale:** the reference product (PetSafe Happy Ride) has an MSRP
of $59.99. $79.99 / $139.99 (43% off) sits ~33% above that — defensible with
the PawGrip Tread, 100-day guarantee and lifetime warranty — while leaving a
~52% gross margin on the hero for ad spend.

### 4. Before running PMax / Shopping ads

The seeder cannot do these for you:

- **Delete the default demo products.** Shopify seeds new stores with 15
  snowboard/gift-card products. Unrelated inventory causes Merchant Center
  disapproval.
- **Upload product images** with a pure white (`#FFFFFF`) background.
  GMC requires an image on every product. The hero's second image should be
  an action shot of a dog walking up the ramp.
- **Add Subscribe & Save** to `advanced-hip-joint-soft-chews` (Admin →
  Products → the product → Selling plans). The Admin API requires an app-owned
  selling plan group, which this script deliberately does not attempt.
- **Fill in the business address and phone** in `src/components/Footer.tsx`
  (currently `REPLACE_WITH_…` placeholders, flagged with a visible banner).


## Analytics (CPC Campaigns)

Conversion events are wired in `src/lib/analytics.ts` and fire automatically:

| Event | Fires when |
|-------|-----------|
| `view_item` | Hero mounts (PageView on load) |
| `add_to_cart` | Any add to cart |
| `begin_checkout` | Checkout redirect |
| `purchase` | Thank-you page (call `trackPurchase` manually) |

Supported platforms: **Google Analytics 4**, **Google Ads**, **Meta Pixel**.
Set the matching IDs in `.env` — `initAnalytics()` in `src/main.tsx` loads the scripts.

## Assets

Placeholders live in `public/assets/` and are generated SVGs so the site renders
before photography is ready.

| File | Replace with |
|------|--------------|
| `assets/hero-ramp.svg` | `hero-ramp.webp` — hero product/lifestyle shot (~1920×1080) |
| `assets/poster-placeholder.svg` | Video poster frame |
| `assets/demo-video.mp4` | 15–30s demo clip (~10 MB max, H.264) |
| `assets/badges/*.svg` | Optional custom trust badges |

To swap in real media, replace the `src` strings in `HeroSection.tsx` and `VideoProof.tsx`.

## Deployment

Builds to static files in `dist/` — deploy anywhere:

- **Netlify / Vercel** — connect the repo, build command `npm run build`, output `dist/`
- Add environment variables in the host dashboard, not the repo.

Point your Google Ads / Meta campaign landing page URL at the deployed domain.

## Structure

```
src/
├── components/
│   ├── UrgencyBar.tsx          scarcity + countdown
│   ├── StickyHeader.tsx        scroll-triggered buy bar
│   ├── HeroSection.tsx         primary conversion block
│   ├── VideoProof.tsx          custom video player
│   ├── SizeGuide.tsx           size selector + angle diagrams
│   ├── ComparisonTable.tsx     alternative comparison
│   ├── Testimonials.tsx        review cards
│   ├── BundleSelector.tsx      3-tier bundle offers
│   ├── TrustBadges.tsx         guarantee badges + payment icons
│   ├── ShippingReturns.tsx     logistics steps
│   ├── Faq.tsx                 accordion + FAQ schema
│   ├── Footer.tsx              final CTA + links
│   └── StickyMobileCTA.tsx     mobile cart bar
├── lib/
│   ├── shopify.ts              Storefront API (products + cart)
│   ├── cart.tsx                CartProvider
│   ├── cart-context.ts         cart context + useCart hook
│   ├── purchase-provider.tsx   shared purchase flow (one buy() for both CTAs)
│   ├── purchase-context.ts     purchase context + usePurchase hook
│   ├── offers.ts               tiers, prices, product handles, collections
│   ├── dki.ts                  DKI params + attribution forwarding
│   └── analytics.ts            GA4 / Google Ads / Meta Pixel + dataLayer
└── scripts/
    ├── shopify-seed.mjs        Admin API catalog seeder
    └── seed-output.json        generated manifest of created IDs
```
