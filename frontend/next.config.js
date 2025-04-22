/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['placehold.co'], // Allow images from placehold.co
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**', // Allow all HTTPS domains temporarily for development
        port: '',
        pathname: '**',
      },
    ],
  },
}

module.exports = nextConfig
