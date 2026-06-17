"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { LockKeyhole, Mail, ShieldCheck } from "lucide-react";
import { useAuth } from "@/components/auth/AuthProvider";
import { supabase } from "@/lib/supabase";
import { cn } from "@/lib/utils";

function getSafeNextPath(nextPath: string) {
  if (!nextPath || !nextPath.startsWith("/") || nextPath.startsWith("//")) return "/admin";

  return nextPath;
}

export function LoginForm({ nextPath }: { nextPath: string }) {
  const router = useRouter();
  const { isAdmin, loading, syncSession, logout } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const safeNextPath = useMemo(() => getSafeNextPath(nextPath), [nextPath]);

  useEffect(() => {
    if (!loading && isAdmin) {
      router.replace(safeNextPath);
    }
  }, [isAdmin, loading, router, safeNextPath]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (!supabase) {
      setError("Supabase is not configured. Add your public Supabase URL and anon key.");
      return;
    }

    setSubmitting(true);

    try {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (signInError) {
        throw signInError;
      }

      const session = await syncSession(data.session);

      if (!session?.isAdmin) {
        await logout();
        setError("This account is authenticated, but it is not authorized for admin access.");
        return;
      }

      router.replace(safeNextPath);
      router.refresh();
    } catch (signInError) {
      setError(signInError instanceof Error ? signInError.message : "Unable to sign in.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-2xl shadow-slate-950/10 dark:border-white/10 dark:bg-white/5 dark:shadow-black/20 sm:p-8">
      <div className="flex items-center gap-3">
        <span className="grid h-12 w-12 place-items-center rounded-2xl bg-cyan-400/15 text-cyan-700 dark:text-cyan-300">
          <ShieldCheck className="h-5 w-5" />
        </span>
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-cyan-600 dark:text-cyan-400">
            Secure access
          </p>
          <h1 className="text-2xl font-semibold tracking-normal text-slate-950 dark:text-white">Admin login</h1>
        </div>
      </div>

      <div className="mt-8 space-y-5">
        <label className="block">
          <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Email address</span>
          <span className="relative mt-2 block">
            <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              autoComplete="email"
              required
              className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 pl-11 pr-4 text-sm outline-none transition placeholder:text-slate-400 focus:border-cyan-400 focus:bg-white focus:ring-4 focus:ring-cyan-400/10 dark:border-white/10 dark:bg-white/5 dark:text-white dark:focus:bg-white/10"
              placeholder="admin@example.com"
            />
          </span>
        </label>

        <label className="block">
          <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Password</span>
          <span className="relative mt-2 block">
            <LockKeyhole className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete="current-password"
              required
              className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 pl-11 pr-4 text-sm outline-none transition placeholder:text-slate-400 focus:border-cyan-400 focus:bg-white focus:ring-4 focus:ring-cyan-400/10 dark:border-white/10 dark:bg-white/5 dark:text-white dark:focus:bg-white/10"
              placeholder="Enter your password"
            />
          </span>
        </label>
      </div>

      {error ? (
        <p role="alert" className="mt-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700 dark:border-red-400/20 dark:bg-red-400/10 dark:text-red-200">
          {error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={submitting || loading}
        className={cn(
          "mt-6 h-12 w-full rounded-full bg-slate-950 text-sm font-semibold text-white shadow-xl shadow-slate-950/15 transition hover:-translate-y-0.5 dark:bg-white dark:text-slate-950",
          (submitting || loading) && "cursor-not-allowed opacity-70 hover:translate-y-0",
        )}
      >
        {submitting ? "Signing in..." : loading ? "Checking session..." : "Sign in"}
      </button>
    </form>
  );
}
