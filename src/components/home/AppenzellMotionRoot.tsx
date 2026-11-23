'use client'

import type { ReactNode } from 'react'

import { AlpineScrollBridge } from '@/components/motion/AlpineScrollBridge'
import { MotionControl } from '@/components/motion/MotionControl'
import { MotionProvider } from '@/components/motion/MotionProvider'

/**
 * Client shell for Appenzell homepage motion: provider, scroll bridge, control.
 */
export function AppenzellMotionRoot({ children }: { children: ReactNode }) {
  return (
    <MotionProvider>
      <div className="appenzell-home">
        {children}
        <AlpineScrollBridge nextId="praxis" />
        <MotionControl />
      </div>
    </MotionProvider>
  )
}
