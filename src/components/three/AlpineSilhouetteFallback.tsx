import React from 'react'

import { cn } from '@/design-system/lib/cn'

import { ALPINE_SCENE, ALPINE_SKY } from './alpinePalette'

type AlpineSilhouetteFallbackProps = {
  className?: string
}

/**
 * Static SVG fallback — same soft Appenzell art direction as WebGL.
 */
export function AlpineSilhouetteFallback({ className }: AlpineSilhouetteFallbackProps) {
  return (
    <div
      className={cn('absolute inset-0 h-full w-full overflow-hidden', className)}
      aria-hidden
      style={{
        background: `linear-gradient(180deg, ${ALPINE_SKY.top} 0%, ${ALPINE_SKY.mid} 36%, ${ALPINE_SKY.horizon} 68%, ${ALPINE_SCENE.meadow} 100%)`,
      }}
    >
      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 1440 900"
        preserveAspectRatio="xMidYMid slice"
        role="presentation"
      >
        <defs>
          <linearGradient id="alpine-sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={ALPINE_SKY.top} />
            <stop offset="42%" stopColor={ALPINE_SKY.mid} />
            <stop offset="74%" stopColor={ALPINE_SKY.horizon} />
            <stop offset="100%" stopColor={ALPINE_SCENE.meadow} />
          </linearGradient>
          <linearGradient id="alpine-mist" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={ALPINE_SCENE.mist} stopOpacity="0" />
            <stop offset="55%" stopColor={ALPINE_SCENE.mist} stopOpacity="0.2" />
            <stop offset="100%" stopColor={ALPINE_SCENE.mist} stopOpacity="0" />
          </linearGradient>
        </defs>

        <rect width="1440" height="900" fill="url(#alpine-sky)" />

        <path
          fill={ALPINE_SCENE.distant}
          d="M0 400 C110 370 200 310 310 295 C430 278 520 340 620 285 C730 225 820 270 930 250 C1050 228 1170 290 1290 320 C1365 340 1415 365 1440 375 L1440 900 L0 900 Z"
        />
        <path
          fill={ALPINE_SCENE.far}
          d="M0 455 C150 425 260 385 380 375 C500 365 590 415 710 375 C830 340 940 375 1060 355 C1180 338 1300 385 1440 415 L1440 900 L0 900 Z"
        />
        <path
          fill={ALPINE_SCENE.mid}
          d="M0 520 C170 495 290 460 420 472 C550 484 650 445 790 462 C920 476 1040 445 1180 468 C1290 485 1370 510 1440 522 L1440 900 L0 900 Z"
        />
        <path
          fill={ALPINE_SCENE.near}
          opacity={0.95}
          d="M0 585 C190 560 310 540 450 552 C590 564 710 530 850 548 C990 565 1130 535 1280 558 C1355 570 1405 585 1440 592 L1440 900 L0 900 Z"
        />
        <path
          fill={ALPINE_SCENE.meadow}
          d="M0 670 C240 645 460 662 700 642 C940 622 1160 655 1440 648 L1440 900 L0 900 Z"
        />
        <path
          fill={ALPINE_SCENE.meadowDeep}
          opacity={0.9}
          d="M0 725 C280 705 540 720 820 702 C1080 686 1260 715 1440 710 L1440 900 L0 900 Z"
        />

        <rect x="0" y="430" width="1440" height="180" fill="url(#alpine-mist)" />

        <g fill={ALPINE_SCENE.detail} opacity={0.88}>
          <path d="M165 690 L185 625 L205 690 Z" />
          <path d="M205 698 L228 628 L251 698 Z" />
          <path d="M250 705 L265 655 L280 705 Z" />
          <rect x="180" y="688" width="6" height="18" fill={ALPINE_SCENE.wood} />
          <rect x="222" y="695" width="7" height="18" fill={ALPINE_SCENE.wood} />
          <rect x="260" y="702" width="5" height="14" fill={ALPINE_SCENE.wood} />
        </g>

        <g fill={ALPINE_SCENE.detail} opacity={0.82}>
          <path d="M1175 685 L1198 618 L1221 685 Z" />
          <path d="M1228 695 L1244 648 L1260 695 Z" />
          <rect x="1193" y="682" width="7" height="18" fill={ALPINE_SCENE.wood} />
          <rect x="1238" y="692" width="5" height="14" fill={ALPINE_SCENE.wood} />
        </g>

        <g transform="translate(990 628)">
          <rect x="0" y="20" width="40" height="24" fill={ALPINE_SCENE.chalk} />
          <polygon points="-6,20 20,0 46,20" fill={ALPINE_SCENE.roof} />
          <rect x="40" y="26" width="16" height="18" fill={ALPINE_SCENE.wood} />
        </g>

        <g fill={ALPINE_SCENE.detail} opacity={0.65}>
          <ellipse cx="510" cy="715" rx="10" ry="5" />
          <ellipse cx="555" cy="720" rx="8" ry="4" />
          <ellipse cx="790" cy="712" rx="9" ry="4.5" />
        </g>
      </svg>

      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(105deg,color-mix(in_oklab,var(--palatty-paper)_70%,transparent)_0%,color-mix(in_oklab,var(--palatty-paper)_24%,transparent)_40%,transparent_66%)]" />
    </div>
  )
}
