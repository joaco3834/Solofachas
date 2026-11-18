import type { NextConfig } from "next";

// La landing se publica en GitHub Pages dentro de /Solofachas/landing
const basePath = "/Solofachas/landing";

const nextConfig: NextConfig = {
  output: "export",
  basePath,
  trailingSlash: true,
  images: { unoptimized: true },
  env: { NEXT_PUBLIC_BASE_PATH: basePath },
};

export default nextConfig;
