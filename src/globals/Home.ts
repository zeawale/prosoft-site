import type { GlobalConfig } from 'payload'
import { revalidatePath } from 'next/cache'
import { caseCardLabelsField } from '../collections/fields/caseCardLabelsField'
import { dateStripField } from '../collections/fields/dateStripField'
import { diagnosticsOfferField } from '../collections/fields/diagnosticsOfferField'
import { faqField } from '../collections/fields/faqField'
import { iconField } from '../collections/fields/iconField'
import { pageHeroField } from '../collections/fields/pageHeroField'
import { routeField } from '../collections/fields/routeField'
import { sectionHeaderFields } from '../collections/fields/sectionHeaderFields'
import { seoField } from '../collections/fields/seoField'
import { stageTableField } from '../collections/fields/stageTableField'

/**
 * Главная. Здесь тексты блоков; карточки кейсов, отзывы, команда и публикации
 * лежат в своих коллекциях, потому что идут и на другие страницы.
 */
export const Home: GlobalConfig = {
  slug: 'home',
  label: 'Главная',
  admin: { group: 'Страницы' },
  access: { read: () => true },
  hooks: {
    afterChange: [
      ({ req }) => {
        if (req?.context?.disableRevalidate) return
        revalidatePath('/')
      },
    ],
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Первый экран',
          fields: [pageHeroField({ actions: true, facts: true }), dateStripField()],
        },
        { label: 'Диагностика', fields: [diagnosticsOfferField()] },
        {
          name: 'painCheck',
          label: 'Узнаёте себя',
          fields: [
            ...sectionHeaderFields(),
            { name: 'answerLabel', type: 'text', label: 'Подпись над ответом', required: true },
            {
              name: 'items',
              type: 'array',
              label: 'Ситуации',
              labels: { singular: 'Ситуация', plural: 'Ситуации' },
              admin: { description: 'Номера 01–04 рисуются порядком' },
              fields: [
                { name: 'statement', type: 'text', label: 'Ситуация', required: true },
                { name: 'answer', type: 'textarea', label: 'Что делаем мы', required: true },
              ],
            },
            {
              type: 'row',
              fields: [
                { name: 'summary', type: 'text', label: 'Текст плашки', required: true },
                { name: 'buttonLabel', type: 'text', label: 'Кнопка', required: true },
              ],
            },
          ],
        },
        {
          name: 'services',
          label: 'Направления',
          fields: [
            ...sectionHeaderFields(),
            {
              name: 'items',
              type: 'array',
              label: 'Направления',
              labels: { singular: 'Направление', plural: 'Направления' },
              fields: [
                iconField({ required: true }),
                { name: 'title', type: 'text', label: 'Название', required: true },
                { name: 'deliverable', type: 'textarea', label: 'Что на руках', required: true },
                { name: 'term', type: 'text', label: 'Срок', required: true },
                routeField({ required: true }),
                { name: 'dark', type: 'checkbox', label: 'Тёмная карточка', defaultValue: false },
              ],
            },
            { name: 'processesTitle', type: 'text', label: 'Заголовок процессов', required: true },
            {
              name: 'processes',
              type: 'array',
              label: 'Процессы',
              labels: { singular: 'Процесс', plural: 'Процессы' },
              fields: [
                iconField({ required: true }),
                { name: 'title', type: 'text', label: 'Название', required: true },
                routeField(),
              ],
            },
          ],
        },
        {
          name: 'stages',
          label: 'Как работаем',
          fields: [...sectionHeaderFields(), stageTableField()],
        },
        {
          name: 'cases',
          label: 'Кейсы',
          description: 'Карточки: коллекция «Кейсы», флаг «Показывать на главной»',
          fields: [
            ...sectionHeaderFields(),
            { name: 'allLabel', type: 'text', label: 'Ссылка на все кейсы', required: true },
            caseCardLabelsField(),
          ],
        },
        {
          name: 'team',
          label: 'Команда',
          description: 'Люди и цитаты: коллекция «Команда»',
          fields: sectionHeaderFields(),
        },
        {
          name: 'reviews',
          label: 'Отзывы',
          description: 'Отзывы: коллекция «Отзывы»',
          fields: [
            ...sectionHeaderFields(),
            {
              type: 'row',
              fields: [
                { name: 'allLabel', type: 'text', label: 'Показать все', required: true },
                { name: 'collapseLabel', type: 'text', label: 'Свернуть список', required: true },
                { name: 'moreLabel', type: 'text', label: 'Раскрыть отзыв', required: true },
                { name: 'lessLabel', type: 'text', label: 'Свернуть отзыв', required: true },
              ],
            },
          ],
        },
        {
          name: 'publications',
          label: 'Публикации',
          description: 'Карточки и окна: коллекция «Публикации и выступления»',
          fields: [
            ...sectionHeaderFields(),
            {
              type: 'row',
              fields: [
                { name: 'talksTitle', type: 'text', label: 'Заголовок видео', required: true },
                { name: 'articlesTitle', type: 'text', label: 'Заголовок статей', required: true },
                { name: 'closeLabel', type: 'text', label: 'Кнопка закрытия окна', required: true },
              ],
            },
          ],
        },
        { label: 'Вопросы', fields: [faqField({ required: true })] },
        { label: 'Для поисковиков', fields: [seoField()] },
      ],
    },
  ],
}
