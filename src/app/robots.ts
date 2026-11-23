import type { MetadataRoute } from 'next'
import { headers } from 'next/headers'

import { resolveDomain, sanitizeHostname } from '@/utilities/resolveDomain'

/**
 * Per-domain robots.txt. Unknown hostnames are fully disallowed so staging or
 * misconfigured hosts never get indexed.
 */
export default async function robots(): Promise<MetadataRoute.Robots> {
  const headerList = await headers()
  const host = sanitizeHostname(headerList.get('host'))
  const slug = resolveDomain(host)

  if (!slug || !host) {
    return { rules: { userAgent: '*', disallow: '/' } }
  }

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/', '/api/', '/design-system'],
    },
    sitemap: `https://${host}/sitemap.xml`,
  }
}
