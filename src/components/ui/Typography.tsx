import type { CSSProperties, ElementType, ReactNode } from 'react'

/** Small tracked label with a gold rule. */
export function Eyebrow({
  children,
  className = '',
  rule = true,
}: {
  children: ReactNode
  className?: string
  rule?: boolean
}) {
  return (
    <p className={`eyebrow flex items-center gap-4 ${className}`}>
      {rule && <span aria-hidden="true" className="h-px w-8 shrink-0 bg-gold" />}
      <span>{children}</span>
    </p>
  )
}

/**
 * A headline whose lines rise out of masks in sequence. Line breaks are set
 * explicitly so each composition is designed, not left to the browser.
 */
export function Lines({
  as: Tag = 'h2',
  lines,
  className = '',
  delay = 0,
  stagger = 90,
  id,
}: {
  as?: ElementType
  lines: ReactNode[]
  className?: string
  delay?: number
  stagger?: number
  id?: string
}) {
  return (
    <Tag id={id} data-reveal="lines" className={className}>
      {lines.map((line, i) => (
        <span key={i} className="line-mask">
          <span style={{ '--d': `${delay + i * stagger}ms` } as CSSProperties}>{line}</span>
        </span>
      ))}
    </Tag>
  )
}

export function Arrow({ className = '' }: { className?: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 22 10" width="22" height="10" fill="none" className={className}>
      <path d="M0 5h20.5M16.5 1l4 4-4 4" stroke="currentColor" strokeWidth="1" />
    </svg>
  )
}

/** Inline style helper for staggered reveals. */
export const delay = (ms: number) => ({ '--d': `${ms}ms` }) as CSSProperties
