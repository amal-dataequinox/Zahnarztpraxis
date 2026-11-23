import path from 'path'
import { fileURLToPath } from 'url'

import type { CollectionConfig } from 'payload'

import { anyone, editorOrAbove } from '@/access'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

/**
 * Central media library for practice photography and short site videos
 * (e.g. welcoming hero loops). Images get responsive WebP renditions;
 * videos are stored as-is (no imageSizes).
 */
export const Media: CollectionConfig = {
  slug: 'media',
  labels: { singular: 'Medium', plural: 'Medien' },
  admin: {
    group: 'Inhalte',
    description:
      'Freigegebene Praxisbilder und kurze Website-Videos (MP4/WebM). Keine generierten Personen- oder Praxisfotos.',
  },
  access: {
    read: anyone,
    create: editorOrAbove,
    update: editorOrAbove,
    delete: editorOrAbove,
  },
  upload: {
    staticDir: path.resolve(dirname, '../../media'),
    mimeTypes: [
      'image/jpeg',
      'image/png',
      'image/webp',
      'image/avif',
      'image/svg+xml',
      'video/mp4',
      'video/webm',
      'video/quicktime',
    ],
    focalPoint: true,
    adminThumbnail: 'thumbnail',
    imageSizes: [
      {
        name: 'thumbnail',
        width: 480,
        formatOptions: { format: 'webp', options: { quality: 80 } },
      },
      {
        name: 'card',
        width: 1024,
        formatOptions: { format: 'webp', options: { quality: 82 } },
      },
      {
        name: 'hero',
        width: 1920,
        formatOptions: { format: 'webp', options: { quality: 82 } },
      },
    ],
  },
  fields: [
    {
      name: 'alt',
      label: 'Alternativtext',
      type: 'text',
      required: true,
      localized: true,
      admin: {
        description: 'Beschreibt den Bildinhalt für Screenreader und Suchmaschinen.',
      },
    },
    {
      name: 'description',
      label: 'Beschreibung',
      type: 'textarea',
      localized: true,
    },
  ],
}
