/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['images.unsplash.com'],
  },
  env: {
    NEXTAUTH_URL: 'http://localhost:3000',
  },
  swcMinify: true,
}

module.exports = nextConfig
