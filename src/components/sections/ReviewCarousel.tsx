'use client'

import { useState, useSyncExternalStore, type CSSProperties } from 'react'
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

/** Та же ширина, что в модуле стилей: ниже неё карточка одна */
const NARROW = '(max-width: 999px)'

const subscribe = (onChange: () => void) => {
  const query = window.matchMedia(NARROW)
  query.addEventListener('change', onChange)
  return () => query.removeEventListener('change', onChange)
}

const getPerView = () => (window.matchMedia(NARROW).matches ? 1 : 3)
const getServerPerView = () => 3

/**
 * Отзывы: стрелки сдвигают ленту на одну карточку, то есть 1–3, 2–4 и дальше.
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
  const perView = useSyncExternalStore(subscribe, getPerView, getServerPerView)
  const [position, setPosition] = useState(0)
  const [showAll, setShowAll] = useState(false)

  const last = Math.max(0, reviews.length - perView)
  const index = Math.min(position, last)

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

          {!showAll && last > 0 && (
            <div className={styles.pager}>
              <IconButton
                icon="arrow-back"
                label="Предыдущий отзыв"
                disabled={index === 0}
                onClick={() => setPosition(index - 1)}
              />
              <IconButton
                icon="arrow-forward"
                label="Следующий отзыв"
                disabled={index === last}
                onClick={() => setPosition(index + 1)}
              />
            </div>
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
        <div className={styles.viewport}>
          <div className={styles.track} style={{ '--index': index } as CSSProperties}>
            {reviews.map((review, i) => (
              <div
                key={review.id}
                className={styles.slide}
                aria-hidden={i < index || i >= index + perView}
              >
                <ReviewCard
                  text={review.excerpt || review.text}
                  author={review.author}
                  role={review.role}
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
