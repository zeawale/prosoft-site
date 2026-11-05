import { Icon } from '@/components/ui/Icon'
import styles from './IntegrationGrid.module.css'

type Props = {
  items?:
    | {
        icon: string
        title: string
        systems: string
        text: string
        result?: string | null
      }[]
    | null
}

/** Карточки интеграций: системы, что связываем и результат с оранжевой чертой */
export function IntegrationGrid({ items }: Props) {
  return (
    <ul className={styles.grid}>
      {items?.map((item) => (
        <li key={item.title} className={styles.card}>
          <span className={styles.badge}>
            <Icon slug={item.icon} size={24} className={styles.icon} />
          </span>
          <div className={styles.head}>
            <h3 className={`h4 ${styles.title}`}>{item.title}</h3>
            <p className={`label-14 ${styles.systems}`}>{item.systems}</p>
          </div>
          <p className={`body-m ${styles.text}`}>{item.text}</p>
          {item.result && <p className={`label-16 ${styles.result}`}>{item.result}</p>}
        </li>
      ))}
    </ul>
  )
}
