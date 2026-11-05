import type { Media } from '@/payload-types'

export type ImageData = { url: string; alt: string }

/** Связь с Media в данные для next/image. Без depth вместо документа приходит id */
export function toImage(media: number | Media | null | undefined): ImageData | null {
  if (!media || typeof media !== 'object' || !media.url) return null
  return { url: media.url, alt: media.alt }
}
