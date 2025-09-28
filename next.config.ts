import type { NextConfig } from "next"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseHostname = supabaseUrl ? new URL(supabaseUrl).hostname : undefined

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      ...(supabaseHostname
        ? [
            {
              protocol: "https" as const,
              hostname: supabaseHostname,
              pathname: "/storage/v1/object/public/**",
            },
          ]
        : []),
      {
        protocol: "https" as const,
        hostname: "cdn.jsdelivr.net",
        pathname: "/gh/devicons/devicon/icons/**",
      },
      {
        protocol: "https" as const,
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
      {
        protocol: "https" as const,
        hostname: "ui-avatars.com",
        pathname: "/api/**",
      },
    ],
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 300, // 5 minutes
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;"
  },
  experimental: {
    optimizePackageImports: ['@radix-ui/react-icons', 'lucide-react'],
  },
  turbopack: {
    root: __dirname,
    rules: {
      '*.svg': {
        loaders: ['@svgr/webpack'],
        as: '*.js',
      },
    },
  },
  // Optimize bundle
  compress: true,
  // Enable static optimization
  trailingSlash: false,
  // Performance optimizations
  poweredByHeader: false,
  generateEtags: true,
  // Database connection pool optimization
  serverRuntimeConfig: {
    db: {
      connectionLimit: 10,
      acquireTimeout: 60000,
      timeout: 60000
    }
  }
}

export default nextConfig
