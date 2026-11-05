import type { SelectField } from 'payload'
import { iconOptions } from '@/lib/icons'

/** Селект иконки: один список на всю админку, источник — lib/icons.ts */
export const iconField = ({
  name = 'icon',
  label = 'Иконка',
  required = false,
}: { name?: string; label?: string; required?: boolean } = {}): SelectField => ({
  name,
  type: 'select',
  label,
  required,
  options: iconOptions,
})
