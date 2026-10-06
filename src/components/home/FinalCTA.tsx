import { useRef } from 'react'
import { useParallax } from '../../hooks/useScrollFrame'
import { ButtonLink } from '../ui/Button'
import { Img } from '../ui/Img'
import { Lines, delay } from '../ui/Typography'

export function FinalCTA() {
  const frame = useRef<HTMLElement>(null)
  const inner = useRef<HTMLDivElement>(null)
  useParallax(frame, inner, 12)

  return (
    <section
      ref={frame}
      aria-labelledby="cta-title"
      className="relative isolate flex min-h-[640px] items-center overflow-hidden bg-navy-950 py-32 text-ivory h-[100svh]"
    >
      <div ref={inner} className="absolute -inset-y-[14%] inset-x-0 -z-10 will-change-transform">
        <Img
          group="scenes"
          name="jali-wall"
          alt="A boundary wall of Classic partition and elevation jalies above a kerbed lawn at dusk"
          sizes="100vw"
          className="h-full w-full object-cover object-[60%_50%]"
        />
        <div aria-hidden="true" className="absolute inset-0 bg-navy-950/60" />
        <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-r from-navy-950/80 via-navy-950/30 to-transparent" />
      </div>

      <div className="shell">
        <Lines
          as="h2"
          id="cta-title"
          lines={['Define', 'your', <em key="s" className="text-gold-soft">space.</em>]}
          stagger={120}
          className="serif text-[clamp(4.25rem,13vw,13.5rem)] leading-[0.84] tracking-[-0.015em]"
        />
        <p data-reveal style={delay(300)} className="mt-10 max-w-[34ch] text-lead text-ivory/80">
          Explore the Classic collection of architectural surfaces and materials.
        </p>
        <div data-reveal style={delay(420)} className="mt-10 flex flex-wrap gap-3">
          <ButtonLink to="/products" tone="ivory">
            Explore Products
          </ButtonLink>
          <ButtonLink to="/#contact" tone="outline-light" arrow={false}>
            Contact Classic
          </ButtonLink>
        </div>
      </div>
    </section>
  )
}
