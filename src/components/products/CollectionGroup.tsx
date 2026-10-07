import { categories } from '../../data/collections'
import type { Collection, Product } from '../../data/types'
import { Img } from '../ui/Img'
import { delay } from '../ui/Typography'
import { ProductCard } from './ProductCard'

const categoryLabel = Object.fromEntries(categories.map((c) => [c.id, c.label]))

interface Props {
  /** Catalogue order; omitted inside a chapter view to avoid competing numbers. */
  index?: number
  collection: Collection
  items: Product[]
  /** Products that appear in this catalogue section but live elsewhere on the page. */
  alsoHere: Product[]
  first: boolean
  onOpen: (p: Product) => void
}

export function CollectionGroup({ index, collection, items, alsoHere, first, onOpen }: Props) {
  const headingId = `collection-${collection.id}`
  return (
    <section aria-labelledby={headingId} className={`shell ${first ? 'pt-14 lg:pt-20' : 'pt-24 lg:pt-36'}`}>
      <header className="grid gap-8 border-t border-navy-900/15 pt-8 lg:grid-cols-12 lg:gap-8 lg:pt-10">
        <span className="tabular text-[0.6875rem] tracking-[0.2em] text-bronze lg:col-span-1 lg:pt-3">
          {index !== undefined && String(index + 1).padStart(2, '0')}
        </span>
        <div className="lg:col-span-6">
          <h2 id={headingId} className="serif text-h3 text-navy-900">
            {collection.title}
          </h2>
          {collection.tagline && <p className="serif mt-3 text-[1.0625rem] text-ink-soft italic">{collection.tagline}</p>}
          {collection.properties.length > 0 && (
            <ul className="mt-6 flex flex-wrap gap-x-5 gap-y-2">
              {collection.properties.map((p) => (
                <li key={p} className="meta flex items-center gap-2 text-[0.625rem] text-stone-600">
                  <span aria-hidden="true" className="h-1 w-1 rotate-45 bg-gold" />
                  {p}
                </li>
              ))}
            </ul>
          )}
          {alsoHere.length > 0 && (
            <p className="mt-6 text-[0.875rem] text-ink-soft">
              <span className="meta mr-3 text-[0.625rem] text-stone-600">Also in this collection</span>
              {alsoHere.map((p, i) => (
                <span key={p.id}>
                  {i > 0 && <span className="text-stone-400"> · </span>}
                  <button type="button" onClick={() => onOpen(p)} className="link-line text-navy-900">
                    {p.name}
                  </button>
                </span>
              ))}
            </p>
          )}
        </div>
        <div className="hidden lg:col-span-4 lg:col-start-9 lg:block">
          <div data-reveal="image" className="aspect-[16/9] overflow-hidden bg-navy-900">
            <Img group="scenes" name={collection.scene} alt="" sizes="30vw" className="h-full w-full object-cover" />
          </div>
        </div>
      </header>

      <ul className="mt-12 grid grid-cols-2 gap-x-3 gap-y-12 sm:gap-x-6 md:grid-cols-3 lg:mt-16 lg:gap-x-8 lg:gap-y-16 xl:grid-cols-4">
        {items.map((p, i) => (
          <li key={p.id} data-reveal style={delay((i % 4) * 80)}>
            <ProductCard product={p} onOpen={onOpen} label={categoryLabel[p.category]} />
          </li>
        ))}
      </ul>
    </section>
  )
}
