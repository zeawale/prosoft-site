import type { GlobalConfig } from 'payload'
import { revalidatePath } from 'next/cache'
import { iconField } from '../collections/fields/iconField'
import { pageHeroField } from '../collections/fields/pageHeroField'
import { sectionHeaderFields } from '../collections/fields/sectionHeaderFields'
import { seoField } from '../collections/fields/seoField'
import { stageTableField } from '../collections/fields/stageTableField'

/** Сопровождение: что входит, время реакции, переход от подрядчика, кто отвечает */
export const Support: GlobalConfig = {
  slug: 'support',
  label: 'Сопровождение 1С',
  admin: { group: 'Страницы' },
  access: { read: () => true },
  hooks: {
    afterChange: [
      ({ req }) => {
        if (req?.context?.disableRevalidate) return
        revalidatePath('/soprovozhdenie')
      },
    ],
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Первый экран',
          fields: [pageHeroField({ breadcrumb: true, cta: 'request' })],
        },
        {
          name: 'included',
          label: 'Что входит',
          fields: [
            ...sectionHeaderFields(),
            {
              name: 'items',
              type: 'array',
              label: 'Карточки',
              labels: { singular: 'Карточка', plural: 'Карточки' },
              fields: [
                iconField({ required: true }),
                { name: 'title', type: 'text', label: 'Название', required: true },
                { name: 'text', type: 'textarea', label: 'Описание', required: true },
              ],
            },
          ],
        },
        {
          name: 'sla',
          label: 'Время реакции',
          fields: [
            ...sectionHeaderFields(),
            {
              type: 'row',
              fields: [
                {
                  name: 'requestLabel',
                  type: 'text',
                  label: 'Колонка «Обращение»',
                  required: true,
                },
                { name: 'reactionLabel', type: 'text', label: 'Колонка «Реакция»', required: true },
                { name: 'solutionLabel', type: 'text', label: 'Колонка «Решение»', required: true },
                { name: 'hoursLabel', type: 'text', label: 'Колонка «Часы»', required: true },
              ],
            },
            {
              name: 'rows',
              type: 'array',
              label: 'Строки',
              labels: { singular: 'Строка', plural: 'Строки' },
              fields: [
                { name: 'request', type: 'text', label: 'Обращение', required: true },
                {
                  type: 'row',
                  fields: [
                    { name: 'reaction', type: 'text', label: 'Время реакции', required: true },
                    { name: 'solution', type: 'text', label: 'Срок решения', required: true },
                    { name: 'hours', type: 'text', label: 'Часы работы', required: true },
                  ],
                },
              ],
            },
            {
              type: 'row',
              fields: [
                { name: 'price', type: 'text', label: 'Цена', required: true },
                { name: 'priceCaption', type: 'text', label: 'Подпись цены', required: true },
                { name: 'priceNote', type: 'text', label: 'Пояснение справа', required: true },
              ],
            },
          ],
        },
        {
          name: 'handover',
          label: 'Переход от подрядчика',
          fields: [...sectionHeaderFields(), stageTableField()],
        },
        { label: 'Для поисковиков', fields: [seoField()] },
      ],
    },
  ],
}
