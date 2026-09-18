import Link from "next/link";
import { ArrowRight, CircleAlert, PackageSearch } from "lucide-react";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { FeaturedProductCarousel } from "@/components/product/FeaturedProductCarousel";
import { Product } from "@/types";

export function ProductCatalogSection({ products, errorMessage }: { products: Product[]; errorMessage?: string }) {
  return (
    <AnimatedSection id="products" className="bg-white py-20 dark:bg-slate-950">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-cyan-600 dark:text-cyan-400">
              Our products
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-normal text-slate-950 dark:text-white sm:text-4xl">
              Explore the catalog
            </h2>
          </div>
          <div className="flex items-center gap-4">
            <p className="max-w-xl text-sm leading-6 text-slate-600 dark:text-slate-400">
              Product details, current pricing, and availability are shown on every listing.
            </p>
            <Link href="/products" className="hidden shrink-0 items-center gap-1.5 text-sm font-semibold text-cyan-700 hover:text-cyan-800 sm:inline-flex dark:text-cyan-300 dark:hover:text-cyan-200">
              View all
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        {errorMessage ? (
          <div className="mt-10 grid min-h-72 place-items-center rounded-2xl border border-dashed border-amber-300 bg-amber-50/60 px-6 text-center dark:border-amber-400/30 dark:bg-amber-400/5">
            <div>
              <CircleAlert className="mx-auto h-7 w-7 text-amber-600 dark:text-amber-300" />
              <h3 className="mt-4 text-lg font-semibold text-slate-950 dark:text-white">The catalog is temporarily unavailable</h3>
              <p className="mt-2 max-w-sm text-sm text-slate-600 dark:text-slate-400">Please refresh the page or try again shortly.</p>
            </div>
          </div>
        ) : products.length === 0 ? (
          <div className="mt-10 grid min-h-72 place-items-center rounded-3xl border border-dashed border-slate-300 bg-slate-50 text-center dark:border-white/15 dark:bg-white/5">
            <div>
              <PackageSearch className="mx-auto h-7 w-7 text-cyan-500" />
              <h3 className="mt-4 text-lg font-semibold text-slate-950 dark:text-white">No products are available right now</h3>
              <p className="mt-2 max-w-sm text-sm text-slate-500 dark:text-slate-400">
                Please check back soon for the latest HoloVista products.
              </p>
            </div>
          </div>
        ) : (
          <>
            <FeaturedProductCarousel products={products} />
            <Link href="/products" className="mt-8 inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-white/10 dark:text-slate-200 dark:hover:bg-white/10 sm:hidden">
              View the complete catalog
              <ArrowRight className="h-4 w-4" />
            </Link>
          </>
        )}
      </div>
    </AnimatedSection>
  );
}
