import type { GlobalConfig } from 'payload'
import { revalidatePath } from 'next/cache'
import { caseCardLabelsField } from '../collections/fields/caseCardLabelsField'
import { iconField } from '../collections/fields/iconField'
import { pageHeroField } from '../collections/fields/pageHeroField'
import { reportSampleField } from '../collections/fields/reportSampleField'
import { sectionHeaderFields } from '../collections/fields/sectionHeaderFields'
import { seoField } from '../collections/fields/seoField'
import { stageTableField } from '../collections/fields/stageTableField'

/** Доработка и обновление: что делаем, интеграции, аудит, оценка, кейс */
export const Dorabotka: GlobalConfig = {
  slug: 'dorabotka',
  label: 'Доработка и обновление 1С',
  admin: { group: 'Страницы' },
  access: { read: () => true },
  hooks: {
    afterChange: [
      ({ req }) => {
        if (req?.context?.disableRevalidate) return
        revalidatePath('/dorabotka')
      },
    ],
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        { label: 'Первый экран', fields: [pageHeroField({ breadcrumb: true })] },
        {
          name: 'work',
          label: 'Что делаем',
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
          name: 'integrations',
          label: 'Интеграции',
          fields: [
            ...sectionHeaderFields(),
            {
              name: 'items',
              type: 'array',
              label: 'Карточки',
              labels: { singular: 'Интеграция', plural: 'Интеграции' },
              fields: [
                iconField({ required: true }),
                { name: 'title', type: 'text', label: 'Название', required: true },
                { name: 'systems', type: 'text', label: 'Системы', required: true },
                { name: 'text', type: 'textarea', label: 'Описание', required: true },
                {
                  name: 'result',
                  type: 'text',
                  label: 'Результат',
                  admin: { description: 'Строка с оранжевой чертой. Пусто: блока нет' },
                },
              ],
            },
          ],
        },
        {
          name: 'audit',
          label: 'Аудит',
          fields: [
            ...sectionHeaderFields(),
            {
              name: 'checks',
              type: 'array',
              label: 'Что проверяем',
              labels: { singular: 'Карточка', plural: 'Карточки' },
              admin: { description: 'Номера 01–04 рисуются порядком' },
              fields: [
                iconField({ required: true }),
                { name: 'title', type: 'text', label: 'Что проверяем', required: true },
              ],
            },
            reportSampleField(),
            { name: 'buttonLabel', type: 'text', label: 'Кнопка под образцом', required: true },
          ],
        },
        {
          name: 'format',
          label: 'Как оцениваем',
          fields: [
            ...sectionHeaderFields(),
            {
              name: 'principles',
              type: 'array',
              label: 'Принципы',
              labels: { singular: 'Принцип', plural: 'Принципы' },
              fields: [{ name: 'text', type: 'text', label: 'Принцип', required: true }],
            },
            stageTableField(),
          ],
        },
        {
          name: 'proof',
          label: 'Кейс',
          description: 'Карточки: коллекции «Кейсы», «Отзывы» и «Публикации и выступления»',
          fields: [
            { name: 'title', type: 'text', label: 'Заголовок блока', required: true },
            { name: 'allLabel', type: 'text', label: 'Ссылка на все кейсы', required: true },
            {
              name: 'cases',
              type: 'relationship',
              relationTo: 'cases',
              hasMany: true,
              label: 'Кейсы',
            },
            { name: 'review', type: 'relationship', relationTo: 'reviews', label: 'Отзыв' },
            {
              name: 'publication',
              type: 'relationship',
              relationTo: 'publications',
              label: 'Статья',
            },
            { name: 'closeLabel', type: 'text', label: 'Кнопка закрытия окна', required: true },
            caseCardLabelsField(),
          ],
        },
        { label: 'Для поисковиков', fields: [seoField()] },
      ],
    },
  ],
}
