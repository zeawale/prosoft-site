'use client'

import { LeadButton } from '@/components/lead/LeadButton'
import { useCtaZone, usePastHero } from '@/lib/useScrollState'
import styles from './StickyCta.module.css'

/**
 * Нижняя панель на телефоне: видна после hero, прячется, пока в окне блок с
 * data-no-sticky-cta (финальный блок диагностики и подвал). На десктопе её
 * роль играет компактная шапка.
 */
export function StickyCta() {
  const pastHero = usePastHero()
  const inCtaZone = useCtaZone()
  const visible = pastHero && !inCtaZone

  return (
    <div className={`${styles.bar} ${visible ? styles.visible : ''}`} aria-hidden={!visible}>
      <LeadButton source="sticky-cta" size="M" fill>
        Диагностика за 2 дня
      </LeadButton>
    </div>
  )
}
