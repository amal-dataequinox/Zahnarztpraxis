import { Container, Eyebrow, Heading, Section, Stack, Text } from '@/design-system'

export function TypographySpecimens() {
  return (
    <Section spacing="default">
      <Container>
        <Stack gap="10">
          <Stack gap="4" className="max-w-3xl">
            <Eyebrow>02 — Typography</Eyebrow>
            <Heading level={2}>IBM Plex Sans — weight roles</Heading>
            <Text tone="muted">
              Regular 400 body · Medium 500 nav/labels · SemiBold 600 headings · Light 300 only for
              large editorial lines when specimens justify it · tabular nums for indexes/hours.
            </Text>
          </Stack>

          <div className="border border-[var(--color-border-strong)] bg-[var(--palatty-snow)] p-8 md:p-12">
            <Eyebrow>Critical specimens</Eyebrow>
            <Heading level={1} editorial className="mt-4">
              Natürlich. Persönlich. Präzise.
            </Heading>
            <Heading level={2} className="mt-8">
              Zahnärztliche Praxis Appenzell
            </Heading>
            <Text size="lg" tone="muted" className="mt-4 max-w-[var(--measure-lead)]">
              Body Regular 400 — Zahnmedizin, Behandlungen und Öffnungszeiten in klarer UI-Lesbarkeit.
            </Text>
          </div>

          <div className="grid gap-8 lg:grid-cols-2">
            <Stack gap="3" className="border border-[var(--color-border-strong)] p-6">
              <Text size="sm" className="font-medium tracking-[var(--tracking-wide)] uppercase">
                SemiBold 600 — headings
              </Text>
              {(
                [
                  'Zahnmedizin',
                  'Natürlich',
                  'Behandlungen',
                  'Öffnungszeiten',
                  'Zahnärztliche Praxis',
                ] as const
              ).map((word) => (
                <p
                  key={word}
                  className="m-0 border-b border-[var(--color-border)] py-3 font-sans text-[length:var(--text-2xl)] font-semibold tracking-[var(--tracking-tight)]"
                >
                  {word}
                </p>
              ))}
            </Stack>
            <Stack gap="3" className="border border-[var(--color-border-strong)] p-6">
              <Text size="sm" className="font-medium tracking-[var(--tracking-wide)] uppercase">
                Tabular numerals
              </Text>
              <p className="m-0 font-sans text-[length:var(--text-3xl)] font-medium tabular-nums tracking-[var(--tracking-tight)]">
                01  02  03  08:00–17:30
              </p>
              <Text size="sm" tone="muted">
                Indexed service rows and opening hours use <code>tabular-nums</code>.
              </Text>
              <Text size="sm" className="font-medium">
                Medium 500 — navigation / labels
              </Text>
              <Text size="base">
                Regular 400 — running body copy stays calm and clinical, not dashboard-bold.
              </Text>
            </Stack>
          </div>
        </Stack>
      </Container>
    </Section>
  )
}
