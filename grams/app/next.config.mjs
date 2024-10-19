/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    webpack: (config, { isServer }) => {
        if (!isServer) {
            config.resolve.fallback = {
                ...config.resolve.fallback,
                'crypto': require.resolve('crypto-browserify'),
                'stream': require.resolve('stream-browserify'),
            };
        }
        return config;
    },
};

module.exports = nextConfig;
