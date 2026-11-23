import type { GroupField } from 'payload'

type LinkFieldOptions = {
  name?: string
  label?: string
  /** Include a visible label field for the link. Defaults to true. */
  withLabel?: boolean
  interfaceName?: string
}

/**
 * Reusable link group used by navigation items and call-to-action blocks.
 * Supports internal page references (Payload relationship, no hardcoded URLs)
 * and external URLs.
 */
export const linkField = ({
  name = 'link',
  label = 'Link',
  withLabel = true,
  interfaceName,
}: LinkFieldOptions = {}): GroupField => ({
  name,
  label,
  type: 'group',
  interfaceName,
  fields: [
    ...(withLabel
      ? [
          {
            name: 'label',
            label: 'Beschriftung',
            type: 'text' as const,
            required: true,
          },
        ]
      : []),
    {
      name: 'type',
      label: 'Linktyp',
      type: 'radio',
      defaultValue: 'internal',
      options: [
        { label: 'Interne Seite', value: 'internal' },
        { label: 'Externe URL', value: 'external' },
      ],
      admin: { layout: 'horizontal' },
    },
    {
      name: 'page',
      label: 'Seite',
      type: 'relationship',
      relationTo: 'pages',
      admin: {
        condition: (_data, siblingData) => siblingData?.type === 'internal',
      },
    },
    {
      name: 'url',
      label: 'URL',
      type: 'text',
      validate: (value: string | null | undefined, { siblingData }: { siblingData?: unknown }) => {
        const data = siblingData as { type?: string } | undefined
        if (data?.type !== 'external') return true
        if (!value) return 'URL ist erforderlich.'
        if (!/^(https?:\/\/|\/)/.test(value)) {
          return 'URL muss mit http(s):// beginnen oder ein Pfad wie /kontakt sein.'
        }
        return true
      },
      admin: {
        condition: (_data, siblingData) => siblingData?.type === 'external',
        placeholder: 'https://… oder /kontakt',
        description: 'Externe https-URL oder interner Pfad (z. B. /leistungen).',
      },
    },
    {
      name: 'newTab',
      label: 'In neuem Tab öffnen',
      type: 'checkbox',
      defaultValue: false,
    },
  ],
})
