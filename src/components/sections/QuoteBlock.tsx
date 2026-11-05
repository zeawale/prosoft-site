import Image from 'next/image'
import { TextLink } from '@/components/ui/TextLink'
import type { ImageData } from '@/lib/media'
import styles from './QuoteBlock.module.css'

type Props = {
  photo?: ImageData | null
  /** Буквы на подложке, пока фото нет */
  monogram?: string
  quote: string
  name: string
  role: string
  /** Каналы: внешние ссылки, открываются в новой вкладке */
  links?: { label: string; url: string }[] | null
}

/** Блок основателя: портрет 416×520, справа цитата, имя и каналы */
export function QuoteBlock({ photo, monogram, quote, name, role, links }: Props) {
  return (
    <figure className={styles.block}>
      <div className={styles.photo}>
        {photo ? (
          <Image
            className={styles.image}
            src={photo.url}
            alt={photo.alt}
            fill
            sizes="(max-width: 767px) 100vw, 416px"
          />
        ) : (
          <span className={`display-48 ${styles.monogram}`}>{monogram}</span>
        )}
      </div>

      <div className={styles.content}>
        <blockquote className={`h3 ${styles.quote}`}>{quote}</blockquote>
        <figcaption className={styles.author}>
          <span className={`h5 ${styles.name}`}>{name}</span>
          <span className={`body-s ${styles.role}`}>{role}</span>
        </figcaption>
        {links && links.length > 0 && (
          <div className={styles.channels}>
            {links.map((link) => (
              <TextLink key={link.url} href={link.url} external>
                {link.label}
              </TextLink>
            ))}
          </div>
        )}
      </div>
    </figure>
  )
}
