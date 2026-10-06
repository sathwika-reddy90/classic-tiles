import { useEffect, useRef, type RefObject } from 'react'
import { useReducedMotion } from './useMediaQuery'

/**
 * Calls `cb` at most once per animation frame while the page scrolls or
 * resizes. Lenis drives native scrolling, so the window scroll event covers
 * both smooth and native modes. Callbacks write to the DOM directly — no
 * React re-render on scroll.
 */
export function useScrollFrame(cb: (scrollY: number) => void, enabled = true) {
  const cbRef = useRef(cb)
  useEffect(() => {
    cbRef.current = cb
  })

  useEffect(() => {
    if (!enabled) return
    let frame = 0
    const run = () => {
      frame = 0
      cbRef.current(window.scrollY)
    }
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(run)
    }
    run()
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
    }
  }, [enabled])
}

/**
 * Drifts `target` vertically as its `frame` crosses the viewport.
 * `strength` is the travel in percent of the frame height at the extremes.
 */
export function useParallax(
  frame: RefObject<HTMLElement | null>,
  target: RefObject<HTMLElement | null>,
  strength = 8,
) {
  const reduced = useReducedMotion()
  useScrollFrame(() => {
    const f = frame.current
    const t = target.current
    if (!f || !t) return
    const r = f.getBoundingClientRect()
    const vh = window.innerHeight
    if (r.bottom < -100 || r.top > vh + 100) return
    const progress = (r.top + r.height / 2 - vh / 2) / (vh / 2 + r.height / 2)
    t.style.transform = `translate3d(0, ${(-progress * strength).toFixed(3)}%, 0)`
  }, !reduced)
}
