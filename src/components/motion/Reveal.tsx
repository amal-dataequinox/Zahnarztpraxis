'use client'

import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useRef, useState, type ReactNode } from 'react'

import { useMotionPreference } from '@/components/motion/MotionProvider'
import { useGsapContext } from '@/components/motion/useGsapContext'
import { cn } from '@/design-system/lib/cn'

gsap.registerPlugin(ScrollTrigger)

type RevealProps = {
  children: ReactNode
  className?: string
  variant?: 'up' | 'image' | 'stagger' | 'mask'
  delayMs?: number
  as?: 'div' | 'section' | 'article'
}

/**
 * One-shot ScrollTrigger reveal. Never re-plays on scroll up.
 * Uses immediateRender:false so elements aren't stuck at opacity 0 after cleanup.
 */
export function Reveal({
  children,
  className,
  variant = 'up',
  delayMs = 0,
  as: Tag = 'div',
}: RevealProps) {
  const ref = useRef<HTMLElement | null>(null)
  const { reduceMotion } = useMotionPreference()
  const [shown, setShown] = useState(false)

  useGsapContext(
    ref,
    () => {
      const node = ref.current
      if (!node || reduceMotion) return

      const markShown = () => setShown(true)
      const delay = delayMs / 1000

      if (variant === 'stagger') {
        const items = node.querySelectorAll<HTMLElement>('.appenzell-reveal-item')
        if (!items.length) return
        gsap.fromTo(
          items,
          { opacity: 0, y: 10, scale: 0.97 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.5,
            ease: 'power2.out',
            stagger: 0.12,
            delay,
            immediateRender: false,
            scrollTrigger: {
              trigger: node,
              start: 'top 82%',
              once: true,
              onEnter: markShown,
            },
          },
        )
        return
      }

      if (variant === 'image' || variant === 'mask') {
        gsap.fromTo(
          node,
          {
            opacity: 0,
            ...(variant === 'mask' ? { clipPath: 'inset(8% 0% 8% 0%)' } : {}),
          },
          {
            opacity: 1,
            clipPath: variant === 'mask' ? 'inset(0% 0% 0% 0%)' : undefined,
            duration: 0.9,
            ease: 'power1.inOut',
            delay,
            immediateRender: false,
            scrollTrigger: {
              trigger: node,
              start: 'top 82%',
              once: true,
              onEnter: markShown,
            },
          },
        )
        return
      }

      gsap.fromTo(
        node,
        { opacity: 0, y: 12 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          ease: 'power2.out',
          delay,
          immediateRender: false,
          scrollTrigger: {
            trigger: node,
            start: 'top 82%',
            once: true,
            onEnter: markShown,
          },
        },
      )
    },
    [reduceMotion, variant, delayMs],
  )

  return (
    <Tag
      ref={ref as never}
      className={cn(
        'appenzell-reveal',
        variant === 'image' && 'appenzell-reveal--image',
        variant === 'mask' && 'appenzell-reveal--mask',
        variant === 'stagger' && 'appenzell-reveal--stagger',
        (reduceMotion || shown) && 'is-visible',
        className,
      )}
    >
      {children}
    </Tag>
  )
}
