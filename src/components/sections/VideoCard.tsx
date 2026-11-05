import Image from 'next/image'
import { Icon } from '@/components/ui/Icon'
import type { ImageData } from '@/lib/media'
import styles from './VideoCard.module.css'

type Props = {
  /** Подпись на обложке: Вебинар, Форум */
  source: string
  title: string
  speaker: string
  duration?: string | null
  caption?: string | null
  cover?: ImageData | null
  /** L 400 в ленте, M 284 в окне публикации */
  size?: 'L' | 'M'
  /** С адресом карточка — внешняя ссылка, иначе кнопка */
  href?: string | null
  onClick?: () => void
  /** Титул уже нарисован на обложке: текст только для скринридера */
  hideTitle?: boolean
  /** Высота размера и на телефоне: кадр страницы УПП */
  keepHeight?: boolean
}

/**
 * Карточка видео: обложка с титулом, кнопка воспроизведения, длительность,
 * подпись снизу. Цвета на токенах: на тёмной секции кнопка оранжевая, в окне синяя.
 */
export function VideoCard({
  source,
  title,
  speaker,
  duration,
  caption,
  cover,
  size = 'L',
  href,
  onClick,
  hideTitle = false,
  keepHeight = false,
}: Props) {
  const cardClass = [
    styles.card,
    size === 'M' ? styles.sizeM : styles.sizeL,
    keepHeight && styles.keepHeight,
  ]
    .filter(Boolean)
    .join(' ')
  const content = (
    <>
      <span className={styles.thumb}>
        {cover && (
          <Image
            className={styles.image}
            src={cover.url}
            alt=""
            fill
            sizes="(max-width: 767px) 100vw, 640px"
          />
        )}
        <span className={styles.cover}>
          <span className={`label-13 ${styles.source}`}>{source}</span>
          <span className={hideTitle ? 'sr-only' : `h3 ${styles.title}`}>{title}</span>
        </span>
        <span className={styles.bottom}>
          <span className={styles.speaker}>
            <span className={styles.play}>
              <Icon slug="play" size={24} />
            </span>
            <span className={`label-14 ${styles.speakerName}`}>{speaker}</span>
          </span>
          {duration && <span className={`label-13 ${styles.duration}`}>{duration}</span>}
        </span>
      </span>
      {caption && <span className={`body-s ${styles.caption}`}>{caption}</span>}
    </>
  )

  if (href) {
    return (
      <a className={cardClass} href={href} target="_blank" rel="noreferrer">
        {content}
      </a>
    )
  }

  return (
    <button type="button" className={cardClass} onClick={onClick}>
      {content}
    </button>
  )
}
