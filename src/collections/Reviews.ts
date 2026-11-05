import type { CollectionConfig } from 'payload'
import { revalidatePath } from 'next/cache'

/**
 * Отзывы клиентов. Коллекция, а не поля глобала: те же отзывы идут на
 * главную и на «О компании». Флаг showOnHome решает, кто попадает на
 * главную, порядок задаётся полем order.
 */
export const Reviews: CollectionConfig = {
  slug: 'reviews',
  labels: { singular: 'Отзыв', plural: 'Отзывы' },
  access: { read: () => true },
  hooks: {
    afterChange: [
      ({ req }) => {
        if (req?.context?.disableRevalidate) return
        revalidatePath('/')
        revalidatePath('/about')
        revalidatePath('/dorabotka')
      },
    ],
    afterDelete: [
      ({ req }) => {
        if (req?.context?.disableRevalidate) return
        revalidatePath('/')
        revalidatePath('/about')
        revalidatePath('/dorabotka')
      },
    ],
  },
  admin: {
    useAsTitle: 'author',
    defaultColumns: ['author', 'role', 'showOnHome', 'order'],
    group: 'Контент',
  },
  fields: [
    { name: 'author', type: 'text', label: 'Имя автора', required: true },
    {
      name: 'role',
      type: 'text',
      label: 'Должность или компания',
      admin: { description: 'Например: Собственник, ООО «Артальт»' },
    },
    { name: 'text', type: 'textarea', label: 'Полный текст', required: true },
    {
      name: 'excerpt',
      type: 'textarea',
      label: 'Выдержка для карусели',
      admin: { description: 'Карточка карусели невысокая. Пусто: идёт полный текст' },
    },
    {
      name: 'showOnHome',
      type: 'checkbox',
      label: 'Показывать на главной',
      defaultValue: true,
      admin: { position: 'sidebar' },
    },
    {
      name: 'order',
      type: 'number',
      label: 'Порядок',
      defaultValue: 0,
      admin: { position: 'sidebar' },
    },
  ],
}
