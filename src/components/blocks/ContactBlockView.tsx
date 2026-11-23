import React from 'react'

import { LexicalRichText } from '@/components/cms/LexicalRichText'
import { BookingPlaceholder } from '@/components/site/BookingPlaceholder'
import {
  Container,
  Eyebrow,
  Field,
  Heading,
  Input,
  Label,
  Section,
  Stack,
  Text,
  Textarea,
  TextLink,
} from '@/design-system'
import type { ContactBlock, Location } from '@/payload-types'
import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'

type Props = {
  block: ContactBlock
  location: Location
}

/**
 * Contact section. Mailto handoff for messages.
 * Online booking is a placeholder until the practice confirms integration.
 */
export function ContactBlockView({ block, location }: Props) {
  const mailto = location.email
    ? `mailto:${location.email}?subject=${encodeURIComponent('Kontaktanfrage Website')}`
    : undefined

  return (
    <Section id="kontakt">
      <Container>
        <div className="grid gap-12 lg:grid-cols-2">
          <Stack gap="4" className="max-w-xl">
            <Eyebrow>Kontakt</Eyebrow>
            <Heading level={2}>{block.heading || 'Wir freuen uns auf Sie'}</Heading>
            {block.intro ? (
              <LexicalRichText data={block.intro as SerializedEditorState} />
            ) : (
              <Text tone="muted">
                Melden Sie sich telefonisch, per E-Mail oder über das Formular. Online-Buchung folgt
                nach Freigabe.
              </Text>
            )}
            <Stack gap="2" className="pt-2">
              {location.phone ? (
                <Text>
                  Telefon:{' '}
                  <TextLink href={`tel:${location.phone.replace(/\s+/g, '')}`}>
                    {location.phone}
                  </TextLink>
                </Text>
              ) : null}
              {location.email ? (
                <Text>
                  E-Mail: <TextLink href={`mailto:${location.email}`}>{location.email}</TextLink>
                </Text>
              ) : null}
            </Stack>
            {block.showBookingLink !== false ? (
              <div id="termin" className="pt-2">
                <BookingPlaceholder />
              </div>
            ) : null}
          </Stack>

          {block.showContactForm !== false ? (
            <form action={mailto} method="get" className="grid gap-5">
              <Field>
                <Label htmlFor="contact-name">Name</Label>
                <Input id="contact-name" name="name" required autoComplete="name" />
              </Field>
              <Field>
                <Label htmlFor="contact-email">E-Mail</Label>
                <Input
                  id="contact-email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                />
              </Field>
              <Field>
                <Label htmlFor="contact-message">Nachricht</Label>
                <Textarea id="contact-message" name="body" required />
              </Field>
              <button
                type="submit"
                className="inline-flex min-h-11 w-fit items-center justify-center rounded-[var(--radius-md)] bg-[var(--palatty-cyan-deep)] px-5 font-sans text-sm font-medium text-[var(--palatty-snow)] transition-colors hover:bg-[var(--palatty-cyan)]"
              >
                Nachricht senden
              </button>
              <Text size="xs" tone="subtle">
                Mit dem Absenden öffnet sich Ihr E-Mail-Programm
                {location.email ? ` an ${location.email}` : ''}.
              </Text>
            </form>
          ) : null}
        </div>
      </Container>
    </Section>
  )
}
