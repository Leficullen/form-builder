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
      {
        source: "/api-docs",
        destination: `${process.env.BACKEND_URL || "http://localhost:4000"}/api-docs/`,
      },
      {
        source: "/api-docs/:path*",
        destination: `${process.env.BACKEND_URL || "http://localhost:4000"}/api-docs/:path*`,
      },
    ];
  },
};

export default nextConfig;
