import { leadership, recognitions } from '../../data/company'
import { Img } from '../ui/Img'
import { Eyebrow, Lines, delay } from '../ui/Typography'

export function Leadership() {
  return (
    <section
      aria-labelledby="leadership-title"
      className="screen bg-navy-900 max-lg:py-28 text-ivory [--reveal-bg:var(--color-navy-900)]"
    >
      <div className="shell">
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-8">
          <div className="flex flex-col lg:col-span-5">
            <Eyebrow className="text-gold">Leadership</Eyebrow>
            <Lines
              id="leadership-title"
              lines={['The people', 'behind Classic.']}
              className="serif mt-6 text-h2 lg:mt-7"
            />

            <ul className="mt-14 space-y-10 lg:mt-auto lg:space-y-6 lg:pt-8 [@media(max-height:50rem)]:lg:space-y-4 [@media(max-height:50rem)]:lg:pt-5">
              {leadership.map((person, i) => (
                <li
                  key={person.name}
                  data-reveal
                  style={delay(i * 120)}
                  className="border-t border-ivory/15 pt-6 lg:pt-4"
                >
                  <p className="serif text-[clamp(1.4rem,1.9vw,1.9rem)] leading-tight">{person.name}</p>
                  <p className="meta mt-2 text-gold">{person.role}</p>
                  {'note' in person && <p className="mt-3 text-[0.9375rem] text-ivory/65">{person.note}</p>}
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-6 lg:col-start-7 lg:grid lg:justify-items-end">
            <div className="lg:w-fit">
              <div
                data-reveal="image"
                className="relative aspect-[1240/1016] overflow-hidden bg-[#0c2350] lg:h-[min(54svh,36rem)] lg:max-w-full [@media(max-height:50rem)]:lg:h-[46svh]"
              >
                <Img
                  group="scenes"
                  name="leadership-named"
                  alt="Ln. Tallada Venkanna, Founder Chairman & Managing Director, with Director Tallada Sunil"
                  sizes="(min-width: 1024px) 46vw, 100vw"
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-24 lg:mt-[clamp(1.5rem,4.5vh,3.5rem)]">
          <h3 className="eyebrow text-gold" data-reveal>
            Recognition
          </h3>
          <ol className="mt-8 grid gap-10 border-t border-ivory/15 pt-10 md:grid-cols-3 md:gap-8 lg:mt-4 lg:pt-5">
            {recognitions.map((r, i) => (
              <li key={r.title} data-reveal style={delay(i * 120)}>
                <span className="tabular text-[0.6875rem] tracking-[0.2em] text-gold">0{i + 1}</span>
                <p className="serif mt-4 text-[1.2rem] leading-tight lg:mt-2 lg:text-[1.05rem]">{r.title}</p>
                <p className="mt-3 max-w-[40ch] text-[0.875rem] leading-relaxed text-ivory/60 lg:mt-2 lg:text-[0.8125rem]">
                  {r.detail}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}
