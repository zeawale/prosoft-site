'use client'

import { useId, useState } from 'react'
import { LeadButton } from '@/components/lead/LeadButton'
import { SectionHeader } from '@/components/ui/SectionHeader'
import styles from './ErpOrKa.module.css'

type Config = { title: string; text: string; verdictTitle: string; verdictText: string }

type Props = {
  title: string
  lead?: string | null
  questionsTitle: string
  questions?: { text: string; decisive?: boolean | null }[] | null
  noLabel: string
  yesLabel: string
  hint: string
  matchLabel: string
  buttonLabel: string
  ka: Config
  erp: Config
  rows?: { label: string; ka: string; erp: string }[] | null
  /** Откуда заявка: пишется в поле «Источник» */
  source: string
  /** compact — кадр УПП: заголовок вопросов над сеткой. full — кадр ERP: он в левой колонке */
  layout?: 'compact' | 'full'
}

/**
 * Подбор конфигурации: вопросы Да/Нет, вывод и две карточки. Вывод появляется,
 * когда отвечены все вопросы, а решает его вопрос с галочкой «Решающий»:
 * «Да» даёт 1С:ERP, «Нет» даёт 1С:КА.
 */
export function ErpOrKa({
  title,
  lead,
  questionsTitle,
  questions,
  noLabel,
  yesLabel,
  hint,
  matchLabel,
  buttonLabel,
  ka,
  erp,
  rows,
  source,
  layout = 'compact',
}: Props) {
  const id = useId()
  const [answers, setAnswers] = useState<Record<number, boolean>>({})

  const items = questions ?? []
  const complete = items.length > 0 && items.every((_, index) => index in answers)
  const decisive = items.findIndex((item) => item.decisive)
  const fit = complete ? (answers[decisive] ? 'erp' : 'ka') : null
  const verdict = fit === 'erp' ? erp : fit === 'ka' ? ka : null

  const heading = <h3 className={`h4 ${styles.heading}`}>{questionsTitle}</h3>

  return (
    <div className={layout === 'full' ? `${styles.block} ${styles.full}` : styles.block}>
      <SectionHeader title={title} lead={lead} />
      {layout === 'compact' && heading}

      <div className={styles.switcher}>
        <div className={styles.questions}>
          <div className={styles.list}>
            {layout === 'full' && heading}

            {items.map((item, index) => (
              <div key={item.text} className={styles.question}>
                <p id={`${id}-${index}`} className={`body-m ${styles.questionText}`}>
                  {item.text}
                </p>
                <div
                  className={styles.segment}
                  role="radiogroup"
                  aria-labelledby={`${id}-${index}`}
                >
                  {[false, true].map((value) => (
                    <label key={String(value)} className={`label-14 ${styles.option}`}>
                      <input
                        className="sr-only"
                        type="radio"
                        name={`${id}-${index}`}
                        checked={answers[index] === value}
                        onChange={() => setAnswers({ ...answers, [index]: value })}
                      />
                      {value ? yesLabel : noLabel}
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className={styles.verdict} aria-live="polite">
            {verdict ? (
              <>
                <div className={styles.answer}>
                  <p className={`h3 ${styles.verdictTitle}`}>{verdict.verdictTitle}</p>
                  <p className={`body-s ${styles.verdictText}`}>{verdict.verdictText}</p>
                </div>
                <LeadButton variant="secondary" size="M" source={source}>
                  {buttonLabel}
                </LeadButton>
              </>
            ) : (
              <p className={`body-m ${styles.hint}`}>{hint}</p>
            )}
          </div>
        </div>

        <div className={styles.configs}>
          {(['ka', 'erp'] as const).map((key) => {
            const config = key === 'ka' ? ka : erp
            return (
              <article key={key} className={styles.card} data-match={fit === key || undefined}>
                <div className={styles.cardHead}>
                  <h3 className={`h3 ${styles.cardTitle}`}>{config.title}</h3>
                  {fit === key && <span className={`label-13 ${styles.badge}`}>{matchLabel}</span>}
                </div>
                <p className={`body-m ${styles.cardText}`}>{config.text}</p>
                <dl className={styles.rows}>
                  {rows?.map((row) => (
                    <div key={row.label} className={styles.row}>
                      <dt className={`label-14 ${styles.rowLabel}`}>{row.label}</dt>
                      <dd className={`body-m ${styles.rowValue}`}>{row[key]}</dd>
                    </div>
                  ))}
                </dl>
              </article>
            )
          })}
        </div>
      </div>
    </div>
  )
}
