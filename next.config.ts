import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: {
    loader: "custom",
    loaderFile: "./src/lib/image-loader.ts",
  },
  basePath: process.env.NEXT_PUBLIC_BASE_PATH ?? "",
  assetPrefix: process.env.NEXT_PUBLIC_BASE_PATH ?? "",
};

export default nextConfig;
