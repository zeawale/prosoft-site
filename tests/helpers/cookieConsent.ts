import type { APIRequestContext, Page } from '@playwright/test'

/** Ключ хранилища: тот же, что в src/lib/cookieConsent.ts */
export const CONSENT_STORAGE_KEY = 'prosoft.cookieConsent.v1'

/** Текущая версия условий из CMS, а не константой: её правят в админке */
export async function getConsentVersion(request: APIRequestContext): Promise<string> {
  const res = await request.get('http://localhost:3000/api/globals/cookie-banner')
  const data = (await res.json()) as { version: string }
  return data.version
}

/**
 * Ответить на cookie-баннер заранее, до загрузки страницы. Тестам формы
 * баннер мешает: он лежит поверх низа страницы и перехватывает клики.
 */
export async function presetCookieConsent(
  page: Page,
  version: string,
  choice: { analytics: boolean; savedAt?: number } = { analytics: false },
): Promise<void> {
  await page.addInitScript(
    ([key, value]) => {
      window.localStorage.setItem(key, value)
    },
    [CONSENT_STORAGE_KEY, JSON.stringify({ version, savedAt: Date.now(), ...choice })] as const,
  )
}
