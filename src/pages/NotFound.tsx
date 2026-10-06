import { useEffect } from 'react'
import { ButtonLink } from '../components/ui/Button'
import { Eyebrow } from '../components/ui/Typography'

export default function NotFound() {
  useEffect(() => {
    document.title = 'Page not found — Classic Hyderabad'
  }, [])

  return (
    <section className="on-light shell flex min-h-[80svh] flex-col justify-center pt-[var(--nav-h)]">
      <Eyebrow className="text-bronze">404</Eyebrow>
      <h1 className="serif mt-8 text-h1 text-navy-900">This page is not part of the collection.</h1>
      <div className="mt-10 flex flex-wrap gap-3">
        <ButtonLink to="/" tone="navy">
          Return home
        </ButtonLink>
        <ButtonLink to="/products" tone="outline-dark" arrow={false}>
          View products
        </ButtonLink>
      </div>
    </section>
  )
}
