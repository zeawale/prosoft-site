'use client'

import { useState } from 'react'
import { IconButton } from '@/components/ui/IconButton'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { ReviewCard } from './ReviewCard'
import styles from './ReviewCarousel.module.css'

export type ReviewItem = {
  id: string | number
  author: string
  role?: string | null
  text: string
  /** Выдержка для карусели, без неё идёт полный текст */
  excerpt?: string | null
}

type Props = {
  title: string
  lead?: string | null
  reviews: ReviewItem[]
  /** Кнопка «Все отзывы»: без подписи только карусель, как на «О компании» */
  allLabel?: string
  collapseLabel?: string
  moreLabel?: string
  lessLabel?: string
}

const PER_PAGE = 3

/**
 * Отзывы: по три карточки, стрелки листают страницы. Последняя страница
 * прижата к концу списка: из семи отзывов это 1–3, 4–6, 5–7.
 * «Все отзывы» разворачивает на месте сетку со всеми карточками.
 */
export function ReviewCarousel({
  title,
  lead,
  reviews,
  allLabel,
  collapseLabel,
  moreLabel,
  lessLabel,
}: Props) {
  const [page, setPage] = useState(0)
  const [showAll, setShowAll] = useState(false)

  const total = reviews.length
  const pages = Math.ceil(total / PER_PAGE)
  const start = Math.max(0, Math.min(page * PER_PAGE, total - PER_PAGE))
  const visible = reviews.slice(start, start + PER_PAGE)

  return (
    <div className={styles.carousel}>
      <div className={styles.head}>
        <SectionHeader title={title} lead={lead} />

        <div className={styles.controls}>
          {allLabel && (
            <button
              type="button"
              className={styles.allLink}
              aria-expanded={showAll}
              onClick={() => setShowAll((value) => !value)}
            >
              <span className={styles.allText}>{showAll ? collapseLabel : allLabel}</span>
            </button>
          )}

          {!showAll && pages > 1 && (
            <>
              <p className={`body-s ${styles.counter}`} aria-live="polite">
                {start + 1}–{start + visible.length} из&nbsp;{total}
              </p>
              <div className={styles.pager}>
                <IconButton
                  icon="arrow-back"
                  label="Предыдущие отзывы"
                  disabled={page === 0}
                  onClick={() => setPage(page - 1)}
                />
                <IconButton
                  icon="arrow-forward"
                  label="Следующие отзывы"
                  disabled={page === pages - 1}
                  onClick={() => setPage(page + 1)}
                />
              </div>
            </>
          )}
        </div>
      </div>

      {showAll ? (
        <div className={styles.all}>
          {reviews.map((review) => (
            <ReviewCard
              key={review.id}
              text={review.text}
              author={review.author}
              role={review.role}
              moreLabel={moreLabel}
              lessLabel={lessLabel}
            />
          ))}
        </div>
      ) : (
        <div key={start} className={styles.cards}>
          {visible.map((review) => (
            <ReviewCard
              key={review.id}
              text={review.excerpt || review.text}
              author={review.author}
              role={review.role}
            />
          ))}
        </div>
      )}
    </div>
  )
}
