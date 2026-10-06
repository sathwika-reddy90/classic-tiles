import { useState, type ImgHTMLAttributes } from 'react'
import { mediaEntry, mediaSrc, mediaSrcSet, type MediaGroup } from '../../lib/media'

type Props = Omit<ImgHTMLAttributes<HTMLImageElement>, 'src' | 'srcSet' | 'width' | 'height'> & {
  group: MediaGroup
  name: string
  alt: string
  sizes: string
  priority?: boolean
}

/** Responsive WebP image from the catalogue media set; fades in once decoded. */
export function Img({ group, name, alt, sizes, priority = false, className = '', ...rest }: Props) {
  const entry = mediaEntry(group, name as never)
  const [loaded, setLoaded] = useState(false)
  return (
    <img
      src={mediaSrc(group, name)}
      srcSet={mediaSrcSet(group, name)}
      sizes={sizes}
      width={entry.w}
      height={entry.h}
      alt={alt}
      loading={priority ? 'eager' : 'lazy'}
      decoding={priority ? 'sync' : 'async'}
      fetchPriority={priority ? 'high' : 'auto'}
      onLoad={() => setLoaded(true)}
      ref={(el) => {
        if (el?.complete && el.naturalWidth) setLoaded(true)
      }}
      className={`img-fade ${loaded ? 'is-loaded' : ''} ${className}`}
      {...rest}
    />
  )
}
