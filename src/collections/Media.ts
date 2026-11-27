import path from 'path'
import { fileURLToPath } from 'url'

import type { CollectionConfig } from 'payload'

import { anyone, editorOrAbove } from '@/access'
import { cmsCollectionRevalidateHooks } from '@/utilities/cacheRevalidation'

const MEDIA_REVALIDATE_HOOKS = cmsCollectionRevalidateHooks(['cms'])

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

/**
 * Central media library for practice photography, MP4/WebM videos, and HLS streams.
 */
export const Media: CollectionConfig = {
  slug: 'media',
  labels: { singular: 'Medium', plural: 'Medien' },
  admin: {
    group: 'Inhalte',
    useAsTitle: 'alt',
    defaultColumns: ['filename', 'alt', 'mediaType', 'updatedAt'],
    description:
      'Praxisbilder, Videos (MP4/WebM) sowie adaptive HLS-Streams (.m3u8) inkl. Vorschaubild.',
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
      'application/pdf',
      'application/zip',
      'application/x-zip-compressed',
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
  hooks: {
    beforeChange: [
      async ({ data, req }) => {
        if (data.mediaType === 'hls') {
          return data
        }
        if (req.file && req.file.data) {
          if (req.file.mimetype?.startsWith('video/')) {
            data.mediaType = 'video'
          } else if (req.file.mimetype?.startsWith('image/')) {
            data.mediaType = 'image'
          } else {
            data.mediaType = 'document'
          }
        }
        return data
      },
    ],
    ...MEDIA_REVALIDATE_HOOKS,
  },
  fields: [
    {
      name: 'alt',
      label: 'Alternativtext',
      type: 'text',
      required: true,
      localized: true,
      admin: {
        description: 'Beschreibt den Inhalt für Screenreader und Suchmaschinen.',
      },
    },
    {
      name: 'mediaType',
      label: 'Medientyp',
      type: 'select',
      defaultValue: 'image',
      options: [
        { label: 'Bild (Image)', value: 'image' },
        { label: 'Video (MP4/WebM)', value: 'video' },
        { label: 'HLS Stream (.m3u8)', value: 'hls' },
        { label: 'Dokument', value: 'document' },
      ],
      admin: {
        position: 'sidebar',
        description: 'Wird beim Hochladen automatisch erkannt — für HLS auf «HLS Stream» stellen.',
      },
    },
    {
      name: 'hlsUrl',
      label: 'HLS Playlist-URL (.m3u8)',
      type: 'text',
      admin: {
        condition: (data) => data?.mediaType === 'hls',
        description: 'Wird beim ZIP-Upload automatisch ausgefüllt oder kann direkt als .m3u8 URL eingegeben werden.',
      },
    },
    {
      name: 'hlsUploader',
      type: 'ui',
      admin: {
        condition: (data) => data?.mediaType === 'hls',
        components: {
          Field: '/components/admin/HlsUploader#HlsUploader',
        },
      },
    },
    {
      name: 'preview',
      type: 'ui',
      admin: {
        components: {
          Field: '/components/admin/MediaPreview#MediaPreview',
        },
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
