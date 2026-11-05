import { getPayload } from 'payload'
import type { GlobalSlug } from 'payload'
import config from '@payload-config'

/**
 * Проверка, что глобал вообще заполняли.
 *
 * Глобал, который ни разу не сохраняли, Payload отдаёт без полей: findGlobal
 * возвращает объект, где required-поля равны undefined, хотя сгенерированный
 * тип обещает строку. Отсюда правило по проекту: страница падает громко, а не
 * рисует пустоту. Проверка стоит в геттере, страницы получают заполненный
 * глобал и не защищаются по второму разу.
 *
 * Проверяются только обязательные поля верхнего уровня: те, без которых
 * страница бессмысленна.
 */
export function assertFilled<T extends object>(
  doc: T,
  slug: string,
  keys: readonly (keyof T)[],
): T {
  const missing = keys.filter((key) => doc[key] === undefined || doc[key] === null)

  if (missing.length) {
    throw new Error(
      `Глобал «${slug}» не заполнен: нет полей ${missing.map(String).join(', ')}. ` +
        'Прогоните сид или сохраните страницу в админке.',
    )
  }

  return doc
}

/**
 * Глобал страницы с проверкой, что его заполняли. depth 1: картинки — связи
 * с Media, без глубины вместо документа приедет id.
 */
export async function getPageGlobal<S extends GlobalSlug>(slug: S, required: string[] = []) {
  const payload = await getPayload({ config })
  const doc = await payload.findGlobal({ slug, depth: 1 })
  return assertFilled(doc as object, slug, required as never[]) as typeof doc
}

export async function getSettings() {
  const payload = await getPayload({ config })
  return payload.findGlobal({ slug: 'settings', depth: 0 })
}

export const getCookieBanner = async () => {
  const payload = await getPayload({ config })
  const banner = await payload.findGlobal({ slug: 'cookie-banner', depth: 0 })
  return assertFilled(banner, 'cookie-banner', ['version', 'text'])
}

export const getLegalPage = async (slug: 'privacy' | 'consent') => {
  const payload = await getPayload({ config })
  const { docs } = await payload.find({
    collection: 'legal-pages',
    where: { slug: { equals: slug } },
    limit: 1,
    depth: 0,
  })
  return docs[0]
}

/**
 * Версия согласия для записи в заявку. Живёт в документе, а не в константе:
 * текст согласия правится в админке, и версия обязана меняться вместе с ним.
 */
export const getConsentVersion = async (): Promise<string | undefined> => {
  const doc = await getLegalPage('consent')
  return doc?.version ?? undefined
}

export const getHomeCases = async () => {
  const payload = await getPayload({ config })
  const { docs } = await payload.find({
    collection: 'cases',
    where: { showOnHome: { equals: true } },
    sort: 'order',
    limit: 3,
    depth: 0,
  })
  return docs
}

export const getHomeReviews = async () => {
  const payload = await getPayload({ config })
  const { docs } = await payload.find({
    collection: 'reviews',
    where: { showOnHome: { equals: true } },
    sort: 'order',
    limit: 100,
    depth: 0,
  })
  return docs
}

/** depth 1: фото — связь с Media */
export const getTeam = async () => {
  const payload = await getPayload({ config })
  const { docs } = await payload.find({ collection: 'team', sort: 'order', limit: 100, depth: 1 })
  return docs
}

/** depth 1: обложка — связь с Media */
export const getHomePublications = async () => {
  const payload = await getPayload({ config })
  const { docs } = await payload.find({
    collection: 'publications',
    where: { showOnHome: { equals: true } },
    sort: 'order',
    limit: 100,
    depth: 1,
  })
  return docs
}
