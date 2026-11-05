import type { ReactNode } from 'react'
import { Breadcrumbs, type Crumb } from '@/components/ui/Breadcrumbs'
import styles from './PageHead.module.css'

type Props = {
  crumbs: Crumb[]
  title: string
  lead?: string | null
  /** Строка между крошками и заголовком: теги кейса */
  above?: ReactNode
}

/** Шапка страницы без ролика: «Кейсы», кейс, «О компании». Для шапки сайта это и есть hero */
export function PageHead({ crumbs, title, lead, above }: Props) {
  return (
    <div className={styles.head} data-hero>
      <div className={styles.crumbs}>
        <Breadcrumbs items={crumbs} />
      </div>
      {above}
      <h1 className={`display-48 ${styles.title}`}>{title}</h1>
      {lead && <p className={`body-l ${styles.lead}`}>{lead}</p>}
    </div>
  )
}
