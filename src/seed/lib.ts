import path from 'path'
import { fileURLToPath } from 'url'
import type { Payload } from 'payload'

const ASSETS = path.join(path.dirname(fileURLToPath(import.meta.url)), 'assets')

/**
 * Текст из макета. Тильда в сиде означает неразрывный пробел: сам символ
 * в редакторе не виден, и правка строки потеряла бы его незаметно.
 */
export const t = (text: string) => text.replace(/~/g, ' ')

/** Файл из src/seed/assets в Media. Повторный прогон сида находит уже загруженный */
export async function seedMedia(payload: Payload, file: string, alt: string) {
  const { docs } = await payload.find({
    collection: 'media',
    where: { filename: { equals: file } },
    limit: 1,
    depth: 0,
  })
  if (docs[0]) return docs[0].id

  const media = await payload.create({
    context: { disableRevalidate: true },
    collection: 'media',
    data: { alt },
    filePath: path.join(ASSETS, file),
  })
  return media.id
}
