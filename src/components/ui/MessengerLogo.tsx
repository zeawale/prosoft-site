'use client'

import { useId } from 'react'
import type { Messenger } from '@/lib/messenger'

/** Знак Telegram из Simple Icons: круг с самолётиком-вырезом */
const TELEGRAM =
  'M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12a12 12 0 0 0 12-12A12 12 0 0 0 12 0zm4.962 7.224c.1-.002.321.023.465.14a.5.5 0 0 1 .171.325c.016.093.036.306.02.472c-.18 1.898-.962 6.502-1.36 8.627c-.168.9-.499 1.201-.82 1.23c-.696.065-1.225-.46-1.9-.902c-1.056-.693-1.653-1.124-2.678-1.8c-1.185-.78-.417-1.21.258-1.91c.177-.184 3.247-2.977 3.307-3.23c.007-.032.014-.15-.056-.212s-.174-.041-.249-.024q-.159.037-5.061 3.345q-.72.495-1.302.48c-.428-.008-1.252-.241-1.865-.44c-.752-.245-1.349-.374-1.297-.789q.04-.324.893-.663q5.247-2.286 6.998-3.014c3.332-1.386 4.025-1.627 4.476-1.635'

/** Знак MAX: контур облачка из иконки max.ru (favicon.svg), viewBox 100 */
const MAX =
  'M50.7571 0.261719C78.2929 0.261719 99.8857 22.5974 99.8857 50.1474C99.8857 77.6974 77.6071 99.4903 51.0214 99.4903C41.5857 99.4903 37.0143 98.1617 29.65 92.9474C29.1429 92.5903 28.45 92.6831 28.0214 93.1403C22.3571 99.1831 7.85 103.426 7.18571 95.176C7.18571 80.7903 0 71.4474 0 49.876C0 21.5546 23.2214 0.261719 50.7571 0.261719ZM51.5286 24.8117C38.4643 24.126 28.2643 33.1974 26.0143 47.3831C24.15 59.1332 27.45 73.4546 30.2786 74.176C31.4786 74.4832 34.3571 72.276 36.4571 70.2974C36.85 69.926 37.45 69.8617 37.9071 70.1474C41.1786 72.1474 44.8786 73.6474 48.9571 73.8617C62.3714 74.5617 74.2571 64.0617 74.9643 50.6474C75.6643 37.2331 64.9429 25.5046 51.5286 24.8046V24.8117Z'

type Props = {
  name: Messenger
  size?: number
  /** brand — цвета бренда (шапка), current — цвет текста (подвал, кнопки формы) */
  tone?: 'brand' | 'current'
}

/**
 * Знаки мессенджеров. Клиентский из-за useId: градиент MAX ссылается на свой
 * id, а одинаковые id в шапке и мобильном меню ломают заливку, если первый
 * лежит в скрытом блоке.
 */
export function MessengerLogo({ name, size = 28, tone = 'current' }: Props) {
  // Двоеточия и кавычки-ёлочки из useId в url(#…) лишние: оставляем буквы и цифры
  const gradientId = `max-${useId().replace(/[^a-zA-Z0-9_-]/g, '')}`

  if (name === 'telegram') {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path
          style={{ fill: tone === 'brand' ? 'var(--brand-telegram-mark)' : 'currentColor' }}
          d={TELEGRAM}
        />
      </svg>
    )
  }

  return (
    <svg width={size} height={size} viewBox="0 0 100 100" aria-hidden="true" focusable="false">
      {tone === 'brand' && (
        <defs>
          <linearGradient
            id={gradientId}
            x1="0"
            y1="100"
            x2="100"
            y2="0"
            gradientUnits="userSpaceOnUse"
          >
            {/* var() через style: в атрибутах SVG его понимают не все браузеры */}
            <stop offset="0" style={{ stopColor: 'var(--brand-max-from)' }} />
            <stop offset="0.5" style={{ stopColor: 'var(--brand-max-via)' }} />
            <stop offset="1" style={{ stopColor: 'var(--brand-max-to)' }} />
          </linearGradient>
        </defs>
      )}
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        style={{ fill: tone === 'brand' ? `url(#${gradientId})` : 'currentColor' }}
        d={MAX}
      />
    </svg>
  )
}
