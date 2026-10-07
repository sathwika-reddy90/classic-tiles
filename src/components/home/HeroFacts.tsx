import { company } from '../../data/company'
import { products } from '../../data/products'
import { delay } from '../ui/Typography'

/** The strip along the bottom edge: the same figures as the stats band below, and the range. */
const facts = [
  { value: `${new Date().getFullYear() - company.since}+`, label: 'Years manufacturing' },
  { value: String(products.length), label: 'Catalogue designs' },
  { value: company.certification, label: 'Certified' },
]
const makes = ['Designer tiles', 'Pavers', 'Kerbs & drains', 'Jalies']

/** Supporting facts and range along the bottom edge of every campaign frame (desktop only). */
export function HeroFacts({ delayMs = 0 }: { delayMs?: number }) {
  return (
    <div
      data-reveal="fade"
      style={delay(delayMs)}
      className="shell pointer-events-none absolute inset-x-0 bottom-0 hidden lg:block"
    >
      <div className="flex items-center justify-between gap-8 border-t border-ivory/20 py-5">
        <dl className="flex items-center gap-8">
          {facts.map((f, i) => (
            <div key={f.label} className={`flex items-baseline gap-3 ${i ? 'border-l border-ivory/20 pl-8' : ''}`}>
              <dd className="tabular text-[1.25rem] leading-none font-bold whitespace-nowrap text-ivory">
                {f.value}
              </dd>
              <dt className="text-[0.625rem] font-medium tracking-[0.14em] whitespace-nowrap text-ivory/65 uppercase">
                {f.label}
              </dt>
            </div>
          ))}
        </dl>
        <p className="hidden items-center gap-4 text-[0.625rem] font-medium tracking-[0.14em] whitespace-nowrap text-ivory/65 uppercase xl:flex">
          {makes.map((m, i) => (
            <span key={m} className="flex items-center gap-4">
              {i > 0 && <span aria-hidden="true" className="size-[3px] rounded-full bg-gold" />}
              {m}
            </span>
          ))}
        </p>
      </div>
    </div>
  )
}
