'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useId, useState } from 'react'

import { Reveal } from '@/components/motion/Reveal'
import { cn } from '@/design-system/lib/cn'
import type { Service } from '@/payload-types'
import { isMedia, toSiteImageSrc } from '@/utilities/media'

type TreatmentItem = Pick<Service, 'id' | 'name' | 'slug' | 'shortDescription' | 'featuredImage'>

type TreatmentExplorerProps = {
  services: TreatmentItem[]
  fallbackImageSrc?: string | null
  className?: string
}

/**
 * Interactive Treatment Explorer paired with a live sticky featured preview card on desktop.
 */
export function TreatmentExplorer({
  services,
  fallbackImageSrc,
  className,
}: TreatmentExplorerProps) {
  const baseId = useId()
  const [activeIndex, setActiveIndex] = useState<number>(0)

  if (services.length === 0) {
    return (
      <p className="m-0 font-sans text-[length:var(--text-base)] text-[#546b6f]">
        Leistungen folgen nach CMS-Pflege.
      </p>
    )
  }

  const activeService = services[activeIndex] ?? services[0]
  const activeImgSrc = isMedia(activeService?.featuredImage)
    ? toSiteImageSrc(activeService.featuredImage.sizes?.card?.url || activeService.featuredImage.url)
    : fallbackImageSrc || null

  return (
    <Reveal variant="stagger" className={cn('min-w-0', className)} delayMs={60}>
      <div className="treatment-explorer-grid">
        <ul className="treatment-accordion-list">
          {services.map((service, index) => {
            const open = activeIndex === index
            const panelId = `${baseId}-panel-${service.id}`
            const buttonId = `${baseId}-btn-${service.id}`
            const hasSummary = Boolean(service.shortDescription?.trim())

            return (
              <li
                key={service.id}
                onMouseEnter={() => setActiveIndex(index)}
                className={cn(
                  'appenzell-reveal-item treatment-row-card',
                  open && 'treatment-row-card--open',
                )}
              >
                <div className="flex items-start gap-4">
                  <span className="treatment-row-index">
                    {String(index + 1).padStart(2, '0')}
                  </span>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-3">
                      {hasSummary ? (
                        <button
                          type="button"
                          id={buttonId}
                          aria-expanded={open}
                          aria-controls={panelId}
                          onClick={() => setActiveIndex(index)}
                          className="m-0 flex-1 cursor-pointer border-0 bg-transparent p-0 text-left font-sans text-[1.0625rem] font-semibold tracking-[-0.015em] text-[#0e2a2f] transition-colors hover:text-[var(--color-accent)] focus-visible:outline-none"
                        >
                          {service.name}
                        </button>
                      ) : (
                        <Link
                          href={`/leistungen/${service.slug}`}
                          prefetch={true}
                          className="flex-1 font-sans text-[1.0625rem] font-semibold tracking-[-0.015em] text-[#0e2a2f] no-underline transition-colors hover:text-[var(--color-accent)]"
                        >
                          {service.name}
                        </Link>
                      )}

                      <Link
                        href={`/leistungen/${service.slug}`}
                        prefetch={true}
                        aria-label={`${service.name} ansehen`}
                        className="inline-flex shrink-0 items-center gap-1 rounded-full px-3 py-1 font-sans text-xs font-semibold text-[#0e2a2f] bg-black/[0.04] hover:bg-[var(--color-accent)] hover:text-white transition-all no-underline"
                      >
                        <span>Details</span>
                        <span aria-hidden="true">→</span>
                      </Link>
                    </div>

                    {hasSummary ? (
                      <div
                        id={panelId}
                        role="region"
                        aria-labelledby={buttonId}
                        className={cn(
                          'grid transition-[grid-template-rows] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]',
                          open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]',
                        )}
                      >
                        <div className="overflow-hidden">
                          <p className="mt-2.5 mb-0 font-sans text-[0.875rem] leading-relaxed text-[#52686c]">
                            {service.shortDescription}
                          </p>
                        </div>
                      </div>
                    ) : null}
                  </div>
                </div>
              </li>
            )
          })}
        </ul>

        {activeService ? (
          <div className="treatment-preview-sticky">
            <div className="treatment-preview-panel">
              {activeImgSrc ? (
                <div className="treatment-preview-media">
                  <Image
                    key={activeService.slug}
                    src={activeImgSrc}
                    alt={activeService.name}
                    fill
                    quality={88}
                    className="object-cover object-center transition-opacity duration-500"
                    sizes="420px"
                  />
                  <div
                    className="pointer-events-none absolute inset-0"
                    style={{
                      background:
                        'linear-gradient(180deg, transparent 55%, rgba(10, 30, 35, 0.35) 100%)',
                    }}
                  />
                  <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 font-sans text-[11px] font-semibold uppercase tracking-[0.12em] text-[#0e2a2f] backdrop-blur-md">
                    {String(activeIndex + 1).padStart(2, '0')} · Fokus
                  </span>
                </div>
              ) : null}

              <div className="treatment-preview-body">
                <h3 className="m-0 font-display text-[1.35rem] font-semibold tracking-[-0.02em] text-[#0e2a2f]">
                  {activeService.name}
                </h3>
                <p className="mt-2 mb-5 font-sans text-[0.9rem] leading-relaxed text-[#52686c]">
                  {activeService.shortDescription ||
                    'Individuelle Beratung und schonende Behandlung in unserer Praxis.'}
                </p>
                <Link
                  href={`/leistungen/${activeService.slug}`}
                  prefetch={true}
                  className="praxis-cta-btn w-full justify-between"
                >
                  <span>Mehr zu {activeService.name}</span>
                  <span aria-hidden="true">→</span>
                </Link>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </Reveal>
  )
}
