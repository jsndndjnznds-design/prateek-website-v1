import Image from "next/image";
import Link from "next/link";
import { ArrowRight, PackageSearch } from "lucide-react";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { formatCurrency } from "@/lib/utils";
import { Product } from "@/types";

function ProductCard({ product }: { product: Product }) {
  const image = product.images[0];
  const hasDiscount = product.compareAtPrice > product.price;

  return (
    <Link
      href={`/product/${product.slug}`}
      className="group overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-950/8 dark:border-white/10 dark:bg-white/5"
    >
      <Image
        src={image.src}
        alt={image.alt}
        width={780}
        height={560}
        className="aspect-[1.25/1] w-full object-cover"
      />
      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-cyan-600 dark:text-cyan-400">
              {product.eyebrow}
            </p>
            <h3 className="mt-2 text-lg font-semibold text-slate-950 transition group-hover:text-cyan-600 dark:text-white">
              {product.name}
            </h3>
          </div>
          <span className="shrink-0 rounded-full bg-emerald-400/15 px-3 py-1 text-xs font-bold text-emerald-700 dark:text-emerald-300">
            {product.stock} left
          </span>
        </div>
        <p className="mt-3 line-clamp-2 text-sm leading-6 text-slate-600 dark:text-slate-400">
          {product.shortDescription}
        </p>
        <div className="mt-5 flex items-end justify-between gap-3">
          <div>
            <p className="text-xl font-semibold text-slate-950 dark:text-white">{formatCurrency(product.price)}</p>
            {hasDiscount ? (
              <p className="text-sm text-slate-400 line-through">{formatCurrency(product.compareAtPrice)}</p>
            ) : null}
          </div>
          <span className="inline-flex h-10 items-center justify-center gap-2 rounded-full bg-slate-950 px-4 text-sm font-semibold text-white dark:bg-white dark:text-slate-950">
            View
            <ArrowRight className="h-4 w-4" />
          </span>
        </div>
      </div>
    </Link>
  );
}

export function ProductCatalogSection({ products }: { products: Product[] }) {
  return (
    <AnimatedSection id="products" className="bg-white py-20 dark:bg-slate-950">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-cyan-600 dark:text-cyan-400">
              Products
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-normal text-slate-950 dark:text-white sm:text-4xl">
              Current catalog
            </h2>
          </div>
          <p className="max-w-xl text-sm leading-6 text-slate-600 dark:text-slate-400">
            {products.length} product{products.length === 1 ? "" : "s"} available from Supabase.
          </p>
        </div>

        {products.length === 0 ? (
          <div className="mt-10 grid min-h-72 place-items-center rounded-3xl border border-dashed border-slate-300 bg-slate-50 text-center dark:border-white/15 dark:bg-white/5">
            <div>
              <PackageSearch className="mx-auto h-7 w-7 text-cyan-500" />
              <h3 className="mt-4 text-lg font-semibold text-slate-950 dark:text-white">No products are live</h3>
              <p className="mt-2 max-w-sm text-sm text-slate-500 dark:text-slate-400">
                Products added in admin will appear here after Supabase is configured.
              </p>
            </div>
          </div>
        ) : (
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </AnimatedSection>
  );
}
