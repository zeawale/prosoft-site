import Image from 'next/image'
import type { ImageData } from '@/lib/media'
import styles from './LeadPerson.module.css'

type Props = {
  photo?: ImageData | null
  name: string
  role: string
  quote?: string | null
}

/** Горизонтальная карточка руководителя: на телефоне столбиком с большим фото */
export function LeadPerson({ photo, name, role, quote }: Props) {
  return (
    <article className={styles.card}>
      <div className={styles.photo}>
        {photo && (
          <Image
            className={styles.image}
            src={photo.url}
            alt={photo.alt}
            fill
            sizes="(max-width: 767px) 100vw, 120px"
          />
        )}
      </div>
      <div className={styles.body}>
        <div className={styles.person}>
          <h3 className={`h4 ${styles.name}`}>{name}</h3>
          <p className={`body-s ${styles.role}`}>{role}</p>
        </div>
        {quote && <p className={`body-l ${styles.quote}`}>{quote}</p>}
      </div>
    </article>
  )
}
