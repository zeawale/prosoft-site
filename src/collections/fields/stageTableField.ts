import type { Field, GroupField } from 'payload'

type Options = {
  name?: string
  label?: string
  /** Колонка «Стоимость» */
  price?: boolean
  /** Строки-заголовки групп этапов, в макете у таблицы на 8 шагов */
  groups?: boolean
}

/** Таблица этапов для компонента StageTable. Имена полей совпадают с его пропсами */
export const stageTableField = ({
  name = 'table',
  label = 'Таблица этапов',
  price = false,
  groups = false,
}: Options = {}): GroupField => {
  const columns: Field[] = [
    { name: 'stageLabel', type: 'text', label: 'Колонка «Этап»', required: true },
    { name: 'termLabel', type: 'text', label: 'Колонка «Срок»', required: true },
    { name: 'resultLabel', type: 'text', label: 'Колонка «Результат»', required: true },
  ]
  if (price) {
    columns.push({ name: 'priceLabel', type: 'text', label: 'Колонка «Стоимость»', required: true })
  }
  columns.push({ name: 'payLabel', type: 'text', label: 'Колонка «Оплата»', required: true })

  const step: Field[] = []
  if (groups) {
    step.push({
      name: 'group',
      type: 'text',
      label: 'Начало группы',
      admin: { description: 'Заполнить у первого шага группы: подпись встанет строкой над ним' },
    })
  }
  step.push(
    { name: 'title', type: 'text', label: 'Этап', required: true },
    { name: 'term', type: 'text', label: 'Срок', required: true },
    { name: 'result', type: 'text', label: 'Результат', required: true },
  )
  if (price) step.push({ name: 'price', type: 'text', label: 'Стоимость' })
  step.push(
    { name: 'pay', type: 'text', label: 'Оплата', required: true },
    {
      name: 'accent',
      type: 'checkbox',
      label: 'Выделить оранжевым',
      defaultValue: false,
      admin: { description: 'Бесплатный этап: оранжевый номер и подпись оплаты' },
    },
  )

  return {
    name,
    type: 'group',
    label,
    fields: [
      { type: 'row', fields: columns },
      {
        name: 'steps',
        type: 'array',
        label: 'Шаги',
        labels: { singular: 'Шаг', plural: 'Шаги' },
        minRows: 3,
        maxRows: 8,
        admin: { description: 'Номера рисуются порядком, отдельного поля у шага нет' },
        fields: step,
      },
    ],
  }
}
