/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: [],
  },
  webpack(config) {
    return config;
  },
  // Add this to handle WASM files
  experimental: {
    asyncWebAssembly: true,
    webVitalsAttribution: ['CLS', 'LCP'],
  },
  output: 'standalone',
};

module.exports = nextConfig;