'use client'

import { useState } from 'react'
import { PublicationCard } from '@/components/sections/PublicationCard'
import { PublicationModal, type PublicationDetail } from '@/components/sections/PublicationModal'
import { ReviewCard } from '@/components/sections/ReviewCard'
import styles from './ProofSide.module.css'

type Props = {
  review?: { text: string; author: string; role?: string | null } | null
  publication?: PublicationDetail | null
  closeLabel: string
}

/** Колонка рядом с кейсом: отзыв и статья, статья открывается окном как на главной */
export function ProofSide({ review, publication, closeLabel }: Props) {
  const [open, setOpen] = useState(false)

  return (
    <div className={styles.side}>
      {review && (
        <div className={styles.review}>
          <ReviewCard text={review.text} author={review.author} role={review.role} />
        </div>
      )}

      {publication && (
        <>
          <PublicationCard
            source={publication.source}
            title={publication.title}
            author={publication.author}
            compact
            onClick={() => setOpen(true)}
          />
          {open && (
            <PublicationModal
              publication={publication}
              closeLabel={closeLabel}
              onClose={() => setOpen(false)}
            />
          )}
        </>
      )}
    </div>
  )
}
