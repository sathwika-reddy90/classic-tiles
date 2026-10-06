import { useEffect, useRef, useState } from 'react'
import { applications } from '../../data/applications'
import { collectionById } from '../../data/collections'
import { Img } from '../ui/Img'
import { Eyebrow, Lines, delay } from '../ui/Typography'

/**
 * Sells the experience of the material. On desktop a framed image holds
 * still while the sectors scroll past and crossfades to each in turn; on
 * smaller screens every sector carries its own image.
 */
export function ApplicationSection() {
  const [active, setActive] = useState(0)
  const items = useRef<(HTMLLIElement | null)[]>([])

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) setActive(Number((e.target as HTMLElement).dataset.index))
        }
      },
      { rootMargin: '-45% 0px -45% 0px' },
    )
    items.current.forEach((el) => el && io.observe(el))
    return () => io.disconnect()
  }, [])

  return (
    <section aria-labelledby="application-title" className="bg-navy-950 py-28 text-ivory lg:py-44">
      <div className="shell">
        <div className="grid gap-10 lg:grid-cols-12 lg:items-end lg:gap-8">
          <div className="lg:col-span-7">
            <Eyebrow className="text-gold">Application</Eyebrow>
            <Lines id="application-title" lines={['Materials', 'that define', 'space.']} className="serif mt-8 text-h1" />
          </div>
          <p data-reveal className="max-w-[36ch] text-ivory/70 lg:col-span-4 lg:col-start-9 lg:pb-3">
            Classic materials are at work across homes, civic campuses, transit infrastructure and public landscapes —
            surfaces that become part of the architecture around them.
          </p>
        </div>

        <div className="mt-20 grid gap-8 lg:mt-28 lg:grid-cols-12">
          <div className="hidden lg:col-span-7 lg:block">
            <div className="sticky top-[calc(50vh-min(36vh,26rem))] aspect-[4/3] max-h-[min(72vh,52rem)] w-full overflow-hidden bg-navy-900">
              {applications.map((a, i) => (
                <div
                  key={a.id}
                  aria-hidden={i !== active}
                  className={`absolute inset-0 transition-[opacity,transform] duration-[1400ms] ease-[var(--ease-luxe)] ${
                    i === active ? 'scale-100 opacity-100' : 'scale-[1.06] opacity-0'
                  }`}
                >
                  <Img group="scenes" name={a.scene} alt="" sizes="58vw" className="h-full w-full object-cover" />
                </div>
              ))}
              <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-navy-950/50 to-transparent" />
              <p className="meta tabular absolute bottom-6 left-6 text-ivory/80">
                {String(active + 1).padStart(2, '0')} <span className="mx-2 text-gold">/</span>{' '}
                {String(applications.length).padStart(2, '0')}
              </p>
            </div>
          </div>

          <ol className="lg:col-span-4 lg:col-start-9">
            {applications.map((a, i) => (
              <li
                key={a.id}
                ref={(el) => {
                  items.current[i] = el
                }}
                data-index={i}
                className="flex flex-col justify-center border-t border-ivory/12 py-12 lg:min-h-[78vh] lg:py-0"
              >
                <div className="mb-8 aspect-[4/3] overflow-hidden bg-navy-900 lg:hidden" data-reveal="image">
                  <Img group="scenes" name={a.scene} alt="" sizes="100vw" className="h-full w-full object-cover" />
                </div>
                <span
                  className={`tabular text-[0.6875rem] tracking-[0.2em] transition-colors duration-700 ${
                    i === active ? 'text-gold' : 'text-ivory/40'
                  }`}
                >
                  {String(i + 1).padStart(2, '0')}
                </span>
                <h3
                  className={`serif mt-4 text-h3 transition-colors duration-700 lg:text-[clamp(2.25rem,3.2vw,3.5rem)] ${
                    i === active ? 'text-ivory' : 'lg:text-ivory/35'
                  }`}
                >
                  {a.title}
                </h3>
                <p data-reveal style={delay(80)} className="mt-5 max-w-[38ch] text-ivory/70">
                  {a.line}
                </p>
                <dl data-reveal style={delay(160)} className="mt-8 space-y-5 text-[0.875rem]">
                  <div>
                    <dt className="meta text-[0.625rem] text-gold">Shown</dt>
                    <dd className="mt-2 text-ivory/80">
                      {a.collections.map((c) => collectionById[c].title.replace('Classic ', '')).join(' · ')}
                    </dd>
                  </div>
                  <div>
                    <dt className="meta text-[0.625rem] text-gold">Clients in this sector include</dt>
                    <dd className="mt-2 text-ivory/80">{a.clients.join(' · ')}</dd>
                  </div>
                </dl>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}
