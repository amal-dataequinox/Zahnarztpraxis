import { withPayload } from '@payloadcms/next/withPayload'
import type { NextConfig } from 'next'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(__filename)

const cdnHostname = (() => {
  try {
    return process.env.CDN_URL ? new URL(process.env.CDN_URL).hostname : null
  } catch {
    return null
  }
})()

const s3EndpointHostname = (() => {
  try {
    return process.env.S3_ENDPOINT ? new URL(process.env.S3_ENDPOINT).hostname : null
  } catch {
    return null
  }
})()

const remotePatterns: NonNullable<NextConfig['images']>['remotePatterns'] = [
  { protocol: 'https', hostname: 'zahnarztpraxis-palatty.ch' },
  { protocol: 'https', hostname: 'www.zahnarztpraxis-palatty.ch' },
  { protocol: 'https', hostname: 'zahnarzt-palatty.ch' },
  { protocol: 'https', hostname: 'www.zahnarzt-palatty.ch' },
  ...(cdnHostname ? [{ protocol: 'https' as const, hostname: cdnHostname }] : []),
  ...(s3EndpointHostname ? [{ protocol: 'https' as const, hostname: s3EndpointHostname }] : []),
  ...(process.env.S3_BUCKET && process.env.S3_REGION
    ? [
        {
          protocol: 'https' as const,
          hostname: `${process.env.S3_BUCKET}.s3.${process.env.S3_REGION}.amazonaws.com`,
        },
      ]
    : []),
]

const nextConfig: NextConfig = {
  allowedDevOrigins: ['[::1]'],
  transpilePackages: ['three', '@react-three/fiber', '@react-three/drei'],
  images: {
    localPatterns: [
      {
        pathname: '/api/media/file/**',
      },
      {
        pathname: '/design-system/photography/**',
      },
      {
        pathname: '/design-system/video/**',
      },
      {
        pathname: '/design-system/brand/**',
      },
    ],
    remotePatterns,
  },
  experimental: {
    cpus: 2,
    staticGenerationMaxConcurrency: 2,
    staticGenerationRetryCount: 1,
    serverActions: {
      bodySizeLimit: '100mb',
    },
  },
  webpack: (webpackConfig) => {
    webpackConfig.resolve.extensionAlias = {
      '.cjs': ['.cts', '.cjs'],
      '.js': ['.ts', '.tsx', '.js', '.jsx'],
      '.mjs': ['.mts', '.mjs'],
    }

    return webpackConfig
  },
  turbopack: {
    root: path.resolve(dirname),
  },
}

export default withPayload(nextConfig, { devBundleServerPackages: false })
