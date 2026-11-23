import { ContactInfo, SiteFooterBar, Text, TextLink } from '@/design-system'

export function ShowcaseFooter() {
  return (
    <SiteFooterBar
      brand="Zahnarztpraxis Palatty"
      columns={
        <>
          <ContactInfo
            title="Appenzell"
            address="CMS address"
            phone="+41 00 000 00 00"
            className="[&_p]:text-[var(--palatty-snow)] [&_a]:text-[var(--palatty-snow)]"
          />
          <ContactInfo
            title="Gais"
            address="CMS address"
            phone="+41 00 000 00 01"
            className="[&_p]:text-[var(--palatty-snow)] [&_a]:text-[var(--palatty-snow)]"
          />
          <div>
            <Text size="sm" className="mb-3 font-semibold tracking-[var(--tracking-nav)] uppercase">
              v2
            </Text>
            <Text size="sm" tone="inverse" className="opacity-80">
              No Alpine WebGL identity · photography leads · Phase 3 frozen
            </Text>
          </div>
        </>
      }
      meta={
        <>
          Rollback:{' '}
          <TextLink href="/design-system/brand" className="text-[var(--palatty-snow)]">
            archive notes
          </TextLink>
          {' · '}docs/visual-identity-v2/
        </>
      }
    />
  )
}
