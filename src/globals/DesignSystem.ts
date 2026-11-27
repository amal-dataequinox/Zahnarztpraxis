import type { GlobalConfig, Field } from 'payload'

import { anyone, editorOrAbove } from '@/access'
import { cmsGlobalRevalidateHooks } from '@/utilities/cacheRevalidation'

const DESIGN_SYSTEM_REVALIDATE_HOOKS = cmsGlobalRevalidateHooks(['cms-design-system'])

export const THEME_PRESETS = {
  appenzell: {
    label: 'Smaragdgrün — Standard (#00a887)',
    accent: '#00a887',
    accentText: '#FFFFFF',
    ink: '#0e2a2f',
    paper: '#f7faf9',
    surface: '#ffffff',
  },
  'dental-blue': {
    label: 'Dental-Blau (#3a81c4)',
    accent: '#3a81c4',
    accentText: '#FFFFFF',
    ink: '#0F172A',
    paper: '#f6f9fc',
    surface: '#ffffff',
  },
  'medical-blue': {
    label: 'Schweizer Blau (#1D70B8)',
    accent: '#1D70B8',
    accentText: '#FFFFFF',
    ink: '#0F172A',
    paper: '#f6f9fc',
    surface: '#ffffff',
  },
  'alpine-emerald': {
    label: 'Alpines Tiefgrün (#0F766E)',
    accent: '#0F766E',
    accentText: '#FFFFFF',
    ink: '#0e2a2f',
    paper: '#f5faf9',
    surface: '#ffffff',
  },
} as const

export type ThemePresetKey = keyof typeof THEME_PRESETS | 'custom'

const color = (name: string, label: string, defaultValue: string): Field => ({
  name,
  label,
  type: 'text',
  required: true,
  defaultValue,
  validate: (value: unknown) =>
    (typeof value === 'string' && /^#[0-9a-f]{6}$/i.test(value)) ||
    'Bitte einen 6-stelligen Hex-Farbcode angeben, z. B. #00a887 oder #3a81c4',
})

export const DesignSystem: GlobalConfig = {
  slug: 'design-system',
  label: 'Design-System & Farbschema',
  admin: { group: 'Verwaltung' },
  access: {
    read: anyone,
    update: editorOrAbove,
  },
  hooks: {
    beforeChange: [
      async ({ data, originalDoc }) => {
        if (
          data.themePreset &&
          data.themePreset !== 'custom' &&
          data.themePreset in THEME_PRESETS
        ) {
          const preset = THEME_PRESETS[data.themePreset as keyof typeof THEME_PRESETS]
          if (data.themePreset !== originalDoc?.themePreset) {
            data.accent = preset.accent
            data.accentText = preset.accentText
            data.ink = preset.ink
            data.paper = preset.paper
            data.surface = preset.surface
          } else if (data.accent && data.accent.toLowerCase() !== preset.accent.toLowerCase()) {
            data.themePreset = 'custom'
          }
        }
        return data
      },
    ],
    ...DESIGN_SYSTEM_REVALIDATE_HOOKS,
  },
  fields: [
    {
      name: 'accent',
      label: 'Primärfarbe / Haupt-Akzentfarbe (Buttons, Links, Hero-Highlights, Badges)',
      type: 'text',
      required: true,
      defaultValue: '#00a887',
      admin: {
        description:
          'Geben Sie einen beliebigen 6-stelligen Hex-Farbcode ein (z. B. #00a887, #3a81c4, #1D70B8, #E11D48). Steuert alle Primär-Akzente auf der gesamten Website.',
      },
      validate: (value: unknown) =>
        (typeof value === 'string' && /^#[0-9a-f]{6}$/i.test(value)) ||
        'Bitte einen gültigen 6-stelligen Hex-Farbcode angeben, z. B. #00a887',
    },
    {
      name: 'themePreset',
      label: 'Farbthema-Vorlage laden (Optional)',
      type: 'select',
      defaultValue: 'appenzell',
      required: true,
      options: [
        { label: 'Smaragdgrün — Standard (#00a887)', value: 'appenzell' },
        { label: 'Dental-Blau (#3a81c4)', value: 'dental-blue' },
        { label: 'Schweizer Blau (#1D70B8)', value: 'medical-blue' },
        { label: 'Alpines Tiefgrün (#0F766E)', value: 'alpine-emerald' },
        { label: 'Individuelle Farbanpassung (Custom)', value: 'custom' },
      ],
      admin: {
        description: 'Wählen Sie eine Vorlage oder passen Sie die Farben darunter direkt frei an.',
      },
    },
    {
      type: 'collapsible',
      label: 'Weitere Farben (Hintergrund, Text & Kontrast)',
      admin: {
        description: 'Alle Grundfarben der Website können hier frei angepasst werden.',
      },
      fields: [
        {
          type: 'row',
          fields: [
            color('accentText', 'Textfarbe auf Primärfarbe', '#FFFFFF'),
            color('ink', 'Schriftfarbe (Haupttext)', '#0e2a2f'),
          ],
        },
        {
          type: 'row',
          fields: [
            color('paper', 'Seiten-Hintergrund (Paper)', '#f7faf9'),
            color('surface', 'Karten- & Abschnitts-Hintergrund (Surface)', '#ffffff'),
          ],
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'headingFont',
          label: 'Schriftart Überschriften',
          type: 'select',
          defaultValue: 'ibm-plex',
          options: [
            { label: 'IBM Plex Sans (Standard)', value: 'ibm-plex' },
            { label: 'General Sans', value: 'general' },
            { label: 'Switzer', value: 'switzer' },
            { label: 'System Sans', value: 'system' },
          ],
          admin: { width: '50%' },
        },
        {
          name: 'bodyFont',
          label: 'Schriftart Fließtext',
          type: 'select',
          defaultValue: 'ibm-plex',
          options: [
            { label: 'IBM Plex Sans (Standard)', value: 'ibm-plex' },
            { label: 'Switzer', value: 'switzer' },
            { label: 'General Sans', value: 'general' },
            { label: 'System Sans', value: 'system' },
          ],
          admin: { width: '50%' },
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'cardRadius',
          label: 'Eckenradius Buttons & Karten (px)',
          type: 'number',
          defaultValue: 16,
          min: 0,
          max: 48,
          admin: { width: '25%' },
        },
        {
          name: 'sectionSpacing',
          label: 'Sektions-Abstand (px)',
          type: 'number',
          defaultValue: 96,
          min: 48,
          max: 180,
          admin: { width: '25%' },
        },
        {
          name: 'contentWidth',
          label: 'Max. Inhaltsbreite (px)',
          type: 'number',
          defaultValue: 1152,
          min: 960,
          max: 1800,
          admin: { width: '25%' },
        },
        {
          name: 'headerWidth',
          label: 'Max. Header-Breite (px)',
          type: 'number',
          defaultValue: 1440,
          min: 960,
          max: 1920,
          admin: {
            width: '25%',
            description: 'Länge der schwebenden Navigationsleiste (Standard: 1440px).',
          },
        },
      ],
    },
    {
      name: 'motionEnabled',
      label: 'Animationen aktiviert',
      type: 'checkbox',
      defaultValue: true,
    },
    {
      name: 'siteName',
      label: 'Website-Name',
      type: 'text',
      defaultValue: 'Zahnarztpraxis Palatty',
    },
    {
      name: 'siteUrl',
      label: 'Website-URL',
      type: 'text',
      defaultValue: 'https://zahnarztpraxis-palatty.ch',
    },
    {
      name: 'organizationName',
      label: 'Unternehmensname',
      type: 'text',
      defaultValue: 'Zahnarztpraxis Palatty AG',
    },
  ],
}
