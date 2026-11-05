import type { GlobalConfig } from 'payload'
import { revalidatePath } from 'next/cache'

/**
 * Тексты cookie-баннера. Своя ревалидация: баннер живёт в корневом layout,
 * значит гасить надо весь сайт.
 *
 * Юридическая часть, которая НЕ настраивается из админки и зашита в
 * компонент: кнопка отказа равна по размеру кнопке принятия, а до ответа
 * аналитика не грузится. Это требования, а не оформление.
 */
export const CookieBanner: GlobalConfig = {
  slug: 'cookie-banner',
  label: 'Cookie-баннер',
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
    {
      name: 'version',
      type: 'text',
      label: 'Версия согласия',
      required: true,
      defaultValue: '2026-11-05',
      admin: {
        description:
          'Меняйте дату, когда меняется текст баннера или раздел про cookie в политике. Посетители, ответившие на прежних условиях, увидят баннер снова',
      },
    },
    {
      name: 'text',
      type: 'textarea',
      label: 'Текст до ссылки',
      required: true,
      defaultValue: 'Используем cookie для работы сайта и обезличенной аналитики. Подробнее в',
    },
    {
      name: 'policyLabel',
      type: 'text',
      label: 'Текст ссылки на политику',
      required: true,
      defaultValue: 'политике обработки персональных данных',
      admin: { description: 'Ведёт на страницу /privacy, адрес менять не нужно' },
    },
    {
      type: 'row',
      fields: [
        {
          name: 'necessaryOnlyLabel',
          type: 'text',
          label: 'Кнопка отказа',
          required: true,
          defaultValue: 'Только необходимые',
        },
        {
          name: 'acceptAllLabel',
          type: 'text',
          label: 'Кнопка принятия',
          required: true,
          defaultValue: 'Принять все',
        },
      ],
    },
  ],
}
