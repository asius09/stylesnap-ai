import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "zqzpzuvgyfgacdfglxkj.supabase.co",
        port: "",
        pathname: "/storage/v1/object/public/upload_images/**",
      },
      {
        protocol: "https",
        hostname: "replicate.delivery",
        port: "",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
