import type { GroupField } from 'payload'
import { routeField } from './routeField'

/** Полоса дат поддержки 1С:УПП для компонента DateStrip */
export const dateStripField = (): GroupField => ({
  name: 'dateStrip',
  type: 'group',
  label: 'Полоса дат',
  fields: [
    { name: 'label', type: 'text', label: 'Название', required: true },
    {
      type: 'row',
      fields: [
        { name: 'mainDate', type: 'text', label: 'Крупная дата', required: true },
        { name: 'mainTitle', type: 'text', label: 'Что до этой даты', required: true },
      ],
    },
    { name: 'source', type: 'text', label: 'Источник дат' },
    {
      name: 'rows',
      type: 'array',
      label: 'Строки справа (десктоп)',
      labels: { singular: 'Строка', plural: 'Строки' },
      fields: [
        { name: 'date', type: 'text', label: 'Срок', required: true },
        { name: 'text', type: 'text', label: 'Что происходит', required: true },
      ],
    },
    {
      type: 'row',
      fields: [
        { name: 'linkLabel', type: 'text', label: 'Текст ссылки' },
        routeField({ name: 'linkRoute', label: 'Ссылка ведёт на' }),
      ],
    },
    { name: 'todayLabel', type: 'text', label: 'Подпись отметки', defaultValue: 'Сегодня' },
    {
      name: 'timeline',
      type: 'array',
      label: 'Список дат (телефон)',
      labels: { singular: 'Дата', plural: 'Даты' },
      admin: {
        description: 'Отметка «Сегодня» встаёт по календарной дате, пройденные пункты приглушаются',
      },
      fields: [
        {
          name: 'startsOn',
          type: 'date',
          label: 'Календарная дата',
          required: true,
          admin: { date: { pickerAppearance: 'dayOnly', displayFormat: 'dd.MM.yyyy' } },
        },
        { name: 'date', type: 'text', label: 'Как написано', required: true },
        { name: 'text', type: 'text', label: 'Что происходит', required: true },
      ],
    },
  ],
})
