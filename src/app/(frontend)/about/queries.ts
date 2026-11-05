import { getPayload } from 'payload'
import config from '@payload-config'

/** Все отзывы: флаг showOnHome решает только за главную */
export const getAllReviews = async () => {
  const payload = await getPayload({ config })
  const { docs } = await payload.find({
    collection: 'reviews',
    sort: 'order',
    limit: 100,
    depth: 0,
  })
  return docs
}
