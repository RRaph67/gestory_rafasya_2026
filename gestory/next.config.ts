import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Diperlukan untuk Docker deployment (menghasilkan .next/standalone)
  output: "standalone",
};

export default nextConfig;
