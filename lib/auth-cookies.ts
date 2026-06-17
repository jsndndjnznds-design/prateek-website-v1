export const authCookieNames = {
  accessToken: "holovista_sb_access_token",
  refreshToken: "holovista_sb_refresh_token",
} as const;

const fallbackAccessTokenMaxAge = 60 * 60;

export const refreshTokenMaxAge = 60 * 60 * 24 * 30;

export function getAccessTokenMaxAge(expiresAt?: number | null) {
  if (!expiresAt) return fallbackAccessTokenMaxAge;

  const secondsUntilExpiry = Math.floor(expiresAt - Date.now() / 1000);
  return Math.max(secondsUntilExpiry, 0);
}

export function getAuthCookieOptions(maxAge: number) {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge,
  };
}

export function getExpiredAuthCookieOptions() {
  return getAuthCookieOptions(0);
}
