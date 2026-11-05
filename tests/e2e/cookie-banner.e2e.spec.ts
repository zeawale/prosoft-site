import { test, expect, type Page } from '@playwright/test'
import {
  CONSENT_STORAGE_KEY,
  getConsentVersion,
  presetCookieConsent,
} from '../helpers/cookieConsent'

/**
 * Cookie-баннер: кнопки равного размера, до ответа Метрики нет, новая версия
 * условий и истёкшие 12 месяцев спрашивают заново.
 *
 * Тег Метрики подменяется пустым скриптом: «Принять все» иначе слало бы
 * настоящие хиты. Очередь вызовов `window.ym.a` остаётся, по ней видно, что
 * ушло бы в Метрику.
 */

const BASE = 'http://localhost:3000'
const METRIKA = /mc\.yandex\.ru/

test.beforeEach(async ({ page }) => {
  await page.route(METRIKA, (route) =>
    route.fulfill({ status: 200, contentType: 'application/javascript', body: '' }),
  )
})

const banner = (page: Page) => page.getByRole('region', { name: /cookie/i })

const stored = (page: Page) =>
  page.evaluate((key) => window.localStorage.getItem(key), CONSENT_STORAGE_KEY)

test.describe('Cookie-баннер', () => {
  test('первый визит: баннер виден, кнопки равны по высоте', async ({ page }) => {
    await page.goto(`${BASE}/`)
    const region = banner(page)
    await expect(region).toBeVisible()

    const reject = await region.getByRole('button', { name: 'Только необходимые' }).boundingBox()
    const accept = await region.getByRole('button', { name: 'Принять все' }).boundingBox()
    expect(reject?.height).toBe(accept?.height)
  })

  test('«Принять все» прячет баннер и после перезагрузки', async ({ page }) => {
    await page.goto(`${BASE}/`)
    await banner(page).getByRole('button', { name: 'Принять все' }).click()
    await expect(banner(page)).toBeHidden()
    expect(JSON.parse((await stored(page)) ?? '{}').analytics).toBe(true)

    await page.reload()
    await expect(banner(page)).toBeHidden()
  })

  test('«Только необходимые» прячет баннер, аналитика выключена', async ({ page }) => {
    await page.goto(`${BASE}/`)
    await banner(page).getByRole('button', { name: 'Только необходимые' }).click()
    await expect(banner(page)).toBeHidden()
    expect(JSON.parse((await stored(page)) ?? '{}').analytics).toBe(false)
  })

  test('старая версия условий: спрашивает заново', async ({ page }) => {
    await presetCookieConsent(page, '2000-01-01', { analytics: true })
    await page.goto(`${BASE}/`)
    await expect(banner(page)).toBeVisible()
  })

  test('выбор старше 12 месяцев: спрашивает заново', async ({ page, request }) => {
    const version = await getConsentVersion(request)
    const longAgo = Date.now() - 400 * 24 * 60 * 60 * 1000
    await presetCookieConsent(page, version, { analytics: true, savedAt: longAgo })
    await page.goto(`${BASE}/`)
    await expect(banner(page)).toBeVisible()
  })

  test('баннер не попадает в статический HTML', async ({ request }) => {
    const html = await (await request.get(`${BASE}/`)).text()
    expect(html).not.toContain('Только необходимые</span></button>')
  })
})

test.describe('Метрика под согласие', () => {
  test('до ответа и после отказа к Метрике не уходит ни одного запроса', async ({ page }) => {
    const requests: string[] = []
    page.on('request', (r) => {
      if (METRIKA.test(r.url())) requests.push(r.url())
    })

    await page.goto(`${BASE}/`)
    await banner(page).getByRole('button', { name: 'Только необходимые' }).click()
    await page.reload()
    await page.waitForLoadState('networkidle')

    expect(requests).toEqual([])
  })
})
