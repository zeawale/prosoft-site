'use client'

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { Modal } from '@/components/ui/Modal'
import { LeadForm } from './LeadForm'

/** diagnostics — «Получить диагностику», request — «Оставить заявку» */
export type LeadKind = 'diagnostics' | 'request'

export type LeadFormTexts = {
  title: string
  lead: string
  /** Комментарий, который стоит в поле при открытии формы */
  comment?: string | null
  successText: string
}

/** Тексты форм из глобала «Формы заявки» и контакты из «Реквизитов» */
export type LeadConfig = {
  diagnostics: LeadFormTexts
  request: LeadFormTexts
  submitLabel: string
  /** Телефон для экрана ошибки */
  phone: string
  messengers: {
    maxLabel: string
    telegramLabel: string
    intro: string
    maxUrl?: string | null
    telegramUrl?: string | null
  }
}

type OpenOptions = {
  kind?: LeadKind
  /** Комментарий в поле. Не задан — комментарий страницы или формы */
  comment?: string | null
}

type Ctx = {
  config: LeadConfig
  open: (source: string, options?: OpenOptions) => void
  close: () => void
  setPageComment: (comment: string | null) => void
}

type Opened = { source: string; kind: LeadKind; comment: string }

const LeadModalContext = createContext<Ctx | null>(null)

function useCtx() {
  const ctx = useContext(LeadModalContext)
  if (!ctx) {
    throw new Error('Форма заявки используется вне LeadModalProvider')
  }
  return ctx
}

export function useLeadModal() {
  const { open, close } = useCtx()
  return { open, close }
}

export function useLeadConfig() {
  return useCtx().config
}

/**
 * Комментарий страницы для формы «Оставить заявку»: кнопка в шапке не знает,
 * на какой она странице, и берёт его отсюда. Страница ставит компонент
 * рядом с первым экраном, при уходе со страницы комментарий снимается.
 */
export function LeadPageComment({ comment }: { comment?: string | null }) {
  const { setPageComment } = useCtx()
  useEffect(() => {
    setPageComment(comment ?? null)
    return () => setPageComment(null)
  }, [comment, setPageComment])
  return null
}

export function LeadModalProvider({
  config,
  children,
}: {
  config: LeadConfig
  children: React.ReactNode
}) {
  const [opened, setOpened] = useState<Opened | null>(null)
  const [pageComment, setPageComment] = useState<string | null>(null)

  const open = useCallback(
    (source: string, { kind = 'diagnostics', comment }: OpenOptions = {}) => {
      const fromPage = kind === 'request' ? pageComment : null
      setOpened({
        source,
        kind,
        comment: comment ?? fromPage ?? config[kind].comment ?? '',
      })
    },
    [config, pageComment],
  )
  const close = useCallback(() => setOpened(null), [])

  const value = useMemo(() => ({ config, open, close, setPageComment }), [config, open, close])

  return (
    <LeadModalContext.Provider value={value}>
      {children}
      {opened !== null && (
        <Modal onClose={close} labelledBy="lead-modal-title">
          <LeadForm
            source={opened.source}
            kind={opened.kind}
            comment={opened.comment}
            titleId="lead-modal-title"
            onDone={close}
          />
        </Modal>
      )}
    </LeadModalContext.Provider>
  )
}
