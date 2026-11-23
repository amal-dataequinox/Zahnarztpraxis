import path from 'path'
import { fileURLToPath } from 'url'

import { postgresAdapter } from '@payloadcms/db-postgres'
import { redirectsPlugin } from '@payloadcms/plugin-redirects'
import { seoPlugin } from '@payloadcms/plugin-seo'
import type { GenerateDescription, GenerateTitle } from '@payloadcms/plugin-seo/types'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
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
import { SiteSettings } from '@/globals/SiteSettings'
import { pluginRedirectsDe } from '@/i18n/pluginRedirects.de'
import type { Location, Page, Service } from '@/payload-types'
import { getKnownDomains } from '@/utilities/resolveDomain'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

const serverURL = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'

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
  globals: [SiteSettings],
  editor: lexicalEditor(),
  // German is the source language. Additional locales (e.g. 'en') can be
  // appended here later without schema rework — localized fields are already
  // flagged throughout the collections.
  localization: {
    locales: [{ code: 'de', label: 'Deutsch' }],
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
      connectionString: process.env.DATABASE_URL || '',
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
  ],
})
