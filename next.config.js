/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['avatars.githubusercontent.com', 'lh3.googleusercontent.com'],
  },
  // Production optimizations
  compress: true,
  // Optimize package imports (lucide-react, etc.)
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
  // Bundle analyzer (enable with: ANALYZE=true pnpm build)
  // Note: @next/bundle-analyzer can be added for detailed reports
}

module.exports = nextConfig
