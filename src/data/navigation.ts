export const navLinks = [
  { label: 'Home', to: '/' },
  { label: 'Products', to: '/products' },
  { label: 'About', to: '/#about' },
  { label: 'Projects', to: '/#projects' },
  { label: 'Contact', to: '/#contact' },
] as const

export function isCurrent(to: string, pathname: string) {
  return to === pathname
}
