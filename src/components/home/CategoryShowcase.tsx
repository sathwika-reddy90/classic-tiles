import { useLayoutEffect, useRef, useState, type FocusEvent } from 'react'
import { chapters } from '../../data/collections'
import { productsIn } from '../../data/products'
import type { Chapter } from '../../data/types'
import { useIsDesktop, useReducedMotion } from '../../hooks/useMediaQuery'
import { useScrollFrame } from '../../hooks/useScrollFrame'
import { scrollToTarget, useLenis } from '../../lib/smooth-scroll'
import { TLink } from '../../lib/transition'
import { ButtonLink } from '../ui/Button'
import { Img } from '../ui/Img'
import { Arrow, Eyebrow, Lines } from '../ui/Typography'

/** Panel shape per chapter, chosen for the source image and the rhythm of the rail. */
const WIDE = new Set(['square-shot-blast', 'combi-pavers', 'kerb-jalies'])

/**
 * The catalogue as nine chapters. On desktop the section pins and the rail
 * travels horizontally with vertical scroll; on touch devices (and with
 * reduced motion) it is a native, snap-aligned swipe rail.
 */
export function CategoryShowcase() {
  const isDesktop = useIsDesktop()
  const reduced = useReducedMotion()
  const pinned = isDesktop && !reduced
  const lenis = useLenis()

  const section = useRef<HTMLElement>(null)
  const track = useRef<HTMLDivElement>(null)
  const bar = useRef<HTMLDivElement>(null)
  const counter = useRef<HTMLSpanElement>(null)
  const [distance, setDistance] = useState(0)

  useLayoutEffect(() => {
    const el = track.current
    if (!pinned || !el) {
      setDistance(0)
      return
    }
    const measure = () => setDistance(Math.max(0, el.scrollWidth - window.innerWidth))
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    return () => ro.disconnect()
  }, [pinned])

  useScrollFrame(() => {
    const s = section.current
    const t = track.current
    if (!s || !t || !distance) return
    const p = Math.min(1, Math.max(0, -s.getBoundingClientRect().top / distance))
    t.style.transform = `translate3d(${(-p * distance).toFixed(1)}px, 0, 0)`
    if (bar.current) bar.current.style.transform = `scaleX(${p})`
    if (counter.current) {
      counter.current.textContent = String(Math.min(chapters.length, Math.floor(p * chapters.length) + 1)).padStart(2, '0')
    }
  }, pinned)

  // Keyboard users tab through panels that sit off-screen; bring each into view.
  const onFocus = (e: FocusEvent<HTMLDivElement>) => {
    const s = section.current
    const t = track.current
    if (!pinned || !s || !t || !distance) return
    const panel = (e.target as HTMLElement).closest<HTMLElement>('[data-panel]')
    if (!panel) return
    const p = Math.min(1, Math.max(0, (panel.offsetLeft - window.innerWidth * 0.25) / distance))
    scrollToTarget(lenis, s.offsetTop + p * distance, true)
  }

  return (
    <section
      ref={section}
      id="collection"
      aria-labelledby="collection-title"
      className="on-light relative bg-ivory text-ink"
      style={pinned && distance ? { height: `calc(100vh + ${distance}px)` } : undefined}
    >
      {!pinned && (
        <div className="shell pt-28 pb-12">
          <Intro />
        </div>
      )}

      <div className={pinned ? 'sticky top-0 flex h-screen flex-col justify-center overflow-hidden' : 'pb-28'}>
        <div
          ref={track}
          onFocus={onFocus}
          className={
            pinned
              ? 'flex w-max items-end gap-[clamp(2.5rem,4.5vw,6rem)] px-[var(--gutter)] pt-[var(--nav-h)] will-change-transform'
              : 'rail flex snap-x snap-mandatory scroll-px-[var(--gutter)] items-end gap-5 overflow-x-auto px-[var(--gutter)] sm:gap-8'
          }
        >
          {pinned && (
            <div data-panel className="w-[min(36vw,40rem)] shrink-0 self-center pr-[2vw]">
              <Intro />
            </div>
          )}
          {chapters.map((c) => (
            <ChapterPanel key={c.id} chapter={c} pinned={pinned} />
          ))}
          <div
            data-panel
            className={`flex shrink-0 snap-start flex-col justify-end self-stretch ${
              pinned ? 'w-[min(28vw,26rem)] pb-[7.5rem]' : 'w-[78vw] max-w-[22rem] pb-24'
            }`}
          >
            <p className="serif text-h3 text-navy-900">Every product, every dimension.</p>
            <ButtonLink to="/products" tone="navy" className="mt-8 self-start">
              View all products
            </ButtonLink>
          </div>
        </div>

        {pinned && (
          <div className="shell mt-10 flex items-center gap-6">
            <span className="meta tabular text-navy-900">
              <span ref={counter}>01</span>
              <span className="mx-2 text-stone-400">/</span>
              {String(chapters.length).padStart(2, '0')}
            </span>
            <div className="relative h-px flex-1 bg-navy-900/12">
              <div ref={bar} className="absolute inset-0 origin-left scale-x-0 bg-gold" />
            </div>
            <span className="meta text-stone-600">Scroll to explore</span>
          </div>
        )}
      </div>
    </section>
  )
}

function Intro() {
  return (
    <div className="max-w-xl">
      <Eyebrow className="text-bronze">The Collection</Eyebrow>
      <Lines id="collection-title" lines={['Nine chapters', 'of material.']} className="serif mt-8 text-h2 text-navy-900" />
      <p data-reveal className="mt-8 max-w-[36ch] text-ink-soft">
        From designer floor tiles to kerb stones, elevation jalies and clay decorative tiles — the Classic range, chapter by
        chapter.
      </p>
    </div>
  )
}

function ChapterPanel({ chapter, pinned }: { chapter: Chapter; pinned: boolean }) {
  const wide = WIDE.has(chapter.id)
  const count = productsIn(chapter.collections).length
  const width = pinned
    ? wide
      ? 'w-[calc(min(60vh,40rem)*4/3)]'
      : 'w-[calc(min(60vh,40rem)*4/5)]'
    : wide
      ? 'w-[88vw] max-w-[34rem]'
      : 'w-[74vw] max-w-[24rem]'

  return (
    <div data-panel className={`shrink-0 snap-start ${width}`}>
      <TLink to={`/products?chapter=${chapter.id}`} className="group block" aria-label={`${chapter.title} — ${count} products`}>
        <div
          className={`relative overflow-hidden bg-navy-900 ${
            pinned ? 'h-[min(60vh,40rem)]' : wide ? 'aspect-[4/3]' : 'aspect-[4/5]'
          }`}
        >
          <Img
            group="scenes"
            name={chapter.scene}
            alt=""
            sizes={pinned ? (wide ? '60vw' : '40vw') : '88vw'}
            className="h-full w-full object-cover transition-transform duration-[1.8s] ease-[var(--ease-luxe)] group-hover:scale-[1.045]"
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-t from-navy-950/55 via-transparent to-transparent opacity-80 transition-opacity duration-700 group-hover:opacity-40"
          />
          <span className="serif tabular absolute top-5 left-6 text-[clamp(2.75rem,4vw,4rem)] leading-none text-ivory/90">
            {chapter.number}
          </span>
          <div
            aria-hidden="true"
            className="absolute right-4 bottom-4 w-[28%] max-w-36 border border-ivory/40 bg-plate shadow-[0_24px_48px_-24px_rgba(6,13,28,0.6)] transition-transform duration-[1.2s] ease-[var(--ease-luxe)] group-hover:-translate-y-2"
          >
            <Img group="products" name={chapter.specimen} alt="" sizes="144px" className="h-auto w-full" />
          </div>
        </div>
        <div className="mt-6 flex items-start justify-between gap-6">
          <div>
            <h3 className="serif text-h4 text-navy-900">{chapter.title}</h3>
            <p className="serif mt-1.5 text-[1.125rem] text-ink-soft italic">{chapter.tagline}</p>
          </div>
          <span className="mt-1 flex shrink-0 items-center gap-3 text-navy-900">
            <span className="meta tabular text-stone-600">{count}</span>
            <Arrow className="transition-transform duration-700 ease-[var(--ease-luxe)] group-hover:translate-x-1.5" />
          </span>
        </div>
      </TLink>
    </div>
  )
}
