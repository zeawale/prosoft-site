import { Icon } from '@/components/ui/Icon'
import styles from './CheckGrid.module.css'

type Props = {
  items?: { icon: string; title: string }[] | null
  /** В кадре диагностики три в ряд, в кадре аудита четыре */
  columns?: 3 | 4
}

/** Карточки «что проверяем»: номера рисуются порядком */
export function CheckGrid({ items, columns = 3 }: Props) {
  return (
    <ul className={columns === 4 ? styles.four : styles.three}>
      {items?.map((item, index) => (
        <li key={item.title} className={styles.card}>
          <div className={styles.media}>
            <span className={styles.badge}>
              <Icon slug={item.icon} size={48} className={styles.icon} />
            </span>
            <span className={`number-m ${styles.number}`}>
              {String(index + 1).padStart(2, '0')}
            </span>
          </div>
          <div className={styles.body}>
            <h3 className={`h4 ${styles.title}`}>{item.title}</h3>
          </div>
        </li>
      ))}
    </ul>
  )
}
