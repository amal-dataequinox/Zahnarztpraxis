import React from 'react'

import { LexicalRichText } from '@/components/cms/LexicalRichText'
import { Reveal } from '@/components/motion/Reveal'
import { BookingPlaceholder } from '@/components/site/BookingPlaceholder'
import {
  Container,
  Field,
  Input,
  Label,
  Stack,
  Text,
  Textarea,
} from '@/design-system'
import type { ContactBlock, Location } from '@/payload-types'
import { getSiteSettings } from '@/utilities/cmsQueries'
import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'

type Props = {
  block: ContactBlock
  location: Location
}

export async function ContactBlockView({ block, location }: Props) {
  const settings = await getSiteSettings().catch(() => null)
  const hinEmail = (location as { hinEmail?: string | null }).hinEmail
  const mailto = location.email
    ? `mailto:${location.email}?subject=${encodeURIComponent('Kontaktanfrage Website')}`
    : undefined

  return (
    <section id="kontakt" className="py-[var(--section-y)] bg-[#f7faf9] border-b border-black/[0.06]">
      <Container>
        <div className="contact-hub-grid">
          <Reveal className="flex flex-col justify-center">
            <Stack gap="5" className="max-w-xl">
              <span className="palatty-pill-eyebrow">
                <span className="palatty-pill-dot" aria-hidden="true" />
                {(settings as { contactSectionEyebrow?: string | null })?.contactSectionEyebrow ||
                  'Kontakt'}
              </span>
              <h2 className="palatty-display-h2">{block.heading || 'Wir freuen uns auf Sie'}</h2>
            {block.intro ? (
              <LexicalRichText data={block.intro as SerializedEditorState} />
            ) : (
              <p className="m-0 font-sans text-[1rem] leading-relaxed text-[#4f6468]">
                Melden Sie sich telefonisch, per E-Mail oder direkt über unser Kontaktformular. Wir
                beantworten Ihre Anfrage rasch und unkompliziert.
              </p>
            )}

            <div className="flex flex-wrap gap-3 pt-1">
              {location.phone ? (
                <a
                  href={`tel:${location.phone.replace(/\s+/g, '')}`}
                  className="contact-pill-action"
                >
                  <span
                    className="h-2 w-2 rounded-full"
                    style={{ backgroundColor: 'var(--color-accent)' }}
                    aria-hidden="true"
                  />
                  <span>{location.phone}</span>
                </a>
              ) : null}
              {location.email ? (
                <a href={`mailto:${location.email}`} className="contact-pill-action">
                  <span>{location.email}</span>
                </a>
              ) : null}
              {hinEmail ? (
                <a href={`mailto:${hinEmail}`} className="contact-pill-action">
                  <span>HIN: {hinEmail}</span>
                </a>
              ) : null}
            </div>

            {block.showBookingLink !== false ? (
              <div id="termin" className="pt-2">
                <BookingPlaceholder
                  location={location}
                  label={settings?.bookingCtaLabel || undefined}
                />
              </div>
            ) : null}
          </Stack>
          </Reveal>

          {block.showContactForm !== false ? (
            <form action={mailto} method="get" className="form-card-elevated grid gap-5">
              <Field>
                <Label htmlFor="contact-name">
                  {(settings as { contactNameLabel?: string | null })?.contactNameLabel || 'Name'}
                </Label>
                <Input
                  id="contact-name"
                  name="name"
                  required
                  autoComplete="name"
                  className="rounded-xl border-black/10 bg-[#f8fbfa]"
                />
              </Field>
              <Field>
                <Label htmlFor="contact-email">
                  {(settings as { contactEmailLabel?: string | null })?.contactEmailLabel ||
                    'E-Mail'}
                </Label>
                <Input
                  id="contact-email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  className="rounded-xl border-black/10 bg-[#f8fbfa]"
                />
              </Field>
              <Field>
                <Label htmlFor="contact-message">
                  {(settings as { contactMessageLabel?: string | null })?.contactMessageLabel ||
                    'Nachricht'}
                </Label>
                <Textarea
                  id="contact-message"
                  name="body"
                  required
                  className="rounded-xl border-black/10 bg-[#f8fbfa]"
                />
              </Field>
              <button
                type="submit"
                className="praxis-cta-btn w-full justify-center border-0 cursor-pointer"
              >
                <span>{settings?.contactFormButtonLabel || 'Nachricht senden'}</span>
                <span aria-hidden="true">→</span>
              </button>
              <Text size="xs" tone="subtle" className="text-center">
                {(settings as { contactFormNote?: string | null })?.contactFormNote ||
                  'Mit dem Absenden öffnet sich Ihr E-Mail-Programm'}
                {location.email ? ` an ${location.email}` : ''}.
              </Text>
            </form>
          ) : null}
        </div>
      </Container>
    </section>
  )
}
