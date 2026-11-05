'use client'

import { useSyncExternalStore } from 'react'
import Link from 'next/link'
import {
  readCookieConsent,
  serverCookieConsent,
  subscribeCookieConsent,
  writeCookieConsent,
} from '@/lib/cookieConsent'
import { ROUTES } from '@/lib/navigation'
import { Button } from '@/components/ui/Button'
import styles from './CookieConsent.module.css'

export type CookieTexts = {
  version: string
  text: string
  policyLabel: string
  acceptAllLabel: string
  necessaryOnlyLabel: string
}

/** «Гидратация уже прошла?» без записи состояния из эффекта */
const noopSubscribe = () => () => {}
const onClient = () => true
const onServer = () => false

/**
 * Плашка согласия на cookie: снизу слева на десктопе, на всю ширину над
 * StickyCta на телефоне.
 *
 * Показывается, пока посетитель не ответил, и снова, если сменилась версия
 * условий или прошло 12 месяцев. Две кнопки равного размера; до ответа
 * Метрики нет в DOM. Проверка на гидратацию нужна из-за SSG: в готовом HTML
 * согласия нет, и без неё баннер мигал бы у всех, кто уже ответил.
 */
export function CookieConsent({ texts }: { texts: CookieTexts }) {
  const stored = useSyncExternalStore(
    subscribeCookieConsent,
    readCookieConsent,
    serverCookieConsent,
  )
  const hydrated = useSyncExternalStore(noopSubscribe, onClient, onServer)

  const save = (analytics: boolean) =>
    writeCookieConsent({ version: texts.version, analytics, savedAt: Date.now() })

  const answered = stored !== null && stored.version === texts.version

  if (!hydrated || answered) return null

  return (
    <div className={styles.banner} role="region" aria-label="Согласие на cookie">
      <p className={`body-s ${styles.text}`}>
        {texts.text}{' '}
        <Link href={ROUTES.privacy} className={styles.link}>
          {texts.policyLabel}
        </Link>
        .
      </p>
      <div className={styles.actions}>
        <Button variant="secondary" size="S" onClick={() => save(false)}>
          {texts.necessaryOnlyLabel}
        </Button>
        <Button size="S" onClick={() => save(true)}>
          {texts.acceptAllLabel}
        </Button>
      </div>
    </div>
  )
}
