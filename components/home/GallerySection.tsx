"use client";

import Image from "next/image";
import { useState } from "react";
import { Maximize2 } from "lucide-react";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { Product } from "@/types";

const fallbackImage = {
  src: "/images/hologram-fan-hero.svg",
  alt: "Product gallery image",
  title: "Product view",
};

export function GallerySection({ product }: { product: Product | null }) {
  const images = product?.images.length ? product.images : [fallbackImage];
  const [selected, setSelected] = useState(images[0]);

  return (
    <AnimatedSection id="gallery" className="bg-white py-20 dark:bg-slate-950">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-cyan-600 dark:text-cyan-400">
              Gallery
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-normal text-slate-950 dark:text-white sm:text-4xl">
              Product images in one interactive showcase.
            </h2>
            <p className="mt-4 text-base leading-7 text-slate-600 dark:text-slate-400">
              See the catalog media uploaded for the current featured product.
            </p>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-3 dark:border-white/10 dark:bg-white/5">
            <div className="relative overflow-hidden rounded-[1.35rem] bg-white dark:bg-slate-950">
              <Image
                src={selected.src}
                alt={selected.alt}
                width={1400}
                height={980}
                className="aspect-[1.35/1] w-full object-cover transition duration-500"
              />
              <div className="absolute bottom-4 left-4 inline-flex items-center gap-2 rounded-full bg-white/85 px-3 py-2 text-sm font-semibold text-slate-800 shadow-lg backdrop-blur dark:bg-slate-950/75 dark:text-white">
                <Maximize2 className="h-4 w-4 text-cyan-500" />
                {selected.title}
              </div>
            </div>
          </div>
        </div>
        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {images.map((image) => (
            <button
              key={image.src}
              onClick={() => setSelected(image)}
              className="group overflow-hidden rounded-2xl border border-slate-200 bg-white p-2 text-left transition hover:-translate-y-1 hover:shadow-lg dark:border-white/10 dark:bg-white/5"
            >
              <Image
                src={image.src}
                alt={image.alt}
                width={420}
                height={300}
                className="aspect-[1.25/1] w-full rounded-xl object-cover"
              />
              <span className="mt-2 block px-1 text-xs font-semibold text-slate-600 group-hover:text-slate-950 dark:text-slate-400 dark:group-hover:text-white">
                {image.title}
              </span>
            </button>
          ))}
        </div>
      </div>
    </AnimatedSection>
  );
}
