import type { Page } from '@/payload-types'

type LinkLike = {
  type?: ('internal' | 'external') | null
  page?: (number | null) | Page
  url?: string | null
  label?: string | null
  newTab?: boolean | null
}

export type ResolvedLink = {
  href: string
  label: string
  newTab: boolean
} | null

export const resolveCMSLink = (link: LinkLike | null | undefined): ResolvedLink => {
  if (!link) return null

  const label = link.label?.trim() || ''
  const newTab = Boolean(link.newTab)

  if (link.type === 'external' && link.url) {
    const absolute = /^https?:\/\//.test(link.url)
    return {
      href: link.url,
      label: label || link.url,
      newTab: newTab || absolute,
    }
  }

  if (link.type === 'internal' && link.page && typeof link.page === 'object') {
    const slug = link.page.slug
    const href = slug === 'home' || link.page.pageType === 'home' ? '/' : `/${slug}`
    return { href, label: label || link.page.title, newTab }
  }

  return null
}
