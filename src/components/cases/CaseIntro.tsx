import type { Crumb } from '@/components/ui/Breadcrumbs'
import { CaseTags } from './CaseTags'
import { PageHead } from './PageHead'
import styles from './CaseIntro.module.css'

type Props = {
  crumbs: Crumb[]
  title: string
  tags?: { label: string; accent?: boolean | null }[] | null
  tagsInHead?: boolean | null
  facts: { label: string; value: string }[]
  changes?: { what: string; before: string; after: string; numeric?: boolean | null }[] | null
  labels: { table: string; before: string; after: string }
}

/** Шапка кейса: заголовок, реквизиты, таблица «было, стало» */
export function CaseIntro({ crumbs, title, tags, tagsInHead, facts, changes, labels }: Props) {
  return (
    <div className={`wrap ${styles.intro}`}>
      <PageHead
        crumbs={crumbs}
        title={title}
        above={tagsInHead && tags?.length ? <CaseTags tags={tags} /> : undefined}
      />

      <dl className={styles.facts}>
        {facts.map((fact) => (
          <div key={fact.label} className={styles.fact}>
            <dt className={`label-14 ${styles.factLabel}`}>{fact.label}</dt>
            <dd className={`h5 ${styles.factValue}`}>{fact.value}</dd>
          </div>
        ))}
      </dl>

      {changes && changes.length > 0 && (
        <div className={styles.table} role="table" aria-label={labels.table}>
          <div className={`label-14 ${styles.head}`} role="row">
            <span className={styles.headMuted} role="columnheader">
              {labels.table}
            </span>
            <span className={styles.headMuted} role="columnheader">
              {labels.before}
            </span>
            <span className={styles.headAccent} role="columnheader">
              {labels.after}
            </span>
          </div>

          {changes.map((row) => (
            <div key={row.what} className={styles.row} role="row">
              <span className={`h5 ${styles.what}`} role="cell">
                {row.what}
              </span>
              <span
                className={`${row.numeric ? 'number-m' : 'body-l'} ${styles.before}`}
                data-label={labels.before}
                role="cell"
              >
                {row.before}
              </span>
              <span
                className={`${row.numeric ? 'number-m' : 'h4'} ${styles.after}`}
                data-label={labels.after}
                role="cell"
              >
                {row.after}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
