import type { Metadata } from 'next'
import { IBM_Plex_Sans } from 'next/font/google'
import React from 'react'

import { SkipLink } from '@/design-system'
import { cn } from '@/design-system/lib/cn'

import './styles.css'

const ibmPlexSans = IBM_Plex_Sans({
  subsets: ['latin', 'latin-ext'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-ibm-plex-sans',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'Zahnarztpraxis Palatty',
    template: '%s | Zahnarztpraxis Palatty',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de" className={cn(ibmPlexSans.variable)} suppressHydrationWarning>
      <body>
        <SkipLink />
        {children}
      </body>
    </html>
  )
}
