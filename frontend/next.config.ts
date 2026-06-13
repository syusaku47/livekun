import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "http://backend:3001/api/:path*",
      },
      {
        source: "/uploads/:path*",
        destination: "http://backend:3001/uploads/:path*",
      },
    ];
  },
};

export default nextConfig;
