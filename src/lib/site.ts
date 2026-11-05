/**
 * Публичный адрес сайта — одно место для всех, кому нужен абсолютный URL:
 * metadataBase в корневом layout, sitemap, robots и сведение доменов в proxy.
 *
 * Берётся из NEXT_PUBLIC_SITE_URL. Фолбэк — про-софт.рф в punycode: на него
 * ведут Карты и 2ГИС, но окончательное решение по домену за Дмитрием.
 *
 * Без завершающего слэша: new URL('/x', SITE_URL) и `${SITE_URL}/x`
 * должны давать одно и то же.
 */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? 'https://xn----0tbbbfiip.xn--p1ai'
).replace(/\/+$/, '')
