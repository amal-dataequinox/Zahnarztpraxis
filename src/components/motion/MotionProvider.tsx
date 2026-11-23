'use client'

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useSyncExternalStore,
  type ReactNode,
} from 'react'

const STORAGE_KEY = 'palatty-motion-paused'

type MotionContextValue = {
  reduceMotion: boolean
  userPaused: boolean
  motionPaused: boolean
  setUserPaused: (paused: boolean) => void
  togglePaused: () => void
}

const MotionContext = createContext<MotionContextValue | null>(null)

function subscribeReduce(callback: () => void) {
  const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
  mq.addEventListener('change', callback)
  return () => mq.removeEventListener('change', callback)
}

function getReduceSnapshot() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

function getReduceServerSnapshot() {
  return false
}

function subscribePause(callback: () => void) {
  window.addEventListener('palatty-motion-pause', callback)
  return () => window.removeEventListener('palatty-motion-pause', callback)
}

function getPauseSnapshot() {
  try {
    return sessionStorage.getItem(STORAGE_KEY) === '1'
  } catch {
    return false
  }
}

function getPauseServerSnapshot() {
  return false
}

export function MotionProvider({ children }: { children: ReactNode }) {
  const reduceMotion = useSyncExternalStore(
    subscribeReduce,
    getReduceSnapshot,
    getReduceServerSnapshot,
  )
  const userPaused = useSyncExternalStore(subscribePause, getPauseSnapshot, getPauseServerSnapshot)

  const setUserPaused = useCallback((paused: boolean) => {
    try {
      sessionStorage.setItem(STORAGE_KEY, paused ? '1' : '0')
    } catch {
      /* ignore */
    }
    window.dispatchEvent(new Event('palatty-motion-pause'))
  }, [])

  const togglePaused = useCallback(() => {
    setUserPaused(!getPauseSnapshot())
  }, [setUserPaused])

  const value = useMemo<MotionContextValue>(
    () => ({
      reduceMotion,
      userPaused,
      motionPaused: reduceMotion || userPaused,
      setUserPaused,
      togglePaused,
    }),
    [reduceMotion, userPaused, setUserPaused, togglePaused],
  )

  return <MotionContext.Provider value={value}>{children}</MotionContext.Provider>
}

export function useMotionPreference(): MotionContextValue {
  const ctx = useContext(MotionContext)
  if (!ctx) {
    return {
      reduceMotion: false,
      userPaused: false,
      motionPaused: false,
      setUserPaused: () => undefined,
      togglePaused: () => undefined,
    }
  }
  return ctx
}
