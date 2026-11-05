import type { GroupField } from 'payload'

/** Подписи внутри карточки кейса: одни на все карточки блока */
export const caseCardLabelsField = (): GroupField => ({
  name: 'labels',
  type: 'group',
  label: 'Подписи в карточке',
  fields: [
    {
      type: 'row',
      fields: [
        { name: 'before', type: 'text', label: '«Было»', required: true },
        { name: 'after', type: 'text', label: '«Стало»', required: true },
        { name: 'task', type: 'text', label: '«Задача»', required: true },
        { name: 'done', type: 'text', label: '«Сделали»', required: true },
        { name: 'read', type: 'text', label: 'Ссылка на кейс', required: true },
      ],
    },
  ],
})
