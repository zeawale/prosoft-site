import type { GroupField } from 'payload'
import { sectionHeaderFields } from './sectionHeaderFields'

const config = (name: 'ka' | 'erp', label: string): GroupField => ({
  name,
  type: 'group',
  label,
  fields: [
    { name: 'title', type: 'text', label: 'Название', required: true },
    { name: 'text', type: 'textarea', label: 'Кому подходит', required: true },
    {
      type: 'row',
      fields: [
        { name: 'verdictTitle', type: 'text', label: 'Вывод: заголовок', required: true },
        { name: 'verdictText', type: 'text', label: 'Вывод: пояснение', required: true },
      ],
    },
  ],
})

/** Подбор конфигурации для компонента ErpOrKa. Имена полей совпадают с его пропсами */
export const erpOrKaField = (): GroupField => ({
  name: 'erpOrKa',
  type: 'group',
  label: 'ERP или КА',
  fields: [
    ...sectionHeaderFields(),
    { name: 'questionsTitle', type: 'text', label: 'Заголовок вопросов', required: true },
    {
      name: 'questions',
      type: 'array',
      label: 'Вопросы',
      labels: { singular: 'Вопрос', plural: 'Вопросы' },
      minRows: 1,
      admin: { description: 'Вывод появляется, когда отвечены все вопросы' },
      fields: [
        { name: 'text', type: 'text', label: 'Вопрос', required: true },
        {
          name: 'decisive',
          type: 'checkbox',
          label: 'Решающий вопрос',
          defaultValue: false,
          admin: { description: '«Да» подсвечивает 1С:ERP, «Нет» подсвечивает 1С:КА' },
        },
      ],
    },
    {
      type: 'row',
      fields: [
        { name: 'noLabel', type: 'text', label: 'Ответ «Нет»', required: true },
        { name: 'yesLabel', type: 'text', label: 'Ответ «Да»', required: true },
      ],
    },
    { name: 'hint', type: 'text', label: 'Подсказка до ответов', required: true },
    {
      type: 'row',
      fields: [
        { name: 'matchLabel', type: 'text', label: 'Бейдж на карточке', required: true },
        { name: 'buttonLabel', type: 'text', label: 'Кнопка в выводе', required: true },
      ],
    },
    config('ka', 'Карточка 1С:КА'),
    config('erp', 'Карточка 1С:ERP'),
    {
      name: 'rows',
      type: 'array',
      label: 'Сравнение конфигураций',
      labels: { singular: 'Строка', plural: 'Строки' },
      fields: [
        { name: 'label', type: 'text', label: 'Что сравниваем', required: true },
        {
          type: 'row',
          fields: [
            { name: 'ka', type: 'text', label: '1С:КА', required: true },
            { name: 'erp', type: 'text', label: '1С:ERP', required: true },
          ],
        },
      ],
    },
  ],
})
