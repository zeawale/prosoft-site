import type { GlobalConfig } from 'payload'
import { revalidatePath } from 'next/cache'
import { caseCardLabelsField } from '../collections/fields/caseCardLabelsField'
import { erpOrKaField } from '../collections/fields/erpOrKaField'
import { faqField } from '../collections/fields/faqField'
import { iconField } from '../collections/fields/iconField'
import { pageHeroField } from '../collections/fields/pageHeroField'
import { sectionHeaderFields } from '../collections/fields/sectionHeaderFields'
import { seoField } from '../collections/fields/seoField'
import { stageTableField } from '../collections/fields/stageTableField'

/** Страница «Внедрение 1С:ERP и 1С:КА». Карточки кейсов лежат в коллекции «Кейсы» */
export const Erp: GlobalConfig = {
  slug: 'erp',
  label: 'Внедрение 1С:ERP и 1С:КА',
  admin: { group: 'Страницы' },
  access: { read: () => true },
  hooks: {
    afterChange: [
      ({ req }) => {
        if (req?.context?.disableRevalidate) return
        revalidatePath('/vnedrenie-erp')
      },
    ],
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Первый экран',
          fields: [pageHeroField({ breadcrumb: true, cta: 'request' })],
        },
        { label: 'ERP или КА', fields: [erpOrKaField()] },
        {
          name: 'map',
          label: 'Карта процессов',
          fields: [
            ...sectionHeaderFields(),
            {
              name: 'integrationsTitle',
              type: 'text',
              label: 'Заголовок слоя интеграций',
              required: true,
            },
            {
              name: 'integrations',
              type: 'array',
              label: 'Интеграции',
              labels: { singular: 'Интеграция', plural: 'Интеграции' },
              fields: [{ name: 'label', type: 'text', label: 'Название', required: true }],
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'nodePrefix',
                  type: 'text',
                  label: 'Начало подписи участка',
                  required: true,
                  admin: { description: 'Дальше подпись продолжает название подсистемы' },
                },
                {
                  name: 'subsystemLabel',
                  type: 'text',
                  label: 'Панель: подсистема',
                  required: true,
                },
                {
                  name: 'benefitLabel',
                  type: 'text',
                  label: 'Панель: что получаете',
                  required: true,
                },
                { name: 'caseLabel', type: 'text', label: 'Панель: кейс', required: true },
              ],
            },
            {
              name: 'nodes',
              type: 'array',
              label: 'Участки',
              labels: { singular: 'Участок', plural: 'Участки' },
              maxRows: 5,
              admin: { description: 'Открыт один участок, повторный клик его закрывает' },
              fields: [
                iconField({ required: true }),
                { name: 'title', type: 'text', label: 'Участок', required: true },
                { name: 'subsystem', type: 'text', label: 'Подсистема 1С:ERP', required: true },
                { name: 'benefit', type: 'textarea', label: 'Что получаете', required: true },
                {
                  name: 'relatedCase',
                  type: 'relationship',
                  relationTo: 'cases',
                  label: 'Кейс',
                  admin: { description: 'Пока пусто, подпись кейса показывается без ссылки' },
                },
                {
                  name: 'caseLink',
                  type: 'text',
                  label: 'Подпись кейса',
                  admin: { description: 'Пусто: подставится название кейса' },
                },
                {
                  name: 'openByDefault',
                  type: 'checkbox',
                  label: 'Открыт при загрузке',
                  defaultValue: false,
                },
              ],
            },
          ],
        },
        {
          name: 'stages',
          label: 'Этапы и стоимость',
          fields: [...sectionHeaderFields(), stageTableField({ price: true })],
        },
        {
          name: 'proof',
          label: 'Кейсы',
          description: 'Карточки: коллекция «Кейсы»',
          fields: [
            ...sectionHeaderFields({ lead: false }),
            { name: 'allLabel', type: 'text', label: 'Ссылка на все кейсы', required: true },
            {
              name: 'cases',
              type: 'relationship',
              relationTo: 'cases',
              hasMany: true,
              label: 'Кейсы',
              required: true,
            },
            caseCardLabelsField(),
          ],
        },
        { label: 'Вопросы', fields: [faqField({ required: true })] },
        { label: 'Для поисковиков', fields: [seoField()] },
      ],
    },
  ],
}
