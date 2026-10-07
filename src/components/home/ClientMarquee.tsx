import { registers, registerTotal } from '../../data/projects'

/** Every client in the catalogue's registers, in register order. */
const clients = registers.flatMap((r) => r.entries)

/**
 * A slow, continuous line of the catalogue's clients. The list is drawn
 * twice and the track moves by exactly one copy, so the loop is seamless;
 * it pauses on hover and stands still for reduced motion.
 */
export function ClientMarquee() {
  const row = (copy: boolean) => (
    <ul aria-hidden={copy || undefined} className="flex shrink-0 items-center">
      {clients.map((c, i) => (
        <li key={`${i}-${c}`} className="flex items-center whitespace-nowrap">
          <span className="px-6 lg:px-8">{c}</span>
          <span aria-hidden="true" className="size-[5px] rotate-45 bg-gold" />
        </li>
      ))}
    </ul>
  )

  return (
    <section
      aria-label={`Clients — ${registerTotal} on record`}
      className="overflow-hidden bg-navy-900 py-5 text-ivory/80 lg:py-6"
    >
      <div className="marquee flex w-max text-[0.8125rem] font-semibold tracking-[0.12em] uppercase lg:text-[0.875rem]">
        {row(false)}
        {row(true)}
      </div>
    </section>
  )
}
