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
    ],
  },
};

export default nextConfig;
