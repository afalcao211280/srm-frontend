import type { NextConfig } from "next";

const config: NextConfig = {
  output: "standalone",
  reactStrictMode: true,
  async rewrites() {
    const api = process.env.API_INTERNAL_URL ?? "http://localhost:8080";
    return [
      { source: "/api/:path*", destination: `${api}/api/:path*` },
    ];
  },
};

export default config;
