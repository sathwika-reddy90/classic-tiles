import { useCallback, useEffect, useMemo, useRef } from 'react'
import { useSearchParams } from 'react-router'
import { CollectionGroup } from '../components/products/CollectionGroup'
import { FilterBar } from '../components/products/FilterBar'
import { ProductDetail } from '../components/products/ProductDetail'
import { Eyebrow, Lines, delay } from '../components/ui/Typography'
import { categories, chapterById, collections } from '../data/collections'
import { productById, products } from '../data/products'
import type { CategoryId, CollectionId, Product } from '../data/types'

/**
 * The material library. State lives in the URL so every view is shareable:
 *   ?category=pavers   filter by type
 *   ?chapter=kerb-jalies   arrive from a homepage chapter
 *   ?p=scorpio   the open product
 */
export default function Products() {
  const [params, setParams] = useSearchParams()
  const categoryParam = params.get('category')
  const category = categories.some((c) => c.id === categoryParam) ? (categoryParam as CategoryId) : null
  const chapter = chapterById[params.get('chapter') ?? ''] ?? null
  const active = productById[params.get('p') ?? ''] ?? null
  const openedHere = useRef(false)

  useEffect(() => {
    document.title = active
      ? `${active.name} — Classic Hyderabad`
      : `${chapter ? chapter.title : 'Product Collection'} — Classic Hyderabad`
  }, [active, chapter])

  const inChapter = useMemo(
    () => (chapter ? products.filter((p) => p.collections.some((c) => chapter.collections.includes(c))) : products),
    [chapter],
  )
  const visible = useMemo(
    () => (category ? inChapter.filter((p) => p.category === category) : inChapter),
    [inChapter, category],
  )

  // A product lives under its first collection — or, inside a chapter, under
  // the first of its collections that belongs to that chapter.
  const homeOf = useCallback(
    (p: Product): CollectionId => (chapter ? p.collections.find((c) => chapter.collections.includes(c))! : p.collections[0]),
    [chapter],
  )
  const groups = useMemo(
    () =>
      collections
        .map((c) => ({
          collection: c,
          items: visible.filter((p) => homeOf(p) === c.id),
          alsoHere: chapter ? [] : visible.filter((p) => homeOf(p) !== c.id && p.collections.includes(c.id)),
        }))
        .filter((g) => g.items.length),
    [visible, homeOf, chapter],
  )
  // Prev/next in the dialog follows the order on screen
  const ordered = useMemo(() => groups.flatMap((g) => g.items), [groups])

  const update = (mutate: (next: URLSearchParams) => void, replace: boolean) => {
    const next = new URLSearchParams(params)
    mutate(next)
    setParams(next, { replace, preventScrollReset: true })
  }

  const open = (p: Product) => {
    openedHere.current = true
    update((n) => n.set('p', p.id), false)
  }
  const select = (p: Product) => update((n) => n.set('p', p.id), true)
  const close = useCallback(() => {
    if (openedHere.current) {
      openedHere.current = false
      window.history.back()
    } else {
      const next = new URLSearchParams(window.location.search)
      next.delete('p')
      setParams(next, { replace: true, preventScrollReset: true })
    }
  }, [setParams])

  const setCategory = (id: CategoryId | null) =>
    update((n) => {
      if (id) n.set('category', id)
      else n.delete('category')
    }, true)
  const clearChapter = () => update((n) => n.delete('chapter'), true)

  return (
    <div className="on-light bg-ivory text-ink">
      <header className="shell pt-[calc(var(--nav-h)+4.5rem)] pb-14 lg:pt-[calc(var(--nav-h)+7rem)] lg:pb-20">
        <div className="grid gap-10 lg:grid-cols-12 lg:items-end lg:gap-8">
          <div className="lg:col-span-8">
            <Eyebrow className="text-bronze">Material Library</Eyebrow>
            <Lines as="h1" lines={['Product', 'Collection']} className="serif mt-8 text-hero text-navy-900" />
          </div>
          <div className="lg:col-span-4 lg:pb-4">
            <p data-reveal style={delay(200)} className="serif text-[clamp(1.5rem,2vw,1.9rem)] leading-snug text-navy-900 italic">
              Architectural surfaces, crafted for lasting impact.
            </p>
            <p data-reveal style={delay(300)} className="meta tabular mt-6 text-stone-600">
              {products.length} products <span className="mx-2 text-gold">/</span> {collections.length} collections
            </p>
          </div>
        </div>
      </header>

      <FilterBar
        category={category}
        counts={Object.fromEntries(categories.map((c) => [c.id, inChapter.filter((p) => p.category === c.id).length]))}
        total={inChapter.length}
        showing={visible.length}
        chapter={chapter}
        onCategory={setCategory}
        onClearChapter={clearChapter}
      />

      <div className="pb-28 lg:pb-40">
        {groups.length ? (
          groups.map((g, i) => (
            <CollectionGroup
              key={g.collection.id}
              index={chapter ? undefined : collections.indexOf(g.collection)}
              collection={g.collection}
              items={g.items}
              alsoHere={g.alsoHere}
              first={i === 0}
              onOpen={open}
            />
          ))
        ) : (
          <div className="shell py-32 text-center">
            <p className="serif text-h3 text-navy-900">Nothing in this view.</p>
            <button type="button" onClick={() => setParams({}, { replace: true })} className="btn btn-outline-dark mt-8">
              <span>Show all products</span>
            </button>
          </div>
        )}
      </div>

      <ProductDetail product={active} list={ordered} onClose={close} onSelect={select} />
    </div>
  )
}
