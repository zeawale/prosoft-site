import Image from 'next/image'
import type { ImageData } from '@/lib/media'
import styles from './TeamCard.module.css'

type Props = {
  photo?: ImageData | null
  name: string
  role: string
  quote?: string | null
}

/** Карточка сотрудника: фото, имя, должность, цитата */
export function TeamCard({ photo, name, role, quote }: Props) {
  return (
    <article className={styles.card}>
      <div className={styles.photo}>
        {photo && (
          <Image
            className={styles.image}
            src={photo.url}
            alt={photo.alt}
            fill
            sizes="(max-width: 767px) 100vw, 416px"
          />
        )}
      </div>
      <div className={styles.person}>
        <h3 className={`h5 ${styles.name}`}>{name}</h3>
        <p className={`body-s ${styles.role}`}>{role}</p>
      </div>
      {quote && <p className={`body-s ${styles.quote}`}>{quote}</p>}
    </article>
  )
}
