'use client'

import { useCallback, useState } from 'react'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { SectionShell } from '@/components/sections/SectionShell'
import { VideoCard } from '@/components/sections/VideoCard'
import { PublicationCard } from '@/components/sections/PublicationCard'
import { PublicationModal, type PublicationDetail } from '@/components/sections/PublicationModal'
import styles from './Publications.module.css'

type Item = PublicationDetail & { id: string | number }

type Props = {
  title: string
  lead?: string | null
  talksTitle: string
  articlesTitle: string
  closeLabel: string
  publications: Item[]
}

/** Блок «Публикации и выступления»: карточки открывают окно с подробностями */
export function Publications({
  title,
  lead,
  talksTitle,
  articlesTitle,
  closeLabel,
  publications,
}: Props) {
  const [active, setActive] = useState<Item | null>(null)
  const close = useCallback(() => setActive(null), [])

  const videos = publications.filter((item) => item.kind === 'video')
  const articles = publications.filter((item) => item.kind === 'article')

  return (
    <>
      <SectionShell inverse>
        <SectionHeader title={title} lead={lead} />

        <div className={styles.featured}>
          <div className={styles.group}>
            <h3 className={`h4 ${styles.groupTitle}`}>{talksTitle}</h3>
            <div className={styles.videos}>
              {videos.map((item) => (
                <VideoCard
                  key={item.id}
                  source={item.source}
                  title={item.title}
                  speaker={item.author}
                  duration={item.duration}
                  caption={item.caption}
                  cover={item.cover}
                  onClick={() => setActive(item)}
                />
              ))}
            </div>
          </div>

          <div className={styles.group}>
            <h3 className={`h4 ${styles.groupTitle}`}>{articlesTitle}</h3>
            <div className={styles.articles}>
              {articles.map((item) => (
                <PublicationCard
                  key={item.id}
                  source={item.source}
                  title={item.title}
                  author={item.author}
                  onClick={() => setActive(item)}
                />
              ))}
            </div>
          </div>
        </div>
      </SectionShell>

      {active && <PublicationModal publication={active} closeLabel={closeLabel} onClose={close} />}
    </>
  )
}
