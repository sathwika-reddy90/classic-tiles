import { useRef, useState, type PointerEvent } from 'react'
import { featuredProjects, registers, registerTotal, type Register } from '../../data/projects'
import { useFinePointer, useIsDesktop, useReducedMotion } from '../../hooks/useMediaQuery'
import { Img } from '../ui/Img'
import { Eyebrow, Lines, delay } from '../ui/Typography'

/**
 * The catalogue's project photographs are small, so they are shown at the
 * size they hold up at: as a preview that follows the cursor across a
 * typographic index on desktop, and as inline thumbnails on touch screens.
 */
export function ProjectShowcase() {
  const fine = useFinePointer()
  const desktop = useIsDesktop()
  const [register, setRegister] = useState(0)
  const reduced = useReducedMotion()
  const [hover, setHover] = useState<number | null>(null)
  const preview = useRef<HTMLDivElement>(null)
  const target = useRef({ x: 0, y: 0 })
  const pos = useRef({ x: 0, y: 0 })
  const frame = useRef(0)

  const follow = () => {
    const el = preview.current
    if (!el) return
    const k = reduced ? 1 : 0.14
    pos.current.x += (target.current.x - pos.current.x) * k
    pos.current.y += (target.current.y - pos.current.y) * k
    el.style.transform = `translate3d(${pos.current.x}px, ${pos.current.y}px, 0) translate(-50%, -50%)`
    if (Math.abs(target.current.x - pos.current.x) + Math.abs(target.current.y - pos.current.y) > 0.5) {
      frame.current = requestAnimationFrame(follow)
    } else frame.current = 0
  }

  const onMove = (e: PointerEvent<HTMLElement>) => {
    const box = e.currentTarget.getBoundingClientRect()
    target.current = { x: e.clientX - box.left, y: e.clientY - box.top }
    if (hover === null) pos.current = { ...target.current }
    if (!frame.current) frame.current = requestAnimationFrame(follow)
  }

  return (
    <section id="projects" aria-labelledby="projects-title" className="screen on-light bg-ivory max-lg:py-28 text-ink">
      <div className="shell">
        <div className="grid gap-10 lg:grid-cols-12 lg:items-end lg:gap-8">
          <div className="lg:col-span-8">
            <Eyebrow className="text-bronze">Prestigious Projects</Eyebrow>
            <Lines
              id="projects-title"
              lines={['Trusted across', 'the city’s landmarks.']}
              className="serif mt-6 text-h2 text-navy-900 lg:mt-7"
            />
          </div>
          <p
            data-reveal
            className="max-w-[34ch] text-ink-soft lg:col-span-3 lg:col-start-10 lg:pb-2 lg:text-[0.9375rem]"
          >
            From the Telangana Secretariat to metro stations and railway concourses — works photographed for the Classic
            catalogue.
          </p>
        </div>

        <div className="lg:mt-[clamp(1.5rem,5vh,3.5rem)] lg:grid lg:grid-cols-12 lg:items-start lg:gap-8">
          <div
            className="relative mt-20 lg:col-span-5 lg:mt-0 xl:col-span-6"
            onPointerMove={fine ? onMove : undefined}
            onPointerLeave={() => setHover(null)}
          >
            <ol className="border-t border-navy-900/15">
              {featuredProjects.map((p, i) => (
                <li
                  key={p.id}
                  data-reveal
                  style={delay((i % 4) * 70)}
                  onPointerEnter={() => setHover(i)}
                  className="group border-b border-navy-900/15"
                >
                  <div
                    className={`grid items-center gap-x-4 py-6 lg:py-[clamp(0.3rem,1.2vh,0.85rem)] ${
                      fine
                        ? 'grid-cols-[2.25rem_1fr] sm:grid-cols-[3rem_1fr_auto] lg:grid-cols-[1.75rem_1fr_6.5rem] xl:grid-cols-[3rem_1fr_10rem]'
                        : 'grid-cols-[1.75rem_1fr_7.5rem] sm:grid-cols-[3rem_1fr_10rem]'
                    }`}
                  >
                    <span className="tabular text-[0.6875rem] tracking-[0.2em] text-stone-500">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <h3
                      className={`serif text-[clamp(1.3rem,2.5vw,2.5rem)] leading-[1.15] lg:text-[clamp(1rem,1.55vw,1.5rem)] text-navy-900 transition-[transform,color] duration-700 ease-[var(--ease-luxe)] ${
                        fine && hover !== null && hover !== i ? 'text-navy-900/35' : ''
                      } ${fine && hover === i ? 'translate-x-3' : ''}`}
                    >
                      {p.name}
                    </h3>
                    {fine ? (
                      <p className="meta col-start-2 mt-2 text-stone-600 sm:col-start-3 sm:mt-0 sm:text-right">
                        {p.sector}
                      </p>
                    ) : (
                      <>
                        <div className="col-start-3 row-span-2 row-start-1 aspect-[4/3] overflow-hidden bg-stone-300">
                          <Img
                            group="projects"
                            name={p.id}
                            alt={p.name}
                            sizes="10rem"
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <p className="meta col-start-2 row-start-2 mt-1 self-start text-stone-600">{p.sector}</p>
                      </>
                    )}
                  </div>
                </li>
              ))}
            </ol>

            {fine && (
              <div
                ref={preview}
                aria-hidden="true"
                className={`pointer-events-none absolute top-0 left-0 z-10 w-[clamp(15rem,20vw,19rem)] transition-[opacity,scale] duration-500 ease-[var(--ease-luxe)] ${
                  hover === null ? 'scale-90 opacity-0' : 'scale-100 opacity-100'
                }`}
              >
                <div className="relative aspect-[16/11] overflow-hidden bg-navy-900 shadow-[0_40px_80px_-30px_rgba(6,13,28,0.55)]">
                  {featuredProjects.map((p, i) => (
                    <Img
                      key={p.id}
                      group="projects"
                      name={p.id}
                      alt=""
                      sizes="22rem"
                      className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ${hover === i ? '!opacity-100' : '!opacity-0'}`}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          {desktop ? (
            <div className="lg:col-span-7 xl:col-span-6">
              <div className="flex items-end justify-between gap-6">
                <h3 data-reveal className="serif text-[1.25rem] text-navy-900">
                  Project &amp; client register
                </h3>
                <p data-reveal className="meta tabular text-[0.625rem] text-stone-600">
                  {registerTotal} entries, as listed in the catalogue
                </p>
              </div>
              <div role="tablist" aria-label="Registers" className="mt-4 grid grid-cols-3 border-y border-navy-900/15">
                {registers.map((r, i) => (
                  <button
                    key={r.id}
                    type="button"
                    role="tab"
                    id={`register-tab-${r.id}`}
                    aria-selected={register === i}
                    aria-controls={`register-${r.id}`}
                    onClick={() => setRegister(i)}
                    className={`border-b-2 px-1 py-3 text-left text-[0.625rem] font-semibold tracking-[0.08em] uppercase transition-colors ${
                      register === i
                        ? 'border-bronze text-navy-900'
                        : 'border-transparent text-stone-500 hover:text-navy-900'
                    }`}
                  >
                    {r.id === 'government' ? 'Government' : r.id === 'private' ? 'Private & infra' : 'Institutions'}
                    <span className="tabular ml-2 text-stone-500">{r.entries.length}</span>
                  </button>
                ))}
              </div>
              {registers.map((r, i) => (
                <div
                  key={r.id}
                  id={`register-${r.id}`}
                  role="tabpanel"
                  aria-labelledby={`register-tab-${r.id}`}
                  hidden={register !== i}
                  className="pt-4"
                >
                  <p className="meta text-[0.625rem] text-bronze">{r.subtitle}</p>
                  <p className="serif mt-1 text-[0.9375rem] leading-tight text-navy-900">{r.title}</p>
                  <ul className="mt-3 columns-3 gap-5 text-[0.75rem] leading-[1.65] text-ink-soft [@media(max-height:50rem)]:leading-[1.5]">
                    {r.entries.map((e) => (
                      <li key={e} className="break-inside-avoid">
                        {e}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          ) : (
            <div className="mt-28">
              <div className="flex flex-wrap items-end justify-between gap-6">
                <h3 data-reveal className="serif text-h3 text-navy-900">
                  Project & client register
                </h3>
                <p data-reveal className="meta tabular text-stone-600">
                  {registerTotal} entries, as listed in the catalogue
                </p>
              </div>
              <div className="mt-10 border-t border-navy-900/15">
                {registers.map((r) => (
                  <details key={r.id} className="group/reg border-b border-navy-900/15">
                    <summary className="flex cursor-pointer list-none items-start justify-between gap-4 py-6 [&::-webkit-details-marker]:hidden">
                      <RegisterHeading register={r} />
                      <span
                        aria-hidden="true"
                        className="serif mt-5 text-[1.75rem] leading-none text-bronze transition-transform duration-500 group-open/reg:rotate-45"
                      >
                        +
                      </span>
                    </summary>
                    <RegisterList register={r} />
                  </details>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

function RegisterHeading({ register }: { register: Register }) {
  return (
    <span className="block">
      <span className="meta flex items-center gap-3 text-bronze">
        {register.subtitle}
        <span className="tabular text-stone-500">{register.entries.length}</span>
      </span>
      <span className="serif mt-2 block text-[1.15rem] leading-tight text-navy-900">{register.title}</span>
    </span>
  )
}

function RegisterList({ register }: { register: Register }) {
  return (
    <ul className="pb-8 text-[0.9375rem] leading-[1.9] text-ink-soft md:mt-6">
      {register.entries.map((e) => (
        <li key={e}>{e}</li>
      ))}
    </ul>
  )
}
