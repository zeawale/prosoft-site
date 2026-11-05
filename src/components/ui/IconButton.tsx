import { Icon } from './Icon'
import type { IconName } from '@/lib/icons'
import styles from './IconButton.module.css'

type Props = {
  icon: IconName
  /** Обязательная подпись действия для скринридера */
  label: string
  onClick?: () => void
  disabled?: boolean
}

/** Кнопка с одной иконкой 44×44: стрелки карусели, пауза ролика */
export function IconButton({ icon, label, onClick, disabled = false }: Props) {
  return (
    <button
      type="button"
      className={styles.button}
      aria-label={label}
      onClick={onClick}
      disabled={disabled}
    >
      <Icon slug={icon} size={24} />
    </button>
  )
}
