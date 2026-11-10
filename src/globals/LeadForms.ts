import type { Field, GlobalConfig } from 'payload'
import { revalidatePath } from 'next/cache'

type FormDefaults = { title: string; lead: string; comment: string; successText: string }

const formGroup = (name: string, label: string, defaults: FormDefaults): Field => ({
  name,
  type: 'group',
  label,
  fields: [
    {
      name: 'title',
      type: 'text',
      label: 'Заголовок',
      required: true,
      defaultValue: defaults.title,
    },
    {
      name: 'lead',
      type: 'text',
      label: 'Подзаголовок',
      required: true,
      defaultValue: defaults.lead,
    },
    {
      name: 'comment',
      type: 'textarea',
      label: 'Комментарий в форме',
      defaultValue: defaults.comment,
      admin: {
        description:
          'Подставляется в поле «Комментарий» при открытии формы, человек может его стереть или дописать. Пусто — поле пустое',
      },
    },
    {
      name: 'successText',
      type: 'text',
      label: 'Текст после отправки',
      required: true,
      defaultValue: defaults.successText,
    },
  ],
})

/**
 * Две формы заявки в модалке: «Получить диагностику» (кнопки диагностики по
 * сайту) и «Оставить заявку» (шапка и первые экраны услуг, там комментарий
 * берётся со страницы). Поля и кнопка отправки у них общие.
 *
 * Глобал живёт в корневом layout вместе с модалкой: ревалидируем весь сайт.
 */
export const LeadForms: GlobalConfig = {
  slug: 'lead-forms',
  label: 'Формы заявки',
  admin: { group: 'Настройки' },
  access: { read: () => true },
  hooks: {
    afterChange: [
      ({ req }) => {
        if (req?.context?.disableRevalidate) return
        revalidatePath('/', 'layout')
      },
    ],
  },
  fields: [
    formGroup('diagnostics', 'Форма «Получить диагностику»', {
      title: 'Получить диагностику за 2 дня',
      lead: 'Перезвоним и договоримся о времени диагностики. Бесплатно, отчёт на руки.',
      comment: 'Хочу записаться на бесплатную диагностику 1С за 2 дня.',
      successText: 'Перезвоним в течение рабочего дня и договоримся о времени диагностики.',
    }),
    formGroup('request', 'Форма «Оставить заявку»', {
      title: 'Оставить заявку',
      lead: 'Перезвоним в течение рабочего дня и ответим на вопросы.',
      comment: '',
      successText: 'Перезвоним в течение рабочего дня и ответим на вопросы.',
    }),
    {
      name: 'submitLabel',
      type: 'text',
      label: 'Кнопка отправки',
      required: true,
      defaultValue: 'Отправить заявку',
    },
    {
      type: 'collapsible',
      label: 'Мессенджеры в форме',
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'maxLabel',
              type: 'text',
              label: 'Кнопка MAX',
              required: true,
              defaultValue: 'Отправить сообщение в MAX',
            },
            {
              name: 'telegramLabel',
              type: 'text',
              label: 'Кнопка Telegram',
              required: true,
              defaultValue: 'Отправить сообщение в Telegram',
            },
          ],
        },
        {
          name: 'messageIntro',
          type: 'text',
          label: 'Первая строка сообщения',
          required: true,
          defaultValue: 'Здравствуйте! Пишу с сайта про-софт.рф.',
          admin: {
            description:
              'Дальше в сообщении идут комментарий и заполненные контакты. Telegram подставляет текст в чат сам, MAX так не умеет: текст копируется в буфер обмена. Ссылки на профили — в «Реквизитах и контактах»',
          },
        },
      ],
    },
  ],
}
