import type { Field, GlobalConfig, GroupField } from 'payload'
import { revalidatePath } from 'next/cache'
import { iconField } from '../collections/fields/iconField'
import { pageHeroField } from '../collections/fields/pageHeroField'
import { reportSampleField } from '../collections/fields/reportSampleField'
import { sectionHeaderFields } from '../collections/fields/sectionHeaderFields'
import { seoField } from '../collections/fields/seoField'

const SCENARIOS = [
  { value: 'transition', label: 'Переход' },
  { value: 'update', label: 'Обновление' },
]

/** Что показываем человеку в результате квиза, по одному набору на сценарий */
const scenarioFields = (name: string, label: string): GroupField => ({
  name,
  type: 'group',
  label,
  fields: [
    { name: 'title', type: 'text', label: 'Название сценария', required: true },
    { name: 'term', type: 'text', label: 'Срок проекта', required: true },
    { name: 'next', type: 'textarea', label: 'Что дальше', required: true },
  ],
})

const quizFields: Field[] = [
  ...sectionHeaderFields(),
  {
    type: 'row',
    fields: [
      {
        name: 'stepLabel',
        type: 'text',
        label: 'Подпись шага',
        required: true,
        admin: { description: '{n} — номер шага, {total} — всего шагов' },
      },
      { name: 'backLabel', type: 'text', label: 'Кнопка «Назад»', required: true },
      { name: 'nextLabel', type: 'text', label: 'Кнопка «Далее»', required: true },
      { name: 'finishLabel', type: 'text', label: 'Кнопка на последнем шаге', required: true },
    ],
  },
  {
    name: 'questions',
    type: 'array',
    label: 'Вопросы',
    labels: { singular: 'Вопрос', plural: 'Вопросы' },
    minRows: 1,
    admin: { description: 'Один вопрос на шаг, порядок как здесь' },
    fields: [
      { name: 'title', type: 'text', label: 'Вопрос', required: true },
      { name: 'hint', type: 'text', label: 'Подсказка' },
      {
        name: 'multiple',
        type: 'checkbox',
        label: 'Можно выбрать несколько ответов',
        defaultValue: false,
      },
      {
        name: 'options',
        type: 'array',
        label: 'Ответы',
        labels: { singular: 'Ответ', plural: 'Ответы' },
        minRows: 2,
        fields: [
          {
            type: 'row',
            fields: [
              { name: 'label', type: 'text', label: 'Ответ', required: true },
              { name: 'caption', type: 'text', label: 'Пояснение' },
              {
                name: 'scenario',
                type: 'select',
                label: 'Какой сценарий выбирает',
                options: SCENARIOS,
                admin: { description: 'Пусто: ответ на сценарий не влияет' },
              },
            ],
          },
        ],
      },
    ],
  },
  {
    name: 'defaultScenario',
    type: 'select',
    label: 'Сценарий, если ни один ответ его не выбрал',
    required: true,
    defaultValue: 'update',
    options: SCENARIOS,
    admin: {
      description:
        'Правило результата: сценарий задаёт первый ответ по порядку вопросов, у которого он указан',
    },
  },
  {
    name: 'result',
    type: 'group',
    label: 'Подписи результата',
    fields: [
      {
        type: 'row',
        fields: [
          { name: 'caption', type: 'text', label: 'Над названием сценария', required: true },
          { name: 'termLabel', type: 'text', label: 'Подпись срока', required: true },
          { name: 'nextLabel', type: 'text', label: 'Подпись «Что дальше»', required: true },
        ],
      },
      { name: 'disclaimer', type: 'text', label: 'Оговорка', required: true },
    ],
  },
  scenarioFields('transition', 'Сценарий «Переход»'),
  scenarioFields('update', 'Сценарий «Обновление»'),
  {
    name: 'form',
    type: 'group',
    label: 'Форма заявки в результате',
    fields: [
      { name: 'title', type: 'text', label: 'Заголовок формы', required: true },
      { name: 'lead', type: 'text', label: 'Подзаголовок формы', required: true },
      { name: 'submitLabel', type: 'text', label: 'Кнопка отправки', required: true },
    ],
  },
]

/** Диагностика: что проверяем, образец отчёта, квиз с заявкой */
export const Diagnostics: GlobalConfig = {
  slug: 'diagnostics',
  label: 'Диагностика',
  admin: { group: 'Страницы' },
  access: { read: () => true },
  hooks: {
    afterChange: [
      ({ req }) => {
        if (req?.context?.disableRevalidate) return
        revalidatePath('/diagnostika')
      },
    ],
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Первый экран',
          fields: [pageHeroField({ breadcrumb: true, cta: 'diagnostics' })],
        },
        {
          name: 'checks',
          label: 'Что проверяем',
          fields: [
            ...sectionHeaderFields(),
            {
              name: 'items',
              type: 'array',
              label: 'Карточки',
              labels: { singular: 'Карточка', plural: 'Карточки' },
              admin: { description: 'Номера 01–06 рисуются порядком' },
              fields: [
                iconField({ required: true }),
                { name: 'title', type: 'text', label: 'Что проверяем', required: true },
              ],
            },
          ],
        },
        {
          name: 'report',
          label: 'Образец отчёта',
          fields: [
            ...sectionHeaderFields(),
            reportSampleField(),
            { name: 'buttonLabel', type: 'text', label: 'Кнопка под образцом', required: true },
          ],
        },
        { name: 'quiz', label: 'Квиз', fields: quizFields },
        { label: 'Для поисковиков', fields: [seoField()] },
      ],
    },
  ],
}
