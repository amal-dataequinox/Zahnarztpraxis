import type { Metadata } from 'next'
import { Manrope, Newsreader } from 'next/font/google'
import React from 'react'

import { SkipLink } from '@/design-system'
import { cn } from '@/design-system/lib/cn'

import './styles.css'

const manrope = Manrope({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-manrope',
  display: 'swap',
})

const newsreader = Newsreader({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-newsreader',
  display: 'swap',
  style: ['normal', 'italic'],
})

export const metadata: Metadata = {
  title: {
    default: 'Zahnarztpraxis Palatty',
    template: '%s | Zahnarztpraxis Palatty',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de" className={cn(manrope.variable, newsreader.variable)}>
      <body>
        <SkipLink />
        {children}
      </body>
    </html>
  )
}
