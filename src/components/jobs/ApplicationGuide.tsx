import React from 'react'

import { Reveal } from '@/components/motion/Reveal'
import { Container } from '@/design-system'
import type { JobBoardConfig } from '@/payload-types'

type GuideConfig = JobBoardConfig['applicationGuide']

const DEFAULT_STEPS = [
  {
    id: 'step-1',
    title: 'Bewerbung online einreichen',
    description:
      'Senden Sie uns Ihre Kontaktdaten und Ihren Lebenslauf direkt über das Online-Formular bei der gewünschten Stelle.',
  },
  {
    id: 'step-2',
    title: 'Persönliche Rückmeldung',
    description:
      'Unser Praxisteam prüft Ihre Unterlagen sorgfältig und meldet sich innerhalb weniger Arbeitstage telefonisch oder per E-Mail.',
  },
  {
    id: 'step-3',
    title: 'Kennenlernen in der Praxis',
    description:
      'Bei einem persönlichen Gespräch und optionalen kurzen Einblick in unsere Praxis lernen Sie Team, Räume und Abläufe direkt kennen.',
  },
]

export function ApplicationGuide({
  data,
  showWhenEmpty = true,
}: {
  data?: GuideConfig | null
  showWhenEmpty?: boolean
}) {
  const steps = data?.steps && data.steps.length > 0 ? data.steps : showWhenEmpty ? DEFAULT_STEPS : []
  if (steps.length === 0) return null

  const heading = data?.heading || 'Ihr unkomplizierter Weg ins Team.'
  const description =
    data?.description ||
    'Von Ihrer Online-Bewerbung bis zum persönlichen Gespräch — transparent, direkt und ohne Umwege.'

  return (
    <section id="how-to-apply" className="py-[var(--section-y)] bg-[#f7faf9] border-t border-black/[0.06]">
      <Container>
        <Reveal>
          <div className="mb-10 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <span className="palatty-pill-eyebrow mb-3">
                <span className="palatty-pill-dot" aria-hidden="true" />
                Bewerbungsablauf
              </span>
              <h2 className="palatty-display-h2">{heading}</h2>
            </div>
            <p className="m-0 max-w-md font-sans text-[0.98rem] leading-relaxed text-[#4f6468]">
              {description}
            </p>
          </div>
        </Reveal>

        <Reveal variant="stagger">
          <ol className="m-0 grid list-none grid-cols-1 gap-6 p-0 md:grid-cols-3">
            {steps.map((step, index) => (
              <li
                key={step.id || `${step.title}-${index}`}
                className="appenzell-reveal-item contact-hub-card flex flex-col gap-3"
              >
                <span className="care-pillar-eyebrow">
                  {String(index + 1).padStart(2, '0')} / SCHRITT
                </span>
                <h3 className="m-0 font-display text-xl font-semibold text-[#0e2a2f]">
                  {step.title}
                </h3>
                <p className="m-0 font-sans text-sm leading-relaxed text-[#52686c]">
                  {step.description}
                </p>
              </li>
            ))}
          </ol>
        </Reveal>
      </Container>
    </section>
  )
}
