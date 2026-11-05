'use client'

import { useEffect, useRef, type ReactNode } from 'react'
import { Icon } from './Icon'
import styles from './Modal.module.css'

type Props = {
  children: ReactNode
  onClose: () => void
  /** id заголовка внутри окна для aria-labelledby */
  labelledBy: string
  /** Ширина окна: 704 у формы и публикаций */
  width?: number
}

const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), textarea, select'

/** Оболочка модалки: затемнение, фокус заперт внутри, Esc и клик мимо закрывают */
export function Modal({ children, onClose, labelledBy, width = 704 }: Props) {
  const dialogRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
        return
      }
      if (e.key !== 'Tab' || !dialogRef.current) return

      const focusable = dialogRef.current.querySelectorAll<HTMLElement>(FOCUSABLE)
      if (focusable.length === 0) return

      const first = focusable[0]
      const last = focusable[focusable.length - 1]

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', onKeyDown)

    const { overflow } = document.body.style
    document.body.style.overflow = 'hidden'
    dialogRef.current?.focus()

    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = overflow
      previous?.focus()
    }
  }, [onClose])

  return (
    <div className={styles.overlay} onMouseDown={onClose}>
      <div
        ref={dialogRef}
        className={styles.dialog}
        style={{ maxWidth: width }}
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelledBy}
        tabIndex={-1}
        onMouseDown={(e) => e.stopPropagation()}
      >
        <button type="button" className={styles.close} onClick={onClose} aria-label="Закрыть">
          <Icon slug="close" size={24} />
        </button>
        {children}
      </div>
    </div>
  )
}
