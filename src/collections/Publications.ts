import type { CollectionConfig } from 'payload'
import { revalidatePath } from 'next/cache'

const isVideo = (data: Record<string, unknown> | undefined) => data?.kind === 'video'

export const Publications: CollectionConfig = {
  slug: 'publications',
  labels: { singular: 'Публикация', plural: 'Публикации и выступления' },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'kind', 'showOnHome', 'order'],
    group: 'Контент',
  },
  access: { read: () => true },
  hooks: {
    afterChange: [
      ({ req }) => {
        if (req?.context?.disableRevalidate) return
        revalidatePath('/')
        revalidatePath('/perehod-s-upp')
        revalidatePath('/dorabotka')
      },
    ],
  },
  fields: [
    {
      name: 'kind',
      type: 'select',
      label: 'Тип',
      required: true,
      defaultValue: 'article',
      options: [
        { value: 'video', label: 'Выступление' },
        { value: 'article', label: 'Статья' },
      ],
    },
    { name: 'title', type: 'text', label: 'Заголовок', required: true },
    {
      type: 'collapsible',
      label: 'Карточка',
      fields: [
        {
          name: 'source',
          type: 'text',
          label: 'Издание или формат',
          required: true,
          admin: { description: 'РБК, Бизнес стратегии, Вебинар, Форум' },
        },
        { name: 'author', type: 'text', label: 'Автор или спикер', required: true },
        {
          name: 'cover',
          type: 'upload',
          relationTo: 'media',
          label: 'Обложка',
          admin: { condition: isVideo },
        },
        { name: 'duration', type: 'text', label: 'Длительность', admin: { condition: isVideo } },
        {
          name: 'caption',
          type: 'text',
          label: 'Подпись под обложкой',
          admin: { condition: isVideo },
        },
      ],
    },
    {
      type: 'collapsible',
      label: 'Окно с подробностями',
      fields: [
        { name: 'detailSource', type: 'text', label: 'Строка над заголовком', required: true },
        { name: 'meta', type: 'text', label: 'Строка под заголовком', required: true },
        { name: 'lead', type: 'textarea', label: 'Описание', required: true },
        { name: 'listTitle', type: 'text', label: 'Заголовок списка' },
        {
          name: 'listKind',
          type: 'select',
          label: 'Вид списка',
          defaultValue: 'text',
          options: [
            { value: 'text', label: 'Абзацы' },
            { value: 'timecodes', label: 'Таймкоды' },
            { value: 'dates', label: 'Даты' },
          ],
        },
        {
          name: 'list',
          type: 'array',
          label: 'Список',
          labels: { singular: 'Пункт', plural: 'Пункты' },
          fields: [
            {
              name: 'marker',
              type: 'text',
              label: 'Таймкод или дата',
              admin: { description: 'Для вида «Абзацы» не нужно' },
            },
            { name: 'text', type: 'textarea', label: 'Текст', required: true },
          ],
        },
        {
          type: 'row',
          fields: [
            { name: 'ctaLabel', type: 'text', label: 'Кнопка', required: true },
            {
              name: 'url',
              type: 'text',
              label: 'Адрес материала',
              admin: { description: 'Пока пусто, кнопки в окне нет' },
            },
          ],
        },
      ],
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
