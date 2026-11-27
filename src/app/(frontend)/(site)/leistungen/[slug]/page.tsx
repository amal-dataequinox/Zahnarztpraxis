import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import React from 'react'

import { LexicalRichText } from '@/components/cms/LexicalRichText'
import { BookingPlaceholder } from '@/components/site/BookingPlaceholder'
import { PageHeroBand } from '@/components/site/PageHeroBand'
import { Container, Stack, Text } from '@/design-system'
import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'
import { getServiceBySlug, getServicesForLocation, getSiteSettings } from '@/utilities/cmsQueries'
import { isMedia, toSiteImageSrc } from '@/utilities/media'
import { resolveCurrentLocation } from '@/utilities/resolveLocation'
import { generatePageMetadata } from '@/utilities/seo'

export const dynamic = 'force-dynamic'

type RouteParams = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: RouteParams): Promise<Metadata> {
  const { slug } = await params
  const location = await resolveCurrentLocation()
  if (!location) return {}
  const service = await getServiceBySlug(slug, location.id)
  if (!service) return {}
  return generatePageMetadata({
    location,
    path: `/leistungen/${slug}`,
    fallbackTitle: service.meta?.title || service.name,
    fallbackDescription: service.meta?.description || service.shortDescription || undefined,
  })
}

export default async function ServiceDetailPage({ params }: RouteParams) {
  const { slug } = await params
  const location = await resolveCurrentLocation()
  if (!location) notFound()

  const [service, allServices, settings] = await Promise.all([
    getServiceBySlug(slug, location.id),
    getServicesForLocation(location.id),
    getSiteSettings().catch(() => null),
  ])
  if (!service) notFound()

  const related = allServices.filter((item) => item.id !== service.id).slice(0, 3)

  const defaultHeroDoc = isMedia(settings?.sharedMedia?.defaultHeroImage)
    ? settings!.sharedMedia!.defaultHeroImage
    : null
  const featuredDoc = isMedia(service.featuredImage) ? service.featuredImage : defaultHeroDoc
  const featuredSrc = featuredDoc
    ? toSiteImageSrc(featuredDoc.sizes?.hero?.url || featuredDoc.url)
    : null
  const defaultThumbSrc = defaultHeroDoc
    ? toSiteImageSrc(defaultHeroDoc.sizes?.card?.url || defaultHeroDoc.url)
    : null

  const sidebarEyebrow = settings?.serviceSidebarEyebrow || 'Termin & Beratung'
  const sidebarDescription =
    settings?.serviceSidebarDescription ||
    'Vereinbaren Sie Ihren Termin bequem telefonisch oder online – unser Praxisteam berät Sie gerne persönlich.'
  const fallbackDetail =
    settings?.serviceFallbackDetail ||
    'Jede zahnmedizinische Behandlung beginnt bei uns mit einem ruhigen Gespräch und einer verständlichen Diagnostik.'
  const relatedHeading = settings?.relatedServicesHeading || 'Weitere Behandlungen'
  const bookingLabel = settings?.bookingCtaLabel || 'Termin anfragen'
  const breadcrumbLabel =
    (settings as { serviceBreadcrumbLabel?: string | null })?.serviceBreadcrumbLabel ||
    'Alle Leistungen'
  const detailEyebrow =
    (settings as { serviceDetailEyebrow?: string | null })?.serviceDetailEyebrow ||
    'Behandlungsdetails'
  const relatedEyebrow =
    (settings as { serviceRelatedEyebrow?: string | null })?.serviceRelatedEyebrow || 'Entdecken'
  const viewAllLabel =
    (settings as { serviceViewAllLabel?: string | null })?.serviceViewAllLabel || 'Alle ansehen'
  const cardDetailsLabel =
    (settings as { serviceCardDetailsLabel?: string | null })?.serviceCardDetailsLabel ||
    'Details ansehen'

  return (
    <main id="main">
      <PageHeroBand
        eyebrow="Leistung"
        breadcrumbHref="/leistungen"
        breadcrumbLabel={breadcrumbLabel}
        title={service.name}
        lead={service.shortDescription || undefined}
        mediaSrc={featuredSrc}
        mediaAlt={featuredDoc?.alt || service.name}
      >
        <div className="flex flex-wrap items-center gap-3">
          <BookingPlaceholder location={location} label={bookingLabel} />
          {location.phone ? (
            <a
              href={`tel:${location.phone.replace(/\s+/g, '')}`}
              className="contact-pill-action"
            >
              <span>{location.phone}</span>
            </a>
          ) : null}
        </div>
      </PageHeroBand>

      <section className="py-[var(--section-y)] bg-[#f7faf9] border-b border-black/[0.06]">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,0.75fr)] lg:gap-12 items-start">
            <div className="editorial-prose-card">
              <span className="palatty-pill-eyebrow mb-4">
                <span className="palatty-pill-dot" aria-hidden="true" />
                {detailEyebrow}
              </span>
              {service.detailedDescription ? (
                <LexicalRichText
                  data={service.detailedDescription as SerializedEditorState}
                  className="max-w-none [&_h2]:mt-0 [&_h2]:text-2xl sm:[&_h2]:text-3xl [&_h2]:font-semibold [&_h2]:text-[#0e2a2f] [&_h3]:text-[#0e2a2f]"
                />
              ) : (
                <Stack gap="4">
                  <h2 className="m-0 font-display text-2xl font-semibold text-[#0e2a2f]">
                    Persönliche Beratung in {location.address.city}
                  </h2>
                  <Text tone="muted" className="leading-relaxed">
                    {fallbackDetail}
                  </Text>
                </Stack>
              )}
            </div>

            <aside className="contact-hub-card contact-hub-card--accent lg:sticky lg:top-28">
              <Stack gap="4">
                <span className="palatty-pill-eyebrow">
                  <span className="palatty-pill-dot" aria-hidden="true" />
                  {sidebarEyebrow}
                </span>
                <h3 className="m-0 font-display text-xl font-semibold text-[#0e2a2f]">
                  Fragen zu {service.name}?
                </h3>
                <p className="m-0 font-sans text-sm leading-relaxed text-[#4f6468]">
                  {sidebarDescription}
                </p>
                <div className="pt-2">
                  <BookingPlaceholder location={location} label={bookingLabel} />
                </div>
                {location.phone ? (
                  <a
                    href={`tel:${location.phone.replace(/\s+/g, '')}`}
                    className="contact-pill-action w-fit"
                  >
                    <span>Telefon: {location.phone}</span>
                  </a>
                ) : null}
              </Stack>
            </aside>
          </div>
        </Container>
      </section>

      {related.length > 0 ? (
        <section className="py-[var(--section-y)] bg-white">
          <Container>
            <div className="mb-8 flex items-end justify-between gap-4">
              <div>
                <span className="palatty-pill-eyebrow mb-3">
                  <span className="palatty-pill-dot" aria-hidden="true" />
                  {relatedEyebrow}
                </span>
                <h2 className="palatty-display-h2">{relatedHeading}</h2>
              </div>
              <Link
                href="/leistungen"
                prefetch={true}
                className="font-sans text-sm font-semibold text-[#0e2a2f] no-underline hover:text-[var(--color-accent)]"
              >
                {viewAllLabel} →
              </Link>
            </div>

            <div className="service-bento-grid">
              {related.map((item, idx) => {
                const imgDoc = isMedia(item.featuredImage) ? item.featuredImage : null
                const thumbSrc = imgDoc
                  ? toSiteImageSrc(imgDoc.sizes?.card?.url || imgDoc.url)
                  : defaultThumbSrc
                return (
                  <Link
                    key={item.id}
                    href={`/leistungen/${item.slug}`}
                    prefetch={true}
                    className="service-bento-card group"
                  >
                    {thumbSrc ? (
                      <div className="service-bento-thumb">
                        <Image
                          src={thumbSrc}
                          alt={imgDoc?.alt || item.name}
                          fill
                          quality={85}
                          className="object-cover"
                          sizes="(max-width:768px) 100vw, 33vw"
                        />
                        <span className="treatment-row-index absolute left-4 top-4 shadow-sm">
                          {String(idx + 1).padStart(2, '0')}
                        </span>
                      </div>
                    ) : null}
                    <div className="service-bento-body">
                      <div>
                        <h3 className="m-0 font-display text-lg font-semibold text-[#0e2a2f] group-hover:text-[var(--color-accent)] transition-colors">
                          {item.name}
                        </h3>
                        {item.shortDescription ? (
                          <p className="mt-2 mb-4 font-sans text-sm leading-relaxed text-[#52686c]">
                            {item.shortDescription}
                          </p>
                        ) : null}
                      </div>
                      <div className="care-pillar-footer">
                        <span className="care-pillar-link-label">{cardDetailsLabel}</span>
                        <span
                          className="font-sans text-base text-[#0e2a2f] transition-transform duration-300 group-hover:translate-x-1"
                          aria-hidden="true"
                        >
                          →
                        </span>
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          </Container>
        </section>
      ) : null}
    </main>
  )
}
