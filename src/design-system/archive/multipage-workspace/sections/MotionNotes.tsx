import { Container, Eyebrow, Heading, Section, Stack, Text } from '@/design-system'

const ROWS = [
  ['Page enter', 'Optional short fade-up on hero type only.'],
  ['Hover', 'Colour on links/CTA; no lift-shadow carnival.'],
  ['Location switch', 'Instant navigation (full document) — no fake SPA morph.'],
  ['Reduced motion', 'Honour prefers-reduced-motion.'],
  ['3D / WebGL hero', 'Not part of Visual Identity v2 brand.'],
] as const

export function MotionNotes() {
  return (
    <Section spacing="default">
      <Container>
        <Stack gap="8" className="max-w-3xl">
          <Stack gap="3">
            <Eyebrow>Motion</Eyebrow>
            <Heading level={1}>Restrained motion · no Alpine 3D</Heading>
            <Text tone="muted">
              Future 3D art direction, if revisited, must model reception geometry or corridor glass —
              never mountain WebGL as brand identity. Contour SVG marks remain optional later, not
              homepage heroes.
            </Text>
          </Stack>
          <div className="border-t border-[var(--color-border-strong)]">
            {ROWS.map(([label, detail]) => (
              <div
                key={label}
                className="grid gap-2 border-b border-[var(--color-border)] py-4 sm:grid-cols-[minmax(0,12rem)_minmax(0,1fr)] sm:gap-6"
              >
                <Text size="sm" className="font-medium">
                  {label}
                </Text>
                <Text size="sm" tone="muted">
                  {detail}
                </Text>
              </div>
            ))}
          </div>
          <Text size="sm" tone="muted">
            Phase 3 marketing implementation is frozen. This page documents direction only.
          </Text>
        </Stack>
      </Container>
    </Section>
  )
}
