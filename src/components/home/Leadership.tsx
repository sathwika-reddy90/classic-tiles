import { leadership, recognitions } from '../../data/company'
import { Img } from '../ui/Img'
import { Eyebrow, Lines, delay } from '../ui/Typography'

export function Leadership() {
  return (
    <section aria-labelledby="leadership-title" className="bg-navy-900 py-28 text-ivory [--reveal-bg:var(--color-navy-900)] lg:py-40">
      <div className="shell">
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-8">
          <div className="flex flex-col lg:col-span-5">
            <Eyebrow className="text-gold">Leadership</Eyebrow>
            <Lines id="leadership-title" lines={['The people', 'behind Classic.']} className="serif mt-8 text-h2" />

            <ul className="mt-14 space-y-10 lg:mt-auto lg:pt-16">
              {leadership.map((person, i) => (
                <li key={person.name} data-reveal style={delay(i * 120)} className="border-t border-ivory/15 pt-6">
                  <p className="serif text-[clamp(1.9rem,2.6vw,2.6rem)] leading-tight">{person.name}</p>
                  <p className="meta mt-2 text-gold">{person.role}</p>
                  {'note' in person && <p className="mt-3 text-[0.9375rem] text-ivory/65">{person.note}</p>}
                </li>
              ))}
            </ul>
          </div>

          <figure className="lg:col-span-6 lg:col-start-7">
            <div data-reveal="image" className="relative aspect-[17/13] overflow-hidden bg-[#0c2350]">
              <Img
                group="scenes"
                name="leadership"
                alt="Ln. Tallada Venkanna, Founder Chairman & Managing Director, with Director Tallada Sunil"
                sizes="(min-width: 1024px) 46vw, 100vw"
                className="h-full w-full object-cover"
              />
              <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-navy-900/70 to-transparent" />
            </div>
            <figcaption className="meta mt-4 text-ivory/50">Ln. Tallada Venkanna · Tallada Sunil</figcaption>
          </figure>
        </div>

        <div className="mt-24 lg:mt-32">
          <h3 className="eyebrow text-gold" data-reveal>
            Recognition
          </h3>
          <ol className="mt-8 grid gap-10 border-t border-ivory/15 pt-10 md:grid-cols-3 md:gap-8">
            {recognitions.map((r, i) => (
              <li key={r.title} data-reveal style={delay(i * 120)}>
                <span className="tabular text-[0.6875rem] tracking-[0.2em] text-gold">0{i + 1}</span>
                <p className="serif mt-4 text-[1.6rem] leading-tight">{r.title}</p>
                <p className="mt-3 max-w-[40ch] text-[0.875rem] leading-relaxed text-ivory/60">{r.detail}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}
