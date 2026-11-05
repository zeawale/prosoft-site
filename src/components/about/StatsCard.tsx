import styles from './StatsCard.module.css'

type Props = {
  stats: { value: string; text: string }[]
}

/** Цифры о компании в одной карточке */
export function StatsCard({ stats }: Props) {
  return (
    <ul className={styles.card}>
      {stats.map((stat) => (
        <li key={stat.value} className={styles.stat}>
          <span className={`number-l ${styles.value}`}>{stat.value}</span>
          <span className={`body-m ${styles.text}`}>{stat.text}</span>
        </li>
      ))}
    </ul>
  )
}
