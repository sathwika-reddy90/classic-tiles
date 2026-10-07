import { useEffect } from 'react'
import { AtAGlance } from '../components/home/AtAGlance'
import { ApplicationSection } from '../components/home/ApplicationSection'
import { BrandStory } from '../components/home/BrandStory'
import { ClientMarquee } from '../components/home/ClientMarquee'
import { CategoryShowcase } from '../components/home/CategoryShowcase'
import { FeaturedProducts } from '../components/home/FeaturedProducts'
import { FinalCTA } from '../components/home/FinalCTA'
import { Hero } from '../components/home/Hero'
import { Leadership } from '../components/home/Leadership'
import { MaterialStory } from '../components/home/MaterialStory'
import { ProjectShowcase } from '../components/home/ProjectShowcase'

export default function Home() {
  useEffect(() => {
    document.title = 'Classic Hyderabad — Designer Tiles & Architectural Materials'
  }, [])

  return (
    <>
      <Hero />
      <AtAGlance />
      <BrandStory />
      <Leadership />
      <CategoryShowcase />
      <FeaturedProducts />
      <ApplicationSection />
      <ProjectShowcase />
      <ClientMarquee />
      <MaterialStory />
      <FinalCTA />
    </>
  )
}
