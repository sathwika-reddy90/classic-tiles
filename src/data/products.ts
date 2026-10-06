/**
 * Product library — every entry is transcribed from the Classic catalogue.
 *
 * Conventions
 *  - `name` follows the catalogue; three misspellings are corrected
 *    (Bollerd → Bollard, Sausar → Saucer, Short Blast → Shot Blast).
 *  - `dimensions` are as published; "mm" is appended where the catalogue
 *    prints bare millimetre figures for kerbs and drains.
 *  - Paver "Area" values are reproduced as printed (the catalogue gives no unit).
 *  - Where two catalogue pages disagree on paver thickness, the product's own
 *    page is used (page 9 / 10) and the area comes from page 14. Page 10
 *    prints a malformed "60/80/10mm" for Triarc and Combi Pavers; for those
 *    two the page 14 thickness is used.
 *  - To add a product: append an entry and, if new imagery is needed, add a
 *    crop to scripts/extract_catalogue_media.py and run `npm run media`.
 */
import type { CategoryId, CollectionId, Product, ProductImageKey, Spec } from './types'

const t25: Spec = { label: 'Thickness', value: '25 mm' }
const thickness = (value: string): Spec => ({ label: 'Thickness', value })
const area = (value: string): Spec => ({ label: 'Area', value })

const floorTile = (id: ProductImageKey, name: string, dimensions: string[], specs: Spec[] = [t25]): Product => ({
  id,
  name,
  category: 'floor-tiles',
  collections: ['designer-floor-tiles'],
  dimensions,
  specs,
  images: [id],
})

const concrete = (
  id: ProductImageKey,
  name: string,
  category: CategoryId,
  collections: CollectionId[],
  dimensions: string[],
  extra: Partial<Product> = {},
): Product => ({ id, name, category, collections, dimensions, images: [id], ...extra })

const clayTile = (id: ProductImageKey, code: string, size: string, weight: string, perHundred: string): Product => ({
  id,
  name: code,
  category: 'clay-tiles',
  collections: ['clay-decorative-tiles'],
  dimensions: [size],
  specs: [
    { label: 'Weight', value: weight },
    { label: 'Covering area', value: `100 SFT : ${perHundred} Nos.` },
  ],
  images: [id],
})

export const products: Product[] = [
  // ── Designer Floor Tiles — 25 mm (catalogue pp. 7–8) ───────────────────────
  floorTile('scorpio', 'Scorpio', ['304 × 304 mm']),
  floorTile('mercury', 'Mercury', ['304 × 304 mm']),
  floorTile('matrix', 'Matrix', ['304 × 304 mm']),
  floorTile('vaibhav', 'Vaibhav', ['380 × 380 mm']),
  floorTile('casino', 'Casino', ['270 × 270 mm']),
  floorTile('innova', 'Innova', ['304 × 304 mm']),
  floorTile('new-arien', 'New Arien', ['304 × 304 mm']),
  floorTile('dollar', 'Dollar', ['304 × 304 mm']),
  floorTile('13-box', '13 Box', ['400 × 400 mm'], [thickness('35 mm')]),
  floorTile('nitco', 'Nitco', ['304 × 304 mm']),
  floorTile('taurus', 'Taurus', ['360 × 269 mm']),
  floorTile('granito', 'Granito', ['342 × 342 mm']),
  floorTile('chatura', 'Chatura', ['304 × 304 mm', 'Mint 100 × 100 mm']),
  floorTile('smart-button', 'Smart Button', ['304 × 304 mm']),
  floorTile('polo', 'Polo / Polo Mint', ['Polo 300 × 340 mm', 'Polo Mint 85 × 100 mm']),
  floorTile('six-box', 'Six Box', ['304 × 304 mm']),

  // ── Classic Designer Pavers (p. 9; areas from p. 14) ───────────────────────
  concrete('i-block', 'I-Block', 'pavers', ['designer-pavers', 'designer-combi-pavers'], [], {
    specs: [thickness('60 / 80 / 100 mm'), area('0.40')],
  }),
  concrete('zig-zag', 'Zig Zag', 'pavers', ['designer-pavers', 'designer-combi-pavers'], [], {
    specs: [thickness('60 / 80 / 100 mm'), area('0.35')],
  }),
  concrete('barbie', 'Barbie', 'pavers', ['designer-pavers', 'designer-combi-pavers'], [], {
    specs: [thickness('60 / 80 / 100 mm'), area('0.40')],
  }),
  concrete('hexagonal', 'Hexagonal', 'pavers', ['designer-pavers', 'designer-combi-pavers'], [], {
    specs: [thickness('60 / 80 / 100 mm'), area('0.50')],
  }),

  // ── Classic Designer Pavers Series 2 (p. 10; areas from p. 14) ─────────────
  concrete('triarc', 'Triarc', 'pavers', ['designer-pavers-series-2', 'designer-combi-pavers'], [], {
    specs: [thickness('60 / 80 mm'), area('0.45')],
  }),
  concrete('hexagonal-y-shape', 'Hexagonal / Y Shape', 'pavers', ['designer-pavers-series-2'], [], {
    specs: [thickness('60 / 80 mm')],
  }),
  concrete('grass-paver-block', 'Grass Paver', 'pavers', ['designer-pavers-series-2'], [], {
    specs: [thickness('60 / 80 / 100 mm')],
  }),
  concrete('rock', 'Rock', 'pavers', ['designer-pavers-series-2', 'designer-combi-pavers'], [], {
    specs: [thickness('60 / 80 mm'), area('0.48')],
  }),
  concrete(
    'grass-paver-lattice',
    'Grass Paver',
    'pavers',
    ['designer-pavers-series-2', 'kerb-stones-water-drains'],
    ['600 × 400 mm'],
    { specs: [thickness('60 / 80 mm')] },
  ),

  // ── Designer & Combi Pavers (p. 14) ───────────────────────────────────────
  concrete('combi-pavers', 'Combi Pavers', 'pavers', ['designer-combi-pavers', 'designer-pavers-series-2'], ['8 × 4', '8 × 8', '10 × 8', '12 × 8', '14 × 8'], {
    specs: [thickness('60 mm')],
    table: {
      caption: 'Combi paver sizes',
      columns: ['Size', 'Area', 'Thickness'],
      rows: [
        ['8 × 4', '0.22', '60 mm'],
        ['8 × 8', '0.44', '60 mm'],
        ['10 × 8', '0.55', '60 mm'],
        ['12 × 8', '0.66', '60 mm'],
        ['14 × 8', '0.77', '60 mm'],
      ],
    },
    images: ['combi-pavers', 'combi-pavers-sizes'],
  }),

  // ── Classic Designer Wall Tiles Series (p. 11) ─────────────────────────────
  concrete('hurricane', 'Hurricane', 'wall-tiles', ['designer-wall-tiles'], ['72 × 187 mm']),
  concrete('swathi', 'Swathi', 'wall-tiles', ['designer-wall-tiles'], ['47 × 94 mm']),
  concrete('zigma', 'Zigma', 'wall-tiles', ['designer-wall-tiles'], ['50 × 100 mm']),
  concrete('varsha', 'Varsha', 'wall-tiles', ['designer-wall-tiles'], ['100 × 200 mm']),

  // ── Designer Square & Shot Blast Pavers (p. 12) ────────────────────────────
  concrete('square-paver-200', 'Square Paver', 'pavers', ['square-shot-blast-pavers'], ['200 × 200 mm'], {
    specs: [thickness('60 / 80 mm')],
  }),
  concrete('square-paver-100', 'Square Paver', 'pavers', ['square-shot-blast-pavers'], ['100 × 100 mm'], {
    specs: [thickness('60 / 80 mm')],
  }),
  concrete('square-paver-150', 'Square Paver', 'pavers', ['square-shot-blast-pavers'], ['150 × 150 mm'], {
    images: ['square-paver-150', 'square-paver-150-charcoal'],
  }),
  concrete('shot-blast-paver', 'Shot Blast Paver', 'pavers', ['square-shot-blast-pavers'], ['200 × 200 mm']),

  // ── Building blocks & bollards (p. 13) ─────────────────────────────────────
  concrete('wall-compound-block', 'Wall & Compound Block', 'blocks', ['building-blocks'], ['400 × 200 × 150 mm'], {
    application: 'Wall, compound blocks',
  }),
  concrete('partition-block-225', 'Partition Wall Block', 'blocks', ['building-blocks'], ['225 × 75 × 100 mm'], {
    application: 'Partition walls',
  }),
  concrete('partition-block-300', 'Partition Wall Block', 'blocks', ['building-blocks'], ['300 × 225 × 150 mm'], {
    application: 'Partition walls',
  }),
  concrete('bollard-01', 'Bollard', 'blocks', ['building-blocks'], ['8 inch × 5 feet & 6 feet'], { variant: 'Design 01' }),
  concrete('bollard-02', 'Bollard', 'blocks', ['building-blocks'], ['6 inch × 4 feet', '4 inch × 4 feet'], {
    variant: 'Design 02',
  }),
  concrete('bollard-03', 'Bollard', 'blocks', ['building-blocks'], ['8 inch × 5 feet & 6 feet'], { variant: 'Design 03' }),

  // ── Kerb Stones & Water Drains (pp. 15–16) ─────────────────────────────────
  concrete('ghmc', 'GHMC', 'kerb-drain', ['kerb-stones-water-drains'], ['600 × 325 × 150 × 115 mm']),
  concrete('metro', 'Metro', 'kerb-drain', ['kerb-stones-water-drains'], ['600 × 400 × 110 mm']),
  concrete('kerb-300-600-110', 'Kerb', 'kerb-drain', ['kerb-stones-water-drains'], ['300 × 600 × 110 mm']),
  concrete('kerb-450-450-110', 'Kerb', 'kerb-drain', ['kerb-stones-water-drains'], ['450 × 450 × 110 mm']),
  concrete('kerb-600-300-100', 'Kerb', 'kerb-drain', ['kerb-stones-water-drains'], ['600 × 300 × 100 mm']),
  concrete('water-drain', 'Water Drain', 'kerb-drain', ['kerb-stones-water-drains'], ['600 × 450 × 75 mm']),
  concrete('kerb-600-450-120', 'Kerb', 'kerb-drain', ['kerb-stones-water-drains'], ['600 × 450 × 120 mm']),
  concrete('kerb-600-300-110', 'Kerb', 'kerb-drain', ['kerb-stones-water-drains'], ['600 × 300 × 110 mm']),
  concrete('matt-finishing', 'Matt Finishing', 'kerb-drain', ['kerb-stones-water-drains'], ['600 × 300 × 125 mm']),
  concrete('saucer-drain-75', 'Saucer Drain', 'kerb-drain', ['kerb-stones-water-drains'], ['600 × 300 × 75 × 100 mm']),
  concrete('saucer-drain-150', 'Saucer Drain', 'kerb-drain', ['kerb-stones-water-drains'], ['600 × 300 × 150 × 100 mm']),

  // ── Kerb Stones & Partition / Elevation Jalies (p. 17) ─────────────────────
  concrete('kerb-stone-150', 'Kerb Stone', 'kerb-drain', ['kerb-stones-jalies'], ['300 × 300 × 150 mm', '600 × 300 × 150 mm']),
  concrete('kerb-stone-600-325-120', 'Kerb Stone', 'kerb-drain', ['kerb-stones-jalies'], ['600 × 325 × 120 mm']),
  concrete('bullnose', 'Bullnose', 'kerb-drain', ['kerb-stones-jalies'], ['600 × 400 × 100 mm']),
  concrete('grass-paver-300', 'Grass Paver', 'pavers', ['kerb-stones-jalies'], ['300 × 300 × 80 mm']),
  concrete('jali-01', 'Partition / Elevation Jali', 'jalies', ['kerb-stones-jalies'], [], {
    variant: 'Design 01',
    application: 'Partitions and elevations',
  }),
  concrete('jali-02', 'Partition / Elevation Jali', 'jalies', ['kerb-stones-jalies'], [], {
    variant: 'Design 02',
    application: 'Partitions and elevations',
  }),

  // ── Clay Decorative Tiles (p. 19) ──────────────────────────────────────────
  clayTile('clay-ec', 'EC', '9" × 3"', '390 gms', '530'),
  clayTile('clay-plain', 'PLAIN', '9" × 3"', '390 gms', '530'),
  clayTile('clay-adr', 'ADR', '9" × 6"', '1000 gms', '270'),
  clayTile('clay-mmr', 'MMR', '9" × 3"', '400 gms', '530'),
  clayTile('clay-smr', 'SMR', '8" × 5"', '700 gms', '375'),
  clayTile('clay-pgi', 'PGI', '8" × 5"', '700 gms', '375'),
  clayTile('clay-dpd', 'DPD', '8" × 5"', '700 gms', '375'),
  clayTile('clay-ttb', 'TTB', '9" × 6"', '900 gms', '270'),
  clayTile('clay-mrt', 'MRT', '9" × 6"', '900 gms', '270'),
  clayTile('clay-3sph', '3SPH', '8" × 6"', '800 gms', '300'),
  clayTile('clay-jd-il', 'JD(IL)', '8" × 6"', '800 gms', '300'),
  clayTile('clay-3adr-8x5', '3ADR', '8" × 5"', '750 gms', '370'),
  clayTile('clay-3dsp', '3DSP', '8" × 5"', '750 gms', '375'),
  clayTile('clay-3ddp', '3DDP', '8" × 5"', '800 gms', '375'),
  clayTile('clay-rt', 'RT', '8" × 4"', '500 gms', '450'),
  clayTile('clay-4adr', '4ADR', '9" × 6"', '1000 gms', '270'),
  clayTile('clay-3adr-9x6', '3ADR', '9" × 6"', '1000 gms', '270'),
  clayTile('clay-3dpd', '3 DPD', '9" × 6"', '1000 gms', '270'),
]

export const productById = Object.fromEntries(products.map((p) => [p.id, p])) as Record<string, Product>

/** Curated for the homepage. */
export const featuredIds = ['scorpio', 'mercury', 'casino', 'vaibhav', 'taurus', 'granito', 'polo', 'dollar'] as const

/** The headline measurement shown on cards: dimensions first, otherwise thickness. */
export function primaryMeasure(p: Product): string {
  if (p.dimensions.length) return p.dimensions.join(' · ')
  const t = p.specs?.find((s) => s.label === 'Thickness')
  return t ? `${t.value} thick` : ''
}

export function displayName(p: Product): string {
  return p.variant ? `${p.name} — ${p.variant}` : p.name
}

export function productsIn(collectionIds: readonly CollectionId[]): Product[] {
  return products.filter((p) => p.collections.some((c) => collectionIds.includes(c)))
}
