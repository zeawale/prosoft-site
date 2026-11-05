import { NextResponse, type NextRequest } from 'next/server'
import { SITE_URL } from '@/lib/site'

/**
 * Единственное место, где сайт отвечает редиректами.
 *
 * Правило одно: любой кривой адрес приводится к каноническому ОДНИМ
 * переходом. Протокол, домен и слэш считаются вместе, а не по очереди, иначе
 * собирается цепочка, которую поисковики переваривают плохо. Отсюда же
 * skipTrailingSlashRedirect в next.config: иначе Next снимал бы слэш своим
 * 308 до proxy.
 *
 * Сведение только для боевого домена: localhost и стенды не трогаем, иначе
 * локальная разработка улетала бы на прод. Второй домен компании сводится
 * на основной в nginx (deploy/nginx).
 *
 * 301, а не 308: здесь только GET, а 301 понимают все панели вебмастеров.
 */

const canonical = new URL(SITE_URL)
/** Вариант адреса с www или без него, с которого сводим на канонический */
const twinHost = canonical.host.startsWith('www.')
  ? canonical.host.slice(4)
  : `www.${canonical.host}`

export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl
  const host = request.headers.get('x-forwarded-host') ?? request.headers.get('host') ?? ''
  const proto =
    request.headers.get('x-forwarded-proto') ?? request.nextUrl.protocol.replace(':', '')

  const isProdHost = host === canonical.host || host === twinHost
  const wrongHost = isProdHost && host !== canonical.host
  const wrongProto = isProdHost && proto !== canonical.protocol.replace(':', '')
  const trailingSlash = pathname.length > 1 && pathname.endsWith('/')

  if (!wrongHost && !wrongProto && !trailingSlash) {
    return NextResponse.next()
  }

  const path = trailingSlash ? pathname.replace(/\/+$/, '') : pathname
  const target = new URL(path, isProdHost ? canonical : request.nextUrl)
  target.search = search

  return NextResponse.redirect(target, 301)
}

export const config = {
  matcher: [
    /* Всё, кроме API и админки Payload, сборки Next, картинок next/image и
       любых путей с расширением файла */
    '/((?!api|admin|_next/static|_next/image|.*\\..*).*)',
  ],
}
