import type { Field } from 'payload'
import { seoField } from './seoField'

/** Поля страницы кейса. Порядок как на странице, подписи блоков лежат в глобале «Кейсы» */
export const caseDetailFields = (): Field[] => [
  {
    type: 'collapsible',
    label: 'Страница: шапка',
    fields: [
      { name: 'pageTitle', type: 'text', label: 'Заголовок H1', required: true },
      { name: 'breadcrumb', type: 'text', label: 'Подпись в крошках', required: true },
      {
        type: 'row',
        fields: [
          { name: 'company', type: 'text', label: 'Компания', required: true },
          { name: 'industry', type: 'text', label: 'Отрасль', required: true },
        ],
      },
      {
        type: 'row',
        fields: [
          { name: 'configuration', type: 'text', label: 'Конфигурация', required: true },
          { name: 'term', type: 'text', label: 'Срок проекта', required: true },
        ],
      },
    ],
  },
  {
    type: 'collapsible',
    label: 'Страница: таблица «Было, стало»',
    fields: [
      {
        name: 'changes',
        type: 'array',
        label: 'Строки таблицы',
        labels: { singular: 'Строка', plural: 'Строки' },
        fields: [
          { name: 'what', type: 'text', label: 'Что изменилось', required: true },
          {
            type: 'row',
            fields: [
              { name: 'before', type: 'text', label: 'Было', required: true },
              { name: 'after', type: 'text', label: 'Стало', required: true },
            ],
          },
          {
            name: 'numeric',
            type: 'checkbox',
            label: 'Цифры крупным шрифтом',
            defaultValue: false,
            admin: { description: 'Для строк, где было и стало заданы числом' },
          },
        ],
      },
    ],
  },
  {
    type: 'collapsible',
    label: 'Страница: задача, решение, результат',
    fields: [
      { name: 'storyTask', type: 'textarea', label: 'Задача', required: true },
      { name: 'storySolution', type: 'textarea', label: 'Решение', required: true },
      {
        name: 'results',
        type: 'array',
        label: 'Результат',
        labels: { singular: 'Пункт', plural: 'Пункты' },
        fields: [{ name: 'text', type: 'text', label: 'Пункт', required: true }],
      },
    ],
  },
  {
    type: 'collapsible',
    label: 'Страница: теги',
    fields: [
      {
        name: 'tags',
        type: 'array',
        label: 'Теги',
        labels: { singular: 'Тег', plural: 'Теги' },
        fields: [
          {
            type: 'row',
            fields: [
              { name: 'label', type: 'text', label: 'Тег', required: true },
              { name: 'accent', type: 'checkbox', label: 'Синий', defaultValue: false },
            ],
          },
        ],
      },
      {
        name: 'tagsInHead',
        type: 'checkbox',
        label: 'Показывать теги и над заголовком',
        defaultValue: false,
      },
    ],
  },
  {
    type: 'collapsible',
    label: 'Страница: блок «Следующий кейс»',
    fields: [
      {
        name: 'nextSummary',
        type: 'text',
        label: 'Итог одной строкой',
        required: true,
        admin: { description: 'Показывается под названием на странице предыдущего кейса' },
      },
    ],
  },
  { type: 'collapsible', label: 'Для поисковиков', fields: [seoField()] },
]
