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
cp .env.example .env      # then fill in your Shopify credentials
npm run dev               # http://localhost:5173
npm run build             # production bundle in dist/
npm run lint              # oxlint
```

## Shopify Setup

1. **Create a storefront access token**
   Shopify Admin → Settings → Apps and sales channels → Develop apps → Create app
   → Storefront API → scopes: `unauthenticated_read_products`, `unauthenticated_read_checkout`

2. **Create two products** with these exact handles:
   - `dog-car-ramp` — the ramp (add variants for the Compact and Extended sizes)
   - `non-slip-mat` — the bundle upsell

3. **Add variables to `.env`**

   ```env
   VITE_SHOPIFY_STOREFRONT_DOMAIN=your-store.myshopify.com
   VITE_SHOPIFY_STOREFRONT_TOKEN=shpat_xxxx
   ```

4. Cart ID is persisted to `localStorage` under `pet_ramp_cart_id`, so carts survive reloads.

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
│   └── analytics.ts            GA4 / Google Ads / Meta Pixel
├── pages/index.tsx             section assembly
└── styles/globals.css          design tokens + animations
```
