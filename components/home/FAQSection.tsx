import { Accordion } from "@/components/ui/Accordion";
import { AnimatedSection } from "@/components/ui/AnimatedSection";

const faqs = [
  {
    question: "Can my team upload content without technical help?",
    answer:
      "Yes. HoloVista supports Wi-Fi upload from the companion app and browser dashboard. Most teams can replace product videos, menu loops, and campaign graphics in minutes.",
  },
  {
    question: "Is the hologram fan suitable for a retail counter?",
    answer:
      "Yes. The kit includes an acrylic cover, adjustable brightness, and stand or wall mounting options for counters, mall kiosks, showrooms, cafes, and event booths.",
  },
  {
    question: "What file formats does it support?",
    answer:
      "It supports common campaign formats including MP4, AVI, RMVB, GIF, JPG, and PNG, with 8 GB onboard storage for looping displays.",
  },
  {
    question: "How fast is delivery?",
    answer:
      "Prepaid orders ship from the Mumbai warehouse within 24-48 hours. Typical delivery across India is 3-7 business days depending on city and serviceability.",
  },
];

export function FAQSection() {
  return (
    <AnimatedSection className="bg-white py-20 dark:bg-slate-950">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[0.85fr_1.15fr] lg:px-8">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-cyan-600 dark:text-cyan-400">
            FAQ
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-normal text-slate-950 dark:text-white sm:text-4xl">
            Clear answers before you bring it into the store.
          </h2>
        </div>
        <Accordion items={faqs} />
      </div>
    </AnimatedSection>
  );
}
