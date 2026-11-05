import type { Metadata } from 'next'
import { LeadButton } from '@/components/lead/LeadButton'
import { DiagnosticsOffer } from '@/components/sections/DiagnosticsOffer'
import { PageHero } from '@/components/sections/PageHero'
import { Button } from '@/components/ui/Button'
import { TextLink } from '@/components/ui/TextLink'
import { ROUTES, serviceNav } from '@/lib/navigation'
import { getPageGlobal } from '@/lib/queries'
import styles from './not-found.module.css'

/**
 * Страница 404: notFound() из любой страницы группы и любой чужой адрес, его
 * ловит [...rest]/page.tsx. Тексты здесь, а не в CMS: страница не контентная,
 * редактор сюда не полезет.
 */
export const metadata: Metadata = {
  title: 'Страница не найдена',
  robots: { index: false, follow: true },
}

/** Порядок как в кадре 188:5431: переход с УПП первым, в serviceNav он второй */
const DIRECTIONS = [ROUTES.upp, ROUTES.erp, ROUTES.dorabotka, ROUTES.support].flatMap((href) =>
  serviceNav.filter((item) => item.href === href),
)

export default async function NotFound() {
  const { diagnostics } = await getPageGlobal('home')

  return (
    <main className={styles.page}>
      <PageHero
        visual="not-found"
        titleStyle="h1"
        title={'Страница не\u00a0найдена'}
        lead={
          'Такой страницы на\u00a0сайте нет. Перейдите на\u00a0главную или выберите направление.'
        }
        actions={
          <>
            <Button href={ROUTES.home}>{'На\u00a0главную'}</Button>
            <LeadButton source="not-found-hero" variant="secondary">
              Получить диагностику
            </LeadButton>
          </>
        }
        links={
          <ul className={styles.directions}>
            {DIRECTIONS.map((item) => (
              <li key={item.href}>
                <TextLink href={item.href}>{item.title}</TextLink>
              </li>
            ))}
          </ul>
        }
      />

      <DiagnosticsOffer {...diagnostics} source="not-found" />
    </main>
  )
}
