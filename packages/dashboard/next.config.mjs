/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    typedRoutes: false,
    cpus: 1,
  },
  webpack: (config) => {
    // `@metamask/sdk` declares `@react-native-async-storage/async-storage` as an
    // optional peer (React Native only). In a web build the require is unreachable,
    // but webpack still emits a "Module not found" warning that's slow + noisy.
    // Aliasing to `false` tells webpack to skip resolution entirely.
    config.resolve.alias = {
      ...(config.resolve.alias ?? {}),
      "@react-native-async-storage/async-storage": false,
      // WalletConnect / Coinbase Base Account pull Pino's optional pretty
      // printer into the dependency graph. It is a Node dev dependency, not
      // needed in the browser wallet flow, and some deploy builders fail when
      // webpack tries to resolve it.
      "pino-pretty": false,
      // Coinbase CDP / Base Account include optional x402 payment helpers.
      // The dashboard only uses Coinbase as a wallet connector, so these
      // payment-specific client packages should not be required for builds.
      "@x402/core/client": false,
      "@x402/svm/exact/client": false,
    };
    return config;
  },
};

export default nextConfig;
