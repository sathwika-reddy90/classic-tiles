import { collectionById } from '../../data/collections'
import { primaryMeasure } from '../../data/products'
import type { Product } from '../../data/types'
import { Img } from '../ui/Img'
import { Arrow } from '../ui/Typography'

/**
 * A specimen on its stone plate. The heading's button is stretched over the
 * whole card (block-link pattern), so the markup stays valid and the
 * accessible name is simply the product name. Secondary specs surface on
 * hover on desktop and are always visible on touch.
 */
export function ProductCard({
  product,
  index,
  onOpen,
  sizes = '(min-width: 1280px) 22vw, (min-width: 768px) 30vw, 46vw',
  label,
  headingLevel: H = 'h3',
}: {
  product: Product
  index?: number
  onOpen: (p: Product) => void
  sizes?: string
  /** Small caps line under the name; defaults to the product's collection. */
  label?: string
  headingLevel?: 'h3' | 'h4'
}) {
  // primaryMeasure falls back to thickness when no dimensions are published
  const detail = product.specs?.find((s) => product.dimensions.length || s.label !== 'Thickness')

  return (
    <article className="group relative has-[:focus-visible]:outline has-[:focus-visible]:outline-1 has-[:focus-visible]:outline-offset-[6px] has-[:focus-visible]:outline-bronze">
      <div className="relative aspect-[4/5] overflow-hidden bg-plate">
        <Img
          group="products"
          name={product.images[0]}
          alt=""
          sizes={sizes}
          className="h-full w-full object-contain transition-transform duration-[1.6s] ease-[var(--ease-luxe)] group-hover:scale-[1.06]"
        />
        {index !== undefined && (
          <span aria-hidden="true" className="tabular absolute top-4 left-4 text-[0.6875rem] tracking-[0.18em] text-stone-500">
            {String(index + 1).padStart(2, '0')}
          </span>
        )}
        {product.images.length > 1 && (
          <span className="meta absolute top-4 right-4 text-[0.625rem] text-stone-500">{product.images.length} views</span>
        )}
        <span
          aria-hidden="true"
          className="absolute inset-x-0 bottom-0 flex translate-y-[calc(100%+2px)] items-center justify-between bg-navy-900 px-4 py-3 text-ivory transition-transform duration-700 ease-[var(--ease-luxe)] group-hover:translate-y-0 group-has-[:focus-visible]:translate-y-0 max-lg:hidden"
        >
          <span className="text-[0.6875rem] font-medium tracking-[0.22em] uppercase">View details</span>
          <Arrow />
        </span>
      </div>

      <div className="mt-4 lg:mt-5">
        <H className="serif text-[clamp(1.35rem,1.9vw,1.75rem)] leading-tight text-navy-900">
          <button
            type="button"
            onClick={() => onOpen(product)}
            aria-haspopup="dialog"
            className="text-left after:absolute after:inset-0 after:content-[''] focus-visible:outline-none"
          >
            {product.name}
            {product.variant && <span className="text-stone-500"> · {product.variant}</span>}
          </button>
        </H>
        <p className="meta mt-1.5 text-[0.625rem] text-stone-600 sm:text-[0.6875rem]">
          {label ?? collectionById[product.collections[0]].title.replace('Classic ', '')}
        </p>
        <p className="tabular mt-2 text-[0.875rem] text-ink-soft">{primaryMeasure(product)}</p>
        {detail && (
          <p className="tabular mt-0.5 text-[0.8125rem] text-stone-600 transition-all duration-700 lg:translate-y-1 lg:opacity-0 lg:group-hover:translate-y-0 lg:group-hover:opacity-100">
            {detail.label} {detail.value}
          </p>
        )}
      </div>
    </article>
  )
}
