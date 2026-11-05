import { Icon } from '@/components/ui/Icon'
import styles from './FeatureGrid.module.css'

type Props = {
  items?: { icon: string; title: string; text: string }[] | null
  /** На «Доработке» три в ряд, на «Сопровождении» четыре */
  columns?: 3 | 4
}

/** Карточки услуг: плитка с иконкой, название, описание */
export function FeatureGrid({ items, columns = 3 }: Props) {
  return (
    <ul className={columns === 4 ? styles.four : styles.three}>
      {items?.map((item) => (
        <li key={item.title} className={styles.card}>
          <span className={styles.tile}>
            <Icon slug={item.icon} size={24} className={styles.icon} />
          </span>
          <div className={styles.body}>
            <h3 className={`h4 ${styles.title}`}>{item.title}</h3>
            <p className={`body-m ${styles.text}`}>{item.text}</p>
          </div>
        </li>
      ))}
    </ul>
  )
}
