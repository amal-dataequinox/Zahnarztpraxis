import Image from 'next/image'
import Link from 'next/link'
import React, { type ReactNode } from 'react'

import { HeroEntrance } from '@/components/motion/HeroEntrance'
import { Container, Stack } from '@/design-system'
import { cn } from '@/design-system/lib/cn'

type PageHeroBandProps = {
  eyebrow: string
  breadcrumbHref?: string
  breadcrumbLabel?: string
  title: string
  titleHighlight?: string
  lead?: string
  mediaSrc?: string | null
  mediaAlt?: string | null
  children?: ReactNode
}

export function PageHeroBand({
  eyebrow,
  breadcrumbHref,
  breadcrumbLabel,
  title,
  titleHighlight,
  lead,
  mediaSrc,
  mediaAlt,
  children,
}: PageHeroBandProps) {
  return (
    <section className="page-hero-band">
      <Container>
        <div
          className={cn(
            'page-hero-grid',
            mediaSrc && 'page-hero-grid--with-media',
          )}
        >
          <HeroEntrance>
            <Stack gap="4" className="max-w-2xl">
              <div data-ax-enter="label" className="flex flex-wrap items-center gap-2">
                {breadcrumbHref && breadcrumbLabel ? (
                  <Link
                    href={breadcrumbHref}
                    prefetch={breadcrumbHref.startsWith('/') ? true : undefined}
                    className="palatty-pill-eyebrow no-underline hover:opacity-80"
                  >
                    <span className="palatty-pill-dot" aria-hidden="true" />
                    <span>← {breadcrumbLabel}</span>
                  </Link>
                ) : (
                  <span className="palatty-pill-eyebrow">
                    <span className="palatty-pill-dot" aria-hidden="true" />
                    <span>{eyebrow}</span>
                  </span>
                )}
              </div>

              <div data-ax-enter="heading">
                <h1 className="page-hero-h1">
                  {title}
                  {titleHighlight ? (
                    <>
                      <br />
                      <span className="palatty-display-accent">{titleHighlight}</span>
                    </>
                  ) : null}
                </h1>
              </div>

              {lead ? (
                <div data-ax-enter="lead">
                  <p className="page-hero-lead">{lead}</p>
                </div>
              ) : null}

              {children ? (
                <div data-ax-enter="cta" className="pt-2">
                  {children}
                </div>
              ) : null}
            </Stack>
          </HeroEntrance>

          {mediaSrc ? (
            <div className="page-hero-media-frame">
              <Image
                src={mediaSrc}
                alt={mediaAlt || title}
                fill
                priority
                quality={90}
                className="object-cover object-center"
                sizes="(max-width:1024px) 100vw, 45vw"
              />
            </div>
          ) : null}
        </div>
      </Container>
    </section>
  )
}
