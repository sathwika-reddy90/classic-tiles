import { useRef } from 'react'
import { company, groupCompanies } from '../../data/company'
import { useParallax } from '../../hooks/useScrollFrame'
import { Img } from '../ui/Img'
import { Eyebrow, Lines, delay } from '../ui/Typography'

export function BrandStory() {
  const frame = useRef<HTMLDivElement>(null)
  const inner = useRef<HTMLDivElement>(null)
  useParallax(frame, inner, 7)

  return (
    <section
      id="about"
      aria-labelledby="about-title"
      className="screen on-light bg-ivory max-lg:pt-12 max-lg:pb-28 text-ink"
    >
      <div className="shell grid gap-14 lg:grid-cols-12 lg:items-center lg:gap-8">
        <figure className="order-2 lg:order-1 lg:col-span-6">
          <div
            ref={frame}
            data-reveal="image"
            className="relative aspect-[4/3] overflow-hidden bg-navy-900 lg:aspect-auto lg:h-[min(62svh,36rem)] [@media(max-height:50rem)]:lg:h-[52svh]"
          >
            <div ref={inner} className="absolute -inset-y-[8%] inset-x-0 will-change-transform">
              <Img
                group="scenes"
                name="collection-still-life"
                alt="The Classic range composed on marble and navy plinths — floor tiles, pavers, a grass paver, kerb, drain and bollards"
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="h-full w-full object-cover object-[50%_45%]"
              />
            </div>
          </div>
          <figcaption className="meta mt-4 flex flex-wrap justify-between gap-x-6 gap-y-1 text-stone-600">
            <span>The Classic range</span>
            <span className="tabular">IDA Nacharam, Hyderabad</span>
          </figcaption>
        </figure>

        <div className="order-1 lg:order-2 lg:col-span-5 lg:col-start-8">
          <Eyebrow className="text-bronze">About Classic</Eyebrow>
          <Lines
            id="about-title"
            lines={['A legacy that', 'shapes the built', 'environment.']}
            className="serif mt-6 text-h2 text-navy-900 lg:mt-7 [@media(max-height:50rem)]:lg:mt-4 [@media(max-height:50rem)]:lg:text-[2.1rem]"
          />
          <p
            data-reveal
            className="mt-7 text-lead text-navy-900 lg:mt-8 [@media(max-height:50rem)]:lg:mt-5 [@media(max-height:50rem)]:lg:text-[0.9375rem]"
          >
            Since {company.since}, Classic has been making the surfaces Hyderabad builds on. Through Classic Designer
            Tiles (P) Ltd., the group manufactures cement designer floor tiles, paver blocks, kerb stones and more from
            its office and factory at IDA Nacharam.
          </p>
          <p
            data-reveal
            style={delay(120)}
            className="mt-4 text-[0.9375rem] text-ink-soft [@media(max-height:50rem)]:lg:mt-3 [@media(max-height:50rem)]:lg:text-[0.8125rem]"
          >
            Its materials are part of the city’s landmarks — the Telangana Secretariat, Hyderabad Metro Rail stations,
            Secunderabad Railway Station — and of the institutions, campuses and homes around them.
          </p>

          <dl className="mt-8 border-t border-navy-900/15 [@media(max-height:50rem)]:lg:mt-5">
            {groupCompanies.map((g, i) => (
              <div
                key={g.name}
                data-reveal
                style={delay(160 + i * 90)}
                className="border-b border-navy-900/15 py-3.5 [@media(max-height:50rem)]:lg:py-2.5"
              >
                <dt className="serif text-[1.0625rem] leading-tight text-navy-900">{g.name}</dt>
                <dd className="mt-1 text-[0.8125rem] text-ink-soft">{g.activity}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  )
}
