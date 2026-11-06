import type { GlobalConfig } from 'payload'
import { revalidatePath } from 'next/cache'
import { iconField } from '../collections/fields/iconField'
import { pageHeroField } from '../collections/fields/pageHeroField'
import { sectionHeaderFields } from '../collections/fields/sectionHeaderFields'
import { seoField } from '../collections/fields/seoField'

/**
 * «О компании». Телефон, почта, адрес, ИНН и ОГРН живут в глобале settings:
 * здесь только подписи к ним и то, чего там нет.
 */
export const About: GlobalConfig = {
  slug: 'about',
  label: 'О компании',
  admin: { group: 'Страницы' },
  access: { read: () => true },
  hooks: {
    afterChange: [
      ({ req }) => {
        if (req?.context?.disableRevalidate) return
        revalidatePath('/about')
      },
    ],
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Первый экран',
          fields: [
            pageHeroField({ breadcrumb: true }),
            {
              name: 'stats',
              type: 'array',
              label: 'Цифры',
              labels: { singular: 'Цифра', plural: 'Цифры' },
              fields: [
                {
                  type: 'row',
                  fields: [
                    { name: 'value', type: 'text', label: 'Значение', required: true },
                    { name: 'text', type: 'text', label: 'Подпись', required: true },
                  ],
                },
              ],
            },
          ],
        },
        {
          name: 'team',
          label: 'Основатель',
          description: 'Фото, цитата и ссылки: коллекция «Команда», запись с отметкой основателя',
          fields: sectionHeaderFields(),
        },
        {
          name: 'status',
          label: 'Статусы',
          fields: [
            ...sectionHeaderFields({ lead: false }),
            {
              name: 'items',
              type: 'array',
              label: 'Карточки',
              labels: { singular: 'Карточка', plural: 'Карточки' },
              fields: [
                iconField({ required: true }),
                { name: 'title', type: 'text', label: 'Заголовок', required: true },
                { name: 'text', type: 'textarea', label: 'Текст', required: true },
              ],
            },
          ],
        },
        {
          name: 'reviews',
          label: 'Отзывы',
          description: 'Отзывы: коллекция «Отзывы»',
          fields: sectionHeaderFields(),
        },
        {
          name: 'contacts',
          label: 'Контакты',
          description:
            'Телефон, почта, адрес, наименование, ИНН и ОГРН правятся в «Реквизиты и контакты»',
          fields: [
            ...sectionHeaderFields({ lead: false }),
            {
              type: 'row',
              fields: [
                { name: 'phoneLabel', type: 'text', label: 'Подпись телефона', required: true },
                { name: 'emailLabel', type: 'text', label: 'Подпись почты', required: true },
                { name: 'addressLabel', type: 'text', label: 'Подпись адреса', required: true },
              ],
            },
            {
              type: 'row',
              fields: [
                { name: 'hoursLabel', type: 'text', label: 'Подпись режима', required: true },
                { name: 'hoursValue', type: 'text', label: 'Режим работы', required: true },
              ],
            },
            { name: 'hoursCaption', type: 'text', label: 'Пояснение к режиму работы' },
            {
              type: 'row',
              fields: [
                { name: 'mapTitle', type: 'text', label: 'Заголовок на карте', required: true },
                { name: 'mapLinkLabel', type: 'text', label: 'Ссылка на карту', required: true },
              ],
            },
            { name: 'mapUrl', type: 'text', label: 'Адрес ссылки на карту', required: true },
            {
              name: 'mapWidgetUrl',
              type: 'text',
              label: 'Адрес виджета Яндекс Карт',
              required: true,
              admin: { description: 'Вид https://yandex.ru/map-widget/v1/?…' },
            },
            {
              type: 'row',
              fields: [
                { name: 'mapNote', type: 'textarea', label: 'Текст до загрузки карты', required: true },
                { name: 'mapButtonLabel', type: 'text', label: 'Кнопка показа карты', required: true },
              ],
            },
            {
              name: 'requisitesTitle',
              type: 'text',
              label: 'Заголовок реквизитов',
              required: true,
            },
            {
              type: 'row',
              fields: [
                { name: 'legalNameLabel', type: 'text', label: 'Подпись названия', required: true },
                { name: 'innLabel', type: 'text', label: 'Подпись ИНН', required: true },
                { name: 'ogrnLabel', type: 'text', label: 'Подпись ОГРН', required: true },
              ],
            },
            {
              name: 'requisites',
              type: 'array',
              label: 'Остальные реквизиты',
              labels: { singular: 'Реквизит', plural: 'Реквизиты' },
              fields: [
                {
                  type: 'row',
                  fields: [
                    { name: 'label', type: 'text', label: 'Подпись', required: true },
                    { name: 'value', type: 'text', label: 'Значение', required: true },
                  ],
                },
              ],
            },
          ],
        },
        { label: 'Для поисковиков', fields: [seoField()] },
      ],
    },
  ],
}
