import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  output: "standalone",
  images: {
    remotePatterns: [
      new URL("https://nzprheefai1ubld0.public.blob.vercel-storage.com/**"),
    ],
  },
};

export default nextConfig;
