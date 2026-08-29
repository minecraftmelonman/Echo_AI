/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
    allowedDevOrigins: true,
  },
  images: {
    unoptimized: true,
  },
}

export default nextConfig
