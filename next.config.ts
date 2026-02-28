import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      // Route /api/express/* to /api/be/* BEFORE routing happens.
      // This bypasses the conflicting pages/api/express/[[...slug]].ts Pages Router file.
      {
        source: "/api/express/:path*",
        destination: "/api/be/:path*",
      },
    ];
  },
};

export default nextConfig;
