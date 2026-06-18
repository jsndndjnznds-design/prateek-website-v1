import "server-only";

import { NextResponse } from "next/server";
import { SupabaseClient } from "@supabase/supabase-js";
import { getAdminUser } from "@/lib/auth-server";
import {
  getSupabaseAdminClient,
  getSupabaseAdminConfigError,
  getSupabaseUrl,
  productImagesBucket,
} from "@/lib/supabase-admin";
import {
  MAX_PRODUCT_IMAGES,
  validateProductDraft,
  validateProductImageFile,
  ValidProductFields,
} from "@/lib/product-validation";
import { ManagedProduct } from "@/types";

const productSelect = "id, name, description, category, price, discount_price, stock, images, created_at, updated_at";

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

export type ProductFormPayload = {
  fields: ValidProductFields;
  existingImages: string[];
  newImages: File[];
};

export type ProductAdminContext = {
  supabase: SupabaseClient;
  response?: never;
};

export type ProductAdminErrorContext = {
  supabase?: never;
  response: NextResponse;
};

function jsonError(message: string, status: number) {
  return NextResponse.json({ error: message }, { status });
}

export async function getProductAdminContext(): Promise<ProductAdminContext | ProductAdminErrorContext> {
  const admin = await getAdminUser();

  if (!admin) {
    return { response: jsonError("Unauthorized admin request.", 401) };
  }

  const supabase = getSupabaseAdminClient();

  if (!supabase) {
    return {
      response: jsonError(`Product management is not configured. ${getSupabaseAdminConfigError()}`, 500),
    };
  }

  return { supabase };
}

function normalizeProduct(row: ProductRow): ManagedProduct {
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

function isFileEntry(value: FormDataEntryValue): value is File {
  return typeof value !== "string" && value.size > 0;
}

function getFormString(formData: FormData, key: string) {
  const value = formData.get(key);

  return typeof value === "string" ? value : "";
}

export function parseProductFormData(formData: FormData): { payload: ProductFormPayload | null; errors: Record<string, string> } {
  const existingImages = formData
    .getAll("existingImages")
    .filter((value): value is string => typeof value === "string")
    .map((value) => value.trim())
    .filter(Boolean);
  const newImages = formData.getAll("images").filter(isFileEntry);
  const fileErrors = newImages
    .map((file) => validateProductImageFile(file))
    .filter(Boolean);
  const validation = validateProductDraft(
    {
      name: getFormString(formData, "name"),
      description: getFormString(formData, "description"),
      category: getFormString(formData, "category"),
      price: getFormString(formData, "price"),
      discountPrice: getFormString(formData, "discount_price"),
      stock: getFormString(formData, "stock"),
      imageCount: existingImages.length + newImages.length,
    },
    { requireImages: true },
  );
  const errors = { ...validation.errors };

  if (fileErrors.length > 0) {
    errors.images = fileErrors[0];
  }

  if (Object.keys(errors).length > 0 || !validation.values) {
    return { payload: null, errors };
  }

  return {
    payload: {
      fields: validation.values,
      existingImages: existingImages.slice(0, MAX_PRODUCT_IMAGES),
      newImages,
    },
    errors: {},
  };
}

export async function listProducts(supabase: SupabaseClient) {
  const { data, error } = await supabase.from("products").select(productSelect).order("created_at", { ascending: false });

  if (error) throw new Error(error.message);

  return ((data ?? []) as ProductRow[]).map(normalizeProduct);
}

export async function getProductById(supabase: SupabaseClient, id: string) {
  const { data, error } = await supabase.from("products").select(productSelect).eq("id", id).maybeSingle();

  if (error) throw new Error(error.message);

  return data ? normalizeProduct(data as ProductRow) : null;
}

function getImageExtension(file: File) {
  const extension = file.name.split(".").pop()?.toLowerCase().replace(/[^a-z0-9]/g, "");

  if (extension) return extension;
  if (file.type === "image/jpeg") return "jpg";
  if (file.type === "image/png") return "png";
  if (file.type === "image/webp") return "webp";
  if (file.type === "image/gif") return "gif";

  return "image";
}

function getSafeFileStem(fileName: string) {
  const stem = fileName.replace(/\.[^.]+$/, "");
  const safeStem = stem.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "").slice(0, 60);

  return safeStem || "product-image";
}

export async function uploadProductImages(supabase: SupabaseClient, files: File[]) {
  const uploadedUrls: string[] = [];

  for (const file of files) {
    const filePath = `products/${crypto.randomUUID()}-${getSafeFileStem(file.name)}.${getImageExtension(file)}`;
    const { error } = await supabase.storage.from(products).upload(filePath, await file.arrayBuffer(), {
      contentType: file.type,
      upsert: false,
    });

    if (error) {
      if (uploadedUrls.length > 0) {
        await deleteProductImages(supabase, uploadedUrls).catch(() => null);
      }

      throw new Error(error.message);
    }

    const { data } = supabase.storage.from(products).getPublicUrl(filePath);
    uploadedUrls.push(data.publicUrl);
  }

  return uploadedUrls;
}

function getStoragePathFromUrl(imageUrl: string) {
  const supabaseUrl = getSupabaseUrl();
  const publicMarker = `${supabaseUrl}/storage/v1/object/public/${productImagesBucket}/`;

  if (!supabaseUrl || !imageUrl.startsWith(publicMarker)) {
    return null;
  }

  return decodeURIComponent(imageUrl.slice(publicMarker.length).split("?")[0]);
}

export async function deleteProductImages(supabase: SupabaseClient, imageUrls: string[]) {
  const paths = imageUrls.map(getStoragePathFromUrl).filter((path): path is string => Boolean(path));

  if (paths.length === 0) return;

  const { error } = await supabase.storage.from(products).remove(paths);

  if (error) {
    throw new Error(error.message);
  }
}

export async function createProduct(supabase: SupabaseClient, payload: ProductFormPayload) {
  const uploadedImages = await uploadProductImages(supabase, payload.newImages);

  try {
    const { data, error } = await supabase
      .from("products")
      .insert({
        ...payload.fields,
        images: uploadedImages,
      })
      .select(productSelect)
      .single();

    if (error) throw new Error(error.message);

    return normalizeProduct(data as ProductRow);
  } catch (error) {
    await deleteProductImages(supabase, uploadedImages).catch(() => null);
    throw error;
  }
}

export async function updateProduct(supabase: SupabaseClient, id: string, payload: ProductFormPayload) {
  const existingProduct = await getProductById(supabase, id);

  if (!existingProduct) return null;

  const uploadedImages = await uploadProductImages(supabase, payload.newImages);
  const nextImages = [...payload.existingImages, ...uploadedImages].slice(0, MAX_PRODUCT_IMAGES);
  const removedImages = existingProduct.images.filter((image) => !payload.existingImages.includes(image));

  try {
    const { data, error } = await supabase
      .from("products")
      .update({
        ...payload.fields,
        images: nextImages,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select(productSelect)
      .single();

    if (error) throw new Error(error.message);

    await deleteProductImages(supabase, removedImages).catch(() => null);

    return normalizeProduct(data as ProductRow);
  } catch (error) {
    await deleteProductImages(supabase, uploadedImages).catch(() => null);
    throw error;
  }
}

export async function deleteProduct(supabase: SupabaseClient, id: string) {
  const existingProduct = await getProductById(supabase, id);

  if (!existingProduct) return null;

  await deleteProductImages(supabase, existingProduct.images);

  const { error } = await supabase.from("products").delete().eq("id", id);

  if (error) throw new Error(error.message);

  return existingProduct;
}
