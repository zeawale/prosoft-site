import type { ReactNode } from 'react'
import styles from './SectionHeader.module.css'

type Props = {
  title: string
  lead?: string | null
  /** Подпись над заголовком, Label/14 */
  caption?: string | null
  /** Ссылка справа, выравнивание по нижнему краю */
  action?: ReactNode
  /** Уровень заголовка: на странице один h1 */
  as?: 'h2' | 'h3'
  id?: string
  className?: string
}

/** Заголовок секции: подпись, H2, лид Body/L до 640 px, ссылка справа */
export function SectionHeader({
  title,
  lead,
  caption,
  action,
  as: Heading = 'h2',
  id,
  className,
}: Props) {
  return (
    <div className={[styles.header, className].filter(Boolean).join(' ')}>
      <div className={styles.head}>
        {caption && <p className={`label-14 ${styles.caption}`}>{caption}</p>}
        <Heading id={id} className={`h2 ${styles.title}`}>
          {title}
        </Heading>
        {lead && <p className={`body-l ${styles.lead}`}>{lead}</p>}
      </div>
      {action && <div className={styles.action}>{action}</div>}
    </div>
  )
}
