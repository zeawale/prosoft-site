import type { Field, GroupField } from 'payload'
import { routeField } from './routeField'

type Options = {
  /** Подпись страницы в хлебных крошках, у внутренних страниц */
  breadcrumb?: boolean
  /** Две кнопки первого экрана */
  actions?: boolean
  /** Строки фактов под кнопками */
  facts?: boolean
}

/** Первый экран для компонента PageHero */
export const pageHeroField = ({
  breadcrumb = false,
  actions = false,
  facts = false,
}: Options = {}): GroupField => {
  const fields: Field[] = []
  if (breadcrumb) {
    fields.push({ name: 'breadcrumb', type: 'text', label: 'Подпись в крошках', required: true })
  }
  fields.push(
    { name: 'title', type: 'text', label: 'Заголовок H1', required: true },
    { name: 'lead', type: 'textarea', label: 'Подзаголовок' },
  )
  if (actions) {
    fields.push({
      type: 'row',
      fields: [
        { name: 'primaryLabel', type: 'text', label: 'Главная кнопка', required: true },
        { name: 'secondaryLabel', type: 'text', label: 'Вторая кнопка' },
        routeField({ name: 'secondaryRoute', label: 'Вторая кнопка ведёт на' }),
      ],
    })
  }
  if (facts) {
    fields.push({
      name: 'facts',
      type: 'array',
      label: 'Факты',
      labels: { singular: 'Факт', plural: 'Факты' },
      fields: [{ name: 'text', type: 'text', label: 'Факт', required: true }],
    })
  }
  return { name: 'hero', type: 'group', label: 'Первый экран', fields }
}
