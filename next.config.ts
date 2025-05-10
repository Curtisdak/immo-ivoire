import type { NextConfig } from "next";

const nextConfig: NextConfig = {
 



  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.pexels.com',
        pathname: '/**', // Allow all images from this domain
      },
    ],
  },
};

export default nextConfig;
