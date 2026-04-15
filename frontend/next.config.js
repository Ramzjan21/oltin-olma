/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false, // StrictMode useEffect'ni 2 marta chaqiradi — o'chirildi
  output: 'standalone',
  images: {
    domains: ['localhost'],
  },
}

module.exports = nextConfig
