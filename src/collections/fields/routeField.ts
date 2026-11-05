import type { SelectField } from 'payload'
import type { ROUTES } from '@/lib/navigation'

const ROUTE_OPTIONS: { value: keyof typeof ROUTES; label: string }[] = [
  { value: 'upp', label: 'Переход с 1С:УПП' },
  { value: 'erp', label: 'Внедрение 1С:ERP и 1С:КА' },
  { value: 'dorabotka', label: 'Доработка и обновление 1С' },
  { value: 'support', label: 'Сопровождение 1С' },
  { value: 'diagnostics', label: 'Диагностика' },
  { value: 'cases', label: 'Кейсы' },
  { value: 'about', label: 'О компании' },
]

/** Селект страницы сайта. В базе лежит ключ, адрес берётся из ROUTES */
export const routeField = ({
  name = 'route',
  label = 'Куда ведёт',
  required = false,
}: { name?: string; label?: string; required?: boolean } = {}): SelectField => ({
  name,
  type: 'select',
  label,
  required,
  options: ROUTE_OPTIONS,
})
