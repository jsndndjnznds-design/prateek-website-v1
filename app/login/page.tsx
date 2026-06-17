import { LoginForm } from "@/components/auth/LoginForm";

export const metadata = {
  title: "Admin Login | HoloVista",
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const nextParam = (await searchParams).next;
  const nextPath = Array.isArray(nextParam) ? nextParam[0] : nextParam ?? "/admin";

  return (
    <section className="bg-slate-50 py-16 dark:bg-slate-950 sm:py-20">
      <div className="mx-auto grid min-h-[62vh] max-w-6xl items-center gap-8 px-4 sm:px-6 lg:grid-cols-[0.9fr_1fr] lg:px-8">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-cyan-600 dark:text-cyan-400">
            HoloVista operations
          </p>
          <h2 className="mt-4 text-4xl font-semibold tracking-normal text-slate-950 dark:text-white sm:text-5xl">
            Sign in to manage orders and store performance.
          </h2>
          <p className="mt-5 max-w-xl text-base leading-7 text-slate-600 dark:text-slate-400">
            Admin access is limited to approved Supabase Auth users configured for this storefront.
          </p>
        </div>
        <LoginForm nextPath={nextPath} />
      </div>
    </section>
  );
}
