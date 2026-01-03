module.exports = {
	env: {
		BACKEND_API_URL: 'http://localhost:3006',
	},
  reactStrictMode: true,
  swcMinify: true,
  experimental: {
    optimizePackageImports: ["@mantine/core", "@mantine/hooks"],
  },
};
