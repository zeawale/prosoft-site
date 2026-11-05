import type { ReactNode } from 'react'
import styles from './SectionShell.module.css'

type Props = {
  children: ReactNode
  /** Тёмная секция: фон на всю ширину, отступы 96 сверху и снизу */
  inverse?: boolean
  id?: string
  /** id заголовка секции */
  labelledBy?: string
  /** Финальный блок диагностики: прячет нижнюю панель */
  noStickyCta?: boolean
}

/**
 * Секция страницы: контент 1312 по центру, между блоками 40. Расстояние между
 * секциями задаёт обёртка страницы (.sectionStack), а не сама секция.
 */
export function SectionShell({ children, inverse = false, id, labelledBy, noStickyCta }: Props) {
  return (
    <section
      id={id}
      aria-labelledby={labelledBy}
      className={inverse ? `inverse ${styles.dark}` : undefined}
      data-no-sticky-cta={noStickyCta || undefined}
    >
      <div className={`wrap ${styles.inner}`}>{children}</div>
    </section>
  )
}
