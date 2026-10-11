# Pet Ramp Store

A single-hero landing page for handcrafted dog car ramps, built with **React + TypeScript + Vite** and styled with **Tailwind CSS v4**.

## Project structure

```
├── public/assets/        # Static media (hero-ramp.webp, demo-video.mp4, badges/)
├── src/
│   ├── components/       # Reusable UI sections (HeroSection, SizeGuide, etc.)
│   ├── lib/shopify.ts    # Shopify Storefront API client
│   ├── pages/index.tsx   # Single landing page
│   └── styles/globals.css
├── shopify-theme/        # (optional) Liquid templates if syncing to Shopify
├── package.json
└── README.md
```

## Getting started

```bash
npm install            # install dependencies (React, Tailwind v4, lucide-react)
npm run dev            # start dev server at http://localhost:5173
npm run build          # production build into ./dist
npm run lint           # oxlint
```

## Shopify integration

The Storefront API client lives in `src/lib/shopify.ts`. Create a `.env` file in the project root (never commit it) with:

```env
VITE_SHOPIFY_STOREFRONT_DOMAIN=your-store.myshopify.com
VITE_SHOPIFY_STOREFRONT_TOKEN=shpat_your_storefront_access_token
```

Get the token at: **Shopify Admin > Online Store > Domains > Storefront API access tokens** (scope: `unauthenticated_read_products`, `unauthenticated_read_checkout`).

## Assets

Media goes in `public/assets/` and is referenced as absolute paths (`/assets/hero-ramp.webp`). See `public/assets/README.md` for the full list and current placeholders.
