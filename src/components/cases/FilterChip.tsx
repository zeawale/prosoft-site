import styles from './FilterChip.module.css'

type Props = {
  label: string
  selected: boolean
  onClick: () => void
}

/** Значение фильтра в каталоге кейсов */
export function FilterChip({ label, selected, onClick }: Props) {
  return (
    <button
      type="button"
      className={`label-14 ${selected ? styles.selected : styles.chip}`}
      aria-pressed={selected}
      onClick={onClick}
    >
      {label}
    </button>
  )
}
