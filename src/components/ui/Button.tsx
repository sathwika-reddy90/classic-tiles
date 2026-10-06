import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { TLink } from '../../lib/transition'
import { Arrow } from './Typography'

type Tone = 'ivory' | 'outline-light' | 'navy' | 'outline-dark'

export function ButtonLink({
  to,
  tone,
  children,
  arrow = true,
  className = '',
}: {
  to: string
  tone: Tone
  children: ReactNode
  arrow?: boolean
  className?: string
}) {
  return (
    <TLink to={to} className={`btn btn-${tone} ${className}`}>
      <span>{children}</span>
      {arrow && <Arrow />}
    </TLink>
  )
}

export function Button({
  tone,
  children,
  arrow = false,
  className = '',
  type = 'button',
  ...rest
}: ButtonHTMLAttributes<HTMLButtonElement> & { tone: Tone; arrow?: boolean }) {
  return (
    <button type={type} className={`btn btn-${tone} ${className}`} {...rest}>
      <span>{children}</span>
      {arrow && <Arrow />}
    </button>
  )
}
