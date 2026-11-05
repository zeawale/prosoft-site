import styles from './ScenarioCard.module.css'

export type ScenarioLabels = {
  fitLabel: string
  termLabel: string
  budgetLabel: string
  licensesLabel: string
}

type Props = {
  title: string
  fit: string
  term: string
  budget: string
  licenses: string
  labels: ScenarioLabels
}

/** Сценарий для владельца 1С:УПП: название и строки спецификации. Высоты в ряду равны */
export function ScenarioCard({ title, fit, term, budget, licenses, labels }: Props) {
  return (
    <article className={styles.card}>
      <h3 className={`h4 ${styles.title}`}>{title}</h3>

      <dl className={styles.spec}>
        <div className={styles.row}>
          <dt className={`label-13 ${styles.label}`}>{labels.fitLabel}</dt>
          <dd className={`body-s ${styles.value}`}>{fit}</dd>
        </div>
        <div className={styles.row}>
          <dt className={`label-13 ${styles.label}`}>{labels.termLabel}</dt>
          <dd className={`number-s ${styles.value}`}>{term}</dd>
        </div>
        <div className={styles.row}>
          <dt className={`label-13 ${styles.label}`}>{labels.budgetLabel}</dt>
          {/* В макете цифры моноширинные, а бюджет словами набран как обычный текст */}
          <dd className={`${/\d/.test(budget) ? 'number-s' : 'body-s'} ${styles.value}`}>
            {budget}
          </dd>
        </div>
        <div className={styles.row}>
          <dt className={`label-13 ${styles.label}`}>{labels.licensesLabel}</dt>
          <dd className={`body-s ${styles.value}`}>{licenses}</dd>
        </div>
      </dl>
    </article>
  )
}
