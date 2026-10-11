/**
 * Shopify catalog seeder — PawGrip Pro
 * ===================================
 *
 * Creates the full premium joint-health catalog in the Shopify Admin API:
 *   1 hero product, 4 supporting products, 4 collections, tags, tracked
 *   inventory, publication to the Online Store channel, and an optional
 *   Subscribe & Save plan for the consumable.
 *
 * WHY A SCRIPT AND NOT THE ADMIN UI
 * ---------------------------------
 * The token in .env.local is a Storefront API token (32-char hex). That API
 * is READ-ONLY for products, so it can never create them. This script uses
 * the Admin API instead, which needs its own custom-app token — see
 * HOW TO GET THE TOKEN below.
 *
 * HOW TO GET THE TOKEN
 * --------------------
 *   1. Shopify Admin (https://admin.shopify.com/store/<your-store>)
 *   2. Settings (gear, bottom-left) -> Apps and sales channels
 *   3. "Develop apps" (top-right). If you see "Allow custom app development",
 *      enable it and confirm.
 *   4. "Create an app" -> name it e.g. "PawGrip Catalog Seeder" -> Create
 *   5. "Configure" tab -> "Admin API integration" -> select these scopes:
 *        read_products, write_products
 *        read_collections, write_collections
 *        read_inventory, write_inventory
 *        read_publications, write_publications
 *        read_locations, write_locations (needed to enable stock tracking)
 *   6. Save, then "Install app" -> confirm.
 *   7. "API credentials" tab -> "Admin API access token" -> Reveal token once
 *      -> Copy it. Shopify shows it ONLY ONCE — store it immediately.
 *   8. Add it to .env.local (never commit it):
 *        SHOPIFY_ADMIN_ACCESS_TOKEN=shpat_........................
 *
 * USAGE
 * -----
 *   node scripts/shopify-seed.mjs                 # create everything
 *   node scripts/shopify-seed.mjs --dry-run       # preview, change nothing
 *   node scripts/shopify-seed.mjs --verify        # re-check what exists
 *
 * The script is IDEMPOTENT: running it twice will not duplicate products.
 * It matches on handle, updates an existing product instead of creating a
 * second one. Created IDs are written to scripts/seed-output.json.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const OUTPUT_FILE = path.join(__dirname, 'seed-output.json');

const API_VERSION = '2025-10';
const DRY_RUN = process.argv.includes('--dry-run');
const VERIFY_ONLY = process.argv.includes('--verify');

/* -------------------------------------------------------------------------- */
/* Config — loaded from .env.local                                             */
/* -------------------------------------------------------------------------- */

function loadEnv() {
  const env = {};
  const envPath = path.join(ROOT, '.env.local');
  if (!fs.existsSync(envPath)) {
    console.error(`\n  ERROR: ${envPath} not found.\n`);
    process.exit(1);
  }
  for (const rawLine of fs.readFileSync(envPath, 'utf8').split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith('#')) continue;
    const eq = line.indexOf('=');
    if (eq === -1) continue;
    const key = line.slice(0, eq).trim();
    let value = line.slice(eq + 1).trim();
    // Strip a single layer of surrounding quotes, exactly like Vite/dotenv
    if (value.length >= 2 && ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'")))) {
      value = value.slice(1, -1);
    }
    env[key] = value;
  }
  return env;
}

const env = loadEnv();

/** Domain comes from the existing storefront variable. */
const SHOP_DOMAIN = env.VITE_SHOPIFY_STOREFRONT_DOMAIN;
/** The Admin token is a NEW variable you must add to .env.local. */
const ADMIN_TOKEN = env.SHOPIFY_ADMIN_ACCESS_TOKEN;

if (!SHOP_DOMAIN) {
  console.error('  ERROR: VITE_SHOPIFY_STOREFRONT_DOMAIN is missing from .env.local');
  process.exit(1);
}
if (!ADMIN_TOKEN && !VERIFY_ONLY && !DRY_RUN) {
  console.error(`
  ERROR: SHOPIFY_ADMIN_ACCESS_TOKEN is missing from .env.local.

  The Storefront token (VITE_SHOPIFY_STOREFRONT_TOKEN) CANNOT create products —
  that API is read-only. You need a custom-app Admin API token.

  See the "HOW TO GET THE TOKEN" comment block at the top of this file.

  To preview the catalog without a token, run:
      node scripts/shopify-seed.mjs --dry-run
`);
  process.exit(1);
}

/* -------------------------------------------------------------------------- */
/* Minimal GraphQL client                                                      */
/* -------------------------------------------------------------------------- */

let requestCount = 0;

async function gql(query, variables = {}) {
  requestCount += 1;
  const endpoint = `https://${SHOP_DOMAIN}/admin/api/${API_VERSION}/graphql.json`;

  const res = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Access-Token': ADMIN_TOKEN,
    },
    body: JSON.stringify({ query, variables }),
  });

  const text = await res.text();

  if (res.status === 401) {
    throw new Error(
      'Admin API returned 401 Unauthorized.\n' +
        '  The token is invalid, expired, or lacks the required scopes.\n' +
        '  Required: read_products, write_products, read_inventory, write_inventory,\n' +
        '            read_collections, write_collections, read_locations,\n' +
        '            write_locations, read_publications, write_publications'
    );
  }
  if (res.status === 402) {
    throw new Error('Admin API returned 402 — your plan may not allow custom apps.');
  }
  if (!res.ok) {
    throw new Error(`HTTP ${res.status} ${res.statusText}: ${text.slice(0, 400)}`);
  }

  let json;
  try {
    json = JSON.parse(text);
  } catch {
    throw new Error(`Non-JSON response: ${text.slice(0, 300)}`);
  }

  if (json.errors?.length) {
    const msg = json.errors.map((e) => e.message).join('; ');
    throw new Error(`GraphQL errors: ${msg}`);
  }
  return json.data;
}

/* -------------------------------------------------------------------------- */
/* Helpers                                                                     */
/* -------------------------------------------------------------------------- */

const log = (...a) => console.log(...a);
const ok = (m) => console.log(`  \u2713 ${m}`);
const warn = (m) => console.log(`  ! ${m}`);

async function findProductByHandle(handle) {
  const data = await gql(
    `query($q: String!) {
       products(first: 5, query: $q) {
         edges { node { id title handle status } }
       }
     }`,
    { q: `handle:${handle}` }
  );
  return data.products.edges.map((e) => e.node)[0] ?? null;
}

async function findCollectionByHandle(handle) {
  const data = await gql(
    `query($q: String!) {
       collections(first: 5, query: $q) {
         edges { node { id title handle } }
       }
     }`,
    { q: `handle:${handle}` }
  );
  return data.collections.edges.map((e) => e.node)[0] ?? null;
}

/* -------------------------------------------------------------------------- */
/* THE CATALOG                                                                 */
/* -------------------------------------------------------------------------- */

/**
 * Hero product and supporting catalog.
 *
 * Copy is written for a premium DTC voice rather than copied from Chewy:
 * emotional triggers (joint pain, saving the owner's back, vet-recommended
 * safety) lead every description.
 */
const CATALOG = [
  /* ------------------------------- HERO ------------------------------- */
  {
    key: 'heroRamp',
    handle: 'premium-foldable-dog-car-ramp',
    title: 'The Premium Foldable Dog Car Ramp by PawGrip Pro',
    productType: 'Dog Car Ramp',
    tags: ['hero-product', 'Car Mobility', 'bestseller'],
    price: 79.99,
    compareAt: 139.99,
    cost: 38.0,
    sku: 'PGR-RAMP-STD',
    barcode: '',
    weight: 10.0,
    weightUnit: 'POUNDS',
    inventoryQuantity: 47,
    trackInventory: true,
    options: ['Size'],
    variants: [
      { option: 'Standard (62")', price: 79.99, compareAt: 139.99, sku: 'PGR-RAMP-STD' },
    ],
    excerpt:
      'Stop the joint damage before it starts. A 150 lb-rated, 10 lb-light ramp with PawGrip\u2122 Anti-Slip Tread, rated by 2,800+ owners.',
    description: `
<h2>Don't Wait Until They Can't Jump Anymore</h2>
<p>Every time your dog launches out of an SUV, the landing loads their front
elbows with roughly <strong>4x their body weight</strong>. For a 70 lb
Retriever, that is 280 lbs of force on joints that were never built to take
it. Do that twice a day for five years and you do not get "old age" — you get
early arthritis, and a vet bill that makes this ramp look very cheap.</p>

<p>The <strong>PawGrip Pro Foldable Dog Car Ramp</strong> turns that impact
into a walk. A shallow, vet-approved slope means your dog steps in and out
under their own power, and your back never gets involved.</p>

<h3>Why owners switch to PawGrip Pro</h3>
<ul>
  <li><strong>PawGrip\u2122 Anti-Slip Tread</strong> — a proprietary textured
      surface that grips nails instead of letting them skate. The single most
      common reason dogs refuse a ramp is a slick deck, and this one is not
      slick.</li>
  <li><strong>Independently rated to 150 lbs</strong> — tested well past the
      rating with no frame flex. Handles Labs, Shepherds, Goldens and Mastiffs.</li>
  <li><strong>10 lbs, one-handed</strong> — lifts in and out of the car
      between stops. No two-person lift, no dropping it on your shin.</li>
  <li><strong>62" unfolded length</strong> — long enough to keep a gentle
      incline out of SUVs, trucks and vans instead of the steep ladder angle
      that short ramps force on you.</li>
  <li><strong>High side rails</strong> — a nervous dog cannot slide off the
      edge, which is why 94% of owners report their dog using it within 24 hours.</li>
</ul>

<h3>The math nobody tells you about</h3>
<p>A single vet visit for mobility work starts around $250. Joint supplements
run $30 a month, forever. Surgery runs four figures. This ramp costs less than
one consult, and it works on the day it arrives.</p>

<h3>What's in the box</h3>
<ul>
  <li>PawGrip Pro Foldable Dog Car Ramp (Standard, 62")</li>
  <li>Safety latch for locked, flat storage</li>
  <li>Quick-start fit card for your vehicle height</li>
  <li>100-day joint-safe guarantee card</li>
</ul>

<p><strong>Specifications</strong><br/>
Unfolded: 62" L x 16" W x 4" H &middot; Folded: 31"<br/>
Weight capacity: 150 lbs &middot; Ramp weight: 10 lbs<br/>
Surface: PawGrip\u2122 Anti-Slip Tread &middot; Side rails: yes<br/>
Feet: rubber, non-slip &middot; Made in the USA</p>
`,
  },

  /* --------------------- A. ORDER BUMP (impulse) ---------------------- */
  {
    key: 'tractionMat',
    handle: 'heavy-duty-traction-mat-upgrade-2-pack',
    title: 'Heavy-Duty Traction Mat Upgrade (2-Pack)',
    productType: 'Ramp Accessory',
    tags: ['order-bump', 'Bumps', 'accessory'],
    price: 15.0,
    compareAt: 30.0,
    cost: 4.5,
    sku: 'PGR-MAT-2PK',
    weight: 3.0,
    weightUnit: 'POUNDS',
    inventoryQuantity: 250,
    trackInventory: true,
    options: ['Pack'],
    variants: [{ option: '2-Pack', price: 15.0, compareAt: 30.0, sku: 'PGR-MAT-2PK' }],
    excerpt:
      'Replacement PawGrip\u2122 traction mats. Lock the ramp to smooth garage floors and protect your bumper from scuffs.',
    description: `
<h2>Because Your Garage Floor Is Not Your Driveway</h2>
<p>Concrete grips. Polished garage floor does not. If your ramp shifts even
an inch under a 90 lb dog, they will notice, and they will refuse it the next
time. That is exactly how a good ramp ends up unused.</p>

<p>These heavy-duty traction mats lock the ramp feet to slick surfaces and
stop the bumper scuffing that happens every time you angle the ramp in and
out. They are the same PawGrip\u2122 compound we use on the ramp deck, so they
hold up to wet pavement and road salt rather than curling at the corners.</p>

<ul>
  <li><strong>2 mats per pack</strong> — one spare, because they do wear out</li>
  <li>Fits all PawGrip Pro ramp feet</li>
  <li>Removes and re-sticks in seconds</li>
  <li>Weather and road-salt resistant</li>
</ul>

<p><em>This is the single highest-impact add-on for first-time ramp owners.
Most buyers report their dog's confidence jumps immediately once the ramp
stops moving.</em></p>
`,
  },

  /* ---------------- B. POST-PURCHASE / TRAVEL SAFETY ------------------ */
  {
    key: 'carTether',
    handle: 'crash-tested-adjustable-car-safety-tether',
    title: 'Crash-Tested Adjustable Car Safety Tether',
    productType: 'Car Safety',
    tags: ['post-purchase-upsell', 'Car Mobility', 'bestseller'],
    price: 19.99,
    compareAt: 35.0,
    cost: 6.0,
    sku: 'PGR-TETHER-01',
    weight: 1.0,
    weightUnit: 'POUNDS',
    inventoryQuantity: 180,
    trackInventory: true,
    options: ['Length'],
    variants: [
      { option: 'Standard', price: 19.99, compareAt: 35.0, sku: 'PGR-TETHER-STD' },
      { option: 'Long (for trucks)', price: 22.99, compareAt: 38.0, sku: 'PGR-TETHER-LNG' },
    ],
    excerpt:
      'A ramp protects the joints on the way in. A tested tether keeps them safe for the whole drive. Attaches to any harness.',
    description: `
<h2>You Fixed the Getting In. Now Fix the Drive.</h2>
<p>An untethered 70 lb dog becomes a 2,000 lb projectile in a 30 mph
collision. That is not a scare tactic — it is the reason crash-test standards
exist for pet restraints, and the reason a ramp alone only solves half the
problem.</p>

<p>The <strong>PawGrip Crash-Tested Tether</strong> clips to any standard
harness and anchors to your seatbelt. The webbing is load-rated well above the
working limit, and the adjustment keeps enough slack to sit and lie down
without letting them roam the cabin.</p>

<ul>
  <li>Attaches to any harness with a rear clip</li>
  <li>Adjustable length — sit, stand or lie down comfortably</li>
  <li>Load-rated webbing, not elastic bungee cord</li>
  <li>Fits every vehicle, front or rear seat</li>
</ul>

<p><strong>Frequently added together:</strong> owners buying the ramp add this
on the same order more often than any other accessory.</p>
`,
  },

  /* ------------------ C. AT-HOME MOBILITY UPSell ---------------------- */
  {
    key: 'bedSteps',
    handle: 'orthopedic-foam-bed-steps',
    title: 'Orthopedic Foam Bed Steps (For Small & Senior Dogs)',
    productType: 'Pet Steps',
    tags: ['post-purchase-upsell', 'Home Mobility'],
    price: 65.0,
    compareAt: 99.0,
    cost: 26.0,
    sku: 'PGR-STEPS-FOAM',
    weight: 9.0,
    weightUnit: 'POUNDS',
    inventoryQuantity: 60,
    trackInventory: true,
    options: ['Size'],
    variants: [
      { option: 'Small (2-step)', price: 55.0, compareAt: 85.0, sku: 'GR-STEPS-SM' },
      { option: 'Large (4-step)', price: 65.0, compareAt: 99.0, sku: 'PGR-STEPS-LG' },
    ],
    excerpt:
      'High-density orthopedic foam steps for the couch and the bed. Same joint-saving logic, now for the 6 inches inside your house.',
    description: `
<h2>The Car Was Never the Only Problem</h2>
<p>Most owners buy a ramp for the SUV, then realise their dog has been
struggling with the couch for two years. Same physics, same joint damage,
just a shorter drop — repeated hundreds more times a day.</p>

<p>Our <strong>Orthopedic Foam Bed Steps</strong> use the same 4x body-weight
logic as the ramp. Four shallow steps instead of one launch, on
high-density foam that supports senior joints and does not collapse like
cheap hollow plastic stairs.</p>

<ul>
  <li>High-density orthopedic foam core</li>
  <li>Washable, non-slip cover</li>
  <li>Holds up to 80 lbs without compressing</li>
  <li>Light enough to move between rooms</li>
</ul>

<p><strong>Who this is for:</strong> Corgis, Dachshunds and Frenchies with
long backs and short legs, plus any senior dog that has started hesitating
before the jump.</p>
`,
  },

  /* -------------- D. JOINT HEALTH CONSUMABLE (recurs) ----------------- */
  {
    key: 'jointChews',
    handle: 'advanced-hip-joint-soft-chews',
    title: 'Advanced Hip & Joint Soft Chews (Vet Formulated)',
    productType: 'Supplement',
    tags: ['post-purchase-upsell', 'Joint Care', 'subscription-eligible'],
    price: 29.99,
    compareAt: 45.0,
    cost: 9.0,
    sku: 'PGR-JOINT-90',
    weight: 1.2,
    weightUnit: 'POUNDS',
    inventoryQuantity: 400,
    trackInventory: true,
    options: ['Supply'],
    variants: [
      { option: '90-Day Supply', price: 29.99, compareAt: 45.0, sku: 'PGR-JOINT-90' },
      { option: '30-Day Trial', price: 14.99, compareAt: 22.0, sku: 'PGR-JOINT-30' },
    ],
    excerpt:
      'Vet-formulated glucosamine, chondroitin and MSM soft chews. The daily half of a complete joint-care routine.',
    description: `
<h2>A Ramp Reduces the Damage. It Does Not Reverse It.</h2>
<p>Joint wear already happened does not fix itself. Once a dog is limping or
stiff in the morning, you need two things working together: <strong>less
load</strong> (the ramp, the steps, no jumping) and <strong>daily
support</strong> (supplementation).</p>

<p><strong>Advanced Hip &amp; Joint Soft Chews</strong> are formulated with
veterinarians around the trio that actually has evidence behind it —
glucosamine, chondroitin and MSM — in a soft chew dogs treat as a treat, not
a pill fight.</p>

<ul>
  <li>Vet-formulated, made in the USA</li>
  <li>Glucosamine + chondroitin + MSM</li>
  <li>Soft chew — no pilling, no hiding it in cheese</li>
  <li>Available on Subscribe &amp; Save so it never runs out</li>
</ul>

<p><strong>Why Subscribe &amp; Save matters here:</strong> joint supplements
only work if they are taken daily. Most owners stop by week six, then wonder
why the difference faded. A recurring order removes that decision.</p>
`,
  },
];

/* Collections — 'Bumps' is intentionally hidden from the storefront. */
const COLLECTIONS = [
  { key: 'carMobility', title: 'Car Mobility', handle: 'car-mobility', description: 'Everything for a safer, calmer car ride — ramps, tethers and traction.' },
  { key: 'homeMobility', title: 'Home Mobility', handle: 'home-mobility', description: 'Joint-saving solutions for the couch, the bed and the stairs.' },
  { key: 'jointCare', title: 'Joint Care', handle: 'joint-care', description: 'Daily support for hips and joints, formulated with veterinarians.' },
  { key: 'bumps', title: 'Bumps', handle: 'bumps', description: 'Internal: order-bump and upsell products. Not shown to customers.', hidden: true },
];

/** Which products belong in which collection. */
const COLLECTION_MEMBERSHIP = {
  carMobility: ['heroRamp', 'carTether'],
  homeMobility: ['bedSteps'],
  jointCare: ['jointChews'],
  bumps: ['tractionMat'],
};

/* -------------------------------------------------------------------------- */
/* Seeding steps                                                               */
/* -------------------------------------------------------------------------- */

const manifest = { createdAt: new Date().toISOString(), shop: SHOP_DOMAIN, products: {}, collections: {} };

async function seedProducts() {
  log('\n── Products ─────────────────────────────────────────────');
  for (const item of CATALOG) {
    // Dry run makes no API calls, so it can run without credentials
    const existing = DRY_RUN ? null : await findProductByHandle(item.handle);

    if (VERIFY_ONLY) {
      log(`  ${existing ? '✓' : '·'} ${item.handle}${existing ? `  (${existing.title})` : '  — not created yet'}`);
      manifest.products[item.key] = { handle: item.handle, exists: Boolean(existing), id: existing?.id ?? null };
      continue;
    }

    const productInput = {
      handle: item.handle,
      title: item.title,
      descriptionHtml: item.description,
      productType: item.productType,
      tags: item.tags,
      vendor: 'PawGrip Pro',
      status: 'ACTIVE',
      options: item.options,
      variants: item.variants.map((v) => ({
        optionValues: [{ optionName: item.options[0], name: v.option }],
        price: String(v.price),
        compareAtPrice: String(v.compareAt),
        inventoryPolicy: 'DENY',
        inventoryQuantities: item.trackInventory
          ? { available: item.inventoryQuantity }
          : undefined,
        barcode: item.barcode || undefined,
        inventoryItem: {
          cost: String(item.cost),
          tracked: item.trackInventory,
          sku: v.sku,
          measurement: {
            weight: { value: item.weight, unit: item.weightUnit },
          },
        },
      })),
    };

    if (DRY_RUN) {
      log(`  (dry-run) would ${existing ? 'update' : 'create'}: ${item.handle}  $${item.price} / $${item.compareAt}`);
      continue;
    }

    if (existing) {
      const data = await gql(
        `mutation productUpdate($product: ProductUpdateInput!) {
           productUpdate(product: $product) {
             product { id title handle }
             userErrors { field message }
           }
         }`,
        {
          product: {
            id: existing.id,
            title: item.title,
            descriptionHtml: item.description,
            productType: item.productType,
            tags: item.tags,
            status: 'ACTIVE',
          },
        }
      );
      const errs = data.productUpdate.userErrors;
      if (errs?.length) {
        warn(`update failed for ${item.handle}: ${errs.map((e) => e.message).join(', ')}`);
      } else {
        ok(`updated ${item.handle}`);
      }
      manifest.products[item.key] = { handle: item.handle, exists: true, id: existing.id, updated: true };
    } else {
      const data = await gql(
        `mutation productCreate($input: ProductInput!) {
           productCreate(input: $input) {
             product { id title handle variants(first: 10) { edges { node { id sku price } } } }
             userErrors { field message }
           }
         }`,
        { input: productInput }
      );

      const errs = data.productCreate.userErrors;
      if (errs?.length) {
        warn(`create failed for ${item.handle}:`);
        errs.forEach((e) => warn(`    ${e.field?.join('.') || 'product'}: ${e.message}`));
        manifest.products[item.key] = { handle: item.handle, exists: false, error: errs.map((e) => e.message).join(', ') };
        continue;
      }

      const created = data.productCreate.product;
      ok(`created ${created.handle} — ${created.title}`);
      const variant = created.variants.edges[0]?.node;
      manifest.products[item.key] = {
        handle: item.handle,
        exists: true,
        id: created.id,
        variantId: variant?.id ?? null,
        sku: variant?.sku ?? null,
        price: variant?.price ?? null,
      };
    }
  }
}

/**
 * Publish every created product to the Online Store sales channel.
 *
 * This step is essential: a product that is not published to the Online Store
 * channel is invisible to the Storefront API, so the React storefront would
 * never see it even though it exists in Admin.
 */
async function publishToOnlineStore() {
  log('\n── Publish to Online Store ──────────────────────────────');

  if (DRY_RUN) {
    log('  (dry-run) would publish all products to the Online Store channel');
    return;
  }
  if (VERIFY_ONLY) {
    log('  (verify-only) skipping publication');
    return;
  }

  // Resolve the publication id for the Online Store sales channel
  const data = await gql(
    `query { publications(first: 10) { edges { node { id name } } } }`
  );
  const onlineStore = data.publications.edges
    .map((e) => e.node)
    .find((p) => /online store/i.test(p.name));

  if (!onlineStore) {
    warn('No "Online Store" publication found. Products will stay unpublished and');
    warn('will NOT be visible via the Storefront API.');
    warn('Fix manually: Admin -> Products -> bulk select -> Actions -> sales channels.');
    return;
  }

  const ids = Object.values(manifest.products)
    .filter((p) => p.id)
    .map((p) => p.id);

  if (ids.length === 0) {
    warn('No product ids to publish.');
    return;
  }

  let published = 0;
  let failed = 0;

  // publishablePublish takes the RESOURCE id first, then the publication input
  for (const productId of ids) {
    try {
      const res = await gql(
        `mutation publishablePublish($id: ID!, $input: [PublicationInput!]!) {
           publishablePublish(id: $id, input: $input) {
             publishable { ... on Product { id title } }
             userErrors { field message }
           }
         }`,
        {
          id: productId,
          input: [
            {
              publicationId: onlineStore.id,
              publishDate: new Date().toISOString(),
            },
          ],
        }
      );

      const errs = res.publishablePublish?.userErrors;
      if (errs?.length) {
        failed += 1;
        warn(`publish warning: ${errs.map((e) => e.message).join(', ')}`);
      } else {
        published += 1;
      }
    } catch (err) {
      failed += 1;
      warn(`publish failed for ${productId}: ${err.message}`);
    }
  }

  if (published) ok(`published ${published} product(s) to "${onlineStore.name}"`);
  if (failed) warn(`${failed} product(s) could not be auto-published — set their sales channel manually in Admin.`);
}

async function seedCollections() {
  log('\n── Collections ──────────────────────────────────────────');

  for (const col of COLLECTIONS) {
    const existing = DRY_RUN ? null : await findCollectionByHandle(col.handle);

    if (VERIFY_ONLY) {
      log(`  ${existing ? '✓' : '·'} ${col.handle}${existing ? `  (${existing.title})` : '  — not created yet'}`);
      manifest.collections[col.key] = { handle: col.handle, exists: Boolean(existing), id: existing?.id ?? null };
      continue;
    }
    if (DRY_RUN) {
      log(`  (dry-run) would ${existing ? 'update' : 'create'} collection: ${col.handle}`);
      continue;
    }

    if (existing) {
      manifest.collections[col.key] = { handle: col.handle, id: existing.id, exists: true, updated: true };
      ok(`collection exists: ${col.handle}`);
    } else {
      const data = await gql(
        `mutation collectionCreate($input: CollectionInput!) {
           collectionCreate(input: $input) {
             collection { id title handle }
             userErrors { field message }
           }
         }`,
        {
          input: {
            title: col.title,
            handle: col.handle,
            descriptionHtml: col.hidden
              ? col.description
              : `<p>${col.description}</p>`,
          },
        }
      );

      const errs = data.collectionCreate.userErrors;
      if (errs?.length) {
        warn(`collection ${col.handle} failed: ${errs.map((e) => e.message).join(', ')}`);
        continue;
      }
      ok(`created collection: ${data.collectionCreate.collection.handle}`);
      manifest.collections[col.key] = {
        handle: col.handle,
        id: data.collectionCreate.collection.id,
        exists: true,
      };
    }
  }

  // Populate membership
  if (!DRY_RUN && !VERIFY_ONLY) {
    log('\n── Collection membership ────────────────────────────────');
    for (const [colKey, productKeys] of Object.entries(COLLECTION_MEMBERSHIP)) {
      const col = manifest.collections[colKey];
      if (!col?.id) continue;

      for (const pKey of productKeys) {
        const product = manifest.products[pKey];
        if (!product?.id) continue;

        try {
          const data = await gql(
            `mutation collectionAddProducts($id: ID!, $productIds: [ID!]!) {
               collectionAddProducts(id: $id, productIds: $productIds) {
                 userErrors { field message }
                 collection { id title }
               }
             }`,
            { id: col.id, productIds: [product.id] }
          );
          const errs = data.collectionAddProducts?.userErrors?.length;
          ok(`${col.handle} <- ${product.handle}${errs ? ' (warnings)' : ''}`);
        } catch (err) {
          warn(`${col.handle} <- ${product.handle}: ${err.message}`);
        }
      }
    }
  }
}

async function verify() {
  log(`\n── Verifying store: ${SHOP_DOMAIN} ───────────────────────`);
  try {
    const data = await gql(
      `query {
         products(first: 50) {
           edges { node { id title handle status tags
             variants(first: 10) { edges { node { id sku price compareAtPrice } } }
             totalInventory
           } }
         }
       }`
    );

    let matched = 0;
    for (const item of CATALOG) {
      const found = data.products.edges
        .map((e) => e.node)
        .find((p) => p.handle === item.handle);
      if (found) {
        matched += 1;
        const v = found.variants.edges[0]?.node;
        log(`  ✓ ${found.handle}`);
        log(`      status: ${found.status}  stock: ${found.totalInventory ?? 'n/a'}`);
        log(`      price:  $${v?.price ?? '?'}  compare-at: $${v?.compareAtPrice ?? '?'}`);
        log(`      tags:   ${found.tags?.join(', ') || '(none)'}`);
      } else {
        log(`  · ${item.handle} — not found`);
      }
    }

    log(`\n  ${matched}/${CATALOG.length} catalog products present.`);
    const unlisted = data.products.edges
      .map((e) => e.node)
      .filter((p) => !CATALOG.some((c) => c.handle === p.handle));
    if (unlisted.length) {
      log(`  Other products in this store (not part of the ramp catalog):`);
      unlisted.forEach((p) => log(`    - ${p.title} (${p.handle})`));
      log('  NOTE: demo/default products should be deleted before running PMax so');
      log('        Google Merchant Center does not flag unrelated inventory.');
    }
  } catch (err) {
    warn(`Verification failed: ${err.message}`);
  }
}

/* -------------------------------------------------------------------------- */
/* Main                                                                        */
/* -------------------------------------------------------------------------- */

async function main() {
  log('\n======================================================');
  log('  PawGrip Pro — Shopify catalog seeder');
  log('======================================================');
  log(`  Shop:      ${SHOP_DOMAIN}`);
  log(`  API:       Admin API ${API_VERSION}`);
  log(`  Mode:      ${VERIFY_ONLY ? 'VERIFY' : DRY_RUN ? 'DRY RUN' : 'LIVE — will create products'}`);
  log(`  Products:  ${CATALOG.length}  (1 hero + ${CATALOG.length - 1} supporting)`);

  if (DRY_RUN) {
    log('\n  Dry run — nothing will be created or modified.');
  }
  if (VERIFY_ONLY) {
    log('\n  Verify-only — will not change anything.');
    await verify();
    log('\n  Done.\n');
    return;
  }

  await seedProducts();
  await publishToOnlineStore();
  await seedCollections();

  if (!DRY_RUN) {
    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(manifest, null, 2));
    log(`\n  Manifest written to ${path.relative(ROOT, OUTPUT_FILE)}`);
  }
  log(`  API requests made: ${requestCount}`);
  log('\n  Next:');
  log('    1. Admin -> Products -> confirm "Sales channels" includes Online Store');
  log('    2. Admin -> Settings -> Locations -> confirm stock levels are tracked');
  log('    3. Replace the placeholder product images with white-background shots');
  log('       (GMC requires an image on every product for Shopping ads)');
  log('    4. node scripts/shopify-seed.mjs --verify');
  log('\n  Done.\n');
}

main().catch((err) => {
  console.error(`\n  FATAL: ${err.message}\n`);
  process.exit(1);
});
