import type { ReactNode } from 'react'
import { productById } from '../../data/products'
import type { Product } from '../../data/types'
import { mediaEntry, mediaSrc, mediaSrcSet } from '../../lib/media'
import { TLink } from '../../lib/transition'
import { ButtonLink } from '../ui/Button'
import { delay } from '../ui/Typography'
import { HeroFacts } from './HeroFacts'

interface Series {
  /** Prefix for the heading id. */
  id: string
  scene: string
  alt: string
  /** object-position classes for phones and desktop. */
  focus: string
  eyebrow: string
  /** The heading: first line, then the second line's light lead-in and its close. */
  title: [string, string, string]
  copy: string
  /** The homepage chapter the frame links to (chapter ids in data/collections). */
  chapter: string
  cta: string
  panel: string
  /** The products printed under the scene, in catalogue order. */
  products: string[]
  /** What to print under each product: its size, or its thickness. */
  measure: (p: Product) => string
  linkLabel: string
}

const size = (p: Product) => p.dimensions[0] ?? ''
const thickness = (p: Product) => p.specs?.find((s) => s.label === 'Thickness')?.value ?? ''

/** Catalogue page 11 (Classic Designer Wall Tiles Series): a house clad and walled in wall tiles. */
export function HeroWalls() {
  return (
    <HeroSeries
      id="hero-walls"
      scene="wall-house-full"
      alt="A modern two-storey home clad in Classic designer wall tiles, its compound wall laid in buff and red brick-pattern tiles"
      focus="object-[55%_50%] lg:object-[50%_45%]"
      eyebrow="Designer wall tiles"
      title={['Walls that', 'make the', 'house.']}
      copy="Brick, stone and timber-grain wall tiles for elevations and compound walls. Where durability meets design."
      chapter="wall-tiles"
      cta="Explore wall tiles"
      panel="Wall tiles series"
      products={['hurricane', 'swathi', 'zigma', 'varsha']}
      measure={size}
      linkLabel="View the wall tiles"
    />
  )
}

/** Catalogue page 10 (Classic Designer Pavers Series 2): a palm-lined entrance walk in mixed pavers. */
export function HeroPathway() {
  return (
    <HeroSeries
      id="hero-pathway"
      scene="pathway-full"
      alt="A palm-lined entrance walk laid in Classic pavers in red, buff and charcoal, edged with grass pavers, at sunset"
      focus="object-[50%_60%] lg:object-[50%_55%]"
      eyebrow="Designer pavers — Series 2"
      title={['Every path,', 'laid to', 'last.']}
      copy="Triarc, combi, hexagonal and grass pavers for driveways, campuses and landscapes. Load-bearing, weatherproof and low maintenance."
      chapter="designer-pavers"
      cta="Explore pavers"
      panel="Pavers series 2"
      products={['triarc', 'combi-pavers', 'hexagonal-y-shape', 'rock']}
      measure={thickness}
      linkLabel="View the pavers"
    />
  )
}

/**
 * A campaign frame set like the first hero: a catalogue scene full-bleed,
 * one message, and the series laid in it beside it.
 */
function HeroSeries(s: Series) {
  const scene = mediaEntry('scenes', s.scene as never)
  const items = s.products.map((id) => productById[id])
  const href = `/products?chapter=${s.chapter}`
  const [first, lead, close] = s.title
  const lines: ReactNode[] = [
    first,
    <>
      <span className="mr-[0.14em] text-[0.9em] font-medium tracking-[-0.01em] text-gold-soft normal-case">{lead}</span>
      {close}
    </>,
  ]

  return (
    <section
      aria-labelledby={`${s.id}-title`}
      className="relative isolate h-[100svh] min-h-[40rem] overflow-hidden bg-navy-950 text-ivory lg:min-h-[44rem]"
    >
      {/* The scene */}
      <div className="absolute inset-0 -z-20">
        <img
          src={mediaSrc('scenes', s.scene)}
          srcSet={mediaSrcSet('scenes', s.scene)}
          sizes="100vw"
          width={scene.w}
          height={scene.h}
          alt={s.alt}
          loading="lazy"
          decoding="async"
          className={`h-full w-full object-cover brightness-[0.78] saturate-[0.9] ${s.focus}`}
        />
        {/* Brought down to the first hero's evening light */}
        <div aria-hidden="true" className="absolute inset-0 bg-navy-950/15" />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[linear-gradient(90deg,rgb(6_13_28/0.78)_0%,rgb(6_13_28/0.5)_30%,rgb(6_13_28/0.08)_50%,transparent_60%)] max-lg:bg-[linear-gradient(180deg,rgb(6_13_28/0.82)_0%,rgb(6_13_28/0.45)_28%,transparent_46%,transparent_60%,rgb(6_13_28/0.85)_84%)]"
        />
      </div>

      {/* The series, as printed under the scene */}
      <div
        data-reveal="fade"
        style={delay(500)}
        className="absolute z-10 inset-x-[var(--gutter)] top-[35%] bottom-[31%] flex flex-col justify-center lg:inset-x-auto lg:top-[calc(var(--nav-h)+1.5rem)] lg:right-[var(--gutter)] lg:bottom-[calc(4.25rem+clamp(1rem,3vh,2rem))] lg:w-[min(26vw,23rem)]"
      >
        <TLink
          to={href}
          aria-label={`${s.panel} — ${items.map((p) => p.name).join(', ')}`}
          className="group block bg-navy-950/55 ring-1 ring-ivory/15 backdrop-blur-md transition-colors duration-500 hover:bg-navy-950/70"
        >
          <span className="flex items-center justify-between gap-4 border-b border-ivory/15 px-4 py-3 lg:block lg:px-6 lg:py-4">
            <span className="text-[0.875rem] font-bold tracking-[0.06em] uppercase lg:text-[1rem]">{s.panel}</span>
            <span className="text-[0.625rem] font-semibold tracking-[0.12em] text-gold-soft uppercase lg:mt-1 lg:block">
              {items.length} designs
            </span>
          </span>
          <span className="grid grid-cols-4 gap-px bg-ivory/10 lg:grid-cols-2">
            {items.map((product, i) => {
              const entry = mediaEntry('products', product.id as never)
              return (
                <span
                  key={product.id}
                  data-reveal
                  style={delay(700 + i * 160)}
                  className="flex flex-col items-center gap-2 bg-navy-950/40 px-1.5 py-3 text-center lg:gap-3 lg:px-3 lg:py-[clamp(0.75rem,2.5vh,1.25rem)]"
                >
                  {/* Catalogue shots sit on the catalogue's own pale plate */}
                  <span className="block w-full overflow-hidden bg-[rgb(236_232_225)] lg:w-[min(100%,14svh)]">
                    <img
                      src={mediaSrc('products', product.id)}
                      srcSet={mediaSrcSet('products', product.id)}
                      sizes="(min-width: 1024px) 11vw, 22vw"
                      width={entry.w}
                      height={entry.h}
                      alt=""
                      loading="lazy"
                      decoding="async"
                      className="block aspect-square w-full scale-[1.35] object-cover transition-transform duration-[900ms] ease-[var(--ease-luxe)] group-hover:scale-[1.42]"
                    />
                  </span>
                  <span>
                    <span className="block text-[0.6875rem] font-bold tracking-[0.1em] uppercase lg:text-[0.875rem] lg:tracking-[0.06em]">
                      {product.name}
                    </span>
                    <span className="mt-0.5 block text-[0.5625rem] whitespace-nowrap text-ivory/65 lg:text-[0.6875rem]">
                      {s.measure(product)}
                    </span>
                  </span>
                </span>
              )
            })}
          </span>
          <span className="hidden items-center justify-between border-t border-ivory/15 px-6 py-3 text-[0.625rem] font-semibold tracking-[0.12em] text-ivory/75 uppercase transition-colors group-hover:text-ivory lg:flex">
            {s.linkLabel}
            <span aria-hidden="true">→</span>
          </span>
        </TLink>
      </div>

      {/* Copy */}
      <div className="shell relative flex h-full flex-col justify-between pt-[calc(var(--nav-h)+1.5rem)] pb-8 lg:justify-center lg:gap-10 lg:pt-[var(--nav-h)] lg:pb-24">
        <div className="lg:max-w-[36rem]">
          <p data-reveal="fade" className="flex items-center gap-3.5">
            <span aria-hidden="true" className="h-px w-5 shrink-0 bg-gold sm:w-8" />
            <span className="text-[0.6875rem] font-semibold tracking-[0.2em] whitespace-nowrap uppercase sm:tracking-[0.32em]">
              {s.eyebrow}
            </span>
          </p>
          <h2
            id={`${s.id}-title`}
            data-reveal="lines"
            className="mt-5 text-[clamp(2.4rem,4.6vw,4.6rem)] leading-[1.04] font-bold tracking-[-0.01em] uppercase lg:mt-7"
          >
            {lines.map((line, i) => (
              <span key={i} className="line-mask">
                <span style={delay(200 + i * 120)} className="!duration-[1400ms]">
                  {line}
                </span>
              </span>
            ))}
          </h2>
        </div>

        <div className="lg:max-w-[36rem]">
          <p
            data-reveal
            style={delay(600)}
            className="max-w-[42ch] text-[0.9375rem] leading-relaxed text-ivory/85 lg:text-base"
          >
            {s.copy}
          </p>
          <div data-reveal style={delay(800)} className="mt-6 flex flex-wrap gap-3 lg:mt-8">
            <ButtonLink to={href} tone="ivory" className="font-semibold tracking-[0.16em] max-sm:px-5">
              {s.cta}
            </ButtonLink>
            <ButtonLink to="/#contact" tone="outline-light" className="font-semibold tracking-[0.16em] max-sm:px-5">
              Get a quote
            </ButtonLink>
          </div>
        </div>
      </div>

      <HeroFacts delayMs={900} />
    </section>
  )
}
