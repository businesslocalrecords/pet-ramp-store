/**
 * Shopify Storefront API client.
 *
 * Environment variables (add to a .env file, DO NOT commit):
 *   VITE_SHOPIFY_STOREFRONT_DOMAIN  e.g. pet-ramp-store.myshopify.com
 *   VITE_SHOPIFY_STOREFRONT_TOKEN   storefront access token from Shopify Admin
 *
 * Get a token at: Shopify Admin > Online Store > Domains > Storefront API
 * access tokens > Create token > scopes: unauthenticated_read_products,
 * unauthenticated_read_checkout
 */
const DOMAIN = import.meta.env.VITE_SHOPIFY_STOREFRONT_DOMAIN!;
const TOKEN = import.meta.env.VITE_SHOPIFY_STOREFRONT_TOKEN!;
const API_VERSION = '2025-10'; // current Storefront API GraphQL version

export interface ProductVariantEdge {
  node: {
    id: string;
    title: string;
    price: { amount: string; currencyCode: string };
  };
}

export interface ProductImage {
  url: string;
  altText: string;
}

export interface ProductEdge {
  node: {
    id: string;
    title: string;
    handle: string;
    description: string;
    descriptionHtml: string;
    variants: { edges: ProductVariantEdge[]; totalCount: number };
    featuredImage?: ProductImage;
    images?: { edges: { node: ProductImage }[] };
    availableForSale: boolean;
    priceRange: {
      minVariantPrice: { amount: string; currencyCode: string };
      maxVariantPrice: { amount: string; currencyCode: string };
    };
    onlineStoreUrl?: string;
  };
}

/**
 * Fetch all products from the Shopify store.
 */
export async function fetchProducts(): Promise<ProductEdge['node'][]> {
  const query = `
    query ShopifyProducts {
      products(first: 10, sortKey: CREATED_AT, directions: DESC) {
        edges {
          node {
            id
            title
            handle
            description
            descriptionHtml
            availableForSale
            variants(first: 250) {
              edges {
                node {
                  id
                  title
                  price { amount currencyCode }
                }
              }
            }
            featuredImage {
              url
              altText
            }
            images(first: 10) {
              edges {
                node {
                  url
                  altText
                }
              }
            }
            priceRange {
              minVariantPrice { amount currencyCode }
              maxVariantPrice { amount currencyCode }
            }
            onlineStoreUrl
          }
        }
      }
    }
  `;

  const response = await fetch(`https://${DOMAIN}/api/${API_VERSION}/graphql.json`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': TOKEN,
    },
    body: JSON.stringify({ query }),
  });

  if (!response.ok) {
    throw new Error(`Shopify API request failed: ${response.status} ${response.statusText}`);
  }

  const { data, errors } = await response.json();

  if (errors || !data) {
    throw new Error(
      errors
        ? errors.map((e: any) => e.message).join(', ')
        : 'No data returned from Shopify'
    );
  }

  return data.products.edges.map((edge: ProductEdge) => edge.node);
}