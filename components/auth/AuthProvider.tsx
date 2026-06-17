"use client";

import { Session } from "@supabase/supabase-js";
import { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase";

type ClientAuthUser = {
  id: string;
  email: string;
};

type AuthResponse = {
  user: ClientAuthUser;
  isAdmin: boolean;
};

type AuthContextValue = {
  user: ClientAuthUser | null;
  isAdmin: boolean;
  loading: boolean;
  error: string;
  syncSession: (session: Session | null) => Promise<AuthResponse | null>;
  refreshUser: () => Promise<AuthResponse | null>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

async function readAuthResponse(response: Response) {
  const data = (await response.json().catch(() => null)) as (AuthResponse & { error?: string }) | null;

  if (!response.ok) {
    throw new Error(data?.error ?? "Unable to validate the current session.");
  }

  return data as AuthResponse;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<ClientAuthUser | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const clearLocalState = useCallback(() => {
    setUser(null);
    setIsAdmin(false);
  }, []);

  const syncSession = useCallback(
    async (session: Session | null) => {
      if (!session) {
        await fetch("/api/auth/session", { method: "DELETE" });
        clearLocalState();
        return null;
      }

      const response = await fetch("/api/auth/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          access_token: session.access_token,
          refresh_token: session.refresh_token,
          expires_at: session.expires_at,
        }),
      });

      const data = await readAuthResponse(response);
      setUser(data.user);
      setIsAdmin(data.isAdmin);
      setError("");

      return data;
    },
    [clearLocalState],
  );

  const refreshUser = useCallback(async () => {
    const response = await fetch("/api/auth/me", { cache: "no-store" });
    const data = await readAuthResponse(response);

    setUser(data.user);
    setIsAdmin(data.isAdmin);
    setError("");

    return data;
  }, []);

  const logout = useCallback(async () => {
    if (supabase) {
      await supabase.auth.signOut();
    }

    await fetch("/api/auth/session", { method: "DELETE" });
    clearLocalState();
  }, [clearLocalState]);

  useEffect(() => {
    let mounted = true;

    async function restoreSession() {
      setLoading(true);

      try {
        if (!supabase) {
          await refreshUser();
          return;
        }

        const { data, error: sessionError } = await supabase.auth.getSession();

        if (sessionError) {
          throw sessionError;
        }

        if (data.session) {
          await syncSession(data.session);
        } else {
          await refreshUser().catch(() => {
            clearLocalState();
          });
        }
      } catch (restoreError) {
        if (!mounted) return;
        clearLocalState();
        setError(restoreError instanceof Error ? restoreError.message : "Unable to restore session.");
      } finally {
        if (mounted) setLoading(false);
      }
    }

    restoreSession();

    if (!supabase) {
      return () => {
        mounted = false;
      };
    }

    const { data } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "INITIAL_SESSION") return;

      void syncSession(session).catch((syncError) => {
        clearLocalState();
        setError(syncError instanceof Error ? syncError.message : "Unable to sync session.");
      });
    });

    return () => {
      mounted = false;
      data.subscription.unsubscribe();
    };
  }, [clearLocalState, refreshUser, syncSession]);

  const value = useMemo(
    () => ({
      user,
      isAdmin,
      loading,
      error,
      syncSession,
      refreshUser,
      logout,
    }),
    [error, isAdmin, loading, logout, refreshUser, syncSession, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider.");
  }

  return context;
}
