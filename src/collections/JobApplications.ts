import type { CollectionConfig } from 'payload'

import { editorOrAbove } from '@/access'

/**
 * Candidate applications submitted via the public /jobs/[slug] drawer (/api/apply).
 * Protected so only authenticated practice editors can review candidate data and CVs.
 */
export const JobApplications: CollectionConfig = {
  slug: 'job-applications',
  labels: { singular: 'Bewerbung', plural: 'Bewerbungen' },
  admin: {
    useAsTitle: 'fullName',
    defaultColumns: ['fullName', 'job', 'email', 'status', 'createdAt'],
    group: 'Bewerbungen',
  },
  access: {
    read: editorOrAbove,
    create: () => false,
    update: editorOrAbove,
    delete: editorOrAbove,
  },
  fields: [
    {
      name: 'job',
      label: 'Stellenangebot',
      type: 'relationship',
      relationTo: 'jobs',
      required: true,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'status',
      label: 'Bewerbungsstatus',
      type: 'select',
      defaultValue: 'new',
      required: true,
      options: [
        { label: 'Neu', value: 'new' },
        { label: 'In Prüfung', value: 'reviewing' },
        { label: 'Vorstellungsgespräch', value: 'interviewing' },
        { label: 'Abgelehnt', value: 'rejected' },
        { label: 'Eingestellt', value: 'hired' },
      ],
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'fullName',
      label: 'Vollständiger Name',
      type: 'text',
      required: true,
    },
    {
      name: 'email',
      label: 'E-Mail',
      type: 'email',
      required: true,
    },
    {
      name: 'phone',
      label: 'Telefonnummer',
      type: 'text',
      required: true,
    },
    {
      name: 'address',
      label: 'Adresse',
      type: 'text',
      required: true,
    },
    {
      name: 'linkedin',
      label: 'LinkedIn / Profil-URL',
      type: 'text',
    },
    {
      name: 'hasPortfolio',
      label: 'Zertifikate / Portfolio vorhanden',
      type: 'checkbox',
      defaultValue: false,
    },
    {
      name: 'resume',
      label: 'Lebenslauf / Bewerbungsunterlagen',
      type: 'upload',
      relationTo: 'resumes',
      required: true,
    },
    {
      name: 'additionalComments',
      label: 'Nachricht / Bemerkungen',
      type: 'textarea',
    },
  ],
}
