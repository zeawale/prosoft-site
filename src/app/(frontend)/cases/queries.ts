import { cache } from 'react'
import { getPayload } from 'payload'
import config from '@payload-config'

/** Все кейсы в порядке каталога. cache: метаданные и страница кейса читают один список */
export const getCatalogCases = cache(async () => {
  const payload = await getPayload({ config })
  const { docs } = await payload.find({
    collection: 'cases',
    sort: 'catalogOrder',
    limit: 100,
    depth: 0,
  })
  return docs
})
