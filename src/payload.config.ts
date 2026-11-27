import path from 'path'
import { fileURLToPath } from 'url'

import { postgresAdapter } from '@payloadcms/db-postgres'
import { redirectsPlugin } from '@payloadcms/plugin-redirects'
import { seoPlugin } from '@payloadcms/plugin-seo'
import type { GenerateDescription, GenerateTitle } from '@payloadcms/plugin-seo/types'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { s3Storage } from '@payloadcms/storage-s3'
import { de } from '@payloadcms/translations/languages/de'
import { en } from '@payloadcms/translations/languages/en'
import { buildConfig } from 'payload'
import sharp from 'sharp'

import { anyone, editorOrAbove } from '@/access'
import { Locations } from '@/collections/Locations'
import { Media } from '@/collections/Media'
import { Navigation } from '@/collections/Navigation'
import { Pages } from '@/collections/Pages'
import { Services } from '@/collections/Services'
import { TeamMembers } from '@/collections/TeamMembers'
import { Testimonials } from '@/collections/Testimonials'
import { Users } from '@/collections/Users'
import { getPresignedUrlHandler } from '@/endpoints/getPresignedUrl'
import { uploadHlsLocalHandler } from '@/endpoints/hlsUpload'
import { DesignSystem } from '@/globals/DesignSystem'
import { HomePage } from '@/globals/HomePage'
import { SiteSettings } from '@/globals/SiteSettings'
import { pluginRedirectsDe } from '@/i18n/pluginRedirects.de'
import type { Location, Page, Service } from '@/payload-types'
import { getKnownDomains } from '@/utilities/resolveDomain'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

const serverURL = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'
const rawDbUri = process.env.DATABASE_URL || process.env.POSTGRES_URL || ''

const getDbConfig = () => {
  try {
    const url = new URL(rawDbUri)
    const isLocal =
      url.hostname === 'localhost' ||
      url.hostname === '127.0.0.1' ||
      url.hostname === '0.0.0.0'

    const sslParams = [
      'sslmode',
      'ssl',
      'sslcert',
      'sslkey',
      'sslrootcert',
      'sslnegotiation',
      'uselibpqcompat',
    ]
    sslParams.forEach((param) => url.searchParams.delete(param))

    return {
      connectionString: url.toString(),
      ssl: isLocal ? false : ({ rejectUnauthorized: false } as const),
    }
  } catch {
    const isLocal = rawDbUri.includes('localhost') || rawDbUri.includes('127.0.0.1')
    return {
      connectionString: rawDbUri,
      ssl: isLocal ? false : ({ rejectUnauthorized: false } as const),
    }
  }
}

const dbConfig = getDbConfig()
const s3Bucket = process.env.S3_BUCKET?.trim() || ''
const s3Region = process.env.S3_REGION?.trim() || 'eu-central-2'
const s3CdnBaseUrl =
  process.env.CDN_URL?.trim().replace(/\/+$/, '') ||
  (s3Bucket ? `https://${s3Bucket}.s3.${s3Region}.amazonaws.com` : '')

/**
 * Allowed origins for CORS/CSRF: the configured server URL plus every known
 * domain (production domains via https, *.localhost development hosts via
 * http on port 3000).
 */
const allowedOrigins = [
  serverURL,
  ...getKnownDomains().flatMap((domain) =>
    domain.endsWith('.localhost')
      ? [`http://${domain}:3000`, `http://${domain}`]
      : [`https://${domain}`],
  ),
].filter((origin, index, all) => all.indexOf(origin) === index)

const generateTitle: GenerateTitle<Page | Service | Location> = ({ doc }) => {
  const docTitle =
    doc && 'title' in doc ? doc.title : doc && 'name' in doc ? doc.name : undefined
  return docTitle ? `${docTitle} | Zahnarztpraxis Palatty` : 'Zahnarztpraxis Palatty'
}

const generateDescription: GenerateDescription<Page | Service | Location> = ({ doc }) =>
  (doc && 'shortDescription' in doc && doc.shortDescription) || ''

export default buildConfig({
  serverURL,
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
    meta: {
      titleSuffix: '- Palatty CMS',
    },
  },
  collections: [Users, Locations, Pages, Services, TeamMembers, Media, Testimonials, Navigation],
  globals: [SiteSettings, DesignSystem, HomePage],
  endpoints: [
    {
      path: '/hls-upload',
      method: 'post',
      handler: uploadHlsLocalHandler,
    },
    {
      path: '/get-presigned-url',
      method: 'post',
      handler: getPresignedUrlHandler,
    },
  ],
  editor: lexicalEditor(),
  // German is the source language. Additional locales (e.g. 'en') can be
  // appended here later without schema rework — localized fields are already
  // flagged throughout the collections.
  localization: {
    locales: [
      { code: 'de', label: 'Deutsch' },
      { code: 'en', label: 'English' },
    ],
    defaultLocale: 'de',
    fallback: true,
  },
  i18n: {
    supportedLanguages: { de, en },
    fallbackLanguage: 'de',
    translations: {
      // Merged with plugin translations by redirectsPlugin (plugin base → ours).
      de: {
        ...pluginRedirectsDe,
      },
    },
  },
  cors: allowedOrigins,
  csrf: allowedOrigins,
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      max: process.env.VERCEL ? 5 : 10,
      connectionTimeoutMillis: 10000,
      idleTimeoutMillis: 10000,
      allowExitOnIdle: true,
      connectionString: dbConfig.connectionString,
      ...(dbConfig.ssl ? { ssl: dbConfig.ssl } : {}),
    },
    // Schema changes are applied exclusively through migrations — never via
    // dev-mode schema push. See docs/DATABASE.md.
    push: false,
    migrationDir: path.resolve(dirname, 'migrations'),
  }),
  sharp,
  plugins: [
    seoPlugin({
      collections: ['pages', 'services', 'locations'],
      uploadsCollection: 'media',
      tabbedUI: true,
      generateTitle,
      generateDescription,
    }),
    redirectsPlugin({
      collections: ['pages'],
      overrides: {
        admin: { group: 'Verwaltung' },
        access: {
          read: anyone,
          create: editorOrAbove,
          update: editorOrAbove,
          delete: editorOrAbove,
        },
      },
    }),
    s3Storage({
      enabled: Boolean(s3Bucket),
      alwaysInsertFields: true,
      clientUploads: true,
      collections: {
        media: {
          prefix: 'media',
          generateFileURL: ({ filename: file, prefix }) => {
            if (!s3CdnBaseUrl) return `/api/media/file/${file}`
            return `${s3CdnBaseUrl}/${prefix ? `${prefix}/` : ''}${file}`
          },
        },
      },
      bucket: s3Bucket,
      config: {
        credentials: {
          accessKeyId: process.env.S3_ACCESS_KEY_ID || '',
          secretAccessKey: process.env.S3_SECRET_ACCESS_KEY || '',
        },
        region: s3Region,
        ...(process.env.S3_ENDPOINT ? { endpoint: process.env.S3_ENDPOINT } : {}),
      },
    }),
  ],
})
