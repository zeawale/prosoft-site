import { test, expect, type Page } from '@playwright/test'
import { getPayload } from 'payload'
import config from '../../src/payload.config.js'
import { getConsentVersion, presetCookieConsent } from '../helpers/cookieConsent'

/**
 * Форма заявки — единственное место, где сайт что-то пишет, поэтому
 * проверяется не только экран, но и база. Компания «Тест e2e» отсекает письма
 * (lib/leadEmail.ts), по ней же тест находит и удаляет свои заявки.
 */

const BASE = 'http://localhost:3000'
const COMPANY = 'Тест e2e'

async function findLeads() {
  const payload = await getPayload({ config })
  const { docs } = await payload.find({
    collection: 'leads',
    where: { company: { equals: COMPANY } },
    overrideAccess: true,
  })
  return docs
}

async function cleanupLeads() {
  const payload = await getPayload({ config })
  await payload.delete({
    collection: 'leads',
    where: { company: { equals: COMPANY } },
    overrideAccess: true,
  })
}

/** Открыть форму «Оставить заявку» кнопкой в шапке */
async function openForm(page: Page, path = '/') {
  await page.goto(`${BASE}${path}`)
  await page.getByRole('banner').getByRole('button', { name: 'Оставить заявку' }).click()
  const dialog = page.getByRole('dialog')
  await expect(dialog).toBeVisible()
  return dialog
}

const SUBMIT = 'Отправить заявку'

async function fill(dialog: ReturnType<Page['getByRole']>, name = 'Тест Тестович') {
  await dialog.getByLabel('Имя').fill(name)
  await dialog.getByLabel('Телефон').fill('9991234567')
  await dialog.getByLabel('Компания').fill(COMPANY)
}

test.describe('Форма заявки', () => {
  test.beforeEach(async ({ page, request }) => {
    await presetCookieConsent(page, await getConsentVersion(request))
  })

  test.afterAll(async () => {
    await cleanupLeads()
  })

  test('телефон приводится к маске', async ({ page }) => {
    const dialog = await openForm(page)
    const phone = dialog.getByLabel('Телефон')
    await phone.fill('89991234567')
    await expect(phone).toHaveValue('+7 999 123-45-67')
  })

  test('незаполненная форма: ошибка только у телефона и согласия, заявка не создаётся', async ({
    page,
  }) => {
    const dialog = await openForm(page)

    await dialog.getByLabel('Телефон').fill('999123')
    await dialog.getByRole('button', { name: SUBMIT }).click()

    await expect(dialog.getByText(/В номере 10 цифр после \+7, сейчас 6/)).toBeVisible()
    await expect(dialog.getByText(/Без согласия не сможем принять заявку/)).toBeVisible()
    // Имя и компания необязательны
    await expect(dialog.getByText('Напишите, как к вам обращаться')).toHaveCount(0)
    await expect(dialog.getByText('Напишите название компании')).toHaveCount(0)

    expect(await findLeads()).toHaveLength(0)
  })

  test('заявка уходит и ложится в Leads с источником и согласием', async ({ page }) => {
    const dialog = await openForm(page)

    await fill(dialog)
    await dialog.getByLabel('Комментарий, необязательно').fill('Автотест формы заявки')
    await dialog.getByLabel(/обработку персональных данных/i).check()
    await dialog.getByRole('button', { name: SUBMIT }).click()

    await expect(dialog.getByText('Заявка принята')).toBeVisible()

    const leads = await findLeads()
    expect(leads).toHaveLength(1)
    const lead = leads[0]
    expect(lead.name).toBe('Тест Тестович')
    expect(lead.phone).toBe('+7 999 123-45-67')
    expect(lead.comment).toBe('Автотест формы заявки')
    expect(lead.status).toBe('new')
    expect(lead.page).toBe('header')
    expect(lead.consentAt).toBeTruthy()
    expect(lead.consentVersion).toBeTruthy()

    await dialog.getByRole('button', { name: 'Вернуться на страницу' }).click()
    await expect(dialog).toBeHidden()
  })

  test('с согласием на аналитику отправка достигает цели Метрики', async ({ page, request }) => {
    await page.route(/mc\.yandex\.ru/, (route) =>
      route.fulfill({ status: 200, contentType: 'application/javascript', body: '' }),
    )
    await presetCookieConsent(page, await getConsentVersion(request), { analytics: true })
    const dialog = await openForm(page)

    await fill(dialog, 'Тест Метрики')
    await dialog.getByLabel(/обработку персональных данных/i).check()
    await dialog.getByRole('button', { name: SUBMIT }).click()
    await expect(dialog.getByText('Заявка принята')).toBeVisible()

    const goals = await page.evaluate(() => {
      const ym = (window as unknown as { ym?: { a?: unknown[][] } }).ym
      return (ym?.a ?? []).map((args) => Array.from(args)).filter((c) => c[1] === 'reachGoal')
    })
    expect(goals.map((c) => c[2])).toEqual(['lead_sent'])
  })

  test('хватает одного телефона: заявка без имени и компании', async ({ page }) => {
    const dialog = await openForm(page)

    await dialog.getByLabel('Телефон').fill('9997654321')
    await dialog.getByLabel('Комментарий, необязательно').fill(COMPANY)
    await dialog.getByLabel(/обработку персональных данных/i).check()
    await dialog.getByRole('button', { name: SUBMIT }).click()
    await expect(dialog.getByText('Заявка принята')).toBeVisible()

    const payload = await getPayload({ config })
    const { docs } = await payload.find({
      collection: 'leads',
      where: { comment: { equals: COMPANY } },
      overrideAccess: true,
    })
    expect(docs).toHaveLength(1)
    expect(docs[0].phone).toBe('+7 999 765-43-21')
    expect(docs[0].name ?? null).toBeNull()
    await payload.delete({
      collection: 'leads',
      where: { comment: { equals: COMPANY } },
      overrideAccess: true,
    })
  })

  test('кнопка первого экрана услуги подставляет комментарий страницы', async ({ page }) => {
    await page.goto(`${BASE}/soprovozhdenie`)
    await page.getByRole('main').getByRole('button', { name: 'Оставить заявку' }).first().click()
    const dialog = page.getByRole('dialog')
    await expect(dialog.getByText('Оставить заявку').first()).toBeVisible()
    await expect(dialog.getByLabel('Комментарий, необязательно')).toHaveValue(/сопровождение 1С/)
  })

  test('шапка на странице услуги берёт тот же комментарий', async ({ page }) => {
    const dialog = await openForm(page, '/perehod-s-upp')
    await expect(dialog.getByLabel('Комментарий, необязательно')).toHaveValue(/1С:УПП/)
  })

  test('мессенджеры: Telegram получает текст из формы, MAX — ссылку на профиль', async ({
    page,
  }) => {
    const dialog = await openForm(page)
    await dialog.getByLabel('Имя').fill('Тест Мессенджера')
    await dialog.getByLabel('Телефон').fill('9991234567')

    const telegram = dialog.getByRole('link', { name: 'Отправить сообщение в Telegram' })
    const href = await telegram.getAttribute('href')
    expect(href).toMatch(/^https:\/\/t\.me\/[^?]+\?text=/)
    const text = decodeURIComponent(href!.split('text=')[1])
    expect(text).toContain('Имя: Тест Мессенджера')
    expect(text).toContain('Телефон: +7 999 123-45-67')

    const max = dialog.getByRole('link', { name: 'Отправить сообщение в MAX' })
    expect(await max.getAttribute('href')).toMatch(/^https:\/\/max\.ru\/u\//)
  })

  test('Escape и клик по фону закрывают форму', async ({ page }) => {
    let dialog = await openForm(page)
    await page.keyboard.press('Escape')
    await expect(dialog).toBeHidden()

    dialog = await openForm(page)
    await page.mouse.click(5, 5)
    await expect(dialog).toBeHidden()
  })

  test('фокус заперт внутри формы', async ({ page }) => {
    const dialog = await openForm(page)
    await dialog.getByRole('button', { name: 'Закрыть' }).focus()
    await page.keyboard.press('Shift+Tab')
    const inside = await page.evaluate(
      () => document.activeElement?.closest('[role="dialog"]') !== null,
    )
    expect(inside).toBe(true)
  })
})
