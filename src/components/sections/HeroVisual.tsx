'use client'

import { useEffect, useRef, useState } from 'react'
import { IconButton } from '@/components/ui/IconButton'
import styles from './HeroVisual.module.css'

/** Комплекты в public/hero: <имя>.webm|mp4|webp и <имя>-mobile.webm|mp4|webp */
export type HeroName =
  'home' | 'upp' | 'erp' | 'dorabotka' | 'support' | 'diagnostics' | 'not-found'

const MOBILE = '(max-width: 767px)'
const REDUCED_MOTION = '(prefers-reduced-motion: reduce)'

/**
 * Фон первого экрана: постер и зацикленный ролик поверх него.
 *
 * Постер — обычный <picture>, он и LCP, и всё, что есть без JS. Ролик
 * подключается уже на клиенте: какой файл брать, решает matchMedia, потому что
 * <source media> внутри <video> браузеры понимают по-разному, а качать оба
 * нельзя. При prefers-reduced-motion ролик не грузится вовсе. Не загрузился —
 * остаётся постер. Кнопка паузы есть только у живого ролика.
 */
export function HeroVisual({ name }: { name: HeroName }) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [file, setFile] = useState<string | null>(null)
  const [ready, setReady] = useState(false)
  const [paused, setPaused] = useState(false)

  useEffect(() => {
    const mobile = window.matchMedia(MOBILE)
    const reduced = window.matchMedia(REDUCED_MOTION)

    const choose = () => {
      setReady(false)
      setPaused(false)
      setFile(reduced.matches ? null : mobile.matches ? `${name}-mobile` : name)
    }

    choose()
    mobile.addEventListener('change', choose)
    reduced.addEventListener('change', choose)
    return () => {
      mobile.removeEventListener('change', choose)
      reduced.removeEventListener('change', choose)
    }
  }, [name])

  const toggle = () => {
    const video = videoRef.current
    if (!video) return
    if (video.paused) void video.play()
    else video.pause()
  }

  return (
    <div className={styles.visual}>
      <picture>
        <source media={MOBILE} srcSet={`/hero/${name}-mobile.webp`} width={750} height={1180} />
        <img
          className={styles.media}
          src={`/hero/${name}.webp`}
          alt=""
          width={2400}
          height={1200}
          fetchPriority="high"
        />
      </picture>

      {file && (
        <video
          key={file}
          ref={videoRef}
          className={styles.video}
          data-ready={ready || undefined}
          autoPlay
          muted
          loop
          playsInline
          poster={`/hero/${file}.webp`}
          aria-hidden="true"
          onLoadedData={() => setReady(true)}
          onPlay={() => setPaused(false)}
          onPause={() => setPaused(true)}
          onError={() => setFile(null)}
        >
          <source src={`/hero/${file}.webm`} type="video/webm" />
          {/* Ошибка последнего source — единственный сигнал, что не подошёл ни один файл */}
          <source src={`/hero/${file}.mp4`} type="video/mp4" onError={() => setFile(null)} />
        </video>
      )}

      {file && ready && (
        <div className={styles.pause}>
          <IconButton
            icon={paused ? 'play' : 'pause'}
            label={paused ? 'Запустить видео' : 'Остановить видео'}
            onClick={toggle}
          />
        </div>
      )}
    </div>
  )
}
