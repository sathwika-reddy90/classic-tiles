import { useCallback, useMemo, useState } from 'react'
import { featuredIds, productById } from '../../data/products'
import type { Product } from '../../data/types'
import { ProductCard } from '../products/ProductCard'
import { ProductDetail } from '../products/ProductDetail'
import { ButtonLink } from '../ui/Button'
import { Eyebrow, Lines, delay } from '../ui/Typography'

export function FeaturedProducts() {
  const featured = useMemo(() => featuredIds.map((id) => productById[id]), [])
  const [active, setActive] = useState<Product | null>(null)
  const close = useCallback(() => setActive(null), [])

  return (
    <section aria-labelledby="featured-title" className="on-light bg-ivory-2 py-28 [--reveal-bg:var(--color-ivory-2)] text-ink lg:py-44">
      <div className="shell grid gap-16 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-4">
          <div className="lg:sticky lg:top-[calc(var(--nav-h)+4rem)]">
            <Eyebrow className="text-bronze">Featured — Floor Tiles</Eyebrow>
            <Lines id="featured-title" lines={['Surfaces with', 'a signature.']} className="serif mt-8 text-h2 text-navy-900" />
            <p data-reveal className="mt-8 max-w-[34ch] text-ink-soft">
              A selection from the Designer Floor Tiles collection — 25 mm surfaces whose patterns are designed to read as
              part of a larger floor.
            </p>
            <div data-reveal style={delay(120)} className="mt-10">
              <ButtonLink to="/products?chapter=floor-tiles" tone="outline-dark">
                View collection
              </ButtonLink>
            </div>
          </div>
        </div>

        <ul className="grid grid-cols-2 gap-x-4 gap-y-12 pb-0 sm:gap-x-8 lg:col-span-7 lg:col-start-6 lg:gap-x-12 lg:gap-y-20 lg:pb-28">
          {featured.map((p, i) => (
            <li key={p.id} data-reveal style={delay((i % 2) * 140)} className={i % 2 ? 'lg:translate-y-28' : ''}>
              <ProductCard
                product={p}
                index={i}
                onOpen={setActive}
                label="Floor Tiles · 25 mm"
                sizes="(min-width: 1024px) 26vw, 46vw"
              />
            </li>
          ))}
        </ul>
      </div>

      <ProductDetail product={active} list={featured} onClose={close} onSelect={setActive} />
    </section>
  )
}
