import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "app-imagenes-stock-ecommerce.s3.us-east-2.amazonaws.com",
      },
    ],
  },
};

export default nextConfig;
