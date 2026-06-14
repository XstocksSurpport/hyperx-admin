import path from "path";
import type { NextConfig } from "next";

const adminRoot = path.resolve(__dirname);

const nextConfig: NextConfig = {
  devIndicators: false,
  turbopack: {
    root: adminRoot,
  },
};

export default nextConfig;
