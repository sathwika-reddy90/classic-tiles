import { useRef } from 'react'
import { collections } from '../../data/collections'
import type { CollectionId, ProductImageKey } from '../../data/types'
import { useParallax } from '../../hooks/useScrollFrame'
import { Img } from '../ui/Img'
import { Eyebrow, Lines, delay } from '../ui/Typography'

/**
 * Six qualities, each in the catalogue's own words. Collections are matched
 * from their printed feature bands, so the attribution stays verifiable.
 */
const values: { word: string; phrase: string; match?: string[]; collections?: CollectionId[] }[] = [
  {
    word: 'Design',
    phrase: 'Design that lasts. Style that endures.',
    collections: ['designer-floor-tiles', 'designer-wall-tiles'],
  },
  {
    word: 'Strength',
    phrase: 'High strength · Load-bearing · Heavy duty',
    match: ['High Strength', 'Load-Bearing', 'Load Bearing', 'Heavy Duty', 'High Compression Strength'],
  },
  {
    word: 'Durability',
    phrase: 'Weather resistant · UV stable',
    match: ['Weather Resistant', 'Weatherproof', 'UV Stable'],
  },
  {
    word: 'Precision',
    phrase: 'Precision cast · Precision built',
    collections: ['kerb-stones-water-drains', 'kerb-stones-jalies'],
  },
  { word: 'Long Life', phrase: 'Long life · Low maintenance', match: ['Long Life', 'Low Maintenance'] },
  { word: 'Craft', phrase: 'Strength in tradition. Beauty in design.', collections: ['clay-decorative-tiles'] },
]

/** Product surfaces seen up close — crops into the specimen images. */
const macros: { id: ProductImageKey; name: string; zoom: number; focus: string }[] = [
  { id: 'combi-pavers', name: 'Combi Pavers', zoom: 2.3, focus: '50% 48%' },
  { id: 'hurricane', name: 'Hurricane', zoom: 2.6, focus: '50% 44%' },
  { id: 'zigma', name: 'Zigma', zoom: 2.4, focus: '50% 47%' },
  { id: 'kerb-600-450-120', name: 'Kerb', zoom: 2.7, focus: '52% 44%' },
]

function collectionsFor(v: (typeof values)[number]) {
  const list = v.collections
    ? collections.filter((c) => v.collections!.includes(c.id))
    : collections.filter((c) => c.properties.some((p) => v.match!.includes(p)))
  return list.map((c) => c.title.replace('Classic ', '').replace(/ — 25\s?mm/, ''))
}

export function MaterialStory() {
  const frame = useRef<HTMLElement>(null)
  const inner = useRef<HTMLDivElement>(null)
  useParallax(frame, inner, 10)

  return (
    <section
      ref={frame}
      aria-labelledby="material-title"
      className="screen relative isolate overflow-hidden bg-navy-950 max-lg:py-28 text-ivory"
    >
      <div ref={inner} aria-hidden="true" className="absolute -inset-y-[12%] inset-x-0 -z-10 will-change-transform">
        <Img
          group="scenes"
          name="combi-render"
          alt=""
          sizes="100vw"
          className="h-full w-full object-cover opacity-55"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-navy-950 via-navy-950/70 to-navy-950" />
      </div>

      <div className="shell">
        <Eyebrow className="text-gold">Material &amp; Craft</Eyebrow>
        <Lines
          id="material-title"
          lines={[
            'Engineered for beauty.',
            <em key="d" className="text-gold-soft not-italic">
              Designed for strength.
            </em>,
          ]}
          className="serif mt-6 max-w-5xl text-h2 lg:mt-7"
        />

        <ul className="mt-16 grid grid-cols-2 gap-3 sm:gap-5 lg:mt-[clamp(1.25rem,4vh,3rem)] lg:grid-cols-4 lg:gap-6">
          {macros.map((m, i) => (
            <li key={m.id}>
              <figure className="group">
                <div
                  data-reveal="image"
                  style={delay(i * 120)}
                  className="relative aspect-[3/4] overflow-hidden bg-plate lg:aspect-auto lg:h-[min(26svh,17rem)] [@media(max-height:50rem)]:lg:h-[17svh]"
                >
                  <Img
                    group="products"
                    name={m.id}
                    alt={`${m.name} — surface detail`}
                    sizes="(min-width: 1024px) 24vw, 48vw"
                    style={{ transform: `scale(${m.zoom})`, objectPosition: m.focus, transformOrigin: m.focus }}
                    className="h-full w-full object-cover transition-[scale] duration-[2s] ease-[var(--ease-luxe)] group-hover:scale-[1.06]"
                  />
                </div>
                <figcaption
                  data-reveal="fade"
                  style={delay(300 + i * 120)}
                  className="meta mt-3 flex justify-between text-[0.625rem] text-ivory/55"
                >
                  <span>{m.name}</span>
                  <span className="tabular">Detail</span>
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>

        <ol className="mt-20 grid gap-x-10 sm:grid-cols-2 lg:mt-[clamp(1.25rem,4vh,3rem)] lg:grid-cols-6 lg:gap-x-6">
          {values.map((v, i) => (
            <li
              key={v.word}
              data-reveal
              style={delay((i % 6) * 80)}
              className="border-t border-ivory/15 pt-8 pb-14 lg:pt-4 lg:pb-0"
            >
              <span className="tabular text-[0.6875rem] tracking-[0.2em] text-gold">
                {String(i + 1).padStart(2, '0')}
              </span>
              <h3 className="serif mt-5 text-[clamp(1.6rem,2.4vw,2.4rem)] leading-tight lg:mt-2 lg:text-[clamp(1.05rem,1.3vw,1.3rem)]">
                {v.word}
              </h3>
              <p className="serif mt-4 text-[1rem] text-ivory/80 italic lg:mt-2 lg:text-[0.8125rem] lg:leading-snug">
                {v.phrase}
              </p>
              <p className="mt-6 text-[0.8125rem] leading-relaxed text-ivory/55 lg:mt-2 lg:text-[0.6875rem] lg:leading-snug">
                {collectionsFor(v).join(' · ')}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
