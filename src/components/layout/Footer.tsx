import { company, groupCompanies } from '../../data/company'
import { navLinks } from '../../data/navigation'
import { useEnquiry } from '../../lib/enquiry'
import { TLink } from '../../lib/transition'
import { Img } from '../ui/Img'
import { Arrow, Eyebrow, Lines } from '../ui/Typography'

export function Footer() {
  const { openEnquiry } = useEnquiry()
  const year = new Date().getFullYear()

  return (
    <footer
      id="contact"
      className="screen relative overflow-hidden bg-navy-950 text-ivory"
      aria-labelledby="contact-title"
    >
      <div className="shell relative z-10 pt-24 pb-10 lg:py-0">
        <div className="grid gap-16 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-5">
            <Eyebrow className="text-gold">Contact</Eyebrow>
            <Lines
              id="contact-title"
              lines={['Speak with', 'Classic.']}
              className="serif mt-6 text-h2 text-ivory lg:mt-7"
            />
            <p data-reveal className="mt-7 max-w-[38ch] text-ivory/70">
              For specifications, quantities and project enquiries, call the factory directly or visit us at IDA
              Nacharam, Hyderabad.
            </p>
            <button type="button" data-reveal onClick={() => openEnquiry()} className="btn btn-ivory mt-9">
              <span>Enquire</span>
              <Arrow />
            </button>
          </div>

          <div className="grid gap-x-12 gap-y-12 sm:grid-cols-2 lg:col-span-6 lg:col-start-7 lg:grid-cols-[1.15fr_1fr] lg:gap-y-14 lg:pt-4">
            <div data-reveal>
              <h3 className="meta text-gold">{company.address.label}</h3>
              <address className="mt-5 text-[1.0625rem] leading-relaxed text-ivory/85 not-italic">
                {company.address.lines.map((l) => (
                  <span key={l} className="block">
                    {l}
                  </span>
                ))}
              </address>
              <a
                href={company.address.mapsHref}
                target="_blank"
                rel="noreferrer"
                className="link-line mt-5 inline-flex items-center gap-3 text-[0.6875rem] font-medium tracking-[0.22em] uppercase"
              >
                Get directions <Arrow />
              </a>
            </div>
            <div data-reveal>
              <h3 className="meta text-gold">Cell</h3>
              <ul className="mt-5 space-y-2">
                {company.phones.map((p) => (
                  <li key={p.tel}>
                    <a
                      href={`tel:${p.tel}`}
                      className="serif tabular link-line text-[1.35rem] leading-tight text-ivory"
                    >
                      {p.display}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div data-reveal className="sm:col-span-2">
              <h3 className="meta text-gold">Online</h3>
              <ul className="mt-5 flex flex-col gap-2 text-[1.0625rem] text-ivory/85 sm:flex-row sm:gap-10">
                {company.websites.map((w) => (
                  <li key={w.href}>
                    <a href={w.href} target="_blank" rel="noreferrer" className="link-line">
                      {w.display}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-24 grid gap-10 border-t border-ivory/10 pt-10 lg:mt-[clamp(2rem,7vh,5rem)] lg:grid-cols-12 lg:items-center lg:gap-8 lg:pt-7">
          <div className="flex items-center gap-6 lg:col-span-4">
            <Img
              group="brand"
              name="crest"
              alt="Classic Hyderabad crest"
              sizes="96px"
              className="h-auto w-24 shrink-0"
            />
            <ul className="space-y-1 text-[0.8125rem] text-ivory/60">
              {groupCompanies.map((g) => (
                <li key={g.name}>{g.name}</li>
              ))}
            </ul>
          </div>
          <nav aria-label="Footer" className="lg:col-span-5">
            <ul className="flex flex-wrap gap-x-7 gap-y-3 xl:gap-x-9">
              {navLinks.map((l) => (
                <li key={l.to}>
                  <TLink
                    to={l.to}
                    className="link-line text-[0.6875rem] font-medium tracking-[0.22em] text-ivory/80 uppercase"
                  >
                    {l.label}
                  </TLink>
                </li>
              ))}
            </ul>
          </nav>
          <p className="meta text-ivory/50 lg:col-span-3 lg:text-right">
            {company.certification} · Since {company.since}
          </p>
        </div>

        <div className="mt-10 flex flex-col gap-2 text-[0.75rem] text-ivory/45 sm:flex-row sm:justify-between lg:mt-6">
          <p>© {year} Classic Designer Tiles (P) Ltd. All rights reserved.</p>
          <p>{company.tagline}</p>
        </div>
      </div>

      <p
        aria-hidden="true"
        className="serif pointer-events-none -mb-[0.18em] text-center text-[14vw] lg:absolute lg:inset-x-0 lg:bottom-0 lg:mb-[-0.2em] leading-[0.8] tracking-[-0.02em] whitespace-nowrap text-ivory/[0.045] uppercase select-none"
      >
        Classic
      </p>
    </footer>
  )
}
