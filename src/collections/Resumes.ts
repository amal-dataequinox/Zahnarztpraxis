import type { CollectionConfig } from 'payload'

import { editorOrAbove } from '@/access'

/**
 * Private upload collection for candidate CVs/resumes submitted through /api/apply.
 * Stored under an isolated `palatty-resumes` S3 prefix in production and accessible
 * only to authenticated CMS editors inside Payload Admin.
 */
export const Resumes: CollectionConfig = {
  slug: 'resumes',
  labels: { singular: 'Lebenslauf', plural: 'Lebensläufe' },
  upload: {
    staticDir: 'resumes',
    mimeTypes: [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ],
  },
  access: {
    read: editorOrAbove,
    create: () => false,
    update: editorOrAbove,
    delete: editorOrAbove,
  },
  admin: {
    hidden: true,
  },
  fields: [
    {
      name: 'alt',
      label: 'Bezeichnung',
      type: 'text',
    },
  ],
}
