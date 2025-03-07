/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    // Disable Turbopack to prevent excessive memory usage
    turbo: false,
    // Ensure we're using Webpack
    forceSwcTransforms: true,
  },
  // Optimize for production
  swcMinify: true,
  // Configure Webpack for better performance
  webpack: (config, { dev, isServer }) => {
    // Optimize for production builds
    if (!dev) {
      config.optimization.minimize = true;
    }
    
    // Add specific optimizations for 3D content
    config.module.rules.push({
      test: /\.(glb|gltf)$/,
      use: {
        loader: 'file-loader',
        options: {
          publicPath: '/_next/static/media',
          outputPath: 'static/media',
          name: '[hash].[ext]',
        },
      },
    });
    
    return config;
  },
  transpilePackages: ['three'],
};

module.exports = nextConfig;
