import type { GlobalConfig } from 'payload'
import { caseCardLabelsField } from '../collections/fields/caseCardLabelsField'
import { pageHeroField } from '../collections/fields/pageHeroField'
import { seoField } from '../collections/fields/seoField'
import { revalidateSection } from '@/lib/revalidate'

/**
 * Страница «Кейсы» и подписи страницы кейса. Сами кейсы лежат в коллекции.
 * Значение фильтра хранит список своих кейсов: подпись правится в одном месте,
 * а связь не рвётся от опечатки, как при сверке по строке.
 */
export const CasesPage: GlobalConfig = {
  slug: 'cases-page',
  label: 'Страница «Кейсы»',
  admin: { group: 'Страницы' },
  access: { read: () => true },
  hooks: {
    afterChange: [
      ({ req }) => {
        if (req?.context?.disableRevalidate) return
        revalidateSection('/cases')
      },
    ],
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        { label: 'Заголовок', fields: [pageHeroField({ breadcrumb: true })] },
        {
          name: 'filters',
          label: 'Фильтры',
          description: 'Кейс попадает в фильтр, когда выбран в значении',
          fields: [
            {
              name: 'enabled',
              type: 'checkbox',
              label: 'Показывать фильтры и счётчик',
              defaultValue: false,
              admin: { description: 'Пока кейсов десять, фильтры выключены' },
            },
            { name: 'allLabel', type: 'text', label: 'Кнопка «Все»', required: true },
            {
              name: 'groups',
              type: 'array',
              label: 'Группы',
              labels: { singular: 'Группа', plural: 'Группы' },
              fields: [
                {
                  type: 'row',
                  fields: [
                    { name: 'label', type: 'text', label: 'Название группы', required: true },
                    {
                      name: 'key',
                      type: 'text',
                      label: 'Имя в адресе',
                      required: true,
                      admin: { description: 'Латиницей, например otrasl' },
                    },
                  ],
                },
                {
                  name: 'options',
                  type: 'array',
                  label: 'Значения',
                  labels: { singular: 'Значение', plural: 'Значения' },
                  fields: [
                    {
                      type: 'row',
                      fields: [
                        { name: 'label', type: 'text', label: 'Подпись', required: true },
                        {
                          name: 'value',
                          type: 'text',
                          label: 'Значение в адресе',
                          required: true,
                          admin: { description: 'Латиницей, например torgovlya' },
                        },
                      ],
                    },
                    {
                      name: 'cases',
                      type: 'relationship',
                      relationTo: 'cases',
                      hasMany: true,
                      label: 'Кейсы с этим значением',
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          name: 'results',
          label: 'Счётчик и пустой результат',
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'countLabel',
                  type: 'text',
                  label: 'Счётчик',
                  required: true,
                  admin: { description: '{shown} и {total} заменяются числами' },
                },
                {
                  name: 'countOneLabel',
                  type: 'text',
                  label: 'Счётчик для одного кейса',
                  required: true,
                  admin: { description: 'Для 1, 21, 31: «Показан», а не «Показаны»' },
                },
              ],
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'emptyCountLabel',
                  type: 'text',
                  label: 'Счётчик, когда нет кейсов',
                  required: true,
                },
                { name: 'resetLabel', type: 'text', label: 'Сброс фильтров', required: true },
              ],
            },
            { name: 'emptyTitle', type: 'text', label: 'Заголовок пустого блока', required: true },
            { name: 'emptyText', type: 'textarea', label: 'Текст пустого блока', required: true },
          ],
        },
        { name: 'card', label: 'Карточка кейса', fields: [caseCardLabelsField()] },
        {
          name: 'casePage',
          label: 'Страница кейса',
          description: 'Подписи, одни на все кейсы. Тексты кейса: коллекция «Кейсы»',
          fields: [
            {
              type: 'row',
              fields: [
                { name: 'companyLabel', type: 'text', label: 'Компания', required: true },
                { name: 'industryLabel', type: 'text', label: 'Отрасль', required: true },
                { name: 'configurationLabel', type: 'text', label: 'Конфигурация', required: true },
                { name: 'termLabel', type: 'text', label: 'Срок проекта', required: true },
              ],
            },
            {
              type: 'row',
              fields: [
                { name: 'tableLabel', type: 'text', label: 'Что изменилось', required: true },
                { name: 'beforeLabel', type: 'text', label: 'Было', required: true },
                { name: 'afterLabel', type: 'text', label: 'Стало', required: true },
              ],
            },
            {
              type: 'row',
              fields: [
                { name: 'taskTitle', type: 'text', label: 'Задача', required: true },
                { name: 'solutionTitle', type: 'text', label: 'Решение', required: true },
                { name: 'resultTitle', type: 'text', label: 'Результат', required: true },
              ],
            },
            {
              type: 'row',
              fields: [
                { name: 'tagsLabel', type: 'text', label: 'Теги', required: true },
                { name: 'allLabel', type: 'text', label: 'Ссылка на все кейсы', required: true },
              ],
            },
            {
              type: 'row',
              fields: [
                { name: 'nextCaption', type: 'text', label: 'Следующий кейс', required: true },
                { name: 'nextButton', type: 'text', label: 'Кнопка', required: true },
              ],
            },
          ],
        },
        { label: 'Для поисковиков', fields: [seoField()] },
      ],
    },
  ],
}
