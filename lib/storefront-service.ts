import "server-only";

import { SupabaseClient } from "@supabase/supabase-js";
import { getSupabaseAdminClient } from "@/lib/supabase-admin";
import { ManagedProduct, Product, ProductImage, ProductSpec } from "@/types";

const productSelect = "id, name, description, category, price, discount_price, stock, images, created_at, updated_at";

const fallbackImage = "/images/hologram-fan-hero.svg";

type ProductRow = {
  id: string;
  name: string;
  description: string;
  category: string;
  price: number | string;
  discount_price: number | string | null;
  stock: number;
  images: string[] | null;
  created_at: string;
  updated_at: string;
};

function isUuid(value: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
}

function getShortDescription(description: string) {
  const trimmed = description.trim();
  const firstSentence = trimmed.match(/^(.+?[.!?])(\s|$)/)?.[1];

  if (firstSentence && firstSentence.length <= 180) return firstSentence;
  if (trimmed.length <= 180) return trimmed;

  return `${trimmed.slice(0, 177).trim()}...`;
}

function getProductImages(row: ProductRow): ProductImage[] {
  const images = Array.isArray(row.images) ? row.images.filter(Boolean) : [];
  const usableImages = images.length > 0 ? images : [fallbackImage];

  return usableImages.map((src, index) => ({
    src,
    alt: `${row.name} product image ${index + 1}`,
    title: index === 0 ? "Product view" : `Product view ${index + 1}`,
  }));
}

function getSpecifications(row: ProductRow, price: number, compareAtPrice: number): ProductSpec[] {
  const specs: ProductSpec[] = [
    { label: "Category", value: row.category },
    { label: "Stock", value: `${row.stock} units` },
    { label: "Product ID", value: row.id },
  ];

  if (compareAtPrice > price) {
    specs.push({ label: "List price", value: String(compareAtPrice) });
    specs.push({ label: "Sale price", value: String(price) });
  } else {
    specs.push({ label: "Price", value: String(price) });
  }

  return specs;
}

export function normalizeStorefrontProduct(row: ProductRow): Product {
  const compareAtPrice = Number(row.price);
  const price = row.discount_price === null ? compareAtPrice : Number(row.discount_price);

  return {
    id: row.id,
    slug: row.id,
    name: row.name,
    eyebrow: row.category,
    price,
    compareAtPrice,
    currency: "INR",
    stock: row.stock,
    shortDescription: getShortDescription(row.description),
    description: row.description,
    images: getProductImages(row),
    features: [],
    specifications: getSpecifications(row, price, compareAtPrice),
    included: [row.name, "Product media from the catalog", "Order and support handoff"],
    shipping: [
      "Shipping details are confirmed after checkout",
      "Order confirmation is saved with customer and item details",
      "Setup notes can be added during checkout",
    ],
  };
}

export function normalizeManagedProduct(row: ProductRow): ManagedProduct {
  return {
    id: row.id,
    name: row.name,
    description: row.description,
    category: row.category,
    price: Number(row.price),
    discount_price: row.discount_price === null ? null : Number(row.discount_price),
    stock: row.stock,
    images: Array.isArray(row.images) ? row.images : [],
    created_at: row.created_at,
    updated_at: row.updated_at,
  };
}

export async function listStorefrontProducts(limit?: number) {
  const supabase = getSupabaseAdminClient();

  if (!supabase) return [];

  let query = supabase.from("products").select(productSelect).order("created_at", { ascending: false });

  if (limit) {
    query = query.limit(limit);
  }

  const { data, error } = await query;

  if (error) throw new Error(error.message);

  return ((data ?? []) as ProductRow[]).map(normalizeStorefrontProduct);
}

export async function listManagedStorefrontProducts(supabase: SupabaseClient) {
  const { data, error } = await supabase.from("products").select(productSelect).order("created_at", { ascending: false });

  if (error) throw new Error(error.message);

  return ((data ?? []) as ProductRow[]).map(normalizeManagedProduct);
}

export async function getStorefrontProductById(id: string) {
  const supabase = getSupabaseAdminClient();

  if (!supabase || !isUuid(id)) return null;

  const { data, error } = await supabase.from("products").select(productSelect).eq("id", id).maybeSingle();

  if (error) throw new Error(error.message);

  return data ? normalizeStorefrontProduct(data as ProductRow) : null;
}

export async function getStorefrontProductByIdentifier(identifier: string) {
  const productById = await getStorefrontProductById(identifier);

  if (productById) return productById;

  const products = await listStorefrontProducts();

  return products.find((product) => product.slug === identifier) ?? null;
}
