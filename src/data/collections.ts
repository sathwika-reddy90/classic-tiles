import type { Category, Chapter, Collection, CollectionId } from './types'

export const categories: Category[] = [
  { id: 'floor-tiles', label: 'Floor Tiles' },
  { id: 'pavers', label: 'Pavers' },
  { id: 'wall-tiles', label: 'Wall Tiles' },
  { id: 'blocks', label: 'Blocks & Bollards' },
  { id: 'kerb-drain', label: 'Kerb & Drain' },
  { id: 'jalies', label: 'Jalies' },
  { id: 'clay-tiles', label: 'Decorative Tiles' },
]

/** Catalogue sections in catalogue order. Titles, taglines and feature bands are verbatim. */
export const collections: Collection[] = [
  {
    id: 'designer-floor-tiles',
    title: 'Designer Floor Tiles — 25\u00a0mm',
    tagline: 'Design That Lasts. Style That Endures.',
    subline: 'Where Durability Meets Design.',
    properties: [],
    application: 'Floors',
    scene: 'interior-floor',
  },
  {
    id: 'designer-pavers',
    title: 'Classic Designer Pavers',
    properties: ['Slip Resistant', 'UV Stable', 'Heavy Duty', 'Eco-Friendly'],
    application: 'Outdoor use',
    scene: 'hex-driveway',
  },
  {
    id: 'designer-pavers-series-2',
    title: 'Classic Designer Pavers Series 2',
    properties: ['Load-Bearing', 'Weatherproof', 'Low Maintenance', 'Eco-Friendly'],
    scene: 'palm-pathway',
  },
  {
    id: 'designer-wall-tiles',
    title: 'Classic Designer Wall Tiles Series',
    tagline: 'Where Durability Meets Design.',
    properties: [],
    application: 'Walls',
    scene: 'wall-house',
  },
  {
    id: 'square-shot-blast-pavers',
    title: 'Designer Square & Shot Blast Pavers',
    tagline: 'Strength that defines modern architecture.',
    properties: ['Slip Resistant', 'Heavy Duty', 'UV Stable', 'Eco Friendly'],
    application: 'Outdoor use',
    scene: 'square-water',
  },
  {
    id: 'building-blocks',
    title: 'Building Blocks & Bollards',
    tagline: 'Built to Last. Trusted by Builders.',
    subline: 'Precision-made fly ash bricks for a sustainable tomorrow.',
    properties: ['Eco Friendly', 'Load Bearing', 'High Compression Strength', 'Weather Resistant'],
    scene: 'blocks-site',
  },
  {
    id: 'designer-combi-pavers',
    title: 'Designer & Combi Pavers',
    tagline: 'Engineered for beauty. Designed for strength.',
    properties: ['Slip Resistant', 'UV Stable', 'Eco Friendly'],
    application: 'Outdoor use',
    scene: 'combi-render',
  },
  {
    id: 'kerb-stones-water-drains',
    title: 'Kerb Stones & Water Drains',
    tagline: 'Engineered for Endurance. Trusted by Cities.',
    subline: 'Precision Engineered for Infrastructure Projects.',
    properties: ['High Strength', 'Weather Resistant', 'Precision Cast', 'UV Stable', 'Long Life'],
    application: 'Infrastructure projects',
    scene: 'kerb-road',
  },
  {
    id: 'kerb-stones-jalies',
    title: 'Kerb Stones & Partition / Elevation Jalies',
    tagline: 'Strength for Pathways. Style for Spaces.',
    subline: 'Precision Built. Architecturally Inspired.',
    properties: ['High Strength', 'UV Stable', 'Weather Resistant', 'Eco Friendly', 'Long Life'],
    scene: 'jali-wall',
  },
  {
    id: 'clay-decorative-tiles',
    title: 'Clay Decorative Tiles',
    tagline: 'Strength in Tradition. Beauty in Design.',
    properties: [],
    scene: 'clay-courtyard-landscape',
  },
]

export const collectionById = Object.fromEntries(collections.map((c) => [c.id, c])) as Record<
  CollectionId,
  Collection
>

/** The homepage reads the catalogue as nine chapters. */
export const chapters: Chapter[] = [
  {
    id: 'floor-tiles',
    number: '01',
    title: 'Designer Floor Tiles',
    tagline: 'Design that lasts. Style that endures.',
    collections: ['designer-floor-tiles'],
    scene: 'interior-floor-portrait',
    specimen: 'mercury',
  },
  {
    id: 'designer-pavers',
    number: '02',
    title: 'Designer Pavers',
    tagline: 'Slip resistant, UV stable, heavy duty.',
    collections: ['designer-pavers', 'designer-pavers-series-2'],
    scene: 'hex-driveway-portrait',
    specimen: 'hexagonal',
  },
  {
    id: 'wall-tiles',
    number: '03',
    title: 'Designer Wall Tiles',
    tagline: 'Where durability meets design.',
    collections: ['designer-wall-tiles'],
    scene: 'wall-house-portrait',
    specimen: 'swathi',
  },
  {
    id: 'square-shot-blast',
    number: '04',
    title: 'Square & Shot Blast Pavers',
    tagline: 'Strength that defines modern architecture.',
    collections: ['square-shot-blast-pavers'],
    scene: 'square-water',
    specimen: 'shot-blast-paver',
  },
  {
    id: 'building-blocks',
    number: '05',
    title: 'Building Blocks & Bollards',
    tagline: 'Built to last. Trusted by builders.',
    collections: ['building-blocks'],
    scene: 'blocks-site',
    specimen: 'partition-block-225',
  },
  {
    id: 'combi-pavers',
    number: '06',
    title: 'Designer & Combi Pavers',
    tagline: 'Engineered for beauty. Designed for strength.',
    collections: ['designer-combi-pavers'],
    scene: 'combi-render-portrait',
    specimen: 'triarc',
  },
  {
    id: 'kerb-drains',
    number: '07',
    title: 'Kerb Stones & Water Drains',
    tagline: 'Engineered for endurance. Trusted by cities.',
    collections: ['kerb-stones-water-drains'],
    scene: 'kerb-road-portrait',
    specimen: 'water-drain',
  },
  {
    id: 'kerb-jalies',
    number: '08',
    title: 'Kerb Stones & Elevation Jalies',
    tagline: 'Strength for pathways. Style for spaces.',
    collections: ['kerb-stones-jalies'],
    scene: 'jali-wall-portrait',
    specimen: 'jali-01',
  },
  {
    id: 'clay-tiles',
    number: '09',
    title: 'Clay Decorative Tiles',
    tagline: 'Strength in tradition. Beauty in design.',
    collections: ['clay-decorative-tiles'],
    scene: 'clay-courtyard',
    specimen: 'clay-ttb',
  },
]

export const chapterById = Object.fromEntries(chapters.map((c) => [c.id, c])) as Record<string, Chapter>
