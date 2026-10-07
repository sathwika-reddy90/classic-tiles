import {
  createContext,
  useCallback,
  useContext,
  useLayoutEffect,
  useRef,
  useState,
  type AnchorHTMLAttributes,
  type ReactNode,
} from 'react'
import { useHref, useLocation, useNavigate, useNavigationType } from 'react-router'
import { useReducedMotion } from '../hooks/useMediaQuery'
import { scrollToTarget, useLenis } from './smooth-scroll'

type Phase = 'idle' | 'cover' | 'reveal'
const COVER_MS = 620
const REVEAL_MS = 780

const TransitionContext = createContext<{ go: (to: string) => void }>({ go: () => {} })

/**
 * Route changes pass under a navy curtain: it rises, the route swaps and is
 * positioned while hidden, then the curtain lifts away. Same-page anchors
 * glide instead.
 */
export function TransitionProvider({ children }: { children: ReactNode }) {
  const navigate = useNavigate()
  const location = useLocation()
  const lenis = useLenis()
  const reduced = useReducedMotion()
  const [phase, setPhase] = useState<Phase>('idle')
  const busy = useRef(false)

  const go = useCallback(
    (to: string) => {
      const url = new URL(to, window.location.origin)
      if (url.pathname === location.pathname) {
        if (url.search !== location.search) navigate(to)
        else scrollToTarget(lenis, url.hash || 0)
        return
      }
      if (reduced || busy.current) {
        navigate(to)
        return
      }
      busy.current = true
      setPhase('cover')
      window.setTimeout(() => {
        navigate(to)
        window.setTimeout(() => {
          setPhase('reveal')
          window.setTimeout(() => {
            setPhase('idle')
            busy.current = false
          }, REVEAL_MS)
        }, 90)
      }, COVER_MS)
    },
    [location.pathname, location.search, lenis, navigate, reduced],
  )

  return (
    <TransitionContext.Provider value={{ go }}>
      {children}
      <div className="curtain grid place-items-center" data-state={phase} aria-hidden="true">
        <span className="serif text-[1.1rem] tracking-[0.3em] text-gold uppercase">Classic</span>
      </div>
    </TransitionContext.Provider>
  )
}

export const usePageTransition = () => useContext(TransitionContext)

/** Resets or restores scroll position after a route change. */
export function ScrollManager() {
  const { pathname, hash } = useLocation()
  const navigationType = useNavigationType()
  const lenis = useLenis()
  const previous = useRef(pathname)

  useLayoutEffect(() => {
    const changedPage = previous.current !== pathname
    previous.current = pathname
    if (hash) {
      const id = requestAnimationFrame(() => scrollToTarget(lenis, hash, changedPage))
      return () => cancelAnimationFrame(id)
    }
    if (changedPage && navigationType !== 'POP') {
      lenis?.scrollTo(0, { immediate: true, force: true })
      window.scrollTo(0, 0)
    }
  }, [pathname, hash, navigationType, lenis])

  return null
}

type TLinkProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> & { to: string }

/** An anchor that routes through the page transition. */
export function TLink({ to, onClick, ...rest }: TLinkProps) {
  const { go } = usePageTransition()
  const href = useHref(to)
  return (
    <a
      href={href}
      onClick={(e) => {
        onClick?.(e)
        if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
        e.preventDefault()
        go(to)
      }}
      {...rest}
    />
  )
}
