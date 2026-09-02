/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@viral-copilot/database", "@viral-copilot/agent-contracts"],
  reactStrictMode: true,
};

export default nextConfig;