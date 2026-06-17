export function getAdminEmails() {
  const rawEmails = process.env.ADMIN_EMAILS ?? process.env.ADMIN_EMAIL ?? "";

  return rawEmails
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);
}

export function isAdminEmail(email: string | null | undefined) {
  if (!email) return false;

  return getAdminEmails().includes(email.trim().toLowerCase());
}
