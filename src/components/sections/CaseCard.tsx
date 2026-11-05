import type { ReactNode } from 'react'
import { TextLink } from '@/components/ui/TextLink'
import styles from './CaseCard.module.css'

export type CaseCardLabels = {
  before: string
  after: string
  task: string
  done: string
  read: string
}

type Props = {
  title: string
  href: string
  metric: string
  before: string
  after: string
  result: string
  task: string
  done: string
  labels: CaseCardLabels
  /** Место над заголовком: теги отрасли и конфигурации на странице кейсов */
  top?: ReactNode
}

/** Карточка кейса в форме акта: было, стало, итог, задача, что сделали. Высоты в ряду равны */
export function CaseCard({
  title,
  href,
  metric,
  before,
  after,
  result,
  task,
  done,
  labels,
  top,
}: Props) {
  return (
    <article className={styles.card}>
      {top}
      <h3 className={`h4 ${styles.title}`}>{title}</h3>

      <div className={styles.beforeAfter}>
        <div className={styles.metric}>
          <p className={`body-s ${styles.metricLabel}`}>{metric}</p>
          <div className={styles.pair}>
            <div className={styles.before}>
              <span className={`label-12 ${styles.beforeLabel}`}>{labels.before}</span>
              <span className={`number-m ${styles.beforeValue}`}>{before}</span>
            </div>
            <div className={styles.after}>
              <span className={`label-12 ${styles.afterLabel}`}>{labels.after}</span>
              <span className={`number-l ${styles.afterValue}`}>{after}</span>
            </div>
          </div>
        </div>
        <p className={`body-s ${styles.result}`}>{result}</p>
      </div>

      <dl className={styles.act}>
        <div className={styles.actRow}>
          <dt className={`label-13 ${styles.actLabel}`}>{labels.task}</dt>
          <dd className={`body-s ${styles.actText}`}>{task}</dd>
        </div>
        <div className={styles.actRow}>
          <dt className={`label-13 ${styles.actLabel}`}>{labels.done}</dt>
          <dd className={`body-s ${styles.actText}`}>{done}</dd>
        </div>
      </dl>

      <TextLink href={href}>{labels.read}</TextLink>
    </article>
  )
}
