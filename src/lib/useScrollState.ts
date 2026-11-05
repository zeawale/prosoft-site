'use client'

import { useSyncExternalStore } from 'react'

const subscribe = (onChange: () => void) => {
  window.addEventListener('scroll', onChange, { passive: true })
  window.addEventListener('resize', onChange)
  return () => {
    window.removeEventListener('scroll', onChange)
    window.removeEventListener('resize', onChange)
  }
}

/** Страница ушла ниже hero. Hero помечен data-hero; нет его — порог 120 px */
const isPastHero = () => {
  const hero = document.querySelector('[data-hero]')
  return hero ? hero.getBoundingClientRect().bottom <= 0 : window.scrollY > 120
}

/** В окне блок, при котором нижняя панель не нужна: подвал или data-no-sticky-cta */
const isCtaZone = () =>
  Array.from(document.querySelectorAll('[data-no-sticky-cta]')).some((el) => {
    const { top, bottom } = el.getBoundingClientRect()
    return top < window.innerHeight && bottom > 0
  })

const never = () => false

export const usePastHero = () => useSyncExternalStore(subscribe, isPastHero, never)
export const useCtaZone = () => useSyncExternalStore(subscribe, isCtaZone, never)
