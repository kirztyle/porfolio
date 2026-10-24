import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "dxlymbpdluttnqkgcwio.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
      // Logo perusahaan di section Experience (lib/companyLogos.ts)
      { protocol: "https", hostname: "www.pdsb.co.id", pathname: "/img/**" },
      { protocol: "https", hostname: "www.hcml.co.id", pathname: "/wp-content/uploads/**" },
      { protocol: "https", hostname: "upload.wikimedia.org", pathname: "/wikipedia/commons/**" },
      { protocol: "https", hostname: "static.wixstatic.com", pathname: "/media/**" },
    ],
  },
};

export default nextConfig;
