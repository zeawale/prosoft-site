import type { GroupField } from 'payload'
import { sectionHeaderFields } from './sectionHeaderFields'

/** Блок диагностики для компонента DiagnosticsOffer. Имена совпадают с его пропсами */
export const diagnosticsOfferField = (): GroupField => ({
  name: 'diagnostics',
  type: 'group',
  label: 'Блок диагностики',
  fields: [
    ...sectionHeaderFields({ caption: true }),
    {
      type: 'row',
      fields: [
        { name: 'checksTitle', type: 'text', label: 'Подпись «Что проверяем»' },
        { name: 'buttonLabel', type: 'text', label: 'Кнопка', required: true },
      ],
    },
    { name: 'checksText', type: 'textarea', label: 'Что проверяем' },
    { name: 'note', type: 'text', label: 'Подпись под кнопкой' },
    {
      name: 'deliverables',
      type: 'array',
      label: 'Что получает клиент',
      labels: { singular: 'Карточка', plural: 'Карточки' },
      admin: { description: 'Номера 01, 02, 03 рисуются порядком' },
      fields: [
        { name: 'title', type: 'text', label: 'Название', required: true },
        { name: 'text', type: 'text', label: 'Описание', required: true },
      ],
    },
  ],
})
