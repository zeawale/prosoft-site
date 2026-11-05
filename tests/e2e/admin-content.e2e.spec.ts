import { test, expect, type Page } from '@playwright/test'
import { login } from '../helpers/login'
import { cleanupTestUser, seedTestUser, testUser } from '../helpers/seedUser'

/**
 * Админка открывает каждый глобал и каждую коллекцию: форма с вкладками и
 * связями падает в браузере, а не при сборке, и `tsc` такого не видит.
 */

const BASE = 'http://localhost:3000'

const GLOBALS = [
  'home',
  'upp',
  'erp',
  'dorabotka',
  'support',
  'diagnostics',
  'cases-page',
  'about',
  'settings',
  'cookie-banner',
]

const COLLECTIONS = ['cases', 'publications', 'reviews', 'team', 'leads', 'legal-pages', 'media']

test.describe('Админка: разделы контента', () => {
  test.describe.configure({ mode: 'serial', timeout: 120_000 })

  let page: Page
  const errors: string[] = []

  test.beforeAll(async ({ browser }) => {
    await seedTestUser()
    page = await (await browser.newContext({ viewport: { width: 1440, height: 1000 } })).newPage()
    page.on('pageerror', (e) => errors.push(e.message))
    await login({ page, user: testUser })
  })

  test.afterAll(async () => {
    await cleanupTestUser()
  })

  for (const slug of GLOBALS) {
    test(`глобал ${slug}`, async () => {
      errors.length = 0
      await page.goto(`${BASE}/admin/globals/${slug}`)
      await expect(page.locator('form.document-fields, .document-fields').first()).toBeVisible()
      await expect(page.getByText(/something went wrong|not found/i)).toHaveCount(0)
      expect(errors).toEqual([])
    })
  }

  for (const slug of COLLECTIONS) {
    test(`коллекция ${slug}`, async () => {
      errors.length = 0
      await page.goto(`${BASE}/admin/collections/${slug}`)
      await expect(page.locator('.collection-list, .list-view').first()).toBeVisible()
      expect(errors).toEqual([])
    })
  }

  test('кейс открывается на редактирование', async () => {
    errors.length = 0
    await page.goto(`${BASE}/admin/collections/cases`)
    await page.locator('.cell-title a, td a').first().click()
    await expect(page.locator('.document-fields').first()).toBeVisible()
    expect(errors).toEqual([])
  })
})
