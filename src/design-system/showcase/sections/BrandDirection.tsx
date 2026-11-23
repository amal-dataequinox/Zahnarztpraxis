import {
  Badge,
  Cluster,
  Container,
  Eyebrow,
  Heading,
  Lead,
  Section,
  Stack,
  Text,
} from '@/design-system'

type BrandDirectionProps = {
  /** Compact overview intro vs full brand page. */
  compact?: boolean
}

export function BrandDirection({ compact = false }: BrandDirectionProps) {
  return (
    <Section spacing={compact ? 'tight' : 'default'} className="border-b border-[var(--color-border)]">
      <Container>
        <Stack gap="4" className="w-full max-w-3xl">
          <Eyebrow>Visual Identity v2</Eyebrow>
          <Heading level={1}>Empfangscyan · Schriftbau · Zwei Firste</Heading>
          <Lead>
            Practice materials first. Editorial structure second. Two locations under one name. Cyan is
            a signal — not a theme.
          </Lead>
          <Cluster gap="2" className="w-full">
            <Badge tone="cyan">Cyan ~2–4%</Badge>
            <Badge tone="ink">IBM Plex Sans</Badge>
            <Badge tone="appenzell">Appenzell pip</Badge>
            <Badge tone="gais">Gais pip</Badge>
          </Cluster>
          {!compact ? (
            <>
              <Text tone="muted">
                Empfangscyan borrows the reception desk signal for a single filled CTA. Schriftbau
                treats type as architecture — hairlines, indexes, and weight roles. Zwei Firste keeps
                Appenzell and Gais mirrored, never duplicated.
              </Text>
              <Text size="sm" tone="muted">
                Alpine Modernism archived at <code>src/design-system/archive/</code>. Phase 3 not
                started.
              </Text>
            </>
          ) : (
            <Text size="sm" tone="muted">
              Alpine Modernism archived. Phase 3 not started. Use the sidebar to inspect each
              foundation and pattern.
            </Text>
          )}
        </Stack>
      </Container>
    </Section>
  )
}
