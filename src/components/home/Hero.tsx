import { useEffect, useRef, useState } from 'react'
import { company } from '../../data/company'
import { mediaEntry, mediaSrc, mediaSrcSet } from '../../lib/media'
import { useScrollFrame } from '../../hooks/useScrollFrame'
import { useReducedMotion } from '../../hooks/useMediaQuery'
import { ButtonLink } from '../ui/Button'
import { delay } from '../ui/Typography'

const LANDSCAPE = 'square-driveway'
const PORTRAIT = 'square-driveway-portrait'

export function Hero() {
  const media = useRef<HTMLDivElement>(null)
  const content = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const id = requestAnimationFrame(() => setReady(true))
    return () => cancelAnimationFrame(id)
  }, [])

  // Image sinks slower than the page; the copy lifts and fades as you leave.
  useScrollFrame((y) => {
    const vh = window.innerHeight
    if (y > vh * 1.2) return
    if (media.current) media.current.style.transform = `translate3d(0, ${(y * 0.32).toFixed(1)}px, 0)`
    if (content.current) {
      content.current.style.transform = `translate3d(0, ${(y * -0.12).toFixed(1)}px, 0)`
      content.current.style.opacity = String(Math.max(0, 1 - y / (vh * 0.75)))
    }
  }, !reduced)

  const land = mediaEntry('scenes', LANDSCAPE)

  return (
    <section
      aria-labelledby="hero-title"
      className={`relative isolate flex min-h-[100svh] items-end overflow-hidden bg-navy-950 pt-[calc(var(--nav-h)+3rem)] text-ivory ${ready ? 'is-in' : ''}`}
    >
      <div ref={media} className="absolute inset-0 -z-10 will-change-transform">
        <picture>
          <source media="(max-width: 767.98px)" srcSet={mediaSrcSet('scenes', PORTRAIT)} sizes="100vw" />
          <img
            src={mediaSrc('scenes', LANDSCAPE)}
            srcSet={mediaSrcSet('scenes', LANDSCAPE)}
            sizes="100vw"
            width={land.w}
            height={land.h}
            alt="A courtyard driveway laid in Classic designer square pavers, framed by palms at sunrise"
            fetchPriority="high"
            decoding="async"
            className="hero-media h-full w-full object-cover object-[50%_60%]"
          />
        </picture>
        <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-navy-950/95 via-navy-950/45 to-navy-950/20" />
        <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-r from-navy-950/55 via-transparent to-transparent" />
      </div>

      <div ref={content} className="shell relative w-full pb-24 will-change-transform md:pb-32 lg:pb-[clamp(6rem,11vh,9rem)]">
        <p data-reveal="fade" style={delay(450)} className="eyebrow flex items-center gap-4 text-gold-soft">
          <span aria-hidden="true" className="h-px w-10 shrink-0 bg-gold" />
          <span className="whitespace-nowrap">Classic Hyderabad</span>
          <span aria-hidden="true" className="text-ivory/40">—</span>
          <span className="whitespace-nowrap text-ivory/70">Since {company.since}</span>
        </p>

        <div className="mt-7 grid gap-10 lg:mt-9 lg:grid-cols-12 lg:items-end lg:gap-8">
          <h1 id="hero-title" className="serif text-hero lg:col-span-8">
            {['Designer Tiles', '& Architectural', 'Materials'].map((line, i) => (
              <span key={line} className="line-mask">
                <span style={delay(120 + i * 90)} className="!duration-[1150ms]">
                  {i === 1 ? (
                    <>
                      <em className="text-gold-soft not-italic">&amp;</em> Architectural
                    </>
                  ) : (
                    line
                  )}
                </span>
              </span>
            ))}
          </h1>

          <div className="lg:col-span-4 lg:col-start-9 lg:pb-3">
            <p data-reveal style={delay(420)} className="max-w-[36ch] !duration-[800ms] text-[1.0625rem] leading-relaxed text-ivory/80">
              Since {company.since}, Classic has shaped Hyderabad’s floors, pathways and façades — from the Telangana
              Secretariat to the city’s metro stations.
            </p>
            <div data-reveal style={delay(560)} className="mt-9 flex flex-wrap gap-3">
              <ButtonLink to="/products" tone="ivory">
                Explore Collection
              </ButtonLink>
              <ButtonLink to="/#about" tone="outline-light" arrow={false}>
                Discover Classic
              </ButtonLink>
            </div>
          </div>
        </div>
      </div>

      <div className="shell pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-between pb-7 text-ivory/60">
        <div data-reveal="fade" style={delay(1200)} className="flex items-center gap-4">
          <span aria-hidden="true" className="relative block h-12 w-px overflow-hidden bg-ivory/20">
            <span className="absolute inset-0 animate-scroll-cue bg-ivory" />
          </span>
          <span className="meta text-[0.625rem]">Scroll</span>
        </div>
        <p data-reveal="fade" style={delay(1300)} className="meta hidden text-right text-[0.625rem] sm:block">
          In view <span className="mx-2 text-gold">/</span> Designer Square Pavers
        </p>
      </div>
    </section>
  )
}
