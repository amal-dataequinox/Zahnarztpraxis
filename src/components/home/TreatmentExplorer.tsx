'use client'

import Link from 'next/link'
import { useId, useState } from 'react'

import { Reveal } from '@/components/motion/Reveal'
import { cn } from '@/design-system/lib/cn'
import type { Service } from '@/payload-types'

type TreatmentItem = Pick<Service, 'id' | 'name' | 'slug' | 'shortDescription'>

type TreatmentExplorerProps = {
  services: TreatmentItem[]
  className?: string
}

/**
 * Editorial expandable treatment list — Dairy Food explorer energy,
 * Schriftbau hairlines. CMS names + shortDescription only; no medical claims.
 */
export function TreatmentExplorer({ services, className }: TreatmentExplorerProps) {
  const baseId = useId()
  const [openId, setOpenId] = useState<number | null>(null)

  if (services.length === 0) {
    return (
      <p className="m-0 font-sans text-[length:var(--text-base)] text-[var(--palatty-slate)]">
        Leistungen folgen nach CMS-Pflege.
      </p>
    )
  }

  return (
    <Reveal variant="stagger" className={cn('min-w-0', className)} delayMs={80}>
      <ul className="m-0 list-none p-0">
        {services.map((service, index) => {
          const open = openId === service.id
          const panelId = `${baseId}-panel-${service.id}`
          const buttonId = `${baseId}-btn-${service.id}`
          const hasSummary = Boolean(service.shortDescription?.trim())

          return (
            <li
              key={service.id}
              className="appenzell-reveal-item appenzell-service-row border-b border-[var(--color-border-strong)]"
            >
              <div className="grid grid-cols-[2.5rem_minmax(0,1fr)] items-baseline gap-x-3 py-5 sm:grid-cols-[3rem_minmax(0,1fr)_auto] sm:gap-4">
                <span className="font-sans text-[length:var(--text-sm)] tabular-nums text-[var(--palatty-slate)]">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <div className="min-w-0">
                  {hasSummary ? (
                    <button
                      type="button"
                      id={buttonId}
                      className="m-0 w-full cursor-pointer border-0 bg-transparent p-0 text-left font-sans text-[length:var(--text-lg)] font-medium tracking-[var(--tracking-tight)] text-[var(--palatty-ink)] transition-colors duration-[var(--duration-fast)] hover:text-[var(--palatty-cyan-deep)] focus-visible:outline-none focus-visible:shadow-[var(--focus-ring)]"
                      aria-expanded={open}
                      aria-controls={panelId}
                      onClick={() => setOpenId(open ? null : service.id)}
                    >
                      {service.name}
                      <span
                        className="ml-2 inline-block text-[length:var(--text-sm)] text-[var(--palatty-slate)]"
                        aria-hidden
                      >
                        {open ? '−' : '+'}
                      </span>
                    </button>
                  ) : (
                    <p className="m-0 break-words font-sans text-[length:var(--text-lg)] font-medium tracking-[var(--tracking-tight)] text-[var(--palatty-ink)]">
                      {service.name}
                    </p>
                  )}
                  {hasSummary ? (
                    <div
                      id={panelId}
                      role="region"
                      aria-labelledby={buttonId}
                      className={cn(
                        'grid transition-[grid-template-rows] duration-300 ease-[var(--ease-out)]',
                        open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]',
                      )}
                    >
                      <div className="overflow-hidden">
                        <p className="mt-2 m-0 max-w-[var(--measure-prose)] break-words font-sans text-[length:var(--text-sm)] text-[var(--palatty-slate)]">
                          {service.shortDescription}
                        </p>
                      </div>
                    </div>
                  ) : null}
                  <Link
                    href={`/leistungen/${service.slug}`}
                    className="mt-2 inline-flex min-h-11 items-center font-sans text-[length:var(--text-sm)] font-medium text-[var(--palatty-cyan-deep)] no-underline underline-offset-[0.18em] transition-colors hover:underline sm:hidden"
                  >
                    Mehr <span className="appenzell-link-arrow" aria-hidden>→</span>
                  </Link>
                </div>
                <Link
                  href={`/leistungen/${service.slug}`}
                  className="hidden min-h-11 shrink-0 items-center font-sans text-[length:var(--text-sm)] font-medium text-[var(--palatty-cyan-deep)] no-underline underline-offset-[0.18em] transition-colors hover:underline sm:inline-flex"
                >
                  Mehr <span className="appenzell-link-arrow" aria-hidden>→</span>
                </Link>
              </div>
            </li>
          )
        })}
      </ul>
    </Reveal>
  )
}
