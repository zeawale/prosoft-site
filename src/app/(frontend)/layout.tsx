import React from 'react'
import type { Metadata } from 'next'
import './styles.css'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { StickyCta } from '@/components/layout/StickyCta'
import { LeadModalProvider } from '@/components/lead/LeadModalProvider'
import { CookieConsent } from '@/components/cookie/CookieConsent'
import { YandexMetrika } from '@/components/analytics/YandexMetrika'
import { OrganizationJsonLd } from '@/components/seo/OrganizationJsonLd'
import { getCookieBanner, getSettings } from '@/lib/queries'
import { SITE_URL } from '@/lib/site'

/**
 * title.template дописывает « | ПРО-СОФТ» к заголовку любой страницы, сами
 * страницы суффикс не пишут. Странице, которой шаблон не нужен (главная),
 * отдаём title.absolute. metadataBase разворачивает относительные адреса в
 * canonical и OpenGraph в абсолютные.
 */
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Внедрение и сопровождение 1С для производства и торговли | ПРО-СОФТ',
    template: '%s | ПРО-СОФТ',
  },
  description:
    'ООО «ПРО-СОФТ», Нижний Новгород. Внедрение 1С:ERP и 1С:КА, переход с 1С:УПП, доработка и сопровождение 1С для компаний от 50 человек. Бесплатная диагностика за 2 дня.',
  openGraph: {
    type: 'website',
    siteName: 'ПРО-СОФТ',
    locale: 'ru_RU',
  },
}

/**
 * Счётчик Метрики через переменную окружения: на машине разработки её нет, и
 * посещения localhost не попадают в статистику сайта.
 */
const YM_ID = Number(process.env.NEXT_PUBLIC_YM_ID) || null

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const [cookie, settings] = await Promise.all([getCookieBanner(), getSettings()])

  return (
    <html lang="ru">
      <head>
        {/* crossOrigin обязателен даже для своего домена: без него запрос
            preload и запрос шрифта считаются разными, и файл качается дважды */}
        <link
          rel="preload"
          href="/fonts/onest-cyrillic-wght-normal.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/fonts/onest-latin-wght-normal.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <OrganizationJsonLd />
      </head>
      <body>
        <LeadModalProvider phone={settings.phone}>
          <Header />
          {children}
          <Footer />
          <StickyCta />

          <CookieConsent
            texts={{
              version: cookie.version,
              text: cookie.text,
              policyLabel: cookie.policyLabel,
              acceptAllLabel: cookie.acceptAllLabel,
              necessaryOnlyLabel: cookie.necessaryOnlyLabel,
            }}
          />

          <YandexMetrika counterId={YM_ID} consentVersion={cookie.version} />
        </LeadModalProvider>
      </body>
    </html>
  )
}
