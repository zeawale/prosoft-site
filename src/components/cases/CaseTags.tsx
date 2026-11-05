import styles from './CaseTags.module.css'

type Props = {
  tags: { label: string; accent?: boolean | null }[]
}

/** Теги кейса: не кликабельны, фильтры живут на странице «Кейсы» */
export function CaseTags({ tags }: Props) {
  return (
    <ul className={styles.list}>
      {tags.map((tag) => (
        <li key={tag.label} className={`label-13 ${tag.accent ? styles.accent : styles.neutral}`}>
          {tag.label}
        </li>
      ))}
    </ul>
  )
}
