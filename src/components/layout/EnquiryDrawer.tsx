import { useRef } from 'react'
import { company } from '../../data/company'
import { displayName, primaryMeasure } from '../../data/products'
import { collectionById } from '../../data/collections'
import type { Product } from '../../data/types'
import { useFocusTrap } from '../../hooks/useFocusTrap'
import { useScrollLock } from '../../lib/smooth-scroll'
import { Img } from '../ui/Img'
import { Arrow } from '../ui/Typography'

/**
 * The catalogue publishes phone numbers, websites and the factory address —
 * no e-mail or form endpoint — so the enquiry panel routes visitors to those
 * channels directly, carrying the product they were looking at.
 */
export function EnquiryDrawer({ open, product, onClose }: { open: boolean; product?: Product; onClose: () => void }) {
  const ref = useRef<HTMLDivElement>(null)
  useFocusTrap(ref, open, onClose)
  useScrollLock(open)

  return (
    <div className={`fixed inset-0 z-[80] ${open ? '' : 'pointer-events-none'}`} aria-hidden={!open} inert={!open}>
      <div
        onClick={onClose}
        className={`absolute inset-0 bg-navy-950/55 transition-opacity duration-700 ${open ? 'opacity-100' : 'opacity-0'}`}
      />
      <div
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-labelledby="enquiry-title"
        data-lenis-prevent
        className={`on-light absolute inset-y-0 right-0 flex w-full max-w-[34rem] flex-col overflow-y-auto bg-ivory text-ink transition-transform duration-[900ms] ease-[var(--ease-curtain)] ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex h-[var(--nav-h)] shrink-0 items-center justify-between border-b border-navy-900/10 px-6 sm:px-10">
          <p className="eyebrow text-bronze">Enquiry</p>
          <button type="button" onClick={onClose} className="-mr-2 flex h-11 items-center gap-3 px-2" data-autofocus>
            <span className="text-[0.6875rem] font-medium tracking-[0.24em] uppercase">Close</span>
            <span aria-hidden="true" className="relative block h-4 w-4">
              <span className="absolute top-1/2 left-0 h-px w-full rotate-45 bg-current" />
              <span className="absolute top-1/2 left-0 h-px w-full -rotate-45 bg-current" />
            </span>
          </button>
        </div>

        <div className="flex-1 px-6 py-10 sm:px-10 sm:py-12">
          <h2 id="enquiry-title" className="serif text-h3 text-navy-900">
            Speak with Classic
          </h2>
          <p className="mt-4 max-w-[34ch] text-ink-soft">
            For specifications, quantities and project enquiries, call the factory directly or visit us at IDA Nacharam.
          </p>

          {product && (
            <div className="mt-8 flex items-center gap-5 border border-navy-900/10 bg-plate p-3 pr-5">
              <div className="w-20 shrink-0 bg-plate">
                <Img group="products" name={product.images[0]} alt="" sizes="80px" className="h-auto w-full" />
              </div>
              <div className="min-w-0">
                <p className="meta text-stone-600">Regarding</p>
                <p className="serif mt-1 text-[1.5rem] leading-tight text-navy-900">{displayName(product)}</p>
                <p className="mt-1 text-[0.8125rem] text-ink-soft">
                  {collectionById[product.collections[0]].title}
                  {primaryMeasure(product) && <> · {primaryMeasure(product)}</>}
                </p>
              </div>
            </div>
          )}

          <section className="mt-10">
            <h3 className="meta text-stone-600">Call</h3>
            <ul className="mt-3 divide-y divide-navy-900/10 border-y border-navy-900/10">
              {company.phones.map((p) => (
                <li key={p.tel}>
                  <a
                    href={`tel:${p.tel}`}
                    className="group flex items-center justify-between py-4 text-navy-900 transition-colors hover:text-bronze"
                  >
                    <span className="serif tabular text-[1.75rem] leading-none">{p.display}</span>
                    <Arrow className="transition-transform duration-500 group-hover:translate-x-1" />
                  </a>
                </li>
              ))}
            </ul>
          </section>

          <section className="mt-10 grid gap-10 sm:grid-cols-2">
            <div>
              <h3 className="meta text-stone-600">{company.address.label}</h3>
              <address className="mt-3 text-[0.9375rem] leading-relaxed not-italic">
                {company.address.lines.map((l) => (
                  <span key={l} className="block">
                    {l}
                  </span>
                ))}
              </address>
              <a
                href={company.address.mapsHref}
                target="_blank"
                rel="noreferrer"
                className="link-line mt-4 inline-flex items-center gap-3 text-[0.6875rem] font-medium tracking-[0.22em] text-navy-900 uppercase"
              >
                Directions <Arrow />
              </a>
            </div>
            <div>
              <h3 className="meta text-stone-600">Online</h3>
              <ul className="mt-3 space-y-2 text-[0.9375rem]">
                {company.websites.map((w) => (
                  <li key={w.href}>
                    <a href={w.href} target="_blank" rel="noreferrer" className="link-line">
                      {w.display}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
