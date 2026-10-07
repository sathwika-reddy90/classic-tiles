import { productById } from '../../data/products'
import { mediaEntry, mediaSrc, mediaSrcSet } from '../../lib/media'
import { TLink } from '../../lib/transition'
import { ButtonLink } from '../ui/Button'
import { delay } from '../ui/Typography'

/** The full catalogue page-11 scene (Classic Designer Wall Tiles Series): a house clad and walled in wall tiles. */
const SCENE = 'wall-house-full'
const CHAPTER = 'designer-wall-tiles'

/** The four tiles printed under that scene, in catalogue order. */
const TILES = ['hurricane', 'swathi', 'zigma', 'varsha']

/**
 * The second campaign frame, set like the first: the catalogue's wall-tile
 * scene full-bleed, one message, and the series it is clad in beside it.
 */
export function HeroWalls() {
  const scene = mediaEntry('scenes', SCENE)

  return (
    <section
      aria-labelledby="hero-walls-title"
      className="relative isolate h-[100svh] min-h-[40rem] overflow-hidden bg-navy-950 text-ivory lg:min-h-[44rem]"
    >
      {/* The scene */}
      <div className="absolute inset-0 -z-20">
        <img
          src={mediaSrc('scenes', SCENE)}
          srcSet={mediaSrcSet('scenes', SCENE)}
          sizes="100vw"
          width={scene.w}
          height={scene.h}
          alt="A modern two-storey home clad in Classic designer wall tiles, its compound wall laid in buff and red brick-pattern tiles"
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover object-[55%_50%] brightness-[0.78] saturate-[0.9] lg:object-[50%_45%]"
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
        className="absolute z-10 inset-x-[var(--gutter)] top-[35%] bottom-[31%] flex flex-col justify-center lg:inset-x-auto lg:top-[calc(var(--nav-h)+1.5rem)] lg:right-[var(--gutter)] lg:bottom-[clamp(2rem,6vh,4rem)] lg:w-[min(26vw,23rem)]"
      >
        <TLink
          to={`/products?chapter=${CHAPTER}`}
          aria-label="Classic designer wall tiles — Hurricane, Swathi, Zigma and Varsha"
          className="group block bg-navy-950/55 ring-1 ring-ivory/15 backdrop-blur-md transition-colors duration-500 hover:bg-navy-950/70"
        >
          <span className="flex items-center justify-between gap-4 border-b border-ivory/15 px-4 py-3 lg:block lg:px-6 lg:py-4">
            <span className="text-[0.875rem] font-bold tracking-[0.06em] uppercase lg:text-[1rem]">Wall tiles series</span>
            <span className="text-[0.625rem] font-semibold tracking-[0.12em] text-gold-soft uppercase lg:mt-1 lg:block">
              {TILES.length} designs
            </span>
          </span>
          <span className="grid grid-cols-4 gap-px bg-ivory/10 lg:grid-cols-2">
            {TILES.map((id, i) => {
              const product = productById[id]
              const entry = mediaEntry('products', id as never)
              return (
                <span
                  key={id}
                  data-reveal
                  style={delay(700 + i * 160)}
                  className="flex flex-col items-center gap-2 bg-navy-950/40 px-1.5 py-3 text-center lg:gap-3 lg:px-3 lg:py-[clamp(0.75rem,2.5vh,1.25rem)]"
                >
                  {/* Catalogue shots sit on the catalogue's own pale plate */}
                  <span className="block w-full overflow-hidden bg-[rgb(236_232_225)]">
                    <img
                      src={mediaSrc('products', id)}
                      srcSet={mediaSrcSet('products', id)}
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
                      {product.dimensions[0]}
                    </span>
                  </span>
                </span>
              )
            })}
          </span>
          <span className="hidden items-center justify-between border-t border-ivory/15 px-6 py-3 text-[0.625rem] font-semibold tracking-[0.12em] text-ivory/75 uppercase transition-colors group-hover:text-ivory lg:flex">
            View the wall tiles
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
              Designer wall tiles
            </span>
          </p>
          <h2
            id="hero-walls-title"
            data-reveal="lines"
            className="mt-5 text-[clamp(2.4rem,4.6vw,4.6rem)] leading-[1.04] font-bold tracking-[-0.01em] uppercase lg:mt-7"
          >
            {[
              'Walls that',
              <>
                <span className="mr-[0.14em] text-[0.9em] font-medium tracking-[-0.01em] text-gold-soft normal-case">
                  make the
                </span>
                house.
              </>,
            ].map((line, i) => (
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
            Brick, stone and timber-grain wall tiles for elevations and compound walls. Where durability meets design.
          </p>
          <div data-reveal style={delay(800)} className="mt-6 flex flex-wrap gap-3 lg:mt-8">
            <ButtonLink
              to={`/products?chapter=${CHAPTER}`}
              tone="ivory"
              className="font-semibold tracking-[0.16em] max-sm:px-5"
            >
              Explore wall tiles
            </ButtonLink>
            <ButtonLink to="/#contact" tone="outline-light" className="font-semibold tracking-[0.16em] max-sm:px-5">
              Get a quote
            </ButtonLink>
          </div>
        </div>
      </div>
    </section>
  )
}
