'use client'

import { LeadButton } from './LeadButton'
import { LeadPageComment } from './LeadModalProvider'

type Props = {
  /** Источник заявки, например `support-hero` */
  source: string
  label: string
  /** Комментарий страницы: и для этой кнопки, и для «Оставить заявку» в шапке */
  comment?: string | null
}

/** «Оставить заявку» на первом экране услуги: форма с комментарием под страницу */
export function RequestHeroButton({ source, label, comment }: Props) {
  return (
    <>
      <LeadPageComment comment={comment} />
      <LeadButton source={source} kind="request" comment={comment}>
        {label}
      </LeadButton>
    </>
  )
}
