'use client'

import { Fragment, useSyncExternalStore } from 'react'
import { TextLink } from '@/components/ui/TextLink'
import { ROUTES } from '@/lib/navigation'
import styles from './DateStrip.module.css'

type Props = {
  label: string
  mainDate: string
  mainTitle: string
  source?: string | null
  rows?: { date: string; text: string }[] | null
  linkLabel?: string | null
  linkRoute?: keyof typeof ROUTES | null
  /** Адрес вместо linkRoute: на странице УПП ссылка ведёт к блоку на этой же странице */
  linkHref?: string
  todayLabel?: string | null
  /** Список на телефоне: startsOn — календарная дата пункта */
  timeline?: { startsOn: string; date: string; text: string }[] | null
}

const subscribe = () => () => {}

/** Конец сегодняшнего дня: значение не меняется между рендерами одного дня */
const getToday = () => new Date().setHours(23, 59, 59, 999)

/**
 * Полоса дат поддержки 1С:УПП. Десктоп — плашка с крупной датой, телефон —
 * список с отметкой «Сегодня». Отметка ставится на клиенте: страница кешируется,
 * и дата сборки здесь не годится. До гидратации и без JS отметка стоит первой.
 */
export function DateStrip({
  label,
  mainDate,
  mainTitle,
  source,
  rows,
  linkLabel,
  linkRoute,
  linkHref,
  todayLabel,
  timeline,
}: Props) {
  const now = useSyncExternalStore(subscribe, getToday, () => null)

  const dates = timeline ?? []
  const passed = now === null ? 0 : dates.filter((d) => Date.parse(d.startsOn) <= now).length
  const href = linkHref ?? (linkRoute && ROUTES[linkRoute])
  const link = linkLabel && href && <TextLink href={href}>{linkLabel}</TextLink>
  const today = (
    <li className={styles.todayRow}>
      <span className={styles.tick} />
      <span className={`label-13 ${styles.today}`}>{todayLabel}</span>
    </li>
  )

  return (
    <div>
      <div className={`wrap ${styles.desktop}`}>
        <div className={styles.box}>
          <div className={styles.main}>
            <p className={`label-16 ${styles.label}`}>{label}</p>
            <p className={`number-l ${styles.mainDate}`}>{mainDate}</p>
            <p className={`h4 ${styles.mainTitle}`}>{mainTitle}</p>
            {source && <p className={`body-s ${styles.source}`}>{source}</p>}
          </div>

          <div className={styles.next}>
            {rows?.map((row) => (
              <div key={row.date} className={styles.row}>
                <p className={`body-l ${styles.rowDate}`}>{row.date}</p>
                <p className={`body-s ${styles.rowText}`}>{row.text}</p>
              </div>
            ))}
            {link}
          </div>
        </div>
      </div>

      <div className={styles.mobile}>
        <p className={`h5 ${styles.mobileTitle}`}>{label}</p>
        <ol className={styles.timeline}>
          {passed === 0 && today}
          {dates.map((item, index) => {
            const isPassed = index < passed
            return (
              <Fragment key={item.startsOn}>
                <li className={styles.dateRow} data-passed={isPassed || undefined}>
                  <span className={styles.marker} />
                  <span className={styles.dateLabel}>
                    <span className={`number-s ${styles.date}`}>{item.date}</span>
                    <span className={`body-s ${styles.dateText}`}>{item.text}</span>
                  </span>
                </li>
                {index + 1 === passed && today}
              </Fragment>
            )
          })}
        </ol>
        {link}
      </div>
    </div>
  )
}
