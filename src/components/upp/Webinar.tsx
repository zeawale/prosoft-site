import { VideoCard } from '@/components/sections/VideoCard'
import type { ImageData } from '@/lib/media'
import styles from './Webinar.module.css'

type Props = {
  source: string
  title: string
  speaker: string
  duration?: string | null
  caption?: string | null
  cover?: ImageData | null
  /** Адрес записи из коллекции публикаций */
  url?: string | null
  intro: string
  timecodes?: { time: string; label: string }[] | null
}

/** «16:26» в секунды: так Rutube принимает место старта в параметре t */
const toSeconds = (time: string) =>
  time.split(':').reduce((total, part) => total * 60 + Number(part), 0)

const atTime = (url: string, time: string) =>
  `${url}${url.includes('?') ? '&' : '?'}t=${toSeconds(time)}`

/**
 * Запись вебинара и оглавление. На страницу плеер не встраивается: карточка и
 * таймкоды открывают запись в новой вкладке, таймкод с нужного места.
 */
export function Webinar({
  source,
  title,
  speaker,
  duration,
  caption,
  cover,
  url,
  intro,
  timecodes,
}: Props) {
  return (
    <div className={styles.webinar}>
      <VideoCard
        source={source}
        title={title}
        speaker={speaker}
        duration={duration}
        caption={caption}
        cover={cover}
        href={url}
        hideTitle
        keepHeight
      />

      <div className={styles.about}>
        <p className={`body-m ${styles.intro}`}>{intro}</p>
        <ul className={styles.points}>
          {timecodes?.map((item) => {
            const content = (
              <>
                <span className={`number-xs ${styles.time}`}>{item.time}</span>
                <span className={`body-m ${styles.label}`}>{item.label}</span>
              </>
            )
            return (
              <li key={item.time}>
                {url ? (
                  <a
                    className={styles.point}
                    href={atTime(url, item.time)}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {content}
                  </a>
                ) : (
                  <span className={styles.point}>{content}</span>
                )}
              </li>
            )
          })}
        </ul>
      </div>
    </div>
  )
}
