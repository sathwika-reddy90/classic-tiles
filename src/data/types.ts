import type manifest from './media-manifest.json'

export type SceneKey = keyof typeof manifest.scenes
export type ProductImageKey = keyof typeof manifest.products
export type ProjectImageKey = keyof typeof manifest.projects

/** Filter groups on the Products page. */
export type CategoryId =
  | 'floor-tiles'
  | 'pavers'
  | 'wall-tiles'
  | 'blocks'
  | 'kerb-drain'
  | 'jalies'
  | 'clay-tiles'

/** Catalogue sections, in catalogue order. */
export type CollectionId =
  | 'designer-floor-tiles'
  | 'designer-pavers'
  | 'designer-pavers-series-2'
  | 'designer-wall-tiles'
  | 'square-shot-blast-pavers'
  | 'building-blocks'
  | 'designer-combi-pavers'
  | 'kerb-stones-water-drains'
  | 'kerb-stones-jalies'
  | 'clay-decorative-tiles'

export interface Category {
  id: CategoryId
  label: string
}

export interface Collection {
  id: CollectionId
  /** Section title as printed in the catalogue. */
  title: string
  /** Catalogue headline line(s) for the section, where one is printed. */
  tagline?: string
  /** Secondary catalogue line, where one is printed. */
  subline?: string
  /** The catalogue's feature band for the section, item by item. */
  properties: string[]
  /** Use stated or named by the catalogue for the whole section. */
  application?: string
  scene: SceneKey
}

export interface Spec {
  label: string
  value: string
}

export interface SpecTable {
  caption: string
  columns: string[]
  rows: string[][]
}

export interface Product {
  id: string
  /** Product name as printed in the catalogue (obvious misspellings corrected). */
  name: string
  /** Distinguishes unnamed designs that share a name, e.g. "Design 01". */
  variant?: string
  category: CategoryId
  /** Catalogue sections the product appears in; the first is its home. */
  collections: CollectionId[]
  /** Dimensions exactly as published. */
  dimensions: string[]
  specs?: Spec[]
  table?: SpecTable
  /** Overrides the collection-level application when the catalogue states one. */
  application?: string
  images: ProductImageKey[]
  description?: string
}

/** Homepage chapters — the catalogue read as a sequence. */
export interface Chapter {
  id: string
  number: string
  title: string
  tagline: string
  collections: CollectionId[]
  scene: SceneKey
  specimen: ProductImageKey
}
