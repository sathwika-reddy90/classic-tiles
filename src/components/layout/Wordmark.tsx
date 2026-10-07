import { mediaEntry, mediaSrc, mediaSrcSet } from '../../lib/media'

/** The Classic Hyderabad crest, as printed on the catalogue cover. */
export function Wordmark({ className = '' }: { className?: string }) {
  const crest = mediaEntry('brand', 'crest')
  return (
    <img
      src={mediaSrc('brand', 'crest')}
      srcSet={mediaSrcSet('brand', 'crest')}
      sizes="80px"
      width={crest.w}
      height={crest.h}
      alt=""
      className={`block h-12 w-auto lg:h-14 ${className}`}
    />
  )
}
