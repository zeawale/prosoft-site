import { Fragment } from 'react'
import styles from './StageTable.module.css'

export type StageStep = {
  title: string
  term: string
  result: string
  pay: string
  /** Стоимость: колонка появляется, если задан priceLabel */
  price?: string | null
  /** Бесплатный этап: оранжевый номер и подпись оплаты */
  accent?: boolean | null
  /** Подпись группы: встаёт строкой над этим шагом */
  group?: string | null
}

type Props = {
  stageLabel: string
  termLabel: string
  resultLabel: string
  payLabel: string
  priceLabel?: string | null
  steps?: StageStep[] | null
}

/**
 * Таблица этапов для тёмной секции: 3–8 шагов, группы и колонка цены по данным.
 * На телефоне шапка уходит, строка становится столбиком.
 */
export function StageTable({
  stageLabel,
  termLabel,
  resultLabel,
  payLabel,
  priceLabel,
  steps,
}: Props) {
  const rowClass = priceLabel ? `${styles.row} ${styles.withPrice}` : styles.row

  return (
    <div className={styles.table} role="table">
      <div className={`label-13 ${rowClass} ${styles.head}`} role="row">
        <span role="columnheader">{stageLabel}</span>
        <span role="columnheader">{termLabel}</span>
        <span role="columnheader">{resultLabel}</span>
        {priceLabel && <span role="columnheader">{priceLabel}</span>}
        <span role="columnheader">{payLabel}</span>
      </div>

      {steps?.map((step, index) => (
        <Fragment key={step.title}>
          {step.group && (
            <div className={`label-13 ${styles.group}`} role="row">
              <span role="cell">{step.group}</span>
            </div>
          )}
          <div className={rowClass} role="row" data-accent={step.accent || undefined}>
            <div className={styles.stage} role="cell">
              <span className={`label-16 ${styles.node}`}>{index + 1}</span>
              <span className={`h4 ${styles.title}`}>{step.title}</span>
            </div>
            <span className={`body-m ${styles.term}`} role="cell">
              {step.term}
            </span>
            <span className={`body-m ${styles.result}`} role="cell">
              {step.result}
            </span>
            {priceLabel && (
              <span className={`label-14 ${styles.price}`} role="cell">
                {step.price}
              </span>
            )}
            <span className={`label-14 ${styles.pay}`} role="cell">
              {step.pay}
            </span>
          </div>
        </Fragment>
      ))}
    </div>
  )
}
