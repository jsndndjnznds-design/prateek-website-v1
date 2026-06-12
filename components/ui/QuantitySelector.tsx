"use client";

import { Minus, Plus } from "lucide-react";

export function QuantitySelector({
  value,
  onChange,
  min = 1,
  max = 9,
}: {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
}) {
  return (
    <div className="inline-grid h-12 grid-cols-[42px_48px_42px] overflow-hidden rounded-full border border-slate-200 bg-white shadow-sm dark:border-white/10 dark:bg-white/5">
      <button
        aria-label="Decrease quantity"
        onClick={() => onChange(Math.max(min, value - 1))}
        className="grid place-items-center text-slate-500 transition hover:bg-slate-100 hover:text-slate-950 dark:hover:bg-white/10 dark:hover:text-white"
      >
        <Minus className="h-4 w-4" />
      </button>
      <span className="grid place-items-center text-sm font-semibold text-slate-950 dark:text-white">
        {value}
      </span>
      <button
        aria-label="Increase quantity"
        onClick={() => onChange(Math.min(max, value + 1))}
        className="grid place-items-center text-slate-500 transition hover:bg-slate-100 hover:text-slate-950 dark:hover:bg-white/10 dark:hover:text-white"
      >
        <Plus className="h-4 w-4" />
      </button>
    </div>
  );
}
