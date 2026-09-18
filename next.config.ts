import type { NextConfig } from "next";

let supabaseImageHostname = "**.supabase.co";

try {
  if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
    supabaseImageHostname = new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).hostname;
  }
} catch {
  supabaseImageHostname = "**.supabase.co";
}

const nextConfig: NextConfig = {
  images: {
    formats: ["image/webp"],
    qualities: [75],
    remotePatterns: [
      {
        protocol: "https",
        hostname: supabaseImageHostname,
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
};

export default nextConfig;
