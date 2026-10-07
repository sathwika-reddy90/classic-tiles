import { useRef } from 'react'
import { chapters } from '../../data/collections'
import { productsIn } from '../../data/products'
import type { Chapter } from '../../data/types'
import { TLink } from '../../lib/transition'
import { ButtonLink } from '../ui/Button'
import { Img } from '../ui/Img'
import { Arrow, Eyebrow, Lines } from '../ui/Typography'

/** Panel shape per chapter, chosen for the source image and the rhythm of the rail. */
const WIDE = new Set(['square-shot-blast', 'combi-pavers', 'kerb-jalies'])

/**
 * The catalogue as nine chapters on a horizontal rail. It fits one screen:
 * on desktop the intro sits beside the rail, which moves sideways with the
 * arrow buttons, a trackpad or the keyboard; on phones it moves one panel at a
 * time with the arrow buttons under it.
 */
export function CategoryShowcase() {
  const rail = useRef<HTMLDivElement>(null)
  const bar = useRef<HTMLDivElement>(null)
  const counter = useRef<HTMLSpanElement>(null)

  const onScroll = () => {
    const r = rail.current
    if (!r) return
    const max = r.scrollWidth - r.clientWidth
    const p = max > 0 ? r.scrollLeft / max : 0
    if (bar.current) bar.current.style.transform = `scaleX(${Math.max(0.04, p)})`
    if (counter.current) {
      let index = Math.floor(p * (chapters.length - 1))
      // Phones step a panel at a time, so count the panel at the rail's start.
      if (!matchMedia('(min-width: 1024px)').matches) {
        const panels = [...r.querySelectorAll<HTMLElement>('[data-panel]')]
        const start = r.getBoundingClientRect().left + (parseFloat(getComputedStyle(r).scrollPaddingLeft) || 0)
        const gaps = panels.map((el) => Math.abs(el.getBoundingClientRect().left - start))
        index = gaps.indexOf(Math.min(...gaps))
      }
      counter.current.textContent = String(Math.min(chapters.length, index + 1)).padStart(2, '0')
    }
  }

  const step = (dir: 1 | -1) => {
    const r = rail.current
    const panel = r?.querySelector<HTMLElement>('[data-panel]')
    if (!r || !panel) return
    if (matchMedia('(min-width: 1024px)').matches) {
      r.scrollBy({ left: dir * (panel.offsetWidth + 40), behavior: 'smooth' })
      return
    }
    // Phones: panels differ in width, so go to the start of the next or previous one.
    const pad = parseFloat(getComputedStyle(r).scrollPaddingLeft) || 0
    const origin = r.getBoundingClientRect().left + pad
    const offsets = [...r.querySelectorAll<HTMLElement>('[data-panel]')].map(
      (el) => el.getBoundingClientRect().left - origin,
    )
    const target = dir > 0 ? offsets.find((x) => x > 2) : offsets.filter((x) => x < -2).pop()
    if (target !== undefined) r.scrollBy({ left: target, behavior: 'smooth' })
  }

  const arrowButton = (dir: 1 | -1) => (
    <button
      type="button"
      onClick={() => step(dir)}
      aria-label={dir > 0 ? 'Next chapters' : 'Previous chapters'}
      className="grid size-12 shrink-0 place-items-center border border-navy-900/25 text-navy-900 transition-colors hover:border-navy-900 hover:bg-navy-900 hover:text-ivory"
    >
      <Arrow className={dir > 0 ? undefined : 'rotate-180'} />
    </button>
  )

  return (
    <section
      id="collection"
      aria-labelledby="collection-title"
      className="screen on-light relative bg-ivory max-lg:pt-28 max-lg:pb-28 text-ink"
    >
      <div className="lg:flex lg:min-h-0 lg:flex-1 lg:items-center">
        <div className="shell pb-12 lg:w-[min(34vw,30rem)] lg:max-w-none lg:shrink-0 lg:pr-0 lg:pb-0">
          <Intro />
          <div className="mt-10 hidden items-center gap-3 lg:flex">
            {arrowButton(-1)}
            {arrowButton(1)}
          </div>
        </div>

        <div className="min-w-0 lg:flex-1">
          <div
            ref={rail}
            onScroll={onScroll}
            data-lenis-prevent
            className="rail flex snap-x snap-mandatory scroll-px-[var(--gutter)] items-end gap-5 overflow-x-auto max-lg:touch-pan-y max-lg:overflow-x-hidden px-[var(--gutter)] sm:gap-8 lg:scroll-px-12 lg:gap-10 lg:px-12"
          >
            {chapters.map((c) => (
              <ChapterPanel key={c.id} chapter={c} />
            ))}
            <div
              data-panel
              className="flex w-[78vw] max-w-[22rem] shrink-0 snap-start flex-col justify-end self-stretch pb-24 lg:w-[20rem] lg:pb-[5.5rem]"
            >
              <p className="serif text-h3 text-navy-900">Every product, every dimension.</p>
              <ButtonLink to="/products" tone="navy" className="mt-8 self-start">
                View all products
              </ButtonLink>
            </div>
          </div>

          <div className="mt-8 flex items-center gap-4 px-[var(--gutter)] lg:gap-6 lg:pl-12">
            <span className="lg:hidden">{arrowButton(-1)}</span>
            <span className="meta tabular text-navy-900">
              <span ref={counter}>01</span>
              <span className="mx-2 text-stone-400">/</span>
              {String(chapters.length).padStart(2, '0')}
            </span>
            <div className="relative h-px flex-1 bg-navy-900/12">
              <div ref={bar} className="absolute inset-0 origin-left scale-x-[0.04] bg-gold" />
            </div>
            <span className="lg:hidden">{arrowButton(1)}</span>
          </div>
        </div>
      </div>
    </section>
  )
}

function Intro() {
  return (
    <div className="max-w-xl">
      <Eyebrow className="text-bronze">The Collection</Eyebrow>
      <Lines
        id="collection-title"
        lines={['Nine chapters', 'of material.']}
        className="serif mt-7 text-h2 text-navy-900"
      />
      <p data-reveal className="mt-7 max-w-[36ch] text-ink-soft">
        From designer floor tiles to kerb stones, elevation jalies and clay decorative tiles — the Classic range,
        chapter by chapter.
      </p>
    </div>
  )
}

function ChapterPanel({ chapter }: { chapter: Chapter }) {
  const wide = WIDE.has(chapter.id)
  const count = productsIn(chapter.collections).length
  const width = wide
    ? 'w-[88vw] max-w-[34rem] lg:w-[calc(min(52svh,32rem)*4/3)] lg:max-w-none'
    : 'w-[74vw] max-w-[24rem] lg:w-[calc(min(52svh,32rem)*4/5)] lg:max-w-none'

  return (
    <div data-panel className={`shrink-0 snap-start ${width}`}>
      <TLink
        to={`/products?chapter=${chapter.id}`}
        className="group block"
        aria-label={`${chapter.title} — ${count} products`}
      >
        <div
          className={`relative overflow-hidden bg-navy-900 ${wide ? 'aspect-[4/3]' : 'aspect-[4/5]'} lg:aspect-auto lg:h-[min(52svh,32rem)]`}
        >
          <Img
            group="scenes"
            name={chapter.scene}
            alt=""
            sizes={wide ? '(min-width: 1024px) 45vw, 88vw' : '(min-width: 1024px) 30vw, 74vw'}
            className="h-full w-full object-cover transition-transform duration-[1.8s] ease-[var(--ease-luxe)] group-hover:scale-[1.045]"
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-t from-navy-950/55 via-transparent to-transparent opacity-80 transition-opacity duration-700 group-hover:opacity-40"
          />
          <span className="serif tabular absolute top-5 left-6 text-[clamp(2rem,3vw,3rem)] leading-none text-ivory/90">
            {chapter.number}
          </span>
          <div
            aria-hidden="true"
            className="absolute right-4 bottom-4 w-[28%] max-w-36 border border-ivory/40 bg-plate shadow-[0_24px_48px_-24px_rgba(6,13,28,0.6)] transition-transform duration-[1.2s] ease-[var(--ease-luxe)] group-hover:-translate-y-2"
          >
            <Img group="products" name={chapter.specimen} alt="" sizes="144px" className="h-auto w-full" />
          </div>
        </div>
        <div className="mt-5 flex items-start justify-between gap-6">
          <div>
            <h3 className="serif text-h4 text-navy-900">{chapter.title}</h3>
            <p className="serif mt-1.5 text-[0.9375rem] text-ink-soft italic">{chapter.tagline}</p>
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
