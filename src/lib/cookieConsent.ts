/**
 * Согласие на cookie — общее хранилище для баннера и Метрики.
 *
 * Почему localStorage, а не cookie. Страницы статические (SSG), сервер при
 * отдаче ничего про посетителя не знает и знать не может — решение всё
 * равно принимается на клиенте после гидратации. Cookie понадобится, если
 * появится серверная логика, зависящая от согласия.
 *
 * Почему своё событие. `storage` браузер шлёт только в СОСЕДНИЕ вкладки:
 * вкладка, которая сама записала значение, его не получит. Подписаны оба,
 * чтобы блоки переключались и в своей вкладке, и в чужой.
 *
 * Категория «необходимые» здесь не хранится: она включена всегда и
 * отключить её нельзя. Вторая категория одна на аналитику и карту Яндекса на
 * «О компании»: в баннере две кнопки, «Принять все» разрешает обе.
 *
 * Выбор живёт 12 месяцев, потом баннер спрашивает снова.
 */
export type CookieConsent = {
  /** Версия условий, на которые согласились. Меняется — спрашиваем заново */
  version: string
  analytics: boolean
  /** Когда ответили, мс от эпохи */
  savedAt: number
}

const STORAGE_KEY = 'prosoft.cookieConsent.v1'
const CHANGE_EVENT = 'prosoft:cookie-consent'
const MAX_AGE_MS = 365 * 24 * 60 * 60 * 1000

/**
 * Снимок кешируется по сырой строке из хранилища.
 *
 * Это обязательное условие useSyncExternalStore: он сравнивает снимки по
 * ссылке и уходит в бесконечную перерисовку, если каждый вызов возвращает
 * свежий объект. Пока строка в localStorage та же — отдаём тот же объект.
 */
let cachedRaw: string | null = null
let cachedValue: CookieConsent | null = null

function parse(raw: string | null): CookieConsent | null {
  if (!raw) return null

  try {
    const data: unknown = JSON.parse(raw)
    if (typeof data !== 'object' || data === null) return null

    const { version, analytics, savedAt } = data as Record<string, unknown>
    if (typeof version !== 'string' || typeof savedAt !== 'number') return null
    if (Date.now() - savedAt > MAX_AGE_MS) return null

    return { version, analytics: analytics === true, savedAt }
  } catch {
    /* Чужая или испорченная запись под нашим ключом — считаем, что
       согласия нет, и спрашиваем заново */
    return null
  }
}

export function readCookieConsent(): CookieConsent | null {
  if (typeof window === 'undefined') return null

  let raw: string | null = null
  try {
    raw = window.localStorage.getItem(STORAGE_KEY)
  } catch {
    /* Приватный режим и «блокировать данные сайтов» роняют сам доступ к
       localStorage, а не возвращают null. Нет доступа — нет согласия */
    return null
  }

  if (raw === cachedRaw) return cachedValue

  cachedRaw = raw
  cachedValue = parse(raw)
  return cachedValue
}

export function writeCookieConsent(value: CookieConsent): void {
  if (typeof window === 'undefined') return

  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(value))
  } catch {
    /* Записать не вышло — решение живёт до перезагрузки, баннер спросит
       снова. Это лучше, чем уронить страницу на отказе хранилища */
  }

  window.dispatchEvent(new Event(CHANGE_EVENT))
}

export function subscribeCookieConsent(onChange: () => void): () => void {
  window.addEventListener(CHANGE_EVENT, onChange)
  window.addEventListener('storage', onChange)

  return () => {
    window.removeEventListener(CHANGE_EVENT, onChange)
    window.removeEventListener('storage', onChange)
  }
}

/**
 * Снимок для сервера и для первого прохода гидратации: на этапе сборки
 * согласия нет и быть не может.
 */
export const serverCookieConsent = (): CookieConsent | null => null

/** Разрешена ли аналитика с учётом устаревшей версии согласия */
export function allowsAnalytics(consent: CookieConsent | null, currentVersion: string): boolean {
  if (!consent) return false
  if (consent.version !== currentVersion) return false
  return consent.analytics
}
