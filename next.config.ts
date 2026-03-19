import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  output: "standalone",
  images: {
    remotePatterns: [
      new URL("https://nzprheefai1ubld0.public.blob.vercel-storage.com/**"),
      new URL("https://profile.line-scdn.net/**"),
    ],
    minimumCacheTTL: 14400, // 4 hours
  },
};

export default nextConfig;
