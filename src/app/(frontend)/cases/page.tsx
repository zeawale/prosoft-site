import type { Metadata } from 'next'
import { CasesCatalog } from '@/components/cases/CasesCatalog'
import { PageHead } from '@/components/cases/PageHead'
import { ROUTES } from '@/lib/navigation'
import { getPageGlobal } from '@/lib/queries'
import { getCatalogCases } from './queries'
import styles from './page.module.css'

export async function generateMetadata(): Promise<Metadata> {
  const { seo } = await getPageGlobal('cases-page')
  return {
    title: seo.metaTitle,
    description: seo.metaDescription,
    alternates: { canonical: ROUTES.cases },
  }
}

export default async function CasesPage() {
  const [page, cases] = await Promise.all([
    getPageGlobal('cases-page', ['hero', 'filters', 'results', 'card']),
    getCatalogCases(),
  ])

  // depth 1 разворачивает связь в документ, карточкам нужен только id
  const groups = (page.filters.enabled ? (page.filters.groups ?? []) : []).map((group) => ({
    key: group.key,
    label: group.label,
    options: (group.options ?? []).map((option) => ({
      value: option.value,
      label: option.label,
      caseIds: (option.cases ?? []).map((item) => (typeof item === 'object' ? item.id : item)),
    })),
  }))

  return (
    <main className={styles.page}>
      <div className={`wrap ${styles.catalog}`}>
        <PageHead
          crumbs={[{ label: page.hero.breadcrumb }]}
          title={page.hero.title}
          lead={page.hero.lead}
        />
        <CasesCatalog
          cases={cases.map(({ id, title, slug, metric, before, after, result, task, done }) => ({
            id,
            title,
            slug,
            metric,
            before,
            after,
            result,
            task,
            done,
          }))}
          groups={groups}
          allLabel={page.filters.allLabel}
          labels={page.card.labels}
          results={page.results}
        />
      </div>
    </main>
  )
}
