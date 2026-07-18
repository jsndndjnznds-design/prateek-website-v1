import { notFound } from "next/navigation";
import { ProductGallery } from "@/components/product/ProductGallery";
import { ProductPurchasePanel } from "@/components/product/ProductPurchasePanel";
import { ProductReviews } from "@/components/product/ProductReviews";
import { ProductSpecs } from "@/components/product/ProductSpecs";
import { StickyAddToCart } from "@/components/product/StickyAddToCart";
import { getStorefrontProductByIdentifier } from "@/lib/storefront-service";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const currentProduct = await getStorefrontProductByIdentifier(slug);

  return {
    title: currentProduct ? `${currentProduct.name} | GlamShot` : "Product | GlamShot",
    description: currentProduct?.shortDescription,
  };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const currentProduct = await getStorefrontProductByIdentifier(slug);

  if (!currentProduct) {
    notFound();
  }

  return (
    <>
      <section className="bg-slate-50 py-6 dark:bg-slate-950 sm:py-12">
        <div className="mx-auto grid max-w-7xl gap-8 px-3 sm:gap-10 sm:px-6 lg:grid-cols-[1.02fr_0.98fr] lg:px-8 lg:py-4">
          <ProductGallery product={currentProduct} />
          <ProductPurchasePanel product={currentProduct} />
        </div>
      </section>
      <ProductSpecs product={currentProduct} />
      <ProductReviews />
      <StickyAddToCart product={currentProduct} />
    </>
  );
}
