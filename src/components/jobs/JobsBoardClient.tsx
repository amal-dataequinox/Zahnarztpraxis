'use client'

import Link from 'next/link'
import React, { useMemo, useState } from 'react'

import { Reveal } from '@/components/motion/Reveal'
import { Container } from '@/design-system'

import { formatEmploymentType } from './labels'

export type JobBoardItem = {
  id: string | number
  title: string
  slug: string
  jobId: string
  department: string
  location: string
  workload?: string | null
  employmentType: string
  summary?: string | null
  startDate?: string | null
}

type JobsBoardClientProps = {
  initialJobs: JobBoardItem[]
  eyebrow?: string | null
  heading?: string | null
  headingHighlight?: string | null
  intro?: string | null
  showFilters?: boolean
  emptyHeading?: string | null
  emptyDescription?: string | null
}

export function JobsBoardClient({
  initialJobs,
  eyebrow = 'Offene Stellen',
  heading = 'Aktuelle',
  headingHighlight = 'Stellenangebote.',
  intro = 'Entdecken Sie unsere offenen Positionen in Appenzell und Gais — bewerben Sie sich in wenigen Minuten direkt online.',
  showFilters = true,
  emptyHeading,
  emptyDescription,
}: JobsBoardClientProps) {
  const [query, setQuery] = useState('')
  const [department, setDepartment] = useState('')
  const [location, setLocation] = useState('')

  const departments = useMemo(
    () => Array.from(new Set(initialJobs.map((j) => j.department).filter(Boolean))).sort(),
    [initialJobs],
  )

  const locations = useMemo(
    () => Array.from(new Set(initialJobs.map((j) => j.location).filter(Boolean))).sort(),
    [initialJobs],
  )

  const filteredJobs = useMemo(() => {
    const q = query.trim().toLowerCase()
    return initialJobs.filter((job) => {
      if (department && job.department !== department) return false
      if (location && job.location !== location) return false
      if (!q) return true
      return `${job.title} ${job.jobId} ${job.department} ${job.location}`.toLowerCase().includes(q)
    })
  }, [initialJobs, query, department, location])

  const clearFilters = () => {
    setQuery('')
    setDepartment('')
    setLocation('')
  }

  return (
    <section id="open-roles" className="py-[var(--section-y)] bg-white">
      <Container>
        <Reveal>
          <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <span className="palatty-pill-eyebrow mb-3">
                <span className="palatty-pill-dot" aria-hidden="true" />
                {eyebrow || 'Offene Stellen'}
              </span>
              <h2 className="palatty-display-h2">
                {heading || 'Aktuelle'}{' '}
                {headingHighlight ? (
                  <span className="palatty-display-accent">{headingHighlight}</span>
                ) : null}
              </h2>
              {intro ? (
                <p className="mt-3 mb-0 font-sans text-[1rem] leading-relaxed text-[#4f6468]">
                  {intro}
                </p>
              ) : null}
            </div>

            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-black/[0.08] bg-[#f7faf9] px-4 py-2 font-sans text-xs font-semibold uppercase tracking-[0.08em] text-[#0e2a2f]">
              <span
                className="h-2 w-2 rounded-full"
                style={{ backgroundColor: 'var(--color-accent)' }}
                aria-hidden="true"
              />
              <span aria-live="polite">
                {filteredJobs.length}{' '}
                {filteredJobs.length === 1 ? 'offene Stelle' : 'offene Stellen'}
              </span>
            </div>
          </div>
        </Reveal>

        {showFilters && initialJobs.length > 0 ? (
          <div className="mb-8 grid grid-cols-1 gap-3 rounded-2xl border border-black/[0.07] bg-[#f7faf9] p-4 sm:grid-cols-2 lg:grid-cols-12">
            <label className="flex flex-col gap-1.5 lg:col-span-6">
              <span className="font-sans text-[11px] font-semibold uppercase tracking-[0.08em] text-[#52686c]">
                Suche
              </span>
              <div className="relative flex items-center">
                <svg
                  className="pointer-events-none absolute left-3.5 h-4 w-4 text-[#52686c]"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
                <input
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Position, Fachbereich oder Stellen-ID suchen…"
                  className="min-h-11 w-full rounded-xl border border-black/[0.09] bg-white pl-10 pr-3 font-sans text-sm text-[#0e2a2f] placeholder:text-[#7c9094] focus:border-[var(--color-accent)] focus:outline-none"
                />
              </div>
            </label>

            <label className="flex flex-col gap-1.5 lg:col-span-3">
              <span className="font-sans text-[11px] font-semibold uppercase tracking-[0.08em] text-[#52686c]">
                Fachbereich
              </span>
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="min-h-11 w-full rounded-xl border border-black/[0.09] bg-white px-3 font-sans text-sm text-[#0e2a2f] focus:border-[var(--color-accent)] focus:outline-none"
              >
                <option value="">Alle Fachbereiche</option>
                {departments.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
            </label>

            <label className="flex flex-col gap-1.5 lg:col-span-3">
              <span className="font-sans text-[11px] font-semibold uppercase tracking-[0.08em] text-[#52686c]">
                Arbeitsort
              </span>
              <select
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="min-h-11 w-full rounded-xl border border-black/[0.09] bg-white px-3 font-sans text-sm text-[#0e2a2f] focus:border-[var(--color-accent)] focus:outline-none"
              >
                <option value="">Alle Standorte</option>
                {locations.map((loc) => (
                  <option key={loc} value={loc}>
                    {loc}
                  </option>
                ))}
              </select>
            </label>
          </div>
        ) : null}

        {filteredJobs.length > 0 ? (
          <div className="grid grid-cols-1 gap-5">
            {filteredJobs.map((job) => (
              <Link
                key={job.id}
                href={`/jobs/${job.slug}`}
                prefetch={true}
                className="contact-hub-card group flex flex-col justify-between gap-5 no-underline transition-all duration-300 hover:-translate-y-0.5 hover:border-[var(--color-accent)]/35 md:flex-row md:items-center"
              >
                <div className="flex flex-col gap-2.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="care-pillar-eyebrow">{job.department}</span>
                    <span className="rounded-full border border-black/[0.08] bg-[#f7faf9] px-2.5 py-0.5 font-sans text-[11px] font-medium text-[#52686c]">
                      {job.jobId}
                    </span>
                  </div>

                  <h3 className="m-0 font-display text-xl sm:text-2xl font-semibold tracking-tight text-[#0e2a2f] group-hover:text-[var(--color-accent)] transition-colors">
                    {job.title}
                  </h3>

                  {job.summary ? (
                    <p className="m-0 max-w-3xl font-sans text-sm leading-relaxed text-[#4f6468]">
                      {job.summary}
                    </p>
                  ) : null}

                  <div className="flex flex-wrap items-center gap-x-5 gap-y-2 pt-1 font-sans text-xs font-medium text-[#4f6468]">
                    <span className="inline-flex items-center gap-1.5">
                      <svg
                        className="h-4 w-4 text-[var(--color-accent)]"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      >
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                        <circle cx="12" cy="10" r="3" />
                      </svg>
                      {job.location}
                    </span>

                    {job.workload ? (
                      <span className="inline-flex items-center gap-1.5">
                        <svg
                          className="h-4 w-4 text-[var(--color-accent)]"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          viewBox="0 0 24 24"
                          aria-hidden="true"
                        >
                          <circle cx="12" cy="12" r="10" />
                          <polyline points="12 6 12 12 16 14" />
                        </svg>
                        Pensum {job.workload}
                      </span>
                    ) : null}

                    <span>{formatEmploymentType(job.employmentType)}</span>

                    {job.startDate ? <span>Eintritt: {job.startDate}</span> : null}
                  </div>
                </div>

                <div className="shrink-0">
                  <span className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-[var(--color-accent)]/10 px-5 py-2.5 font-sans text-sm font-semibold text-[var(--color-accent)] transition-colors group-hover:bg-[var(--color-accent)] group-hover:text-white">
                    <span>Stelle ansehen & bewerben</span>
                    <span aria-hidden="true">↗</span>
                  </span>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="contact-hub-card flex flex-col items-start gap-3">
            <h3 className="m-0 font-display text-xl font-semibold text-[#0e2a2f]">
              {initialJobs.length > 0
                ? 'Keine passenden Stellen für diese Filter.'
                : emptyHeading || 'Aktuell sind alle Positionen besetzt.'}
            </h3>
            <p className="m-0 max-w-xl font-sans text-sm leading-relaxed text-[#52686c]">
              {initialJobs.length > 0
                ? 'Passen Sie Suchbegriff, Fachbereich oder Arbeitsort an, um alle offenen Stellen anzuzeigen.'
                : emptyDescription ||
                  'Wir freuen uns dennoch jederzeit über Ihre Spontanbewerbung an unser Praxisteam.'}
            </p>
            {initialJobs.length > 0 ? (
              <button
                type="button"
                onClick={clearFilters}
                className="mt-1 inline-flex min-h-10 items-center rounded-xl border border-black/15 bg-white px-4 font-sans text-sm font-semibold text-[#0e2a2f] hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]"
              >
                Filter zurücksetzen
              </button>
            ) : null}
          </div>
        )}
      </Container>
    </section>
  )
}
