import { categories } from '../../data/collections'
import type { CategoryId, Chapter } from '../../data/types'

interface Props {
  category: CategoryId | null
  counts: Record<string, number>
  total: number
  showing: number
  chapter: Chapter | null
  onCategory: (id: CategoryId | null) => void
  onClearChapter: () => void
}

/** Sticks below the navigation and slides up with it when the nav tucks away. */
export function FilterBar({ category, counts, total, showing, chapter, onCategory, onClearChapter }: Props) {
  const options = [{ id: null, label: 'All', count: total }, ...categories.map((c) => ({ ...c, count: counts[c.id] }))]

  return (
    <div className="sticky top-[var(--nav-offset)] z-30 border-y border-navy-900/10 bg-ivory/[0.97] transition-[top] duration-700 ease-[var(--ease-luxe)]">
      <div className="shell flex items-center gap-6">
        <nav
          aria-label="Filter products"
          className="rail -mx-[var(--gutter)] min-w-0 flex-1 overflow-x-auto px-[var(--gutter)] max-lg:[mask-image:linear-gradient(to_right,black_82%,transparent)]"
        >
          <ul className="flex w-max items-center gap-7 lg:gap-9">
            {options.map((o) => {
              const current = o.id === category
              const empty = o.count === 0
              return (
                <li key={o.label}>
                  <button
                    type="button"
                    onClick={() => onCategory(o.id as CategoryId | null)}
                    aria-pressed={current}
                    disabled={empty && !current}
                    className={`relative flex h-14 items-center gap-2 text-[0.6875rem] font-medium tracking-[0.2em] whitespace-nowrap uppercase transition-colors duration-500 lg:h-16 ${
                      current ? 'text-navy-900' : empty ? 'cursor-default text-stone-400' : 'text-stone-600 hover:text-navy-900'
                    }`}
                  >
                    {o.label}
                    <sup className="tabular text-[0.625rem] tracking-normal text-stone-500">{o.count}</sup>
                    <span
                      aria-hidden="true"
                      className={`absolute inset-x-0 -bottom-px h-px origin-left bg-gold transition-transform duration-700 ease-[var(--ease-luxe)] ${
                        current ? 'scale-x-100' : 'scale-x-0'
                      }`}
                    />
                  </button>
                </li>
              )
            })}
          </ul>
        </nav>
        <p className="meta tabular hidden shrink-0 text-stone-600 xl:block" aria-live="polite">
          Showing {showing}
        </p>
      </div>

      {chapter && (
        <div className="border-t border-navy-900/10">
          <div className="shell flex h-12 items-center gap-4 text-[0.8125rem]">
            <span className="meta shrink-0 text-stone-600">
              <span className="max-sm:hidden">Chapter </span>
              {chapter.number}
            </span>
            <span className="serif min-w-0 truncate text-[0.9375rem] text-navy-900">{chapter.title}</span>
            <button
              type="button"
              onClick={onClearChapter}
              className="link-line ml-auto shrink-0 text-[0.6875rem] font-medium tracking-[0.2em] whitespace-nowrap text-navy-900 uppercase"
            >
              View all <span aria-hidden="true">×</span>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
