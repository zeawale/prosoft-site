import type { CollectionConfig } from 'payload'
import { revalidatePath } from 'next/cache'

export const Team: CollectionConfig = {
  slug: 'team',
  labels: { singular: 'Сотрудник', plural: 'Команда' },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'role', 'isFounder', 'order'],
    group: 'Контент',
  },
  access: { read: () => true },
  hooks: {
    afterChange: [
      ({ req }) => {
        if (req?.context?.disableRevalidate) return
        revalidatePath('/')
        revalidatePath('/about')
        revalidatePath('/soprovozhdenie')
      },
    ],
  },
  fields: [
    { name: 'name', type: 'text', label: 'Имя', required: true },
    { name: 'role', type: 'text', label: 'Должность', required: true },
    { name: 'photo', type: 'upload', relationTo: 'media', label: 'Фото', required: true },
    { name: 'quote', type: 'textarea', label: 'Цитата' },
    {
      name: 'links',
      type: 'array',
      label: 'Каналы',
      labels: { singular: 'Канал', plural: 'Каналы' },
      fields: [
        {
          type: 'row',
          fields: [
            { name: 'label', type: 'text', label: 'Название', required: true },
            { name: 'url', type: 'text', label: 'Адрес', required: true },
          ],
        },
      ],
    },
    {
      name: 'isFounder',
      type: 'checkbox',
      label: 'Основатель',
      defaultValue: false,
      admin: { position: 'sidebar', description: 'Его цитата идёт большим блоком на главной' },
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
