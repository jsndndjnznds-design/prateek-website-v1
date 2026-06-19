import { BenefitsSection } from "@/components/home/BenefitsSection";
import { ComparisonSection } from "@/components/home/ComparisonSection";
import { FAQSection } from "@/components/home/FAQSection";
import { GallerySection } from "@/components/home/GallerySection";
import { HeroSection } from "@/components/home/HeroSection";
import { ProductCatalogSection } from "@/components/home/ProductCatalogSection";
import { RecentPurchaseToast } from "@/components/home/RecentPurchaseToast";
import { SocialProofSection } from "@/components/home/SocialProofSection";
import { listStorefrontProducts } from "@/lib/storefront-service";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const products = await listStorefrontProducts();
  const featuredProduct = products[0] ?? null;

  return (
    <>
      <HeroSection product={featuredProduct} />
      <BenefitsSection />
      <SocialProofSection />
      <ProductCatalogSection products={products} />
      <GallerySection product={featuredProduct} />
      <ComparisonSection />
      <FAQSection />
      <RecentPurchaseToast />
    </>
  );
}
