import { lazy, Suspense } from 'react'
import { Route, Routes, useLocation } from 'react-router'
import { Footer } from './components/layout/Footer'
import { Navbar } from './components/layout/Navbar'
import { useRevealObserver } from './hooks/useRevealObserver'
import { EnquiryProvider } from './lib/enquiry'
import { SmoothScrollProvider } from './lib/smooth-scroll'
import { ScrollManager, TransitionProvider } from './lib/transition'
import Home from './pages/Home'

const Products = lazy(() => import('./pages/Products'))
const NotFound = lazy(() => import('./pages/NotFound'))

export default function App() {
  useRevealObserver()
  return (
    <SmoothScrollProvider>
      <TransitionProvider>
        <EnquiryProvider>
          <ScrollManager />
          <Navbar />
          <Main />
          <Footer />
        </EnquiryProvider>
      </TransitionProvider>
    </SmoothScrollProvider>
  )
}

function Main() {
  const { pathname } = useLocation()
  return (
    <main id="main" key={pathname} className="page-enter">
      <Suspense fallback={<div className="min-h-svh bg-ivory" />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </main>
  )
}
