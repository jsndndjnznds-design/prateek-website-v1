"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRef } from "react";
import { Product } from "@/types";
import { ProductCard } from "@/components/product/ProductCard";

export function FeaturedProductCarousel({
  products,
  ariaLabel = "Product row",
  eagerFirst = false,
}: {
  products: Product[];
  ariaLabel?: string;
  eagerFirst?: boolean;
}) {
  const scrollerRef = useRef<HTMLDivElement>(null);

  function scroll(direction: "previous" | "next") {
    const scroller = scrollerRef.current;
    if (!scroller) return;

    scroller.scrollBy({
      left: (direction === "previous" ? -1 : 1) * Math.max(scroller.clientWidth * 0.82, 300),
      behavior: "smooth",
    });
  }

  return (
    <div className="mt-6 sm:mt-10">
      {products.length > 1 ? (
        <div className="mb-4 hidden justify-end gap-2 sm:flex">
          <button
            type="button"
            onClick={() => scroll("previous")}
            aria-label={`Show previous ${ariaLabel.toLowerCase()}`}
            className="grid h-10 w-10 place-items-center rounded-full border border-slate-200 text-slate-700 transition hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-500 dark:border-white/10 dark:text-slate-200 dark:hover:bg-white/10"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => scroll("next")}
            aria-label={`Show next ${ariaLabel.toLowerCase()}`}
            className="grid h-10 w-10 place-items-center rounded-full border border-slate-200 text-slate-700 transition hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-500 dark:border-white/10 dark:text-slate-200 dark:hover:bg-white/10"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      ) : null}
      <div
        ref={scrollerRef}
        tabIndex={0}
        role="region"
        aria-label={ariaLabel}
        onKeyDown={(event) => {
          if (event.key === "ArrowLeft") {
            event.preventDefault();
            scroll("previous");
          }
          if (event.key === "ArrowRight") {
            event.preventDefault();
            scroll("next");
          }
        }}
        className="flex snap-x snap-mandatory gap-5 overflow-x-auto pb-4 pr-4 outline-none [scrollbar-width:thin] focus-visible:ring-2 focus-visible:ring-cyan-500/60"
      >
        {products.map((product, index) => (
          <div key={product.id} className="w-[min(84vw,22rem)] shrink-0 snap-start sm:w-[21rem]">
            <ProductCard product={product} eager={eagerFirst && index === 0} />
          </div>
        ))}
      </div>
    </div>
  );
}
