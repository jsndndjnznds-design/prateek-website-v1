import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { isAdminEmail } from "@/lib/auth-config";
import { authCookieNames } from "@/lib/auth-cookies";

export type AuthUser = {
  id: string;
  email: string;
};

function getLoginPath(nextPath: string) {
  return `/login?next=${encodeURIComponent(nextPath)}`;
}

export async function getUserFromAccessToken(accessToken: string | undefined) {
  if (!accessToken || !supabase) return null;

  const { data, error } = await supabase.auth.getUser(accessToken);

  if (error || !data.user?.email) return null;

  return {
    id: data.user.id,
    email: data.user.email,
  } satisfies AuthUser;
}

export async function getAuthenticatedUser() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get(authCookieNames.accessToken)?.value;

  return getUserFromAccessToken(accessToken);
}

export async function getAdminUser() {
  const user = await getAuthenticatedUser();

  if (!user || !isAdminEmail(user.email)) return null;

  return user;
}

export async function requireAdmin(nextPath = "/admin") {
  const admin = await getAdminUser();

  if (!admin) {
    redirect(getLoginPath(nextPath));
  }

  return admin;
}
