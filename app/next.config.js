/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  reactStrictMode: true,
  transpilePackages: [
    'expo',
    'expo-router',
    'react-native',
    'react-native-web',
    'expo-linking',
    'expo-constants'
  ],
  webpack: (config) => {
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      'react-native$': 'react-native-web'
    };
    return config;
  },

  async redirects() {
    return [
      {
        source: '/reset-password',
        destination: '/resetPassword',
        permanent: false,
      },
    ];
  },
};

module.exports = nextConfig;
