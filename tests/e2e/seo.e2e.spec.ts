import { test, expect } from '@playwright/test'

/** Слэш в конце, 404, sitemap и robots */

const BASE = 'http://localhost:3000'

test.describe('Адреса', () => {
  test('слэш в конце снимается одним 301', async ({ request }) => {
    const res = await request.get(`${BASE}/cases/`, { maxRedirects: 0 })
    expect(res.status()).toBe(301)
    expect(res.headers().location).toMatch(/\/cases$/)
  })
})

test.describe('404', () => {
  test('незнакомый адрес: 404 с нашей страницей', async ({ page }) => {
    const res = await page.goto(`${BASE}/net-takoy-stranicy`)
    expect(res?.status()).toBe(404)
    await expect(page.getByRole('heading', { level: 1, name: 'Страница не найдена' })).toBeVisible()
  })

  test('несуществующий кейс: та же 404', async ({ page }) => {
    const res = await page.goto(`${BASE}/cases/net-takogo-keysa`)
    expect(res?.status()).toBe(404)
  })
})

test.describe('sitemap и robots', () => {
  test('sitemap.xml: только индексируемые адреса', async ({ request }) => {
    const xml = await (await request.get(`${BASE}/sitemap.xml`)).text()
    const locs = [...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map((m) => new URL(m[1]).pathname)

    for (const path of [
      '/',
      '/perehod-s-upp',
      '/vnedrenie-erp',
      '/dorabotka',
      '/soprovozhdenie',
      '/diagnostika',
      '/cases',
      '/about',
    ]) {
      expect(locs).toContain(path)
    }

    expect(locs.filter((p) => /^\/cases\/[^/]+$/.test(p)).length).toBeGreaterThanOrEqual(10)
    expect(locs).not.toContain('/privacy')
    expect(locs).not.toContain('/consent')
  })

  test('robots.txt закрывает админку и ссылается на карту', async ({ request }) => {
    const text = await (await request.get(`${BASE}/robots.txt`)).text()
    expect(text).toContain('Disallow: /admin')
    expect(text).toContain('/sitemap.xml')
  })
})
