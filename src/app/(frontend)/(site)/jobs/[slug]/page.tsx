import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import React from 'react'

import { LexicalRichText } from '@/components/cms/LexicalRichText'
import { ApplicationGuide } from '@/components/jobs/ApplicationGuide'
import { ApplyModal } from '@/components/jobs/ApplyModal'
import { formatEmploymentType, toSchemaEmploymentType } from '@/components/jobs/labels'
import { PageHeroBand } from '@/components/site/PageHeroBand'
import { Container, Stack } from '@/design-system'
import {
  getJobBoardConfig,
  getJobBySlug,
  getSiteSettings,
} from '@/utilities/cmsQueries'
import { isMedia, toSiteImageSrc } from '@/utilities/media'
import { resolveCurrentLocation } from '@/utilities/resolveLocation'
import { getLocationBaseUrl } from '@/utilities/seo'

export const dynamic = 'force-dynamic'

function extractPlainText(node: unknown): string {
  if (!node || typeof node !== 'object') return ''
  const record = node as { text?: string; children?: unknown[] }
  const childText = Array.isArray(record.children)
    ? record.children.map(extractPlainText).join(' ')
    : ''
  return [record.text || '', childText].filter(Boolean).join(' ').replace(/\s+/g, ' ').trim()
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const [job, location] = await Promise.all([
    getJobBySlug(slug, true),
    resolveCurrentLocation(),
  ])

  if (!job) {
    return { title: 'Stelle nicht gefunden' }
  }

  const title = job.meta?.title || `${job.title} | ${location?.name || 'Zahnarztpraxis Palatty'}`
  const description =
    job.meta?.description ||
    job.summary ||
    `${job.title} (${job.location}) — Offene Stelle bei ${location?.name || 'Zahnarztpraxis Palatty'}.`

  return {
    title,
    description,
    openGraph: {
      title,
      description,
    },
  }
}

export default async function JobDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const [job, boardConfig, location, settings] = await Promise.all([
    getJobBySlug(slug, true),
    getJobBoardConfig().catch(() => null),
    resolveCurrentLocation(),
    getSiteSettings().catch(() => null),
  ])

  if (!job) notFound()

  const isOpen = job.status === 'active'
  const guide = boardConfig?.applicationGuide
  const heroMediaDoc = isMedia(settings?.sharedMedia?.defaultHeroImage)
    ? settings!.sharedMedia!.defaultHeroImage
    : null

  const applyButton = (
    <ApplyModal
      jobId={job.jobId}
      jobTitle={job.title}
      intro={guide?.formIntro}
      successMessage={guide?.successMessage}
    />
  )

  const baseUrl = location ? getLocationBaseUrl(location) : 'https://zahnarztpraxis-palatty.ch'
  const jobPostingSchema = isOpen
    ? JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'JobPosting',
        title: job.title,
        description:
          job.summary || extractPlainText(job.description?.root) || `${job.title} (${job.location})`,
        identifier: {
          '@type': 'PropertyValue',
          name: location?.name || 'Zahnarztpraxis Palatty',
          value: job.jobId,
        },
        datePosted: job.createdAt,
        employmentType: toSchemaEmploymentType(job.employmentType),
        hiringOrganization: {
          '@type': 'Organization',
          name: location?.name || 'Zahnarztpraxis Palatty',
          sameAs: baseUrl,
        },
        jobLocation: {
          '@type': 'Place',
          address: {
            '@type': 'PostalAddress',
            addressLocality: job.location,
            addressCountry: 'CH',
          },
        },
      })
    : null

  return (
    <main id="main">
      <PageHeroBand
        eyebrow={`${job.department} · ${job.jobId}`}
        breadcrumbHref="/jobs"
        breadcrumbLabel="Alle offenen Stellen"
        title={job.title}
        lead={
          job.summary ||
          `${job.department} · ${job.location}${job.workload ? ` · Pensum ${job.workload}` : ''}`
        }
        mediaSrc={heroMediaDoc ? toSiteImageSrc(heroMediaDoc.sizes?.hero?.url || heroMediaDoc.url) : null}
        mediaAlt={heroMediaDoc?.alt || job.title}
      >
        <div className="flex flex-wrap items-center gap-3">
          {isOpen ? (
            applyButton
          ) : (
            <span className="inline-flex min-h-11 items-center rounded-xl border border-amber-200 bg-amber-50 px-4 py-2 font-sans text-sm font-semibold text-amber-800">
              Diese Stelle ist aktuell besetzt.
            </span>
          )}
          <a
            href="#role-details"
            className="inline-flex min-h-12 items-center gap-2 rounded-xl border border-black/[0.12] bg-white px-5 py-3 font-sans text-sm font-semibold text-[#0e2a2f] no-underline transition-colors hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]"
          >
            <span>Stellenprofil ansehen</span>
            <span aria-hidden="true">↓</span>
          </a>
        </div>
      </PageHeroBand>

      <section id="role-details" className="py-[var(--section-y)] bg-white">
        <Container>
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-start">
            {/* Left column: RichText details */}
            <div className="lg:col-span-8 flex flex-col gap-6">
              <article className="editorial-prose-card">
                <span className="care-pillar-eyebrow">01 / DIE POSITION</span>
                <h2 className="mt-2 mb-4 font-display text-2xl font-semibold text-[#0e2a2f]">
                  Über die Stelle
                </h2>
                <LexicalRichText
                  data={job.description as SerializedEditorState}
                  className="max-w-none"
                />
              </article>

              <article className="editorial-prose-card">
                <span className="care-pillar-eyebrow">02 / ANFORDERUNGEN</span>
                <h2 className="mt-2 mb-4 font-display text-2xl font-semibold text-[#0e2a2f]">
                  Ihr Profil
                </h2>
                <LexicalRichText
                  data={job.requirements as SerializedEditorState}
                  className="max-w-none"
                />
              </article>

              {job.tasks ? (
                <article className="editorial-prose-card">
                  <span className="care-pillar-eyebrow">03 / AUFGABENBEREICH</span>
                  <h2 className="mt-2 mb-4 font-display text-2xl font-semibold text-[#0e2a2f]">
                    Ihre Aufgaben
                  </h2>
                  <LexicalRichText
                    data={job.tasks as SerializedEditorState}
                    className="max-w-none"
                  />
                </article>
              ) : null}

              {job.benefits ? (
                <article className="editorial-prose-card">
                  <span className="care-pillar-eyebrow">
                    {job.tasks ? '04 / VORTEILE' : '03 / VORTEILE'}
                  </span>
                  <h2 className="mt-2 mb-4 font-display text-2xl font-semibold text-[#0e2a2f]">
                    Wir bieten
                  </h2>
                  <LexicalRichText
                    data={job.benefits as SerializedEditorState}
                    className="max-w-none"
                  />
                </article>
              ) : null}

              {job.applicationNote ? (
                <div className="rounded-2xl border border-black/[0.08] bg-[#f7faf9] p-6 font-sans text-sm leading-relaxed text-[#4f6468]">
                  <p className="mt-0 mb-1 font-semibold text-[#0e2a2f]">Hinweis zur Bewerbung</p>
                  <p className="m-0">{job.applicationNote}</p>
                </div>
              ) : null}
            </div>

            {/* Right sticky sidebar: Quick Facts & Apply CTA */}
            <aside className="lg:col-span-4 lg:sticky lg:top-28 flex flex-col gap-5">
              <div className="contact-hub-card flex flex-col gap-5">
                <div>
                  <span className="care-pillar-eyebrow">Auf einen Blick</span>
                  <h2 className="mt-2 mb-0 font-display text-xl font-semibold text-[#0e2a2f]">
                    Eckdaten zur Stelle
                  </h2>
                </div>

                <dl className="m-0 flex flex-col gap-3 border-y border-black/[0.07] py-4 font-sans text-sm">
                  <div className="flex items-baseline justify-between gap-4">
                    <dt className="text-[#52686c]">Fachbereich</dt>
                    <dd className="m-0 text-right font-semibold text-[#0e2a2f]">
                      {job.department}
                    </dd>
                  </div>
                  <div className="flex items-baseline justify-between gap-4">
                    <dt className="text-[#52686c]">Arbeitsort</dt>
                    <dd className="m-0 text-right font-semibold text-[#0e2a2f]">{job.location}</dd>
                  </div>
                  {job.workload ? (
                    <div className="flex items-baseline justify-between gap-4">
                      <dt className="text-[#52686c]">Pensum</dt>
                      <dd className="m-0 text-right font-semibold text-[#0e2a2f]">{job.workload}</dd>
                    </div>
                  ) : null}
                  <div className="flex items-baseline justify-between gap-4">
                    <dt className="text-[#52686c]">Anstellungsart</dt>
                    <dd className="m-0 text-right font-semibold text-[#0e2a2f]">
                      {formatEmploymentType(job.employmentType)}
                    </dd>
                  </div>
                  {job.startDate ? (
                    <div className="flex items-baseline justify-between gap-4">
                      <dt className="text-[#52686c]">Eintritt</dt>
                      <dd className="m-0 text-right font-semibold text-[#0e2a2f]">
                        {job.startDate}
                      </dd>
                    </div>
                  ) : null}
                  <div className="flex items-baseline justify-between gap-4">
                    <dt className="text-[#52686c]">Stellen-ID</dt>
                    <dd className="m-0 text-right font-semibold text-[#0e2a2f]">{job.jobId}</dd>
                  </div>
                </dl>

                {isOpen ? (
                  <div className="flex flex-col gap-3">
                    <ApplyModal
                      jobId={job.jobId}
                      jobTitle={job.title}
                      intro={guide?.formIntro}
                      successMessage={guide?.successMessage}
                      className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl px-6 py-3 font-sans text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:brightness-95"
                    />
                    <a
                      href="#how-to-apply"
                      className="text-center font-sans text-xs font-semibold text-[#52686c] no-underline hover:text-[var(--color-accent)]"
                    >
                      Wie läuft die Bewerbung ab? ↓
                    </a>
                  </div>
                ) : null}
              </div>
            </aside>
          </div>
        </Container>
      </section>

      <ApplicationGuide data={guide} />

      {isOpen ? (
        <section className="py-[var(--section-y)] bg-white border-t border-black/[0.06]">
          <Container>
            <div className="contact-hub-card contact-hub-card--accent flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
              <Stack gap="2" className="max-w-xl">
                <span className="palatty-pill-eyebrow">
                  <span className="palatty-pill-dot" aria-hidden="true" />
                  Direktbewerbung
                </span>
                <h2 className="palatty-display-h2">Bereit für den nächsten Schritt?</h2>
                <p className="m-0 font-sans text-sm text-[#4f6468]">
                  Bewerben Sie sich direkt online für <strong>{job.title}</strong> ({job.jobId}) —
                  ohne langes Anschreiben, einfach Kontaktdaten angeben und Lebenslauf hochladen.
                </p>
              </Stack>
              {applyButton}
            </div>
          </Container>
        </section>
      ) : null}

      {jobPostingSchema ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: jobPostingSchema.replace(/</g, '\\u003c'),
          }}
        />
      ) : null}
    </main>
  )
}
