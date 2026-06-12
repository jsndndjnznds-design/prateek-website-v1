import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

export function Rating({
  value,
  count,
  size = "sm",
}: {
  value: number;
  count?: number;
  size?: "xs" | "sm" | "md";
}) {
  const iconClass = size === "md" ? "h-5 w-5" : size === "xs" ? "h-3.5 w-3.5" : "h-4 w-4";

  return (
    <div className="inline-flex items-center gap-2">
      <div className="inline-flex items-center gap-0.5">
        {Array.from({ length: 5 }).map((_, index) => (
          <Star
            key={index}
            className={cn(
              iconClass,
              index + 1 <= Math.round(value)
                ? "fill-amber-400 text-amber-400"
                : "fill-slate-200 text-slate-200 dark:fill-slate-700 dark:text-slate-700",
            )}
          />
        ))}
      </div>
      <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
        {value.toFixed(1)}
        {count ? <span className="text-slate-500 dark:text-slate-400"> ({count})</span> : null}
      </span>
    </div>
  );
}
