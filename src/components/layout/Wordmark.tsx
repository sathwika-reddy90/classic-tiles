/** Typographic lockup echoing the crest: CLASSIC over HYDERABAD. */
export function Wordmark({ className = '' }: { className?: string }) {
  return (
    <span className={`inline-flex flex-col items-start leading-none ${className}`}>
      <span className="serif text-[1.5rem] leading-none tracking-[0.22em] uppercase lg:text-[1.65rem]">Classic</span>
      <span className="mt-[0.4rem] flex items-center gap-2 text-[0.5rem] font-medium tracking-[0.46em] uppercase opacity-80">
        Hyderabad
        <span aria-hidden="true" className="h-px w-3 bg-current opacity-60" />
        <span className="tabular">1985</span>
      </span>
    </span>
  )
}
