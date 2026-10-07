import { useEffect, useRef, useState } from 'react'
import { useReducedMotion } from '../../hooks/useMediaQuery'

/**
 * Counts from 0 up to `value` the first time it scrolls into view. The
 * figures are tabular, so the width holds steady while they change; screen
 * readers get the final value only.
 */
export function CountUp({ value, duration = 1600 }: { value: number; duration?: number }) {
  const reduced = useReducedMotion()
  const el = useRef<HTMLSpanElement>(null)
  const [shown, setShown] = useState(reduced ? value : 0)

  useEffect(() => {
    if (reduced) {
      setShown(value)
      return
    }
    const node = el.current
    if (!node) return
    let frame = 0
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        io.disconnect()
        const start = performance.now()
        const tick = (now: number) => {
          const t = Math.min(1, (now - start) / duration)
          setShown(Math.round(value * (1 - (1 - t) ** 4)))
          if (t < 1) frame = requestAnimationFrame(tick)
        }
        frame = requestAnimationFrame(tick)
      },
      { threshold: 0.4 },
    )
    io.observe(node)
    return () => {
      io.disconnect()
      cancelAnimationFrame(frame)
    }
  }, [value, duration, reduced])

  return (
    <>
      <span ref={el} aria-hidden="true">
        {shown}
      </span>
      <span className="sr-only">{value}</span>
    </>
  )
}

/**
 * A word that rolls to the next in `words` every `interval` ms, each rising
 * out of a mask. Screen readers, and visitors who prefer reduced motion, get
 * the first word only.
 */
export function RotatingWord({ words, interval = 2600 }: { words: string[]; interval?: number }) {
  const reduced = useReducedMotion()
  const [i, setI] = useState(0)

  useEffect(() => {
    if (reduced || words.length < 2) return
    const id = setInterval(() => setI((n) => (n + 1) % words.length), interval)
    return () => clearInterval(id)
  }, [reduced, words.length, interval])

  return (
    <>
      <span aria-hidden="true" className="relative inline-grid overflow-hidden pb-[0.08em] align-bottom">
        {words.map((w, n) => (
          <span
            key={w}
            className={`col-start-1 row-start-1 transition-[transform,opacity] duration-[900ms] ease-[var(--ease-luxe)] ${
              n === i
                ? 'translate-y-0 opacity-100'
                : n === (i - 1 + words.length) % words.length
                  ? '-translate-y-full opacity-0'
                  : 'translate-y-full opacity-0'
            }`}
          >
            {w}
          </span>
        ))}
      </span>
      <span className="sr-only">{words[0]}</span>
    </>
  )
}
