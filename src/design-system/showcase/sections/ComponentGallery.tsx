import {
  AppointmentCTA,
  Button,
  Cluster,
  Container,
  Eyebrow,
  Field,
  FieldHint,
  Heading,
  IndexedRow,
  Input,
  Label,
  OpeningHours,
  Section,
  Select,
  Stack,
  Text,
  Textarea,
} from '@/design-system'

export function ComponentGallery() {
  return (
    <>
      <Section spacing="default">
        <Container>
          <Stack gap="6">
            <Stack gap="3" className="max-w-2xl">
              <Eyebrow>04 — Leistungen (indexed)</Eyebrow>
              <Heading level={2}>Hairlines, not cards</Heading>
              <Text tone="muted">
                Indexed rows, restrained controls, and a single cyan CTA. Showcase only — not wired
                to CMS booking.
              </Text>
            </Stack>
            <div>
              <IndexedRow
                index="01"
                title="Prophylaxe"
                summary="Illustrative CMS teaser — replace with approved service copy."
                href="/design-system/components"
              />
              <IndexedRow
                index="02"
                title="Ästhetik"
                summary="Editorial rows replace soft service cards."
                href="/design-system/components"
              />
              <IndexedRow
                index="03"
                title="Implantate"
                summary="One job per row."
                href="/design-system/components"
              />
            </div>
          </Stack>
        </Container>
      </Section>

      <Section tone="snow" spacing="default" className="border-t border-[var(--color-border)]">
        <Container>
          <Stack gap="8">
            <Stack gap="3">
              <Eyebrow>Actions & forms</Eyebrow>
              <Heading level={2}>Primary signal · secondary ring · ghost</Heading>
            </Stack>
            <div id="cta">
              <AppointmentCTA
                href="/design-system/components#cta"
                supporting="Showcase CTA — demo only."
              />
            </div>
            <Cluster gap="3">
              <Button>Primary</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="ghost">Ghost</Button>
              <Button disabled>Disabled</Button>
            </Cluster>
            <div className="grid gap-8 md:grid-cols-2">
              <OpeningHours
                rows={[
                  { label: 'Montag – Freitag', value: '08:00 – 12:00 / 13:30 – 17:30' },
                  { label: 'Samstag', value: 'Nach Vereinbarung' },
                  { label: 'Sonntag', value: 'Geschlossen' },
                ]}
              />
              <div>
                <Text
                  size="sm"
                  className="mb-3 font-semibold tracking-[var(--tracking-nav)] uppercase"
                >
                  Forms (showcase only)
                </Text>
                <Text size="sm" tone="muted" className="mb-4">
                  Not wired to booking.
                </Text>
                <div className="grid gap-4">
                  <Field>
                    <Label htmlFor="ds-name">Name</Label>
                    <Input id="ds-name" name="name" placeholder="Ihr Name" />
                  </Field>
                  <Field>
                    <Label htmlFor="ds-loc">Standort</Label>
                    <Select id="ds-loc" name="location" defaultValue="appenzell">
                      <option value="appenzell">Appenzell</option>
                      <option value="gais">Gais</option>
                    </Select>
                    <FieldHint>CMS-driven in production.</FieldHint>
                  </Field>
                  <Field>
                    <Label htmlFor="ds-msg">Nachricht</Label>
                    <Textarea id="ds-msg" name="message" />
                  </Field>
                </div>
              </div>
            </div>
          </Stack>
        </Container>
      </Section>
    </>
  )
}
