import Link from 'next/link'

import { Container, Eyebrow, Heading, Section, Stack, Text } from '@/design-system'
import { DESIGN_SYSTEM_NAV } from '../nav'

export function OverviewIndex() {
  return (
    <Section spacing="default">
      <Container>
        <Stack gap="8">
          <Stack gap="3" className="max-w-2xl">
            <Eyebrow>Workspace</Eyebrow>
            <Heading level={2}>Inspect the system by route</Heading>
            <Text tone="muted">
              Direct URLs and browser history work for every page. Production remains gated by{' '}
              <code>DESIGN_SYSTEM_ENABLED</code>.
            </Text>
          </Stack>
          <div className="grid gap-8 md:grid-cols-3">
            {DESIGN_SYSTEM_NAV.map((group) => (
              <div key={group.label} className="min-w-0">
                <Text
                  size="xs"
                  className="mb-3 font-medium uppercase tracking-[var(--tracking-wide)]"
                >
                  {group.label}
                </Text>
                <ul className="m-0 list-none border-t border-[var(--color-border-strong)] p-0">
                  {group.items.map((item) => (
                    <li key={item.href} className="border-b border-[var(--color-border)]">
                      <Link
                        href={item.href}
                        className="flex min-h-11 items-center font-sans text-[length:var(--text-base)] font-medium text-[var(--palatty-ink)] no-underline hover:underline"
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Stack>
      </Container>
    </Section>
  )
}
