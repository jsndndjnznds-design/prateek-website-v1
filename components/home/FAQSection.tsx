import { Accordion } from "@/components/ui/Accordion";
import { AnimatedSection } from "@/components/ui/AnimatedSection";

const faqs = [
  {
    question: "How do I shop at GlamShot?",
    answer:
      "Choose a product, add it to your cart, complete the checkout form, and place your order. You’ll see an order number on the confirmation page.",
  },
  {
    question: "Can I review my total before ordering?",
    answer:
      "Yes. Your cart and checkout pages show the items, shipping, tax, and final total before you place the order.",
  },
  {
    question: "What payment methods are available?",
    answer:
      "Checkout shows the payment options currently available for your order. Your selected method is saved with the order details.",
  },
  {
    question: "Where can I find my order details?",
    answer:
      "Your confirmation page shows the order number, delivery details, items, payment method, and total after checkout.",
  },
];

export function FAQSection() {
  return (
    <AnimatedSection id="faq" className="bg-white py-20 dark:bg-slate-950">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[0.85fr_1.15fr] lg:px-8">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-cyan-600 dark:text-cyan-400">
            FAQ
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-normal text-slate-950 dark:text-white sm:text-4xl">
            Helpful answers before you shop.
          </h2>
        </div>
        <Accordion items={faqs} />
      </div>
    </AnimatedSection>
  );
}
