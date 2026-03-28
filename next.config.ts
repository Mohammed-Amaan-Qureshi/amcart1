import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: __dirname,
  },
  images: {
    remotePatterns: [
      {hostname : "lh3.googleusercontent.com"},
      {hostname : "res.cloudinary.com"}
    ]
  },
  /* config options here */
  reactCompiler: true,
};

export default nextConfig;
