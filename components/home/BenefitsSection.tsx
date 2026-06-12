import { BadgeCheck, Eye, Gauge, UploadCloud } from "lucide-react";
import { AnimatedSection } from "@/components/ui/AnimatedSection";

const benefits = [
  {
    title: "Floating 3D motion",
    copy: "High-speed RGB blades refresh so quickly that graphics appear suspended in mid-air.",
    icon: Eye,
  },
  {
    title: "Bright in real venues",
    copy: "Adjustable brightness keeps launch visuals crisp across counters, kiosks, and showrooms.",
    icon: Gauge,
  },
  {
    title: "Fast content upload",
    copy: "Send videos, images, and campaign loops over Wi-Fi without touching the hardware.",
    icon: UploadCloud,
  },
  {
    title: "Retail-safe kit",
    copy: "Acrylic protection, mount options, and onboarding support make it practical for daily use.",
    icon: BadgeCheck,
  },
];

export function BenefitsSection() {
  return (
    <AnimatedSection className="bg-white py-20 dark:bg-slate-950">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-cyan-600 dark:text-cyan-400">
            How it works
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-normal text-slate-950 dark:text-white sm:text-4xl">
            LEDs spin faster than the eye can track, creating a crisp floating display.
          </h2>
          <p className="mt-4 text-base leading-7 text-slate-600 dark:text-slate-400">
            HoloVista maps each frame onto precision-timed LEDs along the blades, turning ordinary campaign assets into a dimensional visual that works in real retail spaces.
          </p>
        </div>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {benefits.map((benefit) => (
            <div
              key={benefit.title}
              className="group rounded-3xl border border-slate-200 bg-slate-50 p-6 transition hover:-translate-y-1 hover:bg-white hover:shadow-xl hover:shadow-slate-950/8 dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10"
            >
              <div className="grid h-12 w-12 place-items-center rounded-2xl bg-slate-950 text-white transition group-hover:bg-cyan-500 dark:bg-white dark:text-slate-950">
                <benefit.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-5 text-lg font-semibold text-slate-950 dark:text-white">{benefit.title}</h3>
              <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-400">{benefit.copy}</p>
            </div>
          ))}
        </div>
      </div>
    </AnimatedSection>
  );
}
