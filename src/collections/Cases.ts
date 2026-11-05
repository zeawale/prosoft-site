import type { CollectionConfig } from 'payload'
import { revalidatePath } from 'next/cache'
import { ROUTES } from '@/lib/navigation'
import { revalidateSection } from '@/lib/revalidate'
import { caseDetailFields } from './fields/caseDetailFields'

/** Страницы, где карточки кейсов выбраны связью в глобале: каталог идёт отдельно разделом */
const PAGES_WITH_CASES = [ROUTES.home, ROUTES.upp, ROUTES.erp, ROUTES.dorabotka]

const revalidateCases = ({ req }: { req: { context?: Record<string, unknown> } }) => {
  if (req?.context?.disableRevalidate) return
  for (const path of PAGES_WITH_CASES) revalidatePath(path)
  revalidateSection('/cases')
}

export const Cases: CollectionConfig = {
  slug: 'cases',
  labels: { singular: 'Кейс', plural: 'Кейсы' },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'showOnHome', 'catalogOrder'],
    group: 'Контент',
    description: 'Значения фильтров назначаются на странице «Кейсы», вкладка «Фильтры»',
  },
  access: { read: () => true },
  hooks: {
    afterChange: [revalidateCases],
    afterDelete: [revalidateCases],
  },
  fields: [
    {
      type: 'collapsible',
      label: 'Карточка кейса',
      fields: [
        { name: 'title', type: 'text', label: 'Название', required: true },
        { name: 'slug', type: 'text', label: 'Адрес', required: true, unique: true, index: true },
        { name: 'metric', type: 'text', label: 'Что измеряли', required: true },
        {
          type: 'row',
          fields: [
            { name: 'before', type: 'text', label: 'Было', required: true },
            { name: 'after', type: 'text', label: 'Стало', required: true },
          ],
        },
        { name: 'result', type: 'text', label: 'Итог', required: true },
        { name: 'task', type: 'textarea', label: 'Задача', required: true },
        { name: 'done', type: 'textarea', label: 'Что сделали', required: true },
      ],
    },
    ...caseDetailFields(),
    {
      name: 'showOnHome',
      type: 'checkbox',
      label: 'Показывать на главной',
      defaultValue: false,
      admin: { position: 'sidebar' },
    },
    {
      name: 'order',
      type: 'number',
      label: 'Порядок на главной',
      defaultValue: 0,
      admin: { position: 'sidebar' },
    },
    {
      name: 'catalogOrder',
      type: 'number',
      label: 'Порядок в каталоге',
      defaultValue: 0,
      admin: {
        position: 'sidebar',
        description: 'Он же задаёт блок «Следующий кейс»: за последним снова идёт первый',
      },
    },
  ],
}
