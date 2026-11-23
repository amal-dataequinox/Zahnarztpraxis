import React from 'react'

import { Container, Heading, Section, Stack, Text, TextLink } from '@/design-system'

export default function NotFound() {
  return (
    <main id="main" className="alpine-grain min-h-[50vh]">
      <Section spacing="default">
        <Container size="sm">
          <Stack gap="4">
            <Heading level={1}>Seite nicht gefunden</Heading>
            <Text tone="muted">
              Die angeforderte Seite existiert nicht, oder die Domain konnte keinem aktiven Standort
              zugeordnet werden.
            </Text>
            <TextLink href="/">Zur Startseite</TextLink>
          </Stack>
        </Container>
      </Section>
    </main>
  )
}
