'use client'

import { useId, useRef, useState, type KeyboardEvent } from 'react'
import { LeadButton } from '@/components/lead/LeadButton'
import { SectionHeader } from '@/components/ui/SectionHeader'
import styles from './PainCheck.module.css'

type Props = {
  title: string
  lead?: string | null
  answerLabel: string
  items?: { statement: string; answer: string }[] | null
  summary: string
  buttonLabel: string
}

const number = (index: number) => String(index + 1).padStart(2, '0')

/** Блок «Узнаёте себя?»: ситуации слева как вкладки, ответ по выбранной справа */
export function PainCheck({ title, lead, answerLabel, items, summary, buttonLabel }: Props) {
  const [active, setActive] = useState(0)
  const baseId = useId()
  const tabs = useRef<(HTMLButtonElement | null)[]>([])
  const list = items ?? []
  const current = list[active]

  const onKeyDown = (event: KeyboardEvent) => {
    const step = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 }[event.key]
    if (!step) return
    event.preventDefault()
    const next = (active + step + list.length) % list.length
    setActive(next)
    tabs.current[next]?.focus()
  }

  return (
    <>
      <SectionHeader title={title} lead={lead} />

      <div className={styles.picker}>
        <div className={styles.main}>
          <div
            className={styles.list}
            role="tablist"
            aria-orientation="vertical"
            aria-label={title}
            onKeyDown={onKeyDown}
          >
            {list.map((item, index) => (
              <button
                key={item.statement}
                ref={(node) => {
                  tabs.current[index] = node
                }}
                type="button"
                role="tab"
                id={`${baseId}-tab-${index}`}
                aria-selected={index === active}
                aria-controls={`${baseId}-panel`}
                tabIndex={index === active ? 0 : -1}
                className={styles.row}
                onClick={() => setActive(index)}
              >
                <span className={`number-s ${styles.rowNumber}`}>{number(index)}</span>
                <span className={`h5 ${styles.rowText}`}>{item.statement}</span>
              </button>
            ))}
          </div>

          {current && (
            <div
              className={styles.detail}
              role="tabpanel"
              id={`${baseId}-panel`}
              aria-labelledby={`${baseId}-tab-${active}`}
            >
              <div className={styles.detailHead}>
                <p className={`number-l ${styles.detailNumber}`}>{number(active)}</p>
                <h3 className={`h3 ${styles.statement}`}>{current.statement}</h3>
              </div>
              <div className={styles.answer}>
                <p className={`label-14 ${styles.answerLabel}`}>{answerLabel}</p>
                <p className={`body-l ${styles.answerText}`}>{current.answer}</p>
              </div>
            </div>
          )}
        </div>

        <div className={styles.summary}>
          <p className={`body-m ${styles.summaryText}`}>{summary}</p>
          <LeadButton source="home-pain-check" size="M">
            {buttonLabel}
          </LeadButton>
        </div>
      </div>
    </>
  )
}
