import { useRef } from 'react'
import { collections } from '../../data/collections'
import { company, groupCompanies } from '../../data/company'
import { registerTotal } from '../../data/projects'
import { useParallax } from '../../hooks/useScrollFrame'
import { Img } from '../ui/Img'
import { Eyebrow, Lines, delay } from '../ui/Typography'

const stats = [
  { label: 'Since', value: String(company.since) },
  { label: 'Product collections', value: String(collections.length) },
  { label: 'Projects & clients on record', value: String(registerTotal) },
  { label: 'Certified', value: company.certification, small: true },
]

export function BrandStory() {
  const frame = useRef<HTMLDivElement>(null)
  const inner = useRef<HTMLDivElement>(null)
  useParallax(frame, inner, 7)

  return (
    <section id="about" aria-labelledby="about-title" className="on-light bg-ivory py-28 text-ink lg:py-44">
      <div className="shell">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-3 lg:pt-5">
            <Eyebrow className="text-bronze">About Classic</Eyebrow>
          </div>
          <Lines
            id="about-title"
            lines={['A legacy that', 'shapes the built', 'environment.']}
            className="serif text-h1 text-navy-900 lg:col-span-9"
          />
        </div>

        <div className="mt-16 grid gap-14 lg:mt-24 lg:grid-cols-12 lg:gap-8">
          <figure className="lg:col-span-7">
            <div ref={frame} data-reveal="image" className="relative aspect-[4/3] overflow-hidden bg-navy-900">
              <div ref={inner} className="absolute -inset-y-[8%] inset-x-0 will-change-transform">
                <Img
                  group="scenes"
                  name="collection-still-life"
                  alt="The Classic range composed on marble and navy plinths — floor tiles, pavers, a grass paver, kerb, drain and bollards"
                  sizes="(min-width: 1024px) 58vw, 100vw"
                  className="h-full w-full object-cover object-[50%_45%]"
                />
              </div>
            </div>
            <figcaption className="meta mt-4 flex flex-wrap justify-between gap-x-6 gap-y-1 text-stone-600">
              <span>The Classic range</span>
              <span className="tabular">IDA Nacharam, Hyderabad</span>
            </figcaption>
          </figure>

          <div className="lg:col-span-4 lg:col-start-9 lg:pt-20">
            <p data-reveal className="text-lead text-navy-900">
              Since {company.since}, Classic has been making the surfaces Hyderabad builds on. Through Classic Designer
              Tiles (P) Ltd., the group manufactures cement designer floor tiles, paver blocks, kerb stones and more from
              its office and factory at IDA Nacharam.
            </p>
            <p data-reveal style={delay(120)} className="mt-6 text-ink-soft">
              Its materials are part of the city’s landmarks — the Telangana Secretariat, Hyderabad Metro Rail stations,
              Secunderabad Railway Station — and of the institutions, campuses and homes around them.
            </p>

            <dl className="mt-12 border-t border-navy-900/15">
              {groupCompanies.map((g, i) => (
                <div key={g.name} data-reveal style={delay(160 + i * 90)} className="border-b border-navy-900/15 py-5">
                  <dt className="serif text-[1.45rem] leading-tight text-navy-900">{g.name}</dt>
                  <dd className="mt-1.5 text-[0.875rem] text-ink-soft">{g.activity}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>

        <dl className="mt-24 grid grid-cols-2 gap-y-12 border-t border-navy-900/15 lg:mt-32 lg:grid-cols-4">
          {stats.map((s, i) => (
            <div
              key={s.label}
              data-reveal
              style={delay(i * 110)}
              className={`pt-8 pr-6 ${i % 2 ? 'pl-6 border-l border-navy-900/15' : ''} lg:px-8 ${i ? 'lg:border-l lg:border-navy-900/15' : 'lg:pl-0'}`}
            >
              <dt className="meta text-stone-600">{s.label}</dt>
              <dd
                className={`serif tabular mt-4 leading-none text-navy-900 ${
                  s.small ? 'text-[clamp(1.6rem,2.4vw,2.4rem)] pt-2' : 'text-[clamp(3rem,5.5vw,5.5rem)]'
                }`}
              >
                {s.value}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}
