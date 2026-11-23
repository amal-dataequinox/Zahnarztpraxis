import {
  AppointmentCTA,
  Container,
  Eyebrow,
  Heading,
  Section,
  Stack,
  Text,
} from '@/design-system'

const SWATCHES = [
  ['Paper', '#F7F5F1', 'var(--palatty-paper)'],
  ['Ink', '#141414', 'var(--palatty-ink)'],
  ['Wood', '#3B2F28', 'var(--palatty-wood)'],
  ['Navy', '#0C1824', 'var(--palatty-navy)'],
  ['Cyan CTA', '#147A86', 'var(--palatty-cyan-deep)'],
] as const

export function ColourSystem() {
  return (
    <Section tone="snow" spacing="default">
      <Container>
        <Stack gap="8">
          <Stack gap="3" className="w-full max-w-2xl">
            <Eyebrow>01 — Colour</Eyebrow>
            <Heading level={2}>Paper · ink · wood · navy · cyan signal</Heading>
            <Text tone="muted">
              One filled primary CTA per composition. No cyan section fills. White-on-cyan CTA meets
              WCAG AA (≥5:1 at `#147A86`).
            </Text>
          </Stack>
          <div className="grid min-w-0 grid-cols-1 gap-0 border border-[var(--color-border-strong)] sm:grid-cols-2 lg:grid-cols-5">
            {SWATCHES.map(([name, hex, swatch]) => (
              <div
                key={name}
                className="min-w-0 border-b border-[var(--color-border)] sm:border-r sm:border-b-0 last:border-b-0 lg:last:border-r-0"
              >
                <div className="h-28" style={{ background: swatch }} />
                <div className="border-t border-[var(--color-border)] p-3">
                  <Text size="sm" className="font-medium">
                    {name}
                  </Text>
                  <Text size="xs" tone="subtle" as="p" className="tabular-nums">
                    {hex}
                  </Text>
                </div>
              </div>
            ))}
          </div>
          <div id="cta">
            <AppointmentCTA
              href="/design-system/components#cta"
              supporting="Showcase CTA — cyan budget guardrail. Not wired to booking."
            />
          </div>
        </Stack>
      </Container>
    </Section>
  )
}
