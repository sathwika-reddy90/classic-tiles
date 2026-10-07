import { useEffect, useRef, useState } from 'react'
import { company } from '../../data/company'
import { primaryMeasure, productById, products } from '../../data/products'
import { mediaEntry, mediaSrc, mediaSrcSet } from '../../lib/media'
import { TLink } from '../../lib/transition'
import { useScrollFrame } from '../../hooks/useScrollFrame'
import { useReducedMotion } from '../../hooks/useMediaQuery'
import { ButtonLink } from '../ui/Button'
import { delay } from '../ui/Typography'

/** Catalogue page 9 (Classic Designer Pavers): a driveway laid in Hexagonal pavers. */
const LANDSCAPE = 'hex-driveway'
const PORTRAIT = 'hex-driveway-portrait'

/**
 * The one product the frame is about: the Hexagonal paver, in the three
 * colours laid across that driveway — black for the field, yellow and red for
 * the flower motif. Black is the catalogue's own render; the yellow and red
 * are that render re-based on each colour (scripts/make_hero_cutouts.py).
 */
const PRODUCT = 'hexagonal'
/** The strip along the bottom edge: the same figures as the stats band below, and the range. */
const facts = [
  { value: `${new Date().getFullYear() - company.since}+`, label: 'Years manufacturing' },
  { value: String(products.length), label: 'Catalogue designs' },
  { value: company.certification, label: 'Certified' },
]
const makes = ['Designer tiles', 'Pavers', 'Kerbs & drains', 'Jalies']

const COLOURS = [
  { image: 'hexagonal-cut', name: 'Black', laid: 'The driveway field' },
  { image: 'hexagonal-yellow-cut', name: 'Yellow', laid: 'Flower petals' },
  { image: 'hexagonal-red-cut', name: 'Red', laid: 'Flower centres' },
]

/**
 * The campaign frame: a scene from the catalogue, the paver it is laid in
 * presented in each of its colours beside it, and one clear message.
 */
export function Hero() {
  const section = useRef<HTMLElement>(null)
  const media = useRef<HTMLDivElement>(null)
  const stage = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const id = requestAnimationFrame(() => setReady(true))
    return () => cancelAnimationFrame(id)
  }, [])

  // Depth on scroll: the scene sinks, the sample travels further, the frame clears.
  useScrollFrame((y) => {
    const vh = window.innerHeight
    if (y > vh * 1.2) return
    if (media.current) media.current.style.transform = `translate3d(0, ${(y * 0.3).toFixed(1)}px, 0)`
    section.current?.style.setProperty('--sy', y.toFixed(1))
    if (stage.current) stage.current.style.opacity = String(Math.max(0, 1 - y / (vh * 0.45)))
  }, !reduced)

  // Depth on pointer: a few pixels of drift on the sample.
  useEffect(() => {
    const el = section.current
    if (!el || reduced || !matchMedia('(hover: hover) and (pointer: fine)').matches) return
    let frame = 0
    const move = (e: PointerEvent) => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        el.style.setProperty('--px', ((e.clientX / innerWidth) * 2 - 1).toFixed(3))
        el.style.setProperty('--py', ((e.clientY / innerHeight) * 2 - 1).toFixed(3))
      })
    }
    el.addEventListener('pointermove', move)
    return () => {
      cancelAnimationFrame(frame)
      el.removeEventListener('pointermove', move)
    }
  }, [reduced])

  const scene = mediaEntry('scenes', LANDSCAPE)
  const product = productById[PRODUCT]

  return (
    <section
      ref={section}
      aria-labelledby="hero-title"
      className={`hero relative isolate h-[100svh] min-h-[40rem] overflow-hidden bg-navy-950 text-ivory lg:min-h-[44rem] ${ready ? 'is-in' : ''}`}
    >
      {/* The scene */}
      <div ref={media} className="hero-set absolute inset-0 -z-20 will-change-transform">
        <picture>
          <source media="(max-width: 1023.98px)" srcSet={mediaSrcSet('scenes', PORTRAIT)} sizes="100vw" />
          <img
            src={mediaSrc('scenes', LANDSCAPE)}
            srcSet={mediaSrcSet('scenes', LANDSCAPE)}
            sizes="100vw"
            width={scene.w}
            height={scene.h}
            alt="A modern two-storey home with timber cladding, its curving driveway laid in Classic hexagonal pavers in charcoal with red and yellow flower motifs"
            fetchPriority="high"
            decoding="async"
            className="h-full w-full object-cover object-[50%_75%] lg:object-[60%_70%]"
          />
        </picture>
        {/* A soft shade only behind the copy; the house and garden stay bright. */}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[linear-gradient(90deg,rgb(6_13_28/0.78)_0%,rgb(6_13_28/0.5)_30%,rgb(6_13_28/0.08)_50%,transparent_60%)] max-lg:bg-[linear-gradient(180deg,rgb(6_13_28/0.82)_0%,rgb(6_13_28/0.45)_28%,transparent_46%,transparent_60%,rgb(6_13_28/0.85)_84%)]"
        />
        <div
          aria-hidden="true"
          className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-navy-950/50 to-transparent"
        />
      </div>

      <div ref={stage} className="absolute inset-0">
        {/* The paver, in each colour laid in the scene */}
        <div
          data-reveal="fade"
          style={delay(1100)}
          className="absolute inset-x-[var(--gutter)] top-[35%] bottom-[31%] flex flex-col justify-center lg:inset-x-auto lg:top-[calc(var(--nav-h)+1.5rem)] lg:right-[var(--gutter)] lg:bottom-[calc(4.25rem+clamp(1rem,3vh,2rem))] lg:w-[min(22vw,19rem)]"
        >
          <TLink
            to={`/products?p=${PRODUCT}`}
            aria-label={`${product.name} paver in black, yellow and red — ${primaryMeasure(product)}`}
            className="group block bg-navy-950/55 ring-1 ring-ivory/15 backdrop-blur-md transition-colors duration-500 hover:bg-navy-950/70"
          >
            <span className="flex items-center justify-between gap-4 border-b border-ivory/15 px-4 py-3 lg:block lg:px-6 lg:py-4">
              <span className="text-[0.875rem] font-bold tracking-[0.06em] uppercase lg:text-[1rem]">
                {product.name} paver
              </span>
              <span className="text-[0.625rem] font-semibold tracking-[0.12em] text-gold-soft uppercase lg:mt-1 lg:block">
                {primaryMeasure(product)}
              </span>
            </span>
            <span className="grid grid-cols-3 lg:flex lg:flex-col lg:gap-[clamp(0.25rem,1.5vh,1rem)] lg:py-[clamp(0.75rem,2.5vh,1.5rem)]">
              {COLOURS.map(({ image, name, laid }, i) => {
                const entry = mediaEntry('hero', image as never)
                return (
                  <span
                    key={image}
                    className={`hero-product flex flex-col items-center gap-2 px-2 py-3 text-center lg:flex-row lg:gap-5 lg:px-6 lg:py-0 lg:text-left ${
                      i ? 'max-lg:border-l max-lg:border-ivory/10' : ''
                    }`}
                    style={delay(1300 + i * 220)}
                  >
                    <span className="relative block w-[4.5rem] shrink-0 transition-transform duration-[900ms] ease-[var(--ease-luxe)] group-hover:-translate-y-1 lg:w-[min(8vw,7.25rem)]">
                      {/* A soft pool of light under each paver */}
                      <span
                        aria-hidden="true"
                        className="absolute inset-x-[2%] bottom-[-6%] h-[38%] rounded-[50%] bg-black/55 blur-[10px]"
                      />
                      <span
                        aria-hidden="true"
                        className="absolute -inset-[18%] rounded-full bg-[radial-gradient(closest-side,rgb(255_236_200/0.22),transparent)]"
                      />
                      <img
                        src={mediaSrc('hero', image)}
                        srcSet={mediaSrcSet('hero', image)}
                        sizes="(min-width: 1024px) 8vw, 72px"
                        width={entry.w}
                        height={entry.h}
                        alt=""
                        decoding="async"
                        className="relative block h-auto w-full"
                      />
                    </span>
                    <span>
                      <span className="block text-[0.6875rem] font-bold tracking-[0.1em] uppercase lg:text-[0.9375rem] lg:tracking-[0.06em]">
                        {name}
                      </span>
                      <span className="mt-0.5 hidden text-[0.6875rem] text-ivory/65 lg:block">{laid}</span>
                    </span>
                  </span>
                )
              })}
            </span>
            <span className="hidden items-center justify-between border-t border-ivory/15 px-6 py-3 text-[0.625rem] font-semibold tracking-[0.12em] text-ivory/75 uppercase transition-colors group-hover:text-ivory lg:flex">
              View the {product.name} paver
              <span aria-hidden="true">→</span>
            </span>
          </TLink>
        </div>

        {/* Copy */}
        <div className="shell relative flex h-full flex-col justify-between pt-[calc(var(--nav-h)+1.5rem)] pb-8 lg:justify-center lg:gap-10 lg:pt-[var(--nav-h)] lg:pb-24">
          <div className="lg:max-w-[36rem]">
            <p data-reveal="fade" style={delay(600)} className="flex items-center gap-3.5">
              <span aria-hidden="true" className="h-px w-5 shrink-0 bg-gold sm:w-8" />
              <span className="text-[0.6875rem] font-semibold tracking-[0.2em] whitespace-nowrap uppercase sm:tracking-[0.32em]">
                Classic Hyderabad
              </span>
              <span aria-hidden="true" className="text-gold">
                —
              </span>
              <span className="tabular text-[0.6875rem] font-semibold tracking-[0.2em] whitespace-nowrap text-gold-soft uppercase sm:tracking-[0.32em]">
                Since {company.since}
              </span>
            </p>
            <h1
              id="hero-title"
              className="mt-5 text-[clamp(2.4rem,4.6vw,4.6rem)] leading-[1.04] font-bold tracking-[-0.01em] uppercase lg:mt-7"
            >
              {[
                'From surface',
                <>
                  <span className="mr-[0.14em] text-[0.9em] font-medium tracking-[-0.01em] text-gold-soft normal-case">
                    to
                  </span>
                  structure.
                </>,
              ].map((line, i) => (
                <span key={i} className="line-mask">
                  <span style={delay(800 + i * 120)} className="!duration-[1400ms]">
                    {line}
                  </span>
                </span>
              ))}
            </h1>
          </div>

          <div className="lg:max-w-[36rem]">
            <p
              data-reveal
              style={delay(1700)}
              className="max-w-[42ch] text-[0.9375rem] leading-relaxed text-ivory/85 lg:text-base"
            >
              Designer tiles, pavers, kerbs and architectural materials — manufactured in Hyderabad for homes, campuses
              and cities.
            </p>
            <div data-reveal style={delay(1900)} className="mt-6 flex flex-wrap gap-3 lg:mt-8">
              <ButtonLink to="/products" tone="ivory" className="font-semibold tracking-[0.16em] max-sm:px-5">
                Explore collection
              </ButtonLink>
              <ButtonLink to="/#projects" tone="outline-light" className="font-semibold tracking-[0.16em] max-sm:px-5">
                View projects
              </ButtonLink>
            </div>
          </div>
        </div>

        {/* Supporting facts and range, along the bottom edge */}
        <div
          data-reveal="fade"
          style={delay(2300)}
          className="shell pointer-events-none absolute inset-x-0 bottom-0 hidden lg:block"
        >
          <div className="flex items-center justify-between gap-8 border-t border-ivory/20 py-5">
            <dl className="flex items-center gap-8">
              {facts.map((f, i) => (
                <div key={f.label} className={`flex items-baseline gap-3 ${i ? 'border-l border-ivory/20 pl-8' : ''}`}>
                  <dd className="tabular text-[1.25rem] leading-none font-bold whitespace-nowrap text-ivory">
                    {f.value}
                  </dd>
                  <dt className="text-[0.625rem] font-medium tracking-[0.14em] whitespace-nowrap text-ivory/65 uppercase">
                    {f.label}
                  </dt>
                </div>
              ))}
            </dl>
            <p className="hidden items-center gap-4 text-[0.625rem] font-medium tracking-[0.14em] whitespace-nowrap text-ivory/65 uppercase xl:flex">
              {makes.map((m, i) => (
                <span key={m} className="flex items-center gap-4">
                  {i > 0 && <span aria-hidden="true" className="size-[3px] rounded-full bg-gold" />}
                  {m}
                </span>
              ))}
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
