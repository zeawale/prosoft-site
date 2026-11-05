import type { GroupField } from 'payload'

/** Заголовок и описание страницы для поисковиков */
export const seoField = (): GroupField => ({
  name: 'seo',
  type: 'group',
  label: 'Для поисковиков',
  fields: [
    { name: 'metaTitle', type: 'text', label: 'Заголовок вкладки', required: true },
    { name: 'metaDescription', type: 'textarea', label: 'Описание', required: true },
  ],
})
