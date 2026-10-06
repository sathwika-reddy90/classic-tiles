import manifest from '../data/media-manifest.json'

type Manifest = typeof manifest
export type MediaGroup = keyof Manifest

interface Entry {
  w: number
  h: number
  widths: number[]
}

const BASE = import.meta.env.BASE_URL.replace(/\/$/, '')

export function mediaEntry<G extends MediaGroup>(group: G, key: keyof Manifest[G]): Entry {
  return (manifest[group] as Record<string, Entry>)[key as string]
}

export function mediaUrl(group: MediaGroup, key: string, width: number): string {
  return `${BASE}/media/${group}/${key}-${width}.webp`
}

export function mediaSrcSet(group: MediaGroup, key: string): string {
  const e = (manifest[group] as Record<string, Entry>)[key]
  return e.widths.map((w) => `${mediaUrl(group, key, w)} ${w}w`).join(', ')
}

/** A sensible fallback `src`: the largest width up to 1600px. */
export function mediaSrc(group: MediaGroup, key: string): string {
  const e = (manifest[group] as Record<string, Entry>)[key]
  const w = [...e.widths].reverse().find((x) => x <= 1600) ?? e.widths[0]
  return mediaUrl(group, key, w)
}
