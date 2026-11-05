import type { GroupField } from 'payload'
import { sectionHeaderFields } from './sectionHeaderFields'

/** Блок вопросов для компонента Faq. Имена полей совпадают с его пропсами */
export const faqField = ({ required = false }: { required?: boolean } = {}): GroupField => ({
  name: 'faq',
  type: 'group',
  label: 'Частые вопросы',
  fields: [
    ...sectionHeaderFields(),
    {
      name: 'items',
      type: 'array',
      label: 'Вопросы',
      labels: { singular: 'Вопрос', plural: 'Вопросы' },
      minRows: required ? 1 : undefined,
      fields: [
        { name: 'question', type: 'text', label: 'Вопрос', required: true },
        {
          name: 'answer',
          type: 'textarea',
          label: 'Ответ',
          required: true,
          admin: { description: 'Абзацы разделяются переводом строки' },
        },
      ],
    },
  ],
})
