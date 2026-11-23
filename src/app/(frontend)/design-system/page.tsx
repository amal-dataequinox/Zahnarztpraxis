import { designSystemMetadata } from '@/design-system/showcase/metadata'
import { OnePageShowcase } from '@/design-system/showcase/OnePageShowcase'

export const metadata = designSystemMetadata('Design System v2')

/**
 * Visual Identity v2 one-page showcase — Empfangscyan + Schriftbau + Zwei Firste.
 * Not a marketing page. Multipage workspace archived under
 * `src/design-system/archive/multipage-workspace/`.
 */
export default function DesignSystemPage() {
  return <OnePageShowcase />
}
