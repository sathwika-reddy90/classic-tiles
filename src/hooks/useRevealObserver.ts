import { useEffect } from 'react'

/**
 * One IntersectionObserver for the whole document. Any element carrying
 * `data-reveal` gets `.is-in` the first time it enters the viewport; the CSS
 * in styles/index.css defines what that looks like. New nodes (filtered
 * grids, route changes) are picked up by a MutationObserver.
 */
export function useRevealObserver() {
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-in')
            io.unobserve(entry.target)
          }
        }
      },
      // Reveal as soon as anything enters the screen: homepage sections are
      // exactly one screen tall, so content in their lowest strip must count.
      { rootMargin: '0px', threshold: 0 },
    )
    const scan = (root: ParentNode) => {
      root.querySelectorAll('[data-reveal]:not(.is-in)').forEach((el) => io.observe(el))
    }
    scan(document)
    const mo = new MutationObserver((records) => {
      for (const r of records) {
        r.addedNodes.forEach((n) => {
          if (n instanceof Element) {
            if (n.matches('[data-reveal]:not(.is-in)')) io.observe(n)
            scan(n)
          }
        })
      }
    })
    mo.observe(document.body, { childList: true, subtree: true })
    return () => {
      io.disconnect()
      mo.disconnect()
    }
  }, [])
}
