/**
 * Where the materials go. Each sector pairs a catalogue scene with the
 * collection that scene depicts, and with organisations drawn from the
 * catalogue's own project registers — no product-to-project claims are made.
 */
import type { CollectionId, SceneKey } from './types'

export interface Application {
  id: string
  title: string
  line: string
  scene: SceneKey
  /** The collection(s) visible in the scene. */
  collections: CollectionId[]
  clients: string[]
}

export const applications: Application[] = [
  {
    id: 'residential',
    title: 'Residential',
    line: 'Driveways, compound walls and elevations — the first impression of a home.',
    scene: 'wall-house',
    collections: ['designer-wall-tiles'],
    clients: ['Green Space Housing', 'Advait Homes', 'IAS Officers Quarters', 'Raj Bhavan Quarters'],
  },
  {
    id: 'civic',
    title: 'Civic & Institutional',
    line: 'Forecourts, approaches and campus pathways for the state’s public institutions.',
    scene: 'palm-pathway',
    collections: ['designer-pavers-series-2'],
    clients: ['Telangana Secretariat', 'Pragathi Bhavan', 'JNTU', 'ICMR', 'Survey of India'],
  },
  {
    id: 'infrastructure',
    title: 'Infrastructure',
    line: 'Kerb stones and water drains, precision engineered for infrastructure projects.',
    scene: 'kerb-road',
    collections: ['kerb-stones-water-drains'],
    clients: ['L&T Hyderabad Metro Rail', 'GHMC', 'South Central & South Eastern Railways', 'RGIA & Begumpet Airport'],
  },
  {
    id: 'landscape',
    title: 'Landscape & Outdoor',
    line: 'Pavers, grass pavers and kerbs that shape gardens, lawns and public grounds.',
    scene: 'hex-driveway',
    collections: ['designer-pavers'],
    clients: ['Hyderabad Urban Development', 'AP Tourism', 'Nizam Club'],
  },
]
