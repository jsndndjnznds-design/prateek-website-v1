import { notFound } from "next/navigation";
import { ProductGallery } from "@/components/product/ProductGallery";
import { ProductPurchasePanel } from "@/components/product/ProductPurchasePanel";
import { ProductReviews } from "@/components/product/ProductReviews";
import { ProductSpecs } from "@/components/product/ProductSpecs";
import { StickyAddToCart } from "@/components/product/StickyAddToCart";
import { product, getProductBySlug } from "@/data/product";

export function generateStaticParams() {
  return [{ slug: product.slug }];
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const currentProduct = getProductBySlug(slug);

  return {
    title: currentProduct ? `${currentProduct.name} | HoloVista` : "Product | HoloVista",
    description: currentProduct?.shortDescription,
  };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const currentProduct = getProductBySlug(slug);

  if (!currentProduct) {
    notFound();
  }

  return (
    <>
      <section className="bg-slate-50 py-12 dark:bg-slate-950 sm:py-16">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[1.02fr_0.98fr] lg:px-8">
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
