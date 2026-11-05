import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { CaseIntro } from '@/components/cases/CaseIntro'
import { CaseNext } from '@/components/cases/CaseNext'
import { CaseStory } from '@/components/cases/CaseStory'
import { ROUTES } from '@/lib/navigation'
import { getPageGlobal } from '@/lib/queries'
import { getCatalogCases } from '../queries'
import styles from './page.module.css'

type Props = { params: Promise<{ slug: string }> }

export async function generateStaticParams() {
  const cases = await getCatalogCases()
  return cases.map(({ slug }) => ({ slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const item = (await getCatalogCases()).find((doc) => doc.slug === slug)
  if (!item) return {}
  return {
    title: item.seo.metaTitle,
    description: item.seo.metaDescription,
    alternates: { canonical: `${ROUTES.cases}/${slug}` },
  }
}

export default async function CasePage({ params }: Props) {
  const { slug } = await params
  const [cases, page] = await Promise.all([
    getCatalogCases(),
    getPageGlobal('cases-page', ['hero', 'casePage']),
  ])

  const index = cases.findIndex((doc) => doc.slug === slug)
  if (index === -1) notFound()

  const item = cases[index]
  // За последним кейсом снова идёт первый
  const next = cases.length > 1 ? cases[(index + 1) % cases.length] : null
  const { hero, casePage: labels } = page

  return (
    <main className={styles.page}>
      <CaseIntro
        crumbs={[{ label: hero.breadcrumb, href: ROUTES.cases }, { label: item.breadcrumb }]}
        title={item.pageTitle}
        tags={item.tags}
        tagsInHead={item.tagsInHead}
        facts={[
          { label: labels.companyLabel, value: item.company },
          { label: labels.industryLabel, value: item.industry },
          { label: labels.configurationLabel, value: item.configuration },
          { label: labels.termLabel, value: item.term },
        ]}
        changes={item.changes}
        labels={{
          table: labels.tableLabel,
          before: labels.beforeLabel,
          after: labels.afterLabel,
        }}
      />

      <CaseStory
        task={item.storyTask}
        solution={item.storySolution}
        results={item.results}
        labels={{
          task: labels.taskTitle,
          solution: labels.solutionTitle,
          result: labels.resultTitle,
        }}
      />

      <CaseNext
        tags={item.tags}
        next={
          next && {
            title: next.pageTitle,
            summary: next.nextSummary,
            href: `${ROUTES.cases}/${next.slug}`,
          }
        }
        labels={{
          tags: labels.tagsLabel,
          all: labels.allLabel,
          caption: labels.nextCaption,
          button: labels.nextButton,
        }}
      />
    </main>
  )
}
