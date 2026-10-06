import { useRef, useState } from 'react'
import { useLocation } from 'react-router'
import { isCurrent, navLinks } from '../../data/navigation'
import { useScrollFrame } from '../../hooks/useScrollFrame'
import { useEnquiry } from '../../lib/enquiry'
import { TLink } from '../../lib/transition'
import { MobileMenu } from './MobileMenu'
import { Wordmark } from './Wordmark'

/**
 * Transparent over the hero, ivory once the page moves; tucks away while
 * reading downwards and returns on the first scroll up.
 */
export function Navbar() {
  const { pathname } = useLocation()
  const overHero = pathname === '/'
  const { openEnquiry } = useEnquiry()
  const [solid, setSolid] = useState(false)
  const [hidden, setHidden] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const lastY = useRef(0)

  useScrollFrame((y) => {
    setSolid(y > (overHero ? window.innerHeight * 0.82 : 16))
    const delta = y - lastY.current
    if (Math.abs(delta) > 8) {
      const hide = delta > 0 && y > window.innerHeight * 0.5
      setHidden(hide)
      document.documentElement.style.setProperty('--nav-offset', hide ? '0px' : 'var(--nav-h)')
      lastY.current = y
    }
  })

  const light = overHero && !solid
  const tone = light ? 'text-ivory' : 'text-navy-900'

  return (
    <>
      <a
        href="#main"
        className="eyebrow fixed top-3 left-3 z-[80] -translate-y-24 bg-navy-900 px-4 py-3 text-ivory focus:translate-y-0"
      >
        Skip to content
      </a>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-[transform,background-color,color,border-color] duration-700 ease-[var(--ease-luxe)] ${tone} ${
          hidden && !menuOpen ? '-translate-y-full' : 'translate-y-0'
        } ${solid ? 'border-b border-navy-900/10 bg-ivory' : 'border-b border-transparent bg-transparent'}`}
      >
        <div className="shell grid h-[var(--nav-h)] grid-cols-[1fr_auto] items-center lg:grid-cols-[1fr_auto_1fr]">
          <TLink to="/" aria-label="Classic Hyderabad — home" className="justify-self-start">
            <Wordmark />
          </TLink>

          <nav aria-label="Primary" className="hidden lg:block">
            <ul className="flex items-center gap-10 xl:gap-12">
              {navLinks.map((link) => (
                <li key={link.to}>
                  <TLink
                    to={link.to}
                    aria-current={isCurrent(link.to, pathname) ? 'page' : undefined}
                    className="link-line text-[0.6875rem] font-medium tracking-[0.24em] uppercase"
                  >
                    {link.label}
                  </TLink>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center justify-self-end gap-5">
            <button
              type="button"
              onClick={() => openEnquiry()}
              className={`btn hidden min-h-[2.75rem] px-6 lg:inline-flex ${light ? 'btn-outline-light' : 'btn-outline-dark'}`}
            >
              <span>Enquire</span>
            </button>
            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              className="-mr-2 flex h-11 items-center gap-3 px-2 lg:hidden"
            >
              <span className="text-[0.6875rem] font-medium tracking-[0.24em] uppercase">Menu</span>
              <span aria-hidden="true" className="flex w-6 flex-col gap-[6px]">
                <span className="h-px w-full bg-current" />
                <span className="h-px w-2/3 self-end bg-current" />
              </span>
            </button>
          </div>
        </div>
      </header>
      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  )
}
