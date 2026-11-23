import type { LocationOption } from '@/design-system/components/LocationSwitcher'

const PRODUCTION_OPTIONS: LocationOption[] = [
  { id: 'appenzell', label: 'Appenzell', href: 'https://zahnarztpraxis-palatty.ch' },
  { id: 'gais', label: 'Gais', href: 'https://zahnarzt-palatty.ch' },
]

/**
 * Builds location-switcher hrefs for the current request host.
 * Local development uses `*.localhost`; production uses live domains.
 */
export function getLocationSwitcherOptions(rawHost?: string | null): LocationOption[] {
  const host = (rawHost || '').toLowerCase()
  const withoutPort = host.split(':')[0]
  const port = host.includes(':') ? host.split(':')[1] : '3000'
  const isLocal =
    withoutPort.endsWith('.localhost') ||
    withoutPort === 'localhost' ||
    withoutPort === '127.0.0.1'

  if (!isLocal) return PRODUCTION_OPTIONS

  return [
    { id: 'appenzell', label: 'Appenzell', href: `http://appenzell.localhost:${port}` },
    { id: 'gais', label: 'Gais', href: `http://gais.localhost:${port}` },
  ]
}

export function locationSlug(location: { slug: string }): 'appenzell' | 'gais' {
  return location.slug === 'gais' ? 'gais' : 'appenzell'
}
