import { APIError, type CollectionBeforeValidateHook, type CollectionConfig } from 'payload'

import { editorOrAbove, publishedOrEditor } from '@/access'
import {
  CallToAction,
  Contact,
  Hero,
  ImageGallery,
  ImageText,
  JobsOverview,
  LocationInformation,
  RichText,
  ServicesOverview,
  TeamOverview,
} from '@/blocks'
import { slugField } from '@/fields/slug'
import { cmsCollectionRevalidateHooks } from '@/utilities/cacheRevalidation'

const PAGE_REVALIDATE_HOOKS = cmsCollectionRevalidateHooks(['cms-pages'])

/**
 * The slug is not globally unique: both locations may have e.g. a "team" page.
 * Instead, uniqueness is enforced per scope — (slug + location) or
 * (slug + shared, i.e. no location).
 */
const validateUniqueSlugPerLocation: CollectionBeforeValidateHook = async ({
  data,
  originalDoc,
  req,
}) => {
  const slug = data?.slug ?? originalDoc?.slug
  if (!slug) return data

  const rawLocation = data?.location !== undefined ? data?.location : originalDoc?.location
  const locationId =
    rawLocation && typeof rawLocation === 'object' ? rawLocation.id : (rawLocation ?? null)

  const result = await req.payload.find({
    collection: 'pages',
    draft: true,
    limit: 1,
    overrideAccess: true,
    where: {
      and: [
        { slug: { equals: slug } },
        locationId ? { location: { equals: locationId } } : { location: { exists: false } },
        ...(originalDoc?.id ? [{ id: { not_equals: originalDoc.id } }] : []),
      ],
    },
  })

  if (result.totalDocs > 0) {
    throw new APIError(
      `Der Slug "${slug}" wird in diesem Geltungsbereich (Standort/gemeinsam) bereits verwendet.`,
      409,
    )
  }

  return data
}

/**
 * Dynamic pages built from layout blocks. Supports drafts and versions —
 * the public only ever sees published documents.
 */
export const Pages: CollectionConfig = {
  slug: 'pages',
  labels: { singular: 'Seite', plural: 'Seiten' },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'pageType', '_status'],
    group: 'Inhalte',
  },
  versions: {
    drafts: {
      autosave: { interval: 1000 },
    },
    maxPerDoc: 25,
  },
  access: {
    read: publishedOrEditor,
    readVersions: editorOrAbove,
    create: editorOrAbove,
    update: editorOrAbove,
    delete: editorOrAbove,
  },
  hooks: {
    beforeValidate: [validateUniqueSlugPerLocation],
    ...PAGE_REVALIDATE_HOOKS,
  },
  fields: [
    {
      name: 'title',
      label: 'Titel',
      type: 'text',
      required: true,
      localized: true,
    },
    slugField({ unique: false }),
    {
      name: 'location',
      label: 'Standort',
      type: 'relationship',
      relationTo: 'locations',
      index: true,
      admin: {
        position: 'sidebar',
        hidden: true,
      },
    },
    {
      name: 'pageType',
      label: 'Seitentyp',
      type: 'select',
      required: true,
      defaultValue: 'standard',
      options: [
        { label: 'Startseite', value: 'home' },
        { label: 'Standardseite', value: 'standard' },
        { label: 'Kontaktseite', value: 'contact' },
        { label: 'Rechtliches (Impressum/Datenschutz)', value: 'legal' },
      ],
      admin: { position: 'sidebar' },
    },
    {
      name: 'featuredImage',
      label: 'Beitragsbild',
      type: 'upload',
      relationTo: 'media',
      admin: { position: 'sidebar' },
    },
    {
      name: 'layout',
      label: 'Layout',
      type: 'blocks',
      blocks: [
        Hero,
        RichText,
        ImageText,
        JobsOverview,
        ImageGallery,
        ServicesOverview,
        TeamOverview,
        LocationInformation,
        Contact,
        CallToAction,
      ],
    },
    // SEO fields (`meta` group) are added by @payloadcms/plugin-seo.
  ],
}
