import type { GlobalConfig } from 'payload'
import { revalidatePath } from 'next/cache'

/** Убирает из телефона всё, кроме плюса и цифр: для href="tel:" */
const toRaw = (value?: string | null) => (value ? value.replace(/[^\d+]/g, '') : value)

export const Settings: GlobalConfig = {
  slug: 'settings',
  label: 'Реквизиты и контакты',
  admin: { group: 'Настройки' },
  access: { read: () => true },
  hooks: {
    afterChange: [
      ({ req }) => {
        if (req?.context?.disableRevalidate) return
        // Контакты живут в шапке и футере, то есть в корневом лейауте.
        // Точечная ревалидация здесь невозможна: гасим весь сайт
        revalidatePath('/', 'layout')
      },
    ],
  },
  fields: [
    {
      type: 'row',
      fields: [
        {
          name: 'phone',
          type: 'text',
          label: 'Телефон',
          required: true,
          defaultValue: '+7 831 413-06-67',
          admin: { description: 'В том виде, в каком показывается на сайте' },
        },
        {
          name: 'phoneRaw',
          type: 'text',
          label: 'Телефон для ссылки',
          admin: {
            readOnly: true,
            description: 'Заполняется автоматически из поля слева',
          },
          hooks: {
            beforeValidate: [({ siblingData }) => toRaw(siblingData?.phone)],
          },
        },
      ],
    },
    {
      name: 'email',
      type: 'email',
      label: 'Почта',
      required: true,
      defaultValue: 'info@pm52.ru',
    },
    {
      type: 'row',
      fields: [
        {
          name: 'maxUrl',
          type: 'text',
          label: 'Ссылка MAX',
          admin: {
            description:
              'Профиль вида https://max.ru/u/…: значок в шапке и подвале, кнопка в форме заявки. Пусто — значка и кнопки нет',
          },
        },
        {
          name: 'telegramUrl',
          type: 'text',
          label: 'Ссылка Telegram',
          admin: {
            description:
              'Профиль вида https://t.me/имя: значок в шапке и подвале, кнопка в форме заявки. Пусто — значка и кнопки нет',
          },
        },
      ],
    },
    {
      name: 'address',
      type: 'text',
      label: 'Адрес',
      required: true,
      defaultValue: 'г. Нижний Новгород, Казанское ш., 12, этаж 3, кабинет 311',
    },
    {
      name: 'footerTagline',
      type: 'text',
      label: 'Подпись под логотипом в подвале',
      required: true,
      defaultValue: 'ПРО-СОФТ: внедрение 1С, Нижний Новгород',
    },
    {
      type: 'row',
      fields: [
        {
          name: 'legalName',
          type: 'text',
          label: 'Юридическое лицо',
          required: true,
          defaultValue: 'ООО «ПРО-СОФТ»',
        },
        {
          name: 'inn',
          type: 'text',
          label: 'ИНН',
          required: true,
          defaultValue: '5260480157',
        },
        {
          name: 'ogrn',
          type: 'text',
          label: 'ОГРН',
          required: true,
          defaultValue: '1215200037128',
        },
      ],
    },
    {
      name: 'accreditation',
      type: 'text',
      label: 'Строка об аккредитации',
      required: true,
      defaultValue: 'Аккредитованная ИТ-компания, реестр Минцифры России',
    },
  ],
}
