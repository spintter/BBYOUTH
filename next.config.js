/** @type {import('next').NextConfig} */

const nextConfig = {
  reactStrictMode: true,
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ['three', '@react-three/fiber', '@react-three/drei'],
    optimizeServerReact: true,
    scrollRestoration: true,
  },
  serverExternalPackages: [],
  webpack(config, { dev, isServer }) {
    // Handle 3D model files with improved caching
    config.module.rules.push({
      test: /\.(glb|gltf)$/,
      type: 'asset/resource',
      generator: {
        filename: 'static/chunks/models/[hash][ext]',
      },
    });

    // Handle shader files if needed
    config.module.rules.push({
      test: /\.(glsl|vs|fs|vert|frag)$/,
      type: 'asset/source',
    });

    // Optimize bundle size in production
    if (!dev) {
      config.optimization.splitChunks = {
        chunks: 'all',
        minSize: 20000,
        maxSize: 244000,
        minChunks: 1,
        maxAsyncRequests: 30,
        maxInitialRequests: 30,
        cacheGroups: {
          three: {
            test: /[\\/]node_modules[\\/](three|@react-three)[\\/]/,
            name: 'three-vendors',
            chunks: 'all',
            priority: 10,
            reuseExistingChunk: true,
          },
          mui: {
            test: /[\\/]node_modules[\\/](@mui|@emotion)[\\/]/,
            name: 'mui-vendors',
            chunks: 'all',
            priority: 9,
            reuseExistingChunk: true,
          },
          vendors: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
            priority: -10,
            reuseExistingChunk: true,
          },
        },
      };
    }

    return config;
  },
  images: {
    domains: [],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes: [16, 32, 48, 64, 96, 128, 256],
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 86400,
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  compiler: {
    removeConsole:
      process.env.NODE_ENV === 'production'
        ? {
            exclude: ['error', 'warn'],
          }
        : false,
  },
  poweredByHeader: false,
  compress: true,
  staticPageGenerationTimeout: 120,
  onDemandEntries: {
    maxInactiveAge: 15 * 60 * 1000,
    pagesBufferLength: 2,
  },
};

module.exports = nextConfig;
