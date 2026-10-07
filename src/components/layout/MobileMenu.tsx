import { useCallback, useRef } from 'react'
import { useLocation } from 'react-router'
import { company } from '../../data/company'
import { isCurrent, navLinks } from '../../data/navigation'
import { useFocusTrap } from '../../hooks/useFocusTrap'
import { useEnquiry } from '../../lib/enquiry'
import { useScrollLock } from '../../lib/smooth-scroll'
import { TLink } from '../../lib/transition'
import { delay } from '../ui/Typography'
import { Wordmark } from './Wordmark'

export function MobileMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
  const ref = useRef<HTMLDivElement>(null)
  const { pathname } = useLocation()
  const { openEnquiry } = useEnquiry()
  const close = useCallback(() => onClose(), [onClose])
  useFocusTrap(ref, open, close)
  useScrollLock(open)

  return (
    <div
      ref={ref}
      id="mobile-menu"
      role="dialog"
      aria-modal="true"
      aria-label="Site menu"
      aria-hidden={!open}
      inert={!open}
      className={`fixed inset-0 z-[70] flex flex-col bg-navy-950 text-ivory transition-[clip-path] duration-[900ms] ease-[var(--ease-curtain)] lg:hidden ${
        open ? '[clip-path:inset(0_0_0_0)]' : 'pointer-events-none [clip-path:inset(0_0_100%_0)]'
      }`}
    >
      <div className="shell flex h-[var(--nav-h)] shrink-0 items-center justify-between">
        <TLink to="/" onClick={close} aria-label="Classic Hyderabad — home">
          <Wordmark />
        </TLink>
        <button type="button" onClick={close} className="-mr-2 flex h-11 items-center gap-3 px-2" data-autofocus>
          <span className="text-[0.75rem] font-semibold tracking-[0.14em] uppercase">Close</span>
          <span aria-hidden="true" className="relative block h-4 w-4">
            <span className="absolute top-1/2 left-0 h-px w-full rotate-45 bg-current" />
            <span className="absolute top-1/2 left-0 h-px w-full -rotate-45 bg-current" />
          </span>
        </button>
      </div>

      <nav aria-label="Mobile" className="shell flex flex-1 flex-col justify-center overflow-y-auto py-8">
        <ul className="space-y-1">
          {navLinks.map((link, i) => (
            <li key={link.to} className="overflow-hidden">
              <TLink
                to={link.to}
                onClick={close}
                aria-current={isCurrent(link.to, pathname) ? 'page' : undefined}
                style={delay(open ? 180 + i * 70 : 0)}
                className={`group flex items-baseline gap-5 py-1.5 transition-transform duration-[1100ms] ease-[var(--ease-luxe)] [transition-delay:var(--d)] ${
                  open ? 'translate-y-0' : 'translate-y-full'
                }`}
              >
                <span className="tabular w-6 text-[0.6875rem] tracking-[0.2em] text-gold">0{i + 1}</span>
                <span className="text-[2.25rem] leading-[1.15] font-semibold group-aria-[current=page]:text-gold-soft sm:text-[3rem]">
                  {link.label}
                </span>
              </TLink>
            </li>
          ))}
        </ul>
      </nav>

      <div
        className={`shell shrink-0 border-t border-ivory/10 py-7 transition-opacity delay-500 duration-700 ${open ? 'opacity-100' : 'opacity-0'}`}
      >
        <button
          type="button"
          onClick={() => {
            close()
            openEnquiry()
          }}
          className="btn btn-ivory w-full"
        >
          <span>Enquire</span>
        </button>
        <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-[0.8125rem] text-ivory/70">
          {company.phones.map((p) => (
            <a key={p.tel} href={`tel:${p.tel}`} className="tabular hover:text-ivory">
              {p.display}
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}
