import { useState } from 'react'
import { applications } from '../../data/applications'
import { collectionById } from '../../data/collections'
import { Img } from '../ui/Img'
import { Eyebrow, Lines, delay } from '../ui/Typography'

/**
 * Sells the experience of the material. On desktop it fits one screen: the
 * four sectors are a list of tabs and the framed image crossfades to the one
 * chosen; on smaller screens every sector carries its own image.
 */
export function ApplicationSection() {
  const [active, setActive] = useState(0)

  return (
    <section aria-labelledby="application-title" className="screen bg-navy-950 max-lg:py-28 text-ivory">
      <div className="shell">
        <div className="grid gap-10 lg:grid-cols-12 lg:items-end lg:gap-8">
          <div className="lg:col-span-7">
            <Eyebrow className="text-gold">Application</Eyebrow>
            <Lines
              id="application-title"
              lines={['Materials that', 'define space.']}
              className="serif mt-6 text-h2 lg:mt-7"
            />
          </div>
          <p data-reveal className="max-w-[36ch] text-ivory/70 lg:col-span-4 lg:col-start-9 lg:pb-2">
            Classic materials are at work across homes, civic campuses, transit infrastructure and public landscapes —
            surfaces that become part of the architecture around them.
          </p>
        </div>

        <div className="mt-16 grid gap-8 lg:mt-[clamp(1.5rem,5vh,3.5rem)] lg:grid-cols-12 lg:items-start">
          <div className="hidden lg:col-span-7 lg:block">
            <div className="relative h-[min(54svh,36rem)] w-full overflow-hidden bg-navy-900">
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
            {applications.map((a, i) => {
              const on = i === active
              return (
                <li key={a.id} className="border-t border-ivory/12 py-12 lg:py-0">
                  <div className="mb-8 aspect-[4/3] overflow-hidden bg-navy-900 lg:hidden" data-reveal="image">
                    <Img group="scenes" name={a.scene} alt="" sizes="100vw" className="h-full w-full object-cover" />
                  </div>
                  <button
                    type="button"
                    onClick={() => setActive(i)}
                    onMouseEnter={() => setActive(i)}
                    onFocus={() => setActive(i)}
                    aria-expanded={on}
                    aria-controls={`application-${a.id}`}
                    className="flex w-full items-baseline gap-4 text-left lg:py-[clamp(0.6rem,1.6vh,1rem)]"
                  >
                    <span
                      className={`tabular text-[0.6875rem] tracking-[0.2em] transition-colors duration-700 ${
                        on ? 'text-gold' : 'text-ivory/40'
                      }`}
                    >
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <h3
                      className={`serif text-h3 transition-colors duration-700 lg:text-[clamp(1.25rem,1.8vw,1.75rem)] ${
                        on ? 'text-ivory' : 'lg:text-ivory/40 lg:hover:text-ivory/70'
                      }`}
                    >
                      {a.title}
                    </h3>
                  </button>
                  <div
                    id={`application-${a.id}`}
                    className={`grid transition-[grid-template-rows,opacity] duration-700 ease-[var(--ease-luxe)] ${
                      on ? 'grid-rows-[1fr] opacity-100' : 'lg:grid-rows-[0fr] lg:opacity-0'
                    }`}
                  >
                    <div className="min-h-0 overflow-hidden">
                      <p
                        data-reveal
                        style={delay(80)}
                        className="mt-5 max-w-[38ch] text-ivory/70 lg:mt-1 lg:text-[0.9375rem]"
                      >
                        {a.line}
                      </p>
                      <dl
                        data-reveal
                        style={delay(160)}
                        className="mt-8 space-y-5 text-[0.875rem] lg:mt-4 lg:mb-5 lg:space-y-3 lg:text-[0.8125rem]"
                      >
                        <div>
                          <dt className="meta text-[0.625rem] text-gold">Shown</dt>
                          <dd className="mt-1.5 text-ivory/80">
                            {a.collections.map((c) => collectionById[c].title.replace('Classic ', '')).join(' · ')}
                          </dd>
                        </div>
                        <div>
                          <dt className="meta text-[0.625rem] text-gold">Clients in this sector include</dt>
                          <dd className="mt-1.5 text-ivory/80">{a.clients.join(' · ')}</dd>
                        </div>
                      </dl>
                    </div>
                  </div>
                </li>
              )
            })}
          </ol>
        </div>
      </div>
    </section>
  )
}
