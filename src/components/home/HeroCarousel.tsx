import { useEffect, useRef, useState, type ReactNode } from 'react'
import { useReducedMotion } from '../../hooks/useMediaQuery'
import { Hero } from './Hero'
import { HeroPathway, HeroWalls } from './HeroSeries'

/** How long each frame holds before the next slides in. */
const HOLD_MS = 5000

const SLIDES: { label: string; node: ReactNode }[] = [
  { label: 'Pavers', node: <Hero /> },
  { label: 'Wall tiles', node: <HeroWalls /> },
  { label: 'Pavers series 2', node: <HeroPathway /> },
]

/**
 * The campaign frames side by side, sliding on a timer. The timer holds
 * while the pointer or focus is on the frames or the tab is in the
 * background. Phones can swipe. With reduced motion nothing advances on its own.
 */
export function HeroCarousel() {
  const reduced = useReducedMotion()
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const touchX = useRef<number | null>(null)
  const count = SLIDES.length

  const go = (i: number) => setIndex((i + count) % count)

  // The next frame slides in once the current one has held.
  useEffect(() => {
    if (paused || reduced) return
    const id = window.setTimeout(() => setIndex((i) => (i + 1) % count), HOLD_MS)
    return () => window.clearTimeout(id)
  }, [index, paused, reduced, count])

  // Hold still while the tab is in the background.
  useEffect(() => {
    const onVisibility = () => setPaused(document.hidden)
    document.addEventListener('visibilitychange', onVisibility)
    return () => document.removeEventListener('visibilitychange', onVisibility)
  }, [])

  return (
    <section
      aria-roledescription="carousel"
      aria-label="Classic Hyderabad collections"
      className="relative overflow-hidden bg-navy-950"
      onPointerEnter={(e) => e.pointerType === 'mouse' && setPaused(true)}
      onPointerLeave={(e) => e.pointerType === 'mouse' && setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={(e) => !e.currentTarget.contains(e.relatedTarget) && setPaused(false)}
      onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
      onTouchEnd={(e) => {
        if (touchX.current === null) return
        const dx = e.changedTouches[0].clientX - touchX.current
        touchX.current = null
        if (Math.abs(dx) > 50) go(index + (dx < 0 ? 1 : -1))
      }}
    >
      <div
        className="flex transition-transform duration-[1200ms] ease-[var(--ease-luxe)]"
        style={{ transform: `translate3d(${-index * 100}%, 0, 0)` }}
      >
        {SLIDES.map((s, i) => (
          <div
            key={s.label}
            role="group"
            aria-roledescription="slide"
            aria-label={`${i + 1} of ${count}: ${s.label}`}
            aria-hidden={i !== index}
            inert={i !== index}
            className="w-full shrink-0"
          >
            {s.node}
          </div>
        ))}
      </div>

    </section>
  )
}
