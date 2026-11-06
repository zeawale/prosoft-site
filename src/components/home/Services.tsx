import Link from 'next/link'
import { Icon } from '@/components/ui/Icon'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { ROUTES } from '@/lib/navigation'
import styles from './Services.module.css'

type Route = keyof typeof ROUTES

type Props = {
  title: string
  lead?: string | null
  items?:
    | {
        icon: string
        title: string
        deliverable: string
        term: string
        route: Route
      }[]
    | null
  processesTitle: string
  processes?: { icon: string; title: string }[] | null
}

/** Блок «Направления»: четыре карточки-ссылки, на наведении синие, и плитки процессов */
export function Services({ title, lead, items, processesTitle, processes }: Props) {
  return (
    <>
      <SectionHeader title={title} lead={lead} />

      <div className={styles.list}>
        {items?.map((item) => (
          <Link key={item.route} href={ROUTES[item.route]} className={styles.card}>
            <span className={styles.cardHead}>
              <span className={styles.badge}>
                <Icon slug={item.icon} size={24} />
              </span>
              <span className={`h3 ${styles.cardTitle}`}>{item.title}</span>
            </span>
            <span className={styles.foot}>
              <span className={styles.deliverable}>
                <span className={styles.bar} />
                <span className={`body-s ${styles.deliverableText}`}>{item.deliverable}</span>
              </span>
              <span className={styles.bottom}>
                <span className={`number-xs ${styles.term}`}>{item.term}</span>
                <span className={styles.arrow}>
                  <Icon slug="chevron-right" size={24} />
                </span>
              </span>
            </span>
          </Link>
        ))}
      </div>

      <div className={styles.processes}>
        <h3 className={`h4 ${styles.processesTitle}`}>{processesTitle}</h3>
        <ul className={styles.tiles}>
          {processes?.map((item) => (
            <li key={item.title} className={styles.tileItem}>
              <span className={styles.tile}>
                <span className={styles.tileBadge}>
                  <Icon slug={item.icon} size={20} />
                </span>
                <span className={`h6 ${styles.tileTitle}`}>{item.title}</span>
              </span>
            </li>
          ))}
        </ul>
      </div>
    </>
  )
}
