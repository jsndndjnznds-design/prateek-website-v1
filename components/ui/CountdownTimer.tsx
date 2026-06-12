"use client";

import { Timer } from "lucide-react";
import { useCountdown } from "@/hooks/use-countdown";

export function CountdownTimer() {
  const { hours, minutes, seconds } = useCountdown(13);
  const parts = [
    { label: "Hours", value: hours },
    { label: "Mins", value: minutes },
    { label: "Secs", value: seconds },
  ];

  return (
    <div className="rounded-3xl border border-cyan-400/20 bg-cyan-400/10 p-4 text-slate-950 dark:text-white">
      <div className="flex items-center gap-2 text-sm font-semibold">
        <Timer className="h-4 w-4 text-cyan-500" />
        Launch pricing ends soon
      </div>
      <div className="mt-3 grid grid-cols-3 gap-2">
        {parts.map((part) => (
          <div key={part.label} className="rounded-2xl bg-white/80 p-3 text-center shadow-sm dark:bg-slate-950/40">
            <span className="block text-xl font-bold tabular-nums">
              {String(part.value).padStart(2, "0")}
            </span>
            <span className="text-[11px] font-medium uppercase tracking-[0.12em] text-slate-500 dark:text-slate-400">
              {part.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
