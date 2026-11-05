import type { MetadataRoute } from 'next'
import { SITE_URL } from '@/lib/site'

/**
 * /robots.txt. Закрыты только админка и API Payload. Одно исключение:
 * /api/media, оттуда отдаются картинки со страниц. Юридические страницы
 * закрыты метатегом noindex, а не здесь: Disallow запрещает роботу читать
 * страницу, и noindex он тогда не увидит.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: ['/', '/api/media/'],
      disallow: ['/admin', '/api/'],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  }
}
