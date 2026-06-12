"use client";

import { ChevronDown } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

export function Accordion({
  items,
}: {
  items: Array<{ question: string; answer: string }>;
}) {
  const [open, setOpen] = useState(0);

  return (
    <div className="divide-y divide-slate-200 overflow-hidden rounded-3xl border border-slate-200 bg-white dark:divide-white/10 dark:border-white/10 dark:bg-white/5">
      {items.map((item, index) => (
        <div key={item.question}>
          <button
            className="flex w-full items-center justify-between gap-4 px-5 py-5 text-left"
            onClick={() => setOpen(open === index ? -1 : index)}
          >
            <span className="font-semibold text-slate-950 dark:text-white">{item.question}</span>
            <ChevronDown
              className={cn(
                "h-5 w-5 shrink-0 text-slate-500 transition",
                open === index && "rotate-180 text-cyan-500",
              )}
            />
          </button>
          <div
            className={cn(
              "grid transition-all duration-300",
              open === index ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
            )}
          >
            <div className="overflow-hidden">
              <p className="px-5 pb-5 text-sm leading-6 text-slate-600 dark:text-slate-400">
                {item.answer}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
