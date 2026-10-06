/** Company facts, transcribed from the Classic catalogue (cover and page 2). */

export const company = {
  name: 'Classic Hyderabad',
  since: 1985,
  certification: 'ISO 9001:2008',
  tagline: "Building India's Future Together",
  phones: [
    { display: '96520 42828', tel: '+919652042828' },
    { display: '98496 60299', tel: '+919849660299' },
    { display: '96760 01199', tel: '+919676001199' },
  ],
  websites: [
    { display: 'www.classicdesignertiles.co.in', href: 'https://www.classicdesignertiles.co.in' },
    { display: 'www.classicplastocrafts.in', href: 'https://www.classicplastocrafts.in' },
  ],
  address: {
    label: 'Office & Factory',
    lines: ['Plot A-28/1/20/B, Road No. 15', 'IDA Nacharam, Hyderabad – 500 076', 'Telangana, India'],
    mapsHref:
      'https://www.google.com/maps/search/?api=1&query=Plot+A-28%2F1%2F20%2FB%2C+Road+No.+15%2C+IDA+Nacharam%2C+Hyderabad+500076',
  },
} as const

export const groupCompanies = [
  {
    name: 'Classic Designer Tiles (P) Ltd.',
    activity: 'Manufacturing of cement designer floor tiles, paver blocks, curb stones etc.',
  },
  {
    name: 'Classic Plasto Crafts',
    activity: 'Manufacturing of plastic moulded furniture, fruits & vegetables crates.',
  },
] as const

export const leadership = [
  {
    name: 'Ln. Tallada Venkanna',
    role: 'Founder Chairman & Managing Director',
    note: 'President, Telangana Designer Tiles Manufacturing Association',
  },
  {
    name: 'Tallada Sunil',
    role: 'Director',
  },
] as const

export const recognitions = [
  {
    title: 'International Achievers Award for Business & Quality Excellence',
    detail: 'Received by Sri T. Venkanna from Mrs. Sri Latha Reddy, Indian Ambassador in Thailand (Bangkok).',
  },
  {
    title: 'Best Industries Award',
    detail: 'Classic Group of companies — received by Ln. Tallada Venkanna, Chairman & Managing Director.',
  },
  {
    title: 'Best Industrialist',
    detail: 'Sri Susheel Kumar Shinde honouring Sri Ln. Tallada Venkanna, 22-06-2005, Avadana Saraswathi Peetam, Hyderabad.',
  },
] as const
