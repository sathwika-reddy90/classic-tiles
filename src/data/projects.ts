/** Projects and clients exactly as listed in the Classic catalogue (pages 3–6). */
import type { ProjectImageKey } from './types'

export interface FeaturedProject {
  id: ProjectImageKey
  name: string
  sector: string
}

/** "Prestigious Projects" — the catalogue's photographed works. */
export const featuredProjects: FeaturedProject[] = [
  { id: 'telangana-secretariat', name: 'Telangana Secretariat', sector: 'Government' },
  { id: 'cm-camp-office', name: 'CM Camp Office — Praja Bhavan', sector: 'Government' },
  { id: 'metro-miyapur', name: 'Metro Railway Station — Miyapur', sector: 'Metro Rail' },
  { id: 'secunderabad-railway-station', name: 'Secunderabad Railway Station', sector: 'Railways' },
  { id: 'ameerpet-metro-office', name: 'Ameerpet Metro Office', sector: 'Metro Rail' },
  { id: 'jubilee-hills-road-36', name: 'Jubilee Hills Rd. No. 36', sector: 'Streetscape' },
  { id: 'shilparamam', name: 'Shilparamam', sector: 'Public Realm' },
  { id: 'road-side-pathway', name: 'Road Side Pathway', sector: 'Pathways' },
]

export interface Register {
  id: string
  title: string
  subtitle: string
  entries: string[]
}

export const registers: Register[] = [
  {
    id: 'government',
    title: 'Government + PSU + National Projects',
    subtitle: 'Major government & public sector projects',
    entries: [
      'Telangana Secretariat',
      'Pragathi Bhavan',
      'Raj Bhavan Quarters',
      'L&T Hyderabad Metro Rail',
      'GHMC',
      'Godavari & Krishna Pushkaram Works',
      'IAS Officers Quarters',
      'Hyderabad Urban Development',
      'Shapoorji & Pallonji',
      'Hitex Infra',
      'RGIA & Begumpet Airport',
      'IOCL / HPCL / BPCL',
      'ESSAR & Reliance Petroleum',
      'DRDO, DRDL & DMRL',
      'MES',
      'GMR',
      'South Central & South Eastern Railways',
      'MMTS Railway Stations',
      'Municipal Corporation of Hyderabad',
      'MCH Sports Complex – Swimming Pool',
      'CPWD',
      'APIC',
      'R&B Department',
      'Green Space Housing',
      'Nagarjuna Constructions',
      'HRDCL',
      'Andhra Bank Branches',
    ],
  },
  {
    id: 'private',
    title: 'Premium Private & Infra Clients',
    subtitle: 'Builders + infra companies',
    entries: [
      'Buildnext Infracon Pvt Ltd',
      'DEC Infra Projects Pvt Ltd',
      'Ramkrishy Infra',
      'Tycoon Infra Projects',
      'L & T Infocity',
      'Inspace Projects Pvt. Ltd.',
      'Aarvy Infra',
      'Merit Infra',
      'Unique Infra Engineers',
      'Sri Sai Construction',
      'Gayatri Constructions',
      'Aruhi Constructions',
      'J.K. Constructions',
      'G.V.R. Constructions',
      'Y.V.R. Constructions',
      'R.Wadmull & Sons',
      'Elite Builders',
      'Eternal Builders',
      'Green Earth Engineers',
      'Peram Group',
      'Advait Homes',
      'Gorla Constructions',
      'Srija Constructions',
      'KPC Projects',
      'JB Realtors',
      'Asain Estates',
      'Agile Infrastructure',
      'GKRL Projects',
      'ACE Ventures',
    ],
  },
  {
    id: 'institutions',
    title: 'Institutions, Universities & Special Projects',
    subtitle: 'Institutions & special projects',
    entries: [
      'Nizam Club',
      'ShanthiVanam, Khanapur',
      'Survey of India',
      'ICMR',
      'Collector Offices All over Telangana State',
      'IICT',
      'ACE College',
      'AP Tourism',
      'IVRCL',
      'JNTU',
      'NFC',
      'BEL',
      'ECIL',
      'HAL',
      'KCP',
      'Venkateshwara Hostels & Resorts',
      'BPR Infrastructure Limited',
      'Muppa Projects India Pvt Ltd',
    ],
  },
]

export const registerTotal = registers.reduce((n, r) => n + r.entries.length, 0)
