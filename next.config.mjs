/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.supabase.co", // Mengizinkan semua gambar dari Supabase
      },
    ],
  },
};

export default nextConfig;