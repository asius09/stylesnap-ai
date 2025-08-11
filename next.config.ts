import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "tmpfiles.org",
        port: "",
        pathname: "/dl/**",
      },
      {
        protocol: "https",
        hostname: "tmpfiles.org",
        port: "",
        pathname: "/dl/**",
      },
    ],
  },
};

export default nextConfig;
