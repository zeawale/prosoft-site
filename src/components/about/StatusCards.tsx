import { Icon } from '@/components/ui/Icon'
import styles from './StatusCards.module.css'

type Props = {
  items?: { icon: string; title: string; text: string }[] | null
}

/** Статусы компании: карточки с иконкой */
export function StatusCards({ items }: Props) {
  return (
    <div className={styles.cards}>
      {items?.map((item) => (
        <article key={item.title} className={styles.card}>
          <span className={styles.tile}>
            <Icon slug={item.icon} className={styles.icon} />
          </span>
          <div className={styles.body}>
            <h3 className={`h4 ${styles.title}`}>{item.title}</h3>
            <p className={`body-m ${styles.text}`}>{item.text}</p>
          </div>
        </article>
      ))}
    </div>
  )
}
