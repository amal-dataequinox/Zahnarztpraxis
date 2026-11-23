/**
 * Central domain -> location resolution. This is the ONLY place in the
 * application where hostnames are mapped to locations. The frontend consumes
 * the resolved location context instead of checking hostnames itself.
 *
 * The mapping is configured via the DOMAIN_LOCATION_MAP environment variable
 * as a comma-separated list of `hostname:location-slug` pairs. This covers
 * production domains, www variants and local development hostnames
 * (`appenzell.localhost`, `gais.localhost` — browsers resolve *.localhost to
 * 127.0.0.1 without /etc/hosts changes).
 */

const FALLBACK_MAP: Record<string, string> = {
  'zahnarztpraxis-palatty.ch': 'appenzell',
  'www.zahnarztpraxis-palatty.ch': 'appenzell',
  'zahnarzt-palatty.ch': 'gais',
  'www.zahnarzt-palatty.ch': 'gais',
  'appenzell.localhost': 'appenzell',
  'gais.localhost': 'gais',
}

const HOSTNAME_PATTERN = /^[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/

/** Parses DOMAIN_LOCATION_MAP ("host:slug,host:slug"). */
export const getDomainLocationMap = (): Record<string, string> => {
  const raw = process.env.DOMAIN_LOCATION_MAP
  if (!raw) return FALLBACK_MAP

  const map: Record<string, string> = {}
  for (const pair of raw.split(',')) {
    const [host, slug] = pair.split(':').map((part) => part?.trim().toLowerCase())
    if (host && slug && HOSTNAME_PATTERN.test(host)) {
      map[host] = slug
    }
  }
  return Object.keys(map).length > 0 ? map : FALLBACK_MAP
}

/** All hostnames known to the application (e.g. for CORS/CSRF allowlists). */
export const getKnownDomains = (): string[] => Object.keys(getDomainLocationMap())

/** All location slugs referenced by the domain map. */
export const getKnownLocationSlugs = (): string[] => [
  ...new Set(Object.values(getDomainLocationMap())),
]

/**
 * Normalises and validates a raw Host header value. Returns null for anything
 * that does not look like a plain hostname — client-supplied hostnames are
 * never trusted beyond this allowlist-based resolution.
 */
export const sanitizeHostname = (rawHost: string | null | undefined): string | null => {
  if (!rawHost) return null
  const trimmed = rawHost.trim().toLowerCase()
  // Reject anything that looks like a URL (scheme present) — Host headers never
  // include a scheme, so this is a strong signal of untrusted input.
  if (trimmed.includes('://') || trimmed.includes('/') || trimmed.includes(' ')) return null

  const withoutPort = trimmed.split(':')[0]
  if (withoutPort.length === 0 || withoutPort.length > 253) return null
  if (withoutPort === 'localhost' || withoutPort === '127.0.0.1') return withoutPort
  if (!HOSTNAME_PATTERN.test(withoutPort)) return null
  return withoutPort
}

/**
 * Resolves a request hostname to a location slug.
 *
 * Resolution order:
 * 1. Exact match in the configured domain map (includes www variants and
 *    *.localhost development hostnames).
 * 2. `<known-slug>.localhost` convention for local development.
 * 3. Bare `localhost` / `127.0.0.1` falls back to DEFAULT_LOCATION_SLUG
 *    (development convenience; leave empty in production).
 *
 * Unknown hostnames resolve to null — the caller decides how to handle that
 * (404 in production).
 */
export const resolveDomain = (rawHost: string | null | undefined): string | null => {
  const hostname = sanitizeHostname(rawHost)
  if (!hostname) return null

  const map = getDomainLocationMap()

  if (map[hostname]) return map[hostname]

  if (hostname.endsWith('.localhost')) {
    const candidate = hostname.slice(0, -'.localhost'.length)
    if (getKnownLocationSlugs().includes(candidate)) return candidate
  }

  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    const fallback = process.env.DEFAULT_LOCATION_SLUG?.trim().toLowerCase()
    return fallback && fallback.length > 0 ? fallback : null
  }

  return null
}
