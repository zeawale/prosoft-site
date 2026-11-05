import type { GlobalConfig } from 'payload'
import { revalidatePath } from 'next/cache'
import { caseCardLabelsField } from '../collections/fields/caseCardLabelsField'
import { dateStripField } from '../collections/fields/dateStripField'
import { erpOrKaField } from '../collections/fields/erpOrKaField'
import { faqField } from '../collections/fields/faqField'
import { pageHeroField } from '../collections/fields/pageHeroField'
import { sectionHeaderFields } from '../collections/fields/sectionHeaderFields'
import { seoField } from '../collections/fields/seoField'
import { stageTableField } from '../collections/fields/stageTableField'

/** Страница «Переход с 1С:УПП». Кейс и запись вебинара лежат в своих коллекциях */
export const Upp: GlobalConfig = {
  slug: 'upp',
  label: 'Переход с 1С:УПП',
  admin: { group: 'Страницы' },
  access: { read: () => true },
  hooks: {
    afterChange: [
      ({ req }) => {
        if (req?.context?.disableRevalidate) return
        revalidatePath('/perehod-s-upp')
      },
    ],
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Первый экран',
          fields: [pageHeroField({ breadcrumb: true }), dateStripField()],
        },
        {
          name: 'scenarios',
          label: 'Три сценария',
          fields: [
            ...sectionHeaderFields(),
            {
              type: 'row',
              fields: [
                { name: 'fitLabel', type: 'text', label: 'Строка «Кому подходит»', required: true },
                { name: 'termLabel', type: 'text', label: 'Строка «Срок»', required: true },
                { name: 'budgetLabel', type: 'text', label: 'Строка «Бюджет»', required: true },
                { name: 'licensesLabel', type: 'text', label: 'Строка «Лицензии»', required: true },
              ],
            },
            {
              name: 'items',
              type: 'array',
              label: 'Сценарии',
              labels: { singular: 'Сценарий', plural: 'Сценарии' },
              fields: [
                { name: 'title', type: 'text', label: 'Название', required: true },
                { name: 'fit', type: 'textarea', label: 'Кому подходит', required: true },
                { name: 'term', type: 'text', label: 'Срок', required: true },
                {
                  name: 'budget',
                  type: 'text',
                  label: 'Бюджет',
                  required: true,
                  admin: {
                    description:
                      'С цифрами — моноширинным шрифтом, только словами — обычным текстом',
                  },
                },
                { name: 'licenses', type: 'textarea', label: 'Лицензии', required: true },
              ],
            },
          ],
        },
        { label: 'ERP или КА', fields: [erpOrKaField()] },
        {
          name: 'transition',
          label: 'Этапы перехода',
          fields: [...sectionHeaderFields(), stageTableField({ groups: true })],
        },
        {
          name: 'proof',
          label: 'Как это проходит',
          description:
            'Кейс: коллекция «Кейсы». Обложка, длительность и адрес вебинара: коллекция «Публикации и выступления»',
          fields: [
            ...sectionHeaderFields({ lead: false }),
            { name: 'allLabel', type: 'text', label: 'Ссылка на все кейсы', required: true },
            {
              name: 'cases',
              type: 'relationship',
              relationTo: 'cases',
              hasMany: true,
              maxRows: 1,
              label: 'Кейс',
              required: true,
            },
            { name: 'tag', type: 'text', label: 'Тег на карточке кейса' },
            caseCardLabelsField(),
            {
              name: 'webinar',
              type: 'relationship',
              relationTo: 'publications',
              label: 'Запись вебинара',
              filterOptions: { kind: { equals: 'video' } },
            },
            {
              name: 'webinarCover',
              type: 'upload',
              relationTo: 'media',
              label: 'Обложка вебинара на этой странице',
              admin: {
                description:
                  'В публикации обложка затемнена под текст. Пусто: берётся обложка публикации',
              },
            },
            { name: 'webinarIntro', type: 'text', label: 'Подпись над таймкодами', required: true },
            {
              name: 'timecodes',
              type: 'array',
              label: 'Таймкоды',
              labels: { singular: 'Таймкод', plural: 'Таймкоды' },
              admin: { description: 'Ссылка открывает запись с этого места' },
              fields: [
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'time',
                      type: 'text',
                      label: 'Время',
                      required: true,
                      admin: { description: 'Минуты и секунды: 16:26', width: '25%' },
                    },
                    { name: 'label', type: 'text', label: 'Вопрос', required: true },
                  ],
                },
              ],
            },
          ],
        },
        { label: 'Вопросы', fields: [faqField({ required: true })] },
        { label: 'Для поисковиков', fields: [seoField()] },
      ],
    },
  ],
}
