export type DesignSystemNavItem = {
  href: string
  label: string
  /** Exact match only (overview). */
  exact?: boolean
}

export type DesignSystemNavGroup = {
  label: string
  items: DesignSystemNavItem[]
}

export const DESIGN_SYSTEM_NAV: DesignSystemNavGroup[] = [
  {
    label: 'Foundations',
    items: [
      { href: '/design-system', label: 'Overview', exact: true },
      { href: '/design-system/brand', label: 'Brand' },
      { href: '/design-system/colour', label: 'Colour' },
      { href: '/design-system/typography', label: 'Typography' },
      { href: '/design-system/motion', label: 'Motion' },
    ],
  },
  {
    label: 'Patterns',
    items: [
      { href: '/design-system/components', label: 'Components' },
      { href: '/design-system/navigation', label: 'Navigation' },
      { href: '/design-system/photography', label: 'Photography' },
      { href: '/design-system/homepages', label: 'Homepages' },
    ],
  },
  {
    label: 'Locations',
    items: [
      { href: '/design-system/locations/appenzell', label: 'Appenzell' },
      { href: '/design-system/locations/gais', label: 'Gais' },
    ],
  },
]

export function isNavItemActive(pathname: string, item: DesignSystemNavItem): boolean {
  if (item.exact) return pathname === item.href
  return pathname === item.href || pathname.startsWith(`${item.href}/`)
}
