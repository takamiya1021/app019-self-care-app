import type { NextConfig } from 'next'
import withPWA from 'next-pwa'

const isDev = process.env.NODE_ENV === 'development'

type RuntimeContext = {
  request: {
    destination?: string
  }
  url: URL
}

const runtimeCaching = [
  {
    urlPattern: ({ request }: RuntimeContext) => request.destination === 'audio',
    handler: 'CacheFirst',
    options: {
      cacheName: 'self-care-audio',
      expiration: {
        maxEntries: 40,
        maxAgeSeconds: 60 * 60 * 24 * 30
      }
    }
  },
  {
    urlPattern: ({ request }: RuntimeContext) => request.destination === 'image',
    handler: 'StaleWhileRevalidate',
    options: {
      cacheName: 'self-care-images',
      expiration: {
        maxEntries: 60,
        maxAgeSeconds: 60 * 60 * 24 * 30
      }
    }
  },
  {
    urlPattern: ({ url }: RuntimeContext) => url.pathname.startsWith('/_next/static/'),
    handler: 'CacheFirst',
    options: {
      cacheName: 'next-static-chunks',
      expiration: {
        maxEntries: 64,
        maxAgeSeconds: 60 * 60 * 24 * 30
      }
    }
  },
  {
    urlPattern: ({ url }: RuntimeContext) => url.pathname.startsWith('/'),
    handler: 'NetworkFirst',
    options: {
      cacheName: 'self-care-pages',
      networkTimeoutSeconds: 10
    }
  }
]

const nextConfig: NextConfig = {
  reactStrictMode: true,
  experimental: {
    optimizePackageImports: ['lucide-react']
  }
}

export default withPWA({
  dest: 'public',
  disable: isDev,
  register: true,
  skipWaiting: true,
  fallbacks: {
    document: '/offline'
  },
  runtimeCaching
})(nextConfig)
