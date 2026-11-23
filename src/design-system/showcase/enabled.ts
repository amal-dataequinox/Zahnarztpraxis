/** Production gate for `/design-system` routes. */
export function isDesignSystemEnabled(): boolean {
  if (process.env.DESIGN_SYSTEM_ENABLED === 'true') return true
  if (process.env.DESIGN_SYSTEM_ENABLED === 'false') return false
  return process.env.NODE_ENV !== 'production'
}
