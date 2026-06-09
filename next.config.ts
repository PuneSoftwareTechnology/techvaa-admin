import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,

  // Multiple lockfiles exist on this machine; pin the workspace root so
  // Turbopack doesn't guess.
  turbopack: { root: import.meta.dirname },

  // Keep server-only DB packages out of the client bundle.
  serverExternalPackages: ["@prisma/client", "@prisma/adapter-pg", "pg"],
};

export default nextConfig;
