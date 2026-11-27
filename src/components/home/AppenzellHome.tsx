import Image from 'next/image'
import Link from 'next/link'
import React, { Fragment } from 'react'

import { AppenzellMotionRoot } from '@/components/home/AppenzellMotionRoot'
import { CarePillarsSection, type CareCardItem } from '@/components/home/CarePillarsSection'
import {
  PracticeGalleryBand,
  type PracticeGalleryItem,
} from '@/components/home/PracticeGalleryBand'
import { PraxisShowcaseSection } from '@/components/home/PraxisShowcaseSection'
import { TreatmentExplorer } from '@/components/home/TreatmentExplorer'
import { WelcomeVideoHero } from '@/components/home/WelcomeVideoHero'
import '@/components/home/appenzell-motion.css'
import { HeroEntrance } from '@/components/motion/HeroEntrance'
import { Reveal } from '@/components/motion/Reveal'
import { BookingPlaceholder } from '@/components/site/BookingPlaceholder'
import { OpeningHoursList } from '@/components/site/OpeningHoursList'
import { ButtonLink, Container, Section, Stack, Text } from '@/design-system'
import type { LocationOption } from '@/design-system/components/LocationSwitcher'
import type { Location } from '@/payload-types'
import {
  getDesignSystem,
  getHomePageGlobal,
  getServicesForLocation,
  getSiteSettings,
  getTeamForLocation,
} from '@/utilities/cmsQueries'
import { isMedia, isVideoMedia, resolveHeroVideo, toSiteImageSrc } from '@/utilities/media'
import { PRACTICE_VIDEOS } from '@/utilities/practicePhotos'

type AppenzellHomeProps = {
  location: Location
  locationOptions: LocationOption[]
}

/**
 * Dedicated Appenzell dental clinic homepage — 100% CMS-customizable.
 */
export async function AppenzellHome({ location }: AppenzellHomeProps) {
  const [services, team, designSystem, homeContent, settings] = await Promise.all([
    getServicesForLocation(location.id),
    getTeamForLocation(location.id),
    getDesignSystem().catch(() => null),
    getHomePageGlobal(),
    getSiteSettings().catch(() => null),
  ])

  const fallbackVideo = resolveHeroVideo(location, {
    src: PRACTICE_VIDEOS.appenzell.welcoming,
    poster: PRACTICE_VIDEOS.appenzell.welcomingPoster,
    alt: 'Zahnarztpraxis Palatty Appenzell — Willkommen.',
    mimeType: 'video/mp4',
  })

  const heroMediaDoc = isMedia(homeContent?.heroMedia)
    ? (homeContent!.heroMedia as {
        url?: string | null
        alt?: string | null
        mimeType?: string | null
        mediaType?: string | null
        hlsUrl?: string | null
        sizes?: { hero?: { url?: string | null } }
      })
    : isVideoMedia(homeContent?.heroVideo)
      ? (homeContent!.heroVideo as {
          url?: string | null
          alt?: string | null
          mimeType?: string | null
          mediaType?: string | null
          hlsUrl?: string | null
          sizes?: { hero?: { url?: string | null } }
        })
      : null

  const customPoster = isMedia(homeContent?.heroVideoPoster) ? homeContent!.heroVideoPoster : null
  const heroBackgroundType = (homeContent?.heroBackgroundType as string) || 'media'
  const heroBackgroundColor = (homeContent?.heroBackgroundColor as string) || null
  const heroBackgroundGradient = (homeContent?.heroBackgroundGradient as string) || null
  const directHlsUrl = (homeContent?.heroHlsUrl as string) || null
  const resolvedHlsUrl = directHlsUrl || heroMediaDoc?.hlsUrl || null
  const resolvedMediaType = resolvedHlsUrl
    ? 'hls'
    : heroMediaDoc?.mediaType || (heroMediaDoc?.mimeType?.startsWith('image/') ? 'image' : null)

  const posterFromMedia =
    heroMediaDoc?.mediaType === 'hls' || heroMediaDoc?.mimeType?.startsWith('image/')
      ? toSiteImageSrc(heroMediaDoc?.sizes?.hero?.url || heroMediaDoc?.url)
      : null

  const heroVideo = {
    src: toSiteImageSrc(heroMediaDoc?.url) || fallbackVideo.src,
    hlsUrl: resolvedHlsUrl,
    mediaType: resolvedMediaType,
    poster:
      toSiteImageSrc(customPoster?.sizes?.hero?.url || customPoster?.url) ||
      posterFromMedia ||
      fallbackVideo.poster,
    alt: heroMediaDoc?.alt || fallbackVideo.alt,
    mimeType: heroMediaDoc?.mimeType || fallbackVideo.mimeType,
    autoPlay: homeContent?.heroVideoAutoplay !== false,
    loop: homeContent?.heroVideoLoop !== false,
    muted: homeContent?.heroVideoMuted !== false,
  }

  const defaultHeroDoc = isMedia(settings?.sharedMedia?.defaultHeroImage)
    ? settings!.sharedMedia!.defaultHeroImage
    : null
  const defaultCtaDoc = isMedia(settings?.sharedMedia?.defaultCtaImage)
    ? settings!.sharedMedia!.defaultCtaImage
    : null

  const aboutMedia = isMedia(homeContent?.aboutImage)
    ? homeContent!.aboutImage
    : isMedia(location.mainImage)
      ? location.mainImage
      : defaultHeroDoc
  const aboutImgSrc = aboutMedia
    ? toSiteImageSrc(aboutMedia.sizes?.hero?.url || aboutMedia.url)
    : null
  const aboutImgAlt = aboutMedia?.alt || 'Behandlungszimmer der Zahnarztpraxis Palatty.'

  const aboutDetailMedia = isMedia(homeContent?.aboutDetailImage)
    ? homeContent!.aboutDetailImage
    : null
  const aboutDetailImgSrc = aboutDetailMedia
    ? toSiteImageSrc(aboutDetailMedia.sizes?.card?.url || aboutDetailMedia.url)
    : null
  const aboutDetailImgAlt = aboutDetailMedia?.alt || 'Praxisdetail der Zahnarztpraxis Palatty.'

  const appointmentMedia = isMedia(homeContent?.appointmentImage)
    ? homeContent!.appointmentImage
    : defaultCtaDoc
  const appointmentImgSrc = appointmentMedia
    ? toSiteImageSrc(appointmentMedia.sizes?.hero?.url || appointmentMedia.url)
    : null
  const appointmentImgAlt = appointmentMedia?.alt || 'Empfang der Zahnarztpraxis Palatty.'

  const primaryColor =
    (location as { primaryColor?: string | null })?.primaryColor ||
    designSystem?.accent ||
    '#00a887'
  const accentText = designSystem?.accentText || '#FFFFFF'
  const motionEnabled = designSystem?.motionEnabled !== false

  const heroBadge = homeContent?.heroBadge || 'Zahnarztpraxis Palatty'
  const heroHeadlineTop = homeContent?.heroHeadlineTop || 'Zahnmedizin,'
  const heroHeadlinePrefix = homeContent?.heroHeadlinePrefix || 'die sich'
  const highlightLines = (homeContent?.heroHeadlineHighlight || 'gut\nanfühlt.')
    .split('\n')
    .filter((l: string) => l.length > 0)
  const subheadlineLines = (
    homeContent?.heroSubheadline ||
    'Moderne Behandlung. Persönliche Betreuung.\nFür Sie und Ihre Familie.'
  ).split('\n')

  const heroPrimaryCtaLabel = homeContent?.heroPrimaryCtaLabel || 'Termin vereinbaren'
  const heroPrimaryCtaHref = homeContent?.heroPrimaryCtaHref || '/kontakt#termin'
  const heroSecondaryCtaLabel = homeContent?.heroSecondaryCtaLabel || 'Behandlungen entdecken'
  const heroSecondaryCtaHref = homeContent?.heroSecondaryCtaHref || '/leistungen'
  const heroScrollLabel = homeContent?.heroScrollLabel || 'Entdecken'

  const aboutEyebrow = homeContent?.aboutEyebrow || 'Zahnarztpraxis'
  const aboutHeading = homeContent?.aboutHeading || 'Im Herzen von Appenzell'
  const aboutLead =
    homeContent?.aboutLead ||
    'Willkommen in unserer Zahnarztpraxis — wo moderne Zahnmedizin auf persönliche Betreuung trifft. Unter dem Motto «Dein Lächeln. Unsere Leidenschaft.» setzen wir uns dafür ein, dass Sie sich rundum wohlfühlen.'
  const aboutBody =
    homeContent?.aboutBody ||
    'Als Familienzahnarztpraxis begleiten wir Menschen jeden Alters mit klarer Beratung und modernen Räumen. Bei uns wissen Sie jederzeit, was gemacht wird — transparent und nachvollziehbar.'
  const aboutLinkLabel = homeContent?.aboutLinkLabel || 'Zum Team'
  const aboutLinkHref = homeContent?.aboutLinkHref || '/team'
  const aboutBadgeLabel = homeContent?.aboutBadgeLabel || 'Im Herzen der Praxis'
  const aboutHighlights: string[] = Array.isArray(homeContent?.aboutHighlights)
    ? (homeContent!.aboutHighlights as Array<{ label?: string | null }>)
        .map((h) => h?.label?.trim())
        .filter((l): l is string => Boolean(l))
    : []
  const aboutExtendedParagraphs: string[] = Array.isArray(
    (homeContent as { aboutExtendedParagraphs?: Array<{ text?: string | null }> | null })
      ?.aboutExtendedParagraphs,
  )
    ? (
        (homeContent as { aboutExtendedParagraphs?: Array<{ text?: string | null }> })
          .aboutExtendedParagraphs ?? []
      )
        .map((p) => p?.text?.trim())
        .filter((t): t is string => Boolean(t))
    : []

  const careHeadlineTop = homeContent?.careHeadlineTop || 'Für gesunde Zähne.'
  const careHeadlineHighlight = homeContent?.careHeadlineHighlight || 'In jeder Lebensphase.'
  const careSubtitle =
    homeContent?.careSubtitle ||
    'Von der Vorsorge bis zur individuellen Behandlung: Wir begleiten Ihr Lächeln.'
  const careCards: CareCardItem[] = Array.isArray(homeContent?.careCards)
    ? (homeContent!.careCards as CareCardItem[])
    : []

  const galleryEyebrow = homeContent?.galleryEyebrow || 'Atmosphäre & Räume'
  const galleryHeading = homeContent?.galleryHeading || 'Einblicke in unsere Praxis.'
  const galleryHighlight = homeContent?.galleryHighlight || 'Helle Räume in Appenzell.'
  const galleryDescription =
    homeContent?.galleryDescription ||
    'Lichtdurchflutete Behandlungszimmer, ruhige Materialien und ein herzlicher Empfang – damit Sie sich vom ersten Moment an gut aufgehoben fühlen.'

  const galleryItems: PracticeGalleryItem[] = Array.isArray(homeContent?.galleryItems)
    ? (homeContent!.galleryItems as Array<Record<string, any>>)
        .map((row, idx): PracticeGalleryItem | null => {
          const mediaDoc = isMedia(row?.image) ? row.image : null
          const src = toSiteImageSrc(mediaDoc?.sizes?.hero?.url || mediaDoc?.url)
          if (!src) return null
          return {
            id: row.id || `cms-gal-${idx}`,
            src,
            alt: mediaDoc?.alt || row.caption || 'Praxisaufnahme Appenzell',
            category: row.category || 'Praxis',
            caption: row.caption || '',
            layoutSpan: row.layoutSpan || (idx === 0 || idx === 3 ? 'wide' : 'standard'),
          }
        })
        .filter((item): item is PracticeGalleryItem => Boolean(item))
    : []

  const servicesEyebrow = homeContent?.servicesEyebrow || 'Leistungen'
  const servicesHeading = homeContent?.servicesHeading || 'Behandlungen'
  const servicesHeadingHighlight = homeContent?.servicesHeadingHighlight || ''
  const servicesDescription =
    homeContent?.servicesDescription ||
    'Moderne Zahnmedizin und einfühlsame Behandlungskonzepte für Ihre Zahngesundheit.'
  const servicesLinkLabel = homeContent?.servicesLinkLabel || 'Alle Leistungen'

  const teamEyebrow = homeContent?.teamEyebrow || 'Team'
  const teamHeading = homeContent?.teamHeading || 'Erfahren Sie mehr über unser Team'
  const teamDescription =
    homeContent?.teamDescription ||
    'Ein motiviertes und eingespieltes Team sorgt dafür, dass Ihr Besuch professionell und persönlich ist.'
  const teamLinkLabel = homeContent?.teamLinkLabel || 'Team-Seite'
  const teamDefaultRoleLabel = homeContent?.teamDefaultRoleLabel || 'Praxisteam Appenzell'

  const pricingEyebrow =
    (homeContent as { pricingEyebrow?: string | null })?.pricingEyebrow || 'Transparenz & Tarif'
  const pricingHeading =
    (homeContent as { pricingHeading?: string | null })?.pricingHeading || 'Kosten – Zahnarzt'
  const pricingHighlight =
    (homeContent as { pricingHighlight?: string | null })?.pricingHighlight || ''
  const pricingCardEyebrow =
    (homeContent as { pricingCardEyebrow?: string | null })?.pricingCardEyebrow ||
    '01 / SSO & DENTOTAR®'
  const pricingChipOne =
    (homeContent as { pricingChipOne?: string | null })?.pricingChipOne || 'Krankenkassen'
  const pricingChipTwo =
    (homeContent as { pricingChipTwo?: string | null })?.pricingChipTwo || 'Privatpatienten'
  const pricingTaxPointLabel =
    (homeContent as { pricingTaxPointLabel?: string | null })?.pricingTaxPointLabel ||
    'Unser Taxpunkt (DENTOTAR®)'
  const pricingTaxPointValue =
    (homeContent as { pricingTaxPointValue?: string | null })?.pricingTaxPointValue || '1.10'
  const pricingSubcaption =
    (homeContent as { pricingSubcaption?: string | null })?.pricingSubcaption ||
    'Mindesttarif gemäss Schweizerischer Zahnärzte-Gesellschaft (SSO)'
  const pricingDescription =
    (homeContent as { pricingDescription?: string | null })?.pricingDescription || ''
  const pricingEstimateEyebrow =
    (homeContent as { pricingEstimateEyebrow?: string | null })?.pricingEstimateEyebrow ||
    '02 / KOSTENVORANSCHLAG'
  const pricingEstimateHeading =
    (homeContent as { pricingEstimateHeading?: string | null })?.pricingEstimateHeading ||
    'Klarheit vor jeder Behandlung.'
  const pricingNote = (homeContent as { pricingNote?: string | null })?.pricingNote || ''
  const pricingServicesCtaLabel =
    (homeContent as { pricingServicesCtaLabel?: string | null })?.pricingServicesCtaLabel ||
    'Fachbereiche ansehen'

  const locationEyebrow = homeContent?.locationEyebrow || 'Standort'
  const locationHeading = homeContent?.locationHeading || location.name || 'Zahnarztpraxis Appenzell'
  const locationHeadingHighlight = homeContent?.locationHeadingHighlight || ''
  const locationDescription =
    homeContent?.locationDescription ||
    'Ihre Praxis für zahnärztliche Fachkompetenz und moderne Behandlung im Herzen von Appenzell.'
  const locationAddressLabel =
    (homeContent as { locationAddressLabel?: string | null })?.locationAddressLabel ||
    'Praxisadresse'
  const locationMapLabel =
    (homeContent as { locationMapLabel?: string | null })?.locationMapLabel || 'Route planen'
  const hoursDisclaimer = homeContent?.hoursDisclaimer || ''
  const hinEmail = (location as { hinEmail?: string | null }).hinEmail

  const appointmentEyebrow = homeContent?.appointmentEyebrow || 'Termin'
  const appointmentHeading = homeContent?.appointmentHeading || 'Wir freuen uns auf Sie'
  const appointmentDescription =
    homeContent?.appointmentDescription ||
    'Rufen Sie an, schreiben Sie eine E-Mail oder nutzen Sie die Kontaktseite.'
  const appointmentLinkLabel = homeContent?.appointmentLinkLabel || 'Zur Kontaktseite'
  const teamPortraitPlaceholderLabel =
    (settings as { teamPortraitPlaceholderLabel?: string | null })?.teamPortraitPlaceholderLabel ||
    'Porträt folgt'

  const treatmentItems = services.slice(0, 8).map((s) => ({
    id: s.id,
    name: s.name,
    slug: s.slug,
    shortDescription: s.shortDescription,
    featuredImage: s.featuredImage,
  }))
  const treatmentFallbackSrc = defaultHeroDoc
    ? toSiteImageSrc(defaultHeroDoc.sizes?.card?.url || defaultHeroDoc.url)
    : null

  return (
    <AppenzellMotionRoot motionEnabled={motionEnabled}>
      {/* 1. Full-viewport alpine video hero */}
      <Section
        id="hero"
        spacing="none"
        className="relative min-h-dvh overflow-hidden border-b border-[var(--color-border)]"
      >
        <div className="appenzell-hero-media absolute inset-0">
          <WelcomeVideoHero
            src={heroVideo.src}
            hlsUrl={heroVideo.hlsUrl}
            mediaType={heroVideo.mediaType}
            poster={heroVideo.poster}
            alt={heroVideo.alt}
            mimeType={heroVideo.mimeType}
            backgroundType={heroBackgroundType}
            backgroundColor={heroBackgroundColor}
            backgroundGradient={heroBackgroundGradient}
            autoPlay={heroVideo.autoPlay}
            loop={heroVideo.loop}
            muted={heroVideo.muted}
            variant="fullBleed"
          />
        </div>
        <div className="relative z-[2] px-4 sm:px-8 lg:px-10">
          <div
            className="mx-auto flex min-h-dvh w-full items-end justify-center pb-16 pt-28 sm:items-center sm:justify-start sm:pb-20 sm:pt-32"
            style={{ maxWidth: 'var(--header-max-width, 1440px)' }}
          >
            <HeroEntrance className="w-full max-w-2xl">
              <Stack gap="6">
                <div data-ax-enter="label">
                  <div className="inline-flex w-fit items-center gap-2.5 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 backdrop-blur-md shadow-sm">
                    <span
                      className="h-2 w-2 shrink-0 rounded-full"
                      style={{
                        backgroundColor: primaryColor,
                        boxShadow: `0 0 10px ${primaryColor}99`,
                      }}
                      aria-hidden
                    />
                    <span className="font-sans text-[length:var(--text-xs)] font-bold uppercase tracking-[0.16em] text-white">
                      {heroBadge}
                    </span>
                  </div>
                </div>
                <div data-ax-enter="heading">
                  <h1 className="font-sans text-[clamp(2.75rem,7vw,5.25rem)] font-extrabold leading-[1.0] tracking-[-0.035em] text-white text-balance drop-shadow-[0_2px_12px_rgba(0,0,0,0.65)]">
                    {heroHeadlineTop}
                    <br />
                    {heroHeadlinePrefix}{' '}
                    {highlightLines.map((line: string, i: number) => (
                      <Fragment key={i}>
                        <span style={{ color: primaryColor }}>{line}</span>
                        {i < highlightLines.length - 1 ? <br /> : null}
                      </Fragment>
                    ))}
                  </h1>
                </div>
                <div data-ax-enter="lead">
                  <p className="font-sans text-base sm:text-lg lg:text-xl font-normal leading-relaxed text-white/95 text-pretty drop-shadow-[0_1px_6px_rgba(0,0,0,0.6)]">
                    {subheadlineLines.map((line: string, i: number) => (
                      <Fragment key={i}>
                        {line}
                        {i < subheadlineLines.length - 1 ? <br /> : null}
                      </Fragment>
                    ))}
                  </p>
                </div>
                <div
                  data-ax-enter="cta"
                  className="flex flex-col gap-4 pt-2 sm:flex-row sm:items-center sm:gap-6"
                >
                  <ButtonLink
                    href={heroPrimaryCtaHref}
                    size="lg"
                    className="rounded-xl px-7 py-4 font-sans font-semibold text-base hover:brightness-95 hover:-translate-y-0.5 transition-all duration-200"
                    style={{
                      backgroundColor: primaryColor,
                      color: accentText,
                      boxShadow: `0 4px 20px ${primaryColor}66`,
                    }}
                  >
                    {heroPrimaryCtaLabel}
                    <span aria-hidden className="text-[1.15em] leading-none ml-1">
                      ↗
                    </span>
                  </ButtonLink>
                  <Link
                    href={heroSecondaryCtaHref}
                    className="group inline-flex items-center gap-2 font-sans font-semibold text-base text-white hover:text-white bg-white/15 hover:bg-white/25 px-6 py-4 rounded-xl border border-white/30 hover:border-white/50 backdrop-blur-sm shadow-sm transition-all duration-200 no-underline"
                  >
                    {heroSecondaryCtaLabel}
                    <span
                      aria-hidden
                      className="transition-transform duration-200 group-hover:translate-x-1"
                    >
                      →
                    </span>
                  </Link>
                </div>
              </Stack>
            </HeroEntrance>
          </div>
        </div>
        {heroScrollLabel ? (
          <a href="#praxis" className="hero-scroll-cue" aria-label="Weiter zur Praxis">
            <span>{heroScrollLabel}</span>
            <span className="hero-scroll-cue-line" aria-hidden="true" />
          </a>
        ) : null}
      </Section>

      {/* 2. Praxis Showcase — Editorial Split with CMS Photos & Highlights */}
      <PraxisShowcaseSection
        eyebrow={aboutEyebrow}
        heading={aboutHeading}
        lead={aboutLead}
        body={aboutBody}
        linkLabel={aboutLinkLabel}
        linkHref={aboutLinkHref}
        mainImgSrc={aboutImgSrc}
        mainImgAlt={aboutImgAlt}
        detailImgSrc={aboutDetailImgSrc}
        detailImgAlt={aboutDetailImgAlt}
        cityLabel={location.address.city || 'Appenzell'}
        badgeLabel={aboutBadgeLabel}
        highlights={aboutHighlights}
        extendedParagraphs={aboutExtendedParagraphs}
        motionEnabled={motionEnabled}
      />

      {/* 3. Schwerpunkte / Lebensphasen — CMS Cards */}
      {careCards.length > 0 ? (
        <CarePillarsSection
          headlineTop={careHeadlineTop}
          headlineHighlight={careHeadlineHighlight}
          subtitle={careSubtitle}
          cards={careCards}
          motionEnabled={motionEnabled}
        />
      ) : null}

      {/* 4. Praxis-Einblicke — CMS Bento Photography Mosaic */}
      <PracticeGalleryBand
        eyebrow={galleryEyebrow}
        heading={galleryHeading}
        highlight={galleryHighlight}
        description={galleryDescription}
        items={galleryItems}
        motionEnabled={motionEnabled}
      />

      {/* 5. Leistungen — Interactive Accordion + Live Featured Treatment Preview */}
      <section id="leistungen" className="leistungen-section">
        <Container>
          <div className="palatty-section-header">
            <Reveal className="max-w-2xl">
              <div className="flex flex-col gap-3">
                <span className="palatty-pill-eyebrow">
                  <span className="palatty-pill-dot" aria-hidden="true" />
                  {servicesEyebrow}
                </span>
                <h2 className="palatty-display-h2">
                  {servicesHeading}{' '}
                  {servicesHeadingHighlight ? (
                    <span className="palatty-display-accent">{servicesHeadingHighlight}</span>
                  ) : null}
                </h2>
              </div>
            </Reveal>
            <Reveal className="flex flex-col gap-3 max-w-sm lg:pb-1">
              <p className="m-0 font-sans text-[0.95rem] leading-relaxed text-[#4f6468]">
                {servicesDescription}
              </p>
              <Link
                href="/leistungen"
                prefetch={true}
                className="inline-flex w-fit items-center gap-2 font-sans text-sm font-semibold text-[#0e2a2f] no-underline hover:text-[var(--color-accent)] transition-colors"
              >
                <span>{servicesLinkLabel}</span>
                <span className="appenzell-link-arrow" aria-hidden="true">
                  →
                </span>
              </Link>
            </Reveal>
          </div>

          <TreatmentExplorer
            services={treatmentItems}
            fallbackImageSrc={treatmentFallbackSrc}
          />
        </Container>
      </section>

      {/* 6. Team — Studio Portrait Cards */}
      <section id="team" className="team-modern-section">
        <Container>
          <div className="palatty-section-header">
            <Reveal className="max-w-2xl">
              <div className="flex flex-col gap-3">
                <span className="palatty-pill-eyebrow">
                  <span className="palatty-pill-dot" aria-hidden="true" />
                  {teamEyebrow}
                </span>
                <h2 className="palatty-display-h2">{teamHeading}</h2>
              </div>
            </Reveal>
            <Reveal className="flex flex-col gap-3 max-w-sm lg:pb-1">
              <p className="m-0 font-sans text-[0.95rem] leading-relaxed text-[#4f6468]">
                {teamDescription}
              </p>
              <Link
                href="/team"
                prefetch={true}
                className="inline-flex w-fit items-center gap-2 font-sans text-sm font-semibold text-[#0e2a2f] no-underline hover:text-[var(--color-accent)] transition-colors"
              >
                <span>{teamLinkLabel}</span>
                <span className="appenzell-link-arrow" aria-hidden="true">
                  →
                </span>
              </Link>
            </Reveal>
          </div>

          {team.length > 0 ? (
            <Reveal variant="stagger">
              <div className="team-portrait-grid">
                {team.slice(0, 5).map((member) => {
                  const photoSrc = isMedia(member.photo)
                    ? toSiteImageSrc(member.photo.sizes?.card?.url || member.photo.url || undefined)
                    : null
                  return (
                    <article key={member.id} className="appenzell-reveal-item team-card">
                      <div className="team-card-media">
                        {photoSrc ? (
                          <Image
                            src={photoSrc}
                            alt={
                              isMedia(member.photo)
                                ? member.photo.alt || `Porträt von ${member.fullName}`
                                : `Porträt von ${member.fullName}`
                            }
                            fill
                            quality={90}
                            className="team-card-img"
                            sizes="(max-width:768px) 50vw, 20vw"
                          />
                        ) : (
                          <div className="flex h-full min-h-48 items-end bg-[#e8f0ee] p-3">
                            <Text size="sm" tone="muted">
                              {teamPortraitPlaceholderLabel}
                            </Text>
                          </div>
                        )}
                      </div>
                      <div className="team-card-body">
                        <h3 className="team-card-name">{member.fullName}</h3>
                        {member.professionalTitle || member.position ? (
                          <p className="team-card-role">
                            {[member.professionalTitle, member.position].filter(Boolean).join(' · ')}
                          </p>
                        ) : (
                          <p className="team-card-role">{teamDefaultRoleLabel}</p>
                        )}
                      </div>
                    </article>
                  )
                })}
              </div>
            </Reveal>
          ) : null}
        </Container>
      </section>

      {/* 6b. Kosten – Zahnarzt (SSO / DENTOTAR® Taxpunkt 1.10) */}
      {pricingDescription || pricingNote ? (
        <section id="kosten" className="py-[var(--section-y)] bg-[#f7faf9] border-t border-black/[0.05]">
          <Container>
            <div className="palatty-section-header">
              <Reveal className="max-w-2xl">
                <div className="flex flex-col gap-3">
                  <span className="palatty-pill-eyebrow">
                    <span className="palatty-pill-dot" aria-hidden="true" />
                    {pricingEyebrow}
                  </span>
                  <h2 className="palatty-display-h2">
                    {pricingHeading}{' '}
                    {pricingHighlight ? (
                      <span className="palatty-display-accent">{pricingHighlight}</span>
                    ) : null}
                  </h2>
                </div>
              </Reveal>
            </div>

            <div className="contact-hub-grid">
              <Reveal className="tariff-dark-card">
                <Stack gap="5">
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3.5 py-1 font-sans text-xs font-semibold uppercase tracking-[0.14em] text-white/90">
                      <span
                        className="h-2 w-2 rounded-full"
                        style={{ backgroundColor: primaryColor }}
                        aria-hidden="true"
                      />
                      {pricingCardEyebrow}
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {pricingChipOne ? <span className="tariff-chip">{pricingChipOne}</span> : null}
                      {pricingChipTwo ? <span className="tariff-chip">{pricingChipTwo}</span> : null}
                    </div>
                  </div>

                  {pricingTaxPointValue ? (
                    <div className="flex flex-wrap items-baseline gap-4 border-y border-white/10 py-5">
                      <span
                        className="font-display text-[clamp(2.75rem,4.5vw,3.75rem)] font-bold leading-none tracking-tight"
                        style={{ color: primaryColor }}
                      >
                        {pricingTaxPointValue}
                      </span>
                      <div className="flex flex-col gap-0.5">
                        <span className="font-sans text-sm font-semibold text-white">
                          {pricingTaxPointLabel}
                        </span>
                        {pricingSubcaption ? (
                          <span className="font-sans text-xs text-white/65">
                            {pricingSubcaption}
                          </span>
                        ) : null}
                      </div>
                    </div>
                  ) : null}

                  {pricingDescription ? (
                    <p className="m-0 font-sans text-[0.98rem] leading-relaxed text-white/85">
                      {pricingDescription}
                    </p>
                  ) : null}
                </Stack>
              </Reveal>

              <Reveal className="contact-hub-card flex flex-col justify-between" delayMs={90}>
                <Stack gap="4">
                  <span className="care-pillar-eyebrow">{pricingEstimateEyebrow}</span>
                  <h3 className="m-0 font-display text-2xl font-semibold tracking-[-0.02em] text-[#0e2a2f]">
                    {pricingEstimateHeading}
                  </h3>
                  {pricingNote ? (
                    <p className="m-0 font-sans text-[0.98rem] leading-relaxed text-[#496064]">
                      {pricingNote}
                    </p>
                  ) : null}
                </Stack>

                <div className="mt-6 flex flex-wrap items-center gap-3 border-t border-black/[0.07] pt-5">
                  <BookingPlaceholder
                    compact
                    location={location}
                    label={settings?.bookingCtaLabel || undefined}
                  />
                  <Link href="/leistungen" prefetch={true} className="contact-pill-action">
                    <span>{pricingServicesCtaLabel}</span>
                    <span aria-hidden="true">→</span>
                  </Link>
                </div>
              </Reveal>
            </div>
          </Container>
        </section>
      ) : null}

      {/* 7. Standort, Öffnungszeiten & Termin — Consolidated Architectural Hub */}
      <section id="standort" className="contact-hub-section">
        <Container>
          <div className="palatty-section-header">
            <Reveal className="max-w-2xl">
              <div className="flex flex-col gap-3">
                <span className="palatty-pill-eyebrow">
                  <span className="palatty-pill-dot" aria-hidden="true" />
                  {locationEyebrow}
                </span>
                <h2 className="palatty-display-h2">
                  {locationHeading}{' '}
                  {locationHeadingHighlight ? (
                    <span className="palatty-display-accent">{locationHeadingHighlight}</span>
                  ) : null}
                </h2>
              </div>
            </Reveal>
            <Reveal className="max-w-sm lg:pb-1">
              <p className="m-0 font-sans text-[0.95rem] leading-relaxed text-[#4f6468]">
                {locationDescription}
              </p>
            </Reveal>
          </div>

          <div id="kontakt" className="contact-hub-grid">
            <Reveal className="contact-hub-card">
              <Stack gap="6">
                <div className="flex flex-wrap items-start justify-between gap-4 border-b border-black/[0.07] pb-6">
                  <div>
                    <p className="m-0 font-sans text-xs font-semibold uppercase tracking-[0.14em] text-[#546b6f]">
                      {locationAddressLabel}
                    </p>
                    <p className="mt-2 mb-0 font-display text-xl font-semibold text-[#0e2a2f]">
                      {location.name || 'Zahnarztpraxis Palatty Appenzell'}
                    </p>
                    <p className="mt-1 mb-0 font-sans text-[0.95rem] leading-relaxed text-[#4f6468]">
                      {location.address.street}, {location.address.postalCode} {location.address.city}
                    </p>
                  </div>

                  {location.googleMapsUrl ? (
                    <a
                      href={location.googleMapsUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="contact-pill-action"
                    >
                      <span>{locationMapLabel}</span>
                      <span aria-hidden="true">↗</span>
                    </a>
                  ) : null}
                </div>

                <div className="flex flex-wrap gap-3">
                  {location.phone ? (
                    <a
                      href={`tel:${location.phone.replace(/\s+/g, '')}`}
                      className="contact-pill-action"
                    >
                      <span
                        className="h-2 w-2 rounded-full"
                        style={{ backgroundColor: primaryColor }}
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

                <div>
                  <p className="mt-0 mb-3 font-sans text-xs font-semibold uppercase tracking-[0.14em] text-[#546b6f]">
                    {(settings as any)?.footerHoursLabel || 'Öffnungszeiten'}
                  </p>
                  <OpeningHoursList entries={location.openingHours} />
                  {hoursDisclaimer ? (
                    <p className="mt-3 mb-0 font-sans text-xs text-[#647b7f]">{hoursDisclaimer}</p>
                  ) : null}
                </div>
              </Stack>
            </Reveal>

            <div id="termin" className="h-full">
              <Reveal className="contact-hub-card contact-hub-card--accent h-full" delayMs={100}>
                <div>
                  {appointmentImgSrc ? (
                    <div className="relative mb-6 aspect-[16/9] w-full overflow-hidden rounded-2xl border border-white/80 shadow-md">
                      <Image
                        src={appointmentImgSrc}
                        alt={appointmentImgAlt}
                        fill
                        quality={88}
                        className="object-cover object-center"
                        sizes="(max-width:1024px) 100vw, 45vw"
                      />
                    </div>
                  ) : null}

                  <span className="palatty-pill-eyebrow mb-3">
                    <span className="palatty-pill-dot" aria-hidden="true" />
                    {appointmentEyebrow}
                  </span>
                  <h3 className="m-0 font-display text-[1.65rem] font-semibold tracking-[-0.02em] text-[#0e2a2f]">
                    {appointmentHeading}
                  </h3>
                  <p className="mt-2.5 mb-6 font-sans text-[0.95rem] leading-relaxed text-[#496064]">
                    {appointmentDescription}
                  </p>
                </div>

                <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:flex-wrap sm:items-center">
                  <BookingPlaceholder
                    location={location}
                    label={settings?.bookingCtaLabel || undefined}
                  />
                  <Link
                    href="/kontakt"
                    prefetch={true}
                    className="inline-flex items-center gap-2 rounded-xl border border-black/10 bg-white/80 px-5 py-3 font-sans text-sm font-semibold text-[#0e2a2f] no-underline backdrop-blur-sm transition hover:bg-white"
                  >
                    <span>{appointmentLinkLabel}</span>
                    <span aria-hidden="true">→</span>
                  </Link>
                </div>
              </Reveal>
            </div>
          </div>
        </Container>
      </section>
    </AppenzellMotionRoot>
  )
}
