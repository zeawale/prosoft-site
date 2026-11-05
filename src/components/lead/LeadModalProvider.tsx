'use client'

import { createContext, useCallback, useContext, useState } from 'react'
import { Modal } from '@/components/ui/Modal'
import { LeadForm } from './LeadForm'

type Ctx = {
  open: (source: string) => void
  close: () => void
}

const LeadModalContext = createContext<Ctx | null>(null)

export function useLeadModal() {
  const ctx = useContext(LeadModalContext)
  if (!ctx) {
    throw new Error('useLeadModal используется вне LeadModalProvider')
  }
  return ctx
}

export function LeadModalProvider({
  phone,
  children,
}: {
  phone: string
  children: React.ReactNode
}) {
  const [source, setSource] = useState<string | null>(null)

  const open = useCallback((s: string) => setSource(s), [])
  const close = useCallback(() => setSource(null), [])

  return (
    <LeadModalContext.Provider value={{ open, close }}>
      {children}
      {source !== null && (
        <Modal onClose={close} labelledBy="lead-modal-title">
          <LeadForm source={source} phone={phone} titleId="lead-modal-title" onDone={close} />
        </Modal>
      )}
    </LeadModalContext.Provider>
  )
}
