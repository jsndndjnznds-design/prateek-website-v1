import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import { storefrontContent } from "@/data/storefront-content";

const footerLinks = [
  { href: "/", label: "Home" },
  { href: "/products", label: "Products" },
  { href: "/wishlist", label: "Wishlist" },
  { href: "/cart", label: "Cart" },
  { href: "/contact", label: "Contact" },
  { href: "/privacy-policy", label: "Privacy Policy" },
  { href: "/terms-and-conditions", label: "Terms & Conditions" },
  { href: "/shipping-policy", label: "Shipping Policy" },
  { href: "/return-refund-policy", label: "Return / Refund Policy" },
];

export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white dark:border-white/10 dark:bg-slate-950">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-10 sm:px-6 lg:grid-cols-[1.3fr_0.9fr] lg:px-8">
        <div>
          <p className="text-lg font-semibold text-slate-950 dark:text-white">{storefrontContent.store.name}</p>
          {storefrontContent.contact.email || storefrontContent.contact.phone || storefrontContent.contact.location ? (
            <div className="mt-6 grid gap-3 text-sm text-slate-600 dark:text-slate-400">
              {storefrontContent.contact.location ? <span className="inline-flex items-center gap-2"><MapPin className="h-4 w-4 text-cyan-500" />{storefrontContent.contact.location}</span> : null}
              {storefrontContent.contact.phone ? <span className="inline-flex items-center gap-2"><Phone className="h-4 w-4 text-cyan-500" />{storefrontContent.contact.phone}</span> : null}
              {storefrontContent.contact.email ? <span className="inline-flex items-center gap-2"><Mail className="h-4 w-4 text-cyan-500" />{storefrontContent.contact.email}</span> : null}
            </div>
          ) : null}
        </div>
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
            Store
          </p>
          <div className="mt-4 grid gap-3">
            {footerLinks.map((link) => (
              <Link
                href={link.href}
                key={link.href}
                className="text-sm text-slate-600 transition hover:text-slate-950 dark:text-slate-400 dark:hover:text-white"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
