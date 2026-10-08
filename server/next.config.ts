import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
    // Node-Server: die Layer-API mischt Tiles und darf API-Keys nicht ausliefern.
    allowedDevOrigins: ['127.0.0.1'],
    images: {
        unoptimized: true,
    },
    agentRules: false,
};

export default nextConfig;
