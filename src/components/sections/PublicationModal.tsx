'use client'

import { useId } from 'react'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import type { ImageData } from '@/lib/media'
import { VideoCard } from './VideoCard'
import styles from './PublicationModal.module.css'

export type PublicationDetail = {
  kind: 'video' | 'article'
  title: string
  source: string
  author: string
  detailSource: string
  meta: string
  lead: string
  cover?: ImageData | null
  duration?: string | null
  caption?: string | null
  listTitle?: string | null
  listKind?: 'text' | 'timecodes' | 'dates' | null
  list?: { marker?: string | null; text: string }[] | null
  ctaLabel: string
  url?: string | null
}

type Props = {
  publication: PublicationDetail
  closeLabel: string
  onClose: () => void
}

/**
 * Окно публикации 704 px: заголовок, обложка у видео, описание, список,
 * кнопка на материал. Рендерить вне тёмной секции: окно берёт токены родителя.
 */
export function PublicationModal({ publication, closeLabel, onClose }: Props) {
  const titleId = useId()
  const { list, listKind, url } = publication
  const hasMarkers = listKind === 'timecodes' || listKind === 'dates'
  const listClass = {
    text: styles.listText,
    timecodes: styles.listTimecodes,
    dates: styles.listDates,
  }[listKind ?? 'text']

  return (
    <Modal onClose={onClose} labelledBy={titleId}>
      <div className={styles.detail}>
        <div className={styles.head}>
          <p className={`label-14 ${styles.source}`}>{publication.detailSource}</p>
          <h2 id={titleId} className={`h3 ${styles.title}`}>
            {publication.title}
          </h2>
          <p className={`label-14 ${styles.meta}`}>{publication.meta}</p>
        </div>

        {publication.kind === 'video' && (
          <VideoCard
            size="M"
            source={publication.source}
            title={publication.title}
            speaker={publication.author}
            duration={publication.duration}
            caption={publication.caption}
            cover={publication.cover}
            href={url}
          />
        )}

        <p className={`body-l ${styles.lead}`}>{publication.lead}</p>

        {list && list.length > 0 && (
          <div className={`${styles.block} ${listClass}`}>
            {publication.listTitle && (
              <h3 className={`h4 ${styles.title}`}>{publication.listTitle}</h3>
            )}
            <ul className={styles.list}>
              {list.map((item) => (
                <li key={item.text} className={styles.row}>
                  {hasMarkers && <span className={`number-s ${styles.marker}`}>{item.marker}</span>}
                  <span className={`body-m ${styles.text}`}>{item.text}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className={styles.actions}>
          {url && (
            <Button href={url} external size="M">
              {publication.ctaLabel}
            </Button>
          )}
          <Button variant="ghost" size="M" onClick={onClose}>
            {closeLabel}
          </Button>
        </div>
      </div>
    </Modal>
  )
}
