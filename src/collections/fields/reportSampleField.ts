import type { Field, GroupField } from 'payload'

/** Вкладка справа от листа: название, подпись и что внутри этой части отчёта */
const tabFields = (): Field[] => [
  {
    type: 'row',
    fields: [
      { name: 'tabTitle', type: 'text', label: 'Название вкладки', required: true },
      { name: 'tabLead', type: 'text', label: 'Подпись вкладки', required: true },
    ],
  },
  {
    name: 'tabItems',
    type: 'array',
    label: 'Что внутри этой части',
    labels: { singular: 'Пункт', plural: 'Пункты' },
    admin: { description: 'Видно, когда вкладка раскрыта' },
    fields: [{ name: 'text', type: 'text', label: 'Пункт', required: true }],
  },
]

/**
 * Образец отчёта для компонента ReportSample: лист слева, справа три вкладки.
 * Общий для «Диагностики» и «Доработки». Имена совпадают с его пропсами.
 */
export const reportSampleField = (): GroupField => ({
  name: 'sample',
  type: 'group',
  label: 'Образец отчёта',
  fields: [
    {
      type: 'row',
      fields: [
        { name: 'brand', type: 'text', label: 'Шапка листа слева', required: true },
        { name: 'document', type: 'text', label: 'Шапка листа справа', required: true },
        { name: 'note', type: 'text', label: 'Подвал листа', required: true },
        {
          name: 'startPage',
          type: 'select',
          label: 'Какая часть открыта сначала',
          required: true,
          defaultValue: 'title',
          options: [
            { value: 'title', label: 'Титул' },
            { value: 'findings', label: 'Находки' },
            { value: 'plan', label: 'План' },
          ],
        },
      ],
    },
    {
      name: 'titlePage',
      type: 'group',
      label: 'Часть 1: титул',
      fields: [
        ...tabFields(),
        { name: 'kicker', type: 'text', label: 'Подпись над заголовком', required: true },
        { name: 'heading', type: 'text', label: 'Заголовок листа', required: true },
        {
          name: 'spec',
          type: 'array',
          label: 'Параметры',
          labels: { singular: 'Параметр', plural: 'Параметры' },
          fields: [
            {
              type: 'row',
              fields: [
                { name: 'label', type: 'text', label: 'Название', required: true },
                { name: 'value', type: 'text', label: 'Значение', required: true },
              ],
            },
          ],
        },
        {
          name: 'totals',
          type: 'array',
          label: 'Итоги',
          labels: { singular: 'Итог', plural: 'Итоги' },
          maxRows: 3,
          fields: [
            {
              type: 'row',
              fields: [
                { name: 'value', type: 'text', label: 'Число', required: true },
                { name: 'label', type: 'text', label: 'Что это за число', required: true },
              ],
            },
          ],
        },
      ],
    },
    {
      name: 'findingsPage',
      type: 'group',
      label: 'Часть 2: находки',
      fields: [
        ...tabFields(),
        { name: 'heading', type: 'text', label: 'Заголовок листа', required: true },
        {
          type: 'row',
          fields: [
            { name: 'areaLabel', type: 'text', label: 'Колонка «Участок»', required: true },
            { name: 'findingLabel', type: 'text', label: 'Колонка «Находка»', required: true },
            { name: 'hoursLabel', type: 'text', label: 'Колонка «Часов»', required: true },
          ],
        },
        {
          name: 'rows',
          type: 'array',
          label: 'Находки',
          labels: { singular: 'Находка', plural: 'Находки' },
          fields: [
            {
              type: 'row',
              fields: [
                { name: 'area', type: 'text', label: 'Участок', required: true },
                { name: 'finding', type: 'text', label: 'Находка', required: true },
                { name: 'hours', type: 'text', label: 'Часов в месяц', required: true },
              ],
            },
          ],
        },
        {
          type: 'row',
          fields: [
            { name: 'totalLabel', type: 'text', label: 'Строка итога', required: true },
            { name: 'totalNote', type: 'text', label: 'Пояснение итога', required: true },
            { name: 'totalHours', type: 'text', label: 'Часов всего', required: true },
          ],
        },
      ],
    },
    {
      name: 'planPage',
      type: 'group',
      label: 'Часть 3: план',
      fields: [
        ...tabFields(),
        { name: 'heading', type: 'text', label: 'Заголовок листа', required: true },
        {
          name: 'stages',
          type: 'array',
          label: 'Лента этапов',
          labels: { singular: 'Этап', plural: 'Этапы' },
          maxRows: 3,
          fields: [
            {
              type: 'row',
              fields: [
                { name: 'label', type: 'text', label: 'Подпись', required: true },
                { name: 'title', type: 'text', label: 'Что делаем', required: true },
                { name: 'term', type: 'text', label: 'Срок', required: true },
              ],
            },
          ],
        },
        {
          type: 'row',
          fields: [
            { name: 'stageLabel', type: 'text', label: 'Колонка «Этап»', required: true },
            { name: 'resultLabel', type: 'text', label: 'Колонка «Что получаете»', required: true },
            { name: 'acceptLabel', type: 'text', label: 'Колонка «Приёмка»', required: true },
          ],
        },
        {
          name: 'rows',
          type: 'array',
          label: 'Таблица этапов',
          labels: { singular: 'Строка', plural: 'Строки' },
          fields: [
            {
              type: 'row',
              fields: [
                { name: 'stage', type: 'text', label: 'Этап', required: true },
                { name: 'result', type: 'text', label: 'Что получаете', required: true },
                { name: 'accept', type: 'text', label: 'Приёмка', required: true },
              ],
            },
          ],
        },
        { name: 'note', type: 'textarea', label: 'Подпись под таблицей', required: true },
      ],
    },
  ],
})
