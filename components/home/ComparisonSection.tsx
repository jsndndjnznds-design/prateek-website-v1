import { Check, Minus } from "lucide-react";
import { AnimatedSection } from "@/components/ui/AnimatedSection";

const rows = [
  ["Floating 3D attention", "Yes", "No"],
  ["Content scheduling", "Wi-Fi app upload", "Manual USB or media player"],
  ["Footprint", "Wall or compact stand", "Large wall or counter space"],
  ["Share-worthy motion", "High", "Medium"],
  ["Launch impact", "Premium and memorable", "Familiar and easy to ignore"],
];

export function ComparisonSection() {
  return (
    <AnimatedSection className="bg-slate-950 py-20 text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-cyan-300">Comparison</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-normal sm:text-4xl">
            A display customers notice before they read the offer.
          </h2>
        </div>
        <div className="mt-10 overflow-hidden rounded-3xl border border-white/10 bg-white/5">
          <div className="grid grid-cols-[1.2fr_1fr_1fr] border-b border-white/10 bg-white/8 text-sm font-semibold">
            <div className="p-4">Capability</div>
            <div className="p-4 text-cyan-200">Current catalog product</div>
            <div className="p-4 text-slate-300">Traditional display</div>
          </div>
          {rows.map((row) => (
            <div key={row[0]} className="grid grid-cols-[1.2fr_1fr_1fr] border-b border-white/10 last:border-b-0">
              <div className="p-4 text-sm font-medium text-slate-200">{row[0]}</div>
              <div className="flex items-center gap-2 p-4 text-sm text-white">
                <Check className="h-4 w-4 text-emerald-300" />
                {row[1]}
              </div>
              <div className="flex items-center gap-2 p-4 text-sm text-slate-400">
                <Minus className="h-4 w-4" />
                {row[2]}
              </div>
            </div>
          ))}
        </div>
      </div>
    </AnimatedSection>
  );
}
