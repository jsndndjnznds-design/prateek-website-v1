import { CircleAlert, PackageSearch } from "lucide-react";
import { ProductCatalogBrowser } from "@/components/product/ProductCatalogBrowser";
import { getProducts } from "@/lib/storefront-service";
import { Product } from "@/types";

export const metadata = {
  title: "Products | ClamCart",
  description: "Browse the current ClamCart product catalog.",
};

export const dynamic = "force-dynamic";

export default async function ProductsPage() {
  let products: Product[] = [];
  let error = "";

  try {
    products = await getProducts();
  } catch {
    error = "Unable to load products. Please refresh the page or try again shortly.";
  }

  return (
    <section className="min-h-[70vh] bg-slate-50 py-12 dark:bg-slate-950 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-cyan-600 dark:text-cyan-400">Products</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight text-slate-950 dark:text-white sm:text-5xl">Shop the catalog</h1>
        <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600 dark:text-slate-400">Browse available products, filter the catalog, and open any listing for full product information.</p>
        {error ? (
          <div role="alert" className="mt-8 grid min-h-72 place-items-center rounded-3xl border border-dashed border-amber-300 bg-amber-50/60 px-6 text-center dark:border-amber-400/30 dark:bg-amber-400/5">
            <div>
              <CircleAlert className="mx-auto h-7 w-7 text-amber-600 dark:text-amber-300" />
              <h2 className="mt-4 text-lg font-semibold text-slate-950 dark:text-white">The catalog is temporarily unavailable</h2>
              <p className="mt-2 max-w-sm text-sm text-slate-600 dark:text-slate-400">{error}</p>
            </div>
          </div>
        ) : products.length === 0 ? (
          <div className="mt-8 grid min-h-72 place-items-center rounded-3xl border border-dashed border-slate-300 bg-white px-6 text-center dark:border-white/15 dark:bg-white/5">
            <div>
              <PackageSearch className="mx-auto h-7 w-7 text-cyan-500" />
              <h2 className="mt-4 text-lg font-semibold text-slate-950 dark:text-white">No products are available right now</h2>
              <p className="mt-2 max-w-sm text-sm text-slate-500 dark:text-slate-400">Please check back soon for the latest catalog updates.</p>
            </div>
          </div>
        ) : <ProductCatalogBrowser products={products} />}
      </div>
    </section>
  );
}
