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
  // Add cross-origin isolation headers
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Cross-Origin-Embedder-Policy',
            value: 'require-corp'
          },
          {
            key: 'Cross-Origin-Opener-Policy',
            value: 'same-origin'
          }
        ],
      }
    ];
  },
  // Add this to handle WASM files
  experimental: {
    asyncWebAssembly: true,
    webVitalsAttribution: ['CLS', 'LCP'],
    output: 'standalone',
  }
};

module.exports = nextConfig;