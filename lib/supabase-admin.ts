import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const configuredProductImagesBucket = process.env.SUPABASE_PRODUCT_IMAGES_BUCKET?.trim();

export const productImagesBucket = configuredProductImagesBucket === "products" ? configuredProductImagesBucket : "products";

export function getSupabaseAdminClient() {
  if (!supabaseUrl || !supabaseServiceRoleKey) return null;

  return createClient(supabaseUrl, supabaseServiceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

export function getSupabaseAdminConfigError() {
  if (!supabaseUrl) return "Missing NEXT_PUBLIC_SUPABASE_URL.";
  if (!supabaseServiceRoleKey) return "Missing SUPABASE_SERVICE_ROLE_KEY.";

  return "";
}

export function getSupabaseUrl() {
  return supabaseUrl ?? "";
}
