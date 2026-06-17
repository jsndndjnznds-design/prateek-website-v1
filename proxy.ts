import { NextRequest, NextResponse } from "next/server";
import { isAdminEmail } from "@/lib/auth-config";
import { authCookieNames } from "@/lib/auth-cookies";

const protectedPathPrefixes = ["/admin", "/dashboard", "/orders", "/order-management"];

function isProtectedPath(pathname: string) {
  return protectedPathPrefixes.some((path) => pathname === path || pathname.startsWith(`${path}/`));
}

function getLoginRedirect(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const loginUrl = new URL("/login", request.url);
  loginUrl.searchParams.set("next", `${pathname}${search}`);

  return NextResponse.redirect(loginUrl);
}

async function getTokenEmail(accessToken: string) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) return null;

  const response = await fetch(`${supabaseUrl}/auth/v1/user`, {
    headers: {
      apikey: supabaseAnonKey,
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) return null;

  const data = (await response.json()) as { email?: unknown };

  return typeof data.email === "string" ? data.email : null;
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (!isProtectedPath(pathname)) {
    return NextResponse.next();
  }

  const accessToken = request.cookies.get(authCookieNames.accessToken)?.value;

  if (!accessToken) {
    return getLoginRedirect(request);
  }

  const email = await getTokenEmail(accessToken);

  if (!isAdminEmail(email)) {
    return getLoginRedirect(request);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/dashboard/:path*", "/orders/:path*", "/order-management/:path*"],
};
