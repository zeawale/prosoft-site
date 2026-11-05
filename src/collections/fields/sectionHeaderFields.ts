import type { Field } from 'payload'

type Options = {
  /** Подпись над заголовком: в макете есть не у всех секций */
  caption?: boolean
  lead?: boolean
}

/** Поля шапки секции для компонента SectionHeader: подпись, заголовок, подзаголовок */
export const sectionHeaderFields = ({ caption = false, lead = true }: Options = {}): Field[] => {
  const fields: Field[] = []
  if (caption) fields.push({ name: 'caption', type: 'text', label: 'Подпись над заголовком' })
  fields.push({ name: 'title', type: 'text', label: 'Заголовок блока', required: true })
  if (lead) fields.push({ name: 'lead', type: 'textarea', label: 'Подзаголовок' })
  return fields
}
