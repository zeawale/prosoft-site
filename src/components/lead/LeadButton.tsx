'use client'

import type { ComponentProps } from 'react'
import { Button } from '@/components/ui/Button'
import { useLeadModal, type LeadKind } from './LeadModalProvider'

type Props = Omit<ComponentProps<typeof Button>, 'href' | 'onClick' | 'type' | 'external'> & {
  /** Откуда заявка: пишется в поле «Источник», например `home-hero` */
  source: string
  /** Какая форма откроется. По умолчанию диагностика */
  kind?: LeadKind
  /** Комментарий в поле формы. Не задан — комментарий страницы или формы */
  comment?: string | null
}

/** Кнопка, открывающая форму заявки в модалке. Вид и размер как у Button */
export function LeadButton({ source, kind, comment, ...button }: Props) {
  const { open } = useLeadModal()
  return <Button {...button} onClick={() => open(source, { kind, comment })} />
}
