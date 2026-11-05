import { Icon } from '@/components/ui/Icon'
import styles from './PublicationCard.module.css'

type Props = {
  /** Издание: РБК, Бизнес стратегии */
  source: string
  title: string
  author: string
  /** С адресом карточка — внешняя ссылка, иначе кнопка */
  href?: string | null
  onClick?: () => void
  /** Низкая карточка рядом с кейсом: заголовок без запаса под четыре строки */
  compact?: boolean
}

/** Карточка статьи: издание, заголовок, автор */
export function PublicationCard({ source, title, author, href, onClick, compact }: Props) {
  const content = (
    <>
      <span className={`label-14 ${styles.source}`}>{source}</span>
      <span className={`h5 ${styles.title}`}>{title}</span>
      <span className={styles.footer}>
        <span className={`body-s ${styles.author}`}>{author}</span>
        <Icon slug="open-in-new" size={20} />
      </span>
    </>
  )

  if (href) {
    return (
      <a
        className={styles.card}
        href={href}
        target="_blank"
        rel="noreferrer"
        data-compact={compact || undefined}
      >
        {content}
      </a>
    )
  }

  return (
    <button
      type="button"
      className={styles.card}
      onClick={onClick}
      data-compact={compact || undefined}
    >
      {content}
    </button>
  )
}
