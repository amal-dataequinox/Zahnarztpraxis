import {
  Container,
  Eyebrow,
  Heading,
  LocationSwitcher,
  NavBar,
  Section,
  Stack,
  Text,
} from '@/design-system'

export function NavigationPatterns() {
  return (
    <Section spacing="default">
      <Container>
        <Stack gap="8">
          <Stack gap="3" className="max-w-2xl">
            <Eyebrow>06 — Location switcher</Eyebrow>
            <Heading level={2}>First-class place control</Heading>
            <Text tone="muted">
              Location switcher is a primary control, not a footer afterthought. Accent pips identify
              Appenzell and Gais without competing as brand fills.
            </Text>
          </Stack>

          <div className="border border-[var(--color-border-strong)]">
            <NavBar
              brand="Zahnarztpraxis Palatty"
              location="appenzell"
              items={[
                { label: 'Praxis', href: '/design-system/homepages' },
                { label: 'Leistungen', href: '/design-system/components' },
                { label: 'Team', href: '/design-system/photography' },
                { label: 'Kontakt', href: '/design-system/navigation' },
              ]}
              cta={{ label: 'Termin vereinbaren', href: '/design-system/components#cta' }}
            />
          </div>

          <Stack gap="4">
            <Text size="sm" className="font-medium tracking-[var(--tracking-wide)] uppercase">
              Location switcher states
            </Text>
            <LocationSwitcher current="appenzell" />
            <LocationSwitcher current="gais" />
          </Stack>
        </Stack>
      </Container>
    </Section>
  )
}
