import Lenis from 'lenis'
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { useReducedMotion } from '../hooks/useMediaQuery'

const LenisContext = createContext<Lenis | null>(null)

export function SmoothScrollProvider({ children }: { children: ReactNode }) {
  const reduced = useReducedMotion()
  const [lenis, setLenis] = useState<Lenis | null>(null)

  useEffect(() => {
    if (reduced) return
    const instance = new Lenis({ lerp: 0.085, smoothWheel: true, wheelMultiplier: 0.9 })
    let frame = requestAnimationFrame(function loop(time) {
      instance.raf(time)
      frame = requestAnimationFrame(loop)
    })
    setLenis(instance)
    return () => {
      cancelAnimationFrame(frame)
      instance.destroy()
      setLenis(null)
    }
  }, [reduced])

  return <LenisContext.Provider value={lenis}>{children}</LenisContext.Provider>
}

export const useLenis = () => useContext(LenisContext)

const easeInOutQuart = (t: number) => (t < 0.5 ? 8 * t ** 4 : 1 - (-2 * t + 2) ** 4 / 2)

export function scrollToTarget(lenis: Lenis | null, target: string | HTMLElement | number, immediate = false) {
  const el = typeof target === 'string' ? document.querySelector<HTMLElement>(target) : target
  if (el === null) return
  if (lenis) {
    const run = () => lenis.scrollTo(el, { immediate, duration: 1.8, easing: easeInOutQuart, force: true })
    // An overlay (e.g. the mobile menu) may be releasing its scroll lock; Lenis's
    // start() resets any animation in flight, so wait for the lock to lift first.
    if (lenis.isStopped) {
      const started = performance.now()
      const wait = () => (!lenis.isStopped || performance.now() - started > 1200 ? run() : requestAnimationFrame(wait))
      requestAnimationFrame(wait)
    } else run()
    return
  }
  const behavior: ScrollBehavior = immediate ? 'auto' : 'smooth'
  if (typeof el === 'number') window.scrollTo({ top: el, behavior })
  else el.scrollIntoView({ behavior })
}

/** Freezes page scrolling (smooth and native) while any overlay is open. */
let locks = 0

export function useScrollLock(locked: boolean) {
  const lenis = useLenis()
  useEffect(() => {
    if (!locked) return
    const html = document.documentElement
    if (locks++ === 0) {
      const gap = window.innerWidth - html.clientWidth
      lenis?.stop()
      html.style.overflow = 'hidden'
      if (gap > 0) html.style.paddingRight = `${gap}px`
    }
    return () => {
      if (--locks === 0) {
        html.style.overflow = ''
        html.style.paddingRight = ''
        lenis?.start()
      }
    }
  }, [locked, lenis])
}
