import type { MetadataRoute } from 'next'
import { getPayload } from 'payload'
import config from '@payload-config'
import { ROUTES } from '@/lib/navigation'
import { SITE_URL } from '@/lib/site'

/**
 * Карта сайта: /sitemap.xml.
 *
 * /privacy и /consent здесь нет: у них noindex, а страница с noindex в карте
 * это противоречивый сигнал поисковику.
 *
 * lastModified берётся из updatedAt глобала или кейса: дата, которую
 * поисковик может проверить, лучше выдуманной «сегодня». Пересборка раз в
 * час: адреса меняются редко.
 */
export const revalidate = 3600

const url = (path: string) => `${SITE_URL}${path === '/' ? '/' : path}`

const PAGES = [
  ['home', ROUTES.home],
  ['upp', ROUTES.upp],
  ['erp', ROUTES.erp],
  ['dorabotka', ROUTES.dorabotka],
  ['support', ROUTES.support],
  ['diagnostics', ROUTES.diagnostics],
  ['cases-page', ROUTES.cases],
  ['about', ROUTES.about],
] as const

const when = (doc: { updatedAt?: string | null }) =>
  doc.updatedAt ? new Date(doc.updatedAt) : undefined

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const payload = await getPayload({ config })

  const [pages, cases] = await Promise.all([
    Promise.all(
      PAGES.map(async ([slug, path]) => ({
        url: url(path),
        lastModified: when(await payload.findGlobal({ slug, depth: 0 })),
      })),
    ),
    payload.find({ collection: 'cases', limit: 0, depth: 0, pagination: false }),
  ])

  return [
    ...pages,
    ...cases.docs.map((doc) => ({ url: url(`/cases/${doc.slug}`), lastModified: when(doc) })),
  ]
}
