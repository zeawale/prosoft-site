'use client'

import { useEffect, useRef, useState } from 'react'
import styles from './ReviewCard.module.css'

type Props = {
  text: string
  author: string
  role?: string | null
  /** Подписи кнопки: заданы — длинный текст сворачивается до шести строк */
  moreLabel?: string
  lessLabel?: string
}

/** Карточка отзыва. Нужна ли кнопка, решает замер: шесть строк на разной ширине это разный текст */
export function ReviewCard({ text, author, role, moreLabel, lessLabel }: Props) {
  const textRef = useRef<HTMLParagraphElement>(null)
  const [expanded, setExpanded] = useState(false)
  const [overflows, setOverflows] = useState(false)
  const collapsible = Boolean(moreLabel)

  useEffect(() => {
    const node = textRef.current
    // Развёрнутый текст помещается всегда, и кнопка «Свернуть» пропала бы
    if (!node || !collapsible || expanded) return

    const observer = new ResizeObserver(() => {
      setOverflows(node.scrollHeight > node.clientHeight + 1)
    })
    observer.observe(node)
    return () => observer.disconnect()
  }, [collapsible, expanded])

  return (
    <article className={styles.card}>
      <div className={styles.body}>
        <p
          ref={textRef}
          className={`body-l ${styles.text}`}
          data-clamped={(collapsible && !expanded) || undefined}
        >
          {text}
        </p>
        {collapsible && overflows && (
          <button
            type="button"
            className={`body-s ${styles.more}`}
            aria-expanded={expanded}
            onClick={() => setExpanded((value) => !value)}
          >
            {expanded ? lessLabel : moreLabel}
          </button>
        )}
      </div>

      <div className={styles.author}>
        <p className={`label-16 ${styles.name}`}>{author}</p>
        {role && <p className={`body-s ${styles.role}`}>{role}</p>}
      </div>
    </article>
  )
}
