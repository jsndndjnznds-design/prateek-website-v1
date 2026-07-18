"use client";

import Image from "next/image";
import { useState } from "react";
import { Search } from "lucide-react";
import { Product, ProductImage } from "@/types";
import { cn } from "@/lib/utils";

export function ProductGallery({ product }: { product: Product }) {
  const [selected, setSelected] = useState<ProductImage>(product.images[0]);
  const [origin, setOrigin] = useState("50% 50%");
  const [zoomed, setZoomed] = useState(false);

  return (
    <div className="lg:sticky lg:top-28">
      <div
        className="group relative overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm dark:border-white/10 dark:bg-white/5"
        onMouseEnter={() => setZoomed(true)}
        onMouseLeave={() => setZoomed(false)}
        onMouseMove={(event) => {
          const rect = event.currentTarget.getBoundingClientRect();
          const x = ((event.clientX - rect.left) / rect.width) * 100;
          const y = ((event.clientY - rect.top) / rect.height) * 100;
          setOrigin(`${x}% ${y}%`);
        }}
      >
        <Image
          src={selected.src}
          alt={selected.alt}
          width={1400}
          height={980}
          priority
          style={{ transformOrigin: origin }}
          className={cn(
            "aspect-[1.08/1] w-full object-cover transition duration-500",
            zoomed && "scale-125",
          )}
        />
        <div className="pointer-events-none absolute left-4 top-4 inline-flex items-center gap-2 rounded-full bg-white/85 px-3 py-2 text-xs font-semibold text-slate-700 shadow-lg backdrop-blur dark:bg-slate-950/75 dark:text-slate-200">
          <Search className="h-3.5 w-3.5 text-cyan-500" />
          Hover to zoom
        </div>
      </div>
      <div className="mt-4 grid grid-cols-3 gap-3">
        {product.images.map((image) => (
          <button
            key={image.src}
            onClick={() => setSelected(image)}
            className={cn(
              "overflow-hidden rounded-2xl border bg-white p-2 transition hover:-translate-y-0.5 hover:shadow-lg dark:bg-white/5",
              selected.src === image.src
                ? "border-cyan-400 ring-4 ring-cyan-400/15"
                : "border-slate-200 dark:border-white/10",
            )}
          >
            <Image
              src={image.src}
              alt={image.alt}
              width={260}
              height={210}
              className="aspect-[1.25/1] w-full rounded-xl object-cover"
            />
          </button>
        ))}
      </div>
    </div>
  );
}
