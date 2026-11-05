'use client'

import type { ComponentProps } from 'react'
import { Button } from '@/components/ui/Button'
import { useLeadModal } from './LeadModalProvider'

type Props = Omit<ComponentProps<typeof Button>, 'href' | 'onClick' | 'type' | 'external'> & {
  /** Откуда заявка: пишется в поле «Источник», например `home-hero` */
  source: string
}

/** Кнопка, открывающая форму заявки в модалке. Вид и размер как у Button */
export function LeadButton({ source, ...button }: Props) {
  const { open } = useLeadModal()
  return <Button {...button} onClick={() => open(source)} />
}
