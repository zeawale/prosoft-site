'use client'

import { useState, useSyncExternalStore } from 'react'
import { Button } from '@/components/ui/Button'
import {
  allowsAnalytics,
  readCookieConsent,
  serverCookieConsent,
  subscribeCookieConsent,
} from '@/lib/cookieConsent'
import styles from './OfficeMap.module.css'

type Props = {
  url: string
  title: string
  note: string
  buttonLabel: string
  /** Версия согласия из глобала CookieBanner: согласие на прежние условия к новым не относится */
  consentVersion: string
}

/**
 * Карта офиса: виджет Яндекс Карт.
 *
 * Виджет ставит свои cookie, поэтому до согласия его нет в разметке и к Яндексу
 * не уходит ни одного запроса. Карта открывается сама после «Принять все».
 * Иначе показывается заглушка с кнопкой: нажатие разрешает только этот просмотр
 * и в хранилище не пишется.
 */
export function OfficeMap({ url, title, note, buttonLabel, consentVersion }: Props) {
  const consent = useSyncExternalStore(
    subscribeCookieConsent,
    readCookieConsent,
    serverCookieConsent,
  )
  const [opened, setOpened] = useState(false)

  if (opened || allowsAnalytics(consent, consentVersion)) {
    return <iframe className={styles.frame} src={url} title={title} loading="lazy" allowFullScreen />
  }

  return (
    <div className={styles.placeholder}>
      <p className={`body-s ${styles.note}`}>{note}</p>
      <Button variant="secondary" size="M" onClick={() => setOpened(true)}>
        {buttonLabel}
      </Button>
    </div>
  )
}
