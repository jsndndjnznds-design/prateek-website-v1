import { HeroSection } from "@/components/home/HeroSection";
import { ProductCatalogSection } from "@/components/home/ProductCatalogSection";
import { StorefrontInfoSection } from "@/components/home/StorefrontInfoSection";
import { getProducts } from "@/lib/storefront-service";
import { Product } from "@/types";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  let products: Product[] = [];
  let catalogError = false;

  try {
    products = await getProducts();
  } catch {
    catalogError = true;
  }

  const featuredProduct = products[0] ?? null;

  return (
    <>
      <HeroSection product={featuredProduct} />
      <ProductCatalogSection products={products} errorMessage={catalogError ? "Unable to load products." : undefined} />
      <StorefrontInfoSection />
    </>
  );
}
