const { i18n } = require('./next-i18next.config');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['images.unsplash.com'],
  },
  env: {
    NEXTAUTH_URL: 'http://localhost:3000',
  },
  i18n,
  swcMinify: true,
}

module.exports = nextConfig
