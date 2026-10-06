import { useEffect, useRef, useState, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { collectionById } from '../../data/collections'
import type { Product } from '../../data/types'
import { useFocusTrap } from '../../hooks/useFocusTrap'
import { useEnquiry } from '../../lib/enquiry'
import { useScrollLock } from '../../lib/smooth-scroll'
import { Img } from '../ui/Img'
import { Arrow } from '../ui/Typography'

interface Props {
  product: Product | null
  /** The sequence prev/next walks through (the current filtered view). */
  list: Product[]
  onClose: () => void
  onSelect: (p: Product) => void
}

export function ProductDetail({ product, list, onClose, onSelect }: Props) {
  const open = product !== null
  const ref = useRef<HTMLDivElement>(null)
  // Keep the last product mounted while the dialog animates closed
  const [shown, setShown] = useState<Product | null>(product)
  const [view, setView] = useState(0)
  const { openEnquiry } = useEnquiry()

  if (product && product !== shown) {
    setShown(product)
    setView(0)
  }

  useFocusTrap(ref, open, onClose)
  useScrollLock(open)

  const index = shown ? list.findIndex((p) => p.id === shown.id) : -1
  const step = (dir: 1 | -1) => {
    if (index < 0 || list.length < 2) return
    onSelect(list[(index + dir + list.length) % list.length])
  }

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') step(1)
      if (e.key === 'ArrowLeft') step(-1)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  })

  if (!shown) return null
  const collection = collectionById[shown.collections[0]]
  const application = shown.application ?? collection.application
  const alsoIn = shown.collections.slice(1).map((id) => collectionById[id].title)

  return createPortal(
    <div className={`fixed inset-0 z-[75] ${open ? '' : 'pointer-events-none'}`} aria-hidden={!open} inert={!open}>
      <div
        onClick={onClose}
        className={`absolute inset-0 bg-navy-950/70 transition-opacity duration-700 ${open ? 'opacity-100' : 'opacity-0'}`}
      />
      <div
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-labelledby="product-title"
        className={`on-light absolute inset-0 flex flex-col overflow-hidden bg-ivory text-ink transition-[opacity,transform] duration-[900ms] ease-[var(--ease-luxe)] lg:inset-6 lg:flex-row xl:inset-x-12 xl:inset-y-8 ${
          open ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
        }`}
      >
        {/* Specimen */}
        <div className="relative h-[46svh] shrink-0 bg-plate lg:h-auto lg:w-[56%]">
          {shown.images.map((img, i) => (
            <div
              key={`${shown.id}-${img}`}
              className={`absolute inset-0 transition-opacity duration-700 ${i === view ? 'opacity-100' : 'opacity-0'}`}
            >
              <Img
                group="products"
                name={img}
                alt={i === 0 ? `${shown.name}${shown.variant ? `, ${shown.variant}` : ''}` : `${shown.name} — alternate view`}
                sizes="(min-width: 1024px) 56vw, 100vw"
                className="h-full w-full object-contain"
              />
            </div>
          ))}

          {shown.images.length > 1 && (
            <div className="absolute bottom-5 left-5 flex gap-2 lg:bottom-8 lg:left-8" role="group" aria-label="Views">
              {shown.images.map((img, i) => (
                <button
                  key={img}
                  type="button"
                  onClick={() => setView(i)}
                  aria-pressed={i === view}
                  aria-label={`View ${i + 1}`}
                  className={`h-16 w-14 overflow-hidden border bg-plate transition-colors ${i === view ? 'border-navy-900' : 'border-navy-900/15 hover:border-navy-900/50'}`}
                >
                  <Img group="products" name={img} alt="" sizes="56px" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          )}

          {index >= 0 && list.length > 1 && (
            <div className="absolute right-5 bottom-5 flex items-center gap-4 lg:right-8 lg:bottom-8">
              <span className="meta tabular text-stone-600">
                {String(index + 1).padStart(2, '0')} / {String(list.length).padStart(2, '0')}
              </span>
              <div className="flex">
                <button
                  type="button"
                  onClick={() => step(-1)}
                  aria-label="Previous product"
                  className="grid h-11 w-11 place-items-center border border-navy-900/20 text-navy-900 transition-colors hover:bg-navy-900 hover:text-ivory"
                >
                  <Arrow className="rotate-180" />
                </button>
                <button
                  type="button"
                  onClick={() => step(1)}
                  aria-label="Next product"
                  className="-ml-px grid h-11 w-11 place-items-center border border-navy-900/20 text-navy-900 transition-colors hover:bg-navy-900 hover:text-ivory"
                >
                  <Arrow />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Particulars */}
        <div data-lenis-prevent className="flex min-h-0 flex-1 flex-col overflow-y-auto">
          <div className="sticky top-0 z-10 flex h-16 shrink-0 items-center justify-between border-b border-navy-900/10 bg-ivory px-6 lg:h-20 lg:px-12">
            <p className="eyebrow truncate pr-4 text-bronze">{collection.title}</p>
            <button type="button" onClick={onClose} className="-mr-2 flex h-11 shrink-0 items-center gap-3 px-2" data-autofocus>
              <span className="text-[0.6875rem] font-medium tracking-[0.24em] uppercase">Close</span>
              <span aria-hidden="true" className="relative block h-4 w-4">
                <span className="absolute top-1/2 left-0 h-px w-full rotate-45 bg-current" />
                <span className="absolute top-1/2 left-0 h-px w-full -rotate-45 bg-current" />
              </span>
            </button>
          </div>

          <div key={shown.id} className="page-enter flex flex-1 flex-col px-6 pt-8 pb-10 lg:px-12 lg:pt-14 lg:pb-12">
            <h2 id="product-title" className="serif text-[clamp(2.6rem,5vw,4.75rem)] leading-[0.95] text-navy-900">
              {shown.name}
            </h2>
            {shown.variant && <p className="serif mt-2 text-[1.5rem] text-stone-500 italic">{shown.variant}</p>}
            {collection.tagline && <p className="mt-5 max-w-[40ch] text-ink-soft">{collection.tagline}</p>}

            <dl className="mt-10 border-t border-navy-900/12">
              {shown.dimensions.length > 0 && !shown.table && (
                <Row label={shown.dimensions.length > 1 ? 'Sizes' : 'Dimensions'}>
                  {shown.dimensions.map((d) => (
                    <span key={d} className="block">
                      {d}
                    </span>
                  ))}
                </Row>
              )}
              {shown.specs?.map((s) => (
                <Row key={s.label} label={s.label}>
                  {s.value}
                </Row>
              ))}
              {application && <Row label="Application">{application}</Row>}
              {collection.properties.length > 0 && <Row label="Properties">{collection.properties.join(' · ')}</Row>}
              {alsoIn.length > 0 && <Row label="Also in">{alsoIn.join(', ')}</Row>}
            </dl>

            {shown.table && (
              <table className="mt-10 w-full text-left text-[0.9375rem]">
                <caption className="meta mb-3 text-left text-stone-600">{shown.table.caption}</caption>
                <thead>
                  <tr className="border-b border-navy-900/20">
                    {shown.table.columns.map((c) => (
                      <th key={c} scope="col" className="meta pb-2 font-medium text-stone-600">
                        {c}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="tabular">
                  {shown.table.rows.map((r) => (
                    <tr key={r[0]} className="border-b border-navy-900/10">
                      {r.map((cell, i) => (
                        <td key={i} className={`py-2.5 ${i === 0 ? 'text-navy-900' : 'text-ink-soft'}`}>
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            <div className="mt-auto pt-12">
              <button type="button" onClick={() => openEnquiry(shown)} className="btn btn-navy w-full sm:w-auto">
                <span>Enquire about {shown.name}</span>
                <Arrow />
              </button>
              <p className="mt-4 text-[0.8125rem] text-stone-600">Specifications as published in the Classic catalogue.</p>
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  )
}

function Row({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="grid grid-cols-[8.5rem_1fr] gap-4 border-b border-navy-900/12 py-4 sm:grid-cols-[10rem_1fr]">
      <dt className="meta pt-0.5 text-stone-600">{label}</dt>
      <dd className="tabular text-[1rem] text-navy-900">{children}</dd>
    </div>
  )
}
