import { collections } from '../../data/collections'
import { company } from '../../data/company'
import { products } from '../../data/products'
import { registerTotal } from '../../data/projects'
import { CountUp } from '../ui/TextMotion'
import { delay } from '../ui/Typography'

const stats = [
  { value: new Date().getFullYear() - company.since, plus: true, label: `Years in Hyderabad, since ${company.since}` },
  { value: products.length, label: 'Designs in the catalogue' },
  { value: collections.length, label: 'Product collections' },
  { value: registerTotal, label: 'Projects & clients on record' },
]

/** The key figures, as a single band directly after the hero. */
export function AtAGlance() {
  return (
    <section aria-label="Classic at a glance" className="on-light relative bg-ivory py-12 text-ink lg:py-16">
      <div className="shell">
        <dl className="grid grid-cols-2 lg:grid-cols-4">
          {stats.map((s, i) => (
            <div
              key={s.label}
              data-reveal
              style={delay(i * 110)}
              className={`flex flex-col-reverse justify-end py-6 pr-5 ${i % 2 ? 'border-l border-navy-900/15 pl-5' : ''} ${
                i > 1 ? 'border-t border-navy-900/15 lg:border-t-0' : ''
              } lg:px-8 lg:py-0 ${i ? 'lg:border-l lg:border-navy-900/15' : 'lg:pl-0'}`}
            >
              <dt className="meta mt-4 max-w-[18ch] text-stone-600">{s.label}</dt>
              <dd className="serif tabular text-[clamp(2.4rem,4vw,4rem)] leading-none text-navy-900">
                <CountUp value={s.value} />
                {s.plus && <span className="text-gold">+</span>}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}
