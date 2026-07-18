import { FAQSection } from "@/components/home/FAQSection";
import { HeroSection } from "@/components/home/HeroSection";
import { ProductCatalogSection } from "@/components/home/ProductCatalogSection";
import { listStorefrontProducts } from "@/lib/storefront-service";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const products = await listStorefrontProducts();
  const featuredProduct = products[0] ?? null;

  return (
    <>
      <HeroSection product={featuredProduct} />
      <ProductCatalogSection products={products} />
      <FAQSection />
    </>
  );
}
