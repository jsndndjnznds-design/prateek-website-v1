"use client";

import { PackageSearch, Search } from "lucide-react";
import { useMemo, useState } from "react";
import { Product } from "@/types";
import { ProductCard } from "@/components/product/ProductCard";

type SortOption = "newest" | "price-low" | "price-high" | "name";

export function ProductCatalogBrowser({ products }: { products: Product[] }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [sort, setSort] = useState<SortOption>("newest");
  const categories = useMemo(() => ["All", ...Array.from(new Set(products.map((product) => product.eyebrow))).sort()], [products]);
  const displayedProducts = useMemo(() => {
    const term = query.trim().toLowerCase();
    const result = products.filter((product) => {
      const matchesQuery = !term || `${product.name} ${product.eyebrow} ${product.shortDescription}`.toLowerCase().includes(term);
      return matchesQuery && (category === "All" || product.eyebrow === category);
    });

    return result.sort((first, second) => {
      if (sort === "price-low") return first.price - second.price;
      if (sort === "price-high") return second.price - first.price;
      if (sort === "name") return first.name.localeCompare(second.name);
      return 0;
    });
  }, [category, products, query, sort]);

  return (
    <>
      <div className="mt-8 grid gap-3 rounded-2xl border border-slate-200 bg-white p-3 sm:grid-cols-[minmax(0,1fr)_auto_auto] dark:border-white/10 dark:bg-white/5">
        <label className="relative block">
          <span className="sr-only">Search products</span>
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search products"
            className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm outline-none transition placeholder:text-slate-400 focus:border-cyan-400 focus:ring-4 focus:ring-cyan-400/10 dark:border-white/10 dark:bg-slate-950/50 dark:text-white"
          />
        </label>
        {categories.length > 2 ? (
          <label className="block">
            <span className="sr-only">Filter by category</span>
            <select value={category} onChange={(event) => setCategory(event.target.value)} className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm font-medium text-slate-700 outline-none focus:border-cyan-400 focus:ring-4 focus:ring-cyan-400/10 dark:border-white/10 dark:bg-slate-950/50 dark:text-slate-200">
              {categories.map((option) => <option key={option}>{option}</option>)}
            </select>
          </label>
        ) : null}
        <label className="block">
          <span className="sr-only">Sort products</span>
          <select value={sort} onChange={(event) => setSort(event.target.value as SortOption)} className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm font-medium text-slate-700 outline-none focus:border-cyan-400 focus:ring-4 focus:ring-cyan-400/10 dark:border-white/10 dark:bg-slate-950/50 dark:text-slate-200">
            <option value="newest">Newest</option>
            <option value="price-low">Price: low to high</option>
            <option value="price-high">Price: high to low</option>
            <option value="name">Name: A to Z</option>
          </select>
        </label>
      </div>
      <p aria-live="polite" className="mt-5 text-sm text-slate-500 dark:text-slate-400">
        {displayedProducts.length} {displayedProducts.length === 1 ? "product" : "products"} shown
      </p>
      {displayedProducts.length === 0 ? (
        <div className="mt-6 grid min-h-72 place-items-center rounded-3xl border border-dashed border-slate-300 bg-slate-50 px-6 text-center dark:border-white/15 dark:bg-white/5">
          <div>
            <PackageSearch className="mx-auto h-7 w-7 text-cyan-500" />
            <h2 className="mt-4 text-lg font-semibold text-slate-950 dark:text-white">No matching products</h2>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Try another search term or clear the selected filters.</p>
          </div>
        </div>
      ) : (
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
          {displayedProducts.map((product, index) => <ProductCard key={product.id} product={product} eager={index === 0} />)}
        </div>
      )}
    </>
  );
}
