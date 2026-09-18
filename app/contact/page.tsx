import { Mail, MapPin, Phone } from "lucide-react";
import { storefrontContent } from "@/data/storefront-content";

export const metadata = { title: "Contact | ClamCart" };

export default function ContactPage() {
  const { contact } = storefrontContent;
  const hasContactDetails = Boolean(contact.email || contact.phone || contact.location);

  return (
    <section className="min-h-[70vh] bg-slate-50 py-12 dark:bg-slate-950 sm:py-16">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-cyan-600 dark:text-cyan-400">Contact</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight text-slate-950 dark:text-white sm:text-5xl">{contact.title}</h1>
        <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600 dark:text-slate-400">{contact.description}</p>
        {hasContactDetails ? (
          <div className="mt-8 grid gap-4 rounded-3xl border border-slate-200 bg-white p-6 text-sm text-slate-700 dark:border-white/10 dark:bg-white/5 dark:text-slate-300">
            {contact.email ? <p className="inline-flex items-center gap-2"><Mail className="h-4 w-4 text-cyan-500" />{contact.email}</p> : null}
            {contact.phone ? <p className="inline-flex items-center gap-2"><Phone className="h-4 w-4 text-cyan-500" />{contact.phone}</p> : null}
            {contact.location ? <p className="inline-flex items-center gap-2"><MapPin className="h-4 w-4 text-cyan-500" />{contact.location}</p> : null}
          </div>
        ) : (
          <div className="mt-8 rounded-3xl border border-dashed border-amber-300 bg-amber-50 p-6 text-sm leading-6 text-slate-600 dark:border-amber-400/30 dark:bg-amber-400/5 dark:text-slate-400">
            Verified customer contact details have not been configured yet. Update <code>data/storefront-content.ts</code> before publishing this page.
          </div>
        )}
      </div>
    </section>
  );
}
